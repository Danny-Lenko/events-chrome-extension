import { GoogleMeetChromeStorageInterface } from "../types/googleMeetInterfaces";
import {MeetingsData, Participant} from "../types/googleMeetTypes";
import {GoogleMeetTopics} from "../googleMeetConsts";

export class GoogleMeetChromeStorageService implements GoogleMeetChromeStorageInterface {

    constructor() {
    }

    // ------------- get meeting data and save to chrome.storage --------------

    public getMeetingsData = async (title: GoogleMeetTopics[number], meetingsData: MeetingsData, exitConfigList: Omit<Participant, 'assignedTo'>[]) => {
        exitConfigList = this.setMeetingConfigList(title, meetingsData);
        this.setMeetingsData(meetingsData);
        return exitConfigList
    };

    private setMeetingsData = (data: MeetingsData) => {
        chrome.storage.local.set({ meetingsData: data }, () => {
            console.log('Meetings data saved to chrome.storage', data);
        });
    };

// -------------------- meeting config -----------------------------

    private setMeetingConfigList = (meetTitle: GoogleMeetTopics[number], currentMeetingData: MeetingsData) => {
        if (currentMeetingData.participants.length) {
            return currentMeetingData.participants
                .filter((item) => item.assignedTo.includes(meetTitle))
                .map((item) => {
                    return {
                        participantName: item.participantName,
                        participantRole: item.participantRole,
                    }
                });
        }
    };

}