import { isDate } from './utility';

export class Time {
    static cleanDate(ms: number | Date): string | null {
        const newDate = new Date(ms);
        if (
            ms < 0 ||
            !isDate(newDate)
        ) {
            return null;
        }

        const day = newDate.getDate(),
            month = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(
                newDate,
            ),
            year = newDate.getFullYear();
        return `${month} ${day}, ${year}`;
    }

    //Taken from https://stackoverflow.com/a/13016136 under CC BY-SA 3.0 matching ISO 8601
    static createOffset(date = new Date()): string {
        function pad(value: number) {
            return value < 10 ? `0${value}` : value;
        }

        const sign = date.getTimezoneOffset() > 0 ? '-' : '+',
            offset = Math.abs(date.getTimezoneOffset()),
            hours = pad(Math.floor(offset / 60)),
            minutes = pad(offset % 60);
        return `${sign + hours}:${minutes}`;
    }

    static formattedUnix({
        ms = Date.now(),
        date = false,
        utc = true,
    }: {
        ms?: number | Date;
        date: boolean;
        utc: boolean;
    }): string | null {
        const newDate = new Date(ms);
        if (
            ms < 0 ||
            !isDate(newDate)
        ) {
            return null;
        }

        return `${utc === true
            ? `UTC${this.createOffset()} `
            : ''}${
        newDate.toLocaleTimeString('en-IN', { hour12: true })
        }${date === true
            ? `, ${this.cleanDate(ms)}`
            : ''}`;
    }
}