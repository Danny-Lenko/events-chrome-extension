import {GoogleMeetFullScreenInterface, GoogleMeetUtilsInterface} from "../types/googleMeetInterfaces";
import {GoogleMeetUtilsService} from "./googleMeetUtilsService";


export class GoogleMeetFullScreenService implements GoogleMeetFullScreenInterface {

  constructor(
    public UtilsService: GoogleMeetUtilsInterface = new GoogleMeetUtilsService()
  ){}

  public enterFullScreenForParticipant = (isFullScreenEnabled, rules, exitFullScreen) => {
    if (!isFullScreenEnabled && rules.zoom !== 'off') {
      if (rules.zoom === 'forced') {
        chrome.runtime.sendMessage({ action: 'enterFullScreen' });
        return { isFullScreenEnabledAfter: true };
      } else if (rules.zoom === 'on' && !exitFullScreen) {
        chrome.runtime.sendMessage({ action: 'enterFullScreen' });
        return { isFullScreenEnabledAfter: true };
      }
    }
  };

  public checkScreenSharing = (sharedScreen, isScreenSharingActive, subtitlesOn, rules, isFullScreenEnabled, exitFullScreen) => {
    if (sharedScreen && !isScreenSharingActive) {
      const { isFullScreenEnabledAfter } = this.enterFullScreenForParticipant(isFullScreenEnabled, rules, exitFullScreen);
      if (!subtitlesOn && rules.showSubtitlesWhenZoomed) {
        this.UtilsService.delay(this.UtilsService.onSubtitles, 4000)
         return { subtitlesOn: true, isScreenSharingActive: true, isFullScreenEnabled: isFullScreenEnabledAfter }
      }
    }
  };

}
