<template>
  <ul
    class="pagination"
    :class="paginationClass"
  >
    <li
      class="page-item prev-page"
      :class="{disabled: value === 1}"
    >
      <a
        class="page-link"
        aria-label="Previous"
        @click="prevPage"
      >
        <span aria-hidden="true"><i
            class="fa fa-angle-double-left"
            aria-hidden="true"
          ></i></span>
      </a>
    </li>
    <li
      class="page-item"
      :class="{active: value === item}"
      v-for="(item,index) in range(minPage, maxPage)"
      :key="index"
    >
      <a
        class="page-link"
        @click="changePage(item)"
      >{{item}}</a>
    </li>
    <li
      class="page-item next-page"
      :class="{disabled: value === totalPages}"
    >
      <a
        class="page-link"
        aria-label="Next"
        @click="nextPage"
      >
        <span aria-hidden="true"><i
            class="fa fa-angle-double-right"
            aria-hidden="true"
          ></i></span>
      </a>
    </li>
  </ul>
</template>
<script>
export default {
  name: 'p-pagination',
  props: {
    type: {
      type: String,
      default: 'default',
      description: 'Pagination type (primary|info|danger|default|warning|success)'
    },
    pageCount: {
      type: Number,
      default: 0,
      description: 'Pagination page count. This should be specified in combination with perPage'
    },
    perPage: {
      type: Number,
      default: 10,
      description: 'Pagination per page. Should be specified with total or pageCount'
    },
    total: {
      type: Number,
      default: 0,
      description: 'Can be specified instead of pageCount. The page count in this case will be total/perPage'
    },
    value: {
      type: Number,
      default: 1,
      description: 'Pagination value'
    }
  },
  computed: {
    paginationClass () {
      return `pagination-${this.type}`
    },
    totalPages () {
      if (this.pageCount > 0) return this.pageCount
      if (this.total > 0) {
        return Math.ceil(this.total / this.perPage)
      }
      return 1
    },
    pagesToDisplay () {
      if (this.totalPages > 0 && this.totalPages < this.defaultPagesToDisplay) {
        return this.totalPages
      }
      return this.defaultPagesToDisplay
    },
    minPage () {
      if (this.value >= this.pagesToDisplay) {
        const pagesToAdd = Math.floor(this.pagesToDisplay / 2)
        const newMaxPage = pagesToAdd + this.value
        if (newMaxPage > this.totalPages) {
          return this.totalPages - this.pagesToDisplay + 1
        }
        return this.value - pagesToAdd
      } else {
        return 1
      }
    },
    maxPage () {
      if (this.value >= this.pagesToDisplay) {
        const pagesToAdd = Math.floor(this.pagesToDisplay / 2)
        const newMaxPage = pagesToAdd + this.value
        if (newMaxPage < this.totalPages) {
          return newMaxPage
        } else {
          return this.totalPages
        }
      } else {
        return this.pagesToDisplay
      }
    }
  },
  data () {
    return {
      defaultPagesToDisplay: 5
    }
  },
  methods: {
    range (min, max) {
      let arr = []
      for (let i = min; i <= max; i++) {
        arr.push(i)
      }
      return arr
    },
    changePage (item) {
      this.$emit('input', item)
    },
    nextPage () {
      if (this.value < this.totalPages) {
        this.$emit('input', this.value + 1)
      }
    },
    prevPage () {
      if (this.value > 1) {
        this.$emit('input', this.value - 1)
      }
    }
  },
  watch: {
    perPage (value) {
      this.$emit('input', 1)
    },
    total (value) {
      this.$emit('input', 1)
    }
  }
}
</script>
