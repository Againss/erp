<!--
 * @Date: 2020-11-03 16:15:02
 * @Author: Againss
 * @LastEditTime: 2020-11-19 13:52:04
 * @LastEditors: Againss
 * @Descripttion:
-->
<template>
  <el-popover
    v-model="visible"
    placement="bottom"
    width="1000"
    trigger="click"
    @show="show"
  >
    <div>
      <p class="box-title">工艺要求</p>
      <el-input
        v-model="search"
        class="box-input"
        size="mini"
        placeholder="输入关键字搜索"
      />
      <div class="tabs-list">
        <el-tabs
          v-if="visible"
          v-model="activeName"
          class="tabs"
          @tab-click="handleClick"
        >
          <el-tab-pane label="染整" name="dye" />
          <el-tab-pane label="印花" name="print" />
        </el-tabs>
        <div class="clear">
          <el-button size="mini" type="text" @click="clear">清空</el-button>
        </div>
      </div>
      <div class="cont">
        <div v-for="data in list" :key="data.group" class="list">
          <div class="title">{{ data.group }}</div>
          <el-checkbox-group v-model="checkList" class="checkbox">
            <el-checkbox
              v-for="item in data.data"
              :key="item.typeId"
              :class="{ long: item.name.length > 10 }"
              :title="item.name"
              :label="item.typeId"
              @change="change($event, item)"
            >{{ item.name }}</el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
      <div class="check">已选：{{ showValue }}</div>
      <div style="text-align: right; margin: 10px 0 0">
        <el-button
          size="mini"
          type="text"
          @click="visible = false"
        >取消</el-button>
        <el-button type="primary" size="mini" @click="ok">确定</el-button>
      </div>
    </div>
    <el-input
      slot="reference"
      :value="value"
      :title="value"
      placeholder="请选择工艺"
    />
  </el-popover>
</template>

<script>
import { requirementList } from '../api'
export default {
  props: {
    options: {
      type: Object
    },
    componentsOptions: {
      type: Object
    }
  },
  data() {
    return {
      dye: [],
      print: [],
      list: [],
      checkList: [],
      checkValList: [],
      activeName: 'dye',
      visible: false,
      search: ''
    }
  },
  computed: {
    value() {
      return this.componentsOptions.checkValList.reduce((str, item) => {
        if (str) {
          str += ',' + (item && item.name)
        } else {
          str = item && item.name
        }
        return str
      }, '')
    },
    showValue() {
      return this.checkValList.reduce((str, item) => {
        if (str) {
          str += ',' + (item && item.name)
        } else {
          str = item && item.name
        }
        return str
      }, '')
    }
  },
  watch: {
    search: async function(val) {
      const res = await requirementList({ name: val })
      this.dye = res.data.dye || []
      this.print = res.data.print || []
      if (this.activeName === 'dye') {
        this.list = this.dye
      } else {
        this.list = this.print
      }
    }
  },
  created() {
    if (this.activeName === 'dye') {
      this.list = this.dye
    } else {
      this.list = this.print
    }
  },
  methods: {
    async show() {
      this.search = ''
      const res = await requirementList()
      this.dye = res.data.dye || []
      this.print = res.data.print || []
      if (this.activeName === 'dye') {
        this.list = this.dye
      } else {
        this.list = this.print
      }
      this.checkList = this.componentsOptions.checkList || []
      this.checkValList = [...this.componentsOptions.checkValList]
    },
    handleClick() {
      if (this.activeName === 'dye') {
        this.list = this.dye
      } else {
        this.list = this.print
      }
    },
    ok() {
      this.visible = false
      this.componentsOptions.ok(this.checkList, this.checkValList)
    },
    change(check, val) {
      if (!check) {
        this.checkValList.splice(this.checkValList.findIndex(item => { return item.typeId === val.typeId }), 1)
      } else {
        this.checkValList.push(val)
      }
    },
    clear() {
      this.checkList = []
      this.checkValList = []
    }
  }

}
</script>

<style lang="scss" scoped>
.list {
  display: flex;
  .title {
    padding: 3px 0;
    width: 24px;
  }
  .checkbox {
    flex: 1;
    /deep/ .el-checkbox {
      padding: 3px 0;
    }
  }
  /deep/.el-checkbox__label {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    width: 180px;
    vertical-align: bottom;
  }
  .long {
    /deep/.el-checkbox__label {
      width: 400px;
    }
  }
}
.box-title {
  color: #151222;
  font-size: 14px;
  line-height: 36px;
  margin: 0 0 14px;
}
.box-input {
  margin: 0 0 14px;
}
.cont {
  max-height: 300px;
  overflow: auto;
  margin-bottom: 10px;
  border-bottom: 1px solid #e9eff2;
}
.tabs-list {
  position: relative;
  height: 50px;
  .clear {
    position: absolute;
    right: 5px;
    top: 10px;
  }
}
.check {
  padding-bottom: 10px;
  border-bottom: 1px solid #e9eff2;
}
/deep/ .el-tabs__nav-wrap::after {
  height: 1px;
  background: #eeeff0;
}
/deep/ .el-checkbox {
  font-weight: 400;
}
</style>
