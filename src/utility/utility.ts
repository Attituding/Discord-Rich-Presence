import { interval } from '../constants';
import activities from '../activities.json';

export function createActivity(index: number) {
    return {
        ...activities[index],
        ...{
            endTimestamp: Date.now() + interval,
            partySize: index + 1,
            partyMax: activities.length,
        },
    };
}

export function isDate(value: unknown): value is Date {
    return Object.prototype.toString.call(value) === '[object Date]';
}