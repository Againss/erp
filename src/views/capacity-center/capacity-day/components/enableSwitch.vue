<template>
  <div class="enable-switch">
    <!-- v-if="$permission([getPermiTag])" -->
    <el-switch
      v-model="scope.row.status"
      active-value="Y"
      inactive-value="N"
      :disabled="!$permission([getPermiTag])"
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
