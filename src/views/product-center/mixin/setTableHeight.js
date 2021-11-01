/*
 * @Author: Sanmao
 * @Date: 2020-09-28 13:44:32
 * @LastEditors: Sanmao
 * @LastEditTime: 2020-09-29 10:05:29
 * @Descripttion: 设置表格最大高度
 */

export default {
  data() {
    return {
      maxHeight: '600'
    }
  },
  mounted() {
    this.setTableHeight()
  },
  methods: {
    /**
     * @description 设置table最大高度。
     */
    setTableHeight() {
      // tableRef：table上的ref；table需要一个名为'singleTable'的ref,若ref命名冲突，则需手动在引入的.vue文件中的data定义参数tableRef；
      // 72: 等于class为'product-list-content'的padding-bottom（20） + 分页组件的高度（32）+分页组件的margin-top（20）；
      // otherHeight：table下面元素的高度； 若table下面还有其他元素，需手动在引入的.vue文件中的data定义参数otherHeight；
      this.$nextTick(() => {
        this.maxHeight =
          window.innerHeight -
          this.$refs[this.tableRef || 'singleTable'].$el.getBoundingClientRect().top -
          72 - (this.otherHeight || 0) +
          ''
      })
    }
  }
}
