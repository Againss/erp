<template>
  <div class="dynamicAddDeleteRow">
    <!-- 动态添加删除行 -->
    <div class="search">
      <cs-custom-form ref="Form" :data-source="options.searchData" :options="options.formOtions" :form-datas="options.formDatas" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    options: {
      type: Object,
      default: () => {
        // return {}
      }
    }
  },
  data() {
    return {
    }
  },
  computed: {
    emptyRowData() {
      return this.options.emptyRowData ? this.options.emptyRowData : {}
    }
  },
  created() {
    // console.log('option', this.options, this.dataSource, this.columns)
  },
  mounted() {
  },
  methods: {
    // 添加一行
    // addALine(index) {
    //   this.tableFormDataSource.splice(index + 1, 0, this.emptyRowData)
    // },
    // 删除一行
    // deleteALine(index) {
    //   this.tableFormDataSource.splice(index, 1)
    // }
  }
}
</script>

<style lang='scss'>
.dynamicAddDeleteRow {
    .el-form-item {
        margin-bottom: 0;
    }
}
</style>
