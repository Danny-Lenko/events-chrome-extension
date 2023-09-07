import {
  GoogleMeetDOMManipulationsInterface,
  GoogleMeetUtilsInterface
} from "../types/googleMeetInterfaces";
import {GoogleMeetUtilsService} from "./googleMeetUtilsService";

export class GoogleMeetDOMManipulationsService implements GoogleMeetDOMManipulationsInterface {
  private readonly outerControllerID = 'outer-controller-camera'
  private readonly conditionParams = {
    isCameraHandleRunning: false
  }

  constructor(
    public UtilsService: GoogleMeetUtilsInterface = new GoogleMeetUtilsService(),
  ) {}

  public manageSubtitles = () => {
    const subtitles: HTMLDivElement = document.querySelector('[jsaction="TpIHXe:c0270d;v2nhid:YHhXNc;kDAVge:lUFH9b;Z1rKi:s4fYDc;OoZzdf:s4fYDc"]')
    const sharedScreen = document.querySelectorAll('.tTdl5d')[0]
    const mainScreenBlock: HTMLDivElement = document.querySelector('[jsaction="rcuQ6b:NCu6M; contextmenu:gg8MLb;z5KiKd:qIXZdc;EnKPre:eGjA6d"]')

    subtitles.style.position = 'absolute'
    subtitles.style.top = window.getComputedStyle(sharedScreen).top
    mainScreenBlock.style.height += subtitles.style.height
    return true
  }

  public disableCamera = async (belowSectionWithBtnExtMeet) => {
      let isCameraOff = false

      const centerBlock = belowSectionWithBtnExtMeet?.querySelector('[jsname="vNB5le"]')
      const camera = centerBlock?.querySelector('div').children[1]
      const cameraBtn: HTMLButtonElement = camera?.querySelector('span button')

      const cameraUI = cameraBtn?.querySelectorAll('div')[2]

      const className = cameraUI?.getAttribute('class')
      const isCameraOn = className?.includes('HotEze')

      if (isCameraOn) {
        await this.UtilsService.delay(() => cameraBtn.click(), 0)
        await this.UtilsService.delay(() => cameraBtn.disabled = true, 0)
        isCameraOff = true
        await this.UtilsService.delay(() => this.outerTurningOverCameraBtn(cameraBtn), 0)
        await this.UtilsService.delay(() => this.turnOnOffCameraHandle(cameraBtn), 0)
      }

      return isCameraOff
  }

  private turnOnOffCameraHandle = (cameraBtn: HTMLButtonElement) => {
    if (this.conditionParams.isCameraHandleRunning) return

    this.conditionParams.isCameraHandleRunning = true
    const outer: HTMLElement = document.querySelector(`#${this.outerControllerID}`)

    cameraBtn && this.UtilsService.handleManyClick(outer, 3,async () => {
      await this.UtilsService.delay(() => cameraBtn.disabled = false, 0)
      await this.UtilsService.delay(() => cameraBtn.click(), 0)
      await this.UtilsService.delay(() => cameraBtn.disabled = true, 0)
    })

    this.UtilsService.delay(() => this.conditionParams.isCameraHandleRunning = false, 100)
  }

  private stylesCameraOuterHandle = (styles: Record<string, string | number>) =>
    Object.entries(styles).reduce((string, style) =>
      string + `${style[0]}: ${style[1]}; `, '')

  private outerTurningOverCameraBtn(cameraBtn: HTMLButtonElement) {
      const outer: HTMLElement = document.querySelector(`#${this.outerControllerID}`)
      if (outer) return

      const cameraStyle = window.getComputedStyle(cameraBtn)

      const styles = {
        position: 'absolute',
        top: 0,
        left: 0,
        width: cameraStyle.getPropertyValue('width'),
        height: cameraStyle.getPropertyValue('height'),
        ['z-index']: 1000,
      }

      const template =
        `<div style='${this.stylesCameraOuterHandle(styles)}' id=${this.outerControllerID}></div>`

      cameraBtn.style.position = 'relative'
      cameraBtn.innerHTML += template
  }

}
