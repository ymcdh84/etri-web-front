import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/assetListSetting",
      name: "assetListSetting",
      component: () => import("./views/AssetListSetting.vue"),
    },
    {
      path: "/",
      name: "main",
      component: () => import("./views/MyMain.vue"),
    },

    {
      path: "/authMng",
      name: "authMng",
      component: () => import("./views/AuthMng.vue"),
    },
    {
      path: "/pgmMng",
      name: "pgmMng",
      component: () => import("./views/PgmMng.vue"),
    },
    {
      path: "/codeMng",
      name: "codeMng",
      component: () => import("./views/CodeMng.vue"),
    },
    {
      path: "/login",
      name: "Login",
      props: true,
      component: () => import("./components/Login.vue"),
    },
    {
      path: "/oauth/new",
      name: "OAuthNewUser",
      props: true,
      component: () => import("./components/OAuthNewUser.vue"),
    },
    {
      path: "/template1",
      name: "template1",
      component: () => import("./views/template1.vue"),
    },
    {
      path: "/userMng",
      name: "userMng",
      component: () => import("./views/UserMng.vue"),
    },
    //여기서 부터가 추가(2021.07.07)
    {
      path: "/equipmentDetail/:assetId",
      name: "equipmentDetail",
      props: (route) => {
        return {
          assetId: route.params.assetId,
        };
      },
      component: () => import("./views/EquipmentDetail.vue"),
    },
    {
      path: "/dashboard",
      name: "dashboard",
      component: () => import("./views/VisualizedBoard.vue"),
    },
    {
      path: "/siteMng",
      name: "siteMng",
      component: () => import("./views/SiteMng.vue"),
    },
    {
      path: "/kafkaTopicMng",
      name: "kafkaTopicMng",
      component: () => import("./views/KafkaTopicMng.vue"),
    },
    {
      path: "/tagCondSch",
      name: "tagCondSch",
      component: () => import("./views/TagCondSch.vue"),
    },
    {
      path: "/alarmCondSch",
      name: "alarmCondSch",
      component: () => import("./views/AlarmCondSch.vue"),
    },
    {
      path: "/assetMng",
      name: "assetMng",
      component: () => import("./views/AssetMng.vue"),
    },
    {
      path: "/dashboardMng",
      name: "dashboardMng",
      component: () => import("./views/DashboardMng.vue"),
    },
    {
      path: "/learningDataMng",
      name: "learningDataMng",
      component: () => import("./views/LearningDataMng.vue"),
    },    
  ],
});
