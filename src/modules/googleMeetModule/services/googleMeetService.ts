import {
  GoogleMeetChromeStorageInterface,
  GoogleMeetConditionInterface, GoogleMeetDOMManipulationsInterface,
  GoogleMeetEventRuleInterface,
  GoogleMeetFetchInterface, GoogleMeetFullScreenInterface,
  GoogleMeetInterface, GoogleMeetMainFunctionsInterface,
  GoogleMeetUtilsInterface
} from "../types/googleMeetInterfaces";
import {
  dataTypeMainService,
  MeetingsData, meetParticipantsTypeMainService, MeetTopic,
} from "../types/googleMeetTypes";
import {GoogleMeetUtilsService} from "./googleMeetUtilsService";
import {GoogleMeetFetchService} from "./googleMeetFetchService";
import {GoogleMeetConditionService} from "./googleMeetConditionService";
import {GoogleMeetChromeStorageService} from "./googleMeetChromeStorageService";
import {ServiceDecorator} from "../../../core/decorators/ServiceDecorator";
import {GoogleMeetEventRuleService} from "./googleMeetEventRuleService";
import {GoogleMeetMainFunctionsService} from "./googleMeetMainFunctionsService";
import {GoogleMeetFullScreenService} from "./googleMeetFullScreenService";
import {GoogleMeetDOMManipulationsService} from "./googleMeetDOMManipulationsService";

@ServiceDecorator
export class GoogleMeetService implements GoogleMeetInterface {
    private controller: number = 0;
    private rules: MeetTopic['rules'];

    private meetParticipantsParams: meetParticipantsTypeMainService = {
      maxPartyQty: 0,
      previousPartyQty: 0,
      party: [],
      guests: [],
    }
    private dataParams: dataTypeMainService = {
      meetingsData: false,
      currentMeetingTitle: "Topic is absent",
      exitConfigList: [],
    }
    private conditionParams = {
      leaveWithMyFriends: false,
      disabledParticipants: false,
      subtitlesOn: false,
      isCameraOff: false,
      isMeeting: false,
    }
    private fullScreenParams  = {
      exitFullScreen: false,
      isFullScreenEnabled: false,
      isScreenSharingActive: false,
      DOMSubtitlesChanged: false,
    }

    private readonly observerTargetNode: HTMLElement = document.body;
    private readonly observerConfig: Record<string, boolean> = {
        childList: true,
        subtree: true,
    };

    constructor (
        public FetchService: GoogleMeetFetchInterface = new GoogleMeetFetchService(),
        public ConditionService: GoogleMeetConditionInterface = new GoogleMeetConditionService(),
        public StorageService: GoogleMeetChromeStorageInterface = new GoogleMeetChromeStorageService(),
        public RuleService: GoogleMeetEventRuleInterface = new GoogleMeetEventRuleService(),
        public MainFunctionsService: GoogleMeetMainFunctionsInterface = new GoogleMeetMainFunctionsService(),
        public UtilsService: GoogleMeetUtilsInterface = new GoogleMeetUtilsService(),
        public FullScreenService: GoogleMeetFullScreenInterface = new GoogleMeetFullScreenService(),
        public DOMManipulationService: GoogleMeetDOMManipulationsInterface = new GoogleMeetDOMManipulationsService(),
    ) {}

    private observer = new MutationObserver( () => {
      const goMessage = Array.from(document.getElementsByClassName("VfPpkd-gIZMF"));
      const redButton = document.querySelector('[jsname="CQylAd"]');
      const sharingNotice = document.getElementsByClassName("H0YpEc")[0];
      const participantsBtn = document.querySelectorAll('[jsname="A5il2e"]')[1];
      const belowSectionWithBtnExtMeet = document.querySelector('[jsaction="rcuQ6b:Rayp9d;UNIyxe:JJR6ye"]');
      const sharedScreenPeers = document.getElementsByClassName("P245vb");
      const sharedScreen = sharedScreenPeers && sharedScreenPeers.length > 1 && sharedScreenPeers[0];

      if (belowSectionWithBtnExtMeet && this.rules?.joinWithCameraOff && !this.conditionParams.isCameraOff)
        (async () => { this.conditionParams.isCameraOff = await this.DOMManipulationService.disableCamera(belowSectionWithBtnExtMeet) })();

      if (participantsBtn) this.UtilsService.disableParticipants(participantsBtn, this.conditionParams.disabledParticipants)

      if (!this.dataParams.meetingsData) (async () => {
        this.dataParams.meetingsData = await this.FetchService.fetchData();
        this.meetParticipantsParams.previousPartyQty = Object.values((this.dataParams.meetingsData as MeetingsData).googlemeetRules).find(m => m.title === this.dataParams.currentMeetingTitle)?.rules.autoJoinParticipantsQuantity
      })();

      this.dataParams.currentMeetingTitle = this.MainFunctionsService.getMeetTopic(this.dataParams.meetingsData) // function for processing meeting name depends on local time

      console.log(this.dataParams.currentMeetingTitle, ` - Is meeting: ${this.conditionParams.isMeeting}`)

      this.rules = this.dataParams.meetingsData && Object.values((this.dataParams.meetingsData as MeetingsData).googlemeetRules).find(m => m.title === this.dataParams.currentMeetingTitle).rules

      if (this.rules?.keepTabActive && this.conditionParams.isMeeting) {
        chrome.runtime.sendMessage({ action: 'keepTabActive' }); // there is a problem with moving to another tab when you are clicking and pressing mouse`s left button on tab which is not google meet, I added in background.js delay when the chrome event is checking moment of moving to another page, the event is called OnActivate
      }

      this.meetParticipantsParams.maxPartyQty = this.meetParticipantsParams.party.length;

      this.meetParticipantsParams.party = this.MainFunctionsService.getParty()

      console.log(this.meetParticipantsParams.party, '----------------------------> PARTY')

      if (this.rules.autoJoinParticipantsQuantity === 0 && !participantsBtn) this.registerMeeting()
        else if (!this.conditionParams.isMeeting && this.rules.autoJoinParticipantsQuantity > 0) this.registerMeeting()

      if (this.conditionParams.isMeeting) this.StorageService.getMeetingsData(this.dataParams.currentMeetingTitle, this.dataParams.meetingsData, this.dataParams.exitConfigList) // get local storage data to exitConfigList

      const currentGuests = this.MainFunctionsService.guestsHandler(this.dataParams.exitConfigList, this.meetParticipantsParams.party)

      if (!this.meetParticipantsParams.guests.length && currentGuests) {
        this.meetParticipantsParams.guests = this.MainFunctionsService.guestsHandler(this.dataParams.exitConfigList, this.meetParticipantsParams.party);
      } else if (this.meetParticipantsParams.guests.length < currentGuests?.length) {
        this.meetParticipantsParams.guests = currentGuests
      }

      this.conditionParams.leaveWithMyFriends = Boolean(this.ConditionService.leaveWithMyFriendsHandle(this.dataParams.meetingsData, this.rules, this.meetParticipantsParams.party));

      //console.log(this.conditionParams.leaveWithMyFriends, '----------------------------------- > leaveWithMyFriends');

      const checkExit = this.RuleService.checkIfConfigRule(this.dataParams.currentMeetingTitle, this.dataParams.exitConfigList, this.meetParticipantsParams.guests, this.meetParticipantsParams.party, this.rules.percentageToLeave);

      //console.log(checkExit, '----------------------------------- > checkExit');

      ((checkExit || this.meetParticipantsParams.party.length === 2) && this.meetParticipantsParams.maxPartyQty < this.meetParticipantsParams.previousPartyQty) && this.ConditionService.exitMeeting(redButton, this.meetParticipantsParams.party, this.dataParams.exitConfigList, this.conditionParams.isMeeting, this.controller);

      this.meetParticipantsParams.previousPartyQty = this.meetParticipantsParams.maxPartyQty

      if (goMessage[0] || sharingNotice) {
        this.meetParticipantsParams.party = this.MainFunctionsService.getParty();
        setTimeout(() => {
          if (this.ConditionService.checkIfAlone(this.meetParticipantsParams.party) || this.ConditionService.checkIfAloneAndScreenSharing(this.meetParticipantsParams.party)) {
            this.ConditionService.exitMeeting(redButton, this.meetParticipantsParams.party, this.dataParams.exitConfigList, this.conditionParams.isMeeting, this.controller);
          }
        }, 3000);
      }

      // ---------------- fullscreen automatization ----------------
      this.fullScreenParams.isFullScreenEnabled && window.addEventListener('keydown', (e) => {
        if (e.key === 'F11') this.fullScreenParams.exitFullScreen = true
      })

      if (goMessage) {
        this.fullScreenParams.isFullScreenEnabled = false
        this.fullScreenParams.isScreenSharingActive = false
      }

      if (!sharingNotice && this.fullScreenParams.isScreenSharingActive) {
        chrome.runtime.sendMessage({ action: 'disableFullScreen' })
        this.fullScreenParams.isScreenSharingActive = false
      }

      if (sharingNotice) {
        const checkScreenSharing = this.FullScreenService.checkScreenSharing(sharedScreen, this.fullScreenParams.isScreenSharingActive, this.conditionParams.subtitlesOn, this.rules, this.fullScreenParams.isFullScreenEnabled, this.fullScreenParams.exitFullScreen)

        checkScreenSharing && (this.conditionParams.subtitlesOn = checkScreenSharing.subtitlesOn)
        checkScreenSharing && (this.fullScreenParams.isScreenSharingActive = checkScreenSharing.isScreenSharingActive)
        checkScreenSharing && (this.fullScreenParams.isFullScreenEnabled = checkScreenSharing.isFullScreenEnabled)
      }

      if (this.fullScreenParams.isFullScreenEnabled && this.fullScreenParams.isScreenSharingActive && !this.fullScreenParams.DOMSubtitlesChanged) this.fullScreenParams.DOMSubtitlesChanged = this.DOMManipulationService.manageSubtitles()

      // ---------------- fullscreen automatization ----------------
    })

    public runObserve() {
      return this.observer.observe(this.observerTargetNode, this.observerConfig)
    }

    private registerMeeting = () => {
      if (!this.dataParams.meetingsData) return console.warn('Data is loading')
      const participantsInMeeting = document.querySelectorAll('[jsname="YLEF4c"]').length - 1 // minus 1 because of div includes your personal account`s photo
      const joinBtn: HTMLButtonElement = document.querySelector('[jsname="Qx7uuf"]')

      const autoFullScreen = this.rules.fullscreenOnJoin
      const autoJoin = this.rules.autoJoinParticipantsQuantity;

      if (participantsInMeeting >= autoJoin) {
        joinBtn.click()
        this.conditionParams.isMeeting = true

        if (autoFullScreen) {
          chrome.runtime.sendMessage({ action: 'enterFullScreenJoin' })
        }

        console.log('Meeting has started')
      }

      console.log("Meeting has not started")
    }

}
