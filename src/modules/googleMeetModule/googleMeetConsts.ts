
export const mockData = {
  participants: [
    {
      participantName: "Libertarian Personalist",
      participantRole: "lead",
      assignedTo: [
        'Daily meet up',
        'Refinement call',
      ],
    },
    {
      participantName: "Termin ScheduleApp",
      participantRole: "participant",
      assignedTo: [
        'Daily meet up',
        'Refinement call',
      ],
    },
    {
      participantName: "Кіріл",
      participantRole: "participant",
      assignedTo: [
        'Daily meet up',
        'Refinement call',
      ],
    },
    {
      participantName: "Samsung A32",
      participantRole: "participant",
      assignedTo: [
        'Daily meet up',
        'Refinement call',
      ],
    },
    {
      participantName: "Yuriy Motrych",
      participantRole: "participant",
      assignedTo: [
        'Daily meet up',
        'Refinement call',
      ],
    },
  ],
  googlemeetRules: {
    '12:00': {
      title: 'Refinement call',
      rules: {
        autoJoinParticipantsQuantity: 0,
        leaveTogetherWithMyGuys: {
          guys: ["Iex Cept", "Yuriy Motrych"],
          // leaveWhen may be "all" or "one" or "60%"
          leaveWhen: "all"
        },
        // may be false or true
        fullscreenOnJoin: false,
        percentageToLeave: 0,
        // may be false or true
        joinWithCameraOff: false,
        // may be false or true
        keepTabActive: false,
        // zoom may be "off" or "on" or "force"
        zoom: "off",
        // may be false or true
        showSubtitlesWhenZoomed: true,
      }
    },
    '14:15': {
      title: 'Daily meet up',
      rules: {
        // must be a number (+)
        autoJoinParticipantsQuantity: 1,
        leaveTogetherWithMyGuys: {
          // may be false or true (+)
          isTurnOn: true,
          guys: ["Libertarian Personalist", "Termin ScheduleApp"],
          // leaveWhen may be "all" or "one" or "some%" (+)
          leaveWhen: "one"
        },
        // may be false or true (+)
        fullscreenOnJoin: true,
        // may be in range from 0 to 1 (+)
        percentageToLeave: 0.73,
        // may be false or true
        joinWithCameraOff: true,
        // may be false or true
        keepTabActive: true,
        // zoom may be "off" or "on" or "forced" (+)
        zoom: "on",
        // may be false or true (+)
        showSubtitlesWhenZoomed: true,
      }
    },
  },
}
