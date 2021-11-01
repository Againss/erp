<template>
  <div class="form-title" :style="options.formStyle">
    <template v-if="options.title">
      <span class="label">{{ options.title }}</span>
      <div class="content" :style="options.contentStyle">
        <slot name="content"></slot>
      </div>
    </template>
  </div>
</template>
<script>
export default {
  props: {
    options: {
      type: Object
    }
  },
  data () {
    return {

    }
  }
}
</script>
<style lang="scss" scoped>
.form-title {
  display: flex;
  padding: 0 22px;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: center;
  height: 58px;
  border-bottom: 1px solid #eeeff0;
  .label,
  .content {
    display: inline-block;
    font-size: 16px;
  }
  .label {
    padding-left: 8px;
    flex: 1;
    text-align: left;
    color: '#151222';
  }
  .content {
    text-align: right;
    flex: 4;
    padding-left: 10px;
    color: #666666;
  }
}
</style>