<template>
  <div style="padding: 0rem 2rem 2rem 2rem;">
    <div class="block-size">
      <div class="card text-white bg-dark mb-3 block-size5">
        <div class="card-header">Main heater out
        </div>
        <div class="card-body3" id="mho"></div>
      </div>
      <div class="card text-white bg-dark mb-3 block-size5">
        <div class="card-header">Bottom heater out</div>
        <div class="card-body3" id="bho"></div>
      </div>
      <div class="card text-white bg-dark mb-3 block-size6">
        <div class="card-header">Temp</div>
        <div class="card-body3" id="temp1"></div>
      </div>
    </div>
    <div class="block-size">
      <div class="card text-white bg-dark mb-3 block-size5">
        <div class="card-header">Weight</div>
        <div class="card-body3" id="weight"></div>
      </div>
      <div class="card text-white bg-dark mb-3 block-size5">
        <div class="card-header">S/R speed</div>
        <div class="card-body3" id="srs"></div>
      </div>
      <div class="card text-white bg-dark mb-3 block-size6">
        <div class="card-header">S/L speed</div>
        <div class="card-body3" id="sls"></div>
      </div>
    </div>
    <div class="block-size">
      <div class="card text-white bg-dark mb-3 block-size5">
        <div class="card-header">S/L position</div>
        <div class="card-body3" id="slp"></div>
      </div>
      <div class="card text-white bg-dark mb-3 block-size5">
        <div class="card-header">Sequence info</div>
        <div class="card-body3" id="si"></div>
      </div>
      <div class="card text-white bg-dark mb-3 block-size6">
        <div class="card-header">Growth info</div>
        <div class="card-body3" id="gi"></div>
      </div>
    </div>
  </div>
</template>

<script>
import GraphPop from '@/components/GraphPop.vue'
export default {
  name: 'AiModuleChart1',
  components: {GraphPop},
  props: {
    assetId: {
      type: String,
      required: false,
    },
    stageLevel: {
      type: String,
      required: false,
    },
    lotNo: {
      type: String,
      required: false,
    },
  },
  
  watch:{
    stageLevel : function(val){
      this.getPreData();
      this.stageCd = val;
    }
  },
  
  data() {
    return {
      setTime:10000, //api 호출 주기(2분)
      realY1:[],
      realY2:[],
      realY3:[],
      realY4:[],
      realY5:[],
      realY6:[],
      realY7:[],
      realY8:[],
      realY9:[],
      predY1:[],
      predY2:[],
      predY3:[],
      predY4:[],
      predY5:[],
      predY6:[],
      predY7:[],
      predY8:[],
      predY9:[],
      predH1:[],
      predH2:[],
      predH3:[],
      predH4:[],
      predH5:[],
      predH6:[],
      predH7:[],
      predH8:[],
      predH9:[],
      predL1:[],
      predL2:[],
      predL3:[],
      predL4:[],
      predL5:[],
      predL6:[],
      predL7:[],
      predL8:[],
      predL9:[],
      mainHeaterData: {
        data: [],
        layout: {
          xaxis: { title: "Time(2min. inter)", color: "#fff", gridcolor: "#979797 ", /*dtick: 0.2*/},
          yaxis: { title: "Main Heater out", color: "#fff", gridcolor: "#979797" },
          autosize: true,
          font: { color: "#fff", size: 10 },
          paper_bgcolor: "transparent",
          plot_bgcolor: "transparent",
          margin: { b: 60, l: 60, r: 40, t: 15 },
          modebar: { bgcolor: "transparent" },
          legend: {x:1, xanchor:'right', y:1}
          //showlegend : false
        },
        config: { responsive: true},
      },
      bottomHeaterData: {
        data: [],
        layout: {
          xaxis: { title: "Time(2min. inter)", color: "#fff", gridcolor: "#979797 ", /*dtick: 0.2*/},
          yaxis: { title: "Bottom Heater out", color: "#fff", gridcolor: "#979797" },
          autosize: true,
          font: { color: "#fff", size: 10 },
          paper_bgcolor: "transparent",
          plot_bgcolor: "transparent",
          margin: { b: 60, l: 60, r: 40, t: 15 },
          modebar: { bgcolor: "transparent" },
          showlegend : false
        },
        config: { responsive: true},
      },
      tempData: {
        data: [],
        layout: {
          xaxis: { title: "Time(2min. inter)", color: "#fff", gridcolor: "#979797 ", /*dtick: 0.2*/},
          yaxis: { title: "Temp", color: "#fff", gridcolor: "#979797" },
          autosize: true,
          font: { color: "#fff", size: 10 },
          paper_bgcolor: "transparent",
          plot_bgcolor: "transparent",
          margin: { b: 60, l: 60, r: 40, t: 15 },
          modebar: { bgcolor: "transparent" },
          showlegend : false
        },
        config: { responsive: true},
      },
      weightData: {
        data: [],
        layout: {
          xaxis: { title: "Time(2min. inter)", color: "#fff", gridcolor: "#979797 ", /*dtick: 0.2*/},
          yaxis: { title: "Weight", color: "#fff", gridcolor: "#979797" },
          autosize: true,
          font: { color: "#fff", size: 10 },
          paper_bgcolor: "transparent",
          plot_bgcolor: "transparent",
          margin: { b: 60, l: 60, r: 40, t: 15 },
          modebar: { bgcolor: "transparent" },
          showlegend : false
        },
        config: { responsive: true},
      },
      srSpeedData: {
        data: [],
        layout: {
          xaxis: { title: "Time(2min. inter)", color: "#fff", gridcolor: "#979797 ", /*dtick: 0.2*/},
          yaxis: { title: "S/R Speed", color: "#fff", gridcolor: "#979797" },
          autosize: true,
          font: { color: "#fff", size: 10 },
          paper_bgcolor: "transparent",
          plot_bgcolor: "transparent",
          margin: { b: 60, l: 60, r: 40, t: 15 },
          modebar: { bgcolor: "transparent" },
          showlegend : false
        },
        config: { responsive: true},
      },
      slSpeedData: {
        data: [],
        layout: {
          xaxis: { title: "Time(2min. inter)", color: "#fff", gridcolor: "#979797 ", /*dtick: 0.2*/},
          yaxis: { title: "S/L Speed", color: "#fff", gridcolor: "#979797" },
          autosize: true,
          font: { color: "#fff", size: 10 },
          paper_bgcolor: "transparent",
          plot_bgcolor: "transparent",
          margin: { b: 60, l: 60, r: 40, t: 15 },
          modebar: { bgcolor: "transparent" },
          showlegend : false
        },
        config: { responsive: true},
      },
      slPositionData: {
        data: [],
        layout: {
          xaxis: { title: "Time(2min. inter)", color: "#fff", gridcolor: "#979797 ", /*dtick: 0.2*/},
          yaxis: { title: "S/L Position", color: "#fff", gridcolor: "#979797" },
          autosize: true,
          font: { color: "#fff", size: 10 },
          paper_bgcolor: "transparent",
          plot_bgcolor: "transparent",
          margin: { b: 60, l: 60, r: 40, t: 15 },
          modebar: { bgcolor: "transparent" },
          showlegend : false
        },
        config: { responsive: true},
      },
      seqInfoData: {
        data: [],
        layout: {
          xaxis: { title: "Time(2min. inter)", color: "#fff", gridcolor: "#979797 ", /*dtick: 0.2*/},
          yaxis: { title: "Sequence info", color: "#fff", gridcolor: "#979797" },
          autosize: true,
          font: { color: "#fff", size: 10 },
          paper_bgcolor: "transparent",
          plot_bgcolor: "transparent",
          margin: { b: 60, l: 60, r: 40, t: 15 },
          modebar: { bgcolor: "transparent" },
          showlegend : false
        },
        config: { responsive: true},
      },
      growthInfoData: {
        data: [],
        layout: {
          xaxis: { title: "Time(2min. inter)", color: "#fff", gridcolor: "#979797 ", /*dtick: 0.2*/},
          yaxis: { title: "Growth info", color: "#fff", gridcolor: "#979797" },
          autosize: true,
          font: { color: "#fff", size: 10 },
          paper_bgcolor: "transparent",
          plot_bgcolor: "transparent",
          margin: { b: 60, l: 60, r: 40, t: 15 },
          modebar: { bgcolor: "transparent" },
          showlegend : false
        },
        config: { responsive: true},
      },
    }
  },
  methods:{
    async getPreData(){
      
      /* prdicted 데이터 */
      await this.$http.get(`/api/asset/predicted1/`,{params:{assetId : this.assetId, stageDivCd:this.stageLevel, predictDivCd:"P"}})
      .then(response => {
        this.predY1 = response.data.factor1;
        this.predY2 = response.data.factor2;
        this.predY3 = response.data.factor3;
        this.predY4 = response.data.factor4;
        this.predY5 = response.data.factor5;
        this.predY6 = response.data.factor6;
        this.predY7 = response.data.factor7;
        this.predY8 = response.data.factor8;
        this.predY9 = response.data.factor9;
      });
      
      /* prdicted 상한치 데이터 */
      await this.$http.get(`/api/asset/predicted1/`,{params:{assetId : this.assetId, stageDivCd:this.stageLevel, predictDivCd:"H"}})
      .then(response => {
        this.predH1 = response.data.factor1;
        this.predH2 = response.data.factor2;
        this.predH3 = response.data.factor3;
        this.predH4 = response.data.factor4;
        this.predH5 = response.data.factor5;
        this.predH6 = response.data.factor6;
        this.predH7 = response.data.factor7;
        this.predH8 = response.data.factor8;
        this.predH9 = response.data.factor9;
      });
      /* prdicted 하한치 데이터 */
      await this.$http.get(`/api/asset/predicted1/`,{params:{assetId : this.assetId, stageDivCd:this.stageLevel, predictDivCd:"L"}})
      .then(response => {
        this.predL1 = response.data.factor1;
        this.predL2 = response.data.factor2;
        this.predL3 = response.data.factor3;
        this.predL4 = response.data.factor4;
        this.predL5 = response.data.factor5;
        this.predL6 = response.data.factor6;
        this.predL7 = response.data.factor7;
        this.predL8 = response.data.factor8;
        this.predL9 = response.data.factor9;
      });
      this.getRealData();
    },
    async getRealData(){
      /* real 데이터 */
      await this.$http.get(`/api/asset/realTime1/`,{params:{assetId : this.assetId, stageDivCd:this.stageLevel, lotNo:this.lotNo}})
      .then(response => {

        this.realY1 = response.data.factor1;
        this.realY2 = response.data.factor2;
        this.realY3 = response.data.factor3;
        this.realY4 = response.data.factor4;
        this.realY5 = response.data.factor5;
        this.realY6 = response.data.factor6;
        this.realY7 = response.data.factor7;
        this.realY8 = response.data.factor8;
        this.realY9 = response.data.factor9;


        /** 그래프 그리기 */
        this.MainHeaterPlot();
        this.bottomHeaterPlot();
        this.tempPlot();
        this.weightPlot();
        this.srSpeedPlot();
        this.slSpeedPlot();
        this.slPositionPlot();
        this.seqInfoPlot();
        this.growthInfoPlot();
      });
    },
    MainHeaterPlot() {     
      var mainHeater1 = {
        y: this.realY1,
        line: { color: "#93c54b", width: 2 },
        name: "Actual",
        mode: "lines",
        type: "scatter",
      };
      var mainHeater2 = {
        y: this.predY1,
        line: {color: "red", width: 1 },
        name: "Predicted",
        mode: "lines",
        type: "scatter",
      };
      var mainHeater3 = {
        y: this.predH1,
        line: {dash: 'dot', color: "#fff", size:'2' },
        name: "Upper Limit",
        mode: "lines",
        type: "scatter",
      };
      var mainHeater4 = {
        y: this.predL1,
        line: {dash: 'dot', color: "#fff", size:'2' },
        name: "Lower Limit",
        mode: "lines",
        type: "scatter",
      };
      this.mainHeaterData.data = [mainHeater1,mainHeater2,mainHeater3,mainHeater4];
      var Mho = document.getElementById("mho");
      Plotly.newPlot( Mho, this.mainHeaterData.data, this.mainHeaterData.layout, this.mainHeaterData.config );
    },
    bottomHeaterPlot() {     
      var bottomHeater1 = {
        y: this.realY2,
        line: { color: "#93c54b", width: 2 },
        mode: "lines",
        type: "scatter",
      };
      var bottomHeater2 = {
        y: this.predY2,
        line: {color: "red", width: 1 },
        mode: "lines",
        type: "scatter",
      };
      var bottomHeater3 = {
        y: this.predH2,
        line: {dash: 'dot', color: "#fff", size:'2' },
        mode: "lines",
        type: "scatter",
      };
      var bottomHeater4 = {
        y: this.predL2,
        line: {dash: 'dot', color: "#fff", size:'2' },
        mode: "lines",
        type: "scatter",
      };
      this.bottomHeaterData.data = [bottomHeater1,bottomHeater2,bottomHeater3,bottomHeater4];
      var Bho = document.getElementById("bho");
      Plotly.newPlot( Bho, this.bottomHeaterData.data, this.bottomHeaterData.layout, this.bottomHeaterData.config );
    },
    tempPlot() {     
      var temp1 = {
        y: this.realY3,
        line: { color: "#93c54b", width: 2 },
        mode: "lines",
        type: "scatter",
      };
      var temp2 = {
        y: this.predY3,
        line: {color: "red", width: 1 },
        mode: "lines",
        type: "scatter",
      };
      var temp3 = {
        y: this.predH3,
        line: {dash: 'dot', color: "#fff", size:'2' },
        mode: "lines",
        type: "scatter",
      };
      var temp4 = {
        y: this.predL3,
        line: {dash: 'dot', color: "#fff", size:'2' },
        mode: "lines",
        type: "scatter",
      };
      this.tempData.data = [temp1,temp2,temp3,temp4];
      var Temp = document.getElementById("temp1");
      Plotly.newPlot( Temp, this.tempData.data, this.tempData.layout, this.tempData.config );
    },
    weightPlot() {     
      var weight1 = {
        y: this.realY4,
        line: { color: "#93c54b", width: 2 },
        mode: "lines",
        type: "scatter",
      };
      var weight2 = {
        y: this.predY4,
        line: {color: "red", width: 1 },
        mode: "lines",
        type: "scatter",
      };
      var weight3 = {
        y: this.predH4,
        line: {dash: 'dot', color: "#fff", size:'2' },
        mode: "lines",
        type: "scatter",
      };
      var weight4 = {
        y: this.predL4,
        line: {dash: 'dot', color: "#fff", size:'2' },
        mode: "lines",
        type: "scatter",
      };
      this.weightData.data = [weight1,weight2,weight3,weight4];
      var Weight = document.getElementById("weight");
      Plotly.newPlot( Weight, this.weightData.data, this.weightData.layout, this.weightData.config );
    },
    srSpeedPlot() {     
      var srSpeed1 = {
        y: this.realY5,
        line: { color: "#93c54b", width: 2 },
        mode: "lines",
        type: "scatter",
      };
      var srSpeed2 = {
        y: this.predY5,
        line: {color: "red", width: 1 },
        mode: "lines",
        type: "scatter",
      };
      var srSpeed3 = {
        y: this.predH5,
        line: {dash: 'dot', color: "#fff", size:'2' },
        mode: "lines",
        type: "scatter",
      };
      var srSpeed4 = {
        y: this.predL5,
        line: {dash: 'dot', color: "#fff", size:'2' },
        mode: "lines",
        type: "scatter",
      };
      this.srSpeedData.data = [srSpeed1,srSpeed2,srSpeed3,srSpeed4];
      var SRSpeed = document.getElementById("srs");
      Plotly.newPlot( SRSpeed, this.srSpeedData.data, this.srSpeedData.layout, this.srSpeedData.config );
    },
    slSpeedPlot() {
      //console.log("this.realY6==",this.realY6)     
      var slSpeed1 = {
        y: this.realY6,
        line: { color: "#93c54b", width: 2 },
        mode: "lines",
        type: "scatter",
      };
      var slSpeed2 = {
        y: this.predY6,
        line: {color: "red", width: 1 },
        mode: "lines",
        type: "scatter",
      };
      var slSpeed3 = {
        y: this.predH6,
        line: {dash: 'dot', color: "#fff", size:'2' },
        mode: "lines",
        type: "scatter",
      };
      var slSpeed4 = {
        y: this.predL6,
        line: {dash: 'dot', color: "#fff", size:'2' },
        mode: "lines",
        type: "scatter",
      };
      this.slSpeedData.data = [slSpeed1,slSpeed2,slSpeed3,slSpeed4];
      var SLSpeed = document.getElementById("sls");
      Plotly.newPlot( SLSpeed, this.slSpeedData.data, this.slSpeedData.layout, this.slSpeedData.config );
    },
    slPositionPlot() {     
      var slPosition1 = {
        y: this.realY7,
        line: { color: "#93c54b", width: 2 },
        mode: "lines",
        type: "scatter",
      };
      var slPosition2 = {
        y: this.predY7,
        line: {color: "red", width: 1 },
        mode: "lines",
        type: "scatter",
      };
      var slPosition3 = {
        y: this.predH7,
        line: {dash: 'dot', color: "#fff", size:'2' },
        mode: "lines",
        type: "scatter",
      };
      var slPosition4 = {
        y: this.predL7,
        line: {dash: 'dot', color: "#fff", size:'2' },
        mode: "lines",
        type: "scatter",
      };
      this.slPositionData.data = [slPosition1,slPosition2,slPosition3,slPosition4];
      var SLPosition = document.getElementById("slp");
      Plotly.newPlot( SLPosition, this.slPositionData.data, this.slPositionData.layout, this.slPositionData.config );
    },
    seqInfoPlot() {     
      var seqInfo1 = {
        y: this.realY8,
        line: { color: "#93c54b", width: 2 },
        mode: "lines",
        type: "scatter",
      };
      var seqInfo2 = {
        y: this.predY8,
        line: {color: "red", width: 1 },
        mode: "lines",
        type: "scatter",
      };
      var seqInfo3 = {
        y: this.predH8,
        line: {dash: 'dot', color: "#fff", size:'2' },
        mode: "lines",
        type: "scatter",
      };
      var seqInfo4 = {
        y: this.predL8,
        line: {dash: 'dot', color: "#fff", size:'2' },
        mode: "lines",
        type: "scatter",
      };
      this.seqInfoData.data = [seqInfo1,seqInfo2,seqInfo3,seqInfo4];
      var SeqInfo = document.getElementById("si");
      Plotly.newPlot( SeqInfo, this.seqInfoData.data, this.seqInfoData.layout, this.seqInfoData.config );
    },
    
    growthInfoPlot() {     
      var growthInfo1 = {
        y: this.realY9,
        line: { color: "#93c54b", width: 2 },
        mode: "lines",
        type: "scatter",
      };
      var growthInfo2 = {
        y: this.predY9,
        line: {color: "red", width: 1 },
        mode: "lines",
        type: "scatter",
      };
       var growthInfo3 = {
        y: this.predH9,
        line: {dash: 'dot', color: "#fff", size:'2' },
        mode: "lines",
        type: "scatter",
      };
      var growthInfo4 = {
        y: this.predL9,
        line: {dash: 'dot', color: "#fff", size:'2' },
        mode: "lines",
        type: "scatter",
      };
      this.growthInfoData.data = [growthInfo1,growthInfo2,growthInfo3,growthInfo4];
      var GrowthInfo = document.getElementById("gi");
      Plotly.newPlot( GrowthInfo, this.growthInfoData.data, this.growthInfoData.layout, this.growthInfoData.config );
    },
    /*
    openPop(popData){
      this.$modal.open({
          component: GraphPop,
          parent: this,
          props: {
            popData: popData
          },
      })
    }
    */
  },
  created() {
    clearInterval(this.intervalId)
    this.intervalId = setInterval(function () {
      this.getRealData();
    }.bind(this), this.setTime)
  },
  mounted() {
    this.getPreData();
  },
  destroyed() {
      clearInterval(this.intervalId)
  }, 
}
</script>