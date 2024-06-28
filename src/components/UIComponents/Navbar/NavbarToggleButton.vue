<template>
  <button
    aria-label="Navbar toggle button"
    class="navbar-toggler"
    style="position:relative;"
    type="button"
  >
    <div class="new-message" v-if="$ifread.length!=0"></div>
    <!-- <badge
      style="border-radius:50%;position:absolute;z-index:5;left:-25px;top:-15px;"
      type="danger"
    >4</badge>-->
    <span class="navbar-toggler-bar bar1"></span>
    <span class="navbar-toggler-bar bar2"></span>
    <span class="navbar-toggler-bar bar3"></span>
  </button>
</template>
<script>
import globalDataX from "@/store/globalDataX.vue";
export default {
  extends: globalDataX,
  name: 'navbar-toggle-button',
  computed: {
    ifreadTotalTime () {
      var time = 0
      if (this.$ifread.length != 0)
        this.$ifread.forEach(el => {
          time = time + el.time
        });
      return time
    }
  }
}
</script>
<style>
.new-message {
  padding: 0px;
  width: 15px;
  height: 15px;
  background: radial-gradient(circle at 3px 3px, #f5587b, #e41749);
  border-radius: 50%;
  box-shadow: 0 0 10px #f5587b;
  position: absolute;
  z-index: 5;
  left: -15px;
  top: -10px;
  -webkit-animation-timing-function: ease-in-out;
  -webkit-animation-name: lightredmove;
  -webkit-animation-duration: 1000ms;
  -webkit-animation-iteration-count: infinite;
  -webkit-animation-direction: alternate;
}
@-webkit-keyframes lightredmove {
  0% {
    opacity: 0.6;
    box-shadow: 0 0 10px rgba(222, 60, 60, 1);
  }

  100% {
    opacity: 1;
    box-shadow: 0 0 10px rgba(192, 0, 0, 1);
  }
}
.new-message span {
  font-size: 8px;
  color: wheat;
  position: relative;
  font-weight: 900;
}
</style>
