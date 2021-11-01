<template>
  <!-- <div class="colorPreview"> -->
  <!-- <div class="change">请选择<i class="el-icon-arrow-down arrow" /></div> -->
  <el-popover
    v-model="flagValue"
    placement="right"
    width="50"
    trigger="click"
    popper-class="colorPreview"
    @show="popShow"
    @hide="popHide"
  >
    <div>
      <div v-if="color.length === 0">无可选色值</div>
      <template v-else>
        <div v-for="(item, index) in color" :key="index" class="itemStyle" :style="{'background-color': item.colorValue}" @click="itemClick(item)" />
      </template>

    </div>
    <span slot="reference" class="referenceChange" :style="{cursor: `${isDyed ? 'pointer' : ''}`, }">
      <span v-if="!colorName" class="noChange" :style="{color: `${isDyed ? '#0986FF' : '#666666'}`, }">请选择</span>
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
      flagValue: false
    }
  },
  computed: {
    colorName: {
      get() {
        return this.scope.row[this.componentsOptions.colorPropName]
      },
      set(val) {
        // this.$emit('update:page', val)
      }
    },
    isDyed() {
      if (this.componentsOptions.noJudgment) {
        return this.scope.row.isDyed !== 0
      } else {
        return false
      }
    },
    color() {
      const colorGroups = this.componentsOptions.colorGroups || []
      return colorGroups
    }
  },
  watch: {
    // 监听原料信息颜色预览数组 发生改变判断间条信息是否有选择预览数组之外的颜色, 有则清空
    color: {
      handler(v) {
        const colorNameGroups = v.map(item => item.colorValue)
        console.log(colorNameGroups, this.colorName, colorNameGroups.includes(this.colorName))
        if (!colorNameGroups.includes(this.colorName)) {
          console.log('不包含,清空')
          this.colorName = ''
          this.scope.row.colorBlock = ''
        }
      }
    }
    // componentsOptions: {
    //   handler(v) {
    //     console.log('popValue', v.popValue)
    //     if (this.scope.row.isDyed !== 0) {
    //       // debugger
    //       this.flagValue = v.popValue
    //     } else {
    //       this.flagValue = false
    //     }
    //   },
    //   deep: true
    // }
  },
  mounted() {
    // console.log(this.scope, this.formDatas)
  },
  methods: {
    popShow() {
      console.log('show')
      if (this.isDyed) {
        this.flagValue = true
        // this.componentsOptions.popValue = true
      } else {
        this.flagValue = false
        // this.componentsOptions.popValue = false
      }
    },
    popHide() {
      this.flagValue = false
      // this.componentsOptions.popValue = false
    },
    itemClick(item) {
      this.flagValue = false
      // this.colorName = item.colorValue
      this.componentsOptions.itemClick(item, this.scope, this.formDatas)
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
      // cursor: pointer;
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
