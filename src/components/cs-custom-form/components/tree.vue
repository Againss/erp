/**
 * @Description:树组件
 * @author Roman
 * @date 2020/5/20
*/
<template>
  <el-row class="setTreeClass">
    <el-col :span="treeOptions.span?treeOptions.span[0]:12">
      <el-row><div class="title">{{ treeOptions.treeSelectTitle }}</div></el-row>
      <el-row>
        <el-input
          v-if="needSearch"
          v-model="inputValue"
          placeholder="搜索"
          size="small"
          style="max-width: 500px"
          :suffix-icon="treeOptions.suffixIcon"
          :prefix-icon="treeOptions.prefixIcon"
        />
      </el-row>
      <div style="border-radius: 5px; margin-top: 10px;">
        <el-tree
          :key="JSON.stringify(treeOptions.data)"
          ref="tree"
          :data="treeData"
          :highlight-current="treeOptions.highlightCurrent"
          :load="loadNode"
          :empty-text="treeOptions.emptyText"
          :render-after-expand="treeOptions.renderAfterExpand"
          :lazy="treeOptions.lazy"
          :show-checkbox="treeOptions.showCheckbox"
          :max-length="treeOptions.maxLength"
          :node-key="id"
          :check-on-click-node="treeOptions.checkOnClickNode"
          :auto-expand-parent="treeOptions.autoExpandParent"
          :default-expanded-keys="treeOptions.defaultExpandedKeys"
          :props="treeOptions.props"
          :draggable="treeOptions.draggable"
          :allow-drag="treeOptions.allowDrag"
          :allow-drop="treeOptions.allowDrop"
          :default-checked-keys="checkedKeys"
          :default-expand-all="isExpandAll"
          :current-node-key="currentNodeKey"
          :expand-on-click-node="isExpandOnClickNode"
          :render-content="treeOptions.renderContent?treeOptions.renderContent:renderContent"
          :filter-node-method="treeOptions.filterNodeMethod?treeOptions.filterNodeMethod:filterNode"
          :accordion="treeOptions.accordion"
          :indent="treeOptions.indent"
          :icon-class="treeOptions.iconClass"
          :check-strictly="checkStrictly"
          @check="treeCheck"
          @node-click="nodeClick"
          @node-expand="nodeExpand"
          @node-collapse="nodeCollapse"
          @node-contextmenu="nodeCollapse"
          @check-change="checkChange"
          @current-change="currentChange"
          @node-drag-start="nodeDragStart"
          @node-drag-enter="nodeDragEnter"
          @node-drag-leave="nodeDragLeave"
          @node-drag-over="nodeDragOver"
          @node-drag-end="nodeDragEnd"
          @node-drop="nodeDrop"
        />
      </div>
    </el-col>
    <el-col v-if="!treeOptions.selectedHidden" :span="treeOptions.span?treeOptions.span[0]:12" style="padding-left: 20px">
      <el-row><div class="title">{{ treeOptions.treeSelectedTitle }}</div></el-row>
      <el-row style="line-height: 22px">
        <el-col v-for="(item,index) in checkedNodes" :key="index">
          <el-tag class="selectedtag" :closable="!item.disabled" @close="closeHandle(item)">
            <span v-if="treeOptions.checkedTagsRenderContent" v-html="treeOptions.checkedTagsRenderContent(item)" />
            <span v-else :title="checkedTagsRenderContent(item)">{{ checkedTagsRenderContent(item) }}</span>
          </el-tag>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script type="text/jsx">
import pinyinUtil from 'pinyinUtil'
export default {
  name: 'Tree',
  components: {

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
      type: [Array],
      default: () => []
    },
    change: {
      type: Function
    }
  },
  data() {
    return {
      currentNodeKey: '',
      checkedNodes: [],
      checkedKeys: [],
      inputValue: '',
      matchIdList: []
    }
  },
  computed: {
    needSearch() {
      return Object.prototype.toString.call(this.treeOptions.needSearch) !== '[object Undefined]' ? this.treeOptions.needSearch : true
    },
    treeData() {
      const value = this.treeOptions.data || []
      this.getTreeData(value)
      return value
    },
    domScript() {
      return this.treeOptions.domScript
    },
    depend() {
      return Object.prototype.toString.call(this.treeOptions.depend) !== '[object Undefined]' ? this.treeOptions.depend : true
    },
    checkNeedParent() {
      return Object.prototype.toString.call(this.treeOptions.checkNeedParent) !== '[object Undefined]' ? this.treeOptions.checkNeedParent : true
    },
    isExpandOnClickNode() {
      return Object.prototype.toString.call(this.treeOptions.expandOnClickNode) !== '[object Undefined]' ? this.treeOptions.expandOnClickNode : false
    },
    isExpandAll() {
      return Object.prototype.toString.call(this.treeOptions.defaultExpandAll) !== '[object Undefined]' ? this.treeOptions.defaultExpandAll : true
    },
    checkStrictly() {
      return Object.prototype.toString.call(this.treeOptions.checkStrictly) !== '[object Undefined]' ? this.treeOptions.checkStrictly : true
    },
    searchNeedChild() {
      return Object.prototype.toString.call(this.treeOptions.searchNeedChild) !== '[object Undefined]' ? this.treeOptions.searchNeedChild : true
    },
    treeOptions() {
      return this.options.treeOptions ? this.options.treeOptions : {}
    },
    searchValue() {
      return this.treeOptions.searchValue
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
    parentId() {
      let parentId = 'parentId'
      if (this.treeOptions.props) {
        parentId = this.treeOptions.props.parentId || 'parentId'
      }
      return parentId
    },
    id() {
      return this.treeOptions.nodeKey || 'id'
    }
  },
  watch: {
    value: {
      handler(value) {
        if (Object.prototype.toString.call(value) !== '[object Array]') {
          throw new Error('树组件的参数为数组,当前传参为:' + value)
        }
        if (value.length === 1 && Object.prototype.toString.call(value[0]) === '[object Undefined]') {
          this.inputValue = undefined
        }
        if (value && Object.prototype.toString.call(value) === '[object Array]') {
          let newValue = value.filter(v => { if (v) { return true } })
          if (newValue[0] && typeof newValue[0] !== 'object') {
            newValue = this.filterCheckedNoders(this.treeOptions.data, newValue)
          }
          const keys = []; const labels = []
          newValue.forEach(v => {
            if (v) {
              keys.push(v[this.id])
              // labels.push(v[this.label])
            }
          })
          if (!this.treeOptions.showCheckbox) {
            this.$nextTick(() => {
              this.$refs.tree.setCurrentKey(keys[0])
            })
            this.currentNodeKey = keys[0]
          } else {
            this.$nextTick(() => {
              this.$refs.tree.setCheckedKeys(keys)
            })
            this.checkedKeys = keys
          }
          this.checkedNodes = newValue
          newValue.forEach(v => {
            const label = this.checkedTagsRenderContent(v)
            labels.push(label)
          })
          let checkedLabels = ''
          if (this.options.viewContent) {
            checkedLabels = labels
          } else {
            checkedLabels = this.options.type === 'textarea' ? labels.join('\n') : labels.join(',')
          }
          this.$emit('setCheckedLabels', checkedLabels)
        }
      },
      deep: true,
      immediate: true
    },
    inputValue: {
      handler(val) {
        this.$nextTick(() => {
          const list = this.filterId(this.treeOptions.data, val)
          this.matchIdList = list
          this.$refs.tree.filter(val)
        })
      },
      deep: true,
      immediate: true
    },
    searchValue: {
      handler(val) {
        this.inputValue = val
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.changeTreeClass()
    this.hiddenCheckBox()
    this.domScript && this.domScript()
  },
  updated() {
    this.changeTreeClass()
    this.hiddenCheckBox()
    this.domScript && this.domScript()
  },
  methods: {
    getTreeData(data) {
      data.forEach(v => {
        v._py = pinyinUtil.getFirstLetter(v[this.label])
        if (v[this.children]) {
          this.getTreeData(v[this.children])
        }
      })
    },
    loadNode(node, resolve) {
      if (node.level === 0) {
        return resolve(this.treeData)
      }
      if (node.level > 0 && node.data[this.children]) {
        return resolve(node.data[this.children])
      } else {
        return resolve([])
      }
    },
    filterId(orgin, value, list = []) {
      orgin.forEach(v => {
        let isEn = false
        let sign = false
        if (/^[A-Za-z0-9]*$/.test(value)) {
          isEn = true
        }
        const reg = new RegExp(value, 'i')
        if (isEn) {
          sign = !!v._py.match(reg)
        } else {
          sign = !!v[this.label].match(reg)
        }
        if (sign) {
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
    },
    filterNode(value, data) {
      if (!value) return true
      if (this.searchNeedChild) {
        if (this.matchIdList.includes(data[this.id])) {
          return true
        }
      } else {
        let isEn = false
        if (/^[A-Za-z0-9]*$/.test(value)) {
          isEn = true
        }
        const reg = new RegExp(value, 'i')
        if (isEn) {
          return data._py.match(reg)
        } else {
          return data[this.label].match(reg)
        }
      }
    },
    nodeClick(data, node) {
      if (!this.treeOptions.showCheckbox) {
        this.change([data[this.id]])
      } else {
        // const isChecked = node.checked
        // this.$refs.tree.setChecked(data[this.id], !isChecked)
        // this.treeCheck(data)
      }
    },
    closeHandle(item) {
      this.unSelectChild(item, false)
      const keys = this.$refs.tree.getCheckedKeys(!this.checkStrictly)
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
      const selected = datas.checkedKeys.indexOf(data[this.id])
      // const checkedKeys = this.$refs.tree.getCheckedKeys(!this.checkStrictly)
      // const selected = checkedKeys.indexOf(data[this.id])
      if (selected !== -1) {
        this.depend && this.checkNeedParent && this.selectedParent(data)
        if (this.treeOptions.checkNeedChild) {
          this.unSelectChild(data, true)
        }
      } else {
        this.depend && this.unSelectChild(data, false)
      }
      const keys = this.$refs.tree.getCheckedKeys(!this.checkStrictly)
      if (this.treeOptions.maxLength) {
        keys.splice(this.treeOptions.maxLength, keys.length)
      }
      this.change(keys)
    },
    unSelectChild(treeList, isSelected) {
      this.$refs.tree.setChecked(treeList[this.id], isSelected)
      if (treeList[this.children] && this.depend) {
        for (let i = 0; i < treeList[this.children].length; i++) {
          this.unSelectChild(treeList[this.children][i], isSelected)
        }
      }
    },
    selectedParent(currentObj) {
      const currentNode = this.$refs.tree.getNode(currentObj)
      if (currentNode.parent.key !== undefined) {
        this.$refs.tree.setChecked(currentNode.parent, true)
        this.selectedParent(currentNode.parent)
      }
    },
    changeTreeClass() {
      const domList = document.getElementsByClassName('custom-row-layout')
      Array.from(domList).forEach(v => {
        v.parentNode.style.float = 'left'
      })
    },
    hiddenCheckBox() {
      const domList = document.getElementsByClassName('hidden-checkBox')
      Array.from(domList).forEach(v => {
        v.parentNode.querySelector('.el-checkbox').style.display = 'none'
      })
    },
    renderContent(h, { node, data, store }) {
      const label = this.label
      if (data.isLayout) {
        return (
          <span class='custom-row-layout'>
            {data[label]}
          </span>
        )
      }
      if (data.hiddenCheckBox) {
        return (
          <span class='hidden-checkBox'>
            {data[label]}
          </span>
        )
      }
      // if (data.type === 'M') {
      //   return (
      //     <span>
      //       <span>
      //         {data[label]}
      //       </span>
      //       <el-checkbox class='encrypt' true-label={'1'} false-label={'2'} on-change={ (value, event) => this.encrypt(node, data, store, value, event) }>click</el-checkbox>
      //     </span>
      //   )
      // }
      return (
        <span>{data[label]}</span>
      )
    },
    bindParentLabel(array, item, newArray = []) {
      const id = this.id
      const label = this.label
      const parentId = item[this.parentId]
      for (let i = 0; i < array.length; i++) {
        if (array[i][id] === parentId) {
          newArray.push(array[i][label])
          this.bindParentLabel(this.treeData, array[i], newArray)
          break
        } else if (array[i].child) {
          this.bindParentLabel(array[i].child, item, newArray)
        }
      }
    },
    checkedTagsRenderContent(item) {
      if (this.treeOptions.bindParentTags) {
        const arr = [item.name]
        this.bindParentLabel(this.treeData, item, arr)
        return arr.reverse().join('-')
      } else {
        return item[this.label]
      }
    },
    nodeExpand(data, Node, component) {
      this.updatePopper(data, Node, component)
      this.treeOptions.nodeExpand && this.treeOptions.nodeExpand(data, Node, component)
    },
    updatePopper(data, Node, component) {
      if (!this.isExpandAll) {
        // console.log(Node)
        const len = Node.childNodes && Node.childNodes.length > 500 ? Node.childNodes.length : 500
        this.$nextTick(() => {
          setTimeout(() => {
            this.$emit('updatePopper')
          }, len)
        })
      }
    },
    encrypt(data, Node, component, value, event) {
      // console.log(data, Node, component, value, event)
    },
    nodeCollapse(data, Node, component) {
      this.updatePopper(data, Node, component)
      this.treeOptions.nodeCollapse && this.treeOptions.nodeCollapse(data, Node, component)
    },
    checkChange(data, ischecked, childrenIsChecked) {
      this.treeOptions.checkChange && this.treeOptions.checkChange(data, ischecked, childrenIsChecked)
    },
    currentChange(data, node) {
      this.treeOptions.checkChange && this.treeOptions.checkChange(data, node)
    },
    nodeDragStart(Node, event) {
      this.treeOptions.checkChange && this.treeOptions.checkChange(Node, event)
    },
    nodeDragEnter(Node, enterNode, event) {
      this.treeOptions.checkChange && this.treeOptions.checkChange(Node, enterNode, event)
    },
    nodeDragLeave(Node, leaveNode, event) {
      this.treeOptions.checkChange && this.treeOptions.checkChange(Node, leaveNode, event)
    },
    nodeDragOver(Node, enterNode, event) {
      this.treeOptions.checkChange && this.treeOptions.checkChange(Node, enterNode, event)
    },
    nodeDragEnd(Node, stopEnterNode, position, event) {
      this.treeOptions.checkChange && this.treeOptions.checkChange(Node, stopEnterNode, position, event)
    },
    nodeDrop(Node, stopEnterNode, position, event) {
      this.treeOptions.checkChange && this.treeOptions.checkChange(Node, stopEnterNode, position, event)
    }
  }
}
</script>

<style lang="scss">
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
.setTreeClass .title{line-height: 14px; margin-bottom: 15px}
.selectedInput input{white-space: nowrap;text-overflow: ellipsis;overflow: hidden;}

.setTreeClass .el-checkbox.encrypt{ margin-left: 8px}
.setTreeClass .el-checkbox.encrypt .el-checkbox__label{ padding-left: 8px}
</style>
