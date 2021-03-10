import Vue from 'vue'
import Vuex from 'vuex'

import axios from 'axios';

import { userinfoUri, snippetsBaseUri, guildsUri } from '../../env-variables.json'
import SerialFrontend from '../services/serial-frontend';
import ButtonConfiguration from '../keypad/ButtonConfiguration';

import createElectronStorePlugin from './electron-store-plugin';

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        auth: {
            accessToken: null,
            state: 'unauthenticated',
            userInfo: null,
        },

        keypad: {
            actions: new ButtonConfiguration(),
        },

        snippets: {
            snippets: [],
            newSnippet: {
                file: null,
            }
        },

        guilds: {
            guilds: [],
        },

        serial: {
            connected: false,
            currentPort: null,
            ports: [],
            frontend: new SerialFrontend(),
        }
    },
    mutations: {
        setAccessToken(state, { accessToken }) {
            state.auth.accessToken = accessToken;
        },

        setAuthState(state, {authState}) {
            state.auth.state = authState;
        },

        setUserInfo(state, {userInfo}) {
            state.auth.userInfo = userInfo;
        },

        loadSnippets(state, {snippets}) {
            Vue.set(state.snippets, 'snippets', snippets);
        },

        selectSnippetFile(state, {file}) {
            state.snippets.newSnippet.file = file;
        },

        loadGuilds(state, {guilds}) {
            Vue.set(state.guilds, 'guilds', guilds);
        },

        loadSerialPorts(state, {ports}) {
            Vue.set(state.serial, 'ports', ports);
        },

        connectSerialPort(state, {connected, port = null}) {
            state.serial.connected = connected;
            state.serial.currentPort = port;
        },

        setKeypadAction(state, {action, config}) {
            state.keypad.actions.setConfig(action, config);
        },

        setKeypadActions(state, { actions }) {
            Vue.set(state.keypad, 'actions', actions);
        }
    },
    actions: {
        checkAvailableAccessToken({commit}) {
            commit('setAuthState', {authState: 'checking'});
            return window.ipcRenderer.invoke('authentication:refresh').then((accessToken) => {
                commit('setAccessToken', { accessToken });
                commit('setAuthState', { authState: 'authenticated' });

                return accessToken;
            }).catch((error) => {
                commit('setAccessToken', { accessToken: null });
                commit('setAuthState', { authState: 'unauthenticated' });
                throw error;
            });
        },

        login({commit}) {
            return window.ipcRenderer.invoke("authentication:start").then((accessToken) => {
                commit('setAccessToken', { accessToken });
                commit('setAuthState', { authState: 'authenticated' });
            }).catch((error) => {
                commit('setAccessToken', { accessToken: null });
                commit('setAuthState', { authState: 'unauthenticated' });
                throw error;
            });
        },

        logout({commit}) {
            return window.ipcRenderer.invoke('authentication:logout').then(() => {
                commit('setAccessToken', { accessToken: null });
                commit('setAuthState', { authState: 'unauthenticated' });
            });
        },

        loadUserInfo({state, commit}) {
            return axios({
                method: 'GET',
                url: userinfoUri,
                headers: {
                    "Authorization": "Bearer " + state.auth.accessToken,
                }
            }).then((response) => {
                commit('setUserInfo', {
                    userInfo: response.data,
                })
            });
        },

        loadSnippets({state, commit}) {
            return axios({
                method: 'GET',
                url: snippetsBaseUri,
                headers: {
                    "Authorization": "Bearer " + state.auth.accessToken,
                }
            }).then((response) => {
                commit('loadSnippets', {
                    snippets: response.data,
                });
            })
        },

        playSnippet({state}, {snippetId, guildId}) {
            return axios({
                method: 'POST',
                url: `${snippetsBaseUri}/${snippetId}/play`,
                headers: {
                    "Authorization": "Bearer " + state.auth.accessToken,
                },
                data: new URLSearchParams({ guildId }),
            })
        },

        createSnippet({ state, commit }) {
            if (state.snippets.newSnippet.file === null) {
                return Promise.reject();
            }

            let formData = new FormData();
            formData.append('snippet', state.snippets.newSnippet.file);

            return axios({
                method: 'POST',
                url: snippetsBaseUri,
                headers: {
                    "Authorization": "Bearer " + state.auth.accessToken,
                    'content-type': 'multipart/form-data'
                },
                data: formData,
            }).then((response) => {
                commit('selectSnippetFile', {file: null});
                return response;
            });
        },

        loadGuilds({ commit, state }) {
            return axios({
                method: 'GET',
                url: guildsUri,
                headers: {
                    "Authorization": "Bearer " + state.auth.accessToken,
                }
            }).then((response) => {
                commit('loadGuilds', {
                    guilds: response.data,
                });
            })
        },

        listSerialPorts({commit}) {
            return window.ipcRenderer.invoke('serial:list').then((ports) => {
                commit('loadSerialPorts', {ports});

                return ports;
            });
        }
    },
    modules: {
    },
    plugins: [createElectronStorePlugin()],
})
