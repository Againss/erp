/**
 * @Description: 自定义渲染单元格
 * @author Roman
 * @date 2020/12/10
*/
<template>
  <div :style="options.style" style="position: relative;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;">
    <template v-if="options.itemComponent">
      <component :is="options.itemComponent" :title="title" :options="options" :scope="scope" :value="value" :form="form" :set-form-datas="setFormDatas" :form-datas="formDatas" />
    </template>
    <template v-else-if="options.renderContent">
      <el-popover
        v-if="popoverOptions"
        :popper-class="getPopClass"
        :placement="popoverOptions.placement||'top'"
        :title="popoverOptions.title"
        :width="popoverOptions.width"
        :trigger="popoverOptions.trigger||'hover'"
        :visible-arrow="popoverOptions.visibleArrow"
        @hide="hide"
        @show="show"
      >
        <component :is="popoverOptions.component" v-if="popoverOptions.component" :scope="scope" :form-datas="formDatas" :set-form-datas="setFormDatas" :form="form" :options="options" />
        <div v-else-if="popoverOptions.formater" :style="popoverOptions.style" v-html="popoverOptions.formater(scope)" />
        <div v-else :style="popoverOptions.style" v-html="options.renderContent(value,options,form,formDatas,setFormDatas,scope)" />
        <span v-if="options.renderContent" slot="reference" :title="title" @click="handle" v-html="options.renderContent(value,options,form,formDatas,setFormDatas,scope)" />
      </el-popover>
      <span v-else slot="reference" :title="title" @click="handle" v-html="options.renderContent(value,options,form,formDatas,setFormDatas,scope)" />
    </template>
    <template v-else>
      <span :title="title" @click="handle">{{ value }}</span>
    </template>
  </div>
</template>

<script>
export default {
  name: 'InputItem',
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
    scope: {
      type: Object
    },
    value: {
      type: [String, Number, Array, Object]
    },
    change: {
      type: Function
    }
  },
  data() {
    return {
      defaultWidth: { width: '100%' }
    }
  },
  computed: {
    popoverOptions() {
      return this.options.popoverOptions
    },
    getPopClass() {
      return this.popoverOptions.popperClass ? this.popoverOptions.popperClass + ' defaultviewItemPopClass' : 'defaultviewItemPopClass'
    }
  },
  mounted() {

  },
  methods: {
    handle() {
      this.options.handle && this.options.handle(this.value, this.options, this.form, this.formDatas, this.setFormDatas, this.scope)
    },
    hide() {
      this.popoverOptions.hide && this.popoverOptions.hide(this.scope, this.column, this.form, this.formDatas, this.setFormDatas)
    },
    show() {
      this.popoverOptions.show && this.popoverOptions.show(this.scope, this.column, this.form, this.formDatas, this.setFormDatas)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
