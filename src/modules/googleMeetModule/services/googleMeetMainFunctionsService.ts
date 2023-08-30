import {currentMeetingTitleType, MeetingsData} from "../types/googleMeetTypes";
import {GoogleMeetTopics} from "../types/googleMeetTypes";
import {GoogleMeetMainFunctionsInterface, GoogleMeetUtilsInterface} from "../types/googleMeetInterfaces";
import {GoogleMeetUtilsService} from "./googleMeetUtilsService";
import {GoogleMeetDateService} from "./googleMeetDateService";


export class GoogleMeetMainFunctionsService implements GoogleMeetMainFunctionsInterface {

    constructor(
      public UtilsService: GoogleMeetUtilsInterface = new GoogleMeetUtilsService(),
      public DateService: GoogleMeetDateService = new GoogleMeetDateService(),
    ){}

    public getParty = () => {
        let teammateNames = [];
        // more than 3s participation
        teammateNames = Array.from(document.getElementsByClassName("XEazBc"));
        const checkLayout = document.querySelector('[jsname="jrQDbd"]');
        if (checkLayout) {
          teammateNames = Array.from(document.getElementsByClassName("jKwXVe"));
        }
        return !teammateNames.length ? teammateNames : teammateNames.map(item => (item as HTMLElement).outerText);

    }

    public guestsHandler = (exitConfigList, party) => {
        if (!exitConfigList) return
        const participants = exitConfigList.map((obj) => obj.participantName)
        return party.filter((p) => !participants.includes(this.UtilsService.leadToGeneral(p))).map((p) => this.UtilsService.leadToGeneral(p))
    }

    public getMeetTopic = (meetingsData): currentMeetingTitleType => {
        const startTimes = Object.keys((meetingsData as MeetingsData).googlemeetRules)
        const localeCurrentDate = new Date();
        const nextDayTime = new Date()
        nextDayTime.setDate(nextDayTime.getDate() + 1)

        let currentMeetingTopic = 'Topic is absent'

        for (let i = 0; i < startTimes.length; i++) {
          const firstMeetTime = this.DateService.getLocaleTime(startTimes[0], false)
          const secondMeetTime = this.DateService.getLocaleTime(startTimes[1], false)

          const currentTime = this.DateService.getLocaleTime(startTimes[i], false)
          const nextTime = !startTimes[i + 1] ? null : this.DateService.getLocaleTime(startTimes[i + 1])

          if (localeCurrentDate >= nextTime) continue

          if ((localeCurrentDate >= currentTime && (localeCurrentDate < nextTime || !nextTime))) {
            const time = this.UtilsService.convertTimeWithZero(currentTime)
            currentMeetingTopic = (meetingsData as MeetingsData).googlemeetRules[time].title
          } else if (nextDayTime > currentTime && (localeCurrentDate > firstMeetTime && localeCurrentDate < secondMeetTime)) {
            const firstMeetKey = startTimes[0]
            currentMeetingTopic = (meetingsData as MeetingsData).googlemeetRules[firstMeetKey].title
          } else {
            const lastMeetKey = startTimes[startTimes.length - 1]
            currentMeetingTopic = (meetingsData as MeetingsData).googlemeetRules[lastMeetKey].title
          }
      }

    return currentMeetingTopic as GoogleMeetTopics[number] | 'Topic is absent'
  }

}
