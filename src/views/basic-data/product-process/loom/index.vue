<!--
 * @Descripttion:
 * @version:
 * @Author: shujing
 * @Date: 2020-09-23 11:58:31
 * @LastEditors: Sanmao
 * @LastEditTime: 2021-01-04 14:02:51
 * @Description 织机
-->
<template>
  <div class="app-container">
    <div v-if="permissionObj[activeName]" class="header-botton">
      <el-button type="primary" size="small" icon="el-icon-plus" @click="addData">新增</el-button>
    </div>

    <div class="t-tab-container">
      <el-tabs v-model="activeName" @tab-click="handClick">
        <el-tab-pane v-if="$permission(['basic:loomBrands:index'])" label="品牌" name="brand">
          <brand ref="brand" />
        </el-tab-pane>

        <el-tab-pane v-if="$permission(['basic:loomCirculars:index'])" label="圆机" name="round">
          <round ref="round" />
        </el-tab-pane>
      </el-tabs>
    </div>

  </div>
</template>

<script>
// import { Component, Vue } from 'vue-property-decorator'
import brand from './brand.vue'
import round from './round.vue'
import { debounce } from '@/utils'
// import TestItems from './test-items.vue'
export default {
  name: 'LoomIndex',
  components: { brand, round },
  data() {
    return {
      activeName: '',
      permissionObj: {
        brand: this.$permission(['basic:loomBrands:store']),
        round: this.$permission(['basic:loomCirculars:store'])
      } // 新增按钮权限
    }
  },
  mounted() {
    if (this.$permission(['basic:loomBrands:store'])) {
      this.activeName = 'brand'
    } else {
      this.activeName = 'round'
    }
  },
  methods: {
    /**
     * @description 新增
     */
    addData() {
      this.$refs[this.activeName].addRange()
    },
    /**
     * @description 切换页签
     */
    handClick: debounce(
      function() {
        this.$refs[this.activeName].getGroupPage()
      },
      300,
      true
    )
  }
}

</script>

<style lang='scss' scoped>
.app-container {
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

</style>

