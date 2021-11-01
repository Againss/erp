/**
* @Description:下拉框单元格
* @author Roman
* @date 2020/5/20
*/
<template>

  <el-select
    ref="dragSelect"
    v-loadmore="loadMore"
    :value="selectedValue"
    :placeholder="options.placeholder"
    :class="getClass"
    :style="options.style||defaultWidth"
    :title="title"
    :multiple="options.multiple"
    :disabled="options.disabled"
    :value-key="options.valueKey||'value'"
    :size="options.size"
    :allow-create="options.allowCreate"
    :filter-method="options.filterMethod||filterMethod"
    :remote-method="options.remoteMethod"
    :remote="getRemote"
    :loading="options.loading"
    :loading-text="options.loadingText"
    :no-match-text="options.noMatchText"
    :no-data-text="options.noDataText"
    :reserve-keyword="options.reserveKeyword"
    :default-first-option="options.defaultFirstOption"
    :popper-append-to-body="options.popperAppendToBody"
    :automatic-dropdown="options.automaticDropdown"
    :popper-class="options.popperClass"
    :clearable="options.clearable"
    :collapse-tags="options.collapseTags"
    :collapse-tags-length="options.collapseTagsLength"
    :multiple-limit="options.multipleLimit"
    :autocomplete="options.autocomplete"
    :filterable="options.filterable"
    @change="selectChange"
    @visible-change="visibleChange"
    @remove-tag="removeTag"
    @clear="clear"
    @blur="blur"
    @focus="focus"
  >
    <el-option
      v-for="item in dataSource"
      :key="item[getValue]+item[getLabel]"
      :label="getItemLabel(item)"
      :value="getItem(item)"
      :disabled="item[getDisabled]"
    >
      <template v-if="options.renderOptions">
        <span v-html="options.renderOptions(item)" />
      </template>
    </el-option>
  </el-select>

</template>

<script>
import Sortable from 'sortablejs'
import pinyinUtil from 'pinyinUtil'
export default {
  name: 'SelectItem',
  components: {

  },
  inheritAttrs: false,
  props: {
    options: {
      type: Object
    },
    title: {
      type: String
    },
    formDatas: {
      type: [Object, Array]
    },
    form: {
      type: Object
    },
    setFormDatas: {
      type: Function
    },
    value: {
      type: [String, Number, Array, Object]
    },
    change: {
      type: Function
    },
    scope: {
      type: Object
    }
  },
  data() {
    return {
      originDataSource: [],
      dataSource: [],
      selectedValue: '',
      defaultWidth: { width: '100%' }
    }
  },
  computed: {
    getClass() {
      if (this.options.filterable) {
        return this.options.className ? `commonRemoteSearch ${this.options.className}` : 'commonRemoteSearch'
      } else {
        return this.options.className
      }
    },
    getRemote() {
      return Object.prototype.toString.call(this.options.remote) !== '[object Undefined]' ? this.options.remote : true
    },
    props() {
      return this.options.props || {}
    },
    getLabel() {
      return this.props.label || 'label'
    },
    getValue() {
      return this.props.value || 'value'
    },
    getDisabled() {
      return this.props.disabled || 'disabled'
    }
  },
  watch: {
    value: {
      handler(v) {
        let newValue = v
        if (Object.prototype.toString.call(v) === '[object Object]' && !Object.keys(v).length) {
          return
        }
        if (Object.prototype.toString.call(v) === '[object Array]') {
          newValue = v.filter(v => {
            if (v) { return true }
          }
          )
        }
        this.selectedValue = newValue
      },
      deep: true,
      immediate: true
    },
    'options.dataSource': {
      handler(v) {
        const data = v || []
        this.options.filterable && data.forEach(v => { v._py = pinyinUtil.getFirstLetter(v[this.getLabel]) })
        this.originDataSource = data
        this.dataSource = data
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.setSort()
  },
  methods: {
    filterMethod(value) {
      let isEn = false
      if (/^[A-Za-z0-9]*$/.test(value)) {
        isEn = true
      }
      const reg = new RegExp(value, 'i')
      this.dataSource = this.originDataSource.filter(v => {
        if (isEn) {
          return v._py.match(reg)
        } else {
          const label = v[this.getLabel] || ''
          return label.match(reg)
        }
      })
    },
    setSort() {
      if (this.options.multiple && this.options.drag) {
        const el = this.$refs.dragSelect.$el.querySelector('.el-select__tags').firstChild
        this.sortable = Sortable.create(el, {
          ghostClass: 'sortable-ghost',
          onEnd: evt => {
            const { newIndex, oldIndex } = evt
            const v = this.selectedValue || []
            const list = [...v]
            const current = list.splice(oldIndex, 1)[0]
            list.splice(newIndex, 0, current)
            this.selectChange(list)
          }
        })
      }
    },
    getItemLabel(item) {
      if (this.options.renderLabel) {
        return this.options.renderLabel(item)
      }
      return item[this.getLabel]
    },
    getItem(item) {
      return this.options.valueType === 'object' ? item : item[this.getValue]
    },
    selectChange(value) {
      this.change(value)
    },
    loadMore(value) {
      this.options.loadMore && this.options.loadMore(value, this.scope, this.form, this.formDatas, this.setFormDatas)
    },
    visibleChange(flag) {
      this.options.visibleChange && this.options.visibleChange(flag, this.scope, this.form, this.formDatas, this.setFormDatas)
    },
    removeTag(value) {
      this.options.removeTag && this.options.removeTag(value, this.scope, this.form, this.formDatas, this.setFormDatas)
    },
    clear() {
      this.options.clear && this.options.clear(this.scope, this.form, this.formDatas, this.setFormDatas)
    },
    blur(event) {
      this.options.blur && this.options.blur(event, this.scope, this.form, this.formDatas, this.setFormDatas)
    },
    focus(event) {
      if (this.options.filterable) {
        this.dataSource = this.originDataSource
      }
      this.options.focus && this.options.focus(event, this.scope, this.form, this.formDatas, this.setFormDatas)
    }
  }
}
</script>

<style lang="scss" scoped>
    .el-select /deep/ .el-tag__close.el-icon-close{
       top:auto;
       bottom:30%;
   }
</style>
