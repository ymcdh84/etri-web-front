<template>
  <layout>
    <span slot="header">
      {{this.$i18n.messages[this.$store.state.locale].userMngt}}
      <button class="btn-pop-close delete" aria-label="close" @click="closeModal"></button>
    </span>
    <div slot="content">
      <div class="inner-box" style="height: 625px">
        <div class="table-area">
          <div class="table-a">
            <table id="basic" class="table">
              <colgroup>
                <col width="22%" />
                <col width="78%" />
              </colgroup>
              <tbody>                
                <tr>
                  <th class="label-form-require" id="loginId">{{'사용자ID'}}</th>
                  <td>
                    <input
                      class="input input-bg"
                      type="text"
                      style="width:100%;"
                      v-model="form.empNo"
                      v-if="isReadOnly"
                      minlength="4"
                      maxlength="20"
                      lbl="loginId"
                    />
                    <span v-if="!isReadOnly">{{ form.empNo }}</span>
                  </td>
                </tr>
                <tr>
                  <th class="label-form-require" id="loginPw">{{'비밀번호'}}</th>
                  <td>
                    <input
                      class="input input-bg"
                      type="password"
                      style="width:100%;"
                      v-model="passWd"
                      minlength="4"
                      maxlength="20"
                      lbl="loginPw"

                      @change="changePassWd"
                    />
                    <!--<input id="modPwd1" name="modPwd" type="checkbox" v-model="form.modPwd" />-->
                  </td>
                </tr>
                
                <tr>
                  <th class="label-form-require" id="loginPwConfirm">{{'비밀번호확인'}}</th>
                  <td>
                    <input
                      class="input input-bg"
                      type="password"
                      style="width:100%;"
                      v-model="checkPw"
                      minlength="4"
                      maxlength="20"
                      lbl="loginPwConfirm"
                    />
                  </td>
                </tr>
                
                <tr>
                  <th class="label-form-require" id="userNm">{{'사용자이름'}}</th>
                  <td>
                    <input
                      class="input input-bg"
                      type="text"
                      style="width:100%;"
                      v-model="form.empNm"
                      minlength="3"
                      maxlength="40"
                      lbl="userNm"
                    />
                  </td>
                </tr>
                <tr>
                  <th class="label-form-require" id="deptNm">{{'부서'}}</th>
                  <td>
                    <div style="width:100%;">
                      <select class="input" v-model="form.deptCd" lbl="deptNm"  @change="changeDept">
                        <option
                          v-for="item in deptList"
                          :key="item.deptCd"
                          :value="item.deptCd"
                          v-text="item.deptNm"
                        />
                      </select>
                    </div>
                  </td>
                </tr>
                <tr>
                  <th class="label-form">{{'상위부서'}}</th>
                  <td>
                    <div style="width:100%;">
                      <b-select class="select is-fullwidth" v-model="form.upperDeptCd" disabled>
                        <option
                          v-for="item in deptList"
                          :key="item.deptCd"
                          :value="item.deptCd"
                          v-text="item.deptNm"
                        />
                      </b-select>
                    </div>
                  </td>
                </tr>                
                <tr>
                  <th class="tp">{{'직급'}}</th>
                  <td>
                    <input
                      class="input input-bg"
                      type="text"
                      style="width:100%;"
                      v-model="form.jobGradeNm"
                      minlength="2"
                      maxlength="20"
                    />
                  </td>
                </tr>
                <tr>
                  <th class="tp">{{'직책'}}</th>
                  <td>
                    <input
                      class="input input-bg"
                      type="text"
                      style="width:100%;"
                      v-model="form.jobDutNm"
                      minlength="2"
                      maxlength="20"
                    />
                  </td>
                </tr>                
                <tr>
                  <th class="label-form-require" id="role">{{'권한'}}</th>
                  <td>
                    <div style="width:100%;">
                      <b-select class="select is-fullwidth" v-model="form.role" lbl="role">
                        <option
                          v-for="item in roles"
                          :key="item.roleCd"
                          :value="item.roleCd"
                          v-text="item.roleNm"
                        />
                      </b-select>
                    </div>
                  </td>
                </tr>
                <tr>
                  <th class="label-form-require" id="state">{{'재직상태'}}</th>
                  <td>
                    <div style="width:100%;">
                      <b-select class="select is-fullwidth" v-model="form.serveCd" lbl="state">
                        <option
                          v-for="item in serveCdList"
                          :key="item.key"
                          :value="item.key"
                          v-text="item.value"
                        />
                      </b-select>
                    </div>
                  </td>
                </tr>                
                <tr>
                  <th class="label-form-require" id="useYn">{{'사용유무'}}</th>
                  <td>
                    <div v-if="form.loginId !== 'admin'">
                      <input
                        type="radio"
                        id="enableFlag1"
                        name="enableFlag"
                        value=true
                        v-model="form.enableFlag"                        
                        checked
                        lbl="userYn"
                      />
                      <label for="enableFlag1">{{'사용'}}</label>
                      <input
                        type="radio"
                        id="enableFlag2"
                        name="enableFlag"
                        value=false
                        v-model="form.enableFlag"
                        lbl="userYn"
                      />
                      <label for="enableFlag2">{{'사용안함'}}</label>
                    </div>
                    <div v-else>{{$t('form00007')}}</div>
                  </td>
                </tr>
                <tr>
                  <th class="tp">{{'E-mail'}}</th>
                  <td>
                    <input
                      class="input input-bg"
                      type="text"
                      style="width:100%;"
                      v-model="form.email"
                      maxlength="50"
                    />
                  </td>
                <tr>
                <th class="tp">{{'Mobile'}}</th>
                  <td>
                    <input
                      class="input input-bg"
                      type="text"
                      style="width:100%;"
                      v-model="form.mobTelNo"
                      maxlength="50"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="clearfix">
        <div class="btn-wrap btn-type1 clearfix fl_right">
          <button class="btn-size btn-blue" @click="save">
            <span class="btn-icon">
              <i class="fas fa-check"></i>
            </span>
            {{'저장'}}
          </button>
          <button class="btn-size btn-orange" @click="deleteUser" v-if="!isReadOnly">
            <span class="btn-icon">
              <i class="fas fa-check"></i>
            </span>
            {{'삭제'}}
          </button>
          <button class="btn-size btn-gray" @click="closeModal">
            <span class="btn-icon">
              <i class="fas fa-check"></i>
            </span>
            {{'닫기'}}
          </button>
        </div>
      </div>
    </div>
  </layout>
</template>

<script>
import Layout from "@/components/ModalSlot.vue";
import mixin from "@/mixin";
import mixinSlip from "@/mixin/slip";
//import CustomerSearchPop from "@/components/CustomerSearchPop.vue";

import common from '@/mixin/common';

export default {
  name: "UserMngPop",
  props: ["c_id", "c_userInfo"],
  mixins: [mixin, mixinSlip,common],
  components: { Layout },
  data() {
    return {
      title: this.$t("sear00004"),
      isReadOnly: null,
      passWd:"******",
      checkPw:"******",
      roles: [],
      serveCdList: [],
      deptList: [],
      customer: "",
      customerCode: "",
      customerMajor: "",
      form: {
            compCd: ""
          , compNm: ""
          , creationDate: ""
          , deptCd: ""
          , deptNm: ""
          , jobDutCd: ""
          , jobDutNm: ""
          , email: ""
          , empNm: ""
          , empNo: ""
          , enableFlag: null
          , jobGradeCd: ""
          , jobGradeNm: ""
          , mobTelNo: ""
          , modifiedDate: ""
          , role: ""
          , roleNm: ""
          , serveCd: ""
          , serveNm: ""
          , upperDeptCd: ""
          , upperDeptNm: ""
      }
    };
  },
  created: function() {
    this.$nextTick(function() {      
      
      if (this.c_id !== "") {
        this.isReadOnly = false;
        // this.customer = this.c_userInfo.customer;
        // this.customerCode = this.c_userInfo.customerCode;
        // this.customerMajor = this.c_userInfo.majorYn;        
        // this.form.id = this.c_id;
        // this.form = this.c_userInfo;
        this.form.role = this.form.role;
        this.form.act = "U";
      } else {
        this.isReadOnly = true;
        // this.customer = this.c_userInfo.customer;
        // this.customerCode = this.c_userInfo.customerCode;
        // this.customerMajor = this.c_userInfo.customerMajor;
        this.form.id = "";
        this.form.custId = "";
        this.form.loginId = "";
        this.form.loginPw = "";        
        this.form.loginNm = "";
        this.form.deptNm = "";        
        this.form.position = "";
        this.form.role = "";
        this.form.attribute2 = "";
        this.form.enableFlag = true;
        this.form.act = "I";
        this.checkPw="";
        this.passWd="";        
      }
     
      if (this.isReadOnly === false) {
         this.getCustomerInfo();
      }
      
      //코드 리스트 조회
      this.getCodeLists();
      
    });
  },
  mounted() {},
  methods: {
    getCustomer(code, name, major) {
      this.customerCode = code;
      this.customer = name;
      this.customerMajor = major;
    },
    customerPop() {
      var param = {
        custId: this.customer,
        custNm: this.customer
      };

      this.$http
        .post("/api/hkglobal/si/customerList", param)
        .then(response => {
          if (response.data.length == 1) {
            this.getCustomer(
              response.data[0].custId,
              response.data[0].custNm,
              response.data[0].attribute
            );
          } else {
            this.$modal.open({
              component: CustomerSearchPop,
              parent: this,
              props: {
                customer: this.customer
              },
              width: 800
            });
          }
        })
        .catch(e => {
          console.error(e.toString());
        });
    },
    getCustomerInfo() {
      
      this.$http
        .get(`/api/emp/${this.c_id}`).then(response => {  
          this.form = response.data
        })
        .catch(err => {
        });
    },
    getCodeLists() {      
      //권한코드 조회
      this.$http.get("/api/auth/",{params: {compCd: this.$store.state.loginInfo.compCd}}).then(result => {
        this.roles = result.data;
      });

      //재직상태 공통코드 조회
      this.$http.get("/api/code/combo",{params: {groupCd: 'SERVE_CD'}}).then(result => {
        this.serveCdList = result.data;
      });

      //부서코드 조회
      this.$http.get("/api/dept").then(result => {
        this.deptList = result.data;
      });

    },
    closeModal() {
      this.$parent.close();
    },
    changeDept(e) {
      
      //부서 변경시 상위부서 세팅
      let sVal = e.target.value

      var sUpperDept = this.deptList.filter(x => x.deptCd === sVal)

      this.form.upperDeptCd = sUpperDept[0].upperDeptCd;

    },
    changePassWd(e){            
      this.form.password = e.target.value
    } ,   
    save() {
      //form 필수입력값 확인
      if(!this.formRequireCheck()) return;

      if (this.isReadOnly) {
        
        if (
          this.form.empNo.length > 20 ||
          this.form.empNo.length < 4
        ) {
          this.$swal({
            type: "warning",
            text: this.$t("altm00002")
          });
          return false;
        }
      }

      if (        
        this.passWd.length > 20 ||
        this.passWd.length < 4
      ) {
        this.$swal({
          type: "warning",
          text: this.$t("altm00003")
        });
        return false;
      }
      
      if(this.passWd !== this.checkPw){
        this.$swal({
          type: "warning",
          text: this.$t("altm00045")
        });
        return false;
      }      

      this.$swal({
        type: "info",
        text: this.$t("altm00007"),
        showCancelButton: true,
        confirmButtonText: this.$t("altm00008"),
        cancelButtonText: this.$t("altm00009")
      }).then(result => {
        if (result.value) { 
          this.$http
            .put(`/api/emp/${this.form.empNo}`, this.form)
            .then(response => {
      
                this.$swal({ type: "warning", text: this.$t("altm00022") });
                this.$parent.$parent.searchList();
                this.closeModal();
                return;
            
            })
            .catch(e => {
              console.error(e);
            });
        }
      });
    },
    deleteUser() {
      if (!this.isReadOnly) {
        if (this.form.loginId === "admin") {
          this.$swal({
            type: "warning",
            text: this.$t("altm00015")
          });
          return;
        } else {
          this.$swal({
            type: "info",
            text: `사용자 정보를 삭제 합니다. 계속 하시겠습니까?`,
            showCancelButton: true,
            confirmButtonText: "예",
            cancelButtonText: "아니오"
          }).then(result => {
            if (result.value) {
              this.$http
                .delete(
                  `/api/emp/${this.form.empNo}`
                )
                .then(response => {
                  this.$swal({ type: "warning", text: this.$t("altm00025") });
                  this.$parent.$parent.searchList();
                  this.closeModal();
                  return;
                });
            }
          });
        }
      }
    }
  }
};
</script>

<style scoped>
.btn-wrap {
  margin-bottom: 20px;
}

.desc-content .item.desc-left .desc-item .td-s-thumb.search-area input {
  float: left;
}

.desc-content .item.desc-left .desc-item .desc.select select {
  width: 70%;
}

.search-area input {
  position: relative;
}

.search-area .icon {
  position: absolute;
  right: 8px;
  top: 1px;
  z-index: 100;
  cursor: pointer;
  font-size: 16px;
  color: #555;
}

.search-border .td-s-thumb.search-area > input,
.search-border
  .td-s-thumb.search-area
  > .ip-box
  .search-border
  .td-s-thumb.search-area
  > button {
  float: left;
}
</style>
