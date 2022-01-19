<template>
<div class="inner-box">
  <form @submit.prevent="buttonClickEventSearch">    
    <!-- 타이틀 영역 START-->
    <div class="content-name">
      <h2 class="dp-ib">{{this.$i18n.messages[this.$store.state.locale].userMngt}}</h2>      
      <div class="btn-wrap btn-type1 clearfix">
        <button type="button" class="btn-size btn-blue fl_left" @click="buttonClickEventAdd()">
          <span class="btn-icon"><i class="far fa-file"></i></span>
          {{this.$i18n.messages[this.$store.state.locale].new}}
        </button>
        <button type="button" class="btn-size btn-gray fl_left" @click="buttonClickEventSearch()">
          <span class="btn-icon"><i class="fas fa-search"></i></span>
          {{this.$i18n.messages[this.$store.state.locale].search}}
        </button>
      </div>
    </div>
    <!-- 타이틀 영역 END-->
    <!-- 검색조건 영역 START-->
    <div class="search-form">
      <div class="form-group">
        <label class="control-label" style="width:150px">{{this.$i18n.messages[this.$store.state.locale].userIdNm}}</label>
        <div class="form-input">
          <input type="text" class="input" v-model="searchForm.userId"/>
        </div>        
      </div>
    </div>    
    <!-- 검색조건 영역 END-->
    <!-- 데이터 영역 START-->
    <div class="table-area">
      <div class="table-b">
        <div class="table-header">
          <div class="table-name">
            <h3 class="ico_table_name">{{this.$i18n.messages[this.$store.state.locale].userList}}</h3>
          </div>
          <!-- <div class="btn-wrap btn-type2 clearfix">
            <button class="btn-size btn-w-gray" @click="buttonClickEventAddRow()">
              <span class="btn-icon">
                <i class="fas fa-plus"></i>
              </span>
              {{this.$i18n.messages[this.$store.state.locale].addRow}}
            </button>
            <button class="btn-size btn-w-gray" @click="buttonClickEventRemoveRow()">
              <span class="btn-icon">
                <i class="fas fa-trash-alt"></i>
              </span>
              {{this.$i18n.messages[this.$store.state.locale].delRow}}
            </button>
            <button class="btn-size btn-excel" @click="buttonClickEventToExcel()">
              {{this.$i18n.messages[this.$store.state.locale].saveExcel}}
            </button>
          </div> -->
        </div>
        <!-- Grid -->
        <ag-grid-vue         
          ref="grid"
          style="width: 100%; height: 70vh; min-height: 300px;"
          class="ag-theme-alpine"    
          rowSelection="multiple"                                  

          :columnDefs="columnDefs"
          :defaultColDef="defaultColDef"
          :rowData="data"          
          :frameworkComponents="frameworkComponents"          

          @grid-ready="onReady"
          @cell-double-clicked="onCellDoubleClicked"
        />
        <!-- //Grid -->
      </div>
    </div>
    <!-- //데이터 영역 END-->
    
  </form>
</div>
</template>
<script>
import _ from "lodash";

import common from '@/mixin/common';
import CheckboxCellRenderer from '@/components/agGrid/checkbox-cell-renderer'
import UserMngPop from "@/components/UserMngPop.vue"

export default {
  mixins: [common],
  name: "userMng",
  data() {
    return{
      searchForm: {
        userId: ""
      }, 
      p_id: "",
      p_userInfo: {},     
      data: [],
      defaultColDef: {         
          resizable: true,
          filter: true,
          sortable: true,
          editable: false
      },              
      gridApi : null ,    //gridAip
      columnApi : null ,  //columApi
      columnDefs: [] ,    //comulum Defs
      frameworkComponents: {
        checkBox: CheckboxCellRenderer
      },        
    }
  },
  methods: {
    //그리드 Ready
    onReady(params) {      
      //그리드용 api 정의
      this.gridApi = params.api;
      this.columnApi = params.columnApi;

      //this.gridApi.sizeColumnsToFit();
    },
    //컬럼정의 함수
    createColumnDefs() { 
        const vm = this

        this.columnDefs = [
            {
              headerName: 'No.', width: 80, editable: false, valueGetter: (params) => {return params.node.rowIndex + 1 },
            },
            {
              //headerName: this.$i18n.messages[this.$store.state.locale].authCd
              headerName: '사용자ID'
            , width : 120
            , field: 'empNo'
            },
            {
              headerName: '이름'
            , width : 150
            , field: 'empNm'
            },            
            {
              headerName: '부서명',
              width : 250 ,
              field: 'deptNm'
            },
            {
              headerName: '상위부서명',
              width : 250 ,
              field: 'upperDeptNm'
            },            
            {
              headerName: '직급'
            , width : 120
            , field: 'jobGradeNm'
            },
            {
              headerName: '직책'
            , width : 150
            , field: 'jobDutNm'
            },
            {
              headerName: '권한'
            , width : 150
            , field: 'roleNm'
            },
            {
              headerName: '재직상태'
            , width : 120
            , field: 'serveNm'
            },
            {  headerName: '사용유무'
             , field:'enableFlag'
             , width: 120
             , cellRenderer: 'checkBox'
             , cellRendererParams: {
                  trueValue: true    //true값  지정 defalut-"Y" ex) "Y", true, "1"
                , falseValue: false  //false값 지정 defalut-"N" ex) "N", false, "0"
             } 
             , cellStyle : {'textAlign': 'center'}  
            },
            {
              headerName: 'E-mail',
              width : 300 ,
              field: 'email'
            },
            {
              headerName: 'Mobile',
              width : 300 ,
              field: 'mobTelNo'
            },                                                                                
        ];
    },
    buttonClickEventSearch() {
      this.searchList()
    },
    searchList() {
      this.$store.commit('loading')
      this.$http.get(`/api/emp/list/${this.searchForm.userId}`).then(response => {
        this.data = response.data
        
        if(response.data.length == 0){
            this.$swal({ type: 'warning', text: '조회내역이 존재하지 않습니다.' })
        }
      }).finally(() => {
        this.$store.commit('finish')
      })
    },    
    buttonClickEventAdd() {
      this.userMngPopOpen("I")
    },
    onCellDoubleClicked(event) {
      
      const row = this.gridApi.getSelectedNodes()
      this.p_userInfo = row[0].data;
      
      this.userMngPopOpen("U")
    },
    userMngPopOpen(act) {
      this.act = act;
      if (act === "I") {
        //  this.p_id = "";
        //  this.p_userInfo.customer = this.customer;
        //  this.p_userInfo.customerCode = this.customerCode;
        //  this.p_userInfo.customerMajor = this.customerMajor;
        //  this.p_userInfo.id = "";
        //  this.p_userInfo.loginId = "";
        //  this.p_userInfo.loginNm = "";
        //  this.p_userInfo.loginPw = "";
        //  this.p_userInfo.deptNm = "";
        //  this.p_userInfo.position = "";
        //  this.p_userInfo.attribute2 = "";
        //  this.p_userInfo.role = "";
      
        this.$modal.open({component: UserMngPop, parent: this, width: 800, props: {c_id: "" ,c_userInfo: this.p_userInfo}})
      
      } else {
         
        //  this.p_userInfo.customer = this.customer;
        //  this.p_userInfo.customerCode = this.customerCode;
        //  this.p_id = this.p_userInfo.id;         
      
       const row = this.gridApi.getSelectedNodes()
        
       this.$modal.open({component: UserMngPop, parent: this, width: 800, props: {c_id: row[0].data.empNo ,c_userInfo: this.p_userInfo }})

      }
    }
  },
  beforeMount() {
    this.createColumnDefs(); //그리드 컬럼정의 함수 호출
  },
  mounted() {
    this.searchList()
  },
};
</script>

