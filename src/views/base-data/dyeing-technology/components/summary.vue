<template>
  <div class="summary">
    <div class="item">间条数(条)：<span class="num">{{ intervalStripSum }}</span></div>
    <div class="item">高度(cm)：<span class="num">{{ height }}</span></div>
    <div class="item">模数(模)：<span class="num">{{ modulus }}</span></div>
  </div>
</template>
<script>
export default {
  name: 'Summary',
  components: {

  },
  props: {
    // scope: {
    //   type: Object
    // },
    formDatas: {
      type: Object
    },
    componentsOptions: {
      type: Object
    }
  },
  data() {
    return {}
  },
  computed: {
    intervalStripSum() {
      return this.formDatas.intervalStripTable ? this.formDatas.intervalStripTable.length : 0
    },
    height() {
      // console.log(this.formDatas.rawMaterialTable.map(item => item.appSysId4).reduce((total, item) => total + isNaN(item * 1) ? 0 : item * 1, 0))
      console.log(this.formDatas.intervalStripTable ? this.formDatas.intervalStripTable.map(item => item.appSysId4) : 0)
      return this.formDatas.intervalStripTable ? this.formDatas.intervalStripTable.map(item => item.appSysId4).reduce((total, item) => total + (isNaN(item * 1) ? 0 : item * 1), 0) : 0
    },
    modulus() {
      return this.formDatas.intervalStripTable ? this.formDatas.intervalStripTable.map(item => item.appSysId5).reduce((total, item) => total + (isNaN(item) ? 0 : item * 1), 0) : 0
    }
  },
  watch: {},
  mounted() {
    console.log(this.formDatas)
  },
  methods: {}
}
</script>
<style lang="scss" scoped>
    .summary {
        display: flex;
        font-size: 14px;
        color: #151222;
        border-top: 1px solid #EEEFF0;
        padding-top: 20px;

        .item {
            margin: 0 20px;
        }

        .num {
            // font-size: 14px;
            color: #FF4444;
        }
    }
</style>
