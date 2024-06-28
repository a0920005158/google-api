<template>
  <div>
    <div
      class="sign-no-open"
      v-if="$Favor.length==0"
    >
      我的最愛是空的!
    </div>
    <div
      class="nearby"
      v-if="$Favor.length!=0"
    >
      <div class="header">我的最愛</div>
      <div class="card-body-h">
        <!-- <div
          v-for="(item,index) in $Favor"
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
              地址:{{Object.keys(item).indexOf('vicinity')>-1?item.vicinity:item.formatted_address}}<br>
              獲得總星數:{{item.user_ratings_total}}<br>
              星數:{{item.rating}}<div class="star"></div><br>
              距離:{{$DIS.GetDistance($locationLat, $locationLng, item.geometry.location.lat(), item.geometry.location.lng())>1000?$DIS.GetDistance($locationLat, $locationLng, item.geometry.location.lat(), item.geometry.location.lng())/1000+' 公里':$DIS.GetDistance($locationLat, $locationLng, item.geometry.location.lat(), item.geometry.location.lng())+' 公尺'}}
            </div>
          </div>
        </div> -->

        <div
          v-for="(element2, indextt) in list2"
          :key="'list2t'+indextt"
        >
          <div
            class="time-title"
            @click="updateDate(indextt,element2.time,'time')"
          >
            <span v-if="element2.time.seconds!=undefined">{{new Date(Number(element2.time.seconds)*1000).getFullYear()+'/'+(Number(new Date(Number(element2.time.seconds)*1000).getMonth())+1)+'/'+new Date(Number(element2.time.seconds)*1000).getDate()}}</span>
            <span v-if="element2.time.seconds==undefined">{{element2.time=='點擊輸入日期'?element2.time:element2.time.Format("yyyy-MM-dd")}}</span>
          </div>
          <draggable
            class="list-group1"
            :list="element2.data"
            group="people"
            @change="log"
          >
            <div
              class="list-group-item"
              v-for="(element3, index) in element2.data"
              :key="'list2'+index"
            >
              <img :src="element3.name.imgNew==''?require('@/assets/img/not-img.png'):element3.name.imgNew">
              {{ element3.name.name }}
            </div>
          </draggable>
        </div>

        <div class="time-title1">我的最愛</div>
        <draggable
          class="list-group1"
          :list="list1"
          group="people"
          @change="log"
        >
          <div
            class="list-group-item"
            v-for="(element, index) in list1"
            :key="index"
          >
            <img :src="element.name.imgNew==''?require('@/assets/img/not-img.png'):element.name.imgNew">
            {{ element.name.name }}
          </div>
        </draggable>
        <!-- <div class="line-div">
          <div
            class="line-img"
            style="margin-left:5%;"
          ></div>
          <div class="line"></div>
          <div class="line-img"></div>
          <div class="line"></div>
          <div class="line-img"></div>
          <div class="line"></div>
          <div class="line-img"></div>
        </div> -->
        <p-button
          type="success"
          block
          @click="AddPlan()"
        >儲存旅遊規劃</p-button>
      </div>
    </div>

    <mt-datetime-picker
      ref="picker"
      type="date"
      year-format="{value} 年"
      month-format="{value} 月"
      date-format="{value} 日"
      v-model="pickerValue"
      @confirm="UpdateTime()"
    >
      >
    </mt-datetime-picker>
  </div>
</template>

<script>
  import globalDataX from '@/store/globalDataX.vue'
  import draggable from 'vuedraggable'
  import Swal from 'sweetalert2/dist/sweetalert2.js'
  import 'sweetalert2/src/sweetalert2.scss'

  export default {
    extends: globalDataX,
    data () {
      return {
        pickerValueIndex: '',
        pickerValue: new Date(),
        list1: [
          { name: { name: "", imgNew: '' }, id: 1 },
        ],
        list2: [{ time: '點擊輸入日期', data: [] }],
        drag: false
      };
    },
    mounted: function () {
      var tt = this.$Favor.map((name, index) => {
        console.log('ggss')
        console.log(name)
        return { name, order: index + 1 };
      })
      this.list = tt
      var tt1 = this.$Favor.map((name, index) => {
        console.log('ggss')
        console.log(name)
        return { name, id: index + 1 };
      })
      this.list1 = tt1
    },
    computed: {
      dragOptions () {
        return {
          animation: 200,
          group: "description",
          disabled: false,
          ghostClass: "ghost"
        };
      }
    },
    components: {
      draggable,
    },
    methods: {
      AddPlan () {
        console.log('~~~~旅遊規劃~~~~')
        console.log(this.list2)
      },
      UpdateTime () {
        this.list2[this.pickerValueIndex].time = this.pickerValue;
      },
      updateDate (index, data, UpdateItem) {
        this.$refs.picker.open();
        this.pickerValueIndex = index;
      },
      sort () {
        this.list = this.list.sort((a, b) => a.order - b.order);
      },
      clickNearByAttraction (id) {
        console.log('route')
        this.$router.push('/nearby-attraction-details/' + id)
      },
      log: function (evt) {
        window.console.log(evt);
      }
    }
  }
</script>

<style>
.time-title1 {
  background-color: rgba(255, 80, 47, 1);
  color: white;
  text-align: center;
}
.time-title {
  background-color: rgba(91, 209, 215, 1);
  color: white;
  text-align: center;
}
.line-div {
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
}
.line {
  width: 10%;
  height: 5px;
  background-color: rgba(32, 73, 105, 0.7);
  border-radius: 5px;
}
.line-img {
  width: 15%;
  height: 30px;
  background: url(../../assets/img/nature.png) no-repeat center;
  background-size: contain;
}
.card-body-h {
  width: 100%;
  height: calc(100vh - 94px);
  overflow-y: auto;
}
.header {
  background: rgba(35, 87, 137, 1);
  height: 30px;
  position: relative;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1rem;
}
.sign-no-open {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  padding-top: 20px;
  color: #fff;
  font-weight: 600;
  font-size: 1rem;
  background-color: rgba(71, 95, 119, 1);
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

.flip-list-move {
  transition: transform 0.5s;
}
.no-move {
  transition: transform 0s;
}
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
.list-group {
  min-height: 20px;
}
.list-group1 {
  background: rgba(187, 222, 214, 1);
  width: 100%;
  min-height: 110px;
  overflow: hidden;
  /* height: auto; */
}
.list-group-item {
  width: calc(25% - 10px);
  float: left;
  cursor: move;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100px;
  font-size: 0.6rem;
  padding: 5px;
  margin: 5px;
  text-align: center;
  border-style: none;
}
.list-group-item i {
  cursor: pointer;
}
</style>