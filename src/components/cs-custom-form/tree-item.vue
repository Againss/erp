/**
 * @Description:树单元格
 * @author Roman
 * @date 2020/5/20
*/
<template>
  <el-popover
    v-if="isPopTree"
    ref="popover"
    :popper-class="popoverOptions.popperClass"
    :placement="popoverOptions.placement||'left'"
    :title="popoverOptions.title"
    :width="popoverOptions.width||800"
    :trigger="popoverOptions.trigger||'click'"
    @hide="clearInputValue"
  >
    <div class="popclass customScrollbar">
      <tree ref="tree" :options="options" :form-datas="formDatas" :value="value" :change="change" @updatePopper="updatePopper" @setCheckedLabels="checkedLabelsHandle" />
    </div>
    <component :is="options.viewContent" v-if="options.viewContent" slot="reference" :options="options" :form-datas="formDatas" :value="value" :checked-labels="checkedLabels" />
    <el-input
      v-else
      slot="reference"
      class="selectedInput"
      :type="options.type||'input'"
      :value="checkedLabels"
      :placeholder="options.placeholder"
      :autosize="options.autosize"
      :rows="options.rows"
      :readonly="true"
    />
  </el-popover>
  <div v-else>
    <tree ref="tree" :options="options" :form-datas="formDatas" :value="value" :change="change" @setCheckedLabels="checkedLabelsHandle" />
  </div>
</template>

<script>
import tree from './components/tree'
export default {
  name: 'TreeItem',
  components: {
    tree
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
      type: [Array],
      default: () => []
    },
    change: {
      type: Function
    }
  },
  data() {
    return {
      checkedLabels: ''
    }
  },
  computed: {
    isPopTree() {
      return Object.prototype.toString.call(this.treeOptions.isPopTree) !== '[object Undefined]' ? this.treeOptions.isPopTree : true
    },
    treeOptions() {
      return this.options.treeOptions ? this.options.treeOptions : {}
    },
    popoverOptions() {
      return this.options.popoverOptions ? this.options.popoverOptions : {}
    }
  },
  methods: {
    updatePopper() {
      this.$refs.popover.updatePopper()
    },
    checkedLabelsHandle(value) {
      this.checkedLabels = value
    },
    clearInputValue() {
      this.$refs.tree.inputValue = ''
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
