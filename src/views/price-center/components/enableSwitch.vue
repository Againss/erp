<template>
  <div class="enable-switch">
    <el-switch
      v-if="$permission([getPermiTag])"
      v-model="scope.row.status"
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
    }
  },
  watch: {},
  mounted() {},
  methods: {}
}
</script>
