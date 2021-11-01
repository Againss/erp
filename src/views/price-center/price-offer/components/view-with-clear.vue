<!--
 * @Date: 2021-05-24 15:00:47
 * @Author: Againss
 * @LastEditTime: 2021-05-31 17:31:56
 * @LastEditors: Againss
 * @Descripttion:
-->
<template>
  <div class="text-div">
    <el-tooltip placement="top" effect="dark">
      <div slot="content">
        <span style="color:#fff!important;" v-html="column.formater(scope)||column.formater(scope)===0?column.formater(scope):'-'" />
      </div>
      <span style="color: #0986FF; cursor: pointer" class="text" @click="clickHandle" v-html="column.formater(scope)||column.formater(scope)===0?column.formater(scope):'-'" />
    </el-tooltip>
    <span v-show="!column.formater(scope).includes('请选择')&&!column.formater(scope).includes('染色工艺为染色时才可选择')" class="text-clear el-icon-circle-close" @click="clearHandle" />
  </div>
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
  },
  watch: {

  },
  mounted() {
  },
  methods: {
    clickHandle() {
      this.column.handle && this.column.handle(this.scope, this.form, this.formDatas, this.setFormDatas)
    },
    clearHandle() {
      this.column.clearHandle && this.column.clearHandle(this.scope, this.form, this.formDatas, this.setFormDatas)
    },
    clearShow() {
      this.column.clearShow && this.column.clearShow(this.scope, this.form, this.formDatas, this.setFormDatas)
    }
  }
}
</script>

<style lang="scss" scoped>
.text-div {
  display: flex;
  justify-content: space-between;
}
.text {
  width: 80%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.text-clear {
  line-height: 23px;
}
</style>
