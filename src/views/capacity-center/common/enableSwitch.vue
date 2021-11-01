<!--
 * @Descripttion:
 * @version:
 * @Author: shujing
 * @Date: 2020-09-24 14:35:46
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-03-09 19:11:13
-->
<template>
  <div class="enable-switch">
    <el-switch
      v-model="scope.row.status"
      :disabled="!$permission(getPermiTag)"
      :active-value="1"
      :inactive-value="0"
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
      console.log(this.componentsOptions.permitTag)
      return this.componentsOptions.permitTag || []
    }
  },
  watch: {},
  mounted() {},
  methods: {}
}
</script>
