import {TypeURLs, UNCHANGEABLE} from "./coreInterfaces";
import { GoogleMeetModule } from "../modules/googleMeetModule/googleMeetModule";
import { GoogleCalendarModule } from "../modules/googleCalendarModule/googleCalendarModule";
import { MicroCalendarModule } from "../modules/microCalendarModule/microCalendarModule";
import { MicroMailModule } from "../modules/microMailModule/microMailModule";

export const URLs: UNCHANGEABLE<TypeURLs> = {
    [GoogleMeetModule.name]: "https://meet.google.com/*",
    [GoogleCalendarModule.name]: "https://*.google.com/calendar/*",
    [MicroCalendarModule.name]: "https://outlook.live.com/calendar/*",
    [MicroMailModule.name]: "https://outlook.live.com/mail/*",
}
