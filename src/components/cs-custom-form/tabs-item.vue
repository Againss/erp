/**
 * @Description:标签页单元格
 * @author Roman
 * @date 2020/5/20
*/
<template>

  <el-tabs
    :value="value"
    :class="options.className"
    :type="options.type"
    :style="options.style||defaultWidht"
    :closable="options.closable"
    :addable="options.addable"
    :editable="options.editable"
    :tab-position="options.tabPosition"
    :stretch="options.stretch"
    :before-leave="options.beforeLeave"
    @tab-click="tabClick"
    @tab-remove="tabRemove"
    @tab-add="tabAdd"
    @edit="edit"
  >
    <el-tab-pane v-for="item in options.dataSource" :key="item.value" :label="item.label" :name="item.value">{{ item.content }}</el-tab-pane>
  </el-tabs>

</template>

<script>

export default {
  name: 'TabsItem',
  components: {

  },
  inheritAttrs: false,
  props: {
    options: {
      type: Object
    },
    formDatas: {
      type: Object
    },
    value: {
      type: [String]
    },
    change: {
      type: Function
    }
  },
  data() {
    return {
      defaultWidht: { width: '100%' }
    }
  },
  mounted() {
  },
  methods: {
    tabClick(tab, event) {
      // console.log(tab, event)
      this.change(tab.name)
    },
    tabRemove(name) {
      this.options.tabRemove && this.options.tabRemove(name)
    },
    tabAdd() {
      this.options.tabAdd && this.options.tabAdd()
    },
    edit(targetName, action) {
      this.options.edit && this.options.edit(targetName, action)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
