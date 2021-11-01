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
      active-value="Y"
      inactive-value="N"
      :disabled="!$permission(getPermiTag)"
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
      if (this.componentsOptions && this.componentsOptions.permitTag) {
        if (typeof this.componentsOptions.permitTag === 'object') {
          return this.componentsOptions.permitTag || []
        }
        if (typeof this.componentsOptions.permitTag === 'string') {
          return this.componentsOptions.permitTag.split(',') || []
        }
      } else {
        return []
      }
      return []
    }
  },
  watch: {},
  mounted() {},
  methods: {}
}
</script>
