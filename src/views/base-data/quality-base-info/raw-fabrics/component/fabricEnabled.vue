<template>
  <div class="enable-switch">
    <el-switch
      v-if="scope.row.status == 'Y'"
      v-model="scope.row.isEnabled"
      active-value="Y"
      inactive-value="N"
      :disabled="!$permission([getPermiTag])"
      @change="componentsOptions.changeStatus(scope)"
    />
  </div>
</template>
<script>
// :disabled="!$permission([getPermiTag])"
export default {
  name: 'EnableSwitch',
  components: {},
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
