<template>
  <div>
    <div class="selectionc-box" :class="[getStatusClass]" @click="componentsOptions.changeSelectionc(scope)">
      <!-- <i class="el-icon-check">1</i> -->
    </div>

  </div>
</template>

<script>
export default {
  props: {
    scope: {
      type: Object
    },
    componentsOptions: {
      type: Object
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    formDatas: {
      type: Object
    }

  },
  data() {
    return {

    }
  },
  computed: {
    getItem() {
      return this.scope.row
    },
    getStatusClass() {
      // 禁用选中状态:'disabledChecked'
      // 禁用未选中状态:'disabledNoChecked'
      // 选中可编辑状态:'checked'
      // 未选中可编辑状态:'checkedBox'
      return this.scope.row.checked || 'disabledNoChecked'
    }
  },
  mounted() {
    // console.log(this.scope.row)
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
  .selectionc-box{
    width: 14px;
    height: 14px;
    border: 1px solid #dcdfe6;
    border-radius: 2px;
    position: relative;
    cursor: pointer;
    background-color: #FFFFFF;
    &::after{
      box-sizing: content-box;
      content: "";
      border: 1px solid #fff;
      border-left: 0;
      border-top: 0;
      height: 7px;
      left: 4px;
      position: absolute;
      top: 1px;
      transform: rotate(45deg) scaleY(0);
      width: 3px;
      transition: transform .15s ease-in .05s;
      transform-origin: center;
    }
    //禁用选中状态
    &.disabledChecked{
      border-color: #c0c4cc;
      background-color: #edf2fc;
      cursor:  not-allowed;
      &::after{
        transform: rotate(45deg) scaleY(1);
        border-color: #c0c4cc;
      }
    }
    //禁用选未状态
    &.disabledNoChecked{
      border-color: #c0c4cc;
      background-color: #edf2fc;
      cursor:  not-allowed;
      &::after{
        transform: rotate(45deg) scaleY(0);
        border-color: #c0c4cc;
      }
    }
    //选中可编辑状态
    &.checked{
      background-color: #409eff;
      border-color: #409eff;
      &::after{
        transform: rotate(45deg) scaleY(1);
      }
    }
    //未选中可编辑状态
    .checkedBox{
      border-color: #c0c4cc;
      background-color: #FFFFFF;
      cursor:  not-allowed;
      &::after{
        transform: rotate(45deg) scaleY(0);
        border-color: #c0c4cc;
      }
    }

  }
</style>
