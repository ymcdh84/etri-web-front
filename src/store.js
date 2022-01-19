import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

export default new Vuex.Store({
    plugins: [createPersistedState()],
    state: {
        loginInfo: {
            userName: '',
            loginId: '',
            loginPw: '',
            loginCompCd: '',
            token: '',
            authorities: [],
            menus: [],
            colorThema:'',
        },
        locale: "ko",
        isLoading: false,
        oauthNew: '',
        searchParam: {
            dashBoard:{},
        },
        lotNo:'',
        offline: {
            speHData: [],
            speLimit: [],
            t2HData: [],
            t2Limit: [],
        },
        stage: '',
        tabList:[]
    },
    mutations: {
        login(state, loginInfo) {
            state.loginInfo = loginInfo;
        },
        logout(state) {
            state.loginInfo = null;
        },
        loading(state) {
            state.isLoading = true;
        },
        finish(state) {
            state.isLoading = false;
        },
        register(state, oauthNew) {
            state.oauthNew = oauthNew;
        },
        setLocale(state, locale) {
            state.locale = locale;
        },
        setParameter(state, obj) {
            var label = Object.keys(obj)[0];
            var data = Object.values(obj)[0];

            state.searchParam[label] = data;
        },
    },
});
