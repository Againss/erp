<template>

  <el-tooltip placement="left" effect="light">
    <div slot="content">
      <div class="tipContents">
        <p>计算规则：</p>
        <p v-show="getActiveName === '纱支'">a. 名称包含“S”时，实际支数=S前的数字/S后的数字,比如：80S/2 实际支数=80/2=40</p>
        <p
          v-show="getActiveName === '纱支'"
        >b. 名称包含“N”时，实际支数=N前的数字/N后的数字*0.5831,比如：80N/2 实际支数=80/2*0.5831=23.32</p>
        <p
          v-show="getActiveName === '细度'"
        >a. 名称最后一个字符不是数字，实际支数=5314.5（常数）/D前的数字,比如：300D/96F 实际支数=5314.5/300=17.72,300D 实际支数==5314.5/300=17.72</p>
        <p v-show="getActiveName === '细度'">b. 名称最后一个字符是数字比如：300D/96F/2 实际支数=5314.5/300/2=8.86</p>
      </div>
    </div>
    <div class="tip">?</div>
  </el-tooltip>
</template>

<script>
export default {
  props: {
    componentsOptions: {
      type: Object
    }
  },
  data() {
    return {}
  },
  computed: {
    getActiveName() {
      return this.componentsOptions.activeName || ''
    }
  },
  watch: {},
  mounted() {},
  methods: {}
}
</script>

<style lang="scss">
.tip {
  font-size: 16px;
  font-weight: 900;
  position: absolute;
  right: -16px;
  top: 126px;
}
</style>
