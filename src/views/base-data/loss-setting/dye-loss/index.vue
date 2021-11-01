<!--
 * @name: 染损
 * @description: 染损页面
 * @author: panmr
 * @time: 2021-04-23 17:40:46
-->
<template>
  <div class="dyeLoss">
    <!-- tab切换 -->
    <div class="tabs">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="基础设置" name="basicSetting" />
        <el-tab-pane label="附加整理" name="attach" />
        <el-tab-pane label="附加走货公差" name="publicError" />
        <el-tab-pane label="额外加成" name="addition" />
      </el-tabs>
    </div>

    <div class="page-table">
      <basic-setting v-if="activeName === 'basicSetting'" ref="basicSetting" />
      <attach v-if="activeName === 'attach'" ref="attach" />
      <public-error v-if="activeName === 'publicError'" ref="publicError" />
      <addition v-if="activeName === 'addition'" ref="addition" />
    </div>

    <div class="button">
      <el-button v-permission="['baseData:lossSetting:baseDyeBasic:add', 'baseData:lossSetting:baseDyeAttach:add', 'baseData:lossSetting:basePublicError:add', 'baseData:lossSetting:baseAddition:add']" size="small" type="primary" @click="AddLoss">新增</el-button>
    </div>
  </div>
</template>
<script>
import basicSetting from './basic-setting/index'
import attach from './attach/index'
import publicError from './public-error/index'
import addition from './addition/index'

export default {
  name: 'DyeLoss',
  components: { basicSetting, attach, publicError, addition },
  mixins: [],
  data() {
    return {
      activeName: 'basicSetting'
    }
  },
  created() {
    this.$nextTick(() => {
      this.$refs[this.activeName].load()
    })
  },
  methods: {
    /**
     * @param tab
     * @param event
     */
    handleClick(tab, event) {
      this.$nextTick(() => {
        this.$refs[this.activeName].load()
      })
    },
    AddLoss() {
      console.log('AddLoss')
      this.$refs[this.activeName] && this.$refs[this.activeName].doAdd()
    }

  }
}
</script>

<style lang="scss" scoped>
.dyeLoss {
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
  .button {
    position: absolute;
    right: 40px;
    width: 68px;
    z-index: 8;
    top: 34px;
    button {
      width: 100%;
    }
  }
  .page-table{
    padding: 0 !important;
  }
}
</style>
