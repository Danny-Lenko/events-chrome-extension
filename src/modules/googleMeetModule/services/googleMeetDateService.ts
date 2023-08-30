import {GoogleMeetDateInterface} from "../types/googleMeetInterfaces";

export class GoogleMeetDateService implements GoogleMeetDateInterface {

    constructor() {}

    public getLocaleTime(time, toLocaleString = true) {
        if (!time) return new Date().toLocaleString(undefined, {year: "numeric", month: "numeric", hour: 'numeric', minute: 'numeric'})
        const dateTimeFormat = new Intl.DateTimeFormat()
        const { timeZone } = dateTimeFormat.resolvedOptions()

        const [hours, minutes] = time.split(":")
        const currentDate = new Date()

        return ( toLocaleString ?
                new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), hours, minutes)
                    .toLocaleString(undefined, {year: "numeric", month: "numeric", hour: 'numeric', minute: 'numeric', timeZone})
                : new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), hours, minutes)
        )
    }

}