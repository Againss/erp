/**
 * @Description:自定义鼠标经过提示框单元格
 * @author Roman
 * @date 2020/5/20
*/
<template>
  <div v-if="editabled">
    <el-form-item :rules="rules" :prop="prop">
      <el-input :value="value" @input="inputChange" />
    </el-form-item>
  </div>
  <div v-else>
    <el-popover
      :ref="`popover-${scope.$index}`"
      :popper-class="
        customOptions && customOptions.popperClass
          ? customOptions.popperClass
          : ''
      "
      :placement="
        customOptions && customOptions.placement
          ? customOptions.placement
          : 'top'
      "
      :width="
        customOptions && customOptions.width ? customOptions.width : '200'
      "
      :trigger="
        customOptions && customOptions.trigger ? customOptions.trigger : 'hover'
      "
      :open-delay="
        customOptions && customOptions.Delay ? customOptions.Delay : 0
      "
      @show="
        customOptions && customOptions.show(scope)
          ? show(customOptions.show(scope))
          : ''
      "
    >
      <div v-if="customOptions && customOptions.content">
        <component
          :is="customOptions.content"
          :options="customOptions.contentOptions"
          :form-datas="customOptions.formDatas"
          :scope="scope"
          :custom="custom"
        />
      </div>
      <div v-else>{{ scope.row[scope.column.property] }}</div>
      <span
        v-if="customOptions && customOptions.content"
        slot="reference"
        v-popover:`popover-${scope.$index}`
        style="
          display: inline-block;
          max-width: 100%;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        "
        :style="
          customOptions && customOptions.style ? customOptions.style : null
        "
        @mouseleave="
          customOptions && customOptions.mouseleave ? mouseleave() : null
        "
        v-html=" customOptions.showContent
          ? customOptions.showContent(scope)
          : scope.row[scope.column.property]"
      />
    </el-popover>
  </div>
</template>

<script>
export default {
  name: 'PopoverColumn',
  inheritAttrs: false,
  props: {
    scope: {
      type: Object
    },
    editType: {
      type: String
    },
    column: {
      type: Object
    },
    formDatas: {
      type: Object
    },
    setFormDatas: {
      type: Function
    },
    value: {
      type: String
    },
    componentsOptions: {
      type: Object
    },
    itemProp:{
       type: String
    },
  },
  data() {
    return {
      custom: undefined
    }
  },
  computed: {
    editabled() {
      // 存在编辑页用pop
      if (this.column.edit) {
        return this.column.edit()
      }
      
      return this.scope.row.edit && this.editType === 'inline'
    },
    rules() {
      return this.column.editOptions && this.column.editOptions.rules
    },
    prop() {
      if (!this.formDatas[this.itemProp]) {
        return undefined
      }
      return [this.itemProp] + '.' + [this.scope.$index] + '.' + [this.scope.column.property]
    },
    customOptions() {
      return this.componentsOptions && this.componentsOptions.customOptions
        ? this.componentsOptions.customOptions
        : null
    }
  },
  watch: {},
  mounted() {},
  methods: {
    show(callback) {
      // 拓展
      this.custom = callback || ''
    },
    mouseleave() {
      // 鼠标移开关闭
      this.$refs[`popover-${this.scope.$index}`].doClose()
    },
    inputChange(value) {
      const obj = {
        ...this.formDatas[this.scope.$index],
        [this.scope.column.property]: value
      }
      this.setFormDatas({ [this.scope.$index]: obj })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
