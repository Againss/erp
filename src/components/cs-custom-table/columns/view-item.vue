/**
 * @Description:展示单元格格式
 * @author Roman
 * @date 2020/5/20
*/
<template>
  <div v-if="popoverOptions" class="popContents">
    <el-popover
      :popper-class="getPopClass"
      :placement="popoverOptions.placement||'top'"
      :title="popoverOptions.title"
      :width="popoverOptions.width"
      :trigger="popoverOptions.trigger||'hover'"
      @hide="hide"
      @show="show"
    >
      <component :is="popoverOptions.component" v-if="popoverOptions.component" :scope="scope" :form-datas="formDatas" :set-form-datas="setFormDatas" :form="form" :column="column" />
      <div v-else-if="popoverOptions.formater" :style="popoverOptions.style" v-html="popoverOptions.formater(scope)" />
      <div v-else :style="popoverOptions.style">{{ scope.row[scope.column.property] }}</div>
      <div v-if="column.formater" slot="reference" class="oneRow" :style="column.style" @click="clickHandle" v-html="column.formater(scope)||column.formater(scope)===0?column.formater(scope):'-'" />
      <div v-else slot="reference" class="oneRow" :style="column.style" @click="clickHandle">{{ scope.row[scope.column.property]|| scope.row[scope.column.property]===0? scope.row[scope.column.property]:'-' }}</div>
    </el-popover>
  </div>
  <span v-else-if="column.formater" :style="column.style" @click="clickHandle" v-html="column.formater(scope)||column.formater(scope)===0?column.formater(scope):'-'" />
  <span v-else :style="column.style" @click="clickHandle">{{ scope.row[scope.column.property]|| scope.row[scope.column.property]===0? scope.row[scope.column.property]:'-' }}</span>

</template>

<script>
export default {
  name: 'ViewItem',
  inheritAttrs: false,
  props: {
    scope: {
      type: Object
    },
    column: {
      type: Object
    },
    form: {
      type: Object
    },
    formDatas: {
      type: Object
    },
    setFormDatas: {
      type: Function
    }
  },
  data() {
    return {
    }
  },
  computed: {
    getPopClass() {
      return this.popoverOptions.popperClass ? this.popoverOptions.popperClass + ' defaultviewItemPopClass' : 'defaultviewItemPopClass'
    },
    popoverOptions() {
      return this.column.popoverOptions
    }
  },
  watch: {

  },
  mounted() {
  },
  methods: {
    hide() {
      this.popoverOptions.hide && this.popoverOptions.hide(this.scope, this.column, this.form, this.formDatas, this.setFormDatas)
    },
    show() {
      this.popoverOptions.show && this.popoverOptions.show(this.scope, this.column, this.form, this.formDatas, this.setFormDatas)
    },
    clickHandle() {
      this.column.handle && this.column.handle(this.scope, this.form, this.formDatas, this.setFormDatas)
    }
  }
}
</script>

<style lang="scss" scoped>
.oneRow {
    vertical-align: middle;
    display: inline-block;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    -ms-text-overflow: ellipsis;
    white-space: nowrap;
}
</style>

<style lang="scss">
.el-table .cell  .popContents {display: contents}
.el-popper.defaultviewItemPopClass{
    padding: 10px;
    min-width: auto;
    background: rgba(0,0,0,0.75);
    font-size: 12px;
    color: #fff;
    .popper__arrow{
        border-top-color:#000;
        opacity:0.9;
        &::after{
            border-top-color:#333;
        }
    }
}
</style>
