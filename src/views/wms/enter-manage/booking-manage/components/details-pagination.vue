<template>
  <div class="details-pagination clearfix">
    <div class="pagination-info">
      <span class="total">总计：</span>
      <template
        v-if="
          (params.pageType === 'details' && params.status === '2') ||
            params.pageType === 'start'
        "
      >
        <span
          class="unit"
        >实际入库件数：<em>{{ paginationInfo.numberInFact }}</em></span>
        <span
          class="weight"
        >实际入库总重量：<em>{{ paginationInfo.weightInFact }}</em>kg</span>
      </template>
      <template v-else>
        <span
          class="unit"
        >预计入库件数：<em>{{ paginationInfo.numberInPlan }}</em></span>
        <span
          class="weight"
        >预计入库总重量：<em>{{ paginationInfo.weightInPlan }}</em>kg</span>
      </template>
    </div>
    <div class="pagination-wrap">
      <!--  <cs-custom-pagination v-if="pagination" :options="pagination" /> -->
      <el-pagination
        :class="options.class || 'pagination'"
        :style="options.style"
        :total="options.dataTotal"
        :current-page="options.currentPage"
        :page-size="getPageSize"
        :page-count="options.pageCount"
        :background="options.background || true"
        :pager-count="options.pagerCount"
        :page-sizes="pageSizes"
        :popper-class="options.popperClass"
        :prev-text="options.prevText"
        :next-text="options.nextText"
        :disabled="options.disabled"
        :hide-on-single-page="options.hideOnSinglePage"
        :layout="options.layout || 'total, prev, pager, next,sizes, jumper'"
        @current-change="currentChange"
        @size-change="sizeChange"
        @prev-click="prevClick"
        @next-click="nextClick"
      />
    </div>
  </div>
</template>
<script>
export default {
  inheritAttrs: false,
  props: {
    options: {
      type: Object,
      default: null
    },
    params: {
      type: Object,
      default: null
    },
    paginationInfo: {
      type: Object
    }
  },
  computed: {
    getPageSize() {
      return this.options.pageSize || this.pageSizes[0]
    },
    pageSizes() {
      return this.options.pageSizes || [20, 50, 80, 100]
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
/* 分页信息 */
.details-pagination {
  padding: 20px 0;
  .pagination-info {
    float: left;
    width: 580px;
    span {
      display: inline-block;
      height: 30px;
      line-height: 30px;
      em {
        font-size: 16px;
        font-style: inherit;
        color: #ff9b02;
        padding-right: 4px;
      }
    }
    .total {
      padding-left: 10px;
      font-size: 16px;
      color: #666666;
    }
    .weight {
      padding-left: 15px;
    }
    .unit,
    .weight {
      font-size: 14px;
      color: #666666;
    }
  }
  .pagination-wrap {
    text-align: right;
    margin-left: 600px;
    .el-pagination {
      padding-bottom: 0;
    }
  }
}
</style>
