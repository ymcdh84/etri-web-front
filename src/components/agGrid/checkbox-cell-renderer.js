import Vue from 'vue';
import uuid from '@/libs/uuid'

export default Vue.extend({
    template: `
    <div>
    <input 
      type="checkbox"
      :id="id"
      :checked="data"
      :disabled="disabled"      
      @click="checkedHandler($event)"
    />
    <label :for="id">&nbsp;</label>
    </div>
`,
  data() {
    return {
      id: undefined,
      data: false,
      disabled: false, 
      trueValue: "Y",
      falseValue: "N",
    }
  },
  created() {
    this.id = uuid()
    this.disabled = !this.params.colDef.editable
  },
  methods: {
    checkedHandler(event) {
      let checked = null

      if(this.params.colDef.cellRendererParams === undefined){
        checked = event.target.checked ? this.trueValue : this.falseValue
      }else{

        let fValue = typeof this.params.colDef.cellRendererParams.falseValue === 'boolean' ? false : this.params.colDef.cellRendererParams.falseValue

        checked = event.target.checked ? this.params.colDef.cellRendererParams.trueValue : fValue
      }

      let colId = this.params.column.colId

      this.params.node.setDataValue(colId, checked);
    }
  }, watch: {
    'value': { 
      immediate: true,
      deep: true,
      handler() {
        this.$nextTick(() => {

          let tVal

          if(this.params.colDef.cellRendererParams !== undefined){
            tVal = this.params.colDef.cellRendererParams.trueValue
          }
          
          this.data = this.params.value === (tVal || this.trueValue) ? true : false

        })
      }
    }
  }
});