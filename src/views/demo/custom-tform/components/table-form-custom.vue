/**
 * @Description:自定义表格表单单元格配置项
 * @author Roman
 * @date 2020/5/20
*/
<template>
  <div v-if="editabled">
    <el-form-item v-for="(item,index) in getValue" :key="index" :rules="ruleRequire" :prop="prop">
      <el-popover
        :value="getErrShow(index)"
        :popper-class="getErrPopClass"
        :placement="popoverOptions.placement||'top'"
        :title="popoverOptions.title"
        :width="popoverOptions.width"
        :trigger="popoverOptions.trigger||'manual'"
        @hide="hide"
      >
        <div :style="getErrPopStyle" :class="popoverOptions.class" v-html="getErrHtml(getErrMsg)" />
        <el-input slot="reference" :value="item" @input="inputChange(index,$event)" />
      </el-popover>
    </el-form-item>
  </div>
  <div v-else>
    <span>{{ getColumInfo }}</span>
  </div>
</template>

<script>
export default {
  name: 'TableFormCustom',
  inheritAttrs: false,
  props: {
    scope: {
      type: Object
    },
    componentsOptions: {
      type: Object
    },
    editType: {
      type: String
    },
    itemType: {
      type: String
    },
    itemProp: {
      type: String
    },
    itemProps: {
      type: Object
    },
    column: {
      type: Object
    },
    errors: {
      type: Object
    },
    formDatas: {
      type: Object
    },
    form: {
      type: Object
    },
    setFormDatas: {
      type: Function
    },
    value: {
      type: [String, Object, Array]
    }
  },
  data() {
    const validator = (rule, value, callback) => {
      let newValue = value
      if (Object.prototype.toString.call(newValue) === '[object String]') {
        newValue = newValue.split('/')
      }
      if (Object.prototype.toString.call(newValue) === '[object Object]') {
        newValue = Object.values(newValue)
      }
      const total = this.$utils.getFloat(newValue.reduce((a, b) => a * 1 + b * 1))
      newValue.find(item => {
        if (!item) {
          callback(new Error('每项都为必填'))
        }
      })
      if (total !== 100) {
        callback(new Error('计算总和100'))
      } else {
        this.form.clearValidate(rule.fullField)
        callback()
      }
    }
    const ruleRequire = [{ validator, trigger: 'blur' }]
    return {
      ruleRequire
    }
  },
  computed: {
    getColumInfo() {
      let value = this.scope.row[this.scope.column.property]
      if (Object.prototype.toString.call(value) === '[object Object]') {
        value = Object.values(value).join('/')
      } else if (Object.prototype.toString.call(value) === '[object Array]') {
        value = value.join('/')
      }
      return value
    },
    prop() {
      if (!this.formDatas[this.itemProp]) {
        return undefined
      }
      return [this.itemProp] + '.' + [this.scope.$index] + '.' + [this.scope.column.property]
    },
    getErrMsg() {
      const key = `${this.itemProp}.${this.scope.$index}.${this.scope.column.property}`
      return this.errors[key]
    },
    getErrPopClass() {
      return this.popoverOptions.popperClass ? this.popoverOptions.popperClass + ' defaultPopperErrClass' : 'defaultPopperErrClass'
    },
    getErrPopStyle() {
      if (this.popoverOptions.errorStyle) {
        return { color: '#FE4949', ...this.popoverOptions.errorStyle }
      }
      return { color: '#FE4949' }
    },
    popoverOptions() {
      return this.column.popoverOptions || {}
    },
    editabled() {
      return this.scope.row.edit && this.editType === 'inline'
    },
    rules() {
      return this.column.rules
    },
    getValue() {
      let value = this.value
      if (Object.prototype.toString.call(value) === '[object String]') {
        value = value.split('/')
      }
      return value
    }
  },
  watch: {

  },
  mounted() {
  },
  methods: {
    getErrShow(index) {
      const key = `${this.itemProp}.${this.scope.$index}.${this.scope.column.property}`
      return !!this.errors[key]
    },
    getErrHtml(errmsg) {
      if (this.popoverOptions.formater) {
        return this.popoverOptions.formater(errmsg)
      }
      return errmsg
    },
    hide() {
      this.popoverOptions.hide && this.popoverOptions.hide()
    },
    inputChange(index, $event) {
      const values = JSON.parse(JSON.stringify(this.formDatas[this.itemProp]))
      let value = this.$utils.deepClone(this.getValue)
      value[index] = $event
      if (Object.prototype.toString.call(this.value) === '[object String]') {
        value = value.join('/')
      }
      values[this.scope.$index][this.scope.column.property] = value
      this.setFormDatas({ [this.itemProp]: values })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

