<template>
  <layout :graphPop="graphPop">
    <span slot="header">
      (오프라인) 특정 고장구간에 대한 기여도 분석결과
      <button type="button" class="btn-close" aria-label="close" @click="closeModal"></button>
    </span>
    <div slot="content" id=popGraph>
      
      <!-- (오프라인) 모델 학습 탐지지수의 문턱값 설정 결과  -->
      <div v-if="kindChart=='SPE'" class="block-size">
        <div class="card text-white bg-dark mb-3 block-size8">
          <div class="card-header">SPE Individual Contribution</div>
          <div class="card-body4" id="speic"></div>
        </div>
      </div>
      <div v-if="kindChart=='SPE'" class="block-size">
        <div class="card text-white bg-dark mb-3 block-size8">
          <div class="card-header">SPE Average Contribution</div>
          <div class="card-body4" id="speac"></div>
        </div>
      </div>
      <div v-if="kindChart=='T2'" class="block-size">
        <div class="card text-white bg-dark mb-3 block-size8">
          <div class="card-header">T2 Individual Contribution</div>
          <div class="card-body4" id="t2ic"></div>
        </div>
      </div>
      <div v-if="kindChart=='T2'" class="block-size">
        <div class="card text-white bg-dark mb-3 block-size8">
          <div class="card-header">T2 Average Contribution</div>
          <div class="card-body4" id="t2ac"></div>
        </div>
      </div>
    </div>
  </layout>
</template>
<script>
import Layout from '@/components/ModalSlot.vue'

export default {
  name:'graphPop2',
  components: {Layout},
  props: {
      assetId: {
        type: String,
        required: false,
      },
      stageLevel: {
        type: String,
        required: false,
      },
      x1:{
        type: Number,
        required: true,
      },
      x2:{
        type: Number,
        required: true,
      },
      kindChart:{
        type: String,
        required: true,
      }
  },
  data() {
    return {
      graphPop:'graphPop',
      speIX:[],
      speIY:[],
      speILimit:[],
      speIData: {
        data: [],
        layout: {
          xaxis: { title: "Variable", color: "#fff", gridcolor: "#979797"},
          yaxis: { title: "Individual Contribution", color: "#fff", gridcolor: "#979797" },
          autosize: true,
          font: { color: "#fff", size: 10 },
          paper_bgcolor: "transparent",
          plot_bgcolor: "transparent",
          margin: { b: 60, l: 60, r: 40, t: 15 },
          modebar: { bgcolor: "transparent" },
          legend: {x:1, xanchor:'right', y:1}
        },
        config: { responsive: true},
      },
      speAY:[],
      speALimit:[],
      speAData: {
        data: [],
        layout: {
          xaxis: { title: "Variable", color: "#fff", gridcolor: "#979797"},
          yaxis: { title: "Average Contribution", color: "#fff", gridcolor: "#979797" },
          autosize: true,
          font: { color: "#fff", size: 10 },
          paper_bgcolor: "transparent",
          plot_bgcolor: "transparent",
          margin: { b: 60, l: 60, r: 40, t: 15 },
          modebar: { bgcolor: "transparent" },
          legend: {x:1, xanchor:'right', y:1}
        },
        config: { responsive: true},
      },
      t2IX:[],
      t2IY:[],
      t2ILimit:[],
      t2IData: {
        data: [],
        layout: {
          xaxis: { title: "Variable", color: "#fff", gridcolor: "#979797"},
          yaxis: { title: "Individual Contribution", color: "#fff", gridcolor: "#979797" },
          autosize: true,
          font: { color: "#fff", size: 10 },
          paper_bgcolor: "transparent",
          plot_bgcolor: "transparent",
          margin: { b: 60, l: 60, r: 40, t: 15 },
          modebar: { bgcolor: "transparent" },
          legend: {x:1, xanchor:'right', y:1}
        },
        config: { responsive: true},
      },
      t2AY:[],
      t2ALimit:[],
      t2AData: {
        data: [],
        layout: {
          xaxis: { title: "Variable", color: "#fff", gridcolor: "#979797"},
          yaxis: { title: "Average Contribution", color: "#fff", gridcolor: "#979797" },
          autosize: true,
          font: { color: "#fff", size: 10 },
          paper_bgcolor: "transparent",
          plot_bgcolor: "transparent",
          margin: { b: 60, l: 60, r: 40, t: 15 },
          modebar: { bgcolor: "transparent" },
          legend: {x:1, xanchor:'right', y:1}
        },
        config: { responsive: true},
      },

    }
  },
  methods:{
    async getData6(){
      /* (오프라인) 특정 고장구간에 대한 기여도 데이터*/
      await this.$http.post(`/api/monitoring/cont/`,{
        siteId:'SITE_00001',
        assetId : this.assetId,
        detectionIndexCd : 'SPE',
        stageDivCd:this.stageLevel,
        lotNo:this.$store.state.lotNo,
        stSeq:this.x1,
        endSeq:this.x2
        
        })
      .then(response => {

        this.speILimit = response.data[1]
        this.speAY = response.data[0]
        this.speALimit = response.data[1]

        //this.speIPlot();
        //this.speAPlot();

      });
      await this.$http.post(`/api/monitoring/cont/test/`,{
        siteId:'SITE_00001',
        assetId : this.assetId,
        detectionIndexCd : 'SPE',
        stageDivCd:this.stageLevel,
        lotNo:this.$store.state.lotNo,
        stSeq:this.x1,
        endSeq:this.x2
        
        })
      .then(response => {

        this.speIX = response.data[0]
        this.speIY = response.data[1]

      });
      this.speIPlot();
      this.speAPlot();

    },
    async getData7(){
      /* (오프라인) 특정 고장구간에 대한 기여도 데이터*/
      await this.$http.post(`/api/monitoring/cont/`,{
        siteId:'SITE_00001',
        assetId : this.assetId,
        detectionIndexCd : 'T2',
        stageDivCd:this.stageLevel,
        lotNo:this.$store.state.lotNo,
        stSeq:this.x1,
        endSeq:this.x2
        
        })
      .then(response => {

        this.t2ILimit = response.data[1]
        this.t2AY = response.data[0]
        this.t2ALimit = response.data[1]

        // this.t2IPlot();
        // this.t2APlot();

      });
      await this.$http.post(`/api/monitoring/cont/test/`,{
        siteId:'SITE_00001',
        assetId : this.assetId,
        detectionIndexCd : 'T2',
        stageDivCd:this.stageLevel,
        lotNo:this.$store.state.lotNo,
        stSeq:this.x1,
        endSeq:this.x2
        
        })
      .then(response => {
       
        this.t2IX = response.data[0]
        this.t2IY = response.data[1]

      });
      this.t2IPlot();
      this.t2APlot();
    },
    speIPlot() {     
      var speI = {
        x: this.speIX,
        y: this.speIY,
        name: "for SPE stat.",
        mode:"markers",
        type: "scatter",
        marker :{ color: '#93c54b'}
      };
      var limitSpeI = {
        x: [1,2,3,4,5],
        y: this.speILimit,
        line: { dash: 'dot', color: "red", width: 2 },
        name: "Limit",
        mode:"lines",
        type: "scatter",
      };
      this.speIData.data = [speI, limitSpeI];
      var SpeIC = document.getElementById("speic");
      Plotly.newPlot( SpeIC, this.speIData.data, this.speIData.layout, this.speIData.config );
    },
    speAPlot() {     
      var speA = {
        x: [1,2,3,4,5],
        y: this.speAY,
        name: "for SPE stat.",
        type: "bar",
        marker :{ color: '#93c54b'}
      };
      var limitSpeA = {
        x: [1,2,3,4,5],
        y: this.speALimit,
        line: { dash: 'dot', color: "red", width: 2 },
        name: "Limit",
        mode:"lines",
        type: "scatter",
      };
      this.speAData.data = [speA, limitSpeA];
      var SpeAC = document.getElementById("speac");
      Plotly.newPlot( SpeAC, this.speAData.data, this.speAData.layout, this.speAData.config );
    },
    t2IPlot() {     
      var t2I = {
        x: this.t2IX,
        y: this.t2IY,
        name: "for T2 stat.",
        mode:"markers",
        type: "scatter",
        marker :{ color: '#93c54b'}
      };
      var limitT2I = {
        x: [1,2,3,4,5],
        y: this.t2ILimit,
        line: { dash: 'dot', color: "red", width: 2 },
        name: "Limit",
        mode:"lines",
        type: "scatter",
      };
      this.t2IData.data = [t2I, limitT2I];
      var T2IC = document.getElementById("t2ic");
      Plotly.newPlot( T2IC, this.t2IData.data, this.t2IData.layout, this.t2IData.config );
    },
    t2APlot() {     
      var t2A = {
        x: [1,2,3,4,5],
        y: this.t2AY,
        name: "for T2 stat.",
        type: "bar",
        marker :{ color: '#93c54b'}
      };
      var limitT2A = {
        x: [1,2,3,4,5],
        y: this.t2ALimit,
        line: { dash: 'dot', color: "red", width: 2 },
        name: "Limit",
        mode:"lines",
        type: "scatter",
      };
      this.t2AData.data = [t2A, limitT2A];
      var T2AC = document.getElementById("t2ac");
      Plotly.newPlot( T2AC, this.t2AData.data, this.t2AData.layout, this.t2AData.config );
    },
    
    closeModal() {
      this.$parent.close();
    },
  },
  mounted(){
    this.getData6();
    this.getData7();
  }
}
</script>