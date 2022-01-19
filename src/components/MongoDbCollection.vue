<template>
<div class="modal-card" id="draggable">
  <header class="modal-card-head pop-header" style="width: 500px">
    <div class="modal-card-title tit">
      자산 ID 내역
      <button type="button" class="btn-close" aria-label="close" @click="$parent.close()"></button>
    </div>
  </header>
  <section class="modal-card-body pop-content" style="width: 500px">
    <div class="inner-box">
      <div class="table-area">
        <div class="table-b">
          <ag-grid-vue         
            ref="grid"
            style="width: 100%; height: 55vh; min-height: 150px;"
            class="ag-theme-alpine"    
            rowSelection="multiple"                                  

            :columnDefs="columnDefs"     
            :gridOptions="gridOptions"
            :defaultColDef="defaultColDef"
            :rowData="data"

            @rowDoubleClicked="rowDoubleClick"
            @grid-ready="onReady"
          />

        </div>
      </div>
    </div>
  </section>
</div>
</template>

<script>
import DhxGrid from '@/components/DhxGrid.vue'

export default {
  components: {
    DhxGrid
  },
  name: "ModalSlot",
  data() {
    return {
      data: [],
      isMxMn: true,
      gridOptions: {         
          // onColumnResized: true,
          // enableFilter: true,
          // enableSorting: true,
          // suppressRowTransform: true
      },
      defaultColDef: {         
          resizable: true,
          filter: true,
          sortable: true,
          editable: false
      },              
      gridApi : null ,    //gridAip
      columnApi : null ,  //columApi
      columnDefs: [] ,    //comulum Defs
    }
  },
  methods: {
    //그리드 Ready
    onReady(params) {
      
      //그리드용 api 정의
      this.gridApi = this.gridOptions.api;
      this.columnApi = this.gridOptions.columnApi;
      
      this.createColumnDefs();

      this.query();
    },
    //컬럼정의 함수
    createColumnDefs() { 
        const vm = this

        this.columnDefs = [
          {headerName: 'No.'
          , width : 80
          , valueGetter: (params) => {return params.node.rowIndex + 1 }
          , filter: false
          , sortable: false
          , editable: false
          },
          {
            headerName: '자산ID'
          , width : 350 
          , field: 'key'
          , cellStyle : {'justify-content': 'left', 'display': 'flex'}
          },            
        ];
    },
    rowDoubleClick(params){
      this.$emit('close', params.data);
    },
    query() {
      this.$store.commit('loading')
      this.$http.get('/api/asset/mongodb/collections')
      .then(response => {
          this.data = response.data;
      }).finally(() => {
        this.$store.commit('finish')
      })
    },
  },
}
</script>
