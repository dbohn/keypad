import Vue from 'vue'
import Vuex from 'vuex'

import axios from 'axios';

import {userinfoUri} from '../../env-variables.json'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        auth: {
            accessToken: null,
            state: 'unauthenticated',
            userInfo: null,
        },
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
        }
    },
    modules: {
    }
})
