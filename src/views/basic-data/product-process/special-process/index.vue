<!--
 * @Descripttion:工艺要求
 * @version:
 * @Author: shujing
 * @Date: 2020-09-23 11:54:26
 * @LastEditors: Sanmao
 * @LastEditTime: 2021-05-24 12:00:48
-->
<template>
  <div class="app-container">
    <!-- <div class="search-list" /> -->
    <div v-if="permissionObj[activeName]" class="header-botton">
      <el-button type="primary" size="small" @click="addData">新增</el-button>
    </div>
    <div class="t-tab-container">
      <el-tabs v-model="activeName" @tab-click="handClick">
        <el-tab-pane v-if="$permission(['basic:requiredClassifications:index'])" label="工艺要求分类" name="RequestSort">
          <Request-sort ref="RequestSort" />
        </el-tab-pane>

        <el-tab-pane v-if=" $permission(['basic:requirementsDye:index'])" label="染整" name="dyeingFinish">
          <dyeing-finish ref="dyeingFinish" />
        </el-tab-pane>

        <el-tab-pane v-if="$permission(['basic:requirementsPrinting:index'])" label="印花" name="printing">
          <printing-list ref="printing" />
        </el-tab-pane>
        <el-tab-pane v-if="$permission(['basic:requirementsCombination:index'])" label="染整工艺组合" name="dyeFinishingProcesses">
          <dye-finishing-processes ref="dyeFinishingProcesses" />
        </el-tab-pane>
      </el-tabs>
    </div>

    <router-view />
  </div>
</template>

<script>
// import { Component, Vue } from 'vue-property-decorator'
import RequestSort from './sort.vue'
import dyeingFinish from './dyeing.vue'
import printingList from './print.vue'
import dyeFinishingProcesses from './dyeFinishingProcesses.vue'
// import TestItems from './test-items.vue'
export default {
  name: 'AppContainer',
  components: { RequestSort, dyeingFinish, printingList, dyeFinishingProcesses },
  data() {
    return {
      activeName: '',
      permissionObj: {
        RequestSort: this.$permission([
          'basic:requiredClassifications:store'
        ]),
        dyeingFinish: this.$permission([
          'basic:requirementsDye:store'
        ]),
        printing: this.$permission([
          'basic:requirementsPrinting:store'
        ]),
        dyeFinishingProcesses: this.$permission([
          'basic:requirementsCombination:store'
        ])
      } // 新增按钮权限
    }
  },
  mounted() {
    this.activeName = 'RequestSort'
  },
  methods: {
    /**
     * @description 切换页签
     */
    handClick() {
      this.$refs[this.activeName] && this.$refs[this.activeName].getGroupPage()
    },
    /**
     * @description 新增
     */
    addData() {
      this.$refs[this.activeName] && this.$refs[this.activeName].addRange()
    }
  }
}

</script>

<style lang='scss' scoped>
.app-container {padding: 20px;padding-bottom: 0; position: relative;
/deep/.el-tabs__nav-wrap {
    padding-left: 26px;
    background: #fff;
    &::after {
      height: 1px;
    }
  }
}
/* .app-container h2{margin: 10px 0;} */
/deep/.clothAttribute .el-tabs__header {
  position: relative;
}
 /deep/ .el-tabs__header {
    margin-bottom: 1px;
    background: #fff;
  }
  /deep/ .el-tabs__item {
    height: 60px;
    line-height: 60px;
    padding: 0 26px;
  }
/deep/.el-tabs__content {
  overflow: initial;
}
.header-botton {
    position: absolute;
    right: 40px;
    width: 68px;
    z-index: 8;
    top: 34px;
    button {
      width: 100%;
    }
  }
</style>

