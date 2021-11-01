
<template>
  <div class="enable-switch">
    <!-- v-if="scope.row.status === 'Y'" -->
    <el-switch
      v-if="shwoSwitch"
      v-model="scope.row.isEnabled"
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
      return this.componentsOptions.permitTag || ''
    },
    shwoSwitch() {
      if (this.scope.row.status) {
        if (this.scope.row.status === 'Y') {
          return true
        } else {
          return false
        }
      } else {
        return true
      }
    }
  },
  watch: {},
  mounted() {},
  methods: {}
}
</script>
