/**
* @Description:分页入口
* @author Roman
* @date 2020/5/20
*
* @param {Object} options 配置对象
* @param {Object} options.dataTotal 总页数
* @param {Object} options.currentPage 当前页
*/
<template>
  <el-pagination
    v-if="isShow"
    :small="options.small"
    :class="options.class||'pagination'"
    :style="options.style"
    :total="options.dataTotal"
    :current-page="options.currentPage"
    :page-size="getPageSize"
    :page-count="options.pageCount"
    :background="options.background||true"
    :pager-count="options.pagerCount"
    :page-sizes="pageSizes"
    :popper-class="options.popperClass"
    :prev-text="options.prevText"
    :next-text="options.nextText"
    :disabled="options.disabled"
    :hide-on-single-page="options.hideOnSinglePage"
    :layout="options.layout||'total, prev, pager, next,sizes, jumper'"
    @current-change="currentChange"
    @size-change="sizeChange"
    @prev-click="prevClick"
    @next-click="nextClick"
  />
</template>

<script>

export default {
  name: 'CsCustomPagination',
  inheritAttrs: false,
  props: {
    options: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
    }
  },
  computed: {
    getPageSize() {
      return this.options.pageSize || this.pageSizes[0]
    },
    pageSizes() {
      return this.options.pageSizes || [20, 50, 80, 100]
    },
    isShow() {
      return this.options.dataTotal > this.pageSizes[0]
    }
  },
  methods: {
    currentChange(val) {
      this.options.currentChange && this.options.currentChange(val)
    },
    sizeChange(val) {
      this.options.sizeChange && this.options.sizeChange(val)
    },
    prevClick(val) {
      this.options.prevClick && this.options.prevClick(val)
    },
    nextClick(val) {
      this.options.nextClick && this.options.nextClick(val)
    }
  }
}
</script>

<style lang="scss" scoped>
.pagination {
    margin-top: 20px;
  text-align: right;
   /deep/ .el-pagination__jump{
        margin-left: 0px;
    }
}
</style>
