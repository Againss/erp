<template>
  <div>
    <span
      v-for="(item, index) in getDataSource"
      :key="index"
      class="hangle"
      :style="item.style"
      :class="{ noPermit: permitFlag }"
      @click="!permitFlag && item.method(scope)"
    >
      {{ item.handleTag }}
      <!--   <el-divider direction="vertical" /> -->
    </span>
    <more
      v-if="componentsOptions.moreHandle.length !== 0"
      :scope="scope"
      :components-options="componentsOptions"
    />
  </div>
</template>

<script>
import more from './more.vue'
export default {
  name: 'Handle',
  components: {
    more
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
    permitFlag() {
      return this.componentsOptions.noJump ? this.$store.state.user.userInfo.appSystemIds.length !== 0 ? !this.$store.state.user.userInfo.appSystemIds.includes(this.scope.row.appSysId) : false : false
    },
    getDataSource() {
      return this.componentsOptions.dataSource.filter(item => {
        if (item.isShow && typeof (item.isShow) === 'function') {
          return item.isShow(this.scope)
        }
        return item.isShow || false
      })
    }
  },
  watch: {},
  mounted() {

  },
  methods: {
    handle() {
    }
  }
}
</script>

<style lang="scss" scoped>
.hangle {
  margin-right: 20px;
  color: #1890ff;
  cursor: pointer;
}
.noPermit {
  color: #ccc;
  cursor: default;
}
</style>
