<template>
  <div>
    <!-- <form @submit.prevent="save">
      <div class="menu-head">
        <h3 class="float-start">시각화 대시보드</h3>
        <div class="float-end pt-2">
          <button
            type="button"
            class="btn btn-info btn-sm me-1"
            @click="goVisual"
          >
            <i class="fa fa-bar-chart"></i>
            데이터 탐색하기
          </button>
          <button
            type="button"
            class="btn btn-info btn-sm me-1"
            @click="goDashboardMng"
          >
            <i class="fa fa-exchange"></i>
            대시보드 변경하기
          </button>
        </div>
      </div>
    </form> -->
    <!-- iframe by Visual app -->
    <div class="">
      <iframe
        :src="visualSrc"
        width="100%"
        :height="windowHeight"
        frameborder="0"
      >
      </iframe>
    </div>
  </div>
</template>

<script>
import common from "@/mixin/common";

export default {
  mixins: [common],
  name: "VisualizedBoard",
  //components: { Tab, KafkaConnectTab },
  data() {
    return {
      title: "시각화 대시보드",
      data: [],
      username: this.$store.state.loginInfo.loginId,
      token: this.$store.state.loginInfo.token,
      dashboardId: "",
      frameHeight: window.innerHeight - 70,
      windowHeight: window.innerHeight - 62,
    };
  },
  // watch: {
  //   windowHeight(newHeight, oldHeight) {
  //     this.txt = `it changed to ${newHeight} from ${oldHeight}`;
  //   },
  // },
  computed: {
    visualSrc: {
      get: function () {
        var username = this.username;
        var token = this.token;
        //concat using template literal
        return (
          process.env.VUE_APP_VISUAL_URL +
          `/interface/dashboard-view/` +
          username +
          `/` +
          token +
          `/` +
          this.dashboardId
        );
      },
    },
  },
  methods: {
    goVisual() {
      // open new tab
      var username = this.$store.state.loginInfo.loginId;
      var token = this.$store.state.loginInfo.token;
      window.open(
        process.env.VUE_APP_VISUAL_URL + `/sso-login/` + username + `/` + token
      );
    },
    goDashboardMng() {
      // move to Dashboard management menu
      this.$router.push({ path: `/dashboardMng` });
    },
    getSavedDashboardId() {
      let apiUrl = "/api/interface/dashboard";
      this.$http
        .get(apiUrl)
        .then((response) => {
          this.dashboardId = response.data;
        })
        .finally(() => {
          this.$store.commit("finish");
        });
    },
    handleResize(event) {
      //this.width = window.innerWidth;
      console.log("handleResize----");
      this.windowHeight = window.innerHeight - 62;
    },
  },
  beforeMount() {
    this.getSavedDashboardId();
  },
  mounted() {
  },
  created() {
    // console.log("ready...");
      window.addEventListener("resize", this.handleResize);
  },
  beforeDestroy() {
    // console.log("beforeDestroy...");
    window.removeEventListener("resize", this.handleResize);
  },
};
</script>