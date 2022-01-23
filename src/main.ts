import { Client } from 'discord-rpc';
import {
    clientId,
    interval,
} from './constants';
import { createActivity } from './utility/utility';
import { ErrorHandler } from './utility/ErrorHandler';
import { Log } from './utility/Log';
import { setTimeout } from 'node:timers/promises';
import activities from '../activities.json';

process.on('exit', code => {
    Log.log(`Exiting with code ${code}`);
});

const {
    activity: { resumeAfter },
    addActivityError,
    addConnectionError,
} = new ErrorHandler();

let client = new Client({ transport: 'ipc' });
let connected = false;
let index = 0;

(async () => {
    await login();

    client.on('disconnected', async () => {
        connected = false;
        Log.log('RPC disconnected, trying to reconnect...');
        await login();
    });

    if (activities.length === 1) {
        await setActivity();
    } else if (activities.length > 1) {
        while (true) {
            await setActivity(); //eslint-disable-line no-await-in-loop
            await setTimeout(interval); //eslint-disable-line no-await-in-loop
        }
    }
})();

async function login() {
    try {
        client = new Client({ transport: 'ipc' });
        await client.login({ clientId: clientId });
        connected = true;
        Log.log(`Logged into RPC as ${client.user.username}#${client.user.discriminator}`);
    } catch (error) {
        const timeout = addConnectionError();
        Log.log(`Failed to login, waiting ${timeout}ms before trying again |`, error);
        await setTimeout(timeout);
        Log.log('Trying to login...');
        await login();
    }
}

async function setActivity() {
    const activity = createActivity(index);

    if (
        resumeAfter > Date.now() ||
        connected === false
    ) {
        return;
    }

    try {
        await client.setActivity(activity);
    } catch (error) {
        Log.log('Failed to update RPC |', error);
        addActivityError();
        return;
    }

    index += 1;
    if (index >= activities.length) {
        index = 0;
    }
}