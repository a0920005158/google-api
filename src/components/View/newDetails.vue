<template>
  <div class="ww-body">
    <mt-header title="旅遊手記">
      <router-link
        to="/news"
        slot="left"
      >
        <mt-button icon="back">返回</mt-button>
      </router-link>
      <mt-button
        icon="more"
        slot="right"
      ></mt-button>
    </mt-header>
    <div class="write-store-title">
      {{$NoteData[$route.params.id].TravelNotes.title}}
    </div>
    <div class="write-store-content">
      {{$NoteData[$route.params.id].TravelNotes.content}}
    </div>
    <div
      v-for="(item,index) in $NoteData[$route.params.id].TravelNotes.imgContent"
      :key="index"
    >
      <img
        :src="item.img"
        width="100%"
        height="200"
      >
      <div class="write-store-img-content">
        {{item.content}}
      </div>
    </div>
  </div>
</template>

<script>
  import globalDataX from '@/store/globalDataX.vue'
  export default {
    extends: globalDataX,
  }
</script>

<style>
.ww-body {
  width: 100%;
  height: calc(100vh - 64px);
  overflow-y: auto;
}
.write-store-title {
  border-bottom: 2px solid rgba(43, 65, 98, 0.5);
  font-size: 1.2rem;
  text-align: center;
  word-wrap: break-word;
  white-space: pre-wrap;
  background-color: rgba(245, 240, 246, 1);
}
.write-store-content {
  border-bottom: 1px solid rgba(43, 65, 98, 0.5);
  font-size: 1rem;
  word-wrap: break-word;
  white-space: pre-wrap;
  background-color: white;
}
.write-store-img-content {
  font-size: 1rem;
  word-wrap: break-word;
  white-space: pre-wrap;
  background-color: rgba(56, 95, 113, 1);
  color: rgba(245, 240, 246, 1);
}
</style>