<template>
  <div class="defaultOperates">
    <span
      v-for="(item, index) in componentsOptions.handle"
      :key="index"
      class="hangle itemStyle"
      :style="item.style"
      :class="{ noPermit: permitFlag }"
      @click="!permitFlag && item.method(scope)"
    >
      {{ item.handleTag }}<span style="padding: 0 7px;" /></span>
    <more
      v-if="componentsOptions.moreHandle.length !== 0"
      class="itemStyle"
      :scope="scope"
      :components-options="componentsOptions"
    />
    <!-- <span v-if="componentsOptions.handle.length > 0" class="hangle" @click="componentsOptions.handle[0].method(scope)">{{ componentsOptions.handle[0].handleTag }}</span>
    <el-divider v-if="componentsOptions.handle.length > 1" direction="vertical" />
    <span v-if="componentsOptions.handle.length > 1" class="hangle" @click="componentsOptions.handle[1].method(scope)">{{ componentsOptions.handle[0].handleTag }}</span>
    <el-divider v-if="componentsOptions.handle.length > 2" direction="vertical" />
    <span v-if="componentsOptions.handle.length > 2">
      <el-tooltip placement="right" effect="light" popper-class="tooltip">
        <div slot="content" class="handleContent">
          <div v-for="(item, index) in componentsOptions.Handle.splice(0,1)" :key="index" class="handle" @click="item.method(scope)">{{ typeof(item.handleTag) == 'function' ? item.handleTag(scope) : item.handleTag }}</div>
        </div>
        <span class="moreHandle" style="cursor: pointer;color: #1890ff;" @click="handle">更多</span>
      </el-tooltip>
    </span> -->
  </div>
</template>

<script>
import more from '@/components/handleGroup/more.vue'
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
    }
  },
  watch: {},
  mounted() {
    // console.log('scope', this.scope)
  },
  methods: {
    handle() {
    }
  }
}
</script>

<style lang="scss" scoped>
.hangle {
  color: #0f89f3;
  cursor: pointer;
}
.defaultOperates {
  display: inline-block;
  padding-left: 6px;
}
.noPermit {
  color: #ccc;
  cursor: default;
}
    .el-divider--vertical{margin:0 1px}
</style>
