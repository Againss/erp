<!--
 * @Author: Sanmao
 * @Date: 2020-12-11 10:03:42
 * @LastEditors: Sanmao
 * @LastEditTime: 2020-12-23 14:16:47
 * @Descripttion:
-->
<template>
  <div class="product-list-content process-parameters">
    <div v-if="permissionObj[activeName]" class="header-botton">
      <el-button type="primary" size="small" @click="addData">新增</el-button>
    </div>

    <el-tabs v-model="activeName" @tab-click="handClick">
      <el-tab-pane
        v-if="$permission(['color:Api:FlowerBd:TechParamName:index'])"
        label="工艺参数名称"
        name="processParametersName"
      >
        <process-parameters-name
          ref="processParametersName"
          :components-type="activeName"
        />
      </el-tab-pane>
      <el-tab-pane
        v-if="$permission(['color:Api:FlowerBd:TechParam:index'])"
        label="工艺参数"
        name="processParameters"
      >
        <process-parameters
          ref="processParameters"
          :components-type="activeName"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { debounce } from '@/utils'
import processParameters from './components/processParameters.vue'
import processParametersName from './components/processParametersName.vue'
export default {
  name: 'ProcessParameters',
  components: { processParameters, processParametersName },
  data() {
    return {
      activeName: 'processParametersName',
      permissionObj: {
        processParametersName: this.$permission([
          'color:Api:FlowerBd:TechParamName:store'
        ]),
        processParameters: this.$permission([
          'color:Api:FlowerBd:TechParam:store'
        ])
      } // 新增按钮权限
    }
  },
  mounted() {
    if (this.$permission(['color:Api:FlowerBd:TechParamName:index'])) {
      this.activeName = 'processParametersName'
    } else {
      this.activeName = 'processParameters'
    }
  },
  methods: {
    /**
     * @description 切换页签
     */
    handClick: debounce(
      function() {
        this.$refs[this.activeName].getRulePage()
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
<style lang="scss" scoped>
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
.process-parameters {
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
}
</style>

