import { logOptions } from '../constants';
import { Time } from './Time';

export class Log {
    static log(...text: unknown[]) {
        const time = Time.formattedUnix(logOptions);
        const base = `${time} |`;

        console.log(base, ...text);
    }
}