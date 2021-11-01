<!--
 * @Descripttion:
 * @Author: shujing
 * @Date: 2020-11-24 14:53:06
 * @LastEditors: admin
 * @LastEditTime: 2021-04-15 13:52:31
-->
<template>
  <div class="sample-analysis">
    <span style="font-size: 14px;color: #888E9E;margin-left: 14px;">{{ componentsOptions.label }}</span>
    <span style="display: inline-block;" class="lineJumpText" @click="jumpAnalysis(propValue)">{{ propValue }}</span>
  </div>
</template>
<script>
export default {
  props: {
    scope: {
      type: Object
    },
    formDatas: {
      type: Object
    },
    componentsOptions: {
      type: Object
    }
  },
  computed: {
    propValue() {
      return this.formDatas[this.componentsOptions.prop]
    }
  },
  mounted() {
    // console.log(this.scope)
  },
  methods: {
    jumpAnalysis(dataId) {
      this.componentsOptions.handle(dataId)
    }
  }
}
</script>
<style lang='scss'>
.sample-analysis{
    width: 46%;
    // border-bottom: 1px solid rgb(233, 239, 242);
    display: inline-block;
    margin: 0 2%;
    line-height: 36px;
    height: 26px;

    .lineJumpText {
      font-size: 14px;
      padding-left: 10px;
      /* cursor: pointer; */
      /* color: #1890ff, */
    }
}

</style>
