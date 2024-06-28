import GlobalComponents from './globalComponents'
import GlobalDirectives from "./globalDirectives";

// css assets
import 'mint-ui/lib/style.css'
import "@/assets/css/siderBar.css";
import 'view-design/dist/styles/iview.css';
import 'hover.css'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import "@/assets/sass/paper-dashboard.scss";
import "@/assets/css/themify-icons.css";
import "@/assets/css/DashboardLayout.css";
import "@/assets/css/popularDes.css";
import "@/assets/css/animate.css";

export default {
  install (Vue) {
    Vue.use(GlobalComponents);
    Vue.use(GlobalDirectives);
  }
}
