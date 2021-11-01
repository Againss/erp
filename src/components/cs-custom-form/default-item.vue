/**
 * @Description:默认单元格入口
 * @author Roman
 * @date 2020/5/20
*/
<template>
  <component :is="getComponent" v-if="itemType==='view'" v-bind="$attrs" :change="change" :options="options" />
  <component :is="getComponent" v-else-if="itemType==='table-form'" v-bind="$attrs" :change="change" :item-type="itemType" :item-props="options.props" :item-prop="options.prop" :options="options" />
  <el-form-item
    v-else-if="isInclude"
    :style="itemStyle"
    :class="itemClass"
    :rules="options.rules"
    :prop="options.prop"
    :label="options.label"
    :label-width="options.labelWidth"
    :required="options.required"
    :error="options.error"
    :show-message="options.showMessage"
    :inline-message="options.inlineMessage"
    :size="options.size"
  >
    <component :is="getComponent" :title="hasTitle" v-bind="$attrs" :change="change" :options="options" :layout="layout" />
  </el-form-item>
</template>

<script>

import inputItem from './input-item'
import dateItem from './date-item'
import selectItem from './select-item'
import cascaderItem from './cascader-item'
import radioGroupItem from './radio-group-item'
import operateItem from './operate-item'
import switchItem from './switch-item'
import inputNumberItem from './input-number-item'
import checkboxGroupItem from './checkbox-group-item'
import checkboxButtonGroupItem from './checkbox-button-group-item'
import radioButtonGroupItem from './radio-button-group-item'
import timeItem from './time-item'
import uploadItem from './upload-item'
import treeItem from './tree-item'
import viewItem from './view-item'
import itemviewItem from './itemview-item'
import iconItem from './icon-item'
import tabsItem from './tabs-item'
import colorPickerItem from './color-picker-item'
import tableItem from './table-item'
import tableSearchItem from './table-search-item'
import tableFormItem from '../cs-custom-table/table-form'

export default {
  name: 'DefaultItem',
  components: {
    inputItem,
    dateItem,
    selectItem,
    cascaderItem,
    radioGroupItem,
    operateItem,
    switchItem,
    inputNumberItem,
    checkboxGroupItem,
    checkboxButtonGroupItem,
    radioButtonGroupItem,
    timeItem,
    uploadItem,
    treeItem,
    viewItem,
    colorPickerItem,
    itemviewItem,
    iconItem,
    tabsItem,
    tableItem,
    tableSearchItem,
    tableFormItem
  },
  inheritAttrs: false,
  props: {
    options: {
      type: Object
    },
    layout: {
      type: Boolean
    }
  },
  data() {
    return {
      componentTags: [
        'input',
        'select',
        'date',
        'radio-group',
        'checkbox-group',
        'time',
        'operate',
        'switch',
        'input-number',
        'radio-button-group',
        'upload',
        'tree',
        'icon',
        'tabs',
        'table',
        'itemview',
        'cascader',
        'table-search',
        'table-form',
        'color-picker',
        'checkbox-button-group']
    }
  },
  computed: {
    itemType() {
      const itemType = this.options.itemType
      if (Object.prototype.toString.call(itemType) === '[object Function]') {
        return itemType()
      }
      return itemType
    },
    itemClass() {
      if (this.itemType === 'itemview') {
        return this.options.itemClassName ? `itemview ${this.options.itemClassName}` : `itemview`
      }
      return this.options.itemClassName
    },
    getComponent() {
      return this.itemType + '-item'
    },
    isInclude() {
      return this.componentTags.includes(this.itemType)
    },
    hasTitle() {
      if (Object.prototype.toString.call(this.options.title) === '[object Function]') {
        return this.options.title(this.$attrs['value'])
      } else if (Object.prototype.toString.call(this.options.title) === '[object Boolean]' && this.options.title) {
        return this.$attrs['value']
      }
      return ''
    },
    itemStyle() {
      if (this.layout && this.itemType === 'operate') {
        return { position: 'absolute', right: '0px', top: '0px', 'box-sizing': 'border-box', 'margin-right': '0px', 'padding-right': '0px', ...this.options.itemStyle }
      } else if (this.layout) {
        return { 'box-sizing': 'border-box', 'margin-right': '0px', 'padding-right': '30px', ...this.options.itemStyle }
      }
      return this.options.itemStyle
    }
  },
  watch: {

  },
  mounted() {

  },
  methods: {
    change(value) {
      this.$attrs['set-form-datas']({ [this.$attrs.prop]: value })
      this.$nextTick(() => {
        this.options.change && this.options.change(value, this.$attrs['form'], this.$attrs['form-datas'], this.$attrs['set-form-datas'])
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
