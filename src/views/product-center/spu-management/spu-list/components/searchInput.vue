<!--
 * @Author: Sanmao
 * @Date: 2020-09-28 15:14:24
 * @LastEditors: Sanmao
 * @LastEditTime: 2020-10-15 11:40:37
 * @Descripttion:
-->
<template>
  <div class="search-input">
    <!-- <div
      class="label-text"
      :style="{ 'text-align': options.componentsOptions.textAlign || 'left' }"
    >
      {{ options.label }}
    </div> -->
    <!-- <el-form> -->
    <el-form-item
      :label="options.label"
      style="width: auto; padding-right: 0; margin-bottom: 0"
    />
    <!-- </el-form> -->
    <div style="display: flex; flex: 1">
      <div
        v-for="(item, index) in options.prop.split('-')"
        :key="index"
        class="input-box"
      >
        <el-input
          v-model="dataVal[`${item}`]"
          @input="inputChange($event, index, item)"
        /><span>{{ index === 0 ? "-" : "" }}</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'SearchInputs',
  inheritAttrs: false,
  props: {
    options: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      dataVal: this.options.componentsOptions.value
    }
  },
  watch: {
    'options.componentsOptions.reset': function(newVal, oldVal) {
      if (newVal) {
        this.dataVal = {}
      }
    }
  },
  methods: {
    inputChange(e, index, item) {
      // console.log(this);
      // 过滤空值
      const copyObj = JSON.parse(JSON.stringify(this.dataVal))
      for (const key in copyObj) {
        if (!copyObj[key]) {
          delete copyObj[key]
        }
      }
      this.$attrs['set-form-datas'](copyObj)
      this.$attrs['components-options'].reset = false
    }
  }
}
</script>
<style lang="scss" scoped>
.search-input {
  display: flex;
  width: 33.33%;
  padding-right: 10px;
  .label-text {
    width: 90px;
    line-height: 36px;
    height: 36px;
    vertical-align: middle;
    font-size: 14px;
    font-weight: 700;
    color: #606266;
    padding: 0 12px 0 0;
    box-sizing: border-box;
  }
  .input-box {
    display: flex;
    height: 36px;
    flex: 1;
    span {
      align-self: center;
    }
  }
}
</style>
