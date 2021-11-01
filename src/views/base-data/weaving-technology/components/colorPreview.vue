<template>
  <!-- <div class="colorPreview"> -->
  <!-- <div class="change">请选择<i class="el-icon-arrow-down arrow" /></div> -->
  <el-popover
    placement="right"
    width="50"
    trigger="click"
    popper-class="colorPreview"
  >
    <div>
      <div v-for="(item, index) in color" :key="index" class="itemStyle" :style="{'background-color': item}" @click="itemClick(item)" />
    </div>
    <span slot="reference" class="referenceChange">
      <span v-if="!colorName" class="noChange">请选择</span>
      <div v-else class="changed" :style="{'background-color': colorName}" />
      <i class="el-icon-arrow-down arrow" />
    </span>
  </el-popover>
  <!-- </div> -->
</template>
<script>
export default {
  name: 'ColorPreview',
  components: {

  },
  props: {
    scope: {
      type: Object
    },
    formDatas: {
      type: Object
    },
    componentsOptions: {
      type: Object
    }
  },
  data() {
    return {
      color: [
        '#ccc', 'pink', 'red', '#000'
      ],
      colorName: this.scope.row.appSysId8
    }
  },
  computed: {
    intervalStripSum() {
      return 111
    },
    height() {
      return 222
    },
    modulus() {
      return 333
    }
  },
  watch: {},
  mounted() {
    console.log(this.formDatas)
  },
  methods: {
    itemClick(item) {
      this.colorName = item
      this.componentsOptions.itemClick(this.scope, item)
    }
  }
}
</script>
<style lang="scss" scoped>
    .colorPreview {

        cursor: pointer;

        .itemStyle {
            width: 100%;
            height: 30px;
            margin-bottom: 10px;
            border-radius: 2px;
            cursor: pointer;
        }

        .itemStyle:last-child {
          margin-bottom: 0px;
        }

    }
    .referenceChange {
      width: 66px;
      cursor: pointer;
      display: flex;
      align-items: center;

      .change {
        cursor: pointer;
      }

      .arrow {
        color: #C2CCD6;
        margin-left: 10px;
      }

      .changed {
        display: inline-block;
        width: 42px;
        height: 24px;
        cursor: pointer;
      }
    }
</style>
