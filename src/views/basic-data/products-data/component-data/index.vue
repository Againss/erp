<!--
 * @Author: Sanmao
 * @Date: 2020-12-31 10:06:39
 * @LastEditors: Sanmao
 * @LastEditTime: 2020-12-31 17:09:29
 * @Descripttion: 基础数据-产品-成分页面
-->
<template>
  <div class="componentClassify">
    <div v-if="permissionObj[activeName]" class="header-botton">
      <el-button type="primary" size="small" icon="el-icon-plus" @click="addData">新增</el-button>
    </div>
    <el-tabs v-model="activeName" @tab-click="handClick">
      <el-tab-pane v-if="$permission(['basic:IngredientClassifications:index'])" label="成份分类" name="Classify">
        <Classify ref="Classify" />
      </el-tab-pane>
      <el-tab-pane v-if="$permission(['basic:ingredients:index'])" label="成份" name="ComponentList">
        <Component-list ref="ComponentList" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Classify from './classify.vue'
import ComponentList from './component.vue'
export default {
  name: 'ComponentClassify',
  components: { Classify, ComponentList },
  data() {
    return {
      activeName: '',
      permissionObj: {
        Classify: this.$permission([
          'basic:IngredientClassifications:store'
        ]),
        ComponentList: this.$permission([
          'basic:ingredients:store'
        ])
      } // 新增按钮权限
    }
  },
  mounted() {
    this.activeName = 'Classify'
  },
  methods: {
    /**
     * @description 新增
     */
    addData() {
      this.$refs[this.activeName].addList()
    },
    /**
     * @description 切换页签
     */
    handClick(tab, event) {
      this.$refs[this.activeName].getRulePage()
    }
  }
}
</script>

<style lang='scss' scoped>
.componentClassify {
  position: relative;
  padding: 20px;
  padding-bottom: 0px;
  /deep/.el-tabs__nav-wrap {
    padding-left: 26px;
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
    padding: 0 26px;
  }
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
