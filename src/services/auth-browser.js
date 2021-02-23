import {BrowserWindow} from 'electron';
import { redirectUri, callbackUri } from '../../env-variables.json';
import {loadTokens} from './auth-service';

let win = null;

export function createAuthWindow() {
    destroyAuthWin();

    return new Promise((resolve, reject) => {
        win = new BrowserWindow({
            width: 1000,
            height: 600,
            webPreferences: {
                nodeIntegration: false,
                enableRemoteModule: false,
            }
        });

        win.loadURL(redirectUri);

        const { session: { webRequest } } = win.webContents;

        const filter = {
            urls: [
                callbackUri + '*'
            ],
        };

        webRequest.onBeforeRequest(filter, async ({ url }) => {
            try {
                resolve(await loadTokens(url));
            } catch (error) {
                reject(error);
            }
            //resolve(getAccessToken());
            return destroyAuthWin();
        });

        win.on('authenticated', () => {
            destroyAuthWin();
        });

        win.on('closed', () => {
            win = null;
        });
    });
}

function destroyAuthWin() {
    if (!win) {
        return;
    }

    win.close();
    win = null;
}