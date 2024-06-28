<template>
  <div>
    <div
      class="login-page"
      v-show="!isAuth"
    >
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
    <div
      class="news-header"
      v-show="isAuth"
    >
      <p-button
        style="position: relative;left:0;z-index: 999;"
        type="success"
        size="sm"
        @click="logout()"
      >登出</p-button>
      <div class="news-header-text">
        旅遊手記
      </div>
      <p-button
        style="position: absolute;right:5px;z-index: 999;"
        type="info"
        size="sm"
        @click="$router.push('/writestore')"
      >分享遊記</p-button>
    </div>
    <div v-if="$NoteData.length>0">
      <div
        v-for="(item,index) in $NoteData"
        :key="index"
        @click="newDetails(item,index)"
      >
        <img :src="item.TravelNotes.imgContent[0].img">
        <div class="news-title">{{item.TravelNotes.title}}</div>
        <div class="news-look">{{item.look}}次瀏覽</div>
        <div class="news-content">{{item.CreatTime}}&nbsp;發布者:{{item.UserId}}</div>
      </div>
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
  export default {
    extends: globalDataX,
    components: {
      AppFooter,
      AppNavbar
    },
    data () {
      return {
        loginEmail: '',
        loginPassword: '',
        isAuth: false,
        addlook: false
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
    mounted: function () {
      if (this.$NoteData.lenght == 0 || this.$NoteData[0].UserId == '') {
        db.firestore().collection('TravelNotes')
          .get()
          .then(snapshot => {
            var tt = []
            snapshot.forEach(doc => {
              console.log('======Data========')
              console.log(doc.id)
              var dd = doc.data();
              dd['id'] = doc.id
              tt.push(dd)
            })
            this.$PostValue({ paramName: '$NoteData', data: tt })
          })
      }
    },
    methods: {
      newDetails (data, index) {
        if (this.addlook == false) {
          db.firestore().collection('TravelNotes').doc(data.id).update({
            look: Number(data.look) + 1
          }).then(() => {
            this.addlook = true
            console.log('update data successful');
          });;
        }
        this.$router.push('/newdetails/' + index)
      },
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
      logout () {
        db.auth().signOut()
          .then(() => {
            this.$PostValue({ paramName: '$user', data: {} })
            this.isAuth = false
          })
          .catch(err => console.log(err))
      }
    }
  }
</script>

<style>
.news-title {
  color: rgba(32, 73, 105, 1);
  font-size: 1rem;
  font-weight: 600;
  padding: 5px;
}
.news-look {
  color: rgba(228, 23, 73, 1);
  font-size: 0.5rem;
  padding-left: 5px;
  padding-right: 5px;
  word-wrap: break-word;
  white-space: pre-wrap;
}
.news-content {
  color: rgba(218, 218, 218, 1);
  font-size: 0.5rem;
  padding-left: 5px;
  padding-right: 5px;
  word-wrap: break-word;
  white-space: pre-wrap;
}
.news-header {
  padding: 5px;
  background-color: rgba(32, 73, 105, 1);
  color: white;
  position: relative;
  display: flex;
}
.news-header-text {
  height: calc(100% - 10px);
  width: 100%;
  position: absolute;
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>