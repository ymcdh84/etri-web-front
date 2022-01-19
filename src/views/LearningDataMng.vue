<template>
  <div class="inner-box">
    <form @submit.prevent="save">
      <div class="menu-head">
        <h3 class="float-start">{{ this.title }}</h3>
        <div class="float-end pt-2">
          <button
            type="button"
            class="btn btn-info btn-sm me-1"
            @click="goOpen"
          >
            <i class="fa fa-search"></i>
            조회
          </button>
        </div>
      </div>
    </form>
    <!-- 검색조건 영역 -->
    <div class="search-form">
      <div class="form-group">
        <label class="control-label">사이트 명</label>
        <div class="form-input">
          <input
            class="input Rt-M tal"
            type="text"
            id="group_cd"
            v-model="form.siteId"
          />
        </div>
      </div>
      <div class="form-group">
        <label class="control-label">설비명</label>
        <div class="form-input">
          <input type="text" class="input" v-model="form.assetId" />
        </div>
      </div>
    </div>
    <!-- 테이블 -->
    <div class="table-area">
      <div class="table-b">
        <div class="menu-head pt-2">
          <div class="float-start">
            <h4 class="ico_table_name">
              <i class="far fa-bookmark"></i>&nbsp;&nbsp;Lot번호 목록
            </h4>
          </div>
          <div class="float-end pt-1">
            <button class="btn btn-outline-light btn-sm me-1" @click="execTaxBill">
              <i class="fas fa-cog"></i>
              세금계산서
            </button>
            <button class="btn btn-outline-light btn-sm me-1" @click="execPcaBatch" v-if = "false">
              <i class="fas fa-cog"></i>
              PCA배치
            </button>
            <button class="btn btn-outline-light btn-sm me-1" @click="execPredictBatch" v-if = "false">
              <i class="fas fa-cog"></i>
              예측배치
            </button>            
            <button class="btn btn-outline-light btn-sm me-1" @click="save" v-if = "false">
              <i class="fas fa-save"></i>
              저장
            </button>          
          </div>          
        </div>
        <ag-grid-vue
          ref="gridMain"
          style="width: 100%; height: 71vh; min-height: 25px"
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
        />
      </div>
    </div>
  </div>
</template>
<script>

import SelectCellRenderer from "@/components/agGrid/select-cell-renderer";
import AgGridCheckbox from  '@/components/agGrid/checkbox-cell-renderer'

import common from "@/mixin/common";

/**
 * Url JOIN
 */
function _url(...args) {
  args = args.map((x) =>
    String(x || "")
      .trim()
      .replace(/^\/*|\/*$/g, "")
  );
  return args.filter((x) => x).join("/");
}

export default {
  mixins: [common],
  name: "learningDataMng",
  data() {
    return {
      title: "학습데이터 관리",
      form: {
        siteId: "",
        assetNm: ""
      },
      data: [],
      deleteList: [],
      //Main Grid 옵션
      gridOptions: {
        rowHeight: 35,
        //enableColResize: true,
        //enableFilter: true,
        //animateRows: false,
        //enableSorting: true
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
        DATA_TYPE_CD: [],
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
      // eslint-disable-next-line no-console
      console.log(params);
      //메인그리드 api 정의
      this.gridApi = this.gridOptions.api;
      this.columnApi = this.gridOptions.columnApi;

      this.createColumnDefs();
    },
    //그리드컬럼 정의
    createColumnDefs() {
      const vm = this;

      this.columnDefs = [
        {
          headerName: "No.",
          width: 80,
          valueGetter: (params) => {
            return params.node.rowIndex + 1;
          },
          editable: false,
          sortable: false,
          filter: false,
          resizable: false,
        },        
        {
            headerName: '학습데이터', 
            field: 'learningYn', 
            width: 120,
            editable: true,
            cellStyle : {textAlign: 'center'},
            cellRenderer: 'checkBox'
        },          
        // {  headerName: '변경전 학습데이터'
        //   , field:'learningYnBefore'
        //   , width: 120
        //   , editable: false
        //   , cellStyle : {textAlign: 'center'}
        //   , cellRenderer: function(params){
        //       if(params.node.data.learningYn == 'N'){    
        //         return ""
        //       }else{
        //         return "<div><i class='fas fa-check'></i></div>"
        //       }
        //     }             
        // },
        { headerName: "사이트명", field: "siteNm", width: 200 },
        { headerName: "설비명", field: "assetNm", width: 200 },
        { headerName: "LOT번호", field: "lotNo", width: 190 , cellStyle : {textAlign: 'center'}},
        { headerName: "데이터 건수", field: "dataCnt", width: 120, cellStyle : {textAlign: 'right'}},
        { headerName: "PCA 배치 실행일시", field: "pcaBatchDateTime", width: 300 , cellStyle : {textAlign: 'center'}},
        { headerName: "예측 배치 실행일시", field: "predictBatchDateTime", width: 295 , cellStyle : {textAlign: 'center'}},
        { headerName: "학습데이터 지정일시", field: "createDateTime", width: 295 , cellStyle : {textAlign: 'center'}},
      ];
    },
    goOpen() {
      const vm = this;

      vm.data = [];

      // code list 조회
      this.$store.commit("loading");
      this.$http
        .post(_url("/api/lndata/list"), {
          siteId: this.form.siteId,
          assetId: this.form.assetId
        })
        .then((response) => {
          this.data = response.data;

          if (response.data.length == 0) {
            this.$swal({
              type: "warning",
              text: "조회내역이 존재하지 않습니다.",
            });
          }
        })
        .finally(() => {
          this.$store.commit("finish");
        });
    },
    save() {      

      //체크박스 변경사항 데이터 필터링
      let saveData = this.data.filter(x => x.learningYn != x.learningYnBefore)

      if(saveData.length < 1){
        this.$swal({ type: 'info', text: '변경사항이 없습니다.' });
      }else{
        this.$swal({
            type: 'info',
            text: `변경사항을 저장 하시겠습니까?`,
            showCancelButton: true,
            confirmButtonText: '예',
            cancelButtonText: '아니오',
        }).then((result) => {
          
          this.$store.commit('loading')
          this.$http
            .put('/api/lndata/save', saveData)
            .then(response => {
              this.$swal({ type: 'success', text: '저장되었습니다.' });
              this.goOpen();
          }).finally(() => {
            this.$store.commit('finish')            
          });

        })
      }
    },
    execPcaBatch(){
      this.$swal({
          type: 'info',
          text:  this.form.assetNm + `PCA 배치 실행하시겠습니까?`,
          showCancelButton: true,
          confirmButtonText: '예',
          cancelButtonText: '아니오',
      }).then((result) => {
          if (result.value) {
            
            this.$store.commit('loading')

            this.$http.put('/api/lndata/batch/pca', {
                siteId : this.focusSiteId,
                assetId : this.focusAssetId
              },{timeout: 60000 * 10}).then(response => {
                  this.$swal({ type: 'success', text: '배치 실행 완료하였습니다.' });
                  this.goOpen();
              }).finally(() => {
                this.$store.commit('finish')
              })
          }
      });
    },
    execTaxBill(){
    const options = {
          headers: {
                  'content-type' : 'application/xml',
                  'charset' : 'UTF-8'
              }
          }
      // code list 조회
      this.$store.commit("loading");
      this.$http
        .post(_url("https://hometax.go.kr/wqAction.do?actionId=ATXPPZXA001R01&screenId=UTXPPABA01"),{
          siteId: this.form.siteId,
          assetId: this.form.assetId
        }, options)
        .then((response) => {
          this.data = response.data;

          if (response.data.length == 0) {
            this.$swal({
              type: "warning",
              text: "조회내역이 존재하지 않습니다.",
            });
          }
        })
        .finally(() => {
          this.$store.commit("finish");
        });

    },
    execPredictBatch(){
      this.$swal({
          type: 'info',
          text:  this.form.assetNm + `예측 배치 실행하시겠습니까?`,
          showCancelButton: true,
          confirmButtonText: '예',
          cancelButtonText: '아니오',
      }).then((result) => {
          if (result.value) {
            
            this.$store.commit('loading')

            this.$http.put('/api/lndata/batch/predict', {
                siteId : this.focusSiteId,
                assetId : this.focusAssetId
              },{timeout: 60000 * 10}).then(response => {
                  this.$swal({ type: 'success', text: '배치 실행 완료하였습니다.' });
                  this.goOpen();
              }).finally(() => {
                this.$store.commit('finish')
              })
          }
      });
    },    
  },
  beforeMount() {
    this.frameworkComponents = {
      //그르드에서 사용할 외부 comp 등록
      select: SelectCellRenderer,
      checkBox : AgGridCheckbox
    };
  },
  mounted() {
    //this.goOpen();
  },
  created() {
  },
};
</script>

<style>
  input[type=checkbox] + label {
    padding-bottom: 35px;
  }
</style>