/**
* @Description:表单入口
* @author Roman
* @date 2020/5/20
*
* @param {Boolean} formDatas 表格数据
* @param {Array} dataSource 表单配置列表
* @param {Array} options 表单配置 参考elementUI官网配置文件
* @param {Object} dataSource[0].prop 对应表单key
* @param {Object} dataSource[0].itemType 'select|input|date|checkbox-button|checkbox-group|operate|radio|switch|time|upload|view|tree'
* @param {Object} dataSource[0].label 文字描述
* @param {Object} dataSource[0].rules 验证规则
* @param {Object} dataSource[0].* 其他行配置 参考elementUI官网配置文件

*/
<template>
  <div class="custom-form" :style="getStyle">
    <el-form
      ref="dynamicValidateForm"
      :class="getClass"
      :label-width="options.labelWidth?options.labelWidth:'auto'"
      :model="dynamicValidateFormRuleForm"
      :inline="options.inline"
      :status-icon="options.statusIcon"
      :validate-on-rule-change="options.validateOnRuleChange"
      :inline-message="options.inlineMessage"
      :size="options.size"
      :label-suffix="options.labelSuffix"
      :show-message="options.showMessage"
      :hide-required-asterisk="hideRequiredAsterisk"
      :disabled="options.disabled"
      :label-position="options.labelPosition"
      @validate="validate"
      @submit.native.prevent
    >
      <template v-for="(item, index) in dataSource">
        <template v-if="item.components&&Object.keys(item.components).length&&isShow(item)&&!isItemView(item)">
          <component
            :is="component"
            v-for="(component, key) in item.components"
            :key="key+index"
            :components-options="item.componentsOptions"
            :index="index"
            :layout="options.layout"
            :form="form"
            :value="dynamicValidateFormRuleForm[item.prop]"
            :options="item"
            :errors="errors"
            :shrink-handle="shrinkHandle"
            :form-datas="dynamicValidateFormRuleForm"
            :set-form-datas="setDynamicValidateFormRuleForm"
          />
        </template>
        <template v-else-if="isShow(item)">
          <dynamicItems
            :key="index"
            :get-key="getKey"
            :is-show="isShow"
            :form-datas="dynamicValidateFormRuleForm"
            :form="form"
            :errors="errors"
            :get-span="getSpan"
            :layout="options.layout"
            :shrink-handle="shrinkHandle"
            :set-form-datas="setDynamicValidateFormRuleForm"
            :item="item"
            :style="item.rowStyle"
            :class="item.rowClassName"
            :gutter="item.gutter"
            :type="item.type"
            :justify="item.justify"
            :align="item.align"
            :tag="item.tag"
          />
        </template>
      </template>
    </el-form>

  </div>
</template>

<script>
import defaultItem from './default-item'
import dynamicItems from './dynamic-items'
import MD5 from 'crypto-js/md5'

export default {
  name: 'CsCustomForm',
  components: {
    defaultItem,
    dynamicItems
  },
  inheritAttrs: false,
  props: {
    formDatas: {
      type: Object
    },
    dataSource: {
      type: [Array, Object],
      default: () => []
    },
    options: {
      type: Object,
      default: () => { return {} }
    },
    popVisible: {
      type: Boolean
    },
    resetErrors: {
      type: Boolean
    },
    validateErrors: {
      type: Object
    }
  },
  provide() {
    return {
      injectData: this.shrink
    }
  },
  data() {
    return {
      multipleSelection: [],
      dynamicValidateFormRuleForm: {},
      form: null,
      shrink: { flag: true },
      errors: {}
    }
  },
  computed: {
    hideRequiredAsterisk() {
      if (Object.prototype.toString.call(this.options.hideRequiredAsterisk) !== '[object Undefined]') {
        return this.options.hideRequiredAsterisk
      }
      return false
    },
    getClass() {
      let className = this.options.className || ''
      if (this.options.layout) {
        className = 'layoutForm' + ' ' + className
      }
      return className
    },
    getStyle() {
      if (this.options.layout) {
        if (this.shrink.flag) {
          return { 'padding-right': '225px', 'box-sizing': 'border-box', 'height': '53px', 'overflow': 'hidden', ...this.options.style }
        } else {
          return { 'padding-right': '225px', 'box-sizing': 'border-box', ...this.options.style }
        }
      }
      return null
    }
  },
  watch: {
    popVisible: {
      handler(val, oldVal) {
        if (val === false) {
          this.errors = {}
          this.shrink.flag = true
        }
      },
      deep: true,
      immediate: true
    },
    resetErrors: {
      handler(val, oldVal) {
        if (val) {
          this.errors = {}
        }
      },
      deep: true,
      immediate: true
    },
    formDatas: {
      handler(val, oldVal) {
        val && this.setDynamicValidateFormRuleForm(val)
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.form = this.$refs['dynamicValidateForm']
    this.options.getForm && this.options.getForm(this.form)
  },
  methods: {
    isItemView(item) {
      if (Object.prototype.toString.call(item.itemType) === '[object Function]') {
        return item.itemType() === 'itemview'
      }
      return item.itemType === 'itemview'
    },
    validate(prop, flag, errmsg) {
      this.options.popError && this.getError(prop, flag, errmsg)
      this.options.validate && this.options.validate(prop, flag, errmsg)
    },
    getError(prop, flag, errmsg) {
      if (!flag) {
        this.$set(this.errors, [prop], errmsg)
      } else {
        this.$delete(this.errors, [prop])
      }
      if (Object.prototype.toString.call(this.options.getResetErrors) === '[object Function]') {
        this.$nextTick(() => {
          const errors = this.options.getResetErrors(prop, flag, errmsg, this.errors)
          if (errors) {
            if (Object.keys(errors).length) {
              this.errors = { ...this.errors, ...errors }
            } else {
              this.errors = {}
            }
          }
        })
      }
    },
    getSpan(item, arr) {
      let len = 0
      if (Object.prototype.toString.call(arr) === '[object Object]') {
        len = Object.keys(arr).length
      } else {
        len = arr.length
      }
      const span = 24 / len
      if (item.span) {
        return item.span
      }
      return span
    },
    isShow(item) {
      if (Object.prototype.toString.call(item.isShow) !== '[object Undefined]') {
        if (Object.prototype.toString.call(item.isShow) === '[object Function]') {
          return item.isShow(item)
        } else {
          return item.isShow
        }
      }
      return true
    },
    getKey(item) {
      return item.rules ? MD5(item.prop + JSON.stringify(item.rules)).toString() : item.prop
    },
    setDynamicValidateFormRuleForm(params) {
      if (Object.keys(params).length) {
        this.dynamicValidateFormRuleForm = { ...this.dynamicValidateFormRuleForm, ...params }
      } else {
        this.dynamicValidateFormRuleForm = {}
      }
      this.options.syncDataHandle && this.options.syncDataHandle(this.dynamicValidateFormRuleForm)
    },
    shrinkHandle() {
      this.$set(this.shrink, 'flag', !this.shrink.flag)
    }

  }
}
</script>

<style lang="scss">
.custom-form {
position: relative;
}
.el-form.el-form--inline.layoutForm .el-form-item{
 margin-bottom: 20px;
}
//表单弹性布局
.custom-form .el-form.el-form--inline{display: flex;flex-wrap: wrap;}
.custom-form .el-form.el-form--inline .el-form-item__content{flex: 1}
.custom-form .el-form.el-form--inline .itemview .el-form-item__content{width: 50%}
.custom-form .el-form.el-form--inline .el-form-item{ display: flex }

//.el-form.el-form--inline .el-form-item__label-wrap{margin-left: 0px!important;}
</style>
