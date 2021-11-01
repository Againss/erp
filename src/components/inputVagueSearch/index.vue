<template>
  <el-form ref="form" :model="ruleForm" class="inputVagueSearch" :rules="rules" label-width="auto" :inline="true">
    <el-form-item :label="options.label||'默认框: '" :prop="options.prop">
      <el-popover
        ref="popover"
        v-model="visible"
        :placement="popoverOptions.placement||'bottom'"
        :title="popoverOptions.title"
        :width="popoverOptions.width||200"
        :trigger="popoverOptions.trigger||'click'"
        popper-class=""
        @show="showDatas"
        @hide="clearInputValue"
      >
        <div class="vagueContent customScrollbar" @scroll="popScroll">
          <el-input ref="vagueSearch" v-model="searchValue" suffix-icon="el-icon-search" style="margin-bottom: 10px;" @input="searchVagueValue" />
          <div>
            <div v-if="!copyCheckboxGroup.length" class="noDataAvailable">暂无数据</div>
            <template v-else>
              <div style="text-align: center; color: #ccc;">共搜索到{{ copyCheckboxGroup.length }}条数据</div>
              <!-- <div
                v-infinite-scroll="load"
                infinite-scroll-disabled="disabled"
                style="overflow:auto"
              > -->
              <div v-for="(item, index) in renderedData" :key="index" suffix-icon="el-icon-date" class="rowStyle" :class="{ 'actived':Array.isArray(selected) ? selected.map(val => val.id).includes(item.id) : selected.id === item.id}" @click="triggerSelected(item)">{{ item[label] }}<i :class="{'el-icon-check': Array.isArray(selected) ? selected.map(val => val.id).includes(item.id) : selected.id === item.id}" /></div>
              <div v-if="copyCheckboxGroup.length>20" ref="poll">
                <p v-if="loading" class="lazyText">加载中...</p>
                <p v-else class="lazyText">没有更多了</p>
              </div>
              <!-- </div>
              <p v-if="loading" style="text-align: center; margin: 0;">加载中...</p>
              <p v-if="noMore" style="text-align: center; margin: 0;">没有更多了</p>
              <div class="infinite-list-wrapper" style="overflow:auto">
                <ul
                  v-infinite-scroll="load"
                  class="list"
                  infinite-scroll-disabled="disabled"
                >
                  <li v-for="i in count" :key="i" class="list-item">{{ i }}</li>
                </ul>
                <p v-if="loading">加载中...</p>
                <p v-if="noMore">没有更多了</p>
              </div> -->
            </template>
          </div>
        </div>
        <div slot="reference" class="reference" :class="{iconRotate:visible}">
          <el-input
            ref="reference"
            v-model="ruleForm[options.prop]"
            :suffix-icon="inputIcon"
            style="pointer-events: auto;"
            class="selectedInput"
            :type="options.type||'input'"
            :placeholder="options.multiple ? selected.length === 0 ? options.placeholder || '请选择' : '' : options.placeholder || '请选择'"
            :autosize="options.autosize"
            :rows="options.rows"
            :readonly="true"
            :clearable="true"
          />
          <!-- 多选 -->
          <span
            v-if="options.multiple"
            ref="tags"
            class="el-select__tags multipleTags"
            :style="{ width: '90%' }"
          >
            <!-- 多选时是否将选中值按文字的形式展示 -->
            <span v-if="options.collapseTags && selected.length" style="padding-left:5px">
              <el-tag
                :closable="true"
                :size="collapseTagSize"
                :hit="selected[0].hitState"
                type="info"
                disable-transitions
                @close="deleteTag($event, selected[0])"
              >
                <span class="el-select__tags-text">{{ selected[0][label] }}</span>
              </el-tag>
              <el-tag
                v-if="selected.length > 1"
                :closable="false"
                :size="collapseTagSize"
                type="info"
                disable-transitions
              >
                <span class="el-select__tags-text">+ {{ selected.length - 1 }}</span>
              </el-tag>
            </span>
            <!-- 多选, 多个 el-tag 组成 -->
            <transition-group v-if="!options.collapseTags" @after-leave="resetInputHeight">
              <el-tag
                v-for="item in selected"
                :key="item.id"
                style="margin: 2px 0px 2px 5px"
                :closable="true"
                :size="collapseTagSize"
                :hit="item.hitState"
                type="info"
                disable-transitions
                @close="deleteTag($event, item)"
              >
                <span class="el-select__tags-text">{{ item[label] }}</span>
              </el-tag>
            </transition-group>
          </span>
        </div>
      </el-popover>
    </el-form-item>
    <el-form-item>
      <el-button v-if="!options.submitHidden" :style="options.style" type="primary" native-type="submit" @click.prevent="submitForm">{{ options.submitText||'提交' }}</el-button>
      <el-button v-if="!options.resetHidden" :style="options.style" @click="resetForm">{{ options.resetText||'重置' }}</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  props: {
    options: {
      type: Object,
      default: () => {
        // return {}
      }
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
      searchValue: '',
      // selectedLabel: '',
      visible: false,
      inputIcon: 'el-icon-arrow-down',
      copyCheckboxGroup: [],
      renderedData: [],
      checkList: [],
      inputWidth: 0,
      selected: this.options.multiple ? [] : {},
      popoverTop: null,
      tagsClientHeight: null,
      timer: null,
      ruleForm: {},
      rules: {},
      loading: true,
      count: 10,
      currentPage: 1,
      pageSize: 20,
      prevY: 0
    }
  },
  computed: {
    popoverOptions() {
      return this.options.popoverOptions ? this.options.popoverOptions : {}
    },
    dataSource() {
      return this.options.dataSource ? this.options.dataSource : {}
    },
    collapseTagSize() {
      return ['small', 'mini'].indexOf(this.selectSize) > -1
        ? 'mini'
        : 'small'
    },
    label() {
      return this.options.props.label || 'label'
    }
    // disabled() {
    //   return this.loading || this.noMore
    // }
  },
  watch: {
    formDatas: {
      handler(val, oldVal) {
        val && this.setRuleForm(val)
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    setRuleForm(val) {
      this.ruleForm = { ...this.ruleForm, ...val }
    },
    // 模糊搜索
    searchVagueValue() {
      this.currentPage = 1
      this.prevY = 0
      this.loading = false
      if (this.options.longRangeSearch) {
        // console.log(111)
        if (!this.timer) {
          this.timer = setTimeout(() => {
            this.shakeProofSearch()
          }, 500)
        }
      } else {
        console.log(this.dataSource[0].name, this.label)
        this.copyCheckboxGroup = this.dataSource.filter(item => item[this.label].includes(this.searchValue))
        this.renderedData = this.copyCheckboxGroup.slice(0, this.pageSize * this.currentPage)
      }

      // console.log(this.searchValue, this.copyCheckboxGroup)
    },
    // 防抖搜索
    shakeProofSearch() {
      if (this.searchValue !== '') {
        this.copyCheckboxGroup = this.dataSource.filter(item => item[this.label].includes(this.searchValue))
        this.renderedData = this.copyCheckboxGroup.slice(0, this.pageSize * this.currentPage)
      } else {
        this.copyCheckboxGroup = []
      }
      clearTimeout(this.timer)
      console.log(123)
      this.timer = null
    },
    // 显示pop框操作
    showDatas() {
      this.searchVagueValue()
      this.popoverTop = this.$refs.popover.$refs.popper.style.top
      this.tagsClientHeight = this.$refs.tags && this.$refs.tags.clientHeight
    },
    // 隐藏时清空搜索框
    clearInputValue() {
      this.searchValue = ''
      // this.searchVagueValue()
    },
    // 点击切换
    triggerSelected(item) {
      if (!this.options.multiple) {
        this.ruleForm[this.options.prop] = item[this.label]
        // this.$set(this.ruleForm, 'selectedLabel', item.label)
        this.selected = item
        this.visible = false
        // console.log(this.selected)
      } else {
        let index = -1
        this.selected.some((val, i) => {
          if (val.id === item.id) {
            index = i
          }
        })
        // console.log('index', index)
        if (index > -1) {
          this.selected.splice(index, 1)
        } else {
          this.selected.push(item)
        }
        // 多选重置input高度
        this.resetInputHeight()
      }
    },
    // tag 标签的删除事件
    deleteTag(event, tags) {
      this.selected = this.selected.filter(item => item.id !== tags.id)
      event.stopPropagation()
    },
    // input框高度重置
    resetInputHeight() {
      if (this.options.collapseTags) return
      this.$nextTick(() => {
        // if (!this.$refs.reference) return
        const inputChildNodes = this.$refs.reference.$el.childNodes
        const input = [].filter.call(inputChildNodes, item => item.tagName === 'INPUT')[0]
        const tags = this.$refs.tags
        const popover = this.$refs.popover.$refs
        const popoverTop = parseInt(this.popoverTop)
        // console.log('111', popoverTop, tags.clientHeight, this.tagsClientHeight)
        const sizeInMap = this.initialInputHeight || 36
        input.style.height = this.selected.length === 0
          ? sizeInMap + 'px'
          : Math.max(
            tags ? (tags.clientHeight + (tags.clientHeight > sizeInMap ? 6 : 0)) : 0,
            sizeInMap
          ) + 'px'
        popover.popper.style.top = this.selected.length === 0 ? popoverTop + tags.clientHeight - this.tagsClientHeight - (this.tagsClientHeight === 0 ? 28 : 0) + (this.selected.length === 0 ? 28 : 0) : popoverTop + tags.clientHeight - this.tagsClientHeight - (this.tagsClientHeight === 0 ? 28 : 0) + 'px'
      })
    },
    // 表单提交按钮点击事件
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.options.submitHandle && this.options.submitHandle(this.selected)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 重置表单
    resetForm() {
      this.options.multiple ? this.selected = [] : this.selected = {}
      this.$refs.form.resetFields()
      this.options.resetHandle && this.options.resetHandle()
    },
    // 滚动事件
    popScroll() {
      const getData = this.debounce(this.scrollAndLoading, 300)
      getData()
    },
    // 滚动加载
    scrollAndLoading() {
      // console.log(111)
      // console.log(document.querySelector('.vagueContent').scrollTop)
      const content = document.querySelector('.vagueContent')
      if (content.scrollTop > this.prevY) { // 判断用户是否向下滚动
        this.prevY = content.scrollTop
        console.log(content.scrollHeight, content.scrollTop, content.clientHeight)
        // console.log(111)
        const condition = content.scrollHeight - content.scrollTop <= content.clientHeight + 14
        if (condition) {
          this.currentPage++
          this.setList(this.copyCheckboxGroup.slice(this.pageSize * (this.currentPage - 1), this.pageSize * this.currentPage))
        }
      }
    },
    // 数据传入
    setList(data) {
      console.log(data)
      if (data.length === 0) {
        this.loading = false
      } else {
        this.renderedData = [... this.renderedData, ...data]
      }
    },
    // 一个简单的防抖函数
    debounce(fn, time) {
      return function(args) {
        const that = this
        clearTimeout(fn.tid)
        fn.tid = setTimeout(() => {
          fn.call(that, args)
        }, time)
      }
    }
    // 懒加载
    // load() {
    //   console.log(111)
    //   this.loading = true
    //   setTimeout(() => {
    //     this.count += 2
    //     this.loading = false
    //   }, 2000)
    // }
  }
}
</script>

<style lang='scss'>
.inputVagueSearch {
  .selectedInput {
    // width: 189px;
    width: 100%;
  }
  .noDataAvailable {
    text-align: center;
  }
}
.rowStyle {
  display: block;
  cursor: pointer;
  padding: 6px 5px;
}
.rowStyle:hover {
  background-color: #F5F7FA;
}
.rowStyle.actived {
  color: #1890ff;
  font-weight: 700;
}
.rowStyle i {
  font-weight: 700;
  font-size: 14px;
  float: right;
}
.vagueContent {
  max-height: 320px;
  overflow: auto;
  .noDataAvailable {
    text-align: center;
  }
}
.multipleTags {
  // padding: 5px;
  .el-tag {
    // margin-left: 5px;
  }
}
.reference {
  width: 189px;
  position: relative;
}
.reference.iconRotate .el-input__icon {
  transform: rotate(180deg);
}
.lazyText {
  margin: 0;
  text-align: center;
}
</style>
