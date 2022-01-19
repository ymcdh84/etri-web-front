<template>  
  <div class="table-area">
    <div class="table-b">        
      <div class="menu-head pt-2">
        <div class="float-start">
          <h4 class="ico_table_name"><i class="far fa-bookmark"></i>&nbsp;&nbsp;KAFKA 연결 정보</h4>
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
          ref="gridKafkaCon"
          style="width: 100%; height: 33vh; min-height: 25px;"
          class="ag-theme-alpine"
                                  
          :columnDefs="columnDefsKafka" 
          :defaultColDef="defaultColDef"        
          :frameworkComponents="frameworkComponents"          
          :rowData="subData"
          :gridOptions="gridOptionsKafka"                                                
          :suppressRowClickSelection="false"
          :enableRangeSelection="true"
          :enableCharts="true"
          
          @grid-ready="onReadyKafka"
          @cell-value-changed="onCellValueChanged"
      />

    </div>
  </div>    
</template>
<script>

import common from '@/mixin/common';

import SelectCellRenderer from '@/components/agGrid/select-cell-renderer'
import NumberInputCellRender from '@/components/agGrid/numberinput-cell-renderer'
import MaskEditCellRenderer from '@/components/agGrid/maskedit-cell-renderer'

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
  name: "KafkaConnectTab",
  props: {
    siteId: {
        type: String,
        required: false
    },
  },  
  data() {
    return {
      subData: [],
      deleteList: [],
      gridOptionsKafka: {         
        //enableColResize: true,
        //enableFilter: true,
        //animateRows: false,
        //enableSorting: true
      },
      defaultColDef: {         
          resizable: true,
          filter: true,
          sortable: true,
          editable: true
      }, 
      gridApi: null,
      columnApi: null,
      columnDefs: [],
      gridApiSub: null,
      columnApiSub: null,      
      columnDefsKafka: [],
      frameworkComponents: {
        select: SelectCellRenderer,
        numberInput: NumberInputCellRender,
        maskEdit: MaskEditCellRenderer
      },  
      connectTypeCd : "kafka",
      options: {
          'CONNECT_STAT_CD': []
      }, 
    };
  },
  methods: {
    //서브그리드 Ready
    onReadyKafka(params) {
        //서브그리드 api 정의
        this.gridApiSub = this.gridOptionsKafka.api;
        this.columnApiSub = this.gridOptionsKafka.columnApi;

      setTimeout(() => {
        this.createColumnDefs();
        //this.gridApiSub.sizeColumnsToFit();
      },300);

        
    },
    //그리드컬럼 정의
    createColumnDefs() {
        const vm = this

        this.columnDefsKafka = [
            {headerName: 'No.', width : 80, valueGetter: (params) => {return params.node.rowIndex + 1 }, editable:false, sortable: false, filter: false, resizable: false},
            {headerName: '사이트ID', field:'siteId', headerClass: 'require-column', width: 150, hide : true}, 
            {   
                headerName: '연결ID'
              , field:'connectId'
              , headerClass: 'require-column'
              , width: 200
              , editable: function(params){ 
                  if(params.node.data.new){
                    return true
                  }else{
                    return false
                  }
                }              
            }, 
            {headerName: '연결명', field:'connectNm', headerClass: 'require-column', width: 200},
            {
                headerName:'연결상태'
              , field:'connectStatCd'
              , width: 150
              , cellRenderer: 'select'
              , cellRendererParams: {
                    options : vm.options["CONNECT_STAT_CD"],
                    detailCd: 'key',  //서버로 부터 받은 key defalut-"detailCd"
                    detailNm: 'value' //서버로 부터 받은 value defalut-"detailNm"
                }
            },
            {headerName: '프로그램명', field:'programNm', width: 350},
            {headerName: 'IP', field:'ip', width: 350},
            {
                headerName: '포트'
              , field:'port'
              , width: 100
              , cellRenderer: 'maskEdit'
              , cellRendererParams: {
                    mask: "XXXX" 
              } 
            },
            {headerName: '로그인ID', field:'loginId', width: 200},
            {headerName: '패스워드', field:'password', width: 203}
        ];
    },   
    goOpen() {
      // code list 조회
      this.$store.commit('loading') 
      this.$http
        .post(_url("/api/connect/list"), {
          siteId: this.siteId,
          connectTypeCd: this.connectTypeCd,
        })
        .then(response => {          
          this.deleteList = []
          this.subData = response.data;          
        }).finally(() => {
          this.$store.commit('finish')
        });
    },
    save() {
      
      //그리드 필수입력 체크          
       if(!this.gridRequireCheck([this.$refs.gridKafkaCon])) return;

      let data = this.subData.filter(x => x.chg)
      
      if (this.deleteList.length > 0) {
        let work = []
        _.forEach(this.deleteList, x => {
          work.push(this.$http.delete('/api/connect/', {
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
        this.$http.put('/api/connect/save', data)
          .then(response => {
            this.$swal({
              type: 'success',
              text: '저장되었습니다.'
            }).then(this.goOpen)
          }).finally(() => {
            this.$store.commit('finish')
          })
      }
    },
    deleteRow() {      
      try{
        
        const row = this.gridApiSub.getSelectedNodes()

        if(row.length < 1)
          throw '선택된 행이 없습니다.'

        let index = row[0].rowIndex
                
        this.deleteList.push({
          siteId: row[0].data.siteId,
          connectId: row[0].data.connectId
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

      //선택된 row 다음에 insert
      const row = this.gridApiSub.getSelectedNodes()     
      const rowIndx = row.length < 1 ? 0 : row[0].rowIndex + 1

      this.subData.splice(rowIndx, 0, {
        new: true,
        siteId: this.siteId,
        connectTypeCd: this.connectTypeCd
      })

      // this.subData.push({
      //   new: true,
      //   siteId: this.siteId,
      //   connectTypeCd: this.connectTypeCd
      // });
    },
    //그리드 Cell 변경 이벤트
    onCellValueChanged(event) {
        const idx = event.rowIndex
        //const field = event.colDef.field
        
        this.subData[idx].chg = true
    },
    queryConnectSelectCd() {
      const vm = this
      this.$store.commit('loading')
      this.$http.get('/api/code/combo', {
        params: {
          groupCd: 'CONNECT_STAT_CD'
        }
      }).then(response => {
        vm.options['CONNECT_STAT_CD'] = response.data        
      }).catch(response => {
        return response
      }).finally(() => {
        this.$store.commit('finish')
      })
    },
    dataInit(){
      this.subData = [];
      this.deleteList = [];
    }    
  },
  watch: {
    siteId(){      
      //사이트 목록의 선택 row가 변경된 경우
      this.subData = [];

      if(this.siteId) this.goOpen()      
    }
  },
  created() {
    this.queryConnectSelectCd();    
  },  
  beforeMount() {    
  },  
  mounted() {  
  }
};
</script>