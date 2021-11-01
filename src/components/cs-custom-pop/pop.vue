/**
 * @Description:自定义弹框入口
 * @author Roman
 * @date 2020/5/20
 *
 * @param {Object} options 配置对象
 * @param {String} options.itemType 弹窗类型 drawer|dialog
* @param {Boolean} options.visible 是否显示 true|false
* @param {Boolean} options.title 标题
* @param {Funtion} options.ok 弹窗确认按钮回调事件 参数params表单数据
* @param {Funtion} options.cancel 弹窗取消按钮回调事件 参数params表单数据
* @param {Object} options.formDatas 表单数据
* @param {Object} options.formOptions 表单配置 参考elementUI官网配置文件
* @param {Array} options.content 表单内容
* @param {Object} options.content[0].prop 对应表单key
* @param {Object} options.content[0].itemType 'select|input|date|checkbox-button|checkbox-group|operate|radio|switch|time|upload'
* @param {Object} options.content[0].label 文字描述
* @param {Object} options.content[0].rules 验证规则
* @param {Object} options.content[0].* 其他行配置 参考elementUI官网配置文件
*/
<template>
  <component :is="getComponent" v-if="isInclude" ref="popComponents" :options="options" @close="close" @closed="closed" @open="open" @opened="opened">
    <slot name="header" />
    <slot name="content" />
    <slot name="footer" />
  </component>
</template>

<script>
import DialogItem from './dialog'
import DrawerItem from './drawer'
export default {
  name: 'CsCustomPop',
  components: {
    DialogItem,
    DrawerItem
  },
  inheritAttrs: false,
  props: {
    options: {
      type: Object
    }
  },
  data() {
    return {
      componentTags: ['dialog', 'drawer']
    }
  },

  computed: {
    getComponent() {
      return this.options.itemType + '-item'
    },
    isInclude() {
      return this.componentTags.includes(this.options.itemType)
    }
  },
  watch: {
  },
  mounted() {
  },
  methods: {
    open(getform, getformDatas) {
      this.options.open && this.options.open(getform, getformDatas)
    },
    opened(getform, getformDatas) {
      this.options.opened && this.options.opened(getform, getformDatas)
    },
    close(getform, getformDatas) {
      this.options.close && this.options.close(getform, getformDatas)
    },
    closed(getform, getformDatas) {
      this.options.closed && this.options.closed(getform, getformDatas)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
