import {
    activityErrorTimeout,
    connectionErrorTimeout,
} from '../constants';
import {
    clearTimeout,
    setTimeout,
} from 'node:timers';

export class ErrorHandler {
    activity: {
        clearTimeout: number | undefined;
        timeout: number;
        resumeAfter: number;
    };

    connection: {
        clearTimeout: number | undefined;
        timeout: number;
    };

    constructor() {
        this.activity = {
            clearTimeout: undefined,
            timeout: 0,
            resumeAfter: 0,
        };

        this.connection = {
            clearTimeout: undefined,
            timeout: 0,
        };
    }

    addActivityError() {
        const activity = this.activity;
        activity.resumeAfter = Date.now() + activity.timeout;

        activity.timeout += activityErrorTimeout;

        if (activity.clearTimeout) {
            clearTimeout(activity.clearTimeout);
        }

        activity.clearTimeout = setTimeout(() => {
            activity.timeout = 0;
        }, activity.timeout + 30_000) as unknown as number;
    }

    addConnectionError(): number {
        const connection = this.connection;

        connection.timeout += connectionErrorTimeout;

        if (connection.clearTimeout) {
            clearTimeout(connection.clearTimeout);
        }

        connection.clearTimeout = setTimeout(() => {
            connection.timeout = 0;
        }, connection.timeout + 30_000) as unknown as number;

        return connection.timeout;
    }
}