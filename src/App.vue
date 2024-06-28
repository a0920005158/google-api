<template>
  <div id="app">
    <div
      v-show="$loading"
      class="demo-spin-col"
    >
      <img src="./assets/img/load.gif">
      <div>Loading...</div>
    </div>
    <router-view />
  </div>
</template>

<script>
  import globalDataX from '@/store/globalDataX.vue'
  export default {
    extends: globalDataX,
    name: 'App'
  }
</script>

<style>
html,
body,
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  width: 100%;
  height: 100%;
  margin: 0px;
  position: relative;
  overflow: hidden;
  -webkit-overflow-scrolling: touch;
}
.demo-spin-col {
  z-index: 1000;
  height: 100%;
  width: 100%;
  background-color: #1ee3cf;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: white;
}
</style>
