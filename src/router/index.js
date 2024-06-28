import Vue from 'vue'
import Router from 'vue-router'
import SiderBar from '@/components/View/SiderBar'
import NearbyAttractions from '@/components/View/NearbyAttractions'
import TravelCostCount from '@/components/View/TravelCostCount'
import NADetails from '@/components/View/NADetails'
import NearbyAttractionDetails from '@/components/View/NearbyAttractionDetails.vue'
import Favor from '@/components/View/Favor.vue'
import regAcc from '@/components/View/regAcc.vue'
import News from '@/components/View/News.vue'
import WriteStore from '@/components/View/WriteStore.vue'
import NewDetails from '@/components/View/newDetails.vue'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'SiderBar',
      redirect: '/nearby-attractions',
      component: SiderBar,
      children: [
        { path: '/nearby-attractions', component: NearbyAttractions },
        { path: '/travel-cost-count', component: TravelCostCount },
        { path: '/n-a-details', component: NADetails },
        { path: '/nearby-attraction-details/:id', component: NearbyAttractionDetails },
        { path: '/favor', component: Favor },
        { path: '/reg-acc', component: regAcc },
        { path: '/news', component: News },
        { path: '/writestore', component: WriteStore },
        { path: '/newdetails/:id', component: NewDetails }
      ]
    }
  ]
})
