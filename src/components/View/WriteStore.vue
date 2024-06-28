<template>
  <div class="ww-body">
    <mt-header title="撰寫遊記">
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
    <div
      @click="showTitleText=!showTitleText"
      v-show="!showTitleText"
      class="write-store-title"
    >
      {{title}}
    </div>
    <b-form-textarea
      v-show="showTitleText"
      id="textarea"
      v-model="title"
      placeholder="輸入標題內容..."
      rows="3"
      max-rows="6"
      maxlength="20"
    ></b-form-textarea>
    <p-button
      v-show="showTitleText"
      type="success"
      block
      @click="AddTitle()"
    >新增遊記標題</p-button>
    <div
      @click="showContentText=!showContentText"
      v-show="!showContentText&&!showTitleText"
      class="write-store-content"
    >
      {{content}}
    </div>
    <b-form-textarea
      maxlength="200"
      v-show="!showTitleText&&showContentText"
      id="textarea"
      v-model="content"
      placeholder="輸入概述內容..."
      rows="1"
      max-rows="1"
    ></b-form-textarea>
    <p-button
      v-show="!showTitleText&&showContentText"
      type="success"
      block
      @click="AddContent()"
    >新增概述</p-button>
    <div v-show="!showContentText&&!showTitleText">
      <div
        v-for="(item,index) in imgContent"
        :key="index"
      >
        <!--傳送圖片按鈕-->
        <div
          class="img-upload-btn"
          v-show="item.img==''"
          @click="uploadImgClick(index)"
        >
          <img
            :src="require('@/assets/img/file-picture.png')"
            alt
            class="bottomfunctionbtn"
          />
        </div>
        <img
          @click="uploadImgClick(index)"
          v-show="item.img!=''"
          :src="item.img"
          width="100%"
          height="200"
        >
        <!--傳送圖片input-->
        <input
          @change="sendImg"
          accept="image/*"
          id="upload_img"
          style="display:none;"
          type="file"
        />
        <b-form-textarea
          maxlength="500"
          v-show="!showTitleText&&!showContentText&&item.showContentText"
          id="textarea"
          v-model="item.content"
          placeholder="輸入圖片說明..."
          rows="1"
          max-rows="1"
        ></b-form-textarea>
        <div
          @click="item.showContentText=!item.showContentText"
          v-show="!showContentText&&!showTitleText&&!item.showContentText"
          class="write-store-img-content"
        >
          {{item.content}}
        </div>

        <p-button
          v-show="!showTitleText&&!showContentText&&(item.showContentText||imgContent[index].img==''||imgContent[index].content=='')"
          type="success"
          block
          @click="AddList(index)"
        >新增圖片與內容</p-button>
      </div>
    </div>
    <p-button
      v-show="!showTitleText&&!showContentText"
      type="success"
      block
      @click="releaseList()"
    >發布旅遊手記</p-button>
  </div>
  </div>
</template>

<script>
  import AppFooter from './AppFooter'
  import AppNavbar from './AppNavbar'
  import Swal from 'sweetalert2/dist/sweetalert2.js'
  import 'sweetalert2/src/sweetalert2.scss'
  import { db } from '@/FireBase/firebase.js';
  import firebase from 'firebase/app';
  import globalDataX from '@/store/globalDataX.vue'
  import { TimeLine, TimeLineItem, Card, DropDown, Badge } from '@/components/UIComponents'
  import { log } from 'util';
  var WW;
  export default {
    extends: globalDataX,
    data () {
      return {
        title: '',
        content: '',
        showTitleText: true,
        showContentText: true,
        imgContent: [{ img: '', content: '', showContentText: true }],
        ClickIndex: -1
      }
    },
    created: function () {
      WW = this;
    },
    mounted: function () {
      if (this.$user.email == undefined) {
        alert('請先登入會員')
        this.$router.push('/news')
      }
    },
    methods: {
      releaseList () {
        if (this.title != '' && this.content != '' && this.imgContent[0].img != '' && this.imgContent.content != '') {
          var test = db.firestore().collection('TravelNotes')
          var temp = []
          var Today = new Date();
          this.imgContent.forEach(el => {
            if (el.img != '' && el.content != '') {
              temp.push(el)
            }
          })
          test.where("UserId", "==", this.$user.email)
            .get().then(snapshot => {
              db.firestore().collection('TravelNotes')
                .add({
                  UserId: this.$user.email,
                  CreatTime: Today.getFullYear() + " 年 " + (Today.getMonth() + 1) + " 月 " + Today.getDate() + " 日",
                  TravelNotes: {
                    title: this.title,
                    content: this.content,
                    imgContent: temp,
                  },
                  look: 0
                })
                .then(() => {
                  Swal.fire(
                    '發布成功!',
                    'success'
                  )
                  this.title = '';
                  this.content = '';
                  this.showTitleText = true;
                  this.showContentText = true;
                  this.imgContent = [{ img: '', content: '', showContentText: true }];
                  this.ClickIndex = -1
                })
                .catch(() => {
                  alert('資料在送出時遇到問題！')
                })
            })
        } else {
          alert('請檢查是否有空白內容!')
        }
      },
      AddTitle () {
        this.showTitleText = false
      },
      AddContent () {
        this.showContentText = false
      },
      AddList (index) {
        this.imgContent[index].showContentText = false;
        if (index == this.imgContent.length - 1 && this.imgContent[index].img != '' && this.imgContent[index].content != '' && this.imgContent.length + 1 < 21)
          this.imgContent.push({ img: '', content: '', showContentText: true })
        if (this.imgContent.length + 1 > 20)
          alert('最多新增20筆圖片訊息')
      },
      uploadImgClick (index) {
        //點擊上傳圖片按鈕，觸發input file
        var upload_img = document.getElementById("upload_img");
        this.ClickIndex = index;
        upload_img.click();
      },
      sendImg (e) {
        //寄圖片
        this.imgAdd(e, function (data) {
          WW.imgContent[WW.ClickIndex].img = data
        });
      },
      imgAdd (input, callback) {
        let File = input.target.files[0];

        if (input.target.files && input.target.files[0]) {

          console.log(input);

          var reader = new FileReader();
          var limit = 512000;
          if (File.size > limit) {
            reader.onload = function (input) {
              console.log("---壓縮前---");
              console.log(File.size);
              var img = new Image();

              var head = "data:image/jpg;base64,";
              img.imgFileSize = 512000;
              img.icount = 0;
              img.onload = function () {
                WW.repeatCompress(img.src, File.size, function (compressImg) {
                  console.log("~~~~~~~~~~~~~~~成功");
                  console.log(
                    ((compressImg.length - head.length) * 3) / 4 / 1024
                  );
                  // document.getElementById('canvasImg').src = compressImg;
                  if (
                    ((compressImg.length - head.length) * 3) / 4 / 1024 >
                    5500
                  ) {
                    alert("圖片檔案過大!");
                  } else {
                    console.log('壓縮結果')
                    callback(compressImg)
                  }
                });
              };
              img.src = input.target.result;
            };
          } else {
            reader.onload = function (e) {
              console.log('不用壓縮')
              callback(e.target.result)
            };
          }

          reader.readAsDataURL(input.target.files[0]);
          input.value = "";
        } else {
          alert("open file fail");
        }
      },
      repeatCompress (input, imgFileSize, callback) { //重複壓縮至固定大小
        var img = new Image();
        var head = "data:image/jpg;base64,";
        var PreviousSize = 0;
        img.imgFileSize = imgFileSize;
        img.icount = 0;
        img.onload = function () {
          img.icount++;
          console.log(img.icount);
          if (img.imgFileSize >= 512000) {
            var dataurl = WW.compress(img, 0.5);
            img.imgFileSize = Math.round(
              ((dataurl.length - head.length) * 3) / 4
            );
            console.log("---壓縮後---");
            console.log(img.imgFileSize / 1024);
            console.log(Math.abs(img.imgFileSize - PreviousSize))
            if (Math.abs(img.imgFileSize - PreviousSize) > 5000) {
              img.src = dataurl;
              PreviousSize = img.imgFileSize;
            } else {
              callback(dataurl);
            }
          } else {
            callback(img.src);
          }
        };
        img.src = input;
      },
      compress (img, compressRatio) { //canvas圖片壓縮
        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, img.width, img.height);
        var data = canvas.toDataURL("image/jpeg", compressRatio);
        canvas = null;
        ctx = null;
        return data;
      },
    }
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

.img-upload-btn {
  width: 100%;
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(208, 223, 230, 1);
}

.write-store-img-content {
  font-size: 1rem;
  word-wrap: break-word;
  white-space: pre-wrap;
  background-color: rgba(56, 95, 113, 1);
  color: rgba(245, 240, 246, 1);
}
</style>