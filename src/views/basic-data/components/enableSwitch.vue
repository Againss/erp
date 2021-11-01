<!--
 * @Descripttion:
 * @version:
 * @Author: shujing
 * @Date: 2020-09-24 14:35:46
 * @LastEditors: shujing
 * @LastEditTime: 2020-10-13 10:05:38
-->
<template>
  <div class="enable-switch">
    <el-switch
      v-if="scope.row.status.code == 'P'"
      v-model="scope.row.enabled.code"
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
