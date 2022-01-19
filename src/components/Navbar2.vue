<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid">
      <router-link class="navbar-brand" to="/">Smart-e</router-link>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarColor02"
        aria-controls="navbarColor02"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <!-- <a href="#" class="logout" title="로그아웃" @click="logout"><i class="fa fa-sign-out-alt"></i></a> -->
      <div class="logout">
        <div
          class="btn-group"
          role="group"
          aria-label="Button group with nested dropdown"
        >
          <div class="btn-group" role="group">
            <a
              id="btnGroupDrop1"
              data-bs-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
              ><i class="fas fa-user"></i
            ></a>
            <div class="dropdown-menu" aria-labelledby="btnGroupDrop1">
              <a class="dropdown-item" href="#" @click="logout"
                >로그아웃&nbsp;&nbsp;&nbsp;<i class="fa fa-sign-out-alt"></i
              ></a>
              <div class="dropdown-item">
                <div class="form-check float-start">
                  <label class="form-check-label">
                    <input
                      type="radio"
                      class="form-check-input"
                      id="optionsRadios1"
                      value="/css/bootstrap_dark.css"
                      v-model="thema"
                      @click="showAlert($event)"
                    />
                    Dark
                  </label>
                </div>
                <div class="form-check float-start">
                  <label class="form-check-label">
                    <input
                      type="radio"
                      class="form-check-input"
                      id="optionsRadios2"
                      value="/css/bootstrap_light.css"
                      v-model="thema"
                      @click="showAlert($event)"
                    />
                    Light
                  </label>
                </div>
                <div class="form-check float-start">
                  <label class="form-check-label">
                    <input
                      type="radio"
                      class="form-check-input"
                      id="optionsRadios3"
                      value="/css/bootstrap_black.css"
                      v-model="thema"
                      @click="showAlert($event)"
                    />
                    Black
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="collapse navbar-collapse" id="navbarColor02">
        <ul class="navbar-nav me-auto">
          <!-- <li class="nav-item" v-for="(menuhead,i) in menuheads" :key="i">
          <a class="nav-link" href="#"></a>
        </li> -->
          <li
            class="nav-item dropdown"
            v-for="(menuhead, i) in menuheads"
            :key="i"
          >
            <router-link
              v-if="
                menuhead.upperMenuNo == '0' && menuhead.programFileNm != 'dir'
              "
              class="nav-link"
              :to="{ path: mainmenu.programFileNm }"
            >
              {{ menuhead.menuNm }}
              <!-- <router-link :to="{path: menuhead.programFileNm}"></router-link> -->
            </router-link>
            <router-link
              v-else
              class="nav-link dropdown-toggle"
              data-bs-toggle="dropdown"
              to="#"
              role="button"
              aria-haspopup="true"
              aria-expanded="false"
              >{{ menuhead.menuNm }}</router-link
            >
            <div class="dropdown-menu">
              <router-link
                v-for="(mainmenu, i) in mainmenus"
                :key="i"
                v-show="menuhead.menuNo === mainmenu.upperMenuNo"
                :to="{ path: mainmenu.programFileNm }"
                class="dropdown-item"
                @click.native.capture="handleClick(mainmenu.menuNm)"
              >
                {{ mainmenu.menuNm }}
              </router-link>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: "Navbar2",
  data() {
    return {
      mainmenus: [],
      menuheads: [],
      thema: this.$store.state.loginInfo.colorThema,
    };
  },

  mounted() {
    this.getMainMenuList();
  },

  methods: {
    //1. 메인메뉴
    getMainMenuList() {
      this.$http
        .get(`/api/menu/list/${this.$store.state.loginInfo.loginId}`)
        .then((response) => {
          //1. 메인메뉴
          this.mainmenus = response.data;
          let menuupper = [];
          for (let i = 0; i < this.mainmenus.length; i++) {
            if (this.mainmenus[i].upperMenuNo == 0) {
              menuupper.push(this.mainmenus[i]);
            }
          }
          this.menuheads = menuupper;
        });
    },
    logout() {
      this.$http
        .get("/logout")
        .then(() => {
          this.$store.commit("logout");
          this.$cookie.delete("loginInfo");
        })
        .catch((e) => {
          console.error(e);
        });
    },
    showAlert(e) {
      this.$http.put(`/api/settings/thema`, { attribute2: e.target.value });
      this.$swal({ type: "info", text: "재로그인해야 테마가 적용됩니다." });
    },
    handleClick(menuNm) {
      if (menuNm === "데이터 탐색") {
        var username = this.$store.state.loginInfo.loginId;
        var token = this.$store.state.loginInfo.token;
        window.open(
          process.env.VUE_APP_VISUAL_URL +
            `/sso-login/` +
            username +
            `/` +
            token
        );
      }
    },
  },
};
</script>

