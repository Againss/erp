<!--
 * @Descripttion:选项配置弹框表格启用禁用
 * @Author: admin
 * @Date: 2021-03-04 10:58:14
 * @LastEditors: admin
 * @LastEditTime: 2021-03-23 14:37:10
-->

<template>
  <div class="enable-switch">
    <el-switch
      v-model="status"
      :disabled="false"
      :active-value="1"
      :inactive-value="0"
      @change="componentsOptions.changeStatus(scope, formDatas, setFormDatas, newStatus)"
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
    formDatas: {
      type: Object
    },
    setFormDatas: {
      type: Function
    },
    componentsOptions: {
      type: Object
    }
  },
  data() {
    return {
      // status: 0
      newStatus: this.scope.row.status
    }
  },
  computed: {
    status: {
      // return this.scope.row.status
      get() {
        return this.scope.row.status
      },
      set(v) {
        console.log(v)
        this.newStatus = v
        // this.status = v
        this.scope.row.status = v
      }
    },
    getPermiTag() {
      return this.componentsOptions.permitTag || ''
    }
  },
  watch: {},
  created() {
    // console.log('111', this.scope.row.status)
  },
  mounted() {},
  methods: {

  }
}
</script>
