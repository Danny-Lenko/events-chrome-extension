
export type GoogleMeetTopics = [
  'Daily meet up',
  'Refinement call'
]

export interface MeetTopic {
  title: string,
    rules: {
    // must be a number (+)
    autoJoinParticipantsQuantity: number,
      leaveTogetherWithMyGuys: {
      // may be false or true (+)
      isTurnOn: boolean,
      guys: string[],
      // leaveWhen may be "all" or "one" or "some%" (+)
      leaveWhen: string
    },
    // may be false or true (+)
    fullscreenOnJoin: boolean,
    // may be in range from 0 to 1 (+)
    percentageToLeave: number,
    // may be false or true
    joinWithCameraOff: boolean,
    // may be false or true
    keepTabActive: boolean,
    // zoom may be "off" or "on" or "forced" (+)
    zoom: string,
    // may be false or true (+)
    showSubtitlesWhenZoomed: boolean,
  },
}
export interface Participant {
    participantName: string,
    participantRole: string,
    assignedTo: GoogleMeetTopics,
}

export type GoogleMeetRules = Record<string, MeetTopic>

export interface MeetingsData {
    participants: Participant[]
    googlemeetRules: GoogleMeetRules,
}

export type currentMeetingTitleType = GoogleMeetTopics[number] | 'Topic is absent'

export type exitConfigListType = Omit<Participant, 'assignedTo'>[] | []

export type dataTypeMainService = {
  meetingsData: MeetingsData | boolean,
  currentMeetingTitle: currentMeetingTitleType,
  exitConfigList: exitConfigListType,
}

export type meetParticipantsTypeMainService = {
  maxPartyQty: number
  previousPartyQty: number
  party: string[]
  guests: string[]
}
