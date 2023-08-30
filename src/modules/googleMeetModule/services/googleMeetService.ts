import {
  GoogleMeetChromeStorageInterface,
  GoogleMeetConditionInterface,
  GoogleMeetEventRuleInterface,
  GoogleMeetFetchInterface,
  GoogleMeetFullScreenInterface,
  GoogleMeetInterface,
  GoogleMeetMainFunctionsInterface,
  GoogleMeetUtilsInterface,
} from "../types/googleMeetInterfaces";
import {
  currentMeetingTitleType,
  exitConfigListType,
  MeetingsData,
  MeetTopic,
} from "../types/googleMeetTypes";
import { GoogleMeetUtilsService } from "./googleMeetUtilsService";
import { GoogleMeetFetchService } from "./googleMeetFetchService";
import { GoogleMeetConditionService } from "./googleMeetConditionService";
import { GoogleMeetChromeStorageService } from "./googleMeetChromeStorageService";
import { ServiceDecorator } from "../../../core/decorators/ServiceDecorator";
import { GoogleMeetEventRuleService } from "./googleMeetEventRuleService";
import { GoogleMeetMainFunctionsService } from "./googleMeetMainFunctionsService";
import { GoogleMeetFullScreenService } from "./googleMeetFullScreenService";

@ServiceDecorator
export class GoogleMeetService implements GoogleMeetInterface {
  private rules: MeetTopic["rules"];

  private maxPartyQty: number = 0;
  private previousPartyQty: number = 0;

  private party: string[] = [];
  private guests: string[] = [];

  private leaveWithMyFriends: boolean | void = false;
  private disabledParticipants: boolean = false;
  private subtitlesOn: boolean = false;
  private controller: number = 0;
  private isMeeting: boolean = false;
  private exitFullScreen: boolean = false;

  private isFullScreenEnabled: boolean = false;
  private isScreenSharingActive: boolean = false;

  private meetingsData: MeetingsData | boolean = false;
  private currentMeetingTitle: currentMeetingTitleType;
  private exitConfigList: exitConfigListType;

  private readonly observerTargetNode: HTMLElement = document.body;
  private readonly observerConfig: Record<string, boolean> = {
    childList: true,
    subtree: true,
  };

  constructor(
    public FetchService: GoogleMeetFetchInterface = new GoogleMeetFetchService(),
    public ConditionService: GoogleMeetConditionInterface = new GoogleMeetConditionService(),
    public StorageService: GoogleMeetChromeStorageInterface = new GoogleMeetChromeStorageService(),
    public RuleService: GoogleMeetEventRuleInterface = new GoogleMeetEventRuleService(),
    public MainFunctionsService: GoogleMeetMainFunctionsInterface = new GoogleMeetMainFunctionsService(),
    public UtilsService: GoogleMeetUtilsInterface = new GoogleMeetUtilsService(),
    public FullScreenService: GoogleMeetFullScreenInterface = new GoogleMeetFullScreenService()
  ) {}

  private observer = new MutationObserver(() => {
    const goMessage = Array.from(
      document.getElementsByClassName("VfPpkd-gIZMF")
    );
    const redButton = document.querySelector('[jsname="CQylAd"]');
    const sharingNotice = document.getElementsByClassName("H0YpEc")[0];
    const participantsBtn = document.querySelectorAll('[jsname="A5il2e"]')[1];

    if (participantsBtn) {
      (async () => {
        await this.UtilsService.disableParticipants(
          participantsBtn,
          this.disabledParticipants
        );
      })();
    }

    // ---------------- fullscreen automatization ----------------
    const sharedScreenPeers = document.getElementsByClassName("P245vb");
    const sharedScreen =
      sharedScreenPeers && sharedScreenPeers.length > 1 && sharedScreenPeers[0];
    // ---------------- fullscreen automatization ----------------

    !this.meetingsData &&
      (async () => {
        this.meetingsData = await this.FetchService.fetchData();
        this.previousPartyQty = Object.values(
          (this.meetingsData as MeetingsData).googlemeetRules
        ).find(
          (m) => m.title === this.currentMeetingTitle
        )?.rules.autoJoinParticipantsQuantity;
      })();

    this.currentMeetingTitle = this.MainFunctionsService.getMeetTopic(
      this.meetingsData
    ); // function for processing meeting name depends on local time
    console.log(this.currentMeetingTitle, ` - Is meeting: ${this.isMeeting}`);

    this.rules =
      this.meetingsData &&
      Object.values((this.meetingsData as MeetingsData).googlemeetRules).find(
        (m) => m.title === this.currentMeetingTitle
      ).rules;

    if (this.rules?.keepTabActive && this.isMeeting) {
      chrome.runtime.sendMessage({ action: "keepTabActive" }); // there is a problem with moving to another tab when you are clicking and pressing mouse`s left button on tab which is not google meet, I added in background.js delay when the chrome event is checking moment of moving to another page, the event is called OnActivate
    }

    this.maxPartyQty = this.party.length;

    this.party = this.MainFunctionsService.getParty();
    console.log(this.party, "----------------------------> PARTY");
    !this.isMeeting && this.registerMeeting();

    if (this.isMeeting)
      this.StorageService.getMeetingsData(
        this.currentMeetingTitle,
        this.meetingsData,
        this.exitConfigList
      ); // get local storage data to exitConfigList

    const currentGuests = this.MainFunctionsService.guestsHandler(
      this.exitConfigList,
      this.party
    );

    if (!this.guests.length && currentGuests) {
      this.guests = this.MainFunctionsService.guestsHandler(
        this.exitConfigList,
        this.party
      );
    } else if (this.guests.length < currentGuests?.length) {
      this.guests = currentGuests;
    }

    this.leaveWithMyFriends = this.ConditionService.leaveWithMyFriendsHandle(
      this.meetingsData,
      this.rules,
      this.party
    );
    console.log(
      this.leaveWithMyFriends,
      "----------------------------------- > leaveWithMyFriends"
    );
    const checkExit = this.RuleService.checkIfConfigRule(
      this.currentMeetingTitle,
      this.exitConfigList,
      this.guests,
      this.party,
      this.rules.percentageToLeave
    );
    console.log(checkExit, "----------------------------------- > checkExit");
    (checkExit || this.party.length === 2) &&
      this.maxPartyQty < this.previousPartyQty &&
      this.ConditionService.exitMeeting(
        redButton,
        this.party,
        this.exitConfigList,
        this.isMeeting,
        this.controller
      );

    this.previousPartyQty = this.maxPartyQty;

    if (goMessage[0] || sharingNotice) {
      this.party = this.MainFunctionsService.getParty();
      setTimeout(() => {
        if (
          this.ConditionService.checkIfAlone(this.party) ||
          this.ConditionService.checkIfAloneAndScreenSharing(this.party)
        ) {
          this.ConditionService.exitMeeting(
            redButton,
            this.party,
            this.exitConfigList,
            this.isMeeting,
            this.controller
          );
        }
      }, 3000);
    }

    // ---------------- fullscreen automatization ----------------
    this.isFullScreenEnabled &&
      window.addEventListener("keydown", (e) => {
        if (e.key === "F11") this.exitFullScreen = true;
      });

    if (goMessage) {
      this.isFullScreenEnabled = false;
      this.isScreenSharingActive = false;
    }

    if (sharingNotice) {
      const { subtitlesOn, isScreenSharingActive, isFullScreenEnabled } =
        this.FullScreenService.checkScreenSharing(
          sharedScreen,
          this.isScreenSharingActive,
          this.subtitlesOn,
          this.rules,
          this.isFullScreenEnabled,
          this.exitFullScreen
        );

      this.subtitlesOn = subtitlesOn;
      this.isScreenSharingActive = isScreenSharingActive;
      this.isFullScreenEnabled = isFullScreenEnabled;
    }
    // ---------------- fullscreen automatization ----------------
  });

  public runObserve() {
    return this.observer.observe(this.observerTargetNode, this.observerConfig);
  }

  private registerMeeting = () => {
    if (!this.meetingsData) return console.warn("Data is loading");
    const participantsInMeeting =
      document.querySelectorAll('[jsname="YLEF4c"]').length - 1; // minus 1 because of div includes your personal account`s photo
    const joinBtn = document.querySelector(
      '[jsname="Qx7uuf"]'
    ) as HTMLButtonElement;

    const autoFullScreen = this.rules.fullscreenOnJoin;
    const autoJoin = this.rules.autoJoinParticipantsQuantity;

    if (participantsInMeeting >= autoJoin) {
      joinBtn.click();
      this.isMeeting = true;

      if (autoFullScreen) {
        chrome.runtime.sendMessage({ action: "enterFullScreenJoin" });
      }

      console.log("Meeting has started");
    }

    console.log("Meeting has not started");
  };
}
