// import 'buefy/dist/buefy.css';
// import 'bulma-o-steps/bulma-steps.sass';
import Buefy from 'buefy';
import Vue from 'vue';
import VueCookie from 'vue-cookie';
import VueSweetalert2 from 'vue-sweetalert2';
import moment from 'moment';
import VueMomentJS from 'vue-momentjs';
import axios from 'axios';
import App from './App.vue';
import router from './router';
import store from './store';
import i18n from './i18n';

import './assets/common.scss'
import babelPolyfill from 'babel-polyfill'

moment.locale('ko')

Vue.prototype.$http = axios;
Vue.prototype.$http.defaults.baseURL = process.env.VUE_APP_API_URL;
Vue.prototype.$http.defaults.timeout = 30000;
Vue.prototype.$http.defaults.headers = {
  'Access-Control-Allow-Origin': '*',
  'Content-type': 'application/json',
};

Vue.use(Buefy);
Vue.use(VueSweetalert2);
Vue.use(VueCookie);
Vue.use(VueMomentJS, moment);

/**
 * Regist global components
 */
import SearchCctr from './components/SearchCctr.vue'
import SearchAccount from './components/SearchAccount.vue'
import SearchEmp from './components/SearchEmp.vue'
import SearchComp from './components/SearchComp.vue'
import {AgGridVue} from 'ag-grid-vue'
import {TheMask} from 'vue-the-mask'

Vue.component('SearchCctr', SearchCctr)
Vue.component('SearchAccount', SearchAccount)
Vue.component('SearchEmp', SearchEmp)
Vue.component('SearchComp', SearchComp)
Vue.component('AgGridVue', AgGridVue)
Vue.component('TheMask', TheMask)

/**
 * Integrate NumeralJS
 */
const numeral = require('numeral')

Vue.prototype.$numeral = numeral
/// Integrate NumeralJS

// filters
Vue.filter('number', (value) => value ? new Intl.NumberFormat().format(value.toString().replace(/\D/g, "") || 0) : value);
Vue.prototype.$filters = Vue.options.filters;

// Debug?
Vue.prototype.debug = (process.env.NODE_ENV === 'development')

import { _url as url } from './libs/join'

new Vue({
  router,
  store,
  i18n,
  render: h => h(App),
  created() {
    //console.log(this.$cookie.get('sessionAlive'));
    /**
     * HTTP Request Interceptor
     */
    this.$http.interceptors.request.use((config) => {

      /**
       * check current session alive.
       * using by browser cookie(life-time: session)
       */
      console.log(this.$cookie.get('sessionAlive'));
      if(this.$cookie.get('sessionAlive') === null) {
        //console.log(this.$cookie.get('sessionAlive'));
        console.log('this is null');
        this.$store.commit('logout');
        this.$cookie.delete('loginInfo');
      }
      
      /**
       * Session auto-injection
       */
      if (this.$store && this.$store.state && this.$store.state.loginInfo) {
        var session = this.$store.state.loginInfo
        /**
         * compCd가 없는 경우, 자동으로 Injection
         */
        switch (String(config.method || '').toLowerCase()) {
          case 'get':
          case 'delete':
            if (config.params !== undefined && typeof config.params === 'object' && !config.params.compCd) {
              config.params.compCd = session.compCd
            }
            break
          //case 'post':
          case 'put':
            if (config.data !== undefined && typeof config.data === 'object' && !config.data.compCd) {
              config.data.compCd = session.compCd
            }
            break
        }
      }
      return config
    })

    this.$http.interceptors.response.use(response => {
      
      return response
    }, error => {
      
      if (error.response && error.response.data && error.response.data.message) {
        
        if(error.response.data.status===403){
          this.$router.push({path: `/login`});
        }else{
          this.$swal({
            type: 'error',
            text: error.response.data.message
          })
        }
      }
      return Promise.reject(error)
    })
  }
}).$mount('#app');
