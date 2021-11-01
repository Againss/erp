<template>
  <div class="weaveYarn">
    <!-- tab切换 -->
    <div class="tabs">
      <el-tabs v-model="fatherActiveName" class="" @tab-click="fatherHandleClick">
        <el-tab-pane v-for="(item, index) in tabData" :key="index" :label="item.name" :name="item.name" />
      </el-tabs>
      <div style="padding: 0 10px;box-sizing: border-box;background-color: #FFFFFF;">
        <el-tabs v-model="activeName" class="tabs_height50px" @tab-click="sonHandleClick">
          <el-tab-pane v-for="(subItem, indexs) in sonTabData" :key="`${indexs}${subItem}${activeName}`" :label="subItem.name" :name="subItem.name" />
        </el-tabs>
      </div>

    </div>
    <!-- table表格 -->
    <div v-if="fatherActiveName === '短纤' || fatherActiveName === '长丝'" class="page-table">
      <short-fibre ref="shortFibre" />
    </div>
    <div v-if="fatherActiveName === '附加织损' && activeName === '布种'" class="page-table">
      <fabrications ref="fabrications" />
    </div>
    <div v-if="fatherActiveName === '附加织损' && activeName === '织染方式'" class="page-table">
      <weave-wastage ref="weaveWastage" />
    </div>

    <!-- 新增菜单按钮 -->
    <div class="button">
      <el-button v-permission="['baseData:lossSetting:baseWeaveYarn:add', 'baseData:lossSetting:baseWeaveYarn:add', 'baseData:lossSetting:baseWeaveWastage:add', 'baseData:lossSetting:baseWeaveWastage:add']" size="small" type="primary" @click="ClicksonAdd">新增</el-button>
    </div>
  </div>
</template>
<script>
import logMethods from '@/views/product-center/mixin/log-methods'
import shortFibre from './components/short-fibre/index'
import fabrications from './components/attach-wastage/fabrications/index'
import weaveWastage from './components/attach-wastage/weave-wastage/index'

export default {
  name: 'DyeBasic',
  components: { shortFibre, fabrications, weaveWastage },
  mixins: [logMethods],
  data() {
    return {
      fatherActiveName: '短纤',
      activeName: '非精梳',
      type: '0',
      isPreciseFlow: '0',
      tabData: [
        {
          name: '短纤', id: 8, children: [
            { id: 9, name: '非精梳', pid: 8 },
            { id: 1, name: '精梳', pid: 8 }
          ]
        },
        { name: '长丝', id: 9, children: [] },
        {
          name: '附加织损', id: 11, children: [
            { id: 12, name: '布种', pid: 11 },
            { id: 13, name: '织染方式', pid: 11 }
          ]
        }
      ], // 一级tab数据
      sonTabData: [] // 二级tab数据
    }
  },
  created() {
    this.load()
  },
  methods: {
    fatherHandleClick(tab) {
      this.fatherActiveName = tab.name
      this.sonTabData = this.tabData[tab.index].children || []
      this.activeName = this.sonTabData.length ? this.sonTabData[0].name : ''
      this.type = this.fatherActiveName === '短纤' ? '0' : '1'
      this.isPreciseFlow = this.fatherActiveName === '短纤' ? this.activeName === '非精梳' ? '0' : '1' : '0'
      if (this.fatherActiveName === '短纤' || this.fatherActiveName === '长丝') {
        this.$nextTick(() => {
          this.$refs['shortFibre'].init({ type: this.type, isPreciseFlow: this.isPreciseFlow })
        })
      }
    },
    sonHandleClick(tab) {
      this.activeName = tab.name
      this.type = this.fatherActiveName === '短纤' ? '0' : '1'
      this.isPreciseFlow = this.fatherActiveName === '短纤' ? this.activeName === '非精梳' ? '0' : '1' : '0'
      if (this.fatherActiveName === '短纤' || this.fatherActiveName === '长丝') {
        this.$nextTick(() => {
          this.$refs['shortFibre'].init({ type: this.type, isPreciseFlow: this.isPreciseFlow })
        })
      }
    },
    // 获取点击的数据
    ClicksonAdd() {
      if (this.fatherActiveName === '附加织损') {
        if (this.activeName === '布种') {
          this.$nextTick(() => { this.$refs['fabrications'] && this.$refs['fabrications'].doAdd() })
        } else {
          this.$nextTick(() => { this.$refs['weaveWastage'] && this.$refs['weaveWastage'].doAdd() })
        }
      }
      if (this.fatherActiveName !== '附加织损') {
        this.$nextTick(() => { this.$refs['shortFibre'] && this.$refs['shortFibre'].doAdd() })
      }
    },
    // 获取列表数据
    async load() {
      this.fatherActiveName = this.tabData[0].name
      this.sonTabData = this.tabData.length ? this.tabData[0].children : []
      this.activeName = this.sonTabData.length ? this.sonTabData[0].name : ''
      this.type = this.fatherActiveName === '短纤' ? '0' : '1'
      this.isPreciseFlow = this.fatherActiveName === '短纤' ? this.activeName === '非精梳' ? '0' : '1' : '0'
      this.$nextTick(() => {
        if (this.fatherActiveName === '短纤' || this.fatherActiveName === '长丝') {
          this.$refs['shortFibre'].init({ type: this.type, isPreciseFlow: this.isPreciseFlow })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.weaveYarn {
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
  .tabs_height50px /deep/ .el-tabs__item{
    height: 50px;
    line-height: 50px;
  }
}
</style>
