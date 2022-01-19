<template>
  <div>
    <div class="menu-head">
      <h2 class="float-start">{{ assetId }}&nbsp;(</h2>
      <h2 :class="assetInfo.stateClass">
        &nbsp;&nbsp;{{ assetInfo.stateName }}
      </h2>
      <h2 class="float-start">&nbsp;&nbsp; - {{assetInfo.procStatNm}} &nbsp;&nbsp;</h2>
      <h2 class="float-start">)</h2>
      <h2 class="float-start">_{{lotNo}}</h2>
    </div>
    <Tab :tabLists="tabList" :stage="stage" @changeStage="changeStage">
      <div slot="head">
        <!-- 검색창 시작 -->
        <form class="d-flex search">
          <input class="form-control input-show" type="text" placeholder="장비명/코드" style="font-size: 12px;" @click="openModal()" />
          <button class="btn btn-primary btn-sm" type="button" @click="openModal()">
            <i class="fa fa-search"></i>
          </button>
        </form>
        <!-- 검색창 끝 -->
      </div>
      <div slot="stage">
        <div class="btn-group" role="group" aria-label="Basic radio toggle button group">
          <input type="radio" class="btn-check" name="btnradio" id="btnradio1" value="10" v-model="stageLevel"/>
          <label class="btn btn-outline-primary" for="btnradio1">Stage 1</label>
          <input type="radio" class="btn-check" name="btnradio" id="btnradio2" value="20" v-model="stageLevel" />
          <label class="btn btn-outline-primary" for="btnradio2">Stage 2</label>
          <input type="radio" class="btn-check" name="btnradio" id="btnradio3" value="30" v-model="stageLevel"/>
          <label class="btn btn-outline-primary" for="btnradio3">Stage 3</label>
          <input type="radio" class="btn-check" name="btnradio" id="btnradio4" value="40" v-model="stageLevel"/>
          <label class="btn btn-outline-primary" for="btnradio4">Stage 4</label>
        </div>
      </div>
      <div slot="content">
        <div v-for="(tabList, i) in tabList" :key="i" :class="tabList.contClass" :id="tabList.contCode">
          <component v-bind:is="tabList.contCode" :assetId="assetId" :stageLevel="stageLevel" :lotNo="lotNo"></component>
        </div>
      </div>
    </Tab>
  </div>
</template>
<script>
import Tab from '../components/Tab.vue';
import AssetInfo from '@/components/AssetInfo';
import AiModuleChart1 from '@/components/AiModuleChart1';
import AiModuleChart2 from '@/components/AiModuleChart2';
import AssetListPop from '@/components/AssetListPop'

export default {
    name:'equipmentDetail',
    components: {Tab,AssetInfo, AiModuleChart1, AiModuleChart2, AssetListPop},
    props: {
        assetId: {
            type: String,
            required: false
        },
        contCode:{
            type:String,
            require:false
        }
    },
    data() {
        return {
            stage:this.$store.state.stage,//'#AssetInfo'
            stageLevel:'',
            tabList:this.$store.state.tabList,
            assetInfo:[],
            setTime:10000, //api 호출 주기(2분)
            lotNo :''
        }
    },
    methods:{
        //장비정보
        assetInfos(){
            this.$http.get(`/api/asset/` + this.assetId)
            .then(response =>{
                this.assetInfo = response.data[0];
                this.assetState(this.assetInfo.assetStatCd);
            })
        },
        //헤더영역(장비상태표시)
        assetState(stateCode){
            switch(stateCode){
                case '0':
                    this.assetInfo.stateName = "Idle"
                    this.assetInfo.stateClass = "float-start text-light"
                    break;
                case '1':
                    this.assetInfo.stateName = "Run"
                    this.assetInfo.stateClass = "float-start text-success"
                    break;
                case '2':
                    this.assetInfo.stateName = "Failure"
                    this.assetInfo.stateClass = "float-start text-danger"
                    break;
                case '3':
                    this.assetInfo.stateName = "Pause"
                    this.assetInfo.stateClass = "float-start text-warning"
                    break;
                case '4':
                    this.assetInfo.stateName = "Machine off line"
                    this.assetInfo.stateClass = "float-start text-secondary"
                    break;
                case '5':
                    this.assetInfo.stateName = "Network off line"
                    this.assetInfo.stateClass = "float-start text-secondary"
                    break;
                default:
                    this.assetInfo.stateName = "Undefind"
                    this.assetInfo.stateClass = "float-start text-secondary"
                    break;
            }

        },
        /*장비검색 팝업창*/
        openModal(){
            let vm = this
            this.$modal.open({
                component: AssetListPop,
                parent: this,
                events: {
                    close(object) {
                        vm.goDetail(object.assetId)
                    }
                }
            })
        },
        /*장비 상세 페이지 이동*/
        goDetail(assetId){
            this.$router.push({
                name: 'equipmentDetail',
                params: {assetId: assetId}
            })
            this.changeStage(this.stage);
        },

        /**stageLevel, lotNo 확인 */
        async getStage(){
            try{
            const response = await this.$http.get(`/api/asset/stageLevel/`,{params:{assetId : this.assetId}})
            this.stageLevel = response.data.stage_div_cd;
            this.lotNo = response.data.lot_no;
            if(!this.stageLevel){
              this.stageLevel=''
              this.lotNo = ''
            }
            this.$store.state.lotNo = this.lotNo;
            this.$store.commit('finish');
			}catch(e){
				this.stageLevel = ''
			}
        },
        changeStage(num){
            this.stage=num;
            this.$store.state.stage = this.stage;
            this.$store.commit('finish');
        }
    },
    created(){
        this.getStage();
    },
    mounted() {
        this.assetInfos();
        clearInterval(this.intervalId)
        this.intervalId = setInterval(function () {
            this.assetInfos();
        }.bind(this), this.setTime)
    },
    destroyed() {
        clearInterval(this.intervalId)
    }, 
}
</script>