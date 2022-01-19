<template>
  <layout>
    <span slot="header">
      {{title}}
      <button type="button" class="btn-close" aria-label="close" @click="closeModal"></button>
    </span>
    <div slot="content">
      <div class="pop-content-search">
          <div class="field has-addons ">
              <div class="pop-s-form ">
                  <span class="pop-c-name">- 장비코드/명</span>
              </div>
              <div class="pop-i-form">
                  <input class="form-control" type="text"  style="height:30px;" v-model="search" @keypress.enter="goSearch">
              </div>
              <button class="btn btn-secondary my-sm-0" style="font-size:0.8rem; padding:0.2rem 0.5rem; height:30px;" type="submit" @click="goSearch"><i class="fa fa-search"></i></button>
          </div>
      </div>

      <div class="grid-wrap">
          <ag-grid-vue 
                  style="width: 100%;"
                  class="ag-theme-alpine grid_search_height_p2"    
                  rowSelection="single"
                  
                  :columnDefs="columnDefs"     
                  :gridOptions="gridOptions"
                  :rowData="rowData"
                  :defaultColDef="defaultColDef"
                  @rowDoubleClicked="rowDoubleClick"
                  @grid-ready="onGridReady"/>
      </div>
    </div>
  </layout>
</template>

<script>
import Layout from '@/components/ModalSlot.vue'
import mixin from '@/mixin';
import {AgGridVue} from 'ag-grid-vue';

export default {
  name: 'Cctr',
  props: ['param'],
  mixins: [ mixin ],
  components: {
    Layout,
    AgGridVue
  },
  data() {
    return {
      title: '장비 조회',
      search: '',
      gridOptions: {
        rowHeight: 35, //2021.08 row 사이즈
      },
      columnDefs:[
        {
          headerName:'No.', 
          field:'no', 
          width:80,
          valueFormatter: function(params) {               
            return params.node.rowIndex+1;
          }
        },
        {
          headerName:'장비코드', 
          field:'assetId', 
          width:400, 
          cellStyle:{textAlign:'left'}
        },
        {
          headerName:'장비명', 
          field:'assetNm', 
          width:400, 
          cellStyle:{textAlign:'left'}
        }
      ],
      defaultColDef: { 
        resizable: true, 
        filter:true, 
        sortable: true 
      },
      rowData: []
    }
  },
  methods: {
    goSearch() {
      this.$http.post(`/api/settings/asset-list/search`,{
        loginId:this.$store.state.loginInfo.loginId,
        assetId:this.search,
        assetNm:this.search,
        assetStatCd:'',
        orderBy:'asset_nm',
      })
       .then(response => {
          this.rowData = response.data;
          this.rowData = this.rowData.filter((x,i) => {
              return x.regYn === "1"
          })

          if(response.data.length === 1) {
            this.$emit('close', response.data[0]);
          }
        })
        .catch(response => {
          console.error("AssetListPop Error");
        })
        .finally(() => {
          this.$store.commit('finish')
        })
    },
    rowDoubleClick(params){
      this.$emit('close', params.data);
    },
    closeModal() {
      this.$parent.close();
    },
    onGridReady(){
      this.gridOptions.api.sizeColumnsToFit();
    }
  },
  mounted() {
    if(this.param !== undefined) this.search = this.param;
    //if(this.search) this.goSearch();
    this.goSearch();
  }
};
</script>

<style scoped>
/* div#gridbox {
  width: 100%;
  height: 100%;
} */

</style>
