<template>
  <div class="nearby">
    <div
      class="dd-load2"
      v-show="$showLoad&&$showLoad2==false"
      :style="{position:'absolute',top:showLoadHeight+'px'}"
    >
      <div class="ball"></div>
    </div>
    <div
      class="dd-load"
      v-show="$showLoad2"
      :style="{position:'absolute',top:'50px'}"
    >
      <div class="loadingio-spinner-bean-eater-iyombukjkuf">
        <div class="ldio-k1rdmyftir9">
          <div>
            <div></div>
            <div></div>
            <div></div>
          </div>
          <div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      </div>
    </div>
    <!-- <GmapMap
      :center="markers[0].position"
      :zoom="zoom"
      map-type-id="terrain"
      style="width: 500px; height: 300px"
    >
      <GmapMarker
        @click="marker()"
        ref="myMarker"
        :clickable="true"
        :draggable="true"
        :position="markers[0].position"
      />
    </GmapMap> -->
    <div
      v-show="$SearchResult.length!=0"
      v-for="(item,index) in $SearchResult"
      :key="'Search'+index"
      class="na-card"
    >
      <img
        @click="clickNearByAttraction(item.place_id)"
        class="na-img"
        :src="item.imgNew==''?require('@/assets/img/not-img.png'):item.imgNew"
        alt=""
      >
      <div class="na-decript">
        <img
          style="width:30px;height:30px;float:left;margin-top: -5px"
          :src="item.icon"
          alt=""
        >
        <span
          class="na-title"
          @click="clickNearByAttraction(item.place_id)"
        >{{item.name}}</span>
        <img
          @click="deleteFavor(item.name)"
          v-show="$Favor.map(x=>x.name).indexOf(item.name)>-1"
          src="@/assets/img/favorite.png"
          alt=""
        >
        <img
          v-show="$Favor.map(x=>x.name).indexOf(item.name)==-1"
          @click="addFavor(item)"
          src="@/assets/img/notfavorite.png"
          alt=""
        >
        <br>
        <div style="border-top:1px dashed #cccccc;height: 1px;overflow:hidden"></div>
        <div
          style="margin-left:5px;"
          @click="clickNearByAttraction(item.place_id)"
        >
          地址:{{item.formatted_address}}<br>
          獲得總星數:{{item.user_ratings_total}}<br>
          星數:{{item.rating}}<div class="star"></div><br>
          距離:{{$DIS.GetDistance($locationLat, $locationLng, item.geometry.location.lat(), item.geometry.location.lng())>1000?$DIS.GetDistance($locationLat, $locationLng, item.geometry.location.lat(), item.geometry.location.lng())/1000+' 公里':$DIS.GetDistance($locationLat, $locationLng, item.geometry.location.lat(), item.geometry.location.lng())+' 公尺'}}
        </div>
      </div>
    </div>

    <div
      v-show="$SearchResult.length==0"
      v-for="(item,index) in $NearbyAttractionsList"
      :key="index"
      class="na-card"
    >
      <img
        @click="clickNearByAttraction(item.place_id)"
        class="na-img"
        :src="item.imgNew==''?require('@/assets/img/not-img.png'):item.imgNew"
        alt=""
      >
      <div class="na-decript">
        <img
          style="width:30px;height:30px;float:left;margin-top: -5px"
          :src="item.icon"
          alt=""
        >
        <span
          class="na-title"
          @click="clickNearByAttraction(item.place_id)"
        >{{item.name}}</span>
        <img
          @click="deleteFavor(item.name)"
          v-show="$Favor.map(x=>x.name).indexOf(item.name)>-1"
          src="@/assets/img/favorite.png"
          alt=""
        >
        <img
          v-show="$Favor.map(x=>x.name).indexOf(item.name)==-1"
          @click="addFavor(item)"
          src="@/assets/img/notfavorite.png"
          alt=""
        >
        <br>
        <div style="border-top:1px dashed #cccccc;height: 1px;overflow:hidden"></div>
        <div
          style="margin-left:5px;"
          @click="clickNearByAttraction(item.place_id)"
        >
          地址:{{item.vicinity}}<br>
          獲得總星數:{{item.user_ratings_total}}<br>
          星數:{{item.rating}}<div class="star"></div><br>
          距離:{{$DIS.GetDistance($locationLat, $locationLng, item.geometry.location.lat(), item.geometry.location.lng())>1000?$DIS.GetDistance($locationLat, $locationLng, item.geometry.location.lat(), item.geometry.location.lng())/1000+' 公里':$DIS.GetDistance($locationLat, $locationLng, item.geometry.location.lat(), item.geometry.location.lng())+' 公尺'}}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import globalDataX from '@/store/globalDataX.vue'
  import { log } from 'util'
  import jQuery from "jquery";
  window.$ = window.jQuery = jQuery;
  export default {
    name: 'NearbyAttractions',
    extends: globalDataX,
    data () {
      return {
        loading: true,
        showLoadHeight: 0
      }
    },
    mounted: function () {
      if (this.$NearbyAttractionsList.length == 0) {
        this.$PostValue({ paramName: '$loading', data: true });
        this.$API.getGeolocation(this.$route.params.id);
      }
      var startX = 0;
      var startY = 0;
      var _this = this;
      window.addEventListener('touchstart', function (e) {
        startX = e.changedTouches[0].clientX;
        startY = e.changedTouches[0].clientY;
      })
      window.addEventListener('touchmove', function (e) {
        var moveEndX = e.changedTouches[0].clientX;
        var moveEndY = e.changedTouches[0].clientY;
        var X = moveEndX - startX;
        var Y = moveEndY - startY;
        if (Y > 0) {
          let clientHeight = document.documentElement.clientHeight; //浏览器高度
          let scrollHeight = document.body.scrollHeight;
          let scrollTop = document.documentElement.scrollTop;

          let distance = 50;  //距离视窗还用50的时候，开始触发；

          if ((scrollTop + clientHeight) >= (scrollHeight - distance)) {
            if (Y < 50)
              _this.showLoadHeight = Y;
            if (Y < 50 && _this.$showLoad == false) {
              _this.$PostValue({ paramName: '$showLoad', data: true });
            } else if (Y > 50 && _this.$showLoad2 == false) {
              console.log('AAAA')
              _this.$PostValue({ paramName: '$showLoad2', data: true });
              _this.$API.getGeolocation(_this.$route.params.id);
            }
          }
        }
        else if (Y < 0) {
        }
      })
      window.addEventListener('touchend', function (e) {
        if (_this.$showLoad == true && _this.showLoadHeight < 50) {
          _this.$PostValue({ paramName: '$showLoad', data: false });
        }
      })

    },
    methods: {
      addFavor (data) {
        this.$PushValue({ paramName: '$Favor', data: data })
      },
      deleteFavor (name) {
        this.$deleteFavor(name)
      },
      marker () {
        this.zoom = 20
      },
      clickNearByAttraction (id) {
        console.log('route')
        this.$router.push('/nearby-attraction-details/' + id)
      }
    }
  }
</script>

<style scoped>
.nearby {
  width: 100%;
  height: 85vh;
  overflow-y: scroll;
  position: relative;
}
.na-card {
  height: auto;
  display: flex;
  border-top: 1px solid #efefef;
  border-bottom: 1px solid #efefef;
  padding: 5px;
}
.na-card:active {
  background-color: rgba(242, 244, 246, 1);
}
.na-img {
  flex: 3;
  width: 30%;
}
.na-decript {
  flex: 7;
  padding: 10px;
}
.na-title {
  font-size: 1rem;
  color: #003061;
  margin-right: 10px;
}

.demo-spin-icon-load {
  animation: ani-demo-spin 1s linear infinite;
}
@keyframes ani-demo-spin {
  from {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.icon-loading {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid #ddd;
  border-bottom: none;
  background: transparent;
}
.icon-loading {
  animation: rotate 0.7s infinite;
}
@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.dd-load {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.dd-load2 {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

@keyframes ldio-k1rdmyftir9-1 {
  0% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(-45deg);
  }
  100% {
    transform: rotate(0deg);
  }
}
@keyframes ldio-k1rdmyftir9-2 {
  0% {
    transform: rotate(180deg);
  }
  50% {
    transform: rotate(225deg);
  }
  100% {
    transform: rotate(180deg);
  }
}
.ldio-k1rdmyftir9 > div:nth-child(2) {
  transform: translate(-15px, 0);
}
.ldio-k1rdmyftir9 > div:nth-child(2) div {
  position: absolute;
  top: 20px;
  left: 20px;
  width: 60px;
  height: 30px;
  border-radius: 60px 60px 0 0;
  background: #f8b26a;
  animation: ldio-k1rdmyftir9-1 0.9615384615384615s linear infinite;
  transform-origin: 30px 30px;
}
.ldio-k1rdmyftir9 > div:nth-child(2) div:nth-child(2) {
  animation: ldio-k1rdmyftir9-2 0.9615384615384615s linear infinite;
}
.ldio-k1rdmyftir9 > div:nth-child(2) div:nth-child(3) {
  transform: rotate(-90deg);
  animation: none;
}
@keyframes ldio-k1rdmyftir9-3 {
  0% {
    transform: translate(95px, 0);
    opacity: 0;
  }
  20% {
    opacity: 1;
  }
  100% {
    transform: translate(35px, 0);
    opacity: 1;
  }
}
.ldio-k1rdmyftir9 > div:nth-child(1) {
  display: block;
}
.ldio-k1rdmyftir9 > div:nth-child(1) div {
  position: absolute;
  top: 46px;
  left: -4px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #e15b64;
  animation: ldio-k1rdmyftir9-3 0.9615384615384615s linear infinite;
}
.ldio-k1rdmyftir9 > div:nth-child(1) div:nth-child(1) {
  animation-delay: -0.6968000000000001s;
}
.ldio-k1rdmyftir9 > div:nth-child(1) div:nth-child(2) {
  animation-delay: -0.3432s;
}
.ldio-k1rdmyftir9 > div:nth-child(1) div:nth-child(3) {
  animation-delay: 0s;
}
.loadingio-spinner-bean-eater-iyombukjkuf {
  width: 48px;
  height: 48px;
  display: inline-block;
  overflow: hidden;
  background: rgba(NaN, NaN, NaN, 0);
}
.ldio-k1rdmyftir9 {
  width: 100%;
  height: 100%;
  position: relative;
  transform: translateZ(0) scale(0.48);
  backface-visibility: hidden;
  transform-origin: 0 0; /* see note above */
}
.ldio-k1rdmyftir9 div {
  box-sizing: content-box;
}
/* generated by https://loading.io/ */

.ball {
  position: absolute;
  width: 30px;
  height: 30px;
  z-index: 999999;
  border-radius: 30px 30px 0 0;
  border-radius: 50%;
  background: #f8b26a;
}
/* generated by https://loading.io/ */
</style>
