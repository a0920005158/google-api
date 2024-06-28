<template>
  <div>
    <div id="map"></div>
    <mt-search
      v-show="$route.path=='/nearby-attractions'"
      v-model="value"
      cancel-text="取消"
      placeholder="搜索"
      style="height:10%;"
      @keyup.enter.native="search"
    >
    </mt-search>
    <router-view></router-view>
    <mt-tabbar
      v-model="selected"
      style="position: fixed;bottom: 0px;height:10vh;z-index:99999"
    >
      <mt-tab-item id="nearby-attractions">
        <div
          @click="goto('/nearby-attractions')"
          class="mt-tab-item"
        >
          <div class="near"></div>
          附近景點
        </div>
      </mt-tab-item>
      <mt-tab-item id="travel-cost-count">
        <div
          class="mt-tab-item"
          @click="goto('/travel-cost-count')"
        >
          <div class="count"></div>
          旅費計算
        </div>
      </mt-tab-item>
      <mt-tab-item id="favor">
        <div
          class="mt-tab-item"
          @click="goto('/favor')"
        >
          <div class="heart"></div>
          我的最愛
        </div>
      </mt-tab-item>
      <mt-tab-item id="news">
        <div class="mt-tab-item">
          <div
            class="news"
            @click="goto('/news')"
          ></div>
          旅遊手記
        </div>
      </mt-tab-item>
    </mt-tabbar>
  </div>
</template>

<script>
  import globalDataX from '@/store/globalDataX.vue'
  import { log } from 'util'
  export default {
    extends: globalDataX,
    data () {
      return {
        value: '',
        selected: this.$route.path.replace('/', ''),
      }
    },
    watch: {
      value (val) {
        if (val == '')
          this.$PostValue({ paramName: '$SearchResult', data: [] })
      },
      '$route' (val) {
        // if (val.path.indexOf('/nearby-attraction-details/') > -1) {
        //   this.$API.getGeolocation(this.$route.params.id);
        // }
        this.$PostValue({ paramName: '$NowRouter', data: val.path })
      },
      '$RouterPush' (val) {
        if (val != '') {
          this.$router.push(val)
          this.$PostValue({ paramName: '$RouterPush', data: '' })
        }
      }
    },
    mounted () {
      this.$PostValue({ paramName: '$NowRouter', data: this.$route.path })
      console.log('-----------mounted初始化---------------')
      console.log(this.$route.path)
      if (this.$NearbyAttractionsList.length == 0 && this.$route.path == '/nearby-attractions') {
        this.$API.getGeolocation(this.$route.params.id);
      } else {
        this.$PostValue({ paramName: '$loading', data: false });
      }
    },
    methods: {
      search () {
        this.$API.Search(this.value)
      },
      goto (path) {
        if (path == this.$route.path)
          return
        console.log(path)
        this.$router.push(path)
      },
    }
  }
</script>

<style>
</style>
