<template>
  <div class="SummationRow">
    <div class="total">
      <span class="sum-text">总计：</span>
      <template v-for="(item, index) in config">
        <span class="content" :style="item.style" :key="index">
          <span class="sub" v-if="item.subTitle" :style="item.subStyle">{{
            item.subTitle
          }}</span>
          <span class="text" v-if="item.title" :style="item.textStyle">{{
            item.title
          }}</span>
          <span class="tip" v-if="item.num" :style="item.tipStyle">{{
            item.num
          }}</span>
          <span class="text" v-if="item.unit" :style="item.textStyle">{{
            item.unit
          }}</span>
        </span>
        <br style="clear: both" v-if="item.br" :key="index + '_br'" />
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: "SummationRow",
  props: {
    config: {
      default: {},
    },
  },
  data() {
    return {};
  },
};
</script>
<style lang="scss" scoped>
.SummationRow {
  display: flex;
  .total {
    color: #666666;
    margin: 24px 0 12px;
    .sum-text {
      font-size: 16px;
      font-weight: bold;
    }
    .sub {
      display: inline-block;
      margin-right: -8px;
      font-weight: bold;
      font-size: 14px;
    }
    .text {
      font-size: 14px;
    }
    .tip {
      color: #ff9b02;
      font-size: 16px;
    }
    .content {
      display: inline-block;
      margin-right: 20px;
    }
  }
}
</style>