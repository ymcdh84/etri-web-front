<template>
    <div class="inner-box">
        <div class="menu-head">
            <h3 class="float-start fw-bolder">{{title}}</h3>
            <div class="float-end pt-2">
                <button type="button" class="btn btn-info btn-sm me-1" @click="searchList">
                    <i class="fa fa-search"></i>
                    조회
                </button>
                <button type="button" class="btn btn-success btn-sm"  @click="submit">
                    <i class="fas fa-save"></i>
                    저장
                </button>
            </div>
        </div>
        <div class="search-form mb-3">
            <div class="form-group">
                <label class="control-label">장비명/코드</label>
                <div class="form-input">
                    <input type="text" class="input" v-model="search" @keydown.enter="searchList"/>
                </div>
            </div>
        </div>

        <!-- 테이블 -->
       <ag-grid-vue         
        ref="grid"
        style="width: 100%;"
        class="ag-theme-alpine grid_search_height2"    
        rowSelection="multiple"                                  

        :columnDefs="columnDefs"
        :defaultColDef="defaultColDef"
        :gridOptions="gridOptions"       
        :rowData="mysets"
        :frameworkComponents="frameworkComponents"          

        @grid-ready="onReady"
        @cell-value-changed="onCellValueChanged"        
      />       
    </div>
</template>

<script>
    import Vue from 'vue'
    import mixin from '@/mixin';
    import mixinSlip from '@/mixin/slip';
    import SelectCellRenderer from '@/components/agGrid/select-cell-renderer'
    import CheckboxCellRenderer from '@/components/agGrid/checkbox-cell-renderer'

    const bus = new Vue()
    
    export default {
        name: 'AssetListSetting',
        mixins: [mixin, mixinSlip],
        data() {
            return {
                title: '장비설정',
                mysets:[],
                firstdata:[],
                search:'',
                authority: '',
                compCd:'',
                loginId:'',
                defaultColDef: {         
                    resizable: true,
                    filter: true,
                    sortable: true,
                    editable: false,
                    //width: 400 , 
                    cellStyle : {'justify-content': 'center','align-items': 'center', 'display': 'flex','height': '100%'}
                }, 
                gridOptions: {          
                    rowHeight: 35
                },                             
                gridApi : null ,    //gridAip
                columnApi : null ,  //columApi
                columnDefs: [] ,    //comulum Defs
                frameworkComponents: {
                    selectCellRenderer: SelectCellRenderer,
                    checkboxRenderer: CheckboxCellRenderer
                },
            };
        },

        methods: {
            //그리드 Ready
            onReady(params) {            
                //그리드용 api 정의
                //this.gridApi = params.api;
                //this.columnApi = params.columnApi; //params대신 gridOptions 사용가능
                this.gridApi = params.api;
                this.columnApi = params.columnApi;

                this.createColumnDefs();

                this.getMySet();
            },
            //컬럼정의 함수
            createColumnDefs() { 
                const vm = this

                this.columnDefs = [
                    {  
                        headerName: '선택'
                      , field:'regYn'
                      , width : 150
                      , editable: true
                      , cellRenderer: 'checkboxRenderer'
                      , cellRendererParams: {
                           trueValue: "1"    //true값  지정 defalut-"Y" ex) "Y", true, "1"
                         , falseValue: "0"  //false값 지정 defalut-"N" ex) "N", false, "0"
                      }                      
                    },
                    {  
                        headerName: '장비명'
                      , field:'assetNm'                 
                      , width : 840
                      , cellStyle : {'justify-content': 'left', 'display': 'flex'}
                    },                    
                    {  
                        headerName: '장비코드'
                      , field:'assetId'
                      , width: 840
                      , cellStyle : {'justify-content': 'left', 'display': 'flex'}
                    },
                    /*
                    {  
                        headerName: '장비상태'
                      , field:'assetStatCd'
                      , width : 560
                      , cellStyle : {'justify-content': 'left', 'display': 'flex'}
                      , cellRenderer: function(params){                          
                            switch(params.node.data.assetStatCd ){
                                case '0':
                                    return "Idle"
                                case '1':
                                    return "Run"
                                case '2':
                                    return "Failure"
                                case '3':
                                    return "Pause"
                                case '4':
                                    return "Machine off line"
                                case '5':
                                    return "Network off line"
                            }                        
                        }
                    }
                    */
                ];
            },            
            /*장비설정 전체 데이터 가져오기*/
            getMySet() {
                this.$http.get(`/api/settings/${this.$store.state.loginInfo.loginId}`)
                    .then(response => {
                        this.mysets = response.data
                        this.firstdata = this.mysets;
                    });
            },
            searchList(){
                this.$http.post(`/api/settings/asset-list/search`,{
                    loginId:this.$store.state.loginInfo.loginId,
                    assetId:this.search,
                    assetNm:this.search,
                    assetStatCd:'',
                    orderBy:'asset_nm',
                })
                    .then(response => {
                        this.mysets = response.data
                         
                    });
            },
            /*장비리스트(개인화)저장*/
            submit() {
                let saveList = [];
                
                /* 체크된 데이터 가져오기*/
                const grid = this.$refs.grid
                const secData = grid.rowData
                console.log("data===",secData);
                console.log("this.firstdata===",this.firstdata);
                for(let f=0; f<this.firstdata.length; f++){
                    for(let s=0; s<secData.length; s++){
                        if(this.firstdata[f].assetId == secData[s].assetId){
                            this.firstdata[f]=secData[s];
                        }
                    }
                }
                const chkDatas = this.firstdata.filter((x,i) => {
                    return x.regYn === "1"
                })

                saveList = chkDatas
                for(let i=0; i<saveList.length; i++){
                    saveList[i].loginId = this.$store.state.loginInfo.loginId;
                }
                
                this.$http.put(`/api/settings/asset-list/save`,saveList)
                     .then(response => {
                         this.$swal({ type: 'success', text: '저장되었습니다' });
                         this.getMySet()
                         this.search=''
                     }).catch(response => {
                        console.error(response)
                     })
                
            },
            onCellValueChanged(event) {                
                const idx = event.rowIndex
                const field = event.colDef.field
                
                if(field === "regYn"){
                    //row refresh
                    var rows = [];
                    var rowNode = this.gridApi.getDisplayedRowAtIndex(idx);
                    
                    rows.push(rowNode)
                
                    this.gridApi.redrawRows({ rowNodes: rows });
                }
            },
        },
        created() {
            // bus.$on('selectBox.updated', () => {
            //      //셀렉트 박스 안에 맵핑될 데이터가 그리드에 반영되기 위해 비동기 처리
            //      this.createColumnDefs();
            // })
        },
        mounted() {
            this.authority = this.$store.state.loginInfo.authorities[0].roleCd;
            this.loginId = this.$store.state.loginInfo.loginId;
            this.compCd = this.$store.state.loginInfo.compCd;
        }       
    };
</script>
