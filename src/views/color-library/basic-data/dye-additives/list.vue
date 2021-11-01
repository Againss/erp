<!--
 * @Author: Sanmao
 * @Date: 2020-11-03 10:27:37
 * @LastEditors: Sanmao
 * @LastEditTime: 2020-12-23 14:25:33
 * @Descripttion:色号库-基础数据-染料助剂列表
-->
<template>
  <div class="product-list-content dye-additives">
    <!-- <div v-show="activeName === 'dyeadditives'" class="search">
      <cs-custom-form
        ref="searchForm"
        :data-source="searchData"
        :options="{ size: 'small', inline: true }"
      />
    </div> -->
    <div v-if="permissionObj[activeName]" class="header-botton">
      <el-button type="primary" size="small" @click="addData">新增</el-button>
    </div>

    <el-tabs v-model="activeName" @tab-click="handClick">
      <el-tab-pane
        v-if="$permission(['color:Api:ColorBd:DyestuffAssist:index'])"
        label="染料助剂"
        name="dyeadditives"
      >
        <dyeadditives ref="dyeadditives" :components-type="activeName" />
      </el-tab-pane>
      <el-tab-pane
        v-if="$permission(['color:Api:ColorBd:DyestuffAssistType:index'])"
        label="染料助剂类型"
        name="dyeadditivesType"
      >
        <dyeadditives-type
          ref="dyeadditivesType"
          :components-type="activeName"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import dyeadditives from './components/dyeadditives'
import dyeadditivesType from './components/dyeadditivesType'
import { debounce } from '@/utils'
export default {
  name: 'DyeAdditivesList',
  components: { dyeadditives, dyeadditivesType },
  data() {
    return {
      activeName: 'dyeadditives',
      permissionObj: {
        dyeadditivesType: this.$permission([
          'color:Api:ColorBd:DyestuffAssistType:store'
        ]),
        dyeadditives: this.$permission([
          'color:Api:ColorBd:DyestuffAssist:store'
        ])
      } // 新增按钮权限
    }
  },
  mounted() {
    if (this.$permission(['color:Api:ColorBd:DyestuffAssist:index'])) {
      this.activeName = 'dyeadditives'
    } else {
      this.activeName = 'dyeadditivesType'
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
.dye-additives {
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
