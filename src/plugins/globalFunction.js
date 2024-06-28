import DistanceComputed from '@/PublicFuction/DistanceComputed.vue'
import ApiService from '@/components/ApiService/ApiService.vue'

const GlobalFunction = {
    install (Vue, options) {
        let dis = new Vue({
            name: 'DIS',
            extends: DistanceComputed
        })
        let api = new Vue({
            name: 'API',
            extends: ApiService
        })
        Vue.prototype.$DIS = dis
        Vue.prototype.$API = api
    }
}

export default GlobalFunction
