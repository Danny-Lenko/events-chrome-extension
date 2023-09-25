import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import knex from 'knex';
import dotenv from 'dotenv';
import fs from 'fs';

import { authorize } from './googleApiClient/googleApiClient.js';
import {
   listEvents,
   createDraftEmail,
   syncDbAndAggregatorAcc,
} from './controllers/googleApi.js';
import { addEvents } from './controllers/addEvents.js';
import { deleteEvent } from './controllers/deleteEvent.js';

dotenv.config();

const db = knex({
   client: 'pg',
   connection: {
      host: '127.0.0.1',
      // port : 3306,
      user: 'postgres',
      password: process.env.PG_PASSWORD,
      database: 'extension',
   },
});

db.select('*').from('events').then(console.log);

const app = express();
const port = 8080;

app.use(bodyParser.json());
app.use(cors());

let lastSyncTime = null;
let syncPending = false;
const syncInterval = 10000;

// LISTEN/NOTIFY implementation
const connection = await db.client.acquireConnection();
connection.query('LISTEN event_changes');
connection.on('notification', async (msg) => {
   synchronize();
});

// Throttling to prevent duplication
async function synchronize() {
   const now = Date.now();

   if (!lastSyncTime || now - lastSyncTime >= syncInterval) {
      lastSyncTime = now;
      syncPending = false;

      await syncDbAndAggregatorAcc(db);
   } else {
      syncPending = true;
      console.log('Synchronization pending due to throttling.');
   }
}

setInterval(async () => {
   if (syncPending) {
      await synchronize();
   }
}, syncInterval);

app.get('/', (req, res) => {
   res.send('Hello Uriy!');
});

app.get('/rules', (req, res) => {
   try {
      const configData = fs.readFileSync('config.json', 'utf-8');
      JSON.parse(configData);
      return res.status(200).json(configData);
   } catch (error) {
      console.error('Error loading configuration:', error);
      return {};
   }
});

app.post('/add-events', addEvents(db));
app.post('/error-ms-email', (req, res) => {
   const configData = fs.readFileSync('config.json', 'utf-8');

   try {
      authorize()
         .then((auth) => createDraftEmail(auth, configData))
         .catch(console.error);
      return res.status(200).json('Message sent');
   } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
   }
});

app.delete('/delete-event', deleteEvent(db));

app.listen(port, async () => {
   console.log(`extension api listening on port ${port}`);

   try {
      // Call the function to fetch and log admin events
      authorize().then(listEvents).catch(console.error);
   } catch (error) {
      console.error('Error fetching admin events:', error);
   }
});
