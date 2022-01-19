<template>
<div class="modal-tag" id="draggable">
  <header class="modal-tag-head pop-header">
    <!-- <button type="button" class="btn" @click="move" style="font-size:20px; color:#fff; position:absolute;top:9px;right:70px;z-index:30;"><i class="fas fa-window-maximize"></i></button> -->
    <div class="modal-tag-title tit">
      태그 상세 정보
      <button type="button" class="btn-close" aria-label="close" @click="$parent.close()"></button>
    </div>
  </header>
  <section class="modal-tag-body pop-content">
    <div class="inner-box">
      <div class="btn-wrap btn-type1 clearfix" >
        <button type="button" class="btn btn-success btn-sm" @click="buttonClickEventSave()">
          <i class="fas fa-save"></i>
          저장
        </button>
      </div>
      <div class="table-area">
          <div class="modal-tag-title">태그설정</div>
          <table id="basic" class="table">
              <colgroup>
                  <col width="20%">
                  <col width="80%">
              </colgroup>
              <tbody>
              <tr>
                  <th class="tp-a">태그 ID</th>
                  <td>
                    <!-- <input class="modal-tag-input" type="text" v-model="form.tagId" > -->
                    <div>{{form.tagId}}</div>
                  </td>
              </tr>
              <tr>
                  <th class="tp-a">태그명</th>
                  <td>
                    <!-- <input class="modal-tag-input" type="text" v-model="form.tagNm" > -->
                    <input class="modal-tag-input" type="text" v-model="form.tagNm" :disabled="form.modelConfirmYn === 'Y'">
                  </td>
              </tr>
              <tr>
                  <th class="tp-a">태그 타입</th>
                  <td>
                    <!-- <input class="modal-tag-input" type="text" v-model="form.dataTypeCd" > -->
                    <!-- <div>{{form.dataTypeCd}}</div> -->
                    <div class="search_con search-area">
                        <b-select class="select is-fullwidth" v-model="form.dataTypeCd" :disabled="form.modelConfirmYn === 'Y'">
                            <option value=''>==전체==</option>
                            <option
                                    v-for="item in dataTypeCds"
                                    :key="item.key"
                                    :value="item.key"
                                    v-text="item.value"/>
                        </b-select>
                    </div>                    
                  </td>
              </tr>
              <tr>
                  <th class="tp-a">태그설명</th>
                  <td>
                    <input class="modal-tag-input" type="text" v-model="form.tagDesc" >
                  </td>
              </tr>
              </tbody>
          </table>
      </div>
      <div class="table-area">
          <div  class="modal-tag-title">추가설정</div>
          <table id="basic" class="table">
              <colgroup>
                  <col width="20%">
                  <col width="80%">
              </colgroup>
              <tbody>
              <tr>
                  <th class="tp-a">얼리어스</th>
                  <td>
                      <input class="modal-tag-input" type="text" v-model="form.alias" :disabled="form.modelConfirmYn === 'Y'">
                      <!-- <div>{{form.alias}}</div> -->
                  </td>
              </tr>
              <tr>
                  <th class="tp-a">단위</th>
                  <td>
                    <input class="modal-tag-input" type="text" v-model="form.format" >
                  </td>
              </tr>
              <tr>
                  <th class="tp-a">맵핑키</th>
                  <td>
                    <!-- <input class="modal-tag-input" type="text" v-model="form.mappingKey" > -->
                    <div>{{form.mappingKey}}</div>
                  </td>
              </tr>
              </tbody>
          </table>
      </div>      

      <div class="table-area">
          <div class="modal-tag-title">밴드설정</div>
          <table id="basic" class="table">
              <colgroup>
                  <col width="10%">
                  <col width="30%">
                  <col width="30%">
                  <col width="30%">
              </colgroup>
              <tbody>
                <tr>
                    <th class="tp-a"></th>
                    <td>
                      <div class="modal-tag-info">정보</div>
                    </td>
                    <td>
                      <div class="modal-tag-warn">경고</div>
                    </td>
                    <td>
                      <div class="modal-tag-serious">심각</div>
                    </td>
                </tr>                
                <tr>
                    <th class="tp-a">HIGH</th>
                    <td>
                      <input class="modal-tag-input" type="text" v-model="form.alarmInfoMaxVal" >
                    </td>
                    <td>
                      <input class="modal-tag-input" type="text" v-model="form.alarmWormMaxVal" >
                    </td>
                    <td>
                      <input class="modal-tag-input" type="text" v-model="form.alarmEmerMaxVal" >
                    </td>
                </tr>
                <tr>
                    <th class="tp-a">LOW</th>
                    <td>
                      <input class="modal-tag-input" type="text" v-model="form.alarmInfoMinVal" >
                    </td>
                    <td>
                      <input class="modal-tag-input" type="text" v-model="form.alarmWormMinVal" >
                    </td>
                    <td>
                      <input class="modal-tag-input" type="text" v-model="form.alarmEmerMinVal" >
                    </td>
                </tr>
              </tbody>
          </table>
      </div>      

    </div>
  </section>
</div>
</template>
<script>

export default {
  props: {
    'siteId': {
      type: String,
      required: true
    },
    'assetId': {
      type: String,
      required: true
    },
    'tagId': {
      type: String,
      required: true
    }
  },
  name: "ModalSlot",
  data() {
    return {
      data: [],
      dataTypeCds: [],
      form: {
        siteId: '',
        assetId: '',
        tagId: '',
        tagNm: '',
        tagDesc: '',
        dataTypeCd: '',
        cycle: '',
        importanceCd: '',
        alias: '',
        inputMinVal: '',
        inputMaxVal: '',
        format: '',
        alarmInfoMinVal: '',
        alarmInfoMaxVal: '',
        alarmWormMinVal: '',
        alarmWormMaxVal: '',
        alarmEmerMinVal: '',
        alarmEmerMaxVal: '',
        useYn: '',
        dataCnt: '',
        mappingKey: '',
        modelConfirmYn : ''
      },
    }
  },
  methods: {
    query() {
      let vm = this

      //code list 조회
      this.$store.commit('loading') 
      this.$http
        .post("/api/tag/one", {
          siteId: this.siteId,
          assetId: this.assetId,
          tagId: this.tagId,          
        })
        .then(response => {
          vm.form = response.data[0];
        }).finally(() => {
          this.$store.commit('finish')
        });
    },
    buttonClickEventSave(){
      this.$swal({
          type: 'info',
          text: `변경사항을 저장 하시겠습니까?`,
          showCancelButton: true,
          confirmButtonText: '예',
          cancelButtonText: '아니오',
      }).then((result) => {
          if (result.value) {
            
            this.$store.commit('loading')

            this.$http
              .put('/api/tag/save',this.form)
              .then(response => {
                this.$swal({ type: 'success', text: '저장되었습니다.' });
                this.$emit('callBackFunc'); 
            }).finally(() => {
              this.$store.commit('finish')
            });
          }
      });
    },
    getDataTypeCdCombo() {
        this.$http.get(`/api/code/combo`, {params: {groupCd: "DATA_TYPE_CD"}})
            .then(response => {
                this.dataTypeCds = response.data;
            });
    },
  },
  created() {
    this.getDataTypeCdCombo();
    this.query()
  },
}
</script>
