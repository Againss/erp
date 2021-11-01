/**
* @Description:树单元格
* @author Roman
* @date 2020/5/20
*/
<template>
  <el-popover
    v-if="isPopTable"
    ref="popover"
    :popper-class="popoverOptions.popperClass"
    :placement="popoverOptions.placement||'left'"
    :title="popoverOptions.title"
    :width="popoverOptions.width||800"
    :trigger="popoverOptions.trigger||'click'"
    @hide="clearInputValue"
  >
    <div class="popclass customScrollbar">
      <table-c ref="table" :operates="operates" :options="options" :form-datas="formDatas" :value="value" :change="change" @updatePopper="updatePopper" @setCheckedLabels="checkedLabelsHandle" />
    </div>
    <component :is="searchOptions.viewContent" v-if="searchOptions.viewContent" :checked-labels="checkedLabels" />
    <el-input
      v-else
      slot="reference"
      class="selectedInput"
      :type="searchOptions.type||'input'"
      :value="checkedLabels"
      :placeholder="options.placeholder"
      :autosize="options.autosize"
      :rows="options.rows"
      :readonly="true"
    />
  </el-popover>
  <div v-else>
    <table-c ref="table" :operates="operates" :options="options" :form-datas="formDatas" :value="value" :change="change" @setCheckedLabels="checkedLabelsHandle" />
  </div>
</template>

<script>
import TableC from './components/table'
import TableOperata from './components/table-operate'
export default {
  name: 'TableSearchItem',
  components: {
    TableC
  },
  inheritAttrs: false,
  props: {
    options: {
      type: Object
    },
    formDatas: {
      type: Object
    },
    pagination: {
      type: Object
    },
    value: {
      type: [Array],
      default: () => []
    },
    change: {
      type: Function
    }
  },
  data() {
    const value = this.value
    const options = this.options.tableOptions || {}
    const id = options.rowKey || 'id'
    const selectedType = options.selectedType || 'object'
    const operate = {
      label: '操作',
      width: '70',
      components: { TableOperata },
      componentsOptions: {
        handle: (isflag, scope) => {
          let val = [...this.value]
          const value = selectedType === 'object' ? scope.row : scope.row[id]
          if (isflag) {
            val.push(value)
          } else {
            if (selectedType === 'object') {
              val = val.filter(v => v[this.rowKey] !== value[this.rowKey])
            } else {
              val = val.filter(v => v !== value)
            }
          }
          this.change(val)
        },
        value,
        id
      }
    }
    return {
      checkedLabels: '',
      operate
    }
  },
  computed: {
    isPopTable() {
      return Object.prototype.toString.call(this.tableOptions.isPopTable) !== '[object Undefined]' ? this.tableOptions.isPopTable : false
    },
    useDefaultOperate() {
      return this.tableOptions.useDefaultOperate
    },
    operates() {
      let obj = null
      if (this.useDefaultOperate) {
        if (this.tableOptions.operates) {
          obj = { ...this.operate, ...this.tableOptions.operates }
        } else {
          obj = this.operate
        }
      }
      return obj
    },
    rowKey() {
      return this.tableOptions.rowKey || 'id'
    },
    tableOptions() {
      return this.options.tableOptions ? this.options.tableOptions : {}
    },
    searchOptions() {
      return this.options.searchOptions ? this.options.searchOptions : {}
    },
    popoverOptions() {
      return this.options.popoverOptions ? this.options.popoverOptions : {}
    }
  },
  watch: {
    value: {
      handler(v) {
        let newValue = v
        if (Object.prototype.toString.call(v) === '[object Array]') {
          newValue = v.filter(v => { if (v) { return true } })
        }
        this.$set(this.operate.componentsOptions, 'value', newValue)
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
  },
  methods: {
    updatePopper() {
      this.$refs.popover.updatePopper()
    },
    checkedLabelsHandle(value) {
      this.checkedLabels = value
    },
    clearInputValue() {
      this.$refs.table.inputValue = ''
    }
  }
}
</script>

<style lang="scss">
    .popclass{
        max-height: 60vh;
        overflow-y: auto;
    }
</style>
