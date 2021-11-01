<!--
 * @Descripttion:
 * @Author: admin
 * @Date: 2021-04-26 14:06:21
 * @LastEditors: Againss
 * @LastEditTime: 2021-06-04 10:46:07
-->
<template>
  <div class="woven-tech">
    <div v-if="!componentsOptions.isCloth">
      <span>{{ '￥' + scope.row.wovenTechPrice }}</span>
    </div>
    <div v-if="componentsOptions.isCloth">
      <span class="woven-text">{{ '￥' + (scope.row.wovenTechPrice + 0.2) + ' ' + `(${scope.row.wovenTechPrice} + 0.2)` }}</span>
      <el-tooltip placement="top" effect="dark">
        <div slot="content">
          <p>底磨毛、面磨毛、底刷毛、面刷毛、单染，织工增加</p>
        </div>
        <div class="tip">?</div>
      </el-tooltip>
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
    }
  },
  data() {
    return {
    }
  },
  created() {
    console.log('212121')
    console.log(this.componentsOptions, 'componentsOptions')
  }
}
</script>

<style lang="scss">
.woven-tech{
  .woven-text{
    display: inline-block;
    position: relative;
    top: 10px;
  }
  .tip {
    font-size: 16px;
    font-weight: 900;
    position: relative;
    top: -14px;
    left: 114px;
    width: 10px;
  // position: relative;
  // right: -16px;
  // top: 126px;
  }
}
</style>
