<!--
 * @name: 状态
 * @description: 状态
 * @author: panmr
 * @time: 2021-05-10 15:28:28
-->
<template>
  <div class="enable-switch">
    <el-switch
      v-if="scope.row.status === 'Y'"
      v-model="scope.row.isEnabled"
      :active-value="true"
      :inactive-value="false"
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
      }
      return []
    }
  },
  watch: {},
  mounted() {},
  methods: {}
}
</script>
