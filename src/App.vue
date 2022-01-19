<template>
    <div v-if="this.$store.state.loginInfo !== null && this.$store.state.token !== ''" class="wrap">
        <!-- header -->
        <Navbar v-show="$route.path.substr(0,7)!=='/mobile' && $route.path!=='/login'"/>
        <!-- //header -->

        <div id=app v-if="$route.path.substr(0,7)=='/mobile' || $route.path=='/login' || $route.path=='/'"  >
            <router-view :key="$route.fullPath"/>
        </div>

        <div id=app v-else>
            <!-- lnb -->
            <!-- <Menu/> -->
            <!-- //lnb -->
            <!-- contents -->

            <div class="contents">
                <!-- swiper-container -->
                <!-- <Swiper/> -->
                <!-- //swiper-container -->

                <!-- Main -->
                <router-view :key="$route.fullPath"/>
                <!-- Main -->
                <!-- <div class="footer">
                    © ILJIN ALL RIGHTS RESERVED.
                </div> -->
            </div>
        </div>
        <div class="vld-parent">
            <loading :active.sync="this.$store.state.isLoading" 
            :can-cancel="false" 
            :is-full-page="true"
            color="#6799FF"
            :opacity="0.1"></loading>
        </div>
        <!-- //contents -->
    </div>
    <div v-else>
        <Login/>
        <div class="vld-parent">
            <loading :active.sync="this.$store.state.isLoading" 
            :can-cancel="false" 
            :is-full-page="true"
            color="#6799FF"
            :opacity="0.1"></loading>
        </div>
    </div>
</template>

<script>
    import Navbar from "@/components/Navbar2.vue";
    import Menu from "@/components/Menu.vue";
    import Login from "@/components/Login3.vue";
    import MyMain from "@/views/MyMain.vue";
    import router from './router';
    
    // Import component
    import Loading from 'vue-loading-overlay';
    
    // Import stylesheet
    import 'vue-loading-overlay/dist/vue-loading.css';

    import {LicenseManager} from "ag-grid-enterprise";
    LicenseManager.setLicenseKey("CompanyName=iljin cns,LicensedApplication=ijcns,LicenseType=SingleApplication,LicensedConcurrentDeveloperCount=1,LicensedProductionInstancesCount=0,AssetReference=AG-013981,ExpiryDate=3_March_2022_[v2]_MTY0NjI2NTYwMDAwMA==79ca3f5c5621088302aec8ce6faf7207");    

    export default {
        name: "App",
        components: {Navbar, Menu, Login, MyMain, Loading},
        methods: {
            serverSessionCheck() {

            },
        },
        data() {
            return {
                isOpen: true,
                route: router,
                isLoading: false
            };

        },
        created() {
            if (!Array.prototype.filter) {
                Array.prototype.filter = function (func, thisArg) {
                    'use strict';
                    if (!((typeof func === 'Function' || typeof func === 'function') && this))
                        throw new TypeError();

                    var len = this.length >>> 0,
                        res = new Array(len), // preallocate array
                        t = this, c = 0, i = -1;

                    if (thisArg === undefined) {
                        while (++i !== len) {
                            // checks to see if the key was set
                            if (i in this) {
                                if (func(t[i], i, t)) {
                                    res[c++] = t[i];
                                }
                            }
                        }
                    } else {
                        while (++i !== len) {
                            // checks to see if the key was set
                            if (i in this) {
                                if (func.call(thisArg, t[i], i, t)) {
                                    res[c++] = t[i];
                                }
                            }
                        }
                    }

                    res.length = c; // shrink down array to proper size
                    return res;
                };
            }

            this.$http.defaults.headers['x-auth-token'] = this.$store.state.loginInfo.token;
            // server session check
            this.$http.get('/').catch((ex) => {
                this.$store.commit('logout');
                this.$cookie.delete('loginInfo');
            })

            if (this.$cookie.get('loginInfo') !== null) {
                this.$store.commit('login', JSON.parse(this.$cookie.get('loginInfo')));

                const loginInfo = {};
                loginInfo.loginId = this.$store.state.loginInfo.loginId;
                loginInfo.token = this.$store.state.loginInfo.token;
                loginInfo.menu = this.$store.state.loginInfo.menu;
                loginInfo.authorities = this.$store.state.loginInfo.authorities;
                loginInfo.loginPw = 'Not Use';

                if(!this.$store.state.loginInfo.colorThema){
                    this.$store.state.loginInfo.colorThema = '/css/bootstrap_dark.css'
                }
                //21.09 컬러테마
                var link = document.createElement('link');
                link.rel ='stylesheet';
                link.href = this.$store.state.loginInfo.colorThema;
                document.head.appendChild(link);
            }
        },
        mounted() {
            // eslint-disable-next-line
            dhtmlx.image_path = "/dhtmlx/imgs/";
            // eslint-disable-next-line
            dhtmlXCalendarObject.prototype.langData.ko = {
                // date format
                dateformat: "%Y-%m-%d",
                // full names of months
                monthesFNames: [
                    "1월",
                    "2월",
                    "3월",
                    "4월",
                    "5월",
                    "6월",
                    "7월",
                    "8월",
                    "9월",
                    "10월",
                    "11월",
                    "12월"
                ],
                // short names of months
                monthesSNames: [
                    "1월",
                    "2월",
                    "3월",
                    "4월",
                    "5월",
                    "6월",
                    "7월",
                    "8월",
                    "9월",
                    "10월",
                    "11월",
                    "12월"
                ],
                // full names of days
                daysFNames: [
                    "일요일",
                    "월요일",
                    "화요일",
                    "수요일",
                    "목요일",
                    "금요일",
                    "토요일"
                ],
                // short names of days
                daysSNames: ["일", "월", "화", "수", "목", "금", "토"],
                // starting day of a week. Number from 1(Monday) to 7(Sunday)
                weekstart: 1,
                // the title of the week number column
                weekname: "주"
            };
            // eslint-disable-next-line
            dhtmlXCalendarObject.prototype.lang = "ko";

            //21.09 컬러테마
            if(!this.$store.state.loginInfo){
                var link = document.createElement('link');
                link.rel ='stylesheet';
                link.href = '/css/bootstrap_dark.css';
                document.head.appendChild(link);
            }

            this.$store.commit('finish');
        }
    };
</script>

<style>
</style>
