<!--
 * @Date: 2020-11-03 16:15:02
 * @Author: Againss
 * @LastEditTime: 2021-03-05 14:24:26
 * @LastEditors: Againss
 * @Descripttion:工艺要求
 * 例如：
 * components: { technological },
   componentsOptions: {
    checkValList: [],// 已确定的数组对象 格式为 [{
      name:'222',
      type:1,// 1,2,3,4
      uuid:'233344',
      parent:{name:2222},// 如果是一级的话为null
      parentUuid:'33444',// 如果是一级的话为0
    },...]
    ok: (checkList, checkValList) => {
      this.$set(this.formData[3].componentsOptions, 'checkValList', checkValList)
      this.order.requirement = checkValList
    }
  }
-->
<template>
  <el-popover
    v-model="visible"
    :disabled="options.disabled"
    placement="bottom"
    width="1000"
    trigger="click"
    @show="show"
    @after-enter="enter"
  >
    <div class="tech">
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
          <el-tab-pane label="普通" name="normal" />
          <el-tab-pane label="手感风格" name="feelStyle" />
          <el-tab-pane label="功能" name="function" />
          <el-tab-pane label="印花" name="print" />
        </el-tabs>
        <div class="clear">
          <el-button size="mini" type="text" @click="clear">清空</el-button>
        </div>
      </div>
      <div class="content">
        <el-scrollbar class="cont">
          <!-- 字母复选框 -->
          <div v-show=" activeName === 'print'">
            <div :class="{ nodata: !list || !list.length }">
              <div v-for="data in list" :key="data.group" class="list">
                <div class="title">{{ data.group }}</div>
                <el-checkbox-group v-model="checkList" class="checkbox">
                  <el-checkbox
                    v-for="(item, index) in data.data"
                    :key="item.uuid"
                    class="boxborder"
                    :class="{
                      long: item.name && item.name.length > 10,
                      last: index + 1 === data.data.length,
                    }"
                    :title="item.name"
                    :label="item.uuid"
                    @change="change($event, item)"
                  >{{ item.name }}</el-checkbox>
                </el-checkbox-group>
              </div>
            </div>
          </div>
          <!-- 字母复选框 -->
          <!-- 树 -->
          <div
            v-show="activeName === 'normal' ||activeName === 'function' || activeName === 'feelStyle'"
            class="tree"
          >
            <el-tree
              ref="treeRef"
              :data="list"
              node-key="uuid"
              :default-expanded-keys="defaultExpandedKeys"
              :default-checked-keys="checkList"
              show-checkbox
              :check-strictly="true"
              :props="defaultProps"
              check-on-click-node
              @check-change="checkChange"
            />
          </div>
          <!-- 树 -->
        </el-scrollbar>
        <el-scrollbar class="cont-check">
          <div class="check">
            <span>已选：</span>
            <div>
              <el-tag
                v-for="item in checkValList"
                :key="item.uuid"
                class="tag"
                size="medium"
                closable
                @close="closeHandler(item)"
              >{{
                item.parent? (item.parent.name + "-" + item.name)
                : item.name
              }}</el-tag>
            </div>
          </div>
        </el-scrollbar>
      </div>
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
      :disabled="options.disabled"
      :value="value"
      :title="value"
      placeholder="请选择工艺"
    />
  </el-popover>
</template>

<script>
import request from '@/utils/request'
import { debounce } from '@/utils'
export default {
  name: 'TectRequire',
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
      dataSource: {
        normal: [],
        feelStyle: [],
        function: [],
        print: []
      }, // 数据源
      list: [], // 当前显示
      checkList: [], // 已选uuid
      checkValList: [], // 已选对象
      activeName: 'normal',
      visible: false,
      search: '',
      defaultProps: {
        children: 'child',
        label: 'name'
      }
    }
  },
  computed: {
    value() {
      // input框数据
      return this.componentsOptions.checkValList.reduce((str, item) => {
        if (str) {
          // 普通已经拼好
          str += ',' + (item && (item.parent ? (item.parent.name + '-' + item.name) : item.name))
        } else {
          str = (item && (item.parent ? (item.parent.name + '-' + item.name) : item.name))
        }
        return str
      }, '')
    },
    defaultExpandedKeys() {
      // 默认展开项
      const arr = this.checkValList.filter(item => {
        return (item.type !== 4) && item.parentUuid
      })
      if (arr && arr.length) {
        return arr.map(item => {
          return item.parentUuid
        })
      }
      return ((this.dataSource[this.activeName] &&
        this.dataSource[this.activeName].length && [
        this.dataSource[this.activeName][0].uuid
      ]) ||
        [])
    }
  },
  watch: {
    search: debounce(async function(val) {
      const res = await this.requirementList({ name: val })
      this.dataSource = res.data
      this.getCurType()
    }, 300)
  },
  created() {
    this.getCurType()
  },
  methods: {
    requirementList(data = {}) {
      return request({
        url: this.componentsOptions.url || '/color/api/bd/requirement/all',
        method: 'post',
        data: { ...data }
      })
    },
    async show() {
      this.search = ''
      const res = await this.requirementList()
      this.dataSource = res.data
      this.getCurType()
      this.checkValList = [...this.componentsOptions.checkValList]
      this.checkList = this.componentsOptions.checkValList.map(item => {
        return item.uuid
      })
    },
    // 进入弹框之后触发
    enter() {
      this.$refs.treeRef && this.$refs.treeRef.setCheckedKeys(this.checkList)
    },
    // 切换数据
    getCurType() {
      switch (this.activeName) {
        case 'normal':
          this.list = this.dataSource.normal || []
          break
        case 'feelStyle':
          this.list = this.dataSource.feelStyle || []
          break
        case 'function':
          this.list = this.dataSource.function || []
          break
        case 'print':
          this.list = this.dataSource.print || []
          break
        default:
          this.list = []
          break
      }
    },
    // 切换页签
    handleClick() {
      this.getCurType()
    },
    getType() {
      let type = 0
      switch (this.activeName) {
        case 'normal':
          type = 1
          break
        case 'feelStyle':
          type = 2
          break
        case 'function':
          type = 3
          break
        case 'print':
          type = 4
          break
        default:
          break
      }
      return type
    },
    // 树节点状态发生变化
    checkChange(data, check) {
      const index = this.checkList.findIndex(item => { return item === data.uuid })
      if (!check) {
        index !== -1 && this.checkList.splice(index, 1)
        index !== -1 && this.checkValList.splice(this.checkValList.findIndex(item => { return item.uuid === data.uuid }), 1)
      } else {
        index === -1 && this.checkList.push(data.uuid)
        index === -1 && this.checkValList.push({
          uuid: data.uuid, name: data.name, type: data.type || this.getType(), parent: data.parent || null, parentUuid: data.parent ? data.parent.uuid : 0
        })
      }
    },
    ok() {
      this.visible = false
      this.componentsOptions.ok(this.checkValList)
    },
    // 处理已选对象
    change(check, data) {
      if (!check) {
        this.checkValList.splice(this.checkValList.findIndex(item => { return item.uuid === data.uuid }), 1)
      } else {
        this.checkValList.push({
          uuid: data.uuid, name: data.name, type: data.type || this.getType(), parent: data.parent || null, parentUuid: data.parent ? data.parent.uuid : 0
        })
      }
    },
    // 已选标签关闭
    closeHandler(val) {
      const index = this.checkList.findIndex(item => { return item === val.uuid })
      index !== -1 && this.checkList.splice(index, 1)
      index !== -1 && this.checkValList.splice(this.checkValList.findIndex(item => { return item.uuid === val.uuid }), 1)
      this.$refs.treeRef.setChecked(val.uuid, false)
    },
    clear() {
      this.checkList = []
      this.checkValList = []
      this.$refs.treeRef && this.$refs.treeRef.setCheckedKeys([])
    }
  }

}
</script>

<style lang="scss" scoped>
.tech {
  .list {
    display: flex;
    .title {
      padding: 6px 0;
      width: 24px;
    }
    .checkbox {
      flex: 1;
      display: flex;
      flex-wrap: wrap;
      /deep/ .el-checkbox {
        padding: 6px 5px 6px 0;
      }
      /deep/ .el-checkbox {
        font-weight: 400;
        margin-right: 0px;
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
  .content {
    min-height: 200px;
    display: flex;
    justify-content: space-between;
  }
  %com {
    max-height: 300px;
    margin-bottom: 10px;
    padding-top: 10px;
    border-bottom: 1px solid #e9eff2;
    /deep/.el-scrollbar__wrap {
      overflow-x: hidden;
    }
  }
  .cont {
    // min-height: 200px;
    flex: 1;
    @extend %com;
  }
  .cont-check {
    width: 320px;
    padding-left: 20px;
    border-left: 1px solid #e9eff2;
    @extend %com;
  }
  .nodata:after {
    content: "暂无数据";
    display: flex;
    justify-content: center;
    width: 100%;
    height: 200px;
    color: #909399;
    line-height: 60px;
  }
  .tag {
    margin: 10px 10px 0 0;
  }
  .tree {
    min-height: 200px;
  }
  .tabs-list {
    position: relative;
    /deep/ .el-tabs__header {
      margin: 0;
    }
    .clear {
      position: absolute;
      right: 5px;
      top: 10px;
    }
  }
  .check {
    padding-bottom: 10px;
  }
  /deep/ .el-tabs__nav-wrap::after {
    height: 1px;
    background: #eeeff0;
  }
  /deep/ .el-checkbox {
    font-weight: 400;
    margin-right: 10px;
  }
  /deep/.el-tag--medium {
    height: 100%;
    line-height: 20px;
    white-space: normal;
  }
  /deep/.el-tree-node__content {
    height: 36px;
    border-bottom: 1px solid #eeeff0;
  }
  .boxborder {
    border-bottom: 1px solid #eeeff0;
  }
  .last {
    flex: 1;
  }
  /deep/.el-tree-node__children {
    margin-left: 40px;
    .el-tree-node__content {
      padding-left: 0 !important;
      border-bottom: 1px solid #eeeff0;
      .el-tree-node__expand-icon.is-leaf {
        display: none;
      }
    }
  }
}
</style>
