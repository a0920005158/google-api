// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import PositionLatLng from '@/PublicFuction/PositionLatLng'
import PaperDashboard from './plugins/paperDashboard'
import globalFunction from '@/plugins/globalFunction'
import AjaxPlugin from '@/plugins/AjaxPlugin'
import store from './store'
import VueFriendlyIframe from 'vue-friendly-iframe';
import BootstrapVue from 'bootstrap-vue'
import { firestorePlugin } from 'vuefire'

Vue.use(firestorePlugin)
Vue.use(VueFriendlyIframe);
Vue.use(AjaxPlugin)
Vue.use(PaperDashboard)
Vue.use(globalFunction)
Vue.use(BootstrapVue)
// import * as VueGoogleMaps from 'vue2-google-maps'

Vue.use(PositionLatLng)
// Vue.use(VueGoogleMaps, {
//   load: {
//     key: 'AIzaSyAYI8jrdVtnx8SkNtCs-XoAdtm-P4ucloc',
//     libraries: 'places' // This is required if you use the Autocomplete plugin
//   },
//   installComponents: true
// })
Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})


