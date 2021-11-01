<template>
  <div class="processManage-more-button" @click="$emit('close')">
    <div>
      {{ !isMore ? "更多" : "收起"
      }}<i class="el-icon-arrow-down" v-show="!isMore" /><i
        class="el-icon-arrow-up"
        v-show="isMore"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isMore: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {};
  },
};
</script>

<style scoped lang="scss">
.processManage-more-button {
  line-height: 52px;
  height: 52px;
  text-align: center;
  font-size: 14px;
  color: #666666;
  cursor: pointer;
  background: #fff;
  i {
    display: inline-block;
    margin-left: 16px;
  }
}
</style>