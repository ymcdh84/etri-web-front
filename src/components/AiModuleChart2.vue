<template>
  <div style="padding: 0rem 2rem 2rem 2rem">
    <!--SPE 차트 -->
    <div class="block-size">
      <div class="card text-white bg-dark mb-3 block-size8">
        <div class="card-header">
          <div>
            SPE
            <i class="fas fa-chart-bar" style="margin-top: 5px; margin-left: 15px" @click="openPop()"></i>
          </div>
          <div>
            <i v-show="!showChart1" class="fas fa-chevron-down" style="margin-top: 5px" @click="showCharts1()"></i>
            <i v-show="showChart1" class="fas fa-chevron-up" style="margin-top: 5px" @click="showCharts1()"></i>
          </div>
        </div>
        <div v-if="showPop" class="popover fade show bs-popover-top pop-tool2" role="tooltip" data-popper-placement="top">
          <div class="popover-arrow pop-toolHead2"></div>
          <h3 class="popover-header pop-text" style="display: flex; justify-content: space-between; align-items: center;">
            <a @click="movePop()">고장구간 기여도 분석</a>
            <i class="fas fa-times" @click="closePop()"></i>
          </h3>
        </div>

        <!-- <div v-show="!showChart" class="card-body5" id="spe1"></div> -->
        <div class="card-body4" id="spe"></div>
      </div>
    </div>
    <div v-show="showChart1" class="block-size">
      <div class="card text-white bg-dark mb-3 block-size8">
        <div class="card-header">SPE stat.</div>
        <div class="card-body4" id="speHeat"></div>
      </div>
    </div>
    <!--T2 차트 -->
    <div class="block-size">
      <div class="card text-white bg-dark block-size8">
        <div class="card-header">
          T2
          <i v-show="!showChart2" class="fas fa-chevron-down" style="margin-top: 5px" @click="showCharts2()"></i>
          <i v-show="showChart2" class="fas fa-chevron-up" style="margin-top: 5px" @click="showCharts2()"></i>
        </div>
        <div v-if="showPop2" class="popover fade show bs-popover-top pop-tool2" role="tooltip" data-popper-placement="top">
          <div class="popover-arrow pop-toolHead2"></div>
          <h3 class="popover-header pop-text" style="display: flex; justify-content: space-between; align-items: center;">
            <a @click="movePop()">고장구간 기여도 분석</a>
            <i class="fas fa-times" @click="closePop()"></i>
          </h3>
        </div>
        <div class="card-body4" id="t2"></div>
      </div>
    </div>

    <div v-show="showChart2" class="block-size">
      <div class="card text-white bg-dark mt-3 block-size8">
        <div class="card-header">T2 stat.</div>
        <div class="card-body4" id="t2Heat"></div>
      </div>
    </div>

    <!-- <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="toast-header">
        <strong class="me-auto">Bootstrap</strong>
        <small>11 mins ago</small>
        <button type="button" class="btn-close ms-2 mb-1" data-bs-dismiss="toast" aria-label="Close">
          <span aria-hidden="true"></span>
        </button>
      </div>
      <div class="toast-body">
        Hello, world! This is a toast message.
      </div>
    </div> -->

    <!-- 
    <div class="block-size">
      <div class="card text-white bg-dark mb-3 block-size3">
        <div class="card-header">Bandwidth parameter estimation Using k fold cross validation</div>
        <div class="card-body2" id="mspe"></div>
      </div>
      <div class="card text-white bg-dark mb-3 block-size4">
        <div class="card-header">SPF values for normal data</div>
        <div class="card-body2" id="spen"></div>
      </div>
    </div>
    -->
  </div>
</template>

<script>
import GraphPop from "@/components/GraphPop.vue";
import GraphPop2 from "@/components/GraphPop2.vue";
export default {
  name: "AiModuleChart2",
  components: { GraphPop, GraphPop2 },
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
  watch: {
    stageLevel: function (val) {
      this.getData();
      this.stageCd = val;
    },
  },
  data() {
    return {
      setTime: 10000, //api 호출 주기(2분)
      showChart1: false,
      showChart2: false,
      showPop: false,
      showPop2: false,
      //blockS:"card text-white bg-dark mb-3 block-size9",
      //bodyS:"card-body5",
      kindChart: "",
      startX1:'',
      endX2:'',
      mspeX: [],
      mspeY1: [],
      mspeY2: [],
      mspeY3: [],
      mspeData: {
        data: [],
        layout: {
          xaxis: {
            title: "Bandwidth parameter",
            color: "#fff",
            gridcolor: "#979797 ",
            dtick: 0.2,
          },
          yaxis: { title: "MSPE", color: "#fff", gridcolor: "#979797" },
          autosize: true,
          font: { color: "#fff", size: 10 },
          paper_bgcolor: "transparent",
          plot_bgcolor: "transparent",
          margin: { b: 60, l: 60, r: 40, t: 15 },
          modebar: { bgcolor: "transparent" },
          legend: { x: 1, xanchor: "right", y: 1 },
        },
        config: { responsive: true },
      },
      spe: [],
      speY: [],
      threshold: [],
      speData: {
        data: [],
        layout: {
          xaxis: {
            title: "Time(2min. inter)",
            color: "#fff",
            gridcolor: "#979797 ",
          },
          yaxis: {
            title: "SPE",
            color: "#fff",
            gridcolor: "#979797",
            type: "log",
            tick0: 10 ^ -2,
          },
          autosize: true,
          font: { color: "#fff", size: 10 },
          paper_bgcolor: "transparent",
          plot_bgcolor: "transparent",
          margin: { b: 60, l: 60, r: 40, t: 15 },
          modebar: { bgcolor: "transparent" },
          legend: { x: 0.01, xanchor: "left", y: 1 },
        },
        config: { responsive: true },
      },
      t2: [],
      t2Y: [],
      threshold2: [],
      t2Data: {
        data: [],
        layout: {
          xaxis: {
            title: "Time(2min. inter)",
            color: "#fff",
            gridcolor: "#979797 ",
          },
          yaxis: {
            title: "T2",
            color: "#fff",
            gridcolor: "#979797",
            type: "log",
            tick0: 10 ^ -2,
          },
          autosize: true,
          font: { color: "#fff", size: 10 },
          paper_bgcolor: "transparent",
          plot_bgcolor: "transparent",
          margin: { b: 60, l: 60, r: 40, t: 15 },
          modebar: { bgcolor: "transparent" },
          legend: { x: 0.01, xanchor: "left", y: 1 },
        },
        config: { responsive: true },
      },
      speHeat1: [],
      speHeat2: [],
      speHeat3: [],
      speHeat4: [],
      speHeat5: [],
      speHeatData: {
        data: [],
        layout: {
          xaxis: {
            title: "Time(2min. inter)",
            color: "#fff",
            gridcolor: "#979797",
          },
          yaxis: {
            title: "Variable",
            color: "#fff",
            gridcolor: "#979797",
            dtick: 1,
            side: "right",
          },
          autosize: true,
          font: { color: "#fff", size: 10 },
          paper_bgcolor: "transparent",
          plot_bgcolor: "transparent",
          margin: { b: 60, l: 30, r: 30, t: 15 },
          modebar: { bgcolor: "transparent" },
        },
        config: { responsive: true },
      },
      t2Heat1: [],
      t2Heat2: [],
      t2Heat3: [],
      t2Heat4: [],
      t2Heat5: [],
      t2HeatData: {
        data: [],
        layout: {
          xaxis: {
            title: "Time(2min. inter)",
            color: "#fff",
            gridcolor: "#979797",
          },
          yaxis: {
            title: "Variable",
            color: "#fff",
            gridcolor: "#979797",
            dtick: 1,
            side: "right",
          },
          autosize: true,
          font: { color: "#fff", size: 10 },
          paper_bgcolor: "transparent",
          plot_bgcolor: "transparent",
          margin: { b: 60, l: 30, r: 30, t: 15 },
          modebar: { bgcolor: "transparent" },
        },
        config: { responsive: true },
      },
    };
  },
  methods: {
    async getData() {
      /* 
        2021.10.04 최대한 수정 

        TB_PCA_SPE_DATA 테이블 변경 사항
        1. detection_index_cd(탐지지수구분) 컬럼 추가 
           ㄴ 공통코드 : detection_index_cd
           ㄴ SPE 차트 : 'SPE'
           ㄴ T2 차트 : 'T2'
        2. the_spe컬럼 -> val 변경
      */
      /* SPE 데이터 */
      await this.$http
        .get(`/api/asset/speData/`, {
          params: {
            assetId: this.assetId,
            detectionIndexCd: "SPE",
            stageDivCd: this.stageLevel,
          },
        })
        .then((response) => {
          /* TB_PCA_SPE_DATA 테이블  */
          this.threshold = response.data.theSpe;
          this.spePlot();
        });

      /* SPE Real 데이터 */
      await this.$http
        .get(`/api/asset/speRealData/`, {
          params: {
            assetId: this.assetId,
            detectionIndexCd: "SPE",
            stageDivCd: this.stageLevel,
            lotNo: this.lotNo
          },
        })
        .then((response) => {
          this.speY = response.data.speTest;
          this.spePlot();
        });
      /* T2 데이터 */
      await this.$http
        .get(`/api/asset/speData/`, {
          params: {
            assetId: this.assetId,
            detectionIndexCd: "T2",
            stageDivCd: this.stageLevel,
          },
        })
        .then((response) => {
          /* TB_PCA_SPE_DATA 테이블  */
          this.threshold2 = response.data.theSpe;
          this.t2Plot();
        });

      /* T2 Real 데이터 */
      await this.$http
        .get(`/api/asset/speRealData/`, {
          params: {
            assetId: this.assetId,
            detectionIndexCd: "T2",
            stageDivCd: this.stageLevel,
            lotNo: this.lotNo
          },
        })
        .then((response) => {
          this.t2Y = response.data.speTest;
          this.t2Plot();
        });
    },
    async getData1() {
      /* SPE HeatMap 데이터 */
      await this.$http
        .get(`/api/asset/heatMapData/`, {
          params: {
            assetId: this.assetId,
            detectionIndexCd: "SPE",
            stageDivCd: this.stageLevel,
            lotNo: this.lotNo
          },
        })
        .then((response) => {
          this.speHeat1 = response.data.factor1;
          this.speHeat2 = response.data.factor2;
          this.speHeat3 = response.data.factor3;
          this.speHeat4 = response.data.factor4;
          this.speHeat5 = response.data.factor5;
          this.speHeatPlot();
        });

      /* T2 HeatMap 데이터 */
      await this.$http
        .get(`/api/asset/heatMapData/`, {
          params: {
            assetId: this.assetId,
            detectionIndexCd: "T2",
            stageDivCd: this.stageLevel,
            lotNo: this.lotNo
          },
        })
        .then((response) => {
          this.t2Heat1 = response.data.factor1;
          this.t2Heat2 = response.data.factor2;
          this.t2Heat3 = response.data.factor3;
          this.t2Heat4 = response.data.factor4;
          this.t2Heat5 = response.data.factor5;
          this.t2HeatPlot();
        });
    },
    getData4() {
      /* MSPE 데이터 */
      (this.mspeX = [
        0.05, 0.06, 0.07, 0.08, 0.09, 0.1, 0.11, 0.12, 0.13, 0.14, 0.15, 0.2,
        0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1,
      ]),
        (this.mspeY1 = [
          0.833480166, 0.833541354, 0.833860237, 0.834268147, 0.09527129,
          0.004817147, 0.006040929, 0.006778383, 0.007595711, 0.008490212,
          0.009458512, 0.014621092, 0.028072196, 0.045637911, 0.069439989,
          0.10053915, 0.139233889, 0.182881192, 0.229963008, 0.280887858,
        ]),
        (this.mspeY2 = [
          5.352752481, 5.353113869, 5.353437923, 5.353853885, 0.711069363,
          0.012865573, 0.01460105, 0.015328204, 0.016133382, 0.017016058,
          0.01797447, 0.022628087, 0.036165753, 0.053951359, 0.07800585,
          0.110118174, 0.151802284, 0.199486163, 0.250429676, 0.304705113,
        ]),
        (this.mspeY3 = [
          -3.68579215, -3.68603116, -3.685717448, -3.685317592, -0.520526783,
          -0.00323128, -0.002519192, -0.001771438, -0.000941961, -3.56e-5,
          0.000942555, 0.006614097, 0.019978639, 0.037324464, 0.060874128,
          0.090960127, 0.126665494, 0.166276221, 0.20949634, 0.257070603,
        ]),
        (this.mspeData.layout.yaxis.range = [0, 1]);

      /** 그래프 그리기 */
      //this.mspePlot();
    },
    mspePlot() {
      var mspe1 = {
        x: this.mspeX,
        y: this.mspeY1,
        name: "MSPE",
        showlegend: true,
        line: { color: "#93c54b", width: 2 },
        mode: "lines",
        type: "scatter",
      };
      var mspe2 = {
        x: this.mspeX,
        y: this.mspeY2,
        showlegend: false,
        line: { dash: "dot", color: "#fff", size: "5" },
        mode: "lines",
        type: "scatter",
      };
      var mspe3 = {
        x: this.mspeX,
        y: this.mspeY3,
        showlegend: false,
        line: { dash: "dot", color: "#fff", size: "5" },
        mode: "lines",
        type: "scatter",
      };
      this.mspeData.data = [mspe1, mspe2, mspe3];
      var Mspe = document.getElementById("mspe");
      Plotly.newPlot(Mspe, this.mspeData.data, this.mspeData.layout, this.mspeData.config);
    },
    spePlot() {
      var spe = {
        y: this.speY,
        line: { color: "#93c54b", width: 2 },
        name: "SPE",
        mode: "lines",
        type: "scatter",
      };
      var threshold = {
        y: this.threshold,
        line: { dash: "dot", color: "red", width: 2 },
        name: "Threshold",
        mode: "lines",
        type: "scatter",
      };
      /*
      var Viol = {
        type: 'scatter',
        x: [50],
        y: [35],
        mode: 'markers',
        name: 'Violation',
        showlegend: false,
        marker: {
          color: 'rgb(255,65,54)',
          line: {width: 5},
          opacity: 1,
          size: 10,
          symbol: 'circle-open'
        }
      }
      this.speData.data = [spe, threshold,Viol];
      */
      this.speData.data = [spe, threshold];
      //var SPE1 = document.getElementById("spe1");
      //Plotly.newPlot( SPE1, this.speData.data, this.speData.layout, this.speData.config );
      var SPE = document.getElementById("spe");
      Plotly.newPlot(SPE, this.speData.data, this.speData.layout, this.speData.config);

      const vm = this;
      SPE.on("plotly_relayout", function (data) {
        console.log("relayout DATA ", data);
        if (data["xaxis.range[0]"] != undefined) {
          vm.showPop = true;
          vm.kindChart = "SPE";
          vm.startX1=data["xaxis.range[0]"];
          vm.endX2=data["xaxis.range[1]"];
          //vm.movePop(data["xaxis.range[0]"], data["xaxis.range[1]"], vm.kindChart);
        }
      });
    },
    t2Plot() {
      var t2 = {
        y: this.t2Y,
        line: { color: "#93c54b", width: 2 },
        name: "T2",
        mode: "lines",
        type: "scatter",
      };
      var threshold2 = {
        y: this.threshold2,
        line: { dash: "dot", color: "red", width: 2 },
        name: "Threshold",
        mode: "lines",
        type: "scatter",
      };
      /*
      var Viol = {
        type: 'scatter',
        x: [50,59,142,151,178,190,216,218],
        y: [1549,15,18,37,16,23,11,11.6512],
        mode: 'markers',
        name: 'Violation',
        showlegend: false,
        marker: {
          color: 'rgb(255,65,54)',
          line: {width: 5},
          opacity: 1,
          size: 10,
          symbol: 'circle-open'
        }
      }

      this.t2Data.data = [t2, threshold2, Viol];
      */
      this.t2Data.data = [t2, threshold2];
      var T2 = document.getElementById("t2");
      Plotly.newPlot(T2, this.t2Data.data, this.t2Data.layout, this.t2Data.config);

      const vm = this;
      T2.on("plotly_relayout", function (data) {
        console.log("relayout DATA ", data);
        if (data["xaxis.range[0]"] != undefined) {
          vm.showPop2 = true;
          vm.kindChart = "T2";
          vm.startX1=data["xaxis.range[0]"];
          vm.endX2=data["xaxis.range[1]"];
          //vm.movePop(data["xaxis.range[0]"], data["xaxis.range[1]"], vm.kindChart);
        }
      });
    },
    speHeatPlot() {
      var speHeat = {
        z: [this.speHeat5, this.speHeat4, this.speHeat3, this.speHeat2, this.speHeat1],
        type: "heatmap",
        colorscale: "Viridis",
      };
      this.speHeatData.data = [speHeat];
      var SpeHeat = document.getElementById("speHeat");
      Plotly.newPlot(SpeHeat, this.speHeatData.data, this.speHeatData.layout, this.speHeatData.config);
    },
    t2HeatPlot() {
      var t2Heat = {
        z: [this.t2Heat5, this.t2Heat4, this.t2Heat3, this.t2Heat2, this.t2Heat1],
        type: "heatmap",
        colorscale: "Viridis",
      };
      this.t2HeatData.data = [t2Heat];
      var T2Heat = document.getElementById("t2Heat");
      Plotly.newPlot(T2Heat, this.t2HeatData.data, this.t2HeatData.layout, this.t2HeatData.config);
    },

    showCharts1() {
      this.showChart1 = !this.showChart1;

      /*차트 높이 조절
      if(this.showChart == true){
        this.blockS = "card text-white bg-dark mb-3 block-size8"
        this.bodyS = "card-body4"
      }else{
        this.blockS = "card text-white bg-dark mb-3 block-size9"
        this.bodyS = "card-body5"
      }
      */
    },
    showCharts2() {
      this.showChart2 = !this.showChart2;
    },
    movePop() {
      this.closePop();
      this.openPop2(this.startX1, this.endX2, this.kindChart);
    },
    closePop() {
      if(this.kindChart == 'SPE'){
        this.showPop = false;
      }else{
        this.showPop2 = false;
      }
    },
    openPop() {
      this.$modal.open({
        component: GraphPop,
        parent: this,
        props: {
          assetId: this.assetId,
          stageLevel: this.stageLevel,
        },
      });
    },
    openPop2(x1, x2, kindChart) {
      this.$modal.open({
        component: GraphPop2,
        parent: this,
        props: {
          assetId: this.assetId,
          stageLevel: this.stageLevel,
          x1: x1,
          x2: x2,
          kindChart: kindChart,
        },
      });
    },
  },

  mounted() {
    this.getData();
    this.getData1();

    clearInterval(this.intervalId);
    this.intervalId = setInterval(
      function () {
        this.getData();
        this.getData1();
      }.bind(this),
      this.setTime
    );
  },
  destroyed() {
    clearInterval(this.intervalId);
  },
};
</script>