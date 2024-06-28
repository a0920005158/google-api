import AjaxCall from '@/components/AjaxCall/AjaxCall.vue'

const ajaxPlugin = {
  install (Vue, options) {
    let gs = new Vue({
      name: 'AJ',
      extends: AjaxCall
    })
    Vue.prototype.$AJ = gs
  }
}

export default ajaxPlugin
