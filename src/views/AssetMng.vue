<template>
  <div class="inner-box">
  <form @submit.prevent="save"> 
    <div class="menu-head">
      <h3 class="float-start">자산 관리</h3>
      <div class="float-end pt-2">
        <button type="button" class="btn btn-info btn-sm me-1" @click="goOpen">
          <i class="fa fa-search"></i>
          조회
        </button>
      </div>
    </div>

  </form>
  <!-- 검색조건 영역 -->
  <!-- <div class="search-form">
    <div class="form-group">
      <label class="control-label">사이트 명</label>
      <div class="form-input">
        <input class="input Rt-M tal" type="text" id="group_cd" v-model="form.siteId" />
      </div>
    </div>
  </div> -->
    <!-- 테이블 -->
    <div class="table-area">
      <div class="table-b">
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
    
		<div class="menu-head">
        <div class="left">          
          <div class="float-start">
            <h4 class="ico_table_name"><i class="far fa-bookmark"></i>&nbsp;&nbsp;자산</h4>
          </div>
          <div class="float-end pt-1">
            <button class="btn btn-outline-primary btn-sm me-1"  @click="addAssetSub()">
              <i class="fas fa-plus"></i>
            </button>
            <button class="btn btn-outline-light btn-sm me-1" @click="doModeling()">
              <i class="fas fa-save"></i>
              모델링
            </button>
          </div>
        </div>   
        <div class="right">
          <div class="float-start">
            <h4 class="ico_table_name"><i class="far fa-bookmark"></i>&nbsp;&nbsp;자산 상세정보</h4>
          </div>
          <div class="float-end pt-1">
            
            <button class="btn btn-outline-copy btn-sm me-1" @click="copyTag()" v-if="focusAssetId && !form.isNew && form.modelConfirmYn!=='Y'">
              <i class="fas fa-copy"></i>
              태그복사
            </button>
            <button class="btn btn-outline-primary btn-sm me-1" @click="addAsset()">
              <i class="fas fa-plus"></i>
              신규
            </button>
            <button class="btn btn-outline-light btn-sm me-1" @click="deleteAsset()">
              <i class="fas fa-trash-alt"></i>
              삭제
            </button>                        
            <button class="btn btn-outline-light btn-sm me-1"  @click="buttonClickEventSave()">
              <i class="fas fa-save"></i>
              저장
              </button>
          </div>
        </div>
    </div>
    <div class="table-area tree-view">
      <div class="table-b">
        <div class="form">
          <div class="drive-panel">
            <div class="drive-header dx-treeview-item"><div class="dx-treeview-item-content"><i class="dx-icon dx-icon-factory"/><span>{{focusSiteNm}}</span></div></div>
            <DxSortable
              filter=".dx-treeview-item"
              group="shared"
              data="driveC"
              :allow-drop-inside-item="true"
              :allow-reordering="true"
            >
              <DxTreeView
                id="treeviewDriveC"
                data-structure="tree"
                :expand-nodes-recursive="false"
                :ref="treeViewDriveCRef"
                :items="itemsDriveC"
                :width="350"
                :height="470"
                display-expr="name"
                @item-click="assetListClick"
              />
            </DxSortable>
          </div>
          <div class="drive-panel">
            <div class="drive-header dx-treeview-item"><div class="dx-treeview-item-content"><i class="dx-icon dx-icon-tag"/><span>Data Spec</span></div></div>
            <DxSortable
              filter=".dx-treeview-item"
              group="shared"
              data="driveD"
              :allow-drop-inside-item="true"
              :allow-reordering="true"
              @drag-change="onDragChange"
              @drag-end="onDragEnd"
            >
              <DxTreeView
                id="treeviewDriveD"
                data-structure="tree"
                :expand-nodes-recursive="false"
                :ref="treeViewDriveDRef"
                :items="itemsDriveD"
                :width="350"
                :height="470"
                display-expr="name"
              />
            </DxSortable>
          </div>
        </div>
      </div>
    </div>

    <div class="table-area right">
      <div class="table-b">
        <section class="modal-tag-body pop-content" style='height:550px;'>
            <div class="inner-box">
              <div class="table-area">
                  <table id="basic" class="table">
                      <colgroup>
                          <col width="50%">
                          <col width="15%">
                          <col width="35%">
                      </colgroup>
                      <tbody>
                       <tr>
                          <th class="tp-a" rowspan="8">
                              <div> 
                                 <img id="img" :src="form.downloadUrl" style="width:90%;height:475px" alt="Image" v-if = "form.downloadUrl"/>
                              </div>
                          </th>
                          <th class="tp-a">자산 ID</th>
                          <td colspan="2">
                            <div class="td-s-thumb search-area">
                              <div class="ip-box rs-mt2" style="width:100%;" v-if = "form.isNew">
                                <input class="modal-tag-input" type="text" v-model="form.assetId">
                                <button class="icon is-right" @click="popMongoDbCollection()"><i class="fas fa-search"></i></button>
                              </div>
                              <div v-else>
                                {{form.assetId}}
                              </div>
                            </div>
                          </td>
                      </tr> 
                      <tr>
                          <th class="tp-a">자산명</th>
                          <td colspan="2">
                            <input class="modal-tag-input" type="text" v-model="form.assetNm">
                          </td>
                      </tr>
                      <tr>
                          <th class="tp-a">계층그룹</th>
                          <td  colspan="2">
                            <div>
                            {{form.assetGroup}}
                            </div>
                          </td>
                      </tr>
                      <tr>
                          <th class="tp-a">자산상태</th>
                          <td colspan="2"> 
                            <div class="search_con search-area">
                                <b-select class="select is-fullwidth" v-model="form.assetStatCd">
                                    <option value=''>==전체==</option>
                                    <option
                                            v-for="item in assetStatCds"
                                            :key="item.key"
                                            :value="item.key"
                                            v-text="item.value"/>
                                </b-select>
                            </div>
                          </td>
                      </tr>
                        
                      <tr>
                          <th class="tp-a">상위자산</th>
                          <td colspan="2">
                            {{form.upAssetId}}
                          </td>
                      </tr>
                      <tr>
                          <th class="tp-a">비고</th>
                          <td colspan="2"> 
                            <textarea class="modal-tag-input" style="height:170px;" type="text" v-model="form.assetDesc" ></textarea>
                          </td>
                      </tr>
                      <tr>
                          <th class="tp-a">모델링여부</th>
                          <td colspan="2"> 
                            <input type="checkbox" v-model="form.modelConfirmYn" disabled="disabled">
                            <label style="padding-bottom: 0px"><div hidden>완료</div></label>
                          </td>
                      </tr>
                      <tr>
                          <th class="tp-a">이미지 파일</th>
                          <td colspan="2">
                            <!-- <input class="modal-tag-input" style="width:200px" type="text"> -->
                            <div class="scan-btn" v-if = "!form.isNew">
                              <input type="file" ref="file" @change="proceedFileUpload()" style="display: none;" accept="image/jpeg,image/gif,image/png,image/tiff,application/pdf,application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.openxmlformats-officedocument.wordprocessingml.template" multiple/>
                              <button @click="fileDownload()"><i class="fas fa-download"></i></button>
                              <button @click="startFileUpload()"><i class="fas fa-plus"></i></button>
                              <button @click="clearAll()"><i class="far fa-trash-alt"></i></button>
                            </div>                            
                          </td>
                      </tr>                      
                      <tr>
                      </tr>                                            
                      </tbody>
                  </table>
              </div>
            </div>
          </section>        
      </div>
    </div>
    <br>
  </div>
</template>
<script>
import _ from "lodash";

import common from '@/mixin/common';

import MongoDb from '@/components/MongoDbCollection.vue';
import AssetTagCopy from '@/components/AssetTagCopy.vue';
import TagInfoPopup from '@/components/TagInfoPopup.vue';
import DxTreeView from 'devextreme-vue/tree-view';
import DxSortable from 'devextreme-vue/sortable';
import service from './data.js';

const treeViewDriveCRef = 'treeViewDriveC';
const treeViewDriveDRef = 'treeViewDriveD';

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

// let itemsAssetTree = [];
// let itemsTagTree = [];

export default {
  mixins: [common],
  name: "siteMng",
  components: {
    DxTreeView, DxSortable
  },  
  data() {
    return {
      title: "사이트관리",
      deleteid: "",
      deleteList: [],
      assetStatCds: [],
      form: {
        isNew: false,
        siteId: "",
        assetId: "",
        assetNm: "",
        assetGroup: "",
        assetDesc: "",
        upAssetId: "",
        assetStatCd: "",
        fileName: "",
        storedName: "",
        downloadUrl: "",
        modelConfirmYn: ""
      },
      focusSiteId: "",
      focusSiteNm: '',
      focusAssetId: "",
      focusTagId: "",
      focusAssetGroup: "",
      focusIcon: "",
      data: [],
      treeAssetData: [],
      treeTagData: [],
      unRegTagData: [],
      gridOptions: {         
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
      frameworkComponents: null,
      itemsDriveC: [],
      itemsDriveD: [],
      treeViewDriveCRef,
      treeViewDriveDRef,
      //트리뷰 doubleClick용 변수선언
      timeout : null,
      lastComponent: {}
    };
  },
  computed: {
    treeViewDriveC: function() {
      return this.$refs[treeViewDriveCRef].instance;
    },
    treeViewDriveD: function() {
      return this.$refs[treeViewDriveDRef].instance;
    }    
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
              , width: 300
              , editable: function(params){ 
                  if(params.node.data.new){
                    return true
                  }else{
                    return false
                  }
                }               
            }, 
            {headerName: '사이트 명', field:'siteNm', width: 300},
            {headerName: '설명', field:'siteDesc', width: 1153},
        ];
    },
    //Main 그리드 SelctionChange 발생
    onSelectionChangedMain(event) {
      //초기화
      this.form = {
        isNew: false,
        siteId: "",
        assetId: "",
        assetNm: "",
        assetGroup: "",
        assetDesc: "",
        upAssetId: "",
        assetStatCd: "",
        fileName: "",
        storedName: "",
        downloadUrl: "",
        modelConfirmYn: ""
        };

      this.focusAssetId = null
      this.focusAssetGroup = null
      this.focusTagId = null

      // this.itemsDriveC = [];
      this.itemsDriveD = [];
      
      const voCellRange = this.gridApi.getCellRanges()
      const rowIndex = voCellRange[0].startRow.rowIndex

      const rowModel = this.gridApi.getModel();
      const voRow = rowModel.getRow(rowIndex);
      
      if(voRow){
        this.focusSiteId = voRow.data.siteId
        this.focusSiteNm = voRow.data.siteNm
      }
       
      //사이트 하위 자산 및  태그 조회
      this.doGetAssetAndTag(voRow.data.siteId);

    },
    doGetAssetAndTag(agSiteId){
      //사이트별 자산 리스트 조회
      this.$store.commit('loading') 
      this.$http
        .post(_url("/api/asset/tree/list"), {
          siteId: agSiteId
        })
        .then(response => {
          this.treeAssetData = response.data;          
        }).finally(() => {
          this.$store.commit('finish')
          this.doGetTagList(agSiteId);
        });
    },
    doGetTagList(argSiteId){
      //사이트별 태그 리스트 조회
      this.$http
        .post(_url("/api/tag/site"), {
          siteId: argSiteId
        })
        .then(response => {
          this.treeTagData = response.data;          
        }).finally(() => {
          this.$store.commit('finish')

          this.doMakeTreeAssetData(argSiteId);
        });
    },
    doMakeTreeTagData(){
      let vm = this

      this.itemsDriveD = [];

      //서버로 부터 받은 태그 데이터 트리뷰 데이터 형태에 맞도록 변환[START]
      this.unRegTagData.forEach(v=>{

        if(v.key !== "_id"){
          let tag = {
              id: v.key,
              name: [v.key, v.dataType].join(' - '),
              dataType: v.dataType,
              icon: 'tag',
              isDirectory: false
          };
          this.itemsDriveD.push(tag)
        }

      })
      //서버로 부터 받은 태그 데이터 트리뷰 데이터 형태에 맞도록 변환[END]
    },
    doMakeTreeAssetData(argSiteId){
      //사이트별 조회된 자산과 태그 데이터를 트리 형태로 변경
      let vm = this

      this.itemsDriveC = [];

      //서버로 부터 받은 데이터 트리뷰 데이터 형태에 맞도록 변환[START]
      //[STEP-1] 자산 리스트 추출
        
        //[STEP-1-1] 레벨별 자산 추출
        let assetListLv1 = this.treeAssetData.filter(x => x.level === 1)
        let assetListLv2 = this.treeAssetData.filter(x => x.level === 2)
        let assetListLv3 = this.treeAssetData.filter(x => x.level === 3)

        //[STEP-1-2] 자산 Lv1 ITEM push
        assetListLv1.forEach(lv1 => {
          let asset = {
              id: lv1.assetId,
              name: lv1.assetNm + " [" + lv1.assetId + "]",
              assetGroup: lv1.assetGroup,
              icon: 'asset',
              isDirectory: true,
              expanded: true,
              items: []
          };
          
          //하위 자산(Lv2) Search
          assetListLv2.filter(x => x.upAssetId === lv1.assetId).forEach(lv2 =>{
            let asset2 = {
                id: lv2.assetId,
                name: lv2.assetNm + " [" + lv2.assetId + "]",
                assetGroup: lv2.assetGroup,
                icon: 'sensor',
                isDirectory: true,
                expanded: true,
                items: []
            };

            //하위 자산(Lv3) Search
            assetListLv3.filter(x => x.upAssetId === lv2.assetId).forEach(lv3 =>{
              let asset3 = {
                  id: lv3.assetId,
                  name: lv3.assetNm + " [" + lv3.assetId + "]",
                  assetGroup: lv3.assetGroup,
                  icon: 'bolt',
                  isDirectory: true,
                  expanded: true,
                  items:[]
              };

              //Lv3 Tag import
              // vm.treeTagData.filter(x => x.assetId === lv3.assetId).forEach((vv,i) => {
              //   let tag3 = {
              //     //id: [vv.assetId, vv.tagId].join('-'),
              //     id: vv.tagId,
              //     name: vv.tagNm,
              //     icon: 'tag',
              //     isDirectory: false
              //   };
              //   asset3.items.push(tag3)
              // })

              asset2.items.push(asset3)
            })

            //Lv2 Tag import
            // vm.treeTagData.filter(x => x.assetId === lv2.assetId).forEach((vv,i) => {
            //   let tag2 = {
            //     //id: [vv.assetId, vv.tagId].join('-'),
            //     id: vv.tagId,
            //     name: vv.tagNm,
            //     icon: 'tag',
            //     isDirectory: false
            //   };
            //   asset2.items.push(tag2)
            // })

            asset.items.push(asset2)
          }) 

          //Lv1 Tag import
          // vm.treeTagData.filter(x => x.assetId === lv1.assetId).forEach((vv,i) => {
          //   let tag1 = {
          //     //id: [vv.assetId, vv.tagId].join('-'),
          //     id: vv.tagId,
          //     name: vv.tagNm,
          //     icon: 'tag',
          //     isDirectory: false
          //   };
          //   asset.items.push(tag1)
          // })

          this.itemsDriveC.push(asset)
        })
      //서버로 부터 받은 데이터 트리뷰 데이터 형태에 맞도록 변환[END]
      
      this.doGetRegTagList();
    },
    doMoveFocusingAsset(){
      
      let vm = this

      setTimeout(() => {
        let scrollItem = vm.focusTagId ? vm.focusTagId : vm.focusAssetId
        vm.treeViewDriveC.scrollToItem(scrollItem)

        if(scrollItem){
          let $currentNode = vm.treeViewDriveC.element().querySelectorAll(`[data-item-id="${scrollItem}"]`)
          $currentNode[0].classList.add("dx-state-focused")
        }
        
      },300);
    } ,      
    goOpen() {
      const vm = this

      // code list 조회
      this.$store.commit('loading') 
      this.$http
        .post(_url("/api/site/list"), {
          siteId: ''
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
    buttonClickEventSave(){
      this.$swal({
          type: 'info',
          text: `변경사항을 저장 하시겠습니까?`,
          showCancelButton: true,
          confirmButtonText: '예',
          cancelButtonText: '아니오',
      }).then((result) => {
          if (result.value) {
            
            let apiUrl = '/api/asset/save';

            if(this.form.isNew){
               apiUrl =  '/api/asset/save/new';
               this.focusAssetId = this.form.assetId
               this.focusTagId = ""
            }

            this.$store.commit('loading')

            this.$http
              .put(apiUrl,this.form)
              .then(response => {
                this.$swal({ type: 'success', text: '저장되었습니다.' });
                
                this.doGetAssetAndTag(this.focusSiteId)
                this.doGetAssetInfo(this.form.assetId);
                //자산별 미등록 태그 조회
                this.doGetUnRegTagList()
            }).finally(() => {
              this.$store.commit('finish')
              
            });
          }
      });
    }, 
    addAsset(){
      //초기화
      this.form = {
        isNew: true,
        siteId: this.focusSiteId,
        assetId: "",
        assetNm: "",
        assetGroup: 1,
        assetDesc: "",
        upAssetId: "",
        assetStatCd: "",
        fileName: "",
        storedName: "",
        downloadUrl: "",
        modelConfirmYn: ""
        };
      
    } , 
    addAssetSub(){
      
      if(this.focusIcon === "tag") {
        this.$swal({type: 'warning',text: '태그 하위로는 자산을 추가할 수 없습니다.'}) 
        return;
      } 
      
      if(this.focusAssetGroup > 2) {
        this.$swal({type: 'warning',text: '3그룹 계층 이상 하위로 자산 추가할 수 없습니다.'}) 
        return;
      } 

      //초기화
      this.form = {
        isNew: true,
        siteId: this.focusSiteId,
        assetId: "",
        assetNm: "",
        assetGroup: this.focusAssetGroup + 1,
        assetDesc: "",
        upAssetId: this.focusAssetId,
        assetStatCd: "",
        fileName: "",
        storedName: "",
        downloadUrl: "",
        modelConfirmYn: ""
        };          
      
    } ,     
    deleteAsset() {

      this.$swal({
          type: 'info',
          text:  this.form.assetNm + ` 삭제 하시겠습니까?`,
          showCancelButton: true,
          confirmButtonText: '예',
          cancelButtonText: '아니오',
      }).then((result) => {
          if (result.value) {
            
            this.$store.commit('loading')

            this.$http.delete('/api/asset/' + this.form.siteId  + '/' + this.form.assetId)
            .then(response => {
              this.$swal({ type: 'success', text: '삭제 되었습니다.' });
              this.form = {isNew : false};
              this.onSelectionChangedMain();
            }).finally(() => {
              this.$store.commit('finish')
            });
          }
      });
    },   
    doModeling(){
      
      if(this.focusIcon !== "asset") {
        this.$swal({type: 'warning',text: '모델링 진행할 최상위 자산[계층그룹 : 1]을 선택하여 주십시오.'}) 
        return;
      } 

      this.$swal({
          type: 'info',
          text:  this.form.assetNm + ` 모델링 진행 하시겠습니까?`,
          showCancelButton: true,
          confirmButtonText: '예',
          cancelButtonText: '아니오',
      }).then((result) => {
          if (result.value) {
            
            this.$store.commit('loading')

            this.$http.put('/api/asset/modeling', {
                siteId : this.focusSiteId,
                assetId : this.focusAssetId
              }).then(response => {
                  this.$swal({ type: 'success', text: '모델링 완료 하였습니다.' });
                  this.doGetAssetAndTag(this.focusSiteId)
              }).catch(response => {                
                this.$store.commit('finish')
              })
          }
      });      
    }, 
    popMongoDbCollection(){
      //MongoDb Collection 조회 팝업 호출
      const that = this;

      this.$modal.open({
          component: MongoDb,
          parent: this,
          width: 700,
          events: {
              close(obj) {
                  that.form.assetId = obj.key;
              }
          }
      }); 
    },
    doGetRegTagList(){

      //등록된 자산 및 태그 배열
      let assetIdx = this.itemsDriveC.findIndex(x => x.id === this.focusAssetId)
      let assetInfo = this.itemsDriveC[assetIdx]
      
      assetInfo.items = []
      
      //태그 리스트 배열
      this.treeTagData.filter(x => x.assetId === this.focusAssetId).forEach((vv,i) => {
        
        let tag = {
          id: vv.tagId,
          name: vv.tagNm,
          icon: 'tag',
          isDirectory: false
        };
        assetInfo.items.push(tag)
      })
      
      this.itemsDriveC.splice(assetIdx, 1, assetInfo)

      this.doMoveFocusingAsset()

    },    
    doGetUnRegTagList(){
      
      //자산별 미등록 태그 리스트
      let vm = this
      
      this.$http.put('/api/asset/mongodb', {
          siteId : this.focusSiteId,
          assetId : this.focusAssetId
        }).then(response => {
            this.unRegTagData = response.data;
            this.doMakeTreeTagData();
        }).catch(response => { 
        })
    },
    getAssetStatCdCombo() {
        this.$http.get(`/api/code/combo`, {params: {groupCd: "ASSET_STAT_CD"}})
            .then(response => {
                this.assetStatCds = response.data;
            });
    },
    startFileUpload() {
      // Trigger click event
      this.$refs.file.click()
    },
    proceedFileUpload() {
      let files = this.$refs.file.files

      // Ok to proceed
      if (files.length == 1) {
        let form = new FormData()

        _.forEach(files, (file, i) => {
          form.append(`files`, file)
        })

        this.$store.commit('loading')
        
        this.$http.post(`/api/asset/addFiles/${this.focusAssetId}`, form, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then(response => {
          this.$swal({
            type: 'success',
            text: '파일이 업로드 되었습니다.'
          }).then(() => {
            this.doGetAssetInfo();
          })
          return response
        }).catch(response => {
          this.$swal({
            type: 'error',
            text: '파일업로드에 실패하였습니다.'
          })
          return response
        }).finally(() => {          
          this.$store.commit('finish')
        })
      }
    },
    fileDownload() {
      this.$store.commit('loading');
      this.$http.get(`api/asset/download/${this.form.storedName}`, { responseType: 'blob' })
        .then((response) => {
            const downloadedfile = new Blob([response.data], { type: 'blob' });
            let url;

            const contentDisposition = response.headers['content-disposition'];
            let fileName = 'unknown';
            if (contentDisposition) {
                const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
                if (fileNameMatch.length === 2)
                    fileName = fileNameMatch[1];
            }

            if (window.navigator.msSaveOrOpenBlob) {
                window.navigator.msSaveOrOpenBlob(downloadedfile, fileName);
            } else {
                url = window.URL.createObjectURL(downloadedfile);

                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', this.form.fileName);
                document.body.appendChild(link);
                link.click();
            }
            
        }).catch(response => {
          console.log("catch response" , response)
        }).finally(()=> {
          this.$store.commit('finish');
        });
    }, 
    clearAll() {
      this.$store.commit('loading')
      this.$http.post('/api/asset/removeFiles', {
        documentHId: this.focusAssetId
      }).then(() => {
        this.form.fileName = "";
        this.form.storedName = "";
        this.form.downloadUrl = "";
      }).finally(() => {
        this.$store.commit('finish')
      })
    },       
    doGetAssetInfo(agAssetId){
      //자산 상세정보 조회
      this.$store.commit('loading') 
      this.$http
        .post(_url("/api/asset/list"), {
          siteId: this.focusSiteId ,
          assetId: agAssetId? agAssetId : this.focusAssetId
        })
        .then(response => {
          this.form = response.data[0];          
        }).finally(() => {
          this.$store.commit('finish')
        });
    },
    doRegAseetTagDb(argTagKey, agTagNm, agDataType, agAssetId){
      //자산에 맵핑한 태그 DB 반영
      this.$http.put('/api/asset/reg/tag', {
                siteId : this.focusSiteId,
                mappingKey : argTagKey ,
                tagNm : agTagNm ,
                dataTypeCd : agDataType,
                assetId : agAssetId 
              }).then(response => {
                  // this.$swal({ type: 'success', text: '저장되었습니다' });
                  // this.getMySet()
              }).finally(() => {
                this.focusTagId = null
                this.doGetAssetAndTag(this.focusSiteId)
              })
    },
    copyTag(){
      //MongoDb Collection 조회 팝업 호출
      const that = this;

      this.$modal.open({
          component: AssetTagCopy,
          parent: this,
          width: 700,
          props: {
            siteId: this.focusSiteId,
            siteNm: this.focusSiteNm,
            assetId: this.focusAssetId,
            assetNm: this.form.assetNm
          },          
          events: {
              close(obj) {
                that.doGetAssetAndTag(that.focusSiteId)
                that.doGetAssetInfo(that.form.assetId);
                //자산별 미등록 태그 조회
                that.doGetUnRegTagList()
              }
          }
      }); 
    } ,     
    // 트리 View 함수 [START]
    onDragChange(e) {
      if(e.fromComponent === e.toComponent) {
        const fromNode = this.findNode(this.getTreeView(e.fromData), e.fromIndex);
        const toNode = this.findNode(this.getTreeView(e.toData), this.calculateToIndex(e));
        if (toNode !== null && this.isChildNode(fromNode, toNode)) {
          e.cancel = true;
        }
      }
    },
    onDragEnd(e) {

      if(e.fromComponent === e.toComponent && e.fromIndex === e.toIndex) {
        return;
      }

      const fromTreeView = this.getTreeView(e.fromData);
      const toTreeView = this.getTreeView(e.toData);

      const fromNode = this.findNode(fromTreeView, e.fromIndex);
      const toNode = this.findNode(toTreeView, this.calculateToIndex(e));

      if(e.dropInsideItem && toNode !== null && !toNode.itemData.isDirectory) {
        return;
      }

      const fromTopVisibleNode = this.getTopVisibleNode(e.fromComponent);
      const toTopVisibleNode = this.getTopVisibleNode(e.toComponent);

      const fromItems = this.getItems(e.fromData);
      const toItems = this.getItems(e.toData);
      
      if(toNode.itemData.icon === "tag"){
        this.$swal({type: 'warning',text: '태그에는 매핑 할 수 없습니다. 자산에 매핑 해주세요.'})
        return;
      }

      //이미 등록되어 있는 태그이거나 모델링이 완료된 자산에는 맵핑 불가
      this.$http.put('/api/asset/chk/tag', {
          siteId : this.focusSiteId,
          mappingKey : fromNode.key,
          assetId : toNode.key
      }).then(response => {

        this.moveNode(fromNode, toNode, fromItems, toItems, e.dropInsideItem);

        this.itemsDriveC = [].concat(this.itemsDriveC);
        this.itemsDriveD = [].concat(this.itemsDriveD);

        this.$root.$nextTick(() => {
          fromTreeView.scrollToItem(fromTopVisibleNode);
          toTreeView.scrollToItem(toTopVisibleNode);
        });
      
        this.doRegAseetTagDb(fromNode.key, fromNode.text, fromNode.itemData.dataType , toNode.key);

      })
    },
    assetListClick(e){
      let vm = this

      let scrollItem = vm.focusTagId ? vm.focusTagId : vm.focusAssetId
      
      if(scrollItem){
          let $currentNode = vm.treeViewDriveC.element().querySelectorAll(`[data-item-id="${scrollItem}"]`)
          $currentNode[0].classList.remove("dx-state-focused");
      }
      
      //선택한 row가 자산인 경우 상세정보 조회
      let icon = e.itemData.icon
      this.focusIcon = e.itemData.icon
      
      if(icon === "tag"){
        this.focusAssetId = e.itemData.id.split('-')[0]
        this.focusTagId = e.itemData.id

        this.focusAssetGroup = null

        if(!this.form.assetId || (this.form.assetId != this.focusAssetId)){
          this.doGetAssetInfo();
        }
      }else{
        this.focusAssetId = e.itemData.id
        this.focusAssetGroup = e.itemData.assetGroup

        this.focusTagId = null
      
        //자산상세정보 조회
        this.doGetAssetInfo()
        
        //자산별 미등록 태그 조회
        this.doGetUnRegTagList()

        //자산별 등록 태그 조회
        this.doGetRegTagList()
      }

      //더블클릭
      if (!this.timeout) {
          this.lastComponent = e.itemData;  
          this.timeout = setTimeout(() => {
              vm.timeout = null;  
          }, 300);
      } else if (e.itemData === this.lastComponent) {  
          //태그 팝업 호출          
          this.$modal.open({
            component: TagInfoPopup, 
            parent: this, 
            width: 1800, 
            props: {
              siteId: this.focusSiteId, 
              assetId: this.focusAssetId, 
              tagId: e.itemData.id
            },
            events: {
              callBackFunc(obj) {
                vm.doGetAssetAndTag(vm.focusSiteId);	
              }
            }
          })  
      } 
    },
    getTreeView(driveName) {
      return driveName === 'driveC'
        ? this.treeViewDriveC
        : this.treeViewDriveD;
    },

    getItems(driveName) {
      return driveName === 'driveC'
        ? this.itemsDriveC
        : this.itemsDriveD;
    },

    calculateToIndex(e) {
      if(e.fromComponent != e.toComponent || e.dropInsideItem) {
        return e.toIndex;
      }

      return e.fromIndex >= e.toIndex
        ? e.toIndex
        : e.toIndex + 1;
    },

    findNode(treeView, index) {
      const nodeElement = treeView.element().querySelectorAll('.dx-treeview-node')[index];
      if(nodeElement) {
        return this.findNodeById(treeView.getNodes(), nodeElement.getAttribute('data-item-id'));
      }
      return null;
    },

    findNodeById(nodes, id) {
      for(var i = 0; i < nodes.length; i++) {
        if(nodes[i].itemData.id == id) {
          return nodes[i];
        }
        if(nodes[i].children) {
          const node = this.findNodeById(nodes[i].children, id);
          if(node != null) {
            return node;
          }
        }
      }
      return null;
    },

    moveNode(fromNode, toNode, fromItems, toItems, isDropInsideItem) {
      const fromNodeContainingArray = this.getNodeContainingArray(fromNode, fromItems);
      const fromIndex = fromNodeContainingArray.findIndex(item => item.id == fromNode.itemData.id);
      fromNodeContainingArray.splice(fromIndex, 1);

      if(isDropInsideItem) {
        toNode.itemData.items.splice(toNode.itemData.items.length, 0, fromNode.itemData);
      } else {
        const toNodeContainingArray = this.getNodeContainingArray(toNode, toItems);
        const toIndex = toNode === null
          ? toNodeContainingArray.length
          : toNodeContainingArray.findIndex(item => item.id == toNode.itemData.id);
        toNodeContainingArray.splice(toIndex, 0, fromNode.itemData);
      }
    },

    getNodeContainingArray(node, rootArray) {
      return node === null || node.parent === null
        ? rootArray
        : node.parent.itemData.items;
    },

    isChildNode(parentNode, childNode) {
      let parent = childNode.parent;
      while(parent !== null) {
        if(parent.itemData.id === parentNode.itemData.id) {
          return true;
        }
        parent = parent.parent;
      }
      return false;
    },

    getTopVisibleNode(component) {
      const treeViewElement = component.element();
      const treeViewTopPosition = treeViewElement.getBoundingClientRect().top;
      const nodes = treeViewElement.querySelectorAll('.dx-treeview-node');
      for(let i = 0; i < nodes.length; i++) {
        const nodeTopPosition = nodes[i].getBoundingClientRect().top;
        if(nodeTopPosition >= treeViewTopPosition) {
          return nodes[i];
        }
      }

      return null;
    }
    // 트리 View 함수 [END]          
  },
  beforeMount() {
    this.createColumnDefs(); //그리드 컬럼정의 함수 호출
  },  
  mounted() {
    this.getAssetStatCdCombo();
    this.goOpen();
  }
  
};
</script>

<style>
    div.left {
        width: 50%;
        float: left;
        box-sizing: border-box;
    }
    div.right {
        width: 48.91%;
        float: right;
        box-sizing: border-box;
    }
    .tree-view {
        width: 50%;
        float: left;
        box-sizing: border-box;
        background-color: #F6F6F6;
        color: black;
        height: 550px;
    } 

  .form {
      display: flex;
  }

  .form>div {
      display: inline-block;
      vertical-align: top;
  }

  #treeViewAsset,
  #treeViewTag {
      margin-top: 10px;
  }

  .drive-header {
      min-height: auto;
      padding: 0px;
      cursor: default;
  }

  .drive-panel {
      padding: 20px 30px;
      font-size: 115%;
      font-weight: bold;
      border-right: 1px solid rgba(165, 165, 165, 0.4);
      height: 100%;
  }

  .drive-panel:last-of-type {
      border-right: none;
  }    

  .asset_tr {
      height: 40px;
  }
</style>