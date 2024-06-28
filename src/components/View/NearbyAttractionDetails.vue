<template>
  <div class="details-bgc">
    <mt-header title="景點資訊">
      <router-link
        to="/nearby-attractions"
        slot="left"
      >
        <mt-button icon="back">返回</mt-button>
      </router-link>
      <mt-button
        icon="more"
        slot="right"
      ></mt-button>
    </mt-header>
    <div
      v-show="$Details.length==0"
      class="demo-spin-col"
    >
      <img :src="require('@/assets/img/load.gif')">
      <div>Loading...</div>
    </div>
    <div
      class="details-card"
      v-if="$Details.map(x=>x.id).indexOf($route.params.id)!=-1"
    >
      <div class="details-title">
        {{$Details[$Details.map(x=>x.id).indexOf($route.params.id)].place.name}}
      </div>
      <img
        style="display: block;"
        :width="clientWidth*0.9"
        :src="$PhotosUrl[$PhotosUrl.map(x=>x.id).indexOf($route.params.id)].url"
      >
      <div class="details-inf">
        {{$Details[$Details.map(x=>x.id).indexOf($route.params.id)].place.formatted_phone_number}}<br>
        <div style="color:white;">{{$Details[$Details.map(x=>x.id).indexOf($route.params.id)].place.formatted_address}}</div>
        <div style="display:flex">
          <!-- <a
            :href="'https://www.google.com.tw/maps/place/'+$Details[$Details.map(x=>x.id).indexOf($route.params.id)].formatted_address"
            target="_blank"
          > 導航 </a> -->
          <div
            @click="callGoogleUrl('https://www.google.com/maps/search/?api=1&query='+String(Object.keys($Details[$Details.map(x=>x.id).indexOf($route.params.id)].place).indexOf('vicinity')>-1?String($Details[$Details.map(x=>x.id).indexOf($route.params.id)].place.vicinity).replace(/ /g, '+'):String($Details[$Details.map(x=>x.id).indexOf($route.params.id)].place.formatted_address).replace(/ /g, '+')))"
            style="position:relative;bottom:-5px;color:#8DB87C;"
          >導航</div>
          <div class="navigation"></div>
        </div>
      </div>
      <div class="comment-title">真心評論</div>
      <div
        v-for="(item,index) in $Details[$Details.map(x=>x.id).indexOf($route.params.id)].place.reviews"
        :key="index"
      >
        <div class="comment">
          <div class="comment-user">
            <img
              width="25px;"
              :src="item.profile_photo_url"
              alt=""
            >
            <span class="comment-name">{{item.author_name}}</span>
          </div>
          <span class="comment-text">{{item.text}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import globalDataX from '@/store/globalDataX.vue'
  export default {
    extends: globalDataX,
    data () {
      return {
        clientWidth: document.body.clientWidth,
      }
    },
    computed: {
    },
    mounted: function () {
      if (this.$NearbyAttractionsList.length == 0) {
        this.$API.getGeolocation(this.$route.params.id);
      } else {
        this.$API.getPlaceDetails(this.$route.params.id)
        this.$PostValue({ paramName: '$loading', data: false });
      }
    },
    methods: {
      openGoogleMap () {
        this.$router.push('/googlemap/')
      },
      callGoogleUrl (url) {
        console.log(url)
        var download_link, iframe, loadDateTime, redirected, scheme_link, t;
        scheme_link = url;
        download_link = 'https://google-maps.en.uptodown.com/android';
        redirected = false;
        window.open(scheme_link);
        // var from = document.createElement("form");
        // from.setAttribute('method', "get");
        // from.setAttribute('action', scheme_link);
        // from.setAttribute('target', "CHATFORM");
        // from.setAttribute('id', "chatform");
        // from.setAttribute('type', "hidden");

        // document.body.appendChild(from);
        // document.getElementById('chatform').submit();
        // document.getElementById('chatform').remove();
      }
    }
  }
</script>

<style>
.details-title {
  text-align: center;
  background-color: rgba(35, 87, 137, 1);
  color: rgba(253, 255, 252, 1);
  padding: 5px;
}

.details-bgc {
  width: 100%;
  height: 90vh;
  background-color: rgba(228, 204, 179, 1);
  overflow-y: scroll;
}

.details-card {
  margin: 0;
  padding: 0px;
  box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2);
  position: relative;
  left: 5%;
  width: 90%;
  height: 100%;
  background-color: rgba(246, 222, 212, 1);
}

.comment-title {
  border: 1px solid rgba(185, 167, 149, 1);
  background-color: rgba(187, 107, 78, 1);
  color: #ffffff;
  text-align: center;
  margin: 0;
}

.comment {
  border: 1px solid rgba(185, 167, 149, 1);
  border-style: dashed;
  background: rgba(250, 198, 116, 0.7);
}

.comment-user {
  display: flex;
  margin-left: 5px;
  align-items: center;
}

.comment-name {
  color: rgba(227, 139, 115, 1);
}

.comment-text {
  margin-left: 20px;
}

.details-inf {
  background-color: rgba(33, 124, 126, 1);
  color: rgba(243, 239, 224, 1);
  padding-left: 15px;
}

.mint-header > h1 {
  margin-top: 20px;
}
</style>