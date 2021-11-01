<template>
  <div>
    {{ componentsOptions.label || '' }}
    <span style="color: #BBC2D0; font-size: 16px">
      <svg-icon v-if="componentsOptions.show" icon-class="收缩" />
      <svg-icon v-else icon-class="展开" />
    </span>
  </div>
</template>

<script>
export default {
  name: 'ColHeader',
  props: {
    componentsOptions: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>
