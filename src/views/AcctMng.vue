<template>
<div class="inner-box">
  <form @submit.prevent="buttonClickEventSave">
    <div class="content-name">
      <h2 class="dp-ib">계정과목관리</h2>
      <div class="btn-wrap btn-type1 clearfix">
        <button type="button" class="btn-size btn-gray fl_left" @click="query()">
          <span class="btn-icon"><i class="fas fa-search"></i></span>
          조회
        </button>
        <button type="submit" class="btn-size btn-blue fl_left">
          <span class="btn-icon"><i class="fas fa-save"></i></span>
          저장
        </button>
      </div>
    </div>
  </form>
  <!-- 검색영역 -->
  <div class="search-form">
    <search-comp v-model="params" :options="{ type: '02', compCd: 'compCd', authorize: true }" />
    <div class="form-group">
      <label class="control-label">계정 코드/명</label>
      <div class="form-input">
        <input type="text" class="input" v-model="params.searchVal" />
      </div>
    </div>
  </div>
  <!-- //검색영역 -->
  <div class="table-area mt20">
    <div class="table-b">
      <div class="table-header">
        <div class="table-name">
          <h3 class="ico_table_name">계정과목 내역</h3>
        </div>
        <div class="btn-wrap btn-type2 clearfix">
          <button class="btn-size btn-w-gray" @click="buttonClickEventAddRow()">
            <span class="btn-icon"><i class="fas fa-plus"></i></span>
            행추가
          </button>
          <button class="btn-size btn-w-gray" @click="buttonClickEventRemoveRow()">
            <span class="btn-icon"><i class="fas fa-trash-alt"></i></span>
            행삭제
          </button>
          <button class="btn-size btn-excel" @click="buttonClickEventToExcel()">엑셀 저장</button>
        </div>
      </div>

      <!-- <dhx-grid ref="grid" v-model="data" :config="config" @constructGridSuccessful="constructGridSuccessful" /> -->
      <ag-grid-vue         
          ref="grid"
          style="width: 100%; height: 70vh; min-height: 50px;"
          class="ag-theme-alpine"
          rowSelection="multiple"
                                            
          :columnDefs="columnDefs"
          :defaultColDef="defaultColDef"        
          :frameworkComponents="frameworkComponents"          
          :rowData="data"
          :gridOptions="gridOptions"                                                
          :suppressRowClickSelection="false"
          
          @grid-ready="onReady"
          @cell-value-changed="onCellValueChanged"
          
      />
    </div>
  </div>
</div>
</template>

<script>
import assert from '@/libs/assert'
import debug from '@/libs/debug'

import CheckboxCellRenderer from '@/components/agGrid/checkbox-cell-renderer'

const _debug = debug('AcctMng')

import common from '@/mixin/common';

export default {
  mixins: [common],
  data() {
    return {
      data: [],      
      params: {
        compCd: undefined,
        searchVal: undefined
      },
      gridOptions: {         
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
      memento: [],
      columnDefs: [],
      frameworkComponents: null,      
      gridApi: null,
      columnApi: null
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
    //그리드 컬럼 정의 함수
    createColumnDefs() {                
        const vm = this
        this.columnDefs = [
            {headerName: 'No.', width : 60, valueGetter: (params) => {return params.node.rowIndex + 1 }},
            {
                headerName:'계정코드'
              , field:'acctCd'
              , headerClass: 'require-column' //필수입력 컬럼 css
              , width:100
              , editable: (params) => { 
                  if(params.node.data.new){
                    return true
                  }else{
                    return false
                  }
                }
              , cellClass : function(params){
                  if(params.node.data.new){
                    return 'bg-lightpink'
                  }else{
                    return 'bg-grey'
                  }
              }
            }, 
            {
                headerName:'계정명칭'
              , field:'acctNm'
              , headerClass: 'require-column' //필수입력 컬럼 css
              , width:250
              , editable: function(params){ 
                  if(params.node.data.new){
                    return true
                  }else{
                    return false
                  }
                }              
              , cellClass : function(params){
                  if(params.node.data.new){
                    return 'bg-lightpink'
                  }else{
                    return 'bg-grey'
                  }
              }
            }, 
            {
                headerName:'계정약어명칭'
              , field:'acctShortNm'
              , headerClass: 'require-column' //필수입력 컬럼 css
              , width:200
              , editable: function(params){ 
                  if(params.node.data.new){
                    return true
                  }else{
                    return false
                  }
                }              
              , cellClass : function(params){
                  if(params.node.data.new){
                    return 'bg-lightpink'
                  }else{
                    return 'bg-grey'
                  }
              }              
            }, 
            {
                headerName:'계정그룹코드'
              , field:'acctGrCd'
              , headerClass: 'require-column' //필수입력 컬럼 css
              , width:120
              , editable: function(params){ 
                  if(params.node.data.new){
                    return true
                  }else{
                    return false
                  }
                }              
              , cellClass : function(params){
                  if(params.node.data.new){
                    return 'bg-lightpink'
                  }else{
                    return 'bg-grey'
                  }
              }
            }, 
            {
                headerName:'법인카드'
              , field:'crdYn'
              , width:100
              , cellRenderer: 'checkboxRenderer'
              , cellRendererParams: {
                    trueValue: true    //true값  지정 defalut-"Y" ex) "Y", true, "1"
                  , falseValue: false  //false값 지정 defalut-"N" ex) "N", false, "0"
              }              
              , cellStyle : {textAlign: 'center'}
            },
            {
                headerName:'세금계산서'
              , field:'bllYn'
              , width:100
              , cellRenderer: 'checkboxRenderer'
              , cellRendererParams: {
                    trueValue: true    //true값  지정 defalut-"Y" ex) "Y", true, "1"
                  , falseValue: false  //false값 지정 defalut-"N" ex) "N", false, "0"
              }  
              , cellStyle : {textAlign: 'center'}
            }, 
            {
                headerName:'기타증빙'
              , field:'evdYn'
              , width:100
              , cellRenderer: 'checkboxRenderer'
              , cellRendererParams: {
                    trueValue: true    //true값  지정 defalut-"Y" ex) "Y", true, "1"
                  , falseValue: false  //false값 지정 defalut-"N" ex) "N", false, "0"
              }  
              , cellStyle : {textAlign: 'center'}
            },
            {
                headerName:'교통비'
              , field:'trYn'
              , width:100
              , cellRenderer: 'checkboxRenderer'
              , cellRendererParams: {
                    trueValue: true    //true값  지정 defalut-"Y" ex) "Y", true, "1"
                  , falseValue: false  //false값 지정 defalut-"N" ex) "N", false, "0"
              }  
              , cellStyle : {textAlign: 'center'}
            }, 
            {
                headerName:'접대비'
              , field:'rcpYn'
              , width:100
              , cellRenderer: 'checkboxRenderer'
              , cellRendererParams: {
                    trueValue: true    //true값  지정 defalut-"Y" ex) "Y", true, "1"
                  , falseValue: false  //false값 지정 defalut-"N" ex) "N", false, "0"
              }  
              , cellStyle : {textAlign: 'center'}
            }, 
            {
                headerName:'미지급'
              , field:'apYn'
              , width:100
              , cellRenderer: 'checkboxRenderer'
              , cellRendererParams: {
                    trueValue: true    //true값  지정 defalut-"Y" ex) "Y", true, "1"
                  , falseValue: false  //false값 지정 defalut-"N" ex) "N", false, "0"
              }  
              , cellStyle : {textAlign: 'center'}
            }, 
            {
                headerName:'부가세'
              , field:'vatYn'
              , width:100
              , cellRenderer: 'checkboxRenderer'
              , cellRendererParams: {
                    trueValue: true    //true값  지정 defalut-"Y" ex) "Y", true, "1"
                  , falseValue: false  //false값 지정 defalut-"N" ex) "N", false, "0"
              }  
              , cellStyle : {textAlign: 'center'}
            },
            {
                headerName:'통제계정'
              , field:'ctrlYn'
              , width:100
              , cellRenderer: 'checkboxRenderer'
              , cellRendererParams: {
                    trueValue: true    //true값  지정 defalut-"Y" ex) "Y", true, "1"
                  , falseValue: false  //false값 지정 defalut-"N" ex) "N", false, "0"
              }  
              , cellStyle : {textAlign: 'center'}
            } ,                     
            {headerName:'미지급 계정 정렬순서', field:'apOrderSeq', width:170},
            {headerName:'비고1', field:'ref1', width:200},
            {headerName:'비고2', field:'ref2', width:200},                                                
            {headerName:'비고3', field:'ref3', width:200},
            {headerName:'수정자', field:'chgNm', width:110},
            {headerName:'수정 일시', field:'chgDtm', width:200},            
            {headerName:'', field:'new', hide : true},
            {headerName:'', field:'chg', hide : true},
        ];
    },        
    //그리드 Cell 변경 이벤트
    onCellValueChanged(event) {
        const idx = event.rowIndex
        const field = event.colDef.field

        // const vm = this
        
        // if(field == "vatYn"){
        //   if(event.node.data.vatYn){
        //     this.columnDefs[12].disabled = false            
        //   }else{
        //     this.columnDefs[12].disabled = true
        //   }
        //   //this.gridApi.redrawRows(event.node);
        //   //this.gridApi.setColumnDefs(this.columnDefs)
        //   //this.gridApi.redrawRows()
          
        //   vm.checkboxDisabled(!event.node.data.vatYn);
        // }

        // if(field == 'crdYn'){
        //   this.createColumnDefs(); 
        // }

        this.data[idx].chg = true
    },
    query() {
      this.$store.commit('loading')
      return this.$http.post('/api/account/list', this.params)
        .then(response => {
          const st = (new Date()).valueOf()
          this.data = response.data.map(x => {
            const chgDtm = this.$moment(x.chgDtm)
            return {
              acctCd: x.acctCd,
              acctNm: x.acctNm,
              acctShortNm: x.acctShortNm,
              acctGrCd: x.acctGrCd,
              erpUseYn: x.erpUseYn === 'Y' ? true : false,
              eaUseYn: x.eaUseYn === 'Y' ? true : false,
              crdYn: x.crdYn === 'Y' ? true : false,
              bllYn: x.bllYn === 'Y' ? true : false,
              evdYn: x.evdYn === 'Y' ? true : false,
              trYn: x.trYn === 'Y' ? true : false,
              ppdYn: x.ppdYn === 'Y' ? true : false,
              rcpYn: x.rcpYn === 'Y' ? true : false,
              apYn: x.apYn === 'Y' ? true : false,
              vatYn: x.vatYn === 'Y' ? true : false,
              ctrlYn: x.ctrlYn === 'Y' ? true : false,
              ppdOrderSeq: x.ppdOrderSeq,
              apOrderSeq: x.apOrderSeq,
              ref1: x.ref1,
              ref2: x.ref2,
              ref3: x.ref3,
              chgId: x.chgId,
              chgNm: x.chgNm || x.chgId,
              useYn: x.useYn,
              chgDtm: chgDtm.isValid() ? chgDtm.format('YYYY-MM-DD HH:mm:ss') : '',
              compCd: x.compCd,
              chg: false
            }
          })

          if(response.data.length == 0){
              this.$swal({ type: 'warning', text: '조회내역이 존재하지 않습니다.' })
          }            
        }).finally(() => {
          this.$store.commit('finish')
        })
    },
    buttonClickEventSave() {
      try {
        
        //그리드 필수입력 체크          
        if(!this.gridRequireCheck([this.$refs.grid])) return;

        const data = this.data.filter(x => x.chg || x.new).map(x => {
          return {
            acctCd: x.acctCd,
            acctNm: x.acctNm,
            acctShortNm: x.acctShortNm,
            acctGrCd: x.acctGrCd,
            erpUseYn: x.erpUseYn ? 'Y' : 'N',
            eaUseYn: x.eaUseYn ? 'Y' : 'N',
            crdYn: x.crdYn ? 'Y' : 'N',
            bllYn: x.bllYn ? 'Y' : 'N',
            evdYn: x.evdYn ? 'Y' : 'N',
            trYn: x.trYn ? 'Y' : 'N',
            ppdYn: x.ppdYn ? 'Y' : 'N',
            rcpYn: x.rcpYn ? 'Y' : 'N',
            apYn: x.apYn ? 'Y' : 'N',
            vatYn: x.vatYn ? 'Y' : 'N',
            ctrlYn: x.ctrlYn ? 'Y' : 'N',
            ppdOrderSeq: x.ppdOrderSeq,
            apOrderSeq: x.apOrderSeq,
            ref1: x.ref1,
            ref2: x.ref2,
            ref3: x.ref3,
            useYn: x.useYn,
            compCd: x.compCd
          }
        })
        
        assert.apply(this, [data.length > 0, '변경된 행이 없습니다.'])

        let emptyAcctCd = data.filter(x => !x.acctCd)
        assert.apply(this, [emptyAcctCd.length === 0, '계정코드는 빈 값일 수 없습니다.'])

        let emptyAcctNm = data.filter(x => !x.acctNm)
        assert.apply(this, [emptyAcctNm.length === 0, '계정명칭은 빈 값일 수 없습니다.'])

        let emptyAcctGrCd = data.filter(x => !x.acctGrCd)
        assert.apply(this, [emptyAcctGrCd.length === 0, '계정그룹코드는 빈 값일 수 없습니다.'])

        this.$http.post('/api/account/save', data)
          .then(response => {
            this.$swal({
              type: 'success',
              text: '저장되었습니다.'
            })
          }).then(this.query)

      } catch (e) {
        this.$swal({
          type: 'error',
          text: e
        })
      }
    },
    buttonClickEventAddRow() {      
      this.data.unshift({
        acctCd: undefined,
        acctNm: undefined,
        acctShortNm: undefined,
        acctGrCd: undefined,
        erpUseYn: true,
        eaUseYn: true,
        crdYn: true,
        bllYn: true,
        evdYn: true,
        trYn: true,
        ppdYn: true,
        rcpYn: true,
        apYn: true,
        vatYn: true,
        ctrlYn: true,
        ppdOrderSeq: undefined,
        apOrderSeq: undefined,
        ref1: undefined,
        ref2: undefined,
        ref3: undefined,
        chgId: undefined,
        chgDtm: undefined,
        useYn: 'Y',
        compCd: this.params.compCd,
        new: true,
        chg: false
      })
    },
    buttonClickEventRemoveRow() {

      var row = this.gridApi.getSelectedNodes()
      
      if(row.length > 0){
        
        const compCd = row[0].data.compCd
        const acctCd = row[0].data.acctCd

        this.data.splice(row[0].rowIndex, 1)
        
        if(!row[0].data.new){
          this.$http.put('/api/account/delete', {
            compCd,
            acctCd
          }).then(response => {
            // Do nothing!
          })
        }
      }else{
        this.$swal({
          type: 'error',
          text: '삭제할 행을 선택하여주세요.'
        })
      }
    },
    buttonClickEventToExcel() {
      this.$refs.grid.toExcel()
    }
  },
  beforeMount() {    
    this.createColumnDefs(); 
    this.frameworkComponents = {
      checkboxRenderer: CheckboxCellRenderer,      
    };
  },
  created() {
    try {
      this.params.compCd = this.$store.state.loginInfo.compCd
    } catch (e) {
      this.params.compCd = undefined
    }

    this.query()
  }

}
</script>
