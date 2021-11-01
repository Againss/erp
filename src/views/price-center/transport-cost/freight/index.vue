<template>
  <div class="app-container">
    <div class="search-list" />

    <div class="t-tab-container tab-wrap">
      <el-tabs v-model="activeName">
        <el-tab-pane label="国内运费" name="domestic">
          <domestic v-if="activeName==='domestic'" ref="domestic" />
        </el-tab-pane>
        <el-tab-pane label="国际运费" name="international">
          <international v-if="activeName==='international'" ref="international" />
        </el-tab-pane>
      </el-tabs>
    </div>

    <router-view />
  </div>
</template>

<script lang="ts">
import international from './components/international.vue'
import domestic from './components/domestic.vue'
export default {
  components: { international, domestic },
  data() {
    return {
      activeName: ''
    }
  },
  mounted() {
    this.activeName = 'domestic'
  }
}

</script>

<style scoped lang="scss">
.app-container {padding: 20px;padding-bottom: 0;}
.tab-wrap {
  position: relative;
  /deep/.el-tabs__nav-wrap {
    padding-left: 20px;
    background: #fff;
    &::after {
      height: 1px;
    }
  }
  /deep/ .el-tabs__header {
    margin-bottom: 1px;
  }
  /deep/ .el-tabs__item {
    height: 60px;
    line-height: 60px;
  }
}
</style>

