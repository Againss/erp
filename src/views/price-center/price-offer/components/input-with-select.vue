<!--
 * @Date: 2021-05-22 09:32:52
 * @Author: Againss
 * @LastEditTime: 2021-05-22 15:01:39
 * @LastEditors: Againss
 * @Descripttion:数量选择框
-->
<template>
  <el-form-item
    :rules="options.rules"
    :prop="options.prop"
    :label="options.label"
  >
    <div>
      <el-input v-model="componentsOptions.weight" :placeholder="options.placeholder" class="input-with-select">
        <el-select slot="append" v-model="componentsOptions.unit" placeholder="请选择">
          <el-option label="kg" value="kg" />
          <el-option label="lb" value="lb" />
          <el-option label="yd" value="yd" />
        </el-select>
      </el-input>
    </div>
  </el-form-item>

</template>

<script>
export default {
  props: {
    componentsOptions: {
      type: Object,
      default() {
        return {}
      }
    },
    options: {
      type: Object,
      default() {
        return {}
      }
    },
    formDatas: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
    }
  },
  watch: {
    'componentsOptions.weight': function() {
      this.$attrs['set-form-datas']({ weight: this.componentsOptions.weight })
    },
    'componentsOptions.unit': function() {
      this.$attrs['set-form-datas']({ unit: this.componentsOptions.unit })
    }
  }

}
</script>

<style lang="scss" scoped>
/deep/ .input-with-select .el-input-group__append {
    background-color: #fff;
    width: 30%;
  }
</style>
