<template>
	<div>
		<ul class="nav nav-tabs">
			<li v-for="(tabList,i) in tabLists" :key="i" class="nav-item">
				<a :class="tabList.headClass" data-bs-toggle="tab" :href="tabList.headCode" @click="goStage(tabList.headCode)">{{tabList.name}}</a>
			</li>
			<slot name="head"></slot>
		</ul>
		<div v-if="chStage=='#AiModuleChart1' || chStage=='#AiModuleChart2'" style="padding: 0.5rem 2rem;">
			<slot name="stage"></slot>
		</div>
		<div id="myTabContent" class="tab-content">
			<slot name="content"></slot>
		</div>
	</div>
</template>
<script>

export default {
	name: 'Tab',
	props: {
		tabLists: {
			type: Array,
			required: true
		},
		stage:{
			type:String,
			required: false
		}
	},
	watch:{
	stage : function(val){
	  this.chStage = val;
	},
	chStage : function(val){
		this.$emit('changeStage',val)
	}
  },
	data() {
		return {
			chStage:''
		}
	},
	mounted() {
		this.chStage = this.stage;
	},
	methods:{
		goStage(num){
			this.chStage=num
			switch(this.chStage) {
				case '#AssetInfo':
				this.tabLists[0].contClass = "tab-pane fade show active"
				this.tabLists[0].headClass = "nav-link active"
				this.tabLists[1].contClass = "tab-pane fade"
				this.tabLists[1].headClass = "nav-link"
				this.tabLists[2].contClass = "tab-pane fade"
				this.tabLists[2].headClass = "nav-link"
				break;
				case '#AiModuleChart1':
				this.tabLists[0].contClass = "tab-pane fade"
				this.tabLists[0].headClass = "nav-link"
				this.tabLists[1].contClass = "tab-pane fade show active"
				this.tabLists[1].headClass = "nav-link active"
				this.tabLists[2].contClass = "tab-pane fade"
				this.tabLists[2].headClass = "nav-link"
				break;
				case '#AiModuleChart2':
				this.tabLists[0].contClass = "tab-pane fade"
				this.tabLists[0].headClass = "nav-link"
				this.tabLists[1].contClass = "tab-pane fade"
				this.tabLists[1].headClass = "nav-link"
				this.tabLists[2].contClass = "tab-pane fade show active"
				this.tabLists[2].headClass = "nav-link active"
				break;
				default:
				break;
			}
			this.$store.state.tabList = this.tabLists;
      this.$store.commit('finish');
		}
	}
}
</script>