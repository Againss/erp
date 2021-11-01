<!--
 * @Date: 2020-12-31 10:28:46
 * @Author: anthony
 * @LastEditTime: 2021-01-04 15:35:58
 * @LastEditors: Sanmao
 * @Descripttion:布属性
-->
<template>
  <div class="clothAttribute">
    <div v-if="permissionObj[activeName]" class="header-botton">
      <el-button type="primary" size="small" icon="el-icon-plus" @click="addData">新增</el-button>
    </div>
    <el-tabs v-model="activeName" @tab-click="handClick">
      <el-tab-pane v-if="$permission(['basic:clothCategory:index'])" label="布种分类" name="ClothType">
        <Cloth-type ref="ClothType" />
      </el-tab-pane>
      <el-tab-pane v-if="$permission(['basic:fabrications:index'])" label="布种" name="ClothList">
        <Cloth-list ref="ClothList" />
      </el-tab-pane>
      <el-tab-pane v-if="$permission(['basic:fabricationProduceModes:index'])" label="织造花型" name="KnitList">
        <Knit-list ref="KnitList" />
      </el-tab-pane>
      <el-tab-pane v-if="$permission(['basic:fabricationProduceModes:index'])" label="染方式" name="DyeList">
        <Dye-list ref="DyeList" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import ClothType from './type.vue'
import ClothList from './cloth.vue'
import KnitList from './knit.vue'
import DyeList from './dye.vue'
import { debounce } from '@/utils'
export default {
  components: { ClothType, ClothList, KnitList, DyeList },
  data() {
    return {
      activeName: '',
      permissionObj: {
        ClothType: this.$permission([
          'basic:clothCategory:store'
        ]),
        ClothList: this.$permission([
          'basic:fabrications:store'
        ]),
        KnitList: this.$permission([
          'basic:fabricationProduceModes:store'
        ]),
        DyeList: this.$permission([
          'basic:fabricationProduceModes:store'
        ])
      } // 新增按钮权限
    }
  },
  mounted() {
    this.activeName = 'ClothType'
  },
  methods: {
    /**
     * @description 切换页签
     */
    handClick: debounce(
      function() {
        this.$refs[this.activeName].getListData()
      },
      300,
      true
    ),
    /**
     * @description 新增
     */
    addData() {
      this.$refs[this.activeName].addList()
    }
  }
}
</script>

<style lang='scss' scoped>
.clothAttribute {
  padding: 20px;
  padding-bottom: 0;
  position: relative;
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
}
// /deep/.clothAttribute .el-tabs__header {
//   position: relative;
// }
/deep/.el-tabs__content {
  overflow: initial;
}
</style>
