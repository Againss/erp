<template>
  <div class="template-params-wrap">
    <!-- tab切换 -->
    <el-tabs v-model="activeTabName" class="tab-change" @tab-click="handleTabClick">
      <el-tab-pane v-for="item in tabs" :key="item.name" :label="item.label" :name="item.name" />
    </el-tabs>

    <div>
      <component :is="contentComp" />
    </div>
  </div>
</template>

<script>
import BatchToTemplate from './tabs/batch-to-template'
import TemplateToStandard from './tabs/template-to-standard'
import StandardToUnit from './tabs/standard-to-unit'
import TemplateToTest from './tabs/template-to-test'

export default {
  name: 'TemplateParams',

  data() {
    return {
      activeTabName: '1',
      tabs: [
        { label: '批次-制板类型', name: '1' },
        { label: '制板类型-规格', name: '2' },
        { label: '规格-单位', name: '3' },
        { label: '板型-样板合格', name: '4' }
      ]
    }
  },

  computed: {
    contentComp() {
      return {
        1: BatchToTemplate,
        2: TemplateToStandard,
        3: StandardToUnit,
        4: TemplateToTest
      }[this.activeTabName]
    }
  },

  methods: {
    handleTabClick() {
      // DD
    }
  }
}
</script>

<style scoped lang="scss">
  .template-params-wrap {
    margin: 20px;
    background-color: #fff;

    .tab-change {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #eeeff0;
      background: #fff;

      /deep/ .el-tabs__header {
        margin: 0;
      }
      /deep/ .el-tabs__nav-wrap::after {
        height: 0;
      }
      /deep/ .el-tabs__item {
        padding: 10px 20px;
        height: auto;
      }
    }
  }
</style>

<style lang="scss">
  .template-params {
    &-header {
      padding: 20px 20px 15px;
    }

    &-table {
      padding: 0 20px 20px;
    }

    &-table--no-stripe {
      .el-table tr:nth-child(even){
        background: #fff;
      }
    }
  }
</style>
