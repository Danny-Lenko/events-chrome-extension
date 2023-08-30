import {GoogleMeetFetchInterface} from "../types/googleMeetInterfaces";
import {MeetingsData} from "../types/googleMeetTypes";
import {ServiceDecorator} from "../../../core/decorators/ServiceDecorator";

@ServiceDecorator
export class GoogleMeetFetchService implements GoogleMeetFetchInterface {

    constructor() {}

    // -------------------- fetch meeting data -----------------------------
    public async fetchData(): Promise<MeetingsData> {
        try {
            const response = await fetch(`${process.env.DB_HOST}/meet`); // винести у змінну середовища
            if (!response.ok) {
                throw new Error('Request failed with status: ' + response.status);
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    public getMock(): MeetingsData {
        return {
          participants: [
            {
              participantName: "Libertarian Personalist",
              participantRole: "lead",
              assignedTo: [
                'Daily meet up',
                'Refinement call',
              ],
            },
            {
              participantName: "Termin ScheduleApp",
              participantRole: "participant",
              assignedTo: [
                'Daily meet up',
                'Refinement call',
              ],
            },
            {
              participantName: "Кіріл",
              participantRole: "participant",
              assignedTo: [
                'Daily meet up',
                'Refinement call',
              ],
            },
            {
              participantName: "Samsung A32",
              participantRole: "participant",
              assignedTo: [
                'Daily meet up',
                'Refinement call',
              ],
            },
            {
              participantName: "Yuriy Motrych",
              participantRole: "participant",
              assignedTo: [
                'Daily meet up',
                'Refinement call',
              ],
            },
          ],
          googlemeetRules: {
            '12:00': {
              title: 'Refinement call',
              rules: {
                autoJoinParticipantsQuantity: 0,
                leaveTogetherWithMyGuys: {
                  isTurnOn: false,
                  guys: ["Iex Cept", "Yuriy Motrych"],
                  // leaveWhen may be "all" or "one" or "60%"
                  leaveWhen: "all"
                },
                // may be false or true
                fullscreenOnJoin: false,
                // may be in range from 0 to 1 (+)
                percentageToLeave: 0,
                // may be false or true
                joinWithCameraOff: false,
                // may be false or true (+)
                keepTabActive: false,
                // zoom may be "off" or "on" or "force"
                zoom: "off",
                // may be false or true
                showSubtitlesWhenZoomed: true,
              }
            },
            '14:15': {
              title: 'Daily meet up',
              rules: {
                // must be a number (+)
                autoJoinParticipantsQuantity: 1,
                leaveTogetherWithMyGuys: {
                  // may be false or true (+)
                  isTurnOn: true,
                  guys: ["Libertarian Personalist", "Termin ScheduleApp"],
                  // leaveWhen may be "all" or "one" or "some%" (+)
                  leaveWhen: "one"
                },
                // may be false or true (+)
                fullscreenOnJoin: true,
                // may be in range from 0 to 1 (+)
                percentageToLeave: 0.73,
                // may be false or true
                joinWithCameraOff: false,
                // may be false or true (+)
                keepTabActive: true,
                // zoom may be "off" or "on" or "forced" (+)
                zoom: "on",
                // may be false or true (+)
                showSubtitlesWhenZoomed: true,
              }
            },
          },
        }
    }
}
