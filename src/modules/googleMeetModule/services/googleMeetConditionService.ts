import {GoogleMeetConditionInterface, GoogleMeetUtilsInterface} from "../types/googleMeetInterfaces";
import {GoogleMeetUtilsService} from "./googleMeetUtilsService";

export class GoogleMeetConditionService implements GoogleMeetConditionInterface {

    constructor (
        public UtilsService: GoogleMeetUtilsInterface = new GoogleMeetUtilsService(),
    ) {}

    // ------------------------- exit rules ---------------------------

    public checkIfAlone = (party) => {
        return party?.length === 1;
    };

    public checkIfAloneAndScreenSharing = (party) => {
        return party?.length === 2 && party[0].includes(party[1]);
    }

    public conditionForTwoLeads (exitConfigList, party) {
        if (!exitConfigList) return
        const { leads } = this.UtilsService.leadsNoLeads(exitConfigList)
        const qtyOfLeads = party.filter(p => leads.includes(this.UtilsService.leadToGeneral(p))).length
        return qtyOfLeads === 2
    }

    public exitMeeting = (redButton, party, exitConfigList, isMeeting, controller) => {
        const role = this.UtilsService.myRole(exitConfigList)
        if (role === 'lead' && party.length !== 2) return
        if (party?.length === 2 && this.conditionForTwoLeads(exitConfigList, party)) return
        setTimeout(() => {
          if (controller < 1 && isMeeting) {
            controller++;
            redButton.click();
            setTimeout(() => {
              const terminalButton = document.getElementsByClassName("VfPpkd-LgbsSe")[2] as HTMLButtonElement;

              controller = 0;
              isMeeting = false;
              terminalButton.click();
            }, 1000);
          }
        }, 1000);
    }

    public leaveWithMyFriendsHandle(meetingsData, rules, party) {
        if(!meetingsData) return console.warn('Data is loading')
        if (!rules.leaveTogetherWithMyGuys.isTurnOn) return
        const friendsInMeetingCurrent = rules.leaveTogetherWithMyGuys.guys.filter((f) => !!party.find(p => p === f)).length
        const friendsInMeeting = rules.leaveTogetherWithMyGuys.guys.length
        const leaveWhen = rules.leaveTogetherWithMyGuys.leaveWhen
        return (
          leaveWhen === 'all'
            ? friendsInMeetingCurrent === 0
            : leaveWhen === 'one'
              ? friendsInMeetingCurrent <= 1
              : friendsInMeetingCurrent <= friendsInMeeting * Number.parseInt(leaveWhen)/100
        )
    }

}
