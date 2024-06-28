<template>
  <div
    :data-active-color="activeColor"
    :data-color="backgroundColor"
    class="sidebar"
  >
    <div class="logo kkk">
      <a
        aria-label="sidebar mini logo"
        class="simple-text logo-mini"
        href="#"
      >
        <!-- <div class="logo-img"> -->
        <img
          alt
          src="@/assets/img/loading.png"
        />
        <!-- </div> -->
      </a>
      <p-button
        @click="changsidebar()"
        icon
        round
        style="display:flex; float:right;margin-right:1.5vh;margin:5px;margin-top:1vh;"
        type="default"
        v-if="$selfrole=='CS'"
      >
        <i class="nc-icon nc-sound-wave"></i>
      </p-button>
      <a
        class="simple-text logo-normal"
        href="#"
      >{{ title }}</a>
    </div>
    <div
      class="sidebar-wrapper"
      ref="sidebarScrollArea"
    >
      <slot></slot>
      <ul class="nav">
        <slot name="links"></slot>
      </ul>
    </div>
  </div>
</template>
<script>
import 'perfect-scrollbar/dist/css/perfect-scrollbar.css'
import globalDataX from "@/store/globalDataX.vue";
export default {
  extends: globalDataX,
  data () {
    return {
      changsidebarflag: false
    }
  },
  props: {
    title: {
      type: String,
      default: 'Vue PDP Pro',
      description: 'Sidebar title'
    },
    backgroundColor: {
      type: String,
      default: 'black',
      validator: (value) => {
        let acceptedValues = ['white', 'brown', 'black']
        return acceptedValues.indexOf(value) !== -1
      },
      description: 'Sidebar background color (white|brown|black)'
    },
    activeColor: {
      type: String,
      default: 'success',
      validator: (value) => {
        let acceptedValues = ['primary', 'info', 'success', 'warning', 'danger']
        return acceptedValues.indexOf(value) !== -1
      },
      description: 'Sidebar active text color (primary|info|success|warning|danger)'
    },
    logo: {
      type: String,
      default: '@/assets/img/loading.png',
      description: 'Sidebar Logo'
    },
    sidebarLinks: {
      type: Array,
      default: () => [],
      description: 'Sidebar links. Can be also provided as children components (sidebar-item)'
    },
    autoClose: {
      type: Boolean,
      default: true
    }
  },
  provide () {
    return {
      autoClose: this.autoClose
    }
  },
  methods: {
    async initScrollBarAsync () {
      let isWindows = navigator.platform.startsWith('Win');
      if (!isWindows) {
        return;
      }
      const PerfectScroll = await import('perfect-scrollbar')
      PerfectScroll.initialize(this.$refs.sidebarScrollArea)
    },
    changsidebar () {
      var chg = !this.$ifBackstage
      this.$PostValue({ paramName: '$ifBackstage', data: chg })
      if (this.changsidebarflag == false && this.$selfrole == 'CS') {
        this.$AJ.setcookie(this.getCookie('token'))
        this.changsidebarflag = true
      }
    },
  },
  mounted () {
    this.initScrollBarAsync()
  },
  beforeDestroy () {
    if (this.$sidebar.showSidebar) {
      this.$sidebar.showSidebar = false
    }
  },
}

</script>
<style>
@media (min-width: 992px) {
  .navbar-search-form-mobile,
  .nav-mobile-menu {
    display: none;
  }
}
</style>
