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
      <label class="control-label">사이트 명</label>
      <div class="form-input">
        <input class="input Rt-M tal" type="text" id="group_cd" v-model="form.siteId" />
      </div>
    </div>
    <div class="form-group">
      <label class="control-label">연결명</label>
      <div class="form-input">
        <input type="text" class="input" v-model="form.connectId"/>        
      </div>
    </div>    
  </div>
    <!-- 테이블 -->
    <div class="table-area">
      <div class="table-b">
        <div class="menu-head pt-2">
          <div class="float-start">
            <h4 class="ico_table_name"><i class="far fa-bookmark"></i>&nbsp;&nbsp;사이트 목록</h4>
          </div>
        </div>        
        <ag-grid-vue         
            ref="gridMain"
            style="width: 100%; height: 20vh; min-height: 25px;"
            class="ag-theme-alpine"            
                                    
            :columnDefs="columnDefs"
            :defaultColDef="defaultColDef"        
            :frameworkComponents="frameworkComponents"          
            :rowData="data"
            :gridOptions="gridOptions"                                                
            :suppressRowClickSelection="false"
            :enableRangeSelection="true"
            :enableCharts="true"

            @grid-ready="onReadyMain"
            @range-selection-changed="onSelectionChangedMain"
        />
      </div>
    </div>  
    <br>
  <div class="table-area">
    <div class="table-b">        
      <div class="menu-head pt-2">
        <div class="float-start">
          <h4 class="ico_table_name"><i class="far fa-bookmark"></i>&nbsp;&nbsp;토픽</h4>
        </div>
        <div class="float-end pt-1">
          <button class="btn btn-outline-primary btn-sm me-1" @click="addRow()">
            <i class="fas fa-plus"></i>
            행추가
          </button>
          <button class="btn btn-outline-light btn-sm me-1" @click="deleteRow">
            <i class="fas fa-trash-alt"></i>
            행삭제
          </button>
          <button class="btn btn-outline-light btn-sm me-1" @click="save">
            <i class="fas fa-save"></i>
            저장
          </button>          
        </div>
      </div>
      
      <ag-grid-vue         
          ref="gridSub"
          style="width: 100%; height: 43vh; min-height: 25px;"
          class="ag-theme-alpine"
                                  
          :columnDefs="columnDefsSub" 
          :defaultColDef="defaultColDefSub"        
          :frameworkComponents="frameworkComponents"          
          :rowData="subData"
          :gridOptions="gridOptionsSub"                                                
          :suppressRowClickSelection="false"
          :enableRangeSelection="true"
          :enableCharts="true"

          @grid-ready="onReadySub"
          @cell-value-changed="onCellValueChanged"
          @cell-clicked="onCellClickedSub"
      />

    </div>
  </div>    

  </div>
</template>
<script>
import _ from "lodash";

import SelectCellRenderer from '@/components/agGrid/select-cell-renderer'

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
  name: "kafkaTopicMng",
  data() {
    return {
      title: "카프카 토픽 관리",
      form: {
        siteId: "",
        connectId: ""
      },
      data: [],
      subData: [],
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
          editable: false
      },      
      gridApi: null,
      columnApi: null,      
      columnDefs: [],

      //Sub Grid 옵션
      gridOptionsSub: {         
        //enableColResize: true,
        //enableFilter: true,
        //animateRows: false,
        //enableSorting: true
        rowHeight: 35
      },
      defaultColDefSub: {         
          resizable: true,
          filter: true,
          sortable: true,
          editable: true
      },
      gridApiSub: null,
      columnApiSub: null,      
      columnDefsSub: [],      
      frameworkComponents: null,
      options: {
          'TOPIC_STAT_CD': []
      },       
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
    //서브그리드 Ready
    onReadySub(params) {
        //서브그리드 api 정의
        this.gridApiSub = this.gridOptionsSub.api;
        this.columnApiSub = this.gridOptionsSub.columnApi;

        //this.gridApiSub.sizeColumnsToFit();
    },    
    //그리드컬럼 정의
    createColumnDefs() {
        const vm = this
        
        this.columnDefs = [
            {headerName: 'No.', width : 80, valueGetter: (params) => {return params.node.rowIndex + 1 } , editable: false, sortable: false, filter: false, resizable: false},
            {headerName: '사이트 ID', field:'siteId', width: 250}, 
            {headerName: '사이트 명', field:'siteNm', width: 250},
            {headerName: '연결 ID', field:'connectId', width: 250}, 
            {headerName: '연결 명', field:'connectNm', width: 250},            
            {headerName: '설명', field:'programNm', width: 750},
            
        ];

        this.columnDefsSub = [
            {headerName: 'No.', width : 80, valueGetter: (params) => {return params.node.rowIndex + 1 }, editable: false},
            {headerName: '사이트 ID', headerClass: 'require-column', field:'siteId', width: 300, hide: true}, 
            {headerName: '연결 ID', headerClass: 'require-column', field:'connectId', width: 300, hide: true},
            {  headerName: '토픽 ID'
             , headerClass: 'require-column'
             , field:'topicId'
             , width: 200
             , editable: function(params){ 
                if(params.node.data.new){
                  return true
                }else{
                  return false
                }
              } 
            },
            {headerName: '설명', field:'topicDesc', width: 840},
            {  headerName: '상태'
             , field:'submissionStatCd'
             , width: 200
             , editable: false
             , cellRenderer: 'select'
             , cellRendererParams: {
                   options : vm.options["TOPIC_STAT_CD"],
                   detailCd: 'key',  //서버로 부터 받은 key defalut-"detailCd"
                   detailNm: 'value' //서버로 부터 받은 value defalut-"detailNm"
              }             
            },
            {  headerName: '정지/시작'
             , field:'operate'
             , width: 150
             , editable: false
             , cellStyle : {textAlign: 'center'}
             , cellRenderer: function(params){
                  if(params.node.data.new){    
                    return ""
                  }
                  else if(params.node.data.submissionStatCd == '20'){    
                    return "<div><i class='fas fa-stop'></i></div>"
                  }else{
                    return "<div><i class='fas fa-play'></i></div>"
                  }
               }             
            },
            {headerName: '서브미션 ID', field:'submissionId', width: 400, hide: true , editable: false}
        ];        
    },
    //Main 그리드 SelctionChange 발생
    onSelectionChangedMain(event) {
       this.deleteList = []
       this.searchTopicList();
    },        
    goOpen() {
      
      const vm = this
      
      vm.subData = []

      // code list 조회
      this.$store.commit('loading') 
      this.$http
        .post(_url("/api/connect/site"), {
          siteId: this.form.siteId,
          connectId: this.form.connectId,
          connectTypeCd: 'kafka'
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
    searchTopicList(){

      const voCellRange = this.gridApi.getCellRanges()
      const rowIndex = voCellRange[0].startRow.rowIndex

      const rowModel = this.gridApi.getModel();
      const voRow = rowModel.getRow(rowIndex);

      //const voRow = this.gridApi.getSelectedRows() //선택된 Row

       this.$store.commit('loading') 
       this.$http
        .post("/api/topic/list", {
          siteId: voRow.data.siteId
          ,connectId: voRow.data.connectId
        })
        .then(response => {
          console.log(response.data)
          this.subData = response.data
        }).finally(() => {
          this.$store.commit('finish')
        });
    },
    save() {

      if(!this.gridRequireCheck([this.$refs.gridSub])) return;     

      let data = this.subData.filter(x => x.chg)
      
      if (this.deleteList.length > 0) {
        let work = []
        _.forEach(this.deleteList, x => {
          work.push(this.$http.delete('/api/topic/', {
            params: x              
          }))
        })
        Promise.all(work)
          .then(() => {
            _proceed.apply(this, [data])
          })
      } else {
        _proceed.apply(this, [data])
      }
      
      function _proceed(data) {
        this.$store.commit('loading')          
        this.$http
          .put('/api/topic/save',this.subData)
          .then(response => {
            this.$swal({ type: 'success', text: '저장되었습니다.' });
            this.searchTopicList();
        }).finally(() => {
          this.$store.commit('finish')
        });
      }
    },
    deleteRow() {

      try{
        
        const row = this.gridApiSub.getSelectedNodes()

        if(row.length < 1)
          throw '선택된 행이 없습니다.'

        if(row[0].data.submissionStatCd === "20")
          throw '데이터 수집 중인 토픽은 삭제할 수 없습니다.'

        let index = row[0].rowIndex
                
        this.deleteList.push({
          siteId: row[0].data.siteId,
          connectId: row[0].data.connectId,
          topicId: row[0].data.topicId,
        })

        this.subData.splice(index, 1)

      }catch (e) {
        this.$swal({
          type: 'warning',
          text: e
        })
      }
    },
    addRow() {
      
      //사이트(부모 테이블) 선택 Row
      //const voRow = this.gridApi.getSelectedRows() //선택된 Row
      const voCellRange = this.gridApi.getCellRanges()
      const rowIndex = voCellRange[0].startRow.rowIndex

      const rowModel = this.gridApi.getModel();
      const voRow = rowModel.getRow(rowIndex);

      if(voRow.length < 1){
        this.$swal({ type: 'warning', text: '선택된 목록 선택 후 추가 가능합니다.' })
        return;
      }
      
      //선택된 row 다음에 insert
      const subRow = this.gridApiSub.getSelectedNodes()     
      const subRowIndx = subRow.length < 1 ? 0 : subRow[0].rowIndex + 1

      this.subData.splice(subRowIndx, 0, {
        new: true,
        siteId: voRow.data.siteId,
        connectId: voRow.data.connectId
      })

    }, 
    //그리드 Cell 변경 이벤트
    onCellValueChanged(event) {
        const idx = event.rowIndex
        this.subData[idx].chg = true
    },
    //그리드 Cell 클릭 함수
    onCellClickedSub(event) {
      
      const field = event.colDef.field
      const topicId = event.node.data.topicId
      const statCd = event.node.data.submissionStatCd
      
      if(field === "operate" && statCd){

        let infoTxt = "";

        if(statCd === "20"){
          infoTxt = "토픽(" + topicId + ") 데이터 수집을 중지 하시겠습니까?"
        }else{
          infoTxt = "토픽(" + topicId + ")의 데이터 수집을 활성화 하시겠습니까?"
        }
         
        this.$swal({
          type: "info",
          text: infoTxt,
          showCancelButton: true,
          confirmButtonText: "예",
          cancelButtonText: "아니오"
        }).then(result => {
          if (result.value) {
            //alert("Spark Api 호출 작업 예정")
            this.$store.commit('loading') 
            this.$http
              .put("/api/topic/operate", {
                  siteId: event.node.data.siteId
                , connectId: event.node.data.connectId
                , topicId: topicId
                , submissionStatCd: event.node.data.submissionStatCd
              }).then(response => {
                  this.$swal({ type: 'success', text: '처리되었습니다.' });
                  this.searchTopicList();
              }).finally(() => {
                this.$store.commit('finish')
              });
          }
        });
      }
    },
    queryTopicStatCd() {
      const vm = this
      this.$store.commit('loading')
      this.$http.get('/api/code/combo', {
        params: {
          groupCd: 'TOPIC_STAT_CD'
        }
      }).then(response => {
        vm.options['TOPIC_STAT_CD'] = response.data        
      }).catch(response => {
        return response
      }).finally(() => {
        this.$store.commit('finish')
      })
    },             
  },
  beforeMount() {
    this.frameworkComponents = {//그르드에서 사용할 외부 comp 등록
      select: SelectCellRenderer
    };
  },  
  mounted() {
    this.goOpen();
  },
  created() {
    this.queryTopicStatCd();    
  },    
};
</script>