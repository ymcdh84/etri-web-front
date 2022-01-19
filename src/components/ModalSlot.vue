<template>
  <div class="modal-card pop_min" id="draggable">
    <header class="modal-card-head pop-header">
      <!--팝업 확대 -->
      <button type="button" class="btn" @click="move" style="font-size:20px; color:#fff; position:absolute;top:8px;right:65px;z-index:30;">
        <i class="fas fa-window-maximize"></i>
      </button>

      <div class="modal-card-title tit">
        <slot name="header">
        </slot>
      </div>
    </header>

    <section class="modal-card-body pop-content">
      <slot name="content"></slot>
    </section>
  </div>
</template>

<script>
export default {
  name: "ModalSlot",
  props: {
      graphPop: {
        type: String,
        required: false,
      },
  },
  data() {
    return {
      isMxMn: true
    }
  },
  methods: {
    move() {
      if(this.isMxMn) {
        if(this.graphPop == "graphPop"){
          $(".modal-card").removeClass('pop_min2')
          $(".animation-content").removeClass('pop_min2')
        }else{
          $(".modal-card").removeClass('pop_min')
          $(".animation-content").removeClass('pop_min')
        }

        $(".modal-card").addClass('pop_max');
        $(".animation-content").addClass('pop_max');
        this.isMxMn = false
      } else {
        $(".modal-card").removeClass('pop_max')
        $(".animation-content").removeClass('pop_max')

        if(this.graphPop == "graphPop"){
          $(".modal-card").addClass('pop_min2');
          $(".animation-content").addClass('pop_min2');          
        }else{
          $(".modal-card").addClass('pop_min');
          $(".animation-content").addClass('pop_min');
        }  
        this.isMxMn = true
      }
    }
  },
  mounted() {
    //pop slots modal move
    if(this.graphPop == "graphPop"){
      $(".animation-content").addClass('pop_min2');
    }else{
      $(".animation-content").addClass('pop_min');
    }
    $(".animation-content").draggable({'cancel':'.modal-card-body'});
    //ModalSlot open z-index change
    $('.lnb').css('z-index', '4');
  },
  destroyed() {
    //ModalSlot open z-index change
    $('.lnb').css('z-index', '7');
  }
}
</script>

<style>

</style>
