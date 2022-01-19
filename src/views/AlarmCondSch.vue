<template>
  <div class="inner-box">
  <form @submit.prevent="save"> 
    <div class="menu-head">
      <h3 class="float-start">{{this.title}}</h3>
      <div class="float-end pt-2">
        <button type="button" class="btn btn-info btn-sm me-1" @click="goOpen">
          <i class="fa fa-search"></i>
          조회
        </button>
      </div>
    </div>

  </form>
  <!-- 검색조건 영역 -->
  <div class="search-form">
    <div class="form-group">
      <label class="control-label">설비명</label>
      <div class="form-input">
        <input type="text" class="input" v-model="form.assetId"/>        
      </div>
    </div>  
    <div class="form-group">
      <label class="control-label">태그명</label>
      <div class="form-input">
        <input type="text" class="input" v-model="form.tagId"/>        
      </div>
    </div>
  </div>
    <!-- 테이블 -->
    <div class="table-area">
      <div class="table-b">
        <div class="menu-head pt-2">
          <div class="float-start">
            <h4 class="ico_table_name"><i class="far fa-bookmark"></i>&nbsp;&nbsp;알람 목록</h4>
          </div>
          <div class="float-end pt-1">
            <button class="btn btn-outline-light btn-sm me-1" @click="checkRead">
              <i class="fas fa-save"></i>
              선택읽음
            </button>            
            <button class="btn btn-outline-light btn-sm me-1" @click="allRead">
              <i class="fas fa-save"></i>
              전체읽음
            </button>
          </div>          
        </div>        
        <ag-grid-vue         
            ref="gridMain"
            style="width: 100%; height: 71vh; min-height: 25px;"
            class="ag-theme-alpine"
                                                
            :columnDefs="columnDefs"
            :defaultColDef="defaultColDef"        
            :frameworkComponents="frameworkComponents"          
            :rowData="data"
            :gridOptions="gridOptions"                                                
            :suppressRowClickSelection="false"
            :sideBar="sideBar"
            :enableRangeSelection="true"
            :enableCharts="true"
            
            @grid-ready="onReadyMain"
            @cell-clicked="onCellClicked"

        />
      </div>
    </div>
  </div>
</template>
<script>
import _ from "lodash";
import assert from "@/libs/assert";

import SelectCellRenderer from '@/components/agGrid/select-cell-renderer'
import AgGridCheckbox from  '@/components/agGrid/checkbox-cell-renderer'

import common from '@/mixin/common';

/**
 * Url JOIN
 */
function _url(...args) {
  args = args.map(x =>
    String(x || "")
      .trim()
      .replace(/^\/*|\/*$/g, "")
  );
  return args.filter(x => x).join("/");
}

export default {
  mixins: [common],
  name: "tagCondSch",
  data() {
    return {
      title: "알람 현황 조회",
      form: {
        siteId: "",
        assetNm: "",
        dataType: ""
      },
      data: [],
      deleteList: [],
      //Main Grid 옵션
      gridOptions: {         
        //enableColResize: true,
        //enableFilter: true,
        //animateRows: false,
        //enableSorting: true
        rowHeight: 35
      },
      defaultColDef: {         
          resizable: true,
          filter: true,
          sortable: true,
          editable: false,
          enableValue: true,
          enableRowGroup: true,
          enablePivot: true,            
      },      
      gridApi: null,
      columnApi: null,      
      columnDefs: [],
      frameworkComponents: null,
      options: {
          'IMPORTANCE_CD': [],
          'ALARM_LEVEL_CD' : []
      },
      sideBar: {
        toolPanels: [
          {
            id: 'columns',
            labelDefault: 'Columns',
            labelKey: 'columns',
            iconKey: 'columns',
            toolPanel: 'agColumnsToolPanel',
            minWidth: 225,
            width: 225,
            maxWidth: 225,
          },
          {
            id: 'filters',
            labelDefault: 'Filters',
            labelKey: 'filters',
            iconKey: 'filter',
            toolPanel: 'agFiltersToolPanel',
            minWidth: 180,
            maxWidth: 400,
            width: 250,
          },          
        ],
        defaultToolPanel: '',        
      }             
    };
  },
  methods: {
    //메인그리드 Ready
    onReadyMain(params) {
      //메인그리드 api 정의
      this.gridApi = this.gridOptions.api;
      this.columnApi = this.gridOptions.columnApi;

      setTimeout(() => {
        this.createColumnDefs();
      },300);
    }, 
    //그리드컬럼 정의
    createColumnDefs() {
        const vm = this
        
        this.columnDefs = [
            {
                headerName: '#', 
                field: 'chk', 
                width: 60,
                editable: true,
                cellRenderer: 'checkBox'
            },          
            {  headerName: '확인여부'
             , field:'confirmYn'
             , width: 115
             , editable: false
             , cellStyle : {textAlign: 'center'}
             , cellRenderer: function(params){
                  if(params.node.data.confirmYn == 'N'){    
                    return ""
                  }else{
                    return "<div><i class='fas fa-check'></i></div>"
                  }
               }             
            },            
            {headerName: 'No.', width : 80, valueGetter: (params) => {return params.node.rowIndex + 1 } , editable: false, sortable: false, filter: false, resizable: false},
            {headerName: '알람ID', field:'alarmId', width: 230},
            {headerName: '알람일자', field:'alarmDataTime', width: 200},            
            {headerName: '설비명', field:'assetNm', width: 200},
            {headerName: '태그명', field:'tagNm', width: 200},
            // {  headerName: '중요도'
            //  , field:'importanceCd'
            //  , width: 120
            //  , editable: false
            //  , cellRenderer: 'select'
            //  , cellRendererParams: {
            //        options : vm.options["IMPORTANCE_CD"],
            //        detailCd: 'key',  //서버로 부터 받은 key defalut-"detailCd"
            //        detailNm: 'value' //서버로 부터 받은 value defalut-"detailNm"
            //   }             
            // },
            {  headerName: '중요도'
             , field:'alarmLevelCd'
             , width: 120
             , editable: false
             , cellRenderer: 'select'
             , cellRendererParams: {
                   options : vm.options["ALARM_LEVEL_CD"],
                   detailCd: 'key',  //서버로 부터 받은 key defalut-"detailCd"
                   detailNm: 'value' //서버로 부터 받은 value defalut-"detailNm"
              }             
            },
            {headerName: '내용', field:'alarmDesc', width: 495},
            {headerName: '삭제'
             , field:'delete'
             , width: 100
             , cellStyle : {textAlign: 'center'}
             , cellRenderer: function(params){                          
                  return "<div><i class='fas fa-trash'></i></div>"
               }  
             , sortable: false
             , filter: false  
             , resizable: false        
            }            
        ];
    },
    goOpen() {
      
      const vm = this
      
      vm.data = []

      // code list 조회
      this.$store.commit('loading') 
      this.$http
        .post(_url("/api/asset/alarm/list"), {
          assetId: this.form.assetId,
          tagId: this.form.tagId
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
    queryImportanceCd() {
      const vm = this
      this.$store.commit('loading')
      this.$http.get('/api/code/combo', {
        params: {
          groupCd: 'IMPORTANCE_CD'
        }
      }).then(response => {
        vm.options['IMPORTANCE_CD'] = response.data        
      }).catch(response => {
        return response
      }).finally(() => {
        this.$store.commit('finish')
      })
    },
    queryAlarmLevelCd() {
      const vm = this
      this.$store.commit('loading')
      this.$http.get('/api/code/combo', {
        params: {
          groupCd: 'ALARM_LEVEL_CD'
        }
      }).then(response => {
        vm.options['ALARM_LEVEL_CD'] = response.data        
      }).catch(response => {
        return response
      }).finally(() => {
        this.$store.commit('finish')
      })
    },    
    allRead() {
      try {
        let data = this.data
        
        let confirmData = data.filter(v => v.confirmYn === 'N')

        this.$store.commit('loading')          
        this.$http
          .put('/api/asset/alarm/confirm',confirmData)
          .then(response => {
            this.$swal({ type: 'success', text: '확인 처리하였습니다.' });
            this.goOpen();
        }).finally(() => {
          this.$store.commit('finish')
        });
      } catch (e) {
        this.$swal({
          type: 'error',
          text: e
        })
      }
    },           
    checkRead(){
      try {
        let data = this.data.filter(x => x.chk)
          
        assert.apply(this, [data.length > 0, '확인 처리할 알람을 선택해 주세요.'])

        let confirmData = data.filter(v => v.confirmYn !== 'N')
            
        assert.apply(this, [confirmData.length === 0, '확인 여부를 확인해 주세요.'])
           
        this.$store.commit('loading')          
        this.$http
          .put('/api/asset/alarm/confirm',data)
          .then(response => {
            this.$swal({ type: 'success', text: '확인 처리하였습니다.' });
            this.goOpen();
        }).finally(() => {
          this.$store.commit('finish')
        });
      } catch (e) {
        this.$swal({
          type: 'error',
          text: e
        })
      }
    },
    //그리드 Cell 클릭 함수
    onCellClicked(event) {
      const idx = event.rowIndex
      const field = event.colDef.field
      
      const alarmId = event.node.data.alarmId
             
      if(field === "delete"){        
        this.$http.delete('/api/asset/alarm', {
          params: {alarmId : alarmId}              
        }).then(response => {
          //this.$swal({ type: 'success', text: '삭제 되었습니다.' });
          this.goOpen()
        })
      }

    },          
  },
  beforeMount() {
    this.frameworkComponents = {//그르드에서 사용할 외부 comp 등록
      select: SelectCellRenderer,
      checkBox : AgGridCheckbox
    };
  },  
  mounted() {
    this.goOpen();
  },
  created() {
    //this.queryImportanceCd();   
    this.queryAlarmLevelCd();
  },    
};
</script>

<style>
  input[type=checkbox] + label {
    padding-bottom: 35px;
  }
</style>