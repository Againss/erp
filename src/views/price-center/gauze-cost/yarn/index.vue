<!--
  @Description 纱成本-纱线
-->

<template>
  <div class="app-container">
    <!-- <div class="search-list" /> -->
    <div class="t-tab-container tab-wrap">
      <el-tabs v-model="activeName">
        <!-- <el-tab-pane v-if="$permission(['basic:requirementsPrinting:index'])" label="短纤" name="shortFiber"> -->
        <el-tab-pane label="短纤" name="shortFiber">
          <short-fiber v-if="activeName==='shortFiber'" ref="shortFiber" />
        </el-tab-pane>
        <el-tab-pane label="长丝" name="longFiber">
          <long-fiber v-if="activeName==='longFiber'" ref="longFiber" />
        </el-tab-pane>
      </el-tabs>
    </div>

    <router-view />
  </div>
</template>

<script>
import shortFiber from './components/short-fiber.vue'
import longFiber from './components/long-fiber.vue'
export default {
  components: { shortFiber, longFiber },
  data() {
    return {
      activeName: ''
    }
  },
  async mounted() {
    this.activeName = 'shortFiber'
  }
}

</script>

<style lang="scss" scoped>
  .app-container {
    padding: 20px;
    padding-bottom: 0;
  }
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

