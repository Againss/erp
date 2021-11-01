/**
 * @Description:默认单元格入口
 * @author Roman
 * @date 2020/5/20
*/
<template>
  <div v-if="editabled">
    <el-form-item
      v-if="isInclude"
      :rules="options.rules"
      :prop="prop"
      :style="options.itemStyle"
      :label="options.label"
      :label-width="options.labelWidth"
      :error="options.error"
      :show-message="options.showMessage"
      :inline-message="options.inlineMessage"
      :size="options.size"
    >
      <el-popover
        v-model="err.isShow"
        :popper-class="getErrPopClass"
        :placement="popoverOptions.placement||'top'"
        :title="popoverOptions.title"
        :width="popoverOptions.width"
        :trigger="popoverOptions.trigger||'manual'"
        @hide="hide"
      >
        <div :style="getErrPopStyle" :class="popoverOptions.errorClass" v-html="getErrHtml(err.errorMsg)" />
        <div slot="reference">
          <component :is="getComponent" v-bind="$attrs" :change="change" :options="options" />
        </div>
      </el-popover>

    </el-form-item>
  </div>
  <view-item v-else v-bind="$attrs" />
</template>

<script>

import viewItem from './view-item'
import inputItem from '@/components/cs-custom-form/input-item'
import selectItem from '@/components/cs-custom-form/select-item'
import dateItem from '@/components/cs-custom-form/date-item'
export default {
  name: 'DefaultColumn',
  components: {
    viewItem,
    inputItem,
    selectItem,
    dateItem
  },
  inheritAttrs: false,
  props: {
    itemType: {
      type: String
    },
    errors: {
      type: Object
    },
    itemProp: {
      type: String
    },
    itemProps: {
      type: Object
    }
  },
  data() {
    return {
      componentTags: ['input', 'select', 'date'],
      err: {
        isShow: false,
        errorMsg: ''
      }
    }
  },
  computed: {
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
      return this.options.popoverOptions || {}
    },
    getComponent() {
      return this.options.itemType + '-item'
    },
    props() {
      return this.itemProps || {}
    },
    editabled() {
      const edit = this.props.edit || 'edit'
      const columnEditOptions = this.$attrs.scope.row[this.$attrs.column.prop + 'EditOptions'] || this.$attrs.column.editOptions
      const columnEdit = Object.prototype.toString.call(this.$attrs.scope.row[this.$attrs.column.prop + 'Edit']) !== '[object Undefined]' ? this.$attrs.scope.row[this.$attrs.column.prop + 'Edit'] : true
      return this.$attrs.scope.row[edit] && columnEditOptions && this.$attrs['edit-type'] === 'inline' && columnEdit
    },
    prop() {
      if (!this.$attrs['form-datas'][this.itemProp]) {
        return undefined
      }
      return [this.itemProp] + '.' + [this.$attrs.scope.$index] + '.' + [this.$attrs.scope.column.property]
    },
    isInclude() {
      return this.componentTags.includes(this.options.itemType)
    },
    options() {
      const columnEditOptions = this.$attrs.scope.row[this.$attrs.column.prop + 'EditOptions']
      if (columnEditOptions) {
        return columnEditOptions
      }
      return this.$attrs.column.editOptions || {}
    }
  },
  watch: {
    errors: {
      handler(val, oldVal) {
        if (val && val[this.prop]) {
          this.err.isShow = true
          this.err.errorMsg = val[this.prop]
        } else {
          this.err.isShow = false
          this.err.errorMsg = ''
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
  },
  methods: {
    getErrHtml(errmsg) {
      if (this.popoverOptions.formater) {
        return this.popoverOptions.formater(errmsg)
      }
      return errmsg
    },
    hide() {
      this.popoverOptions.hide && this.popoverOptions.hide()
    },
    change(value) {
      if (this.itemType === 'table-form') {
        const values = this.$utils.deepClone(this.$attrs['form-datas'][this.itemProp])
        values[this.$attrs.scope.$index][this.$attrs.scope.column.property] = value
        this.$attrs['set-form-datas']({ [this.itemProp]: values })
      } else {
        const obj = { ...this.$attrs['form-datas'][this.$attrs.scope.$index], [this.$attrs.scope.column.property]: value }
        this.$attrs['set-form-datas']({ [this.$attrs.scope.$index]: obj })
      }
      this.$nextTick(() => {
        this.options.change && this.options.change(value, this.$attrs['form'], this.$attrs['form-datas'], this.$attrs['set-form-datas'], this.$attrs.scope)
      })
    }
  }
}
</script>

<style lang="scss">
    .el-popper.defaultPopperErrClass{
        padding: 10px;
        min-width: auto;
        border:1px solid rgb(255,187,181);
        .popper__arrow{
            border-top-color:rgb(255,187,181);
        }
}
</style>
