<template>
  <div class="card card-plain">
    <div
      role="tab"
      id="headingOne"
      class="card-header"
      style="height:15px;padding: 0px;"
    >
      <a
        style="width:120px;"
        data-toggle="collapse"
        data-parent="#accordion"
        :href="`#${itemId}`"
        @click.prevent="activate"
        :aria-expanded="active"
        :aria-controls="`content-${itemId}`"
      >
        <slot name="title">
          {{title}}
        </slot>
        <i class="nc-icon nc-minimal-down"></i>
      </a>
    </div>
    <collapse-transition :duration="animationDuration">
      <div
        v-show="active"
        :id="`content-${itemId}`"
        role="tabpanel"
        :aria-labelledby="title"
        class="collapsed"
      >
        <div
          class="card-body"
          style="height:2.3rem;"
        >
          <slot></slot>
        </div>
      </div>
    </collapse-transition>
  </div>
</template>
<script>
import { CollapseTransition } from 'vue2-transitions';

export default {
  name: 'collapse-item',
  components: {
    CollapseTransition
  },
  props: {
    title: {
      type: String,
      default: '',
      description: 'Collapse item title (text)'
    },
    id: String
  },
  inject: {
    animationDuration: {
      default: 250
    },
    multipleActive: {
      default: false
    },
    addItem: {
      default: () => { }
    },
    removeItem: {
      default: () => { }
    },
    deactivateAll: {
      default: () => { }
    }
  },
  computed: {
    itemId () {
      return this.id || this.title
    }
  },
  data () {
    return {
      active: false
    }
  },
  methods: {
    handleClick () {
      this.$emit('childMethod');
    },
    activate () {
      let wasActive = this.active;
      if (!this.multipleActive) {
        this.deactivateAll();
      }
      this.active = !wasActive;
      this.$emit('collapseEmit', this.active);
    }
  },
  mounted () {
    this.addItem(this)
  },
  destroyed () {
    if (this.$el && this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el)
    }
    this.removeItem(this)
  }
}
</script>
<style>
</style>
