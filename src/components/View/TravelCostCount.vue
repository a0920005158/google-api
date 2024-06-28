<template>
  <div class="cost-div">
    <div
      class="google-login"
      v-show="!isAuth&&!$loading&&$route.path=='/travel-cost-count'"
    >
      <div class="login-page">
        <app-navbar></app-navbar>
        <div class="wrapper wrapper-full-page">
          <div class="full-page login-page section-image">
            <!--   you can change the color of the filter page using: data-color="blue | azure | green | orange | red | purple" -->
            <div class="content">
              <div class="container">
                <div class="col-lg-4 col-md-6 ml-auto mr-auto">
                  <card type="login">
                    <h3
                      slot="header"
                      class="header text-center"
                    >登入</h3>

                    <fg-input
                      v-model="loginEmail"
                      addon-left-icon="nc-icon nc-single-02"
                      placeholder="E-mail..."
                    ></fg-input>

                    <fg-input
                      v-model="loginPassword"
                      addon-left-icon="nc-icon nc-key-25"
                      placeholder="Password"
                      type="password"
                    ></fg-input>

                    <br>
                    <!-- 
                      <p-checkbox>
                        Subscribe to newsletter
                      </p-checkbox> -->
                    <div id="message"></div>
                    <a
                      style="color:blue;"
                      @click="$router.push('/reg-acc')"
                    >創建帳號</a>
                    <p-button
                      native-type="submit"
                      slot="footer"
                      type="warning"
                      round
                      block
                      class="mb-3"
                      @click="login"
                    >登入</p-button>
                  </card>
                </div>
              </div>
            </div>
            <app-footer></app-footer>
            <div
              class="full-page-background"
              :style="{'background-image': 'url('+require('@/assets/img/background-2.jpg')+')'}"
            ></div>
          </div>
        </div>
      </div>
      <!-- <div class="google-login-icon"></div>
      <div
        @click="login()"
        class="google-login-span"
      >使用google帳號登入</div> -->
    </div>
    <div
      class="travel-expenses"
      style="background-color: #ebecf1;"
      v-show="isAuth"
    >
      <p-button
        type="success"
        size="sm"
        @click="logout()"
      >登出</p-button>
      <!-- {{ districts }} -->
      <time-line>
        <time-line-item
          v-for="(item,index) in $timeLineData"
          :key="index"
          inverted
          badge-type="danger"
          badge-icon="nc-icon nc-planet"
        >
          <div slot="header">
            <div
              @click="deleteTimeLineData(index)"
              class="closebtn"
            ></div>
            <button
              style="border-style:none;border-radius: 30px;"
              @click="updateTimeLineData(index,item.title,'title')"
            >
              <badge
                type="danger"
                @click="updateTimeLineData(index,item.title,'title')"
              >{{item.title}}</badge>
            </button>
          </div>
          <p
            slot="content"
            @click="updateTimeLineData(index,item.price,'price')"
          >
            {{item.price}} NT</p>
          <h6
            slot="footer"
            @click="updateDate(index,item.time,'time')"
          >
            <img
              style="opacity:0.3;"
              width="16"
              height="16"
              src="../../assets/img/time.png"
              alt=""
            >
            <span v-if="item.time.seconds!=undefined">{{new Date(Number(item.time.seconds)*1000).getFullYear()+'/'+(Number(new Date(Number(item.time.seconds)*1000).getMonth())+1)+'/'+new Date(Number(item.time.seconds)*1000).getDate()}}</span>
            <span v-if="item.time.seconds==undefined">{{item.time=='請輸入日期時間'?item.time:item.time.Format("yyyy-MM-dd")}}</span>
          </h6>
        </time-line-item>
      </time-line>
      <div class="totoal-cost-footer">
        <hr />
        <div class="totoal-cost-title">
          總金額
        </div>
        <div class="totoal-cost">
          NT {{totoalCost}}
        </div>
      </div>

      <p-button
        type="success"
        block
        @click="AddCost()"
      >新增一筆花費</p-button>
      <p-button
        size="sm"
        block
        @click="addDistrict()"
      >儲存</p-button>
      <p-button
        size="sm"
        block
        type="danger"
        @click="deleteClick()"
      >刪除</p-button>
    </div>

    <mt-datetime-picker
      ref="picker"
      type="date"
      year-format="{value} 年"
      month-format="{value} 月"
      date-format="{value} 日"
      v-model="pickerValue"
      @confirm="$UpdateTimeLineData({ index: pickerValueIndex, item: 'time', data: pickerValue })"
    >
      >
    </mt-datetime-picker>
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
  Date.prototype.Format = function (fmt) { //author: meizz 
    var o = {
      "M+": this.getMonth() + 1, //月份 
      "d+": this.getDate(), //日 
      "h+": this.getHours(), //小时 
      "m+": this.getMinutes(), //分 
      "s+": this.getSeconds(), //秒 
      "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
      "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
  }
  export default {
    extends: globalDataX,
    components: {
      TimeLine,
      TimeLineItem,
      Card,
      DropDown,
      Badge,
      AppFooter,
      AppNavbar
    },
    data () {
      return {
        loginEmail: '',
        loginPassword: '',
        pickerValueIndex: '',
        pickerValue: new Date(),
        districts: [],
        isAuth: false,
        inputValue: '123'
      }
    },
    computed: {
      totoalCost () {
        var cost = 0;
        this.$timeLineData.forEach(el => {
          if (el.price != 0)
            cost = cost + Number(el.price);
        })
        return String(cost);
      }
    },
    created () {
      db.auth().onAuthStateChanged(user => {
        if (user) {
          console.log('----------登入資訊--------------')
          console.log(user)
          this.$PostValue({ paramName: '$user', data: user })
          this.isAuth = true
        } else {
          this.$PostValue({ paramName: '$user', data: {} })
          this.isAuth = false
        }
      })
    },
    watch: {
      $user (val) {
        var _this = this;
        if (Object.keys(val).length != 0) {
          db.firestore().collection('TravelCostCount')
            .where("UserId", "==", val.email)
            .get()
            .then(snapshot => {
              console.log('======UserData========')
              snapshot.forEach(doc => {
                console.log(doc.data());
                console.log('ggyy')
                console.log(doc.data().TravelCostCount)
                this.$PostValue({ paramName: '$timeLineData', data: doc.data().TravelCostCount })
              })
            })
        }
      }
    },
    methods: {
      login () {
        let user = {
          email: this.loginEmail,
          pwd: this.loginPassword
        };
        console.log(user.email)
        console.log(user.pwd)
        db.auth().signInWithEmailAndPassword(user.email, user.pwd)
          .then(result => {
            console.log(result)
            this.$PostValue({ paramName: '$user', data: result.user })
            this.isAuth = true
          })
          .catch((error) => {
            document.getElementById('message').innerHTML = '請檢察帳密是否輸入正確!'
          });
      },
      updateDate (index, data, UpdateItem) {
        this.$refs.picker.open();
        this.pickerValueIndex = index;
      },
      deleteTimeLineData (index) {
        this.$DeleteCost(index)
      },
      AddCost () {
        this.$AddCost()
      },
      updateTimeLineData (index, data, UpdateItem) {
        var dd = UpdateItem == 'price' ? 'number' : 'text'
        const { value: updateData } = Swal.fire({
          title: '請輸入需更改資訊',
          input: dd,
          inputValue: data,
          showCancelButton: true,
          confirmButtonText: '確定',
          cancelButtonText: '取消',
          inputValidator: (value) => {
            if (!value) {
              return '輸入資訊不能為空!'
            }
          }
        }).then((result) => {
          if (result.value) {
            this.$UpdateTimeLineData({ index: index, item: UpdateItem, data: result.value })
          }
        })
      },
      deleteClick () {
        this.$PostValue({ paramName: '$timeLineData', data: [{ title: '請輸入項目名稱...', price: 0, time: '請輸入日期時間' }] })
        this.deleteDistrict(response => console.log(response));
      },
      deleteDistrict () {
        db.firestore().collection('TravelCostCount')
          .where("UserId", "==", this.$user.email).get().then(snapshot => {
            snapshot.forEach(doc => {
              doc.ref.delete();
              Swal.fire(
                '資料刪除成功!',
                'success'
              )
            })
          })
      },
      addDistrict () {
        var test = db.firestore().collection('TravelCostCount')
        test.where("UserId", "==", this.$user.email)
          .get().then(snapshot => {
            if (snapshot.empty == true) {
              db.firestore().collection('TravelCostCount')
                .add({ UserId: this.$user.email, TravelCostCount: this.$timeLineData })
                .then(() => {
                  Swal.fire(
                    '資料更改成功!',
                    'success'
                  )
                })
                .catch(() => {
                  console.log('資料在送出時遇到問題！')
                })
            } else {
              snapshot.forEach(doc => {
                doc.ref.update({
                  TravelCostCount: this.$timeLineData
                }).then(() => {
                  Swal.fire(
                    '資料更改成功!',
                    'success'
                  )
                });
              })
            }
          })
      },
      logout () {
        db.auth().signOut()
          .then(() => {
            this.$PostValue({ paramName: '$user', data: {} })
            this.isAuth = false
          })
          .catch(err => console.log(err))
      }
    },
    firestore () {
      return {
        districts: db.firestore().collection('Message')
      }
    }
  }
</script>

<style>
.totoal-cost-footer {
  width: 100%;
  padding-right: 5%;
  padding-left: 5%;
  position: relative;
}
.totoal-cost-title {
  height: 2rem;
  float: left;
  font-size: 1rem;
  text-align: center;
  display: flex;
  align-items: center;
  font-weight: 800;
}
.totoal-cost {
  height: 2rem;
  float: right;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  font-weight: 800;
  color: rgba(59, 154, 156, 1);
}
</style>
