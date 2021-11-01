/**
 * @Description: table总计栏
 * @author 马贝儿
 * @date 2021/4/25
*/
<template>
  <div class="TableSummation" :class="[customClass]">
    <div class="total">
      <span v-if="!sumtextIsHidden" class="sum-text">总计：</span>
      <template v-for="(item, index) in msg">
        <span :key="index" class="content" :style="item.style">
          <span
            v-if="item.subTitle"
            class="sub"
            :style="item.subStyle"
            v-html="item.subTitle"
          />
          <span
            v-if="item.title"
            class="text"
            :style="item.textStyle"
            v-html="item.title"
          />
          <span
            v-if="item.num || item.num === 0"
            class="tip"
            :style="item.tipStyle"
          >{{ item.formater ? item.formater(item.num) : item.num }}</span>
          <span v-if="item.unit" class="text" :style="item.textStyle">{{
            item.unit
          }}</span>
        </span>
        <br v-if="item.br" :key="index + '_br'" style="clear: both">
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TableSummation',
  props: {
    customClass: {
      type: String
    },
    sumtextIsHidden: {
      type: Boolean
    },
    config: {
      type: Object
    },
    componentsOptions: {
      type: Object
    },
    options: {
      type: Object
    }
  },
  data() {
    return {
      msg: null
    }
  },
  created() {
    if (this.componentsOptions) {
      this.msg = this.componentsOptions || {}
    } else {
      if (this.options) {
        this.msg = this.options.config || {}
      } else {
        this.msg = this.config || {}
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.TableSummation {
  display: flex;
  .total {
    color: #666666;
    margin: 22px 0 12px;
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
