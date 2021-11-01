<template>
  <div>
    {{ componentsOptions.label || '' }}
    <div
      v-show="componentsOptions.isEdit"
      class="plate-making-pointer add-btn"
      title="选择品牌"
      @click="componentsOptions.click"
    >
      <svg-icon class-name="add-btn-icon" icon-class="add" />
    </div>
  </div>
</template>

<script>

export default {
  name: 'BrandHeader',

  props: {
    componentsOptions: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>

<style scoped lang="scss">
  .add-btn {
    display: inline-block;
    margin-left: 7px;

    &-icon {
      width: 16px;
      height: 16px;
      color: #0986ff;
    }
  }
</style>
