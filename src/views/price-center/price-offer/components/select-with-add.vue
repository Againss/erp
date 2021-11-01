<!--
 * @Date: 2021-05-27 18:34:21
 * @Author: Againss
 * @LastEditTime: 2021-05-28 15:39:47
 * @LastEditors: Againss
 * @Descripttion:
-->
<template>
  <el-form-item
    class="selectwithadd"
    :rules="options.rules"
    :prop="options.prop"
    :style="options.itemStyle"
    :label="options.label"
  >
    <el-select :value="selectedValue" filterable placeholder="请选择" @change="changeHandler" @focus="focusHandler">
      <el-option
        v-for="item in options.dataSource"
        :key="item.value"
        :label="item.label"
        :value="item"
      />
    </el-select>
    <span class="text" @click="addHandler">新建</span>
  </el-form-item>
</template>

<script>
export default {
  props: {
    options: {
      type: Object
    },
    formDatas: {
      type: [Object, Array]
    },
    form: {
      type: Object
    },
    value: {
      type: [String, Number, Array, Object]
    },
    componentsOptions: {
      type: Object
    }
  },
  data() {
    return {
      selectedValue: null
    }
  },
  watch: {
    value(val) {
      this.selectedValue = val
    }
  },
  methods: {
    changeHandler(data) {
      this.selectedValue = data
      this.componentsOptions.change(data)
    },
    // 获取焦点时候去请求数据
    focusHandler(data) {
      this.componentsOptions.focus()
    },
    addHandler(data) {
      this.componentsOptions.add()
    }
  }

}
</script>

<style lang="scss" scoped>
.selectwithadd {
  position: relative;
  .el-select {
    width: 100%;
  }
}
.text {
  position: absolute;
  right: -35px;
  top: 0;
  cursor: pointer;
  color: #0986FF;
}
.text:hover {
  text-decoration: underline;
}
</style>
