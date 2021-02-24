import jwtDecode from 'jwt-decode';
import axios from 'axios';
import keytar from 'keytar';
import os from 'os';
import {refreshUri, tokenUri} from '../../env-variables.json';
import { URL, URLSearchParams } from 'url';

const keytarService = 'fidibumsikeypad';
const keytarAccount = os.userInfo().username;

let accessToken = null;
let profile = null;

export function getAccessToken() {
    return accessToken;
}

export function getProfile() {
    return profile;
}

export async function refreshTokens() {
    const refreshToken = await keytar.getPassword(keytarService, keytarAccount);

    if (refreshToken) {
        const refreshOptions = {
            method: "POST",
            url: refreshUri,
            headers: {
                "content-type": "application/json",
                "Authorization": "Bearer " + refreshToken,
            },
        }

        try {
            const response = await axios(refreshOptions);

            accessToken = response.data.token;
            profile = jwtDecode(accessToken);

            await keytar.setPassword(keytarService, keytarAccount, accessToken);

            return accessToken;
        } catch (error) {
            console.error(error);
            await logout();

            throw error;
        }
    }

    throw new Error("Unauthenticated");
}

export async function loadTokens(callbackUrl) {
    const urlObject = new URL(callbackUrl);
    const query = urlObject.searchParams;

    if (query.has('error')) {
        const error = new Error(query.get('error_description'));
        error.type = query.get('error');
        error.uri = query.get('error_uri');
        throw error;
    }

    const queryData = new URLSearchParams({
        authorizationCode: query.get('code'),
    });

    const options = {
        method: "POST",
        url: tokenUri,
        headers: {
            "content-type": "application/x-www-form-urlencoded",
        },
        data: queryData,
    };

    try {
        const response = await axios(options);

        accessToken = response.data.token;
        profile = jwtDecode(accessToken);

        await keytar.setPassword(keytarService, keytarAccount, accessToken);

        return accessToken;
    } catch (error) {
        console.log(error);

        await logout();
        throw error;
    }
}

export async function logout() {
    await keytar.deletePassword(keytarService, keytarAccount);
    accessToken = null;
    profile = null;
}