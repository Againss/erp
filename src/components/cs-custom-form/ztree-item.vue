/**
 * @Description:ztree树单元格
 * @author Roman
 * @date 2020/5/20
*/
<template>
  <el-popover
    v-if="isPopTree"
    :popper-class="popoverOptions.popperClass"
    :placement="popoverOptions.placement||'left'"
    :title="popoverOptions.title"
    :width="popoverOptions.width||800"
    :trigger="popoverOptions.trigger||'click'"
  >
    <div class="popclass">
      <el-row class="setTreeClass">
        <el-col :span="treeOptions.span?treeOptions.span[0]:12">
          <el-row><div class="title">{{ treeOptions.treeSelectTitle }}</div></el-row>
          <el-row>
            <el-input v-model="inputValue" placeholder="搜索" style="max-width: 500px" @input="filterHandle" />
          </el-row>
          <div style="border-radius: 5px; margin-top: 10px;">
            <el-tree
              ref="tree"
              :data="treeData"
              :show-checkbox="treeOptions.showCheckbox"
              :node-key="id"
              :props="treeOptions.props"
              :default-checked-keys="checkedKeys"
              :default-expand-all="isExpandAll"
              :current-node-key="currentNodeKey"
              :expand-on-click-node="isExpandOnClickNode"
              :render-content="treeOptions.renderContent?treeOptions.renderContent:renderContent"
              :filter-node-method="filterNode"
              @check="treeCheck"
              @node-click="nodeClick"
            />
          </div>
        </el-col>
        <el-col v-if="!treeOptions.selectedHidden" :span="treeOptions.span?treeOptions.span[0]:12" style="padding-left: 20px">
          <el-row><div class="title">{{ treeOptions.treeSelectedTitle }}</div></el-row>
          <el-row>
            <el-col v-for="(item,index) in checkedNodes" :key="index">
              <el-tag class="selectedtag" :closable="!item.disabled" @close="closeHandle(item,index)">
                <span v-if="treeOptions.checkedTagsRenderContent" v-html="treeOptions.checkedTagsRenderContent(item)" />
                <span v-else :title="checkedTagsRenderContent(item)">{{ checkedTagsRenderContent(item) }}</span>
              </el-tag>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
    <el-input
      slot="reference"
      class="selectedInput"
      :type="options.type||'input'"
      :value="checkedLabels"
      :placeholder="options.placeholder"
      :rows="options.rows"
      :readonly="true"
    />
  </el-popover>
  <el-row v-else class="setTreeClass">
    <el-col :span="treeOptions.span?treeOptions.span[0]:12">
      <el-row><div class="title">{{ treeOptions.treeSelectTitle }}</div></el-row>
      <el-row>
        <el-input v-model="inputValue" placeholder="搜索" style="max-width: 500px" />
      </el-row>
      <div style="border-radius: 5px; margin-top: 10px;">
        <tree ref="ztree" :nodes="nodes" :setting="setting" :view="view" @onCheck="onCheck" @onCreated="handleCreated" />
        <!--        <el-tree-->
        <!--          ref="tree"-->
        <!--          :data="treeData"-->
        <!--          :show-checkbox="treeOptions.showCheckbox"-->
        <!--          :node-key="id"-->
        <!--          :props="treeOptions.props"-->
        <!--          :default-checked-keys="checkedKeys"-->
        <!--          :default-expand-all="isExpandAll"-->
        <!--          :current-node-key="currentNodeKey"-->
        <!--          :expand-on-click-node="isExpandOnClickNode"-->
        <!--          :render-content="treeOptions.renderContent?treeOptions.renderContent:renderContent"-->
        <!--          :filter-node-method="filterNode"-->
        <!--          @check="treeCheck"-->
        <!--          @node-click="nodeClick"-->
        <!--        />-->
      </div>
    </el-col>
    <el-col v-if="!treeOptions.selectedHidden" :span="treeOptions.span?treeOptions.span[1]:12" style="padding-left: 20px">
      <el-row><div class="title">{{ treeOptions.treeSelectedTitle }}</div></el-row>
      <el-row style="line-height: 25px">
        <el-col v-for="(item,index) in checkedNodes" :key="index">
          <el-tag class="selectedtag" :closable="!item.disabled" @close="closeHandle(item,index)">
            <span v-if="treeOptions.checkedTagsRenderContent" v-html="treeOptions.checkedTagsRenderContent(item)" />
            <span v-else :title="checkedTagsRenderContent(item)">{{ checkedTagsRenderContent(item) }}</span>
          </el-tag>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import tree from 'vue-giant-tree'
export default {
  name: 'ZtreeItem',
  components: {
    tree
  },
  inheritAttrs: false,
  props: {
    options: {
      type: Object
    },
    formDatas: {
      type: Object
    },
    value: {
      type: [Array, String, Number, Object],
      default: () => []
    },
    change: {
      type: Function
    }
  },
  data() {
    return {
      checkedLabels: '',
      currentNodeKey: '',
      checkedNodes: [],
      checkedKeys: [],
      inputValue: '',
      matchIdList: [],
      ztreeObj: null,
      view: {
        filter: true,
        expandLevel: 0, // 展开层级
        showFilterChildren: true, // 是否显示过滤数据孩子节点
        showFilterParent: true, // 是否显示过滤数据父节点
        showLine: false
      },
      setting: {
        check: {
          enable: true
        },
        data: {
          key: {
            children: 'child',
            name: 'name'
          }
        }
      },
      nodes: [
        {
          id: 1,
          name: '一级 1',
          checked: true,
          child: [
            {
              id: 4,
              name: '二级 1-1',
              checked: true,
              child: [
                {
                  id: 9,
                  name: '三级 1-1-1',
                  child: [
                    {
                      id: 12,
                      name: '三级 1-1-1-1',
                      isLayout: true
                    },
                    {
                      id: 13,
                      name: '三级 1-1-1-2',
                      isLayout: true
                    }
                  ]
                },
                {
                  id: 10,
                  name: '三级 1-1-2'
                },
                {
                  id: 11,
                  name: '三级 1-1-3'
                }
              ]
            }
          ]
        },
        {
          id: 2,
          name: '一级 2',
          child: [
            {
              id: 5,
              name: '二级 2-1',
              isLayout: true
            },
            {
              id: 6,
              name: '二级 2-2',
              isLayout: true
            }
          ]
        },
        {
          id: 3,
          name: '一级 3',
          child: [
            {
              id: 7,
              name: '二级 3-1',
              isLayout: true
            },
            {
              id: 8,
              name: '二级 3-2',
              isLayout: true
            }
          ]
        }
      ]
    }
  },
  computed: {
    treeData() {
      return this.treeOptions.data
    },
    isExpandOnClickNode() {
      return Object.prototype.toString.call(this.treeOptions.expandOnClickNode) !== '[object Undefined]' ? this.treeOptions.expandOnClickNode : true
    },
    isExpandAll() {
      return Object.prototype.toString.call(this.treeOptions.defaultExpandAll) !== '[object Undefined]' ? this.treeOptions.defaultExpandAll : true
    },
    isPopTree() {
      return Object.prototype.toString.call(this.treeOptions.isPopTree) !== '[object Undefined]' ? this.treeOptions.isPopTree : true
    },
    getValue() {
      return this.checkedNodes.map(v => { return v[this.label] }).join(',')
    },
    treeOptions() {
      return this.options.treeOptions ? this.options.treeOptions : {}
    },
    popoverOptions() {
      return this.options.popoverOptions ? this.options.popoverOptions : {}
    },
    children() {
      let children = 'children'
      if (this.treeOptions.props) {
        children = this.treeOptions.props.children || 'children'
      }
      return children
    },
    label() {
      let label = 'label'
      if (this.treeOptions.props) {
        label = this.treeOptions.props.label || 'label'
      }
      return label
    },
    id() {
      return this.treeOptions.nodeKey || 'id'
    }
  },
  watch: {
    value: {
      handler(value) {
        this.checkedKeys = value
        const newNodes = this.$utils.deepClone(this.nodes)
        const { allNodes, checkedNodes } = this.filterCheckNodes(newNodes, value)
        this.nodes = allNodes
        this.checkedNodes = checkedNodes
      },
      deep: true,
      immediate: true
    },
    inputValue(val) {
      const list = this.filterId(this.nodes, val)
      this.matchIdList = list
      // this.$refs.tree.filter(val)
      this.filterHandle()
    }
  },
  mounted() {
    this.changeTreeClass()
  },
  updated() {
    this.changeTreeClass()
  },
  methods: {
    filter(node) {
      if (this.matchIdList.indexOf(node[this.id]) !== -1) {
        return true
      }
    },
    filterHandle() {
      const nodes = this.ztreeObj.getNodesByFilter(this.filter) // 查找节点集合
      console.log(nodes)
      // this.nodes = nodes
      // this.ztreeObj.showNodes(nodes)
    },
    handleCreated(ztreeObj) {
      this.ztreeObj = ztreeObj
    },
    // expandNodes(nodes, list) {
    //   nodes.forEach(v => {
    //     if (list.includes(v[this.id])) {
    //       this.ztreeObj.expandNode(v, true, true, true)
    //     }
    //   })
    // },
    filterCheckNodes(nodes, list, arr = []) {
      for (let i = 0; i < nodes.length; i++) {
        const v = nodes[i]
        if (list.includes(v[this.id])) {
          v.checked = true
          arr.push(v)
        } else {
          v.checked = false
        }
        v.open = true
        if (v[this.children] && v[this.children].length) {
          this.filterCheckNodes(v[this.children], list, arr)
        }
      }
      return { allNodes: nodes, checkedNodes: arr }
    },
    onCheck: function(evt, treeId, treeNode) {
      // 选中事件
      const checkedNodes = this.ztreeObj.getCheckedNodes()
      const keys = checkedNodes.map(v => v[this.id])
      this.change(keys)
    },
    filterId(orgin, value, list = []) {
      orgin.forEach(v => {
        if (v[this.label].indexOf(value) !== -1) {
          if (v[this.children] && v[this.children].length) {
            this.filterIds(v[this.children], list)
          }
          list.push(v[this.id])
        }
        if (v[this.children] && v[this.children].length) {
          this.filterId(v[this.children], value, list)
        }
      })
      return list
    },
    filterIds(orgin, list = []) {
      orgin.forEach(v => {
        if (v[this.children] && v[this.children].length) {
          this.filterIds(v[this.children], list)
        } else {
          list.push(v[this.id])
        }
      })
      // return list
    },
    filterNode(value, data) {
      if (!value) return true
      if (this.matchIdList.indexOf(data[this.id]) !== -1) {
        return true
      }
    },
    nodeClick(data) {
      if (!this.treeOptions.showCheckbox) {
        this.change([data])
      }
    },
    closeHandle(item, index) {
      const id = this.id
      var node = this.ztreeObj.getNodeByParam(id, item[this.id], null)
      this.ztreeObj.checkNode(node, false, true)
      const selectedNodes = this.ztreeObj.getCheckedNodes()
      const keys = selectedNodes.map(v => v[this.id])
      this.change(keys)
    },
    filterNoders(nodes, item, obj = {}) {
      for (let i = 0; i < nodes.length; i++) {
        const v = nodes[i]
        if (v[this.id] !== item[this.id]) {
          if (v[this.children]) {
            this.filterNoders(v[this.children], item, obj)
          } else {
            obj[v[this.id]] = v
          }
        }
      }
      return Object.values(obj)
    },
    filterChildNoders(nodes, obj = {}) {
      for (let i = 0; i < nodes.length; i++) {
        const v = nodes[i]
        if (v[this.children]) {
          this.filterChildNoders(v[this.children], obj)
        } else {
          obj[v[this.id]] = v
        }
      }
      return Object.values(obj)
    },
    filterCheckedNoders(orgin, target, arrays = []) {
      orgin.forEach(v => {
        if (target.indexOf(v[this.id]) > -1) {
          arrays.push(v)
        }
        if (v[this.children] && v[this.children].length) {
          this.filterCheckedNoders(v[this.children], target, arrays)
        }
      })
      return arrays
    },
    treeCheck(data, datas) {
      const nodes = this.filterChildNoders(datas.checkedNodes)
      // const nodes = [...datas.checkedNodes, ...datas.halfCheckedNodes]
      this.change(nodes)
    },
    changeTreeClass() {
      const classDomList = document.getElementsByClassName('custom-row')
      Array.from(classDomList).forEach(v => {
        v.parentNode.style.float = 'left'
      })
    },
    renderContent(h, { node, data, store }) {
      const label = this.label
      if (data.isLayout) {
        return (
          <span class='custom-row'>
            {data[label]}
          </span>
        )
      }
      return (
        <span>{data[label]}</span>
      )
    },
    checkedTagsRenderContent(item) {
      return item[this.label]
    }
  }
}
</script>

<style lang="scss">
.popclass{
    max-height: calc(100vh - 65px);
    overflow-y: auto;
}
.setTreeClass .el-tag{
        width: 100%;
    position: relative;
    }
.setTreeClass .el-tag__close.el-icon-close{
    position: absolute;
    right: 10px;
    top: 15%;
}
.setTreeClass .selectedtag{white-space:nowrap;text-overflow:ellipsis;overflow: hidden;}
.setTreeClass .title{line-height: 35px}
.selectedInput input{white-space: nowrap;text-overflow: ellipsis;overflow: hidden;}
</style>
