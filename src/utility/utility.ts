import { activities } from '../../config.json';
import { interval } from '../constants';

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