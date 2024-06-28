<template>
  <div>
    <!-- 不可顯示上級 -->
    <div
      @click="alertQQ()"
      style="width:100%;color:white;cursor: pointer;padding:10px 13px 5px;"
      v-if="QQifShow(link.id)"
    >
      <div :class="sidebarState(onlinep,ifBackstagep,0,link.id)"></div>
      <div class="sider-word" v-html="linkNameSet"></div>
    </div>

    <component
      :class="{active: isActive}"
      :is="baseComponent"
      :to="link.path ? link.path : '/'"
      tag="li"
      :id="link.name+'tag'"
    >
      <a
        @click.prevent="collapseMenu"
        data-toggle="collapse"
        href="#"
        v-if="isMenu"
        :id="link.name"
      >
        <i :class="link.icon"></i>
        <p>
          <span>{{linkNameSet}}</span>
          <b :class="{rotated: collapsed}" class="caret"></b>
        </p>
      </a>

      <b-tooltip
        :target="link.name+'tag'"
        triggers="hover"
        placement="right"
        v-if="$selfrole!='CS'"
      >{{link.id}}</b-tooltip>
      <collapse-transition v-if="$slots.default || this.isMenu">
        <div class="collapse-menu" v-show="collapsed">
          <ul class="nav">
            <slot></slot>
          </ul>
        </div>
      </collapse-transition>
      <slot name="title" v-if="children.length === 0 && !$slots.default && link.path">
        <component
          v-if="ComponentifShow(link.id)"
          :class="{active: link.active}"
          :href="link.path"
          :id="link.name"
          :is="elementType(link, false)"
          :target="link.target"
          :to="link.path"
          @click.native.stop="onItemClick"
        >
          <template v-if="addLink">
            <span
              class="sidebar-mini-icon"
              v-if="link.role==undefined"
            >{{link.name.substring(0, 1)}}</span>
            <span :style="css" class="sidebar-normal" v-if="!ifBackstagep">{{linkNameSet}}</span>
            <span class="sidebar-normal" v-if="ifBackstagep">{{linkNameSet}}</span>
            <div
              :class="{light:!process,lightpr:process}"
              v-if="onlinep==true&&ifBackstagep==false"
            ></div>
            <div
              :class="{lightred:!process,lightredpr:process}"
              v-if="onlinep==false&&ifBackstagep==false"
            ></div>
          </template>
          <template v-else>
            <div class="meb-list-group">
              <!-- <i
              :class="link.icon"
              style="top:-0.5rem;"
              ></i>-->
              <div :class="sidebarState(onlinep,ifBackstagep,0,link.id)"></div>
              <div class="sider-word" v-html="linkNameSet"></div>
              <!-- <p-button
              :type="ClassName[colorIndex%6]"
              icon
              round
              style="position:relative;text-align:center;transform:scale(0.6);top:-5px;"
              v-if="noreadNum!=0"
            >
              <span style="text-align: center; display:block;font-size:120%;">{{noreadNum}}</span>
              </p-button>-->
            </div>
          </template>
        </component>
      </slot>
    </component>
  </div>
</template>
<script>
import { CollapseTransition } from "vue2-transitions";
import globalDataX from "@/store/globalDataX.vue";

export default {
  extends: globalDataX,
  components: {
    CollapseTransition
  },
  watch: {
    process: function(val) {}
  },
  props: {
    arrayIndex: {
      type: [Number, String]
    },
    selfAns: {
      type: [Number, String, Boolean]
    },
    id: {
      type: [Number, String]
    },
    role: {
      type: [Number, String]
    },
    state: {
      type: [Number, String]
    },
    colorIndex: {
      type: Number
    },
    wait: {
      type: [Number, String]
    },
    noreadNum: {
      type: [Number, String]
    },
    process: {
      type: Boolean
    },
    onlinep: {
      type: Boolean
    },
    ifBackstagep: {
      type: Boolean
    },
    menu: {
      type: Boolean,
      default: false,
      description: "Whether item is a menu containing multiple items"
    },
    link: {
      type: Object,
      default: () => {
        return {
          name: "",
          path: "",
          children: []
        };
      },
      description: "Link object"
    }
  },
  provide() {
    return {
      addLink: this.addChild,
      removeLink: this.removeChild
    };
  },
  inject: {
    addLink: { default: null },
    removeLink: { default: null },
    autoClose: { default: false }
  },
  data() {
    return {
      ClassName: ["primary", "info", "success", "warning", "danger", "neutral"],
      children: [],
      collapsed: true,
      css: {
        float: "left",
        "margin-right": "15px",
        "margin-top": "0px"
      }
    };
  },
  computed: {
    linkNameSet() {
      var name = this.link.name;
      // if (name.length > 8) {
      //   name = name.substr(0, 10) + "<br>" + name.substr(10);
      // }
      return name;
    },
    wordPosition() {
      var name = this.link.name;
      var length = name.replace(/[^\x00-\xff]/g, "xx").length;

      if (length > 16) {
        return "-20px";
      } else {
        return "0px";
      }
    },
    linkNamelength() {
      var name = this.link.name;
      return name.length;
    },
    baseComponent() {
      return this.isMenu || this.link.isRoute ? "li" : "router-link";
    },
    isMenu() {
      return this.children.length > 0 || this.menu === true;
    },
    isActive() {
      if (this.$route) {
        let matchingRoute = this.children.find(c =>
          this.$route.path.startsWith(c.link.path)
        );
        if (matchingRoute !== undefined) {
          return true;
        }
      }
      return false;
    }
  },
  methods: {
    ComponentifShow(id) {
      //是否顯示組件
      if (this.ifBackstagep == true) return true;

      switch (this.$selfrole) {
        case "CS":
          return true;
        case "GUEST":
          return true;
        case "CUSTOMER":
          if (id.indexOf("请联系QQ号") == -1) return true;
          break;
      }
    },
    QQifShow(id) {
      //是否顯示qq聯絡號
      if (id == undefined) return false;
      if (this.$selfrole == "CS" || this.$selfrole == "GUEST") {
        return false;
      } else if (id.indexOf("请联系QQ号") > -1) {
        return true;
      }
    },
    alertQQ() {
      alert("请联系QQ号:2609734403");
    },
    sidebarState(onlinep, ifBackstagep, selfAns, id) {
      if (
        (selfAns == true && ifBackstagep == false && onlinep == true) ||
        id == "CS"
      ) {
        return "self-ans-on";
      } else if (selfAns == true && ifBackstagep == false && onlinep == false) {
        return "self-ans-off";
      } else if (onlinep == true && ifBackstagep == false) {
        return "online";
      } else if (onlinep == false && ifBackstagep == false) {
        return "offline";
      }
    },
    addChild(item) {
      const index = this.$slots.default.indexOf(item.$vnode);
      this.children.splice(index, 0, item);
    },
    removeChild(item) {
      const tabs = this.children;
      const index = tabs.indexOf(item);
      tabs.splice(index, 1);
    },
    elementType(link, isParent = true) {
      if (link.isRoute === false) {
        return isParent ? "li" : "a";
      } else {
        return "router-link";
      }
    },
    collapseMenu() {
      this.collapsed = !this.collapsed;
    },
    onItemClick() {
      if (this.autoClose) {
        this.$sidebar.showSidebar = false;
      }
    }
  },
  mounted() {
    if (this.addLink) {
      this.addLink(this);
    }
    if (this.link.collapsed !== undefined) {
      this.collapsed = this.link.collapsed;
    }
    if (this.isActive && this.isMenu) {
      this.collapsed = false;
    }
  },
  destroyed() {
    if (this.$el && this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el);
    }
    if (this.removeLink) {
      this.removeLink(this);
    }
  }
};
</script>
<style scoped>
.online {
  height: 30px;
  width: 30px;
  margin-right: 10px;
  background-repeat: no-repeat;
  background-size: 30px 30px;
  background-image: url(../../../assets/img//online.png);
}
.offline {
  height: 30px;
  width: 30px;
  margin-right: 10px;
  background-repeat: no-repeat;
  background-size: 30px 30px;
  background-image: url(../../../assets/img/offline.png);
}
.ti-headphone-alt {
  filter: invert(50%) sepia(35%) saturate(707%) hue-rotate(76deg)
    brightness(91%) contrast(88%);
}
#close:hover {
  border: 3px solid rgba(63, 191, 165);
}
.caret.rotated {
  transform: rotate(180deg);
}
.light {
  display: flex;
  position: relative;
  margin: 0.3rem;
  padding: 0px;
  width: 15px;
  height: 15px;
  background: radial-gradient(circle at 3px 3px, #57d1c9, green);
  border-radius: 50%;
  box-shadow: 0 0 10px #57d1c9;
  -webkit-animation-timing-function: ease-in-out;
  -webkit-animation-name: lightmove;
  -webkit-animation-duration: 1000ms;
  -webkit-animation-iteration-count: infinite;
  -webkit-animation-direction: alternate;
}

@-webkit-keyframes lightmove {
  0% {
    opacity: 0.5;
    box-shadow: 0 0 10px #57d1c9;
  }

  100% {
    opacity: 1;
    box-shadow: 0 0 10px #57d1c9;
  }
}

.lightred {
  display: flex;
  position: relative;
  margin: 0.3rem;
  padding: 0px;
  width: 15px;
  height: 15px;
  background: radial-gradient(circle at 3px 3px, #f5587b, #e41749);
  border-radius: 50%;
  box-shadow: 0 0 10px #f5587b;
  -webkit-animation-timing-function: ease-in-out;
  -webkit-animation-name: lightredmove;
  -webkit-animation-duration: 1000ms;
  -webkit-animation-iteration-count: infinite;
  -webkit-animation-direction: alternate;
}

.lightpr {
  display: flex;
  position: relative;
  margin: 0.3rem;
  padding: 0px;
  width: 15px;
  height: 15px;
  background: radial-gradient(circle at 3px 3px, #fff591, #f6d04d);
  border-radius: 50%;
  box-shadow: 0 0 10px #fff591;
  -webkit-animation-timing-function: ease-in-out;
  -webkit-animation-name: lightmove;
  -webkit-animation-duration: 1000ms;
  -webkit-animation-iteration-count: infinite;
  -webkit-animation-direction: alternate;
}

.lightredpr {
  display: flex;
  position: relative;
  margin: 0.3rem;
  padding: 0px;
  width: 15px;
  height: 15px;
  background: radial-gradient(circle at 3px 3px, #f5587b, #e41749);
  border-radius: 50%;
  box-shadow: 0 0 10px #f5587b;
  -webkit-animation-timing-function: ease-in-out;
  -webkit-animation-name: lightredmove;
  -webkit-animation-duration: 1000ms;
  -webkit-animation-iteration-count: infinite;
  -webkit-animation-direction: alternate;
}
@-webkit-keyframes lightredmove {
  0% {
    opacity: 0.5;
    box-shadow: 0 0 10px #f5587b;
  }

  100% {
    opacity: 1;
    box-shadow: 0 0 10px #f5587b;
  }
}
</style>
