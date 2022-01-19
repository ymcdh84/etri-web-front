<template>
  <div style="padding: 2rem;">
    <div class="block-size">
      <img class="asset-image mb-3 block-size1" id="img" :src="downloadUrl" alt="Image" v-if = "downloadUrl"/>
      <div v-else class="asset-image mb-3 block-size1"></div>
      <div class="card text-white bg-dark mb-3 block-size1">
        <div class="card-header">
          장비정보(&nbsp;{{ lastYear[0] }}.{{lastMonth[0]}}.{{ lastDay[0] }} &nbsp;&nbsp;
          {{ lastHour[0] }}:{{ lastMin[0] }}&nbsp;)
        </div>
        <div class="card-body">
          <h6 class="card-title title-solid" style="margin-top: 13px;">Power Controller(Main Heater)</h6>
          <div class="d-flex1">
            <div class="card-text">SV</div>
            <div class="card-text" style="align-item:end">
              {{ assetDetailInfo.mainHeaterSv }}
            </div>
          </div>
          <div class="d-flex1">
            <div class="card-text">PV</div>
            <div class="card-text">{{ assetDetailInfo.mainHeaterPv }}</div>
          </div>
          <div class="d-flex1 content-solid">
            <div class="card-text">OUT</div>
            <div class="card-text">{{ assetDetailInfo.mainHeaterOut }}</div>
          </div>
          <h6 class="card-title title-solid">
            Power Controller(Bottom Heater)
          </h6>
          <div class="d-flex1">
            <div class="card-text">SV</div>
            <div class="card-text" style="align-item:end">
              {{ assetDetailInfo.bottomHeaterSv }}
            </div>
          </div>
          <div class="d-flex1">
            <div class="card-text">PV</div>
            <div class="card-text">{{ assetDetailInfo.bottomHeaterPv }}</div>
          </div>
          <div class="d-flex1 content-solid">
            <div class="card-text">OUT</div>
            <div class="card-text">{{ assetDetailInfo.bottomHeaterOut }}</div>
          </div>

          <div class="d-flex1 content-solid">
            <h6 class="card-title">Temp(ºC)</h6>
            <div class="card-text" style="align-item:end">
              {{ assetDetailInfo.temp }}
            </div>
          </div>

          <div class="d-flex1 content-solid">
            <h6 class="card-title">TotalWeight(kg)</h6>
            <div class="card-text" style="align-item:end">
              {{ assetDetailInfo.totalWeight }}
            </div>
          </div>
        </div>
      </div>
      <div class="card text-white bg-dark mb-3 block-size7">
        <div class="card-header">알람이력</div>

        <table class="table table-hover">
          <thead>
            <tr style="height: 48px;">
              <th scope="col">알람값</th>
              <th scope="col">알람내용</th>
              <th scope="col">중요도</th>
              <th scope="col">발생일시</th>
            </tr>
          </thead>
          <tbody>
            <tr
              class="table-dark"
              v-for="(alarmHistory, ah) in alarmHistorys"
              v-bind:key="ah"
            >
              <td style="text-align: center">{{ alarmHistory.alarmVal }}</td>
              <td style="text-align: center">{{ alarmHistory.alarmDesc }}</td>
              <td style="text-align: center">{{ alarmHistory.alarmLevelNm }}</td>
              <td style="text-align: center">{{ alarmHistory.alarmDataTime }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="card text-white bg-dark mb-3 block-size2">
        <div class="card-header">Last Info</div>
        <div class="card-body">
          <div class="d-flex1 content-solid">
            <h6 class="card-title">LOT_ID</h6>
            <div class="card-text" style="align-item:end">
              {{lastInfo.lotId}}
            </div>
          </div>
          <div class="d-flex1 content-solid">
            <h6 class="card-title">Body 기포 길이</h6>
            <div class="card-text" style="align-item:end">
              {{lastInfo.body}}
            </div>
          </div>
          <div class="d-flex1 content-solid">
            <h6 class="card-title">하부 기포 길이</h6>
            <div class="card-text" style="align-item:end">
              {{lastInfo.bottom}}
            </div>
          </div>
          <div class="d-flex1 content-solid">
            <h6 class="card-title">Shoulder 기포 길이</h6>
            <div class="card-text" style="align-item:end">
              {{lastInfo.shoulder}}
            </div>
          </div>
          <div class="d-flex1 content-solid">
            <h6 class="card-title">Boule 무게</h6>
            <div class="card-text" style="align-item:end">
              {{lastInfo.boule}}
            </div>
          </div>
          <div class="">
            <h6 class="card-title">성장결과</h6>
            <div class="card-text" style="margin-top: 20px; display: flex;justify-content: center;">
              <h2>{{lastInfo.result}}</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="block-size">
      <div class="card text-white bg-dark block-size3">
        <div class="card-header">Temp&nbsp;(LotNumber : {{ assetDetailInfo.lotNo }})</div>
        <div class="card-body2" id="temp"></div>
      </div>
      <div class="card text-white bg-dark block-size4">
        <div class="card-header">Total Weight&nbsp;(LotNumber : {{ assetDetailInfo.lotNo }})</div>
        <div class="card-body2" id="totalWeight"></div>
      </div>
    </div>
  </div>
</template>
<script>
import _ from "lodash";

export default {
  name: "AssetInfo",
  props: {
    assetId: {
      type: String,
      required: false,
    },
  },
  data() {
    return {
      setTime:10000, //api 호출 주기(10초),
      assetDetailInfo: [],
      focusSiteId:'SITE_00001',
      downloadUrl:'',
      lastYear:[],
      lastMonth:[],
      lastDay:[],
      lastHour:[],
      lastMin:[],
      year:[],
      month:[],
      day:[],
      hour:[],
      min:[],
      beYesterday: "",
      today: "",
      xData: [],
      plotX: [],
      tempPlotY: [],
      tempPlotData: {
        data: [],
        layout: {
          xaxis: {
            title: "Time",
            color: "#fff",
            gridcolor: "#979797 ",
            //tickformat: "%H",
            //dtick: 2 * 60 * 60 * 1000 /*type:'date'*/,
          },
          yaxis: { title: "Temp(ºC)", color: "#fff", gridcolor: "#979797" },
          autosize: true,
          font: { color: "#fff", size: 10 },
          paper_bgcolor: "transparent",
          plot_bgcolor: "transparent",
          margin: { b: 60, l: 60, r: 40, t: 15 },
          modebar: { bgcolor: "transparent" },
        },
        config: { responsive: true, scrollZoom: true },
      },
      weightPlotY: [],
      weightPlotData: {
        data: [],
        layout: {
          xaxis: {
            title: "Time",
            color: "#fff",
            gridcolor: "#979797",
            //tickformat: "%H",
            //dtick: 2 * 60 * 60 * 1000 /*type:'category'*/,
          },
          yaxis: {
            title: "TotalWeight(kg)",
            color: "#fff",
            gridcolor: "#979797",
            gridwidth: 0.5,
          },
          autosize: true,
          font: { color: "#fff", size: 10 },
          paper_bgcolor: "transparent",
          plot_bgcolor: "transparent",
          margin: { b: 60, l: 60, r: 40, t: 15 },
          modebar: { bgcolor: "transparent" },
        },
        config: { responsive: true, scrollZoom: true },
      },
      alarmHistorys: [],
      lastInfo: {
        lotId:'',
        body:'',
        bottom:'',
        shoulder:'',
        boule:'',
        result:''
      },
    };
  },
  methods: {
    //장비상세정보
    assetDetailInfos() {
      this.$http.get(`/api/asset/detail/` + this.assetId).then((response) => {
        this.xData = response.data;
        const last = response.data.length;
        if(last>0){
          this.assetDetailInfo = response.data[last - 1];
          
          this.lastYear= this.assetDetailInfo.year.split(".");
          this.lastMonth= this.assetDetailInfo.month.split(".");
          this.lastDay= this.assetDetailInfo.day.split(".");
          this.lastHour= this.assetDetailInfo.hour.split(".");
          this.lastMin= this.assetDetailInfo.min.split(".");

          for (let i = 0; i < last; i++) {
            this.year[i] = response.data[i].year.split('.');
            this.month[i] = response.data[i].month.split('.');
            this.day[i] = response.data[i].day.split('.');
            this.hour[i] = response.data[i].hour.split('.');
            this.min[i] = response.data[i].min.split('.');
            if (this.min[i][0].length == 1) {
              this.min[i][0] = "0" + this.min[i][0];
            }
          
            this.xData[i].date = this.year[i][0] + "-" + this.month[i][0] + "-" + this.day[i][0] + " " + this.hour[i][0] + ":" + this.min[i][0];
            this.tempPlotY[i] = response.data[i].temp;
            this.weightPlotY[i] = response.data[i].totalWeight;
          }
          this.plotX = _.map(this.xData, "date"); //x축 날짜형태
          this.createPlot1();
          this.createPlot2();
        
        /*x축 Range 시작(lot번호 마지막 데이터 날짜 기준 -2day)
        const assetDetailInfoMin = String(this.assetDetailInfo.min);
        if (assetDetailInfoMin.length == 1) {
          assetDetailInfoMin = "0" + assetDetailInfoMin;
        }
        this.today =
          "20" +
          String(this.assetDetailInfo.year) +
          "-" +
          String(this.assetDetailInfo.month) +
          "-" +
          String(this.assetDetailInfo.day) +
          " " +
          String(this.assetDetailInfo.hour) +
          ":" +
          assetDetailInfoMin;
        var lotday = new Date(this.today);
        var beYeday = new Date(lotday.setDate(lotday.getDate() - 2));
        let beYear = beYeday.getFullYear();
        let beMonth = beYeday.getMonth() + 1;
        let beDay = beYeday.getDate();
        this.beYesterday = beYear + "-" + beMonth + "-" + beDay;

        this.tempPlotData.layout.xaxis.range = [this.beYesterday, this.today];
        this.weightPlotData.layout.xaxis.range = [this.beYesterday, this.today];
        */
       }
      });
    },
    //Temp Line 그래프
    createPlot1() {
      this.tempPlotData.data = [
        {
          x: this.plotX,
          y: this.tempPlotY,
          line: {
            color: "#93c54b",
            width: 3
          },
          mode: "lines",
          type: "scatter",
        },
      ];
      var Temp = document.getElementById("temp");
      Plotly.newPlot(Temp, this.tempPlotData.data, this.tempPlotData.layout, this.tempPlotData.config);
    },
    //TotalWeight Line 그래프
    createPlot2() {
      this.weightPlotData.data = [
        {
          x: this.plotX,
          y: this.weightPlotY,
          line: {
            color: "#93c54b",
            width: 3
          },
          mode: "lines",
          type: "scatter",
        },
      ];
      var TotalWeight = document.getElementById("totalWeight");
      Plotly.newPlot(TotalWeight, this.weightPlotData.data, this.weightPlotData.layout, this.weightPlotData.config);
    },

    //알람히스토리
    alarm() {
      this.$http
        .post(`/api/asset/alarm/list/monitoring`, { assetId: this.assetId })
        .then((response) => {
          this.alarmHistorys = response.data;
          /*
          var historyLength = alarmList.length;
          this.alarmHistorys = alarmList.slice(
            historyLength - 5,
            historyLength
          );
          */
        });
    },
    //장비사진 호출
    doGetAssetInfo(){
      //자산 상세정보 조회
      this.$http.post(`/api/asset/list`, {siteId: this.focusSiteId , assetId: this.assetId})
        .then(response => {
          this.downloadUrl = response.data[0].downloadUrl;          
        });
    },

    //last Info
    getLastInfo(){
      this.$http.get(`/api/asset/lastInfo/`+ this.assetId)
      .then(response => {
        if(response.data.length>0){
          this.lastInfo.lotId = response.data[0].lotId;
          this.lastInfo.body = response.data[0].value1 + response.data[0].unit
          this.lastInfo.bottom = response.data[4].value1 + response.data[4].unit
          this.lastInfo.shoulder = response.data[2].value1 + response.data[2].unit
          this.lastInfo.boule = response.data[1].value1 + response.data[1].unit
          this.lastInfo.result = response.data[3].value1
        }
      });
    }
  },
  mounted() {
    this.assetDetailInfos();
    this.alarm();
    this.doGetAssetInfo();
    this.getLastInfo()
    //10초 주기 호출
    clearInterval(this.intervalId)
    this.intervalId = setInterval(function () {
      this.assetDetailInfos();
      this.alarm();
    }.bind(this), this.setTime)
  },
  destroyed() {
      clearInterval(this.intervalId)
  },
};
</script>
<style>
/* .js-plotly-plot .plotly .modebar {
    position: relative;
    top: 2px;
    right: 2px;
    
} */
.modebar :hover {
  background-color: transparent;
}
</style>
