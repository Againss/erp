<template>
  <div class="addLine" @click="componentsOptions.addLineClick(scope, form, formDatas, setFormDatas)">
    <i class="el-icon-circle-plus-outline" />
    <span class="text">新增</span>
  </div>
</template>

<script>
export default {
  props: {
    scope: {
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
    },
    componentsOptions: {
      type: Object
    }
  }

}
</script>

<style lang="scss">
  .addLine {
    width: 100%;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: #0986FF;
    cursor: pointer;
    border: 1px solid #EEEFF0;
    border-top: 0px;
    margin-top: -22px;

    .text {
      margin-left: 7px;
    }
  }
</style>
