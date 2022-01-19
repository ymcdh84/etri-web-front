<template>
  <div class="inner-box">
    <form @submit.prevent="">
      <div class="menu-head">
        <h3 class="float-start fw-bolder">대시보드 관리</h3>
        <div class="float-end pt-2">
          <button
            type="button"
            class="btn btn-info btn-sm me-1"
            @click="searchDashboardList"
          >
            <i class="fa fa-search"></i>
            조회</button
          ><button
            type="button"
            class="btn btn-success btn-sm"
            @click="buttonClickEventSave()"
          >
            <i class="fas fa-save"></i>
            저장
          </button>
        </div>
      </div>
    </form>
    <div class="search-form">
      <div class="form-group">
        <label class="control-label">대시보드</label>
        <div class="form-input">
          <input
            type="text"
            class="input"
            v-model="searchKeyword"
            @keypress="handleKeyPress($event)"
          />
        </div>
      </div>
    </div>
    <div class="row">
      <div
        class="p-3 dashboard-item"
        style="max-width: 22.2rem; cursor: pointer"
        v-for="(dashboard, i) in dashboardList"
        :key="i"
        v-on:click="selectDashboard(dashboard.dashboardId)"
      >
        <div class="dashboard-item item-layout" :id="dashboard.dashboardId">
          <img src="img/dashboard-img.png" class="card-img-top" alt="..." />
          <div class="card-body bg-light">
            <h6 class="card-title">{{ dashboard.dashboardTitle }}</h6>
            <p style="fontsize: 15px; color: grey; margin: 0px">
              Last modified {{ dashboard.modifiedFrom }} ago
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import common from "@/mixin/common";

export default {
  mixins: [common],
  name: "DashboardMng",
  components: {},
  data() {
    return {
      title: "대시보드 관리",
      searchKeyword: "",
      dashboardList: [],
      dashboardIdList: [],
      selectedDashboardId: "",
      frameworkComponents: null,
      timeout: null,
    };
  },
  computed: {},
  methods: {
    handleKeyPress(event) {
      // eslint-disable-next-line no-console
      console.log("search dashboard with keyword...");
      if (event.key === "Enter") {
        this.searchDashboardList();
      }
    },
    buttonClickEventSave() {
      if (this.selectedDashboardId.length === 0) {
        this.$swal({
          type: "warning",
          text: "대시보드를 선택하고 진행하시기 바랍니다.",
        });
        return;
      }
      this.$swal({
        type: "info",
        text: `선택한 대시보드로 설정 하시겠습니까?`,
        showCancelButton: true,
        confirmButtonText: "예",
        cancelButtonText: "아니오",
      }).then((result) => {
        if (result.value) {
          let apiUrl = "/api/interface/dashboard";

          this.$store.commit("loading");

          this.$http
            .post(apiUrl, { dashboardId: this.selectedDashboardId })
            .then((response) => {
              // eslint-disable-next-line no-console
              console.log(response);
              // document
              //   .getElementById(this.selectedDashboardId)
              //   .classList.remove("selected");
              // this.selectedDashboardId = "";
              this.$swal({ type: "success", text: "저장되었습니다." });
            })
            .finally(() => {
              this.$store.commit("finish");
            });
        }
      });
    },
    searchDashboardList() {
      this.$store.commit("loading");
      return this.$http
        .post(
          process.env.VUE_APP_VISUAL_API_URL + "/api/interface/dashboards",
          {
            loginId: this.$store.state.loginInfo.loginId,
            token: this.$store.state.loginInfo.token,
            dashboardId: this.searchKeyword,
          }
        )
        .then((response) => {
          this.dashboardList = response.data;
          response.data.forEach((value) => {
            this.dashboardIdList.push(value.dashboardId);
          });
          if (response.data.length == 0) {
            this.$swal({
              type: "warning",
              text: "조회내역이 존재하지 않습니다.",
            });
          }
          this.selectedDashboardId = "";
        })
        .finally(() => {
          this.$store.commit("finish");
        });
    },
    selectDashboard(el) {
      this.dashboardIdList.forEach((id) => {
        if (id !== el) {
          document.getElementById(id).classList.remove("selected");
        }
      });
      this.selectedDashboardId = el;
      document.getElementById(el).classList.add("selected");
    },
    getMyDashboard() {
      let apiUrl = "/api/interface/dashboard";
      return this.$http
        .get(apiUrl)
        .then((response) => {
          this.selectedDashboardId = response.data;
        })
        .finally(() => {});
    },
    async bar() {
      await this.searchDashboardList();
      await this.getMyDashboard();
      document.getElementById(this.selectedDashboardId).classList.add("selected");
    },
  },
  beforeMount() {
    this.bar();
  },
  mounted() {},
};
</script>

<style>
.dashboard-item.item-layout.selected {
  box-shadow: 5px 5px 5px 5px gray;
}
</style>