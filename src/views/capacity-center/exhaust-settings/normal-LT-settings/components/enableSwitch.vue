
<template>
  <div class="enable-switch">
    <el-switch
      v-model="scope.row.status"
      :disabled="!$permission([getPermiTag])"
      active-value="Y"
      inactive-value="N"
      @change="componentsOptions.changeStatus(scope)"
    />
  </div>
</template>
<script>
// :disabled="!$permission([getPermiTag])"
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
