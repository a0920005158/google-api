<template>
  <div :id="wizardId" class="wizard-container">
    <div :class="[wizardClasses, {'card-transparent': plain}]" class="card card-wizard active">
      <form @submit.prevent>
        <!--        You can switch " data-color="primary" "  with one of the next bright colors: "green", "orange", "red", "blue"       -->
        <div class="card-header text-center">
          <slot name="header" v-if="showHeader && !$slots.header">
            <h3 class="card-title">{{title}}</h3>
            <h3 class="description">{{subTitle}}</h3>
          </slot>

          <div class="wizard-navigation">
            <ul class="nav nav-pills" role="tablist">
              <li
                :aria-controls="tab.tabId"
                :aria-disabled="tab.active"
                :aria-selected="tab.active"
                :id="`step-${tab.tabId}`"
                :key="tab.title"
                :ref="`tab-${index}`"
                :style="linkWidth"
                :tabindex="tab.checked ? 0 : ''"
                class="nav-item wizard-tab-link"
                role="tab"
                v-for="(tab, index) in tabs"
              >
                <a
                  :class="[{'disabled-wizard-link': !tab.checked}, {active: tab.active}, {checked: tab.checked}]"
                  @click="navigateToTab(index)"
                  class="nav-link"
                  data-toggle="tab"
                >
                  <tab-item-content :tab="tab"></tab-item-content>
                </a>
              </li>
            </ul>
            <div
              :class="{'error-link': activeTab.hasError}"
              :style="movingTabStyles"
              class="moving-tab"
              style="transition: transform 0.5s cubic-bezier(0.29, 1.42, 0.79, 1); width: 100%;"
              v-if="activeTab"
            >
              <tab-item-content :moving-tab="true" :tab="activeTab"></tab-item-content>
            </div>
          </div>
        </div>

        <div class="card-body">
          <div class="tab-content">
            <slot :activeIndex="activeTabIndex" :activeTab="activeTab"></slot>
          </div>
        </div>

        <div class="card-footer">
          <slot :next-tab="nextTab" :prev-tab="prevTab" name="footer">
            <div class="pull-right">
              <p-button
                @click.native="nextTab"
                class="btn-next"
                v-if="activeTabIndex < tabCount -1"
                wide
              >{{nextButtonText}}</p-button>
              <p-button @click.native="nextTab" v-else wide>{{finishButtonText}}</p-button>
            </div>

            <div class="pull-left">
              <p-button
                @click.native="prevTab"
                class="btn-previous"
                v-if="activeTabIndex > 0"
                wide
              >{{prevButtonText}}</p-button>
            </div>
            <div class="clearfix"></div>
          </slot>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
import { throttle } from '@/util/throttle';

function randomString (maxChars = 7) {
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let text = "";

  for (let i = 0; i < maxChars; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}
export default {
  name: 'simple-wizard',
  props: {
    wizardClasses: {
      type: [String, Object, Array],
      description: 'Wizard card classes'
    },
    plain: {
      type: Boolean,
      default: false,
      description: 'Whether wizard should be on plain background'
    },
    showHeader: {
      type: Boolean,
      default: true,
      description: 'Whether Wizard header should be displayed'
    },
    startIndex: {
      type: Number,
      default: 0,
      description: 'Wizard start index (activated tab to start with)'
    },
    title: {
      type: String,
      default: 'Title',
      description: 'Wizard title'
    },
    subTitle: {
      type: String,
      default: 'Subtitle',
      description: 'Wizard sub title'
    },
    prevButtonText: {
      type: String,
      default: 'Previous',
      description: 'Previous button text'
    },
    nextButtonText: {
      type: String,
      default: 'Next',
      description: 'Next button text'
    },
    finishButtonText: {
      type: String,
      default: 'Finish',
      description: 'Finish button text'
    },
    vertical: {
      type: Boolean,
      description: 'Whether wizard tabs should be vertical'
    }
  },
  components: {
    TabItemContent: {
      props: ['tab', 'movingTab'],
      render (h) {
        return h('span', [this.tab.$slots.label || this.tab.label])
      }
    }
  },
  provide () {
    return {
      addTab: this.addTab,
      removeTab: this.removeTab
    }
  },
  data () {
    return {
      tabs: [],
      activeTabIndex: 0,
      tabLinkWidth: 0,
      tabLinkHeight: 50,
      wizardId: randomString()
    }
  },
  computed: {
    tabCount () {
      return this.tabs.length;
    },
    linkWidth () {
      let width = 100;
      if (this.tabCount > 0) {
        width = 100 / this.tabCount
      }
      if (this.vertical) {
        width = 100;
      }
      return { width: `${width}%` };
    },
    activeTab () {
      return this.tabs[this.activeTabIndex]
    },
    movingTabStyles () {
      let translateXValue = this.tabLinkWidth * this.activeTabIndex;
      let translateYValue = 0;
      if (this.vertical) {
        translateYValue = this.tabLinkHeight * this.activeTabIndex
        translateXValue = 0;
      }
      let styles = {
        transform: `translate3d(${translateXValue}px, ${translateYValue}px, 0px)`
      };
      if (this.tabLinkWidth !== 0) {
        styles.width = `${this.tabLinkWidth}px`;
      }
      return styles;
    }
  },
  methods: {
    addTab (tab) {
      const index = this.$slots.default.indexOf(tab.$vnode);
      let tabTitle = tab.title || '';
      tab.tabId = `${tabTitle.replace(/ /g, '')}${index}`
      if (!this.activeTab && index === 0) {
        tab.active = true;
        tab.checked = true
      }
      if (this.activeTab === tab.name) {
        tab.active = true;
        tab.checked = true;
      }
      this.onResize();
      this.tabs.splice(index, 0, tab)
    },
    removeTab (tab) {
      const tabs = this.tabs;
      const index = tabs.indexOf(tab);
      if (index > -1) {
        tabs.splice(index, 1)
      }
    },
    validate (tab) {
      let tabToValidate = tab || this.activeTab
      let beforeChange = tabToValidate.beforeChange
      if (beforeChange) {
        return Promise.resolve(beforeChange()).then(res => {
          this.activeTab.hasError = res ? false : true
          return res;
        }).catch(() => {
          this.activeTab.hasError = true
        })
      } else {
        return Promise.resolve(true);
      }
    },
    async nextTab () {
      let isValid = await this.validate();
      if (isValid && this.activeTabIndex === this.tabCount - 1) {
        this.$emit('complete');
      }
      if (isValid && this.activeTabIndex < this.tabCount - 1) {
        this.activeTabIndex++
      }
      return isValid
    },
    prevTab () {
      this.activeTabIndex--;
    },
    async navigateToTab (index) {
      if (this.tabs[index].checked) {
        // recursively validate each tab
        if (index > this.activeTabIndex) {
          let valid = await this.nextTab();
          if (valid) {
            this.navigateToTab(index)
          }
        } else {
          this.activeTabIndex = index
        }
      }
    },
    onResize () {
      let tabLinks = document.querySelectorAll(`#${this.wizardId} .wizard-tab-link`);
      if (tabLinks.length > 0 && this.tabCount > 0) {
        let { clientWidth, clientHeight } = tabLinks[0];
        this.tabLinkWidth = clientWidth;
        this.tabLinkHeight = clientHeight;
      }
    }
  },
  mounted () {
    this.activeTabIndex = this.startIndex;
    this.$nextTick(() => {
      this.tabs[this.activeTabIndex].active = true;
      this.tabs[this.activeTabIndex].checked = true;
      this.onResize();
    });
    window.addEventListener('resize', () => {
      throttle(this.onResize, 40)
    }, false);
  },
  watch: {
    activeTabIndex (newValue, oldValue) {
      if (newValue !== oldValue) {
        let oldTab = this.tabs[oldValue];
        let newTab = this.tabs[newValue];
        oldTab.active = false;
        newTab.active = true;

        if (!newTab.checked) {
          newTab.checked = true
        }
        this.$emit('tab-change', oldTab, newTab);
        this.$emit('update:startIndex', newValue);
      }
    }
  }
}
</script>
<style lang="scss">
/* Tab content animation */
.tab-content {
  display: flex; // to avoid horizontal scroll when animating
  .tab-pane {
    display: block;
    animation: fadeIn 0.5s;
    width: 100%;
  }
}

/**
    Extra niceties. Display error tabs and disable navigation unvisited tabs
   */
.wizard-navigation .nav-link {
  &.active,
  &.checked {
    cursor: pointer;
  }
}

.disabled-wizard-link {
  cursor: not-allowed;
}
</style>
