<!--
 * @Author: xj
 * @Description: 基础数据》印花进度
 * @Date: 2020-12-16 17:15:31
 * @LastEditors: OBKoro1
 * @LastEditTime: 2020-12-16 17:24:49
-->

<template>
  <div class="enable-switch">
    <el-switch
      v-if="scope.row.statu.code == 'Y'"
      v-model="scope.row.enable.code"
      :disabled="!$permission([getPermiTag])"
      active-value="Y"
      inactive-value="N"
      @change="componentsOptions.changeStatus(scope)"
    />
  </div>
</template>
<script>
export default {
  name: 'EnableSwitch',
  components: {

  },
  props: {
    scope: {
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
    getPermiTag() {
      return this.componentsOptions.permitTag || ''
    }
  },
  watch: {},
  mounted() {},
  methods: {}
}
</script>
