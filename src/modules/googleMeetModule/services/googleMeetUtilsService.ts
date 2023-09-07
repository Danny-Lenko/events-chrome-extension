import { GoogleMeetUtilsInterface } from "../types/googleMeetInterfaces";

export class GoogleMeetUtilsService implements GoogleMeetUtilsInterface {

    constructor() {
    }

    public convertTimeWithZero = (time: Date) => `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}`

    public leadToGeneral = (name: string) => name.replace(/(\n.*|\([^)]*\)|^\s+)/g, '')

    public leadsNoLeads = (list) => {
      const leads = []
      const noLeads = []

      for (let i = 0; i < list.length; i++) {
        list[i].participantRole === 'lead'
          ? leads.push(list[i].participantName)
          : noLeads.push(list[i].participantName)
      }

      return {
        leads,
        noLeads
      }
    }

    public myRole = (exitConfigList) => {
      if (!exitConfigList) return console.warn('Don\'t save in exitConfigList !')
      const participants = document.querySelectorAll('.dkjMxf')
      const me = participants[participants.length - 1]
      const myName = (me.querySelector('.XEazBc span div') as HTMLDivElement).outerText

      const isGuest = exitConfigList.filter((p) => p.participantName === myName)

      return isGuest.length === 0 ? 'participant' : isGuest[0].participantRole
    }

    public clickAndWait = async(element, delay) => {
      element.click();
      await new Promise(resolve => setTimeout(resolve, delay));
    }

    public delay = (executeFn, delay) => {
      return setTimeout(() => {
        executeFn()
      }, delay)
    }

    public onSubtitles = async () => {
      const settingsMenu = document.querySelectorAll('[jsname="NakZHc"]')[1];
      await this.clickAndWait(settingsMenu, 0);

      const settingsWindow = document.querySelector('[jsname="dq27Te"]');
      await this.clickAndWait(settingsWindow, 2000);

      const subtitlesOptions = document.querySelectorAll('[jsname="IDf7eb"]');
      const subtitlesOption = subtitlesOptions[subtitlesOptions.length - 2].querySelector('span button')
      await this.clickAndWait(subtitlesOption, 500);

      const checkBox = document.querySelector('[jsname="BfMHN"]');
      await this.clickAndWait(checkBox, 0);

      const close = document.querySelector('.VfPpkd-Bz112c-LgbsSe.yHy1rc.eT1oJ.mN1ivc.VfPpkd-zMU9ub');
      await this.clickAndWait(close, 0);
    }

    public  disableParticipants = async (participantsBtn, disabledParticipants) => {
      if (!disabledParticipants) {
        disabledParticipants = true

        await this.clickAndWait(participantsBtn, 4000)
        participantsBtn.disabled = disabledParticipants

        const closeBlock = document.querySelectorAll('.CYZUZd div')[1]
        const close: HTMLButtonElement = closeBlock.querySelector('span button')
        close.disabled = disabledParticipants
      }
    }

    public handleManyClick = (element: HTMLElement, clickQty: number, func: Function): boolean => {
      let throttle = false
      element.addEventListener('click', function (e) {
        if (!throttle && e.detail === clickQty) {
          throttle = true
          func()
          setTimeout(function () {
            throttle = false
            element.removeEventListener('click', this)
          }, 100);
        }
      })

      return throttle
    }

}
