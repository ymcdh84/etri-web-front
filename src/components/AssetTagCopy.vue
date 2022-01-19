<template>
<div class="modal-card" id="draggable">
  <header class="modal-card-head pop-header" style="width: 500px">
    <div class="modal-card-title tit">
      태그 Copy
      <button type="button" class="btn-close" aria-label="close" @click="$parent.close()"></button>
    </div>
  </header>
  <section class="modal-card-body pop-content" style="width: 500px">
          <div class="btn-wrap btn-type1 clearfix" >
        <button type="button" class="btn btn-success btn-sm" @click="assetTagCopy()">
          <i class="fas fa-save"></i>
          복사
        </button>
      </div>
    <div class="table-area copy-tree-view">
      <div class="table-b">
        <div class="form">
          <div class="drive-panel"  style="text-align: left;">
            <div class="drive-header dx-treeview-item"><div class="dx-treeview-item-content"><i class="dx-icon dx-icon-factory"/><span>{{siteNm}}</span></div></div>
              <DxTreeView
                id="treeviewDriveC"
                data-structure="tree"
                :expand-nodes-recursive="false"
                :items="itemsDriveC"
                :width="400"
                :height="470"
                display-expr="name"
                @item-click="assetListClick"
              />
          </div>
        </div>
      </div>
    </div>    
  </section>
</div>
</template>

<script>

import DxTreeView from 'devextreme-vue/tree-view';

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
  props: {
    'siteId': {
      type: String,
      required: true
    },
    'siteNm': {
      type: String,
      required: true
    },
    'assetId': {
      type: String,
      required: true
    },
    'assetNm': {
      type: String,
      required: true
    }    
  },  
  name: "ModalSlot",
  components: {
    DxTreeView
  },   
  data() {
    return {
      focusAssetId: "",
      focusAssetNm: "",
      focusIcon: "",
      itemsDriveC: [],
      treeAssetData: [],
      treeTagData: [],      
      //트리뷰 doubleClick용 변수선언
      timeout : null,
      lastComponent: {}      
    }
  },
  methods: {
    assetTagCopy(){

      if(!this.focusAssetId){
        this.$swal({type: 'warning', text: '복사할 자산을 선택해 주세요.'});
        return;
      }

      this.$swal({
          type: 'info',
          text:  this.focusAssetNm + `의 태그 복사하시겠습니까?\n기존 등록되어 있던 태그는 삭제 후 복사됩니다.`,
          showCancelButton: true,
          confirmButtonText: '예',
          cancelButtonText: '아니오',
      }).then((result) => {
          if (result.value) {
            
            this.$store.commit('loading')

            this.$http.put('/api/asset/copy/tag/' + this.siteId  + '/' + this.assetId+ '/' + this.focusAssetId)
            .then(response => {
               this.$swal({ type: 'success', text: '복사 완료하였습니다.' });
               this.$emit('close');
            }).finally(() => {
              this.$store.commit('finish')
            });

          }
      });
    },
    assetListClick(e){      
      let vm = this
      
      //선택한 row가 자산인 경우 상세정보 조회
      let icon = e.itemData.icon
      this.focusIcon = e.itemData.icon
      
      if(icon === "tag"){
        this.focusAssetId = ''
        this.focusAssetNm = ''
      }else{
        this.focusAssetId = e.itemData.id
        this.focusAssetNm = e.itemData.name
      }
    },
	  doGetAssetAndTag(agSiteId){
		  //사이트별 자산 리스트 조회
		  this.$store.commit('loading') 
		  this.$http
			.post(_url("/api/asset/tree/list"), {
			  siteId: agSiteId,
        modelConfirmYn : "Y"
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
              vm.treeTagData.filter(x => x.assetId === lv3.assetId).forEach((vv,i) => {
                let tag3 = {
                  //id: [vv.assetId, vv.tagId].join('-'),
                  id: vv.tagId,
                  name: vv.tagNm,
                  icon: 'tag',
                  isDirectory: false
                };

                asset3.items.push(tag3)
              })

              asset2.items.push(asset3)
            })

            //Lv2 Tag import
            vm.treeTagData.filter(x => x.assetId === lv2.assetId).forEach((vv,i) => {
              let tag2 = {
                //id: [vv.assetId, vv.tagId].join('-'),
                id: vv.tagId,
                name: vv.tagNm,
                icon: 'tag',
                isDirectory: false
              };
              asset2.items.push(tag2)

            })

            asset.items.push(asset2)
          }) 

          //Lv1 Tag import
          vm.treeTagData.filter(x => x.assetId === lv1.assetId).forEach((vv,i) => {
            let tag1 = {
              //id: [vv.assetId, vv.tagId].join('-'),
              id: vv.tagId,
              name: vv.tagNm,
              icon: 'tag',
              isDirectory: false
            };
            asset.items.push(tag1)
          })          

          this.itemsDriveC.push(asset)
        })
      //서버로 부터 받은 데이터 트리뷰 데이터 형태에 맞도록 변환[END]
      
    },	           
  },
  created() {
    //alert("CREATE")
    this.doGetAssetAndTag(this.siteId);
  }, 
}
</script>

<style>
  div.left {
      width: 100%;
      float: left;
      box-sizing: border-box;
  }  
  .copy-tree-view {
      width: 100%;
      float: left;
      box-sizing: border-box;
      background-color: #F6F6F6;
      color: black;
      height: 550px;
  }  
</style>