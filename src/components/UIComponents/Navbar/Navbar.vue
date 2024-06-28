<template>
  <nav :class="classes" class="navbar navbar-expand-lg" :style="ifBackStyle()">
    <div class="container-fluid">
      <slot></slot>
      <slot name="toggle-button">
        <button
          @click="toggleMenu"
          aria-controls="navigation-index"
          aria-expanded="true"
          aria-label="Toggle navigation"
          class="navbar-toggler"
          data-toggle="collapse"
          type="button"
        >
          <span class="navbar-toggler-bar navbar-kebab"></span>
          <span class="navbar-toggler-bar navbar-kebab"></span>
          <span class="navbar-toggler-bar navbar-kebab"></span>
        </button>
      </slot>
      <CollapseTransition>
        <div
          :class="navbarMenuClasses"
          class="collapse navbar-collapse justify-content-end show"
          id="navigation"
          v-show="showNavbar"
        >
          <ul class="navbar-nav">
            <slot name="navbar-menu"></slot>
          </ul>
        </div>
      </CollapseTransition>
    </div>
  </nav>
</template>
<script>
import { CollapseTransition } from "vue2-transitions";
import globalDataX from "@/store/globalDataX.vue";

export default {
  name: "navbar",
  extends: globalDataX,
  props: {
    showNavbar: {
      type: Boolean,
      description: "Whether navbar is visible"
    },
    navbarMenuClasses: {
      type: [String, Object],
      description: "Navbar menu css classes"
    },
    transparent: {
      type: Boolean,
      default: true,
      description: "Whether navbar is transparent"
    },
    position: {
      type: String,
      default: "absolute",
      description: "Navbar position (absolute|fixed|relative)"
    },
    type: {
      type: String,
      default: "white",
      validator(value) {
        return [
          "white",
          "default",
          "primary",
          "danger",
          "success",
          "warning",
          "info"
        ].includes(value);
      },
      description: "Navbar type (primary|info|danger|default|warning|success)"
    }
  },
  model: {
    prop: "showNavbar",
    event: "change"
  },
  components: {
    CollapseTransition
  },
  computed: {
    classes() {
      let color = `bg-${this.type}`;
      let navPosition = `navbar-${this.position}`;
      return [
        { "navbar-transparent": !this.showNavbar && this.transparent },
        { [color]: this.showNavbar || !this.transparent },
        navPosition
      ];
    }
  },
  methods: {
    ifBackStyle() {
      if (this.$ifBackstage||this.$selfrole!='CS') {
        return "position:absolute;width:100%;";
      } else {
        return "width: calc(100% - 300px);"
      }
    },
    toggleMenu() {
      this.$emit("change", !this.showNavbar);
    }
  }
};
</script>
<style scoped>
.classes{
  width:calc(100%-300px);
}
.navbar-relative {
  position: relative;
}
</style>
