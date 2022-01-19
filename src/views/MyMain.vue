<template>
  <div>
	<!--검색영역 시작 -->
    <div class="searchBox">
      <fieldset class="form-group float-start">
        <div for="customRange" class=" form-label float-start mt-1" style="margin-left:15px;">sort</div>
        <div class="form-check float-start me-6" style="line-height:1;">
          <input type="range" class="form-range" style="margin-bottom: 8px; padding-left:10px; padding-right:10px;" min="0" max="2" step="1" id="customRange" v-model="customRange">
          <div style="font-size:0.7rem;">Machine State &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Machine Name</div>
        </div>
      </fieldset>
      <fieldset class="form-group">
        <form class="d-flex" style="height:30px;">
          <div class="form-group" style=" height:30px;">
            <select class="form-select2" id="exampleSelect1" style=" height:30px;" v-model="assetState">
              <option value=''>Default</option>
              <option value="0">Idle</option>
              <option value="1">Run</option>
              <option value="2">Failure</option>
              <option value="3">Pause</option>
              <option value="4">Machine off line</option>
              <option value="5">Network off line</option>
            </select>
          </div>
          <input class="form-control me-sm-2" type="text" placeholder="Search" v-model="searchWord" @keydown.enter="goSearch">
          <button class="btn btn-secondary my-sm-0" style="font-size:0.8rem; padding:0.2rem 0.5rem; height:30px;" type="submit" @click="goSearch"><i class="fa fa-search"></i></button>
        </form>
      </fieldset>
        
      
    </div>
	<!--검색영역 끝 -->
	<!--설비 리스트 시작 -->
    <div class="px-6 py-3">
      <draggable v-model="assetLists" v-if=" this.customRange=='1' && this.assetState =='' && this.searchWord == '' ">
        <div v-for="(assetList,al) in assetLists" v-bind:key="al" :class="assetList.stateColor" style="width: 10rem; height: 10rem; cursor: pointer;" @dblclick="goDetail(assetList.assetId)">
          <div class="card-body">
            <h5 class="card-title">{{assetList.assetNm}}</h5>
            <p class="card-text" style="height:20px;">{{assetList.growStateNm}}</p>
            <div class="float-start fs-5 mt-6 me-2"><i :class="assetList.stateIcon"></i></div>
            <div class="float-start fs-5 mt-6 me-2"><i class="fas fa-calendar-check"></i></div>
            <div v-if="assetList.alarmShow == true" class="float-start fs-5 mt-6" :id="assetList.assetId" @click="toolPop(assetList.assetId, toolPopover1)">
              <i class="fas fa-bell"></i>
              <div v-if="toolPopover==assetList.assetId && toolPopover1==true" class="popover fade show bs-popover-end pop-tool" role="tooltip" :id="assetList.assetId" data-popper-placement="right">
                <div class="popover-arrow pop-toolHead"></div>
                <h3 class="popover-header pop-text">{{assetList.alarmId}}&nbsp;({{assetList.alarmDate}})</h3>
                <div class="popover-body">{{assetList.alarmDesc}}</div>
              </div>
            </div>
            
          </div>
        </div>
      </draggable>
      <div v-else v-for="(assetList,al) in assetLists" v-bind:key="al" :class="assetList.stateColor" style="width: 10rem; height: 10rem;" @dblclick="goDetail(assetList.assetId)">
          <div class="card-body">
            <h5 class="card-title">{{assetList.assetNm}}</h5>
            <p class="card-text" style="height:20px;">{{assetList.growStateNm}}</p>
            <div class="float-start fs-5 mt-6 me-2"><i :class="assetList.stateIcon"></i></div>
            <div class="float-start fs-5 mt-6 me-2"><i class="fas fa-calendar-check"></i></div>
            <div v-if="assetList.alarmShow == true" class="float-start fs-5 mt-6" :id="assetList.assetId" @click="toolPop(assetList.assetId, toolPopover1)">
              <i class="fas fa-bell"></i>
              <div v-if="toolPopover==assetList.assetId && toolPopover1==true" class="popover fade show bs-popover-end pop-tool" role="tooltip" :id="assetList.assetId" data-popper-placement="right">
                <div class="popover-arrow pop-toolHead"></div>
                <h3 class="popover-header pop-text">{{assetList.alarmId}}&nbsp;({{assetList.alarmDate}})</h3>
                <div class="popover-body">{{assetList.alarmDesc}}</div>
              </div>
            </div>
          </div>
        </div>

    </div>
	<!--설비 리스트 끝 -->
    
  </div>
    
</template>

<script>
import draggable from 'vuedraggable'
import DhxGrid from '@/components/DhxGrid.vue';
import router from '@/router';

export default {
  name: 'MyMain',
  components: {
    draggable
  },
  //drag&drop 변경위치 저장
  watch:{
    assetLists(){
      if(this.customRange=='1' && this.assetState == '' && this.searchWord == ''){
        this.checkMove();
      }
    },
    customRange(){
      this.goSearch();
    },
    assetState(){
      this.goSearch();
    }
  },
  computed:{

  },
  data() {
    return {
	    setTime:10000, //api 호출 주기(10초)
      assetLists:[],
      searchWord:this.checkParam('searchWord'),
      stateColor:[],
      stateIcon:[],
      assetState:this.checkParam('assetState'),
      customRange:!this.checkParam('customRange') ? '1' :this.checkParam('customRange'),
      customRange2:'',
      checked:'',
	    toolPopover:'',
	    toolPopover1:false,
      alarmGap:'',
      tabList:[
          {name:"장비정보" ,headCode:"#AssetInfo", contCode:"AssetInfo", headClass:"nav-link active", contClass:"tab-pane fade show active"},
          {name:"RealTime Chart", headCode:"#AiModuleChart1", contCode:"AiModuleChart1", headClass:"nav-link", contClass:"tab-pane fade"},
          {name:"PCA Chart", headCode:"#AiModuleChart2", contCode:"AiModuleChart2", headClass:"nav-link", contClass:"tab-pane fade"}
      ],
      stage:'#AssetInfo'
    }
  },
  methods: {
    /** 알림 툴팁 표시 */
    toolPop(id, toolPopover1){
      this.toolPopover=id;
      if(toolPopover1 == false){
        this.toolPopover1=true
      }else{
        this.toolPopover1=false
      }
      
    },
    /*드래그앤드랍 위치 저장 */
    checkMove(){
        for(let i=0; i<this.assetLists.length; i++){
          this.assetLists[i].loginId = this.$store.state.loginInfo.loginId;
          this.assetLists[i].assetOrder =i+1;  
        }
        this.$http.put(`/api/settings/asset-list/save`,this.assetLists)
    },
    /*장비 상세 페이지 이동*/
    goDetail(assetId){
      this.$router.push({
        name: 'equipmentDetail',
        params: {assetId: assetId}
      })
      this.$store.state.stage = this.stage
      this.$store.state.tabList = this.tabList
      this.$store.commit('finish');
    },
    /* 검색조건 저장 */
    goSearch(){  
      var param = {
        'searchWord' : this.searchWord,
        'assetState' : this.assetState,
        'customRange': this.customRange,
      }
      this.$store.commit('setParameter', {dashBoard:param});
      this.getAssetList();      
    },
    /* 장비 조회 */
    getAssetList(){
      switch(this.customRange){
        case '0':
          this.customRange2 = "asset_stat_cd"
          break;
        case '2':
          this.customRange2="asset_nm"
          break;
        default:
          this.customRange2="asset_order"
          break;
      }
      this.$http.post(`/api/settings/asset-list/search`,{
        loginId:this.$store.state.loginInfo.loginId,
        assetId:this.searchWord,
        assetNm:this.searchWord,
        assetStatCd:this.assetState,
        orderBy:this.customRange2,
      })
        .then(response => {
            this.assetLists = response.data
            this.assetLists = this.assetLists.filter((x,i) => {
                  return x.regYn === "1"
              })

            var today = new Date();
            for(let ac=0; ac<this.assetLists.length; ac++){
              if(this.assetLists[ac].alarmDate !== ""){
                var alarmDay = new Date(this.assetLists[ac].alarmDate);
                //console.log("alarmDay==",alarmDay);
                this.alarmGap = (today.getTime() - alarmDay.getTime())/1000/60;
                //console.log("this.alarmGap",this.alarmGap);
                if(this.alarmGap<=10){
                  this.assetLists[ac].alarmShow = true;
                }else{
                  this.assetLists[ac].alarmShow = false;
                }
              }
            }
            
            this.checkState();
            
        });
    },
    /* 장비 상태에 따른 class 적용 */
    checkState(){
      this.stateColor=[];
      this.stateIcon=[];
      for(let sc=0; sc< this.assetLists.length; sc++){
        //console.log([sc],"=",this.assetLists[sc].assetStatCd)
        switch(this.assetLists[sc].assetStatCd){
          case '0':
            this.stateColor.push("card text-white bg-light mb-3 ms-3 float-start")
            this.stateIcon.push("fas fa-hourglass-start")
            break;
          case '1':
            this.stateColor.push("card text-white bg-success mb-3 ms-3 float-start")
            this.stateIcon.push("fas fa-running")
            break;
          case '2':
            this.stateColor.push("card text-white bg-danger mb-3 ms-3 float-start")
            this.stateIcon.push("fas fa-wrench")
            break;
          case '3':
            this.stateColor.push("card text-white bg-warning mb-3 ms-3 float-start")
            this.stateIcon.push("fas fa-exclamation-triangle")
            break;
          case '4':
            this.stateColor.push("card text-white bg-dark mb-3 ms-3 float-start")
            this.stateIcon.push("fas fa-plug")
            break;
          default:
            this.stateColor.push("card text-white bg-secondary mb-3 ms-3 float-start")
            this.stateIcon.push("fas fa-ban")
            break;
        }
      }
      for(let i=0; i<this.assetLists.length; i++){
        this.assetLists[i].stateColor = this.stateColor[i];
        this.assetLists[i].stateIcon = this.stateIcon[i];
      }
    },
    checkParam(flag){
      var result = '';
      var data = this.$store.state.searchParam.dashBoard;
      if(!_.isEmpty(data)){
        result = data[flag];
      }
      return result;
    }
  },
  mounted() {
      this.getAssetList();
      clearInterval(this.intervalId)
      this.intervalId = setInterval(function () {
        this.goSearch();
      }.bind(this), this.setTime)
  },
  destroyed() {
      clearInterval(this.intervalId)
  }, 
};

</script>

