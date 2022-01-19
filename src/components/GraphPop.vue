<template>
  <layout :graphPop="graphPop">
    <span slot="header">
      (오프라인) 모델 학습 및 탐지지수의 문턱값 설정 결과
      <button type="button" class="btn-close" aria-label="close" @click="closeModal"></button>
    </span>
    <div slot="content" id=popGraph>
      
      <!-- (오프라인) 모델 학습 탐지지수의 문턱값 설정 결과  -->
      <div class="block-size">
        <div class="card text-white bg-dark mb-3 block-size3">
          <div class="card-header">Eigenvalue</div>
          <div class="card-body2" id="eigenvalue"></div>
        </div>
        <div class="card text-white bg-dark mb-3 block-size4">
          <div class="card-header">CPV</div>
          <div class="card-body2" id="cpv"></div>
        </div>
      </div>
      <div class="block-size">
        <div class="card text-white bg-dark mb-3 block-size3">
          <div class="card-header">T2 statistic</div>
          <div class="card-body2" id="t2h"></div>
        </div>
        <div class="card text-white bg-dark mb-3 block-size4">
          <div class="card-header">SPE statistic</div>
          <div class="card-body2" id="speh"></div>
        </div>
      </div>
    </div>
  </layout>
</template>
<script>
import Layout from '@/components/ModalSlot.vue'

export default {
  name:'graphPop',
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
  },
  data() {
    return {
      graphPop:'graphPop',
      pcaX:[],
      eigY:[],
      eigenVData: {
        data: [],
        layout: {
          xaxis: { title: "Principal component", color: "#fff", gridcolor: "#979797"},
          yaxis: { title: "Eigenvalue", color: "#fff", gridcolor: "#979797" },
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
      cpvY:[],
      thCpv:[],
      cpvData: {
        data: [],
        layout: {
          xaxis: { title: "CPV(%)", color: "#fff", gridcolor: "#979797 "},
          yaxis: { title: "Number of PCs", color: "#fff", gridcolor: "#979797"},
          autosize: true,
          font: { color: "#fff", size: 10 },
          paper_bgcolor: "transparent",
          plot_bgcolor: "transparent",
          margin: { b: 60, l: 60, r: 40, t: 15 },
          modebar: { bgcolor: "transparent" },
          legend: {x:0.01, xanchor:'left', y:1}
        },
        config: { responsive: true },
      },
      speH:[],
      thSpe:[],
      speHData: {
        data: [],
        layout: {
          xaxis: { title: "SPE statistic", color: "#fff", gridcolor: "#979797"},
          yaxis: { title: "Frequency", color: "#fff", gridcolor: "#979797"},
          autosize: true,
          font: { color: "#fff", size: 10 },
          paper_bgcolor: "transparent",
          plot_bgcolor: "transparent",
          margin: { b: 60, l: 60, r: 40, t: 15 },
          modebar: { bgcolor: "transparent" },
          legend: {x:1, xanchor:'right', y:1},
          //bargap: 0.05, 
        },
        config: { responsive: true},
      },
      speHDataTemp: {
        data: [],
        layout: {
          xaxis: { title: "SPE statistic", color: "#fff", gridcolor: "#979797"},
          yaxis: { title: "Frequency", color: "#fff", gridcolor: "#979797"},
          autosize: true,
          font: { color: "#fff", size: 10 },
          paper_bgcolor: "transparent",
          plot_bgcolor: "transparent",
          margin: { b: 60, l: 60, r: 40, t: 15 },
          modebar: { bgcolor: "transparent" },
          legend: {x:1, xanchor:'right', y:1},
          //bargap: 0.05, 
        },
        config: { responsive: true},
      },       
      t2H:[],
      thT2:[],
      t2HData: {
        data: [],
        layout: {
          xaxis: { title: "T2 statistic", color: "#fff", gridcolor: "#979797"},
          yaxis: { title: "Frequency", color: "#fff", gridcolor: "#979797"},
          autosize: true,
          font: { color: "#fff", size: 10 },
          paper_bgcolor: "transparent",
          plot_bgcolor: "transparent",
          margin: { b: 60, l: 60, r: 40, t: 15 },
          modebar: { bgcolor: "transparent" },
          legend: {x:1, xanchor:'right', y:1},
          //bargap: 0.05, 
        },
        config: { responsive: true},
      },
      t2HDataTemp: {
        data: [],
        layout: {
          xaxis: { title: "T2 statistic", color: "#fff", gridcolor: "#979797"},
          yaxis: { title: "Frequency", color: "#fff", gridcolor: "#979797"},
          autosize: true,
          font: { color: "#fff", size: 10 },
          paper_bgcolor: "transparent",
          plot_bgcolor: "transparent",
          margin: { b: 60, l: 60, r: 40, t: 15 },
          modebar: { bgcolor: "transparent" },
          legend: {x:1, xanchor:'right', y:1},
          //bargap: 0.05, 
        },
        config: { responsive: true},
      },      
    }
  },
  methods:{
    async getData2(){
      /* Eigenvalue 데이터*/
      await this.$http.get(`/api/asset/pcaData/`,{params:{assetId : this.assetId, stageDivCd:this.stageLevel}})
      .then(response => {

        this.pcaX=response.data.varNo;
        this.eigY=response.data.eigenvalue;
        this.cpvY=response.data.cpv;
        this.thCpv=response.data.thCpv;
        
        this.eigenVPlot();
        this.cpvPlot();
      });
    },
    async getData3(){
      /* SPE Histogram 데이터*/
      await this.$http.get(`/api/asset/histogramData/`,{params:{assetId : this.assetId, detectionIndexCd : 'SPE', stageDivCd:this.stageLevel}})
      .then(response => {

        this.speH = response.data.val;
        this.thSpe = response.data.thVal;
        //this.speHData.layout.xaxis.range = [0,this.thSpe[0]];
        this.speHPlot();
      });
    },
    async getData5(){
      /* T2 Histogram 데이터*/
      await this.$http.get(`/api/asset/histogramData/`,{params:{assetId : this.assetId, detectionIndexCd : 'T2', stageDivCd:this.stageLevel}})
      .then(response => {

        this.t2H = response.data.val;
        this.thT2 = response.data.thVal;
        
        //this.t2HData.layout.xaxis.range = [0,this.thT2[0]];
        this.t2HPlot();
      });
    },
    eigenVPlot() {     
      var eigenV = {
        x: this.pcaX,
        y: this.eigY,
        name: "Eigenvalue",
        type: "bar",
        marker :{ color: '#93c54b'}
      };
      this.eigenVData.data = [eigenV];
      var EigenV = document.getElementById("eigenvalue");
      Plotly.newPlot( EigenV, this.eigenVData.data, this.eigenVData.layout, this.eigenVData.config );
    },
    cpvPlot() {     
      var cpv = {
        x: this.pcaX,
        y: this.cpvY,
        line: { color: "#93c54b", width: 2 },
        name: "CPV",
        mode:"lines",
        type: "scatter",
      };  
      var thCpv = {
        x: this.pcaX,
        y: this.thCpv,
        line: { dash: 'dot', color: "red", width: 2 },
        name: "CPV_th",
        mode:"lines",
        type: "scatter",
      };
      this.cpvData.data = [cpv, thCpv];
      var CPV = document.getElementById("cpv");
      Plotly.newPlot( CPV, this.cpvData.data, this.cpvData.layout, this.cpvData.config );
    },
    speHPlot() {     
      var speHistogram = {
        x: this.speH,
        marker: { color: "#93c54b", line:{color:  "rgba(100, 200, 102, 1)", width:0.5}},
        name: "SPE stat.",
        type: "histogram",
        autobinx: true,
        // xbins: { 
        //   size: 0.0007, 
        // }
      };

      var SPEHistogram = document.getElementById("speh");
      this.speHDataTemp.data = [speHistogram];      
      Plotly.newPlot( SPEHistogram, this.speHDataTemp.data, this.speHDataTemp.layout, this.speHDataTemp.config );

      var stRangeY = this.speHDataTemp.layout.yaxis.range[0];
      var endRangeY = this.speHDataTemp.layout.yaxis.range[1];

      this.speHData.layout.yaxis.range = [stRangeY, endRangeY];

      endRangeY = parseInt(endRangeY);
      this.thSpe = this.thSpe.slice(0,endRangeY);
      this.$store.state.offline.speLimit=this.thSpe;
      this.$store.state.offline.speHData=this.speH;
      this.$store.commit('finish');
      this.speH2Plot();
    },
    speH2Plot() {     
      var speHistogram = {
        x: this.$store.state.offline.speHData,
        marker: { color: "#93c54b", line:{color:  "rgba(100, 200, 102, 1)", width:0.5}},
        name: "SPE stat.",
        type: "histogram",
        autobinx: true,
      };
      var threshold1 = {
        x: this.$store.state.offline.speLimit,
        marker :{ dash: 'dot', color: 'red'},
        name: "Limit",
        type: "scarter",
      };
      var SPEHistogram = document.getElementById("speh");
      this.speHData.data = [speHistogram, threshold1];      
      Plotly.newPlot( SPEHistogram, this.speHData.data, this.speHData.layout, this.speHData.config );
    },
    t2HPlot() {     
      var t2Histogram = {
        x: this.t2H,
        marker: { color: "#93c54b", line:{color:  "rgba(100, 200, 102, 1)", width:0.5}},
        name: "T2 stat.",
        type: "histogram",
        autobinx: true,
      };

      var T2Histogram = document.getElementById("t2h");
      
      this.t2HDataTemp.data = [t2Histogram];
      Plotly.newPlot( T2Histogram, this.t2HDataTemp.data, this.t2HDataTemp.layout, this.t2HDataTemp.config );

      var stRangeY = this.t2HDataTemp.layout.yaxis.range[0];
      var endRangeY = this.t2HDataTemp.layout.yaxis.range[1];

      this.t2HData.layout.yaxis.range = [stRangeY, endRangeY];

      endRangeY = parseInt(endRangeY);
      this.thT2 = this.thT2.slice(0,endRangeY);
      this.$store.state.offline.t2Limit=this.thT2;
      this.$store.state.offline.t2HData=this.t2H;
      this.$store.commit('finish');
      this.t2H2Plot();
    },
    t2H2Plot() {     
      var t2Histogram = {
        x: this.$store.state.offline.t2HData,
        marker: { color: "#93c54b", line:{color:  "rgba(100, 200, 102, 1)", width:0.5}},
        name: "T2 stat.",
        type: "histogram",
        autobinx: true,
      };
      var threshold2 = {
        x: this.$store.state.offline.t2Limit,
        marker :{ dash: 'dot', color: 'red'},
        name: "Limit",
        type: "scarter",
      };
      var T2Histogram = document.getElementById("t2h");
      this.t2HData.data = [t2Histogram, threshold2];
      Plotly.newPlot( T2Histogram, this.t2HData.data, this.t2HData.layout, this.t2HData.config );
    },
    closeModal() {
      this.$parent.close();
    },
  },
  mounted(){
    this.getData2();
    this.speH2Plot();
    this.t2H2Plot();
    this.getData3();
    this.getData5();
  }
}
</script>