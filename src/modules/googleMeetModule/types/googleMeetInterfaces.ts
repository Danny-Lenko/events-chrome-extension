import {MeetingsData, MeetTopic, Participant} from "./googleMeetTypes";
import {currentMeetingTitleType, exitConfigListType, GoogleMeetTopics} from "./googleMeetTypes";
import {GeneralServiceInterface} from "../../../core/coreInterfaces";

export interface GoogleMeetInterface extends GeneralServiceInterface {
    runObserve(): void
}

export interface GoogleMeetDateInterface extends GeneralServiceInterface {
    getLocaleTime(time: string, toLocaleString?: boolean): Date | string
}

export interface GoogleMeetUtilsInterface extends GeneralServiceInterface {
    convertTimeWithZero(time: Date | string): string
    leadToGeneral(name: string): string
    leadsNoLeads(list: exitConfigListType): { leads: string[], noLeads: string[] }
    myRole(list: exitConfigListType)
    disableParticipants(participantsBtn: Element, disabledParticipants: boolean): void
    delay(executeFn: () => void, delay: number): void
    onSubtitles(): void
}

export interface GoogleMeetFetchInterface extends GeneralServiceInterface {
    fetchData(): Promise<MeetingsData>
    getMock(): void
}

export interface GoogleMeetConditionInterface extends GeneralServiceInterface {
    checkIfAlone(party: string[]): boolean
    checkIfAloneAndScreenSharing(party: string[]): boolean
    conditionForTwoLeads(exitConfigList: exitConfigListType, party: string[]): boolean
    exitMeeting(redButton: Element, party: string[], exitConfigList: exitConfigListType, isMeeting: boolean, controller: number): void
    leaveWithMyFriendsHandle(meetingsData: MeetingsData | boolean, rules: MeetTopic['rules'], party: string[]): void | boolean
}

export interface GoogleMeetEventRuleInterface extends GeneralServiceInterface {
    checkIfConfigRule(title: currentMeetingTitleType, exitConfigList: exitConfigListType, guests: string[], party: string[], percentageToLeave: number): boolean
    dailyMeetUpRule(title: currentMeetingTitleType, list: exitConfigListType, guests: string[], party: string[], percentageToLeave: number): boolean
    refinementCallRule(title: currentMeetingTitleType, list: exitConfigListType, party: string[]): boolean
}

export interface GoogleMeetChromeStorageInterface extends GeneralServiceInterface {
    getMeetingsData(title: GoogleMeetTopics[number] | 'Topic is absent', meetingsData: MeetingsData | boolean, exitConfigList: Omit<Participant, 'assignedTo'>[]): void
}

export interface GoogleMeetMainFunctionsInterface {
    getParty()
    guestsHandler(exitConfigList: exitConfigListType, party: string[]): string[]
    getMeetTopic(meetingsData: MeetingsData | boolean): currentMeetingTitleType
}

export interface GoogleMeetFullScreenInterface {
  enterFullScreenForParticipant(isFullScreenEnabled: boolean, rules: MeetTopic['rules'], exitFullScreen: boolean): {
    isFullScreenEnabledAfter: boolean
  }
  checkScreenSharing(sharedScreen, isScreenSharingActive, subtitlesOn, rules, isFullScreenEnabled, exitFullScreen): { subtitlesOn: boolean, isScreenSharingActive: boolean, isFullScreenEnabled: boolean }
}

export interface AllInterfaces {
    // interfaces needed to run module
    interfaces: {
        GoogleMeetInterface: GoogleMeetInterface,
    }
}
