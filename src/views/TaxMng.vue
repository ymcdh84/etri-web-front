<template>
  <div class="inner-box">
    <form @submit.prevent="save()">
      <div class="content-name">
        <h2 class="dp-ib">{{title}}</h2>
        <div class="btn-wrap btn-type1 clearfix">
          <button class="btn-size btn-blue fl_left" type="button" @click="goOpen">
            <span class="btn-icon">
              <i class="fas fa-pen-alt"></i>
            </span> 조회
          </button>
          <button class="btn-size btn-gray fl_left" type="submit">
            <span class="btn-icon">
              <i class="fas fa-check"></i>
            </span> 저장
          </button>
        </div>
      </div>
    </form>  
    <!-- 검색조건 영역 -->
    <div class="desc-content search-border">
      <div class="item desc-left">
        <div class="desc-item">
          <div class="tit">
            <span class="label-search-require">- 회사</span>
          </div>
          <div class="desc">
            <b-select id="bselect" class="select is-fullwidth" v-model="form.compCd" disabled = "true">
              <option
                v-for="item in compCds"
                :key="item.key"
                :value="item.key"
                v-text="item.value"
              />
            </b-select>
          </div>
        </div>
      </div>
      <div class="item desc-left">
          <div class="desc-item">
            <div class="tit">
              <span class="label-tit">- 세금 코드/명</span>
            </div>
            <div class="desc">
              <input class="input Rt-M tal" type="text" id="account_cd" v-model="form.codeNm" />
            </div>
          </div>
      </div>
    </div>
    <!-- Grid영역 -->
    <div class="table-area">
      
      <div class="table-header">
        <div class="table-name">
          <h3 class="ico_table_name">세금코드 관리</h3>
        </div>
        <div class="btn-wrap btn-type2 clearfix">
          <button class="btn-size btn-w-gray" @click="addRow">
            <span class="btn-icon">
              <i class="fas fa-plus"></i>
            </span>행추가
          </button>
          <button class="btn-size btn-w-gray" @click="deleteRow">
            <span class="btn-icon">
              <i class="fas fa-trash-alt"></i>
            </span>행삭제
          </button>
          <button class="btn-size btn-excel" @click="saveExcel">엑셀 저장</button>
        </div>
      </div>
    <!-- <dhx-grid class="tax-mng-grid" ref="grid" v-model="data" :config="config" /> -->
          <ag-grid-vue         
          ref="grid"
          style="width: 100%; height: 50vh; min-height: 510px;"
          class="ag-theme-alpine"
          rowSelection="multiple"
                                  
          :columnDefs="columnDefs"                        
          :rowData="data"
          :gridOptions="gridOptions"   
          :defaultColDef="defaultColDef"
          :frameworkComponents="frameworkComponents"    
          @grid-ready="onReady"
          />  
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import dhxGrid from "@/components/DhxGrid.vue";
import GridSelect from "@/components/grid/GridSelect.vue";
import mixin from "@/mixin/slip-common";
import GridNumberInput from '@/components/grid/GridNumberInput.vue'
import mixinSlip from '@/mixin/slip';
import GridCheckbox from '@/components/grid/GridCheckbox.vue'
import _ from 'lodash'

import SelectCellRenderer from '@/components/agGrid/select-cell-renderer'
import CheckboxCellRenderer from '@/components/agGrid/checkbox-cell-renderer'
import NumberInputCellRender from '@/components/agGrid/numberinput-cell-renderer'
import InputCellRender from '@/components/agGrid/input-cell-renderer'

var eventBus = new Vue();

const options = {};

var queryEvdTypeCd_run = false;

function queryTpsTypeCd() {
  if (options["evdTypeCd"] === undefined && !queryEvdTypeCd_run) {
    queryEvdTypeCd_run = true;
    this.$http
      .get("/api/code/detail", {
        params: {
          groupCd: "EVD_TYPE_CD"
        }
      })
      .then(response => {
        var datas = {};
        datas[0] = { detailCd: "initial", detailNm: "--선택--", detailRealNm: ""}
        for (var i = 0; i < response.data.length; i++) {
          datas[i + 1] = {
            detailCd: response.data[i].detailCd,
            originNm: response.data[i].detailNm,
            detailNm: "[" + response.data[i].detailCd + "] " + response.data[i].detailNm,
            detailRealNm: response.data[i].detailNm
          };
        }
        options["evdTypeCd"] = datas;
      })
      .catch(response => {
        options["evdTypeCd"] = undefined;
        return response;
      })
      .finally(() => {        
        eventBus.$emit('selectBox.updated')
        queryEvdTypeCd_run = false;
      });
  }
}

export default {
  name: "taxMng",
  mixins: [mixin, mixinSlip],
  data() {
    return {
      title: "세금코드관리",
      compCds: [],
      deleteid: [],
      form: {
        compCd: "",
        codeNm: ""
      },
      selected: [],
      data: [{}],
      gridOptions: {         
          //enableColResize: true,
          //enableFilter: true,
          //animateRows: false,
          //enableSorting: true
      },
      frameworkComponents: {
        selectCellRenderer: SelectCellRenderer,
        checkboxRenderer: CheckboxCellRenderer,
        numberInputCellRender: NumberInputCellRender,
        inputCellRender: InputCellRender,
      }, 
      defaultColDef: {         
          resizable: true,
          filter: true,
          sortable: true,
          editable: true,
          width : 184,
          cellStyle : {textAlign: 'left'},
      },                  
      gridApi : null ,    //gridAip
      columnApi : null ,  //columApi
      columnDefs: [] ,    //comulum Defs
    };
  },
  created() {
    
    eventBus.$on('selectBox.updated', () => {
        //셀렉트 박스 안에 맵핑될 데이터가 그리드에 반영되기 위해 비동기 처리
        this.createColumnDefs();
    })

    queryTpsTypeCd.apply(this, []);
  },
  methods: {
    //그리드 Ready
    onReady(params) {      
        
      //그리드용 api 정의
      this.gridApi = params.api;
      this.columnApi = params.columnApi;
      
      // setTimeout(() => {
        this.createColumnDefs();
      // },500);
      
      // setTimeout(() => {
      //  this.gridApi.sizeColumnsToFit();
      // },500);

    },
    createColumnDefs() {                
        const vm = this
        this.columnDefs = [
            {headerName: 'No.', width : 80, valueGetter: (params) => {return params.node.rowIndex + 1 }, editable: false, cellStyle : {textAlign: 'center'}},
            {
                headerName:'세금코드'
              , field:'taxCd'
              , editable: function(params){ 
                  if(params.node.data.new){
                    return true
                  }else{
                    return false
                  }
                },
                cellClass : function(params){
                    if(params.node.data.new){
                      return 'bg-lightpink'
                    }else{
                      return 'bg-grey'
                    }
                }                  
            }, 
            {headerName:'세금명칭', field:'taxNm', width:180}, 
            {
                headerName:'세율'
              , field:'taxRt'
              , width : 80
              //, type: 'numericColumn'
              , valueFormatter: function(params) {               
                    return vm.getNumberFormat(params.value);//숫자 포맷<slip.js>
                }
              , cellStyle : {textAlign: 'right'}  
            },
            {
                headerName:'사용여부'
              , field:'useYn'
              , width : 120
              , cellRenderer: 'checkboxRenderer'                           
              , cellStyle : {textAlign: 'center'}
            },
            {
                headerName:'정렬순서#'
              , field:'orderSeq'
              , width : 120
              , cellRenderer: 'numberInputCellRender'
              // , cellRendererParams: {
              //    disable: true,
              //    maxlength: 6
              // }
            },
            {
                headerName:'정렬순서'
              , field:'orderSeq'
              , width : 120
              , valueFormatter: function(params) {               
                    return vm.getNumberFormat(params.value);//숫자 포맷<slip.js>
                }
              , cellStyle : {textAlign: 'right'}    
            },
            {
              headerName: '증빙유형코드',
              field: 'evdTypeCd', 
              width : 200,
              cellRenderer: 'selectCellRenderer',
              cellRendererParams: {
                  options : options["evdTypeCd"],
                  // detailCd: 'key',  //서버로 부터 받은 key defalut-"detailCd"
                  // detailNm: 'value' //서버로 부터 받은 value defalut-"detailNm"
              }
            },
            {
                headerName:'비고1'
              , field:'ref1'
              , cellRenderer: 'inputCellRender'
              , cellRendererParams: {
                 maxlength: 10
              }
            },
            {headerName:'비고2', field:'ref2'}, 
            {headerName:'비고3', field:'ref3'}, 
            {headerName: "compcode", field: "compCd", editable: false, hide: true}            
        ];
    },        
    save() {
      for(var i = 0;i<this.data.length;i++){
        for(var j = i+1; j<this.data.length;j++){
          if(this.data[i].taxCd === this.data[j].taxCd){
            this.$swal({type: 'warning', text: '해당 세금코드가 이미 존재합니다. 중복코드 : ' + this.data[i].taxCd});
            return false;
          }
        }
      }
        this.$http.post('/api/taxes/save',  this.data)
      .then(response =>{
        this.$swal({ type: 'success', text: '저장되었습니다' });
        this.goOpen()
      })

    },
    addRow() {
      this.data.push({
        taxCd: "",
        taxNm: "",
        taxRt: 0,
        useYn: "Y",
        orderSeq: "0",
        evdTypeCd: "initial",
        ref1: "",
        ref2: "",
        ref3: "",
        compCd: this.$store.state.loginInfo.compCd,
        new: true
      });
    },
    deleteRow() {
      const rId = this.$refs.grid.instance.getSelectedRowId()
      if (rId === null) {
        this.$swal({
          type: 'error',
          text: '삭제할 행을 선택하여주세요.'
        })
      } else {
        const rowIndex = this.$refs.grid.instance.getRowIndex(rId)
        const isNew = this.data[rowIndex].new
        const taxCd = this.data[rowIndex].taxCd

        this.data.splice(rowIndex, 1)

        if (!isNew) {
          this.$http.post('/api/taxes/delete', {
            taxCd
          }).then(response => {
            // Do nothing!
          })
        }
      }
    },
    saveExcel() {
      this.downloadExcel(this.$refs.grid);
    },
    getCompCdCombo() {
      this.$http
        .get(`/api/code/combo`, { params: { groupCd: "COMP_CD" } })
        .then(response => {
          // eslint-disable-next-line
          this.compCds = response.data;
          
        });

        this.form.compCd = this.$store.state.loginInfo.compCd;
      if (this.$store.state.loginInfo.authorities[0].authority === "ADMIN") {
        //ADMIN일경우 disabled 해제
        document.getElementById("bselect").removeAttribute("disabled");
      }
    },
    

    goOpen() {
       
      this.$store.commit('loading') 
      this.$http
        .post(`/api/taxes/list`, 
        { 
          compCd: this.compCds.key,
          taxCd: this.form.codeNm
        })
        .then(response => {
          this.data = response.data;

          if(response.data.length == 0){
              this.$swal({ type: 'warning', text: '조회내역이 존재하지 않습니다.' })
          } 
        }).finally(() => {
          this.$store.commit('finish')
        });
    },

  },
  // created() {
  //     eventBus.$on('selectBox.updated', () => {
  //       debugger;
  //         //셀렉트 박스 안에 맵핑될 데이터가 그리드에 반영되기 위해 비동기 처리
  //         this.createColumnDefs();
  //     })
  // },  
  mounted() {
    this.getCompCdCombo();
    this.goOpen();
  }
};
</script>

<style lang="scss" scoped>
.tax-mng-grid {
  :global(.gridbox) {
    height: 50vh !important;
  }
}

.gridbox {
  height: 200px !important;
}
.gridbox .objbox {
  height: 350px !important;
}

.desc-content:after {
  clear: both;
  content: "";
  display: block;
}
.btn-wrap {
  margin-bottom: 20px;
}
.desc-content {
  border: 2px solid #9db6c9;
  background: #f9fafc;
  margin: 0 0 20px 0;
  border-radius: 4px;
  padding: 15px 2%;
  clear: both;
}
.desc-content .item {
  float: left;
}
.desc-content .item .desc-item {
  position: relative;
  padding-left: 82px;
  margin-bottom: 8px;
}
.desc-content .item .desc-item:last-child {
  margin-bottom: 0;
  height: 25px;
}
.desc-content .item .desc-item .tit {
  position: absolute;
  left: 0;
}
.desc-content .item .desc-item .label-tit {
  font-family: "NotoM";
  color: #222;
  font-size: 15px;
}
.desc-content .item.desc-left .desc-item {
  padding-left: 90px;
}
.desc-content .item.desc-left .desc-item .desc:after {
  clear: both;
  content: "";
  display: block;
}
.desc-content .item.desc-left .desc-item .desc .datepicker {
  float: left;
}
.desc-content .item.desc-left .desc-item .desc span.wave {
  float: left;
  padding: 0 6px;
}
.desc-content .item.desc-left .desc-item .td-s-thumb.search-area:after {
  clear: both;
  content: "";
  display: block;
}
.desc-content .item.desc-left .desc-item .td-s-thumb.search-area input,
.desc-content .item.desc-left .desc-item .td-s-thumb.search-area .ip-box {
  float: left;
}
.desc-content .item.desc-left .desc-item .desc.select select {
  width: 70%;
}
.desc-content .item.desc-left {
  width: 35%;
  padding-right: 40px;
}
.desc-content .item.desc-center {
  width: 35%;
  padding-right: 40px;
}
.desc-content .item.desc-right {
  width: 30%;
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
.search-border .td-s-thumb {
  position: relative;
  display: inline-block;
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
.search-border .td-s-thumb.search-area .ip-box.ip-box-w02 {
  width: 60%;
  margin-left: 6px;
}
.remove_text {
  margin-left: 0;
}
.contents div.gridbox_material.gridbox .xhdr {
  border-bottom: 1px solid #dfdfdf;
}

@media (max-width: 1580px) {
  .search-border .td-s-thumb.search-area .ip-box.ip-box-w02 {
    width: 50%;
  }
}
</style>