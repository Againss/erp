<template>
  <div class="enable-switch">
    <el-switch
      v-model="scope.row.key"
      active-color="#13ce66"
      inactive-color="#DCDFE6"
      @change="changeStatus(scope.row)"
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
  computed: {},
  watch: {},
  mounted() {
    // console.log('scope', this.scope)
    // console.log('componentsOptions', this.componentsOptions)
  },
  methods: {
    handle() {
      // console.log(this.scope)
    },
    changeStatus(row) {
    //  console.log(row,"row");
    }
  }
}
</script>
