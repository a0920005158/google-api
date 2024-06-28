<template>
  <div>
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
                  >註冊新帳號</h3>

                  <fg-input
                    v-model="regEmail"
                    addon-left-icon="nc-icon nc-single-02"
                    placeholder="First Name..."
                  ></fg-input>

                  <fg-input
                    v-model="regPassword"
                    addon-left-icon="nc-icon nc-key-25"
                    placeholder="Password"
                    type="password"
                  ></fg-input>

                  <br>

                  <!-- <p-checkbox>
                    Subscribe to newsletter
                  </p-checkbox> -->
                  <div id="message"></div>
                  <p-button
                    native-type="submit"
                    slot="footer"
                    type="warning"
                    round
                    block
                    class="mb-3"
                    @click="reg()"
                  >註冊</p-button>
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
  </div>
</template>

<script>
  import { db } from '@/FireBase/firebase.js';
  import firebase from 'firebase/app';
  import globalDataX from '@/store/globalDataX.vue'
  import AppFooter from './AppFooter'
  import AppNavbar from './AppNavbar'
  export default {
    extends: globalDataX,
    data () {
      return {
        regEmail: '',
        regPassword: '',
      }
    },
    components: {
      AppFooter,
      AppNavbar
    },
    methods: {
      reg () {
        let user = {
          email: this.regEmail,
          pwd: this.regPassword
        };
        console.log(user.email)
        console.log(user.pwd)
        // 透過 auth().createUserWithEmailAndPassword 建立使用者
        db.auth().createUserWithEmailAndPassword(user.email, user.pwd)
          .then(u => {
            // 取得註冊當下的時間
            let date = new Date();
            let now = date.getTime();

            document.getElementById('message').innerHTML = '帳號創建成功!';
            alert('帳號創建成功!')
            this.$router.push('/travel-cost-count')
          }).catch(err => {
            // 註冊失敗時顯示錯誤訊息
            console.log(err)
            console.log('error')
            document.getElementById('message').innerHTML = '請檢察資料格式是否正確，或此帳號已存在!';
          });
      },
    }
  }
</script>

<style>
</style>