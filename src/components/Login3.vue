<template>
    <section class="backImage2">
      <div id="loginForm" class="hc5 vc4 loginBox4">
        <div class="backImage3 float-start"></div>
        <h3 style="color:#20374c; padding-top: 4px;">Display</h3>
      </div>
      <div id="loginForm" class="hc4 vc loginBox3">
        <h1 style="color:#20374c;">Web Platform</h1>
        <div class="form-group">
          <label for="exampleInputId" class="form-label mt-4" style="color: #212529; font-size: 1rem;">ID</label>
          <input v-model="loginInfo.loginId" type="text" class="form-control" style="font-size: 0.875rem; border-bottom: 2px solid #ebebeb;" id="exampleInputId" aria-describedby="emailHelp" placeholder="ID">
        </div>
        <div class="form-group">
          <label for="exampleInputPassword1" class="form-label mt-4" style="color: #212529; font-size: 1rem;">Password</label>
          <div class="form-group">
            <div class="input-group mb-3">
              <input v-model="loginInfo.loginPw" type="password" class="form-control" style="font-size: 0.875rem; border-bottom: 2px solid #ebebeb;" id="exampleInputPassword1" placeholder="Password"
                @keydown.enter="login"> <!-- @keypress="caps_lock" -->
              <button class="input-group-text" type="button" title="로그인" @click="login"><i class="fa fa-arrow-right"></i></button>
            </div>
          </div>
        </div>
        <!-- <p id="text" class="ly_box">'<strong>Caps Lock</strong>'이 켜져 있습니다.</p> -->
      </div>
      <!-- footer -->
      <div class="footer-login">
          <span class="copyright">COPYRIGHT © ILJIN ALL RIGHTS RESERVED.</span>
      </div>
      <!-- //footer-login -->
    </section>
</template>

<script>
export default {
  props: {
    loginId: {
      type: String,
      required: false,
    },
    token: {
      type: String,
      required: false,
    },
  },
  name: 'Login3',
  data() {
    return {    
      loginInfo: {
        loginId: '',
        loginPw: '',
        compCd: '',
        loginDeptNm: '',
        loginDeptCd: '',
        loginJobDutCd: '',
        loginJobDutNm: '',
        loginJobGradeCd: '',
        loginJobGradeNm: '',
        colorThema:'',
        token: '',
        menu: [],
        authorities: [],
      },
    }
  },
  methods: {
    loginFail() {
      this.$swal({
        animation: false,
        type: 'error',
        text: `로그인 실패했습니다. ID 또는 비밀번호를 확인해 주세요.`,
      });
    },
    async login() {
      try {
        this.$store.commit('loading');
        const response = await this.$http.post('/login', this.loginInfo);
        const loginInfo = {};
        loginInfo.userName = response.data.userName;
        loginInfo.loginId = response.data.loginId;
        loginInfo.compCd = response.data.loginCompCd;
        loginInfo.loginDeptNm = response.data.loginDeptNm;
        loginInfo.loginDeptCd = response.data.loginDeptCd;
        loginInfo.loginJobDutCd = response.data.loginJobDutCd;
        loginInfo.loginJobDutNm = response.data.loginJobDutNm;
        loginInfo.loginJobGradeCd = response.data.loginJobGradeCd;
        loginInfo.loginJobGradeNm = response.data.loginJobGradeNm;
        loginInfo.token = response.data.token;
        loginInfo.menu = response.data.menu;
        loginInfo.authorities = response.data.authorities;
        loginInfo.colorThema = response.data.attribute2;
        loginInfo.loginPw = 'Not Use';

        if(!loginInfo.colorThema){
          loginInfo.colorThema = '/css/bootstrap_dark.css'
        }

        this.$store.commit('login', loginInfo);
        this.$cookie.set('loginInfo', JSON.stringify(loginInfo));
        this.$cookie.set('sessionAlive', true);
        this.$http.defaults.headers['x-auth-token'] = loginInfo.token;
        this.$store.commit('register', '');
        this.$store.commit("setLocale", this.locale);
        this.$router.push({path: `/`});

        //21.09 컬러테마
        var link = document.createElement('link');
        link.rel ='stylesheet';
        link.href = this.$store.state.loginInfo.colorThema;
        document.head.appendChild(link);

        this.$store.commit('finish');
      } catch(err) {
        this.$store.commit('finish');
        this.loginFail();
      }
    },
    caps_lock() {
      var input = document.getElementById("exampleInputPassword1");
      var text = document.getElementById("text");
      input.addEventListener("keyup", function(event) {
      if (event.getModifierState("CapsLock")) {
          text.style.display = "block";
        } else {
          text.style.display = "none"
        }
      });
    },
  },
  created() {
    this.loginId = this.$route.query['loginId'];
    this.token = this.$route.query['token'];
    console.log("loginId : " + this.loginId);

    this.loginInfo.loginId = this.loginId;
    this.loginInfo.token = this.token;
    //모바일 iframe 메시지 수신을 통한 로그인 
    window.addEventListener('message', async event => {
      // console.log(event.data.id);
      if(event.origin === process.env.VUE_APP_MO_URL) {
        // console.log(`pc:event.origin : ${event.origin}`)
        if(event.data.message === 'isPcLogin') {

          const ret = this.$store.state.loginInfo !== null && this.$store.state.token !== '';
          window.parent.postMessage({ 
            message: 'pcLogin', 
            value: ret
          }, '*');
          console.log('pc:isPcLogin 수신 후 pcLogin' + ret + '보냄');

        } else if(event.data.message === 'login') {

          console.log('pc:login 하라는 메시지 받음');

          if(!this.$store.state.loginInfo) { //로그인 안되어있다면
            this.loginInfo.loginId = event.data.loginId;
            this.loginInfo.loginPw = event.data.loginPw;
            await this.login();        
            const ret = this.$store.state.loginInfo !== null && this.$store.state.token !== '';

            window.parent.postMessage({ 
              message: 'pcLogin', 
              value: ret
            }, '*');
            console.log('pc:현재 로그인 안되어있어서 로그인 시키고 pcLogin:' + ret + ' 메시지 보냄');

          } else {
            window.parent.postMessage({ 
              message: 'pcLogin', 
              value: true
            }, '*');
            console.log('pc:현재 로그인 되어있어서 pcLogin true 메시지 보냄');
          }
        }
      }
    })
  },
  mounted() {
    //21.09 컬러테마
    if(!this.$store.state.loginInfo){
        var link = document.createElement('link');
        link.rel ='stylesheet';
        link.href = '/css/bootstrap_dark.css';
        document.head.appendChild(link);
    }
  }
};
</script>

