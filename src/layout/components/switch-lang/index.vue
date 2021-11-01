<template>
  <div class="lang">
    <el-select v-model="value" @change="changeHandler">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
  </div>

</template>

<script>
import Cookies from 'js-cookie'
export default {
  data() {
    return {
      options: [{
        value: 'zh',
        label: '简体中文'
      }, {
        value: 'en',
        label: 'English'
      }],
      value: Cookies.get('language') || 'zh'
    }
  },
  methods: {
    changeHandler(val) {
      Cookies.set('language', val)
      location.reload()
    }
  }
}
</script>

<style lang="scss" scoped>
.lang {
  display: inline-block;
  vertical-align: text-bottom;
  width: 100px;
  /deep/ .el-input__inner {
    border: none;
  }
}
</style>
