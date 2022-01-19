<template>
  <div class="inner-box">
  <form @submit.prevent="save"> 
    <div class="menu-head">
      <h3 class="float-start">사이트 관리</h3>
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
  </div>
    <!-- 테이블 -->
    <div class="table-area">
      <div class="table-b">
        
        <div class="menu-head pt-2">
          <div class="float-start">
            <h4 class="ico_table_name"><i class="far fa-bookmark"></i>&nbsp;&nbsp;사이트 목록</h4>
          </div>
          <div class="float-end pt-1">
            <button class="btn btn-outline-primary btn-sm me-1" @click="addRow()">
              <i class="fas fa-plus"></i>
              행추가
            </button>
            <button class="btn btn-outline-light btn-sm me-1" @click="save">
              <i class="fas fa-save"></i>
              저장
            </button>
          </div>
        </div>        
        <ag-grid-vue         
            ref="gridMain"
            style="width: 100%; height: 25vh; min-height: 25px;"
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
            @cell-value-changed="onCellValueChanged"
            @cell-clicked="onCellClicked"
        />
      </div>
    </div>  
    <br>
    <Tab :tabLists="tabLists">
        <div slot="content">
            <div v-for="(tabList,i) in tabLists" :key="i" :class="tabList.contClass" :id="tabList.contCode">
                <component v-bind:is="tabList.contCode" :siteId="siteId" ref="tab"></component>
            </div>      
        </div>
    </Tab>

  </div>
</template>
<script>
import _ from "lodash";

import CheckboxCellRenderer from '@/components/agGrid/checkbox-cell-renderer';
import common from '@/mixin/common';
import Tab from '../components/Tab.vue';
import KafkaConnectTab from '@/components/KafkaConnectTab';
import ButtonCellRenderer from '@/components/agGrid/button-cell-renderer';

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
  name: "siteMng",
  components: {Tab, KafkaConnectTab},
  data() {
    return {
      title: "사이트관리",
      deleteid: "",
      deleteList: [],
      form: {
        siteId: ""
      },
      siteId: "",
      data: [],
      subData: [],
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
          editable: true
      }, 
      tabLists:[
          {name:"KAFKA" ,headCode:"#KafkaConnectTab", contCode:"KafkaConnectTab", headClass:"nav-link active", contClass:"tab-pane fade show active"},
          //{name:"OPC", headCode:"#OpcConnectTab", contCode:"OpcConnectTab", headClass:"nav-link", contClass:"tab-pane fade"},
          // {name:"PLC", headCode:"#PlcConnectTab", contCode:"PlcConnectTab", headClass:"nav-link", contClass:"tab-pane fade"},
          // {name:"모드버스", headCode:"#ModBusConnectTab", contCode:"ModBusConnectTab", headClass:"nav-link", contClass:"tab-pane fade"},
          // {name:"DataBase", headCode:"#DbConnectTab", contCode:"DbConnectTab", headClass:"nav-link", contClass:"tab-pane fade"},
          // {name:"파일/API", headCode:"#FileConnectTab", contCode:"FileConnectTab", headClass:"nav-link", contClass:"tab-pane fade"}
      ],                  
      gridApi: null,
      columnApi: null,
      columnDefs: [],
      frameworkComponents: null,
    };
  },
  methods: {
    //메인그리드 Ready
    onReadyMain(params) {      
        //메인그리드 api 정의
        this.gridApi = this.gridOptions.api;
        this.columnApi = this.gridOptions.columnApi;

        //그리드 너비에 맞게 컬럼 size 조정
        //this.gridApi.sizeColumnsToFit();
    },
    //그리드컬럼 정의
    createColumnDefs() {
        const vm = this
        
        this.columnDefs = [
            {headerName: 'No.', width : 80, valueGetter: (params) => {return params.node.rowIndex + 1 } , editable:false, sortable: false, filter: false, resizable: false},
            {
                headerName: '사이트 ID'
              , field:'siteId'
              , headerClass: 'require-column'
              , width: 300
              , editable: function(params){ 
                  if(params.node.data.new){
                    return true
                  }else{
                    return false
                  }
                }               
            }, 
            {headerName: '사이트 명', field:'siteNm', headerClass: 'require-column', width: 300},
            {headerName: '설명', field:'siteDesc', width: 1053},
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
    //Main 그리드 SelctionChange 발생
    onSelectionChangedMain(event) {
      const voCellRange = this.gridApi.getCellRanges()
      const rowIndex = voCellRange[0].startRow.rowIndex

      const rowModel = this.gridApi.getModel();
      const voRow = rowModel.getRow(rowIndex);

      this.siteId = voRow.data.siteId      
    },        
    goOpen() {
      const vm = this
      
      //탭 컴포넌트 데이터 초기화
      this.$refs.tab[0].dataInit();

      // code list 조회
      this.$store.commit('loading') 
      this.$http
        .post(_url("/api/site/list"), {
          siteId: this.form.siteId
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
    save() {

      if(!this.gridRequireCheck([this.$refs.gridMain])) return;     
          
        this.$store.commit('loading')          
        this.$http
          .put('/api/site/save',this.data)
          .then(response => {
            this.$swal({ type: 'success', text: '저장되었습니다.' });              
            this.goOpen()
        
        }).finally(() => {
          this.$store.commit('finish')
        });
      
    },
    addRow() {
      //선택된 row 다음에 insert
      const row = this.gridApi.getSelectedNodes()     
      const rowIndx = row.length < 1 ? 0 : row[0].rowIndex + 1

      this.data.splice(rowIndx, 0, {
        new: true,
        siteId: "",
        siteNm: "",
        siteDesc: ""
      })
    }, 
    //그리드 Cell 변경 이벤트
    onCellValueChanged(event) {
        const idx = event.rowIndex
        this.subData[idx].chg = true
    },
    //그리드 Cell 클릭 함수
    onCellClicked(event) {
      const idx = event.rowIndex
      const field = event.colDef.field
      
      const siteId = event.node.data.siteId
      //const sRoleCd = event.node.data.roleCd
             
      if(field === "delete"){        
        this.$http.delete('/api/site/', {
          params: {siteId : siteId}              
        }).then(response => {
          this.$swal({ type: 'success', text: '삭제 되었습니다.' });
          this.goOpen()
          
        })
      }

    },         
  },
  beforeMount() {
    
    this.createColumnDefs(); //그리드 컬럼정의 함수 호출
    
    this.frameworkComponents = {//그르드에서 사용할 외부 comp 등록
      checkboxRenderer: CheckboxCellRenderer,   
      button: ButtonCellRenderer   
    };

  },  
  mounted() {
    this.goOpen();
  }
};
</script>