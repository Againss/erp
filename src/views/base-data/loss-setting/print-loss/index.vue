<template>
  <div class="printLoss">
    <div class="tabs">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="基础设置" name="1" />
        <el-tab-pane label="附加整理" name="2" />
      </el-tabs>
    </div>

    <div class="page-table">
      <basic-setting v-if="activeName === '1'" ref="basicSetting" />
      <attach v-if="activeName === '2'" ref="attach" />
    </div>

    <!-- 新增菜单按钮 -->
    <div v-if="activeName === '1'" class="button">
      <el-button v-permission="['baseData:lossSetting:basePrintBasic:add', 'baseData:lossSetting:basePrintAttach:add']" size="small" type="primary" @click="ClicksonAdd">新增</el-button>
    </div>
  </div>
</template>
<script>
import basicSetting from './basic-setting/index'
import attach from './attach/index'

export default {
  name: 'PrintLoss',
  components: { basicSetting, attach },
  mixins: [],
  data() {
    return {
      activeName: '1'
    }
  },
  created() {
    if (this.activeName === '1') {
      this.$nextTick(() => {
        this.$refs['basicSetting'].load()
      })
    }
  },
  methods: {
    // tab栏切换
    handleClick(tab, event) {
      if (this.activeName === '1') {
        this.$nextTick(() => {
          this.$refs['basicSetting'].load()
        })
      }
      if (this.activeName === '2') {
        this.$nextTick(() => {
          this.$refs['attach'].load()
        })
      }
    },
    ClicksonAdd() {
      if (this.activeName === '1') {
        this.$nextTick(() => {
          this.$refs['basicSetting'] && this.$refs['basicSetting'].doAdd()
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.printLoss {
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
