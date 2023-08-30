import {
  GoogleMeetEventRuleInterface,
  GoogleMeetUtilsInterface
} from "../types/googleMeetInterfaces";
import {GoogleMeetUtilsService} from "./googleMeetUtilsService";

export class GoogleMeetEventRuleService implements GoogleMeetEventRuleInterface {

  constructor (
    public UtilsService: GoogleMeetUtilsInterface = new GoogleMeetUtilsService(),
  ) {}

  public checkIfConfigRule = (title, exitConfigList, guests, party, percentageToLeave) => {
    if (!exitConfigList) {
      return false
    }
    // noLeads has left more than 73%
    if (title === 'Daily meet up') return this.dailyMeetUpRule(title, exitConfigList, guests, party, percentageToLeave);

    // no participants from the required list
    if (title === 'Refinement call') return this.refinementCallRule(title, exitConfigList, party);
  }

  public dailyMeetUpRule = (title, list, guests, party, percentageToLeave) => {
    const { noLeads, leads } = this.UtilsService.leadsNoLeads(list)
    const guestQty = guests.length
    const maxRegisterNoLeads = noLeads.length + guestQty

    const currentNoLeads = party.filter((p) => !leads.includes(this.UtilsService.leadToGeneral(p))).length

    return currentNoLeads/maxRegisterNoLeads < 1 - percentageToLeave; // Share of current no lead participants from register
  }

  public refinementCallRule = (title, list, party) =>
    !list.filter(item => party.join(' ').includes(item.participantName)).length

}
