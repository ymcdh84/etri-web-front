<template>
  <div class="inner-box">
    <form @submit.prevent="save">
      <div class="menu-head">
        <h3 class="float-start">{{ this.title }}</h3>
        <div class="float-end pt-2">
          <button
            type="button"
            class="btn btn-info btn-sm me-1"
            @click="goOpen"
          >
            <i class="fa fa-search"></i>
            조회
          </button>
        </div>
      </div>
    </form>
    <!-- 검색조건 영역 -->
    <div class="search-form">
      <div class="form-group">
        <label class="control-label">사이트 명</label>
        <div class="form-input">
          <input
            class="input Rt-M tal"
            type="text"
            id="group_cd"
            v-model="form.siteId"
          />
        </div>
      </div>
      <div class="form-group">
        <label class="control-label">설비명</label>
        <div class="form-input">
          <input type="text" class="input" v-model="form.assetId" />
        </div>
      </div>
      <div class="form-group">
        <label class="control-label">태그명</label>
        <div class="form-input">
          <input type="text" class="input" v-model="form.tagId" />
        </div>
      </div>
      <div class="form-group">
        <label class="control-label">데이터타입</label>
        <div class="form-input">
          <!-- <input type="text" class="input" v-model="form.dataTypeCd"/>         -->
          <select class="input w100p" v-model="form.dataTypeCd">
            <option value="">==전체==</option>
            <option
              v-for="{ key, value } in options['DATA_TYPE_CD']"
              :key="key"
              :value="key"
              v-text="value"
            />
          </select>
        </div>
      </div>
    </div>
    <!-- 테이블 -->
    <div class="table-area">
      <div class="table-b">
        <div class="menu-head pt-2">
          <div class="float-start">
            <h4 class="ico_table_name">
              <i class="far fa-bookmark"></i>&nbsp;&nbsp;태그 목록
            </h4>
          </div>
        </div>
        <ag-grid-vue
          ref="gridMain"
          style="width: 100%; height: 67vh; min-height: 25px"
          class="ag-theme-alpine"
          
          :columnDefs="columnDefs"
          :defaultColDef="defaultColDef"
          :frameworkComponents="frameworkComponents"
          :rowData="data"
          :gridOptions="gridOptions"
          :suppressRowClickSelection="false"
          :sideBar="sideBar"
          :enableRangeSelection="true"
          :enableCharts="true"
          
          @grid-ready="onReadyMain"
          @cell-double-clicked="onCellDoubleClicked"
        />
      </div>
    </div>
  </div>
</template>
<script>
import SelectCellRenderer from "@/components/agGrid/select-cell-renderer";
import TagInfoPopup from "@/components/TagInfoPopup.vue";

import common from "@/mixin/common";

/**
 * Url JOIN
 */
function _url(...args) {
  args = args.map((x) =>
    String(x || "")
      .trim()
      .replace(/^\/*|\/*$/g, "")
  );
  return args.filter((x) => x).join("/");
}

export default {
  mixins: [common],
  name: "tagCondSch",
  data() {
    return {
      title: "태그 현황 조회",
      form: {
        siteId: "",
        assetNm: "",
        dataTypeCd: "",
      },
      data: [],
      subData: [],
      deleteList: [],
      //Main Grid 옵션
      gridOptions: {
        rowHeight: 35,
        //enableColResize: true,
        //enableFilter: true,
        //animateRows: false,
        //enableSorting: true
      },
      defaultColDef: {
        resizable: true,
        filter: true,
        sortable: true,
        editable: false,
        enableValue: true,
        enableRowGroup: true,
        enablePivot: true,
      },
      gridApi: null,
      columnApi: null,
      columnDefs: [],
      frameworkComponents: null,
      options: {
        DATA_TYPE_CD: [],
      },
      sideBar: {
        toolPanels: [
          {
            id: 'columns',
            labelDefault: 'Columns',
            labelKey: 'columns',
            iconKey: 'columns',
            toolPanel: 'agColumnsToolPanel',
            minWidth: 225,
            width: 225,
            maxWidth: 225,
          },
          {
            id: 'filters',
            labelDefault: 'Filters',
            labelKey: 'filters',
            iconKey: 'filter',
            toolPanel: 'agFiltersToolPanel',
            minWidth: 180,
            maxWidth: 400,
            width: 250,
          },          
        ],
        defaultToolPanel: '',        
      }      
    };
  },
  methods: {
    //메인그리드 Ready
    onReadyMain(params) {
      // eslint-disable-next-line no-console
      console.log(params);
      //메인그리드 api 정의
      this.gridApi = this.gridOptions.api;
      this.columnApi = this.gridOptions.columnApi;

      setTimeout(() => {
        this.createColumnDefs();
      }, 300);
    },
    //그리드컬럼 정의
    createColumnDefs() {
      const vm = this;

      this.columnDefs = [
        {
          headerName: "No.",
          width: 80,
          valueGetter: (params) => {
            return params.node.rowIndex + 1;
          },
          editable: false,
          sortable: false,
          filter: false,
          resizable: false,
        },
        { headerName: "사이트명", field: "siteNm", width: 180 },
        { headerName: "설비명", field: "assetNm", width: 180 },
        { headerName: "태그ID", field: "tagId", width: 180 },
        { headerName: "태그명", field: "tagNm", width: 300 },
        {
          headerName: "데이터 타입",
          field: "dataTypeCd",
          width: 180,
          cellRenderer: "select",
          cellRendererParams: {
            options: vm.options["DATA_TYPE_CD"],
            detailCd: "key", //서버로 부터 받은 key defalut-"detailCd"
            detailNm: "value", //서버로 부터 받은 value defalut-"detailNm"
          },
        },
        { headerName: "데이터 건수", field: "dataCnt", width: 120 },
        { headerName: "마지막 업데이트 시간", field: "", width: 150 },
        { headerName: "설명", field: "assetDesc", width: 430 },
      ];
    },
    goOpen() {
      const vm = this;

      vm.data = [];

      // code list 조회
      this.$store.commit("loading");
      this.$http
        .post(_url("/api/asset/tag/list"), {
          siteId: this.form.siteId,
          assetId: this.form.assetId,
          tagId: this.form.tagId,
          dataTypeCd: this.form.dataTypeCd,
        })
        .then((response) => {
          this.data = response.data;

          if (response.data.length == 0) {
            this.$swal({
              type: "warning",
              text: "조회내역이 존재하지 않습니다.",
            });
          }
        })
        .finally(() => {
          this.$store.commit("finish");
        });
    },
    queryDataTypeCd() {
      const vm = this;
      this.$store.commit("loading");
      this.$http
        .get("/api/code/combo", {
          params: {
            groupCd: "DATA_TYPE_CD",
          },
        })
        .then((response) => {
          vm.options["DATA_TYPE_CD"] = response.data;
        })
        .catch((response) => {
          return response;
        })
        .finally(() => {
          this.$store.commit("finish");
        });
    },
    onCellDoubleClicked(event) {
      // const idx = event.rowIndex;
      // const field = event.colDef.field;

      const sSiteId = event.node.data.siteId;
      const sAssetId = event.node.data.assetId;
      const sTagId = event.node.data.tagId;

      this.$modal.open({
        component: TagInfoPopup,
        parent: this,
        width: 1800,
        props: { siteId: sSiteId, assetId: sAssetId, tagId: sTagId },
      });
    },
    getDataTypeCdCombo() {
      const vm = this;
      this.$http
        .get(`/api/code/combo`, { params: { groupCd: "DATA_TYPE_CD" } })
        .then((response) => {
          vm.options["DATA_TYPE_CD"] = response.data;
        });
    },
  },
  beforeMount() {
    this.frameworkComponents = {
      //그르드에서 사용할 외부 comp 등록
      select: SelectCellRenderer,
    };
  },
  mounted() {
    this.goOpen();
  },
  created() {
    this.getDataTypeCdCombo();
    //this.queryDataTypeCd();
  },
};
</script>