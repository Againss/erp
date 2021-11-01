<!--
 * @Author: Sanmao
 * @Date: 2020-09-27 10:49:50
 * @LastEditors: zhengjin
 * @LastEditTime: 2021-07-12 14:34:31
 * @Descripttion: 下拉分页搜索组件
 使用方式(其他参数看Props):
  1、多选
    data(){
        return {
          value:[]
        }
    }
    <div id="multipleSelect" style="width:200px">
        <select-search
            selectEle="multipleSelect"
            searchValue="code_in"
            apiUrl="product-stock-in"
            optionsValue="name"
            :selectValue="value"
            :multiple="true"
            @changeSelectVal="changeSelectVal"
        ></select-search>
    </div>
    methods:{
        changeSelectVal(data){
            this.value = [];
            data.multipleData.forEach((element) => {
                this.value.push(element.name);
            });
        }
    }
  2、单选
    data(){
        return {
          value:''
        }
    }
    <div id="selectBox" style="width:200px">
        <select-search
            selectEle="selectBox"
            searchValue="code_in"
            apiUrl="product-stock-in"
            valueKey="code"
            :selectValue="value"
            @changeSelectVal="changeSelectVal"
        ></select-search>
    </div>
    methods:{
        changeSelectVal(data){
            this.value = data.data;
        }
    }
-->
<template>
  <el-select
    class="product-select-search"
    remote
    :multiple="multiple"
    :value="selectValue"
    :placeholder="placeholder"
    :filterable="filterable"
    :clearable="clearable"
    :value-key="valueKey"
    :remote-method="remoteMethod"
    :disabled="disabled"
    :loading="loading"
    :loading-text="loadingWords"
    :popper-append-to-body="popperAppendToBody"
    :popper-class="popperClass"
    @visible-change="visibleChange"
    @change="change"
  >
    <el-option
      v-for="item in options"
      :key="item[optionsKey]"
      :label="item[optionsLabel]"
      :value="multiple ? item[optionsValue] : item"
      :title="item[optionsLabel]"
    >
      <span v-if="isSlot" style="float: left">{{ item[optionsLabel] }}</span>
      <span
        v-if="isSlot"
        style="
          float: right;
          color: #8492a6;
          font-size: 12px;
          margin-right: 20px;
        "
      >{{ item[optionsValue] }}</span>
    </el-option>
  </el-select>
</template>
<script>
import request from '@/utils/request'
import { debounce } from '@/utils'
export default {
  name: 'BasicSelectComponent',
  props: {
    // 绑定值； 多选时参数是个数组
    selectValue: {
      type: [String, Array, Object, Number]
    },
    // select 父级 id 同一页面中，该值不要重复
    selectEle: {
      type: String,
      default: 'selectBox'
    },
    // placeholder
    placeholder: {
      type: String,
      default: '请选择'
    },
    // 搜索字段
    searchValue: {
      type: String,
      default: ''
    },
    // 是否需要搜索
    filterable: {
      type: Boolean,
      default: true
    },
    // 是否可以清空选项
    clearable: {
      type: Boolean,
      default: false
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false
    },
    // 是否更改options插入位置
    popperAppendToBody: {
      type: Boolean,
      default: false
    },
    // 自定义类名
    popperClass: {
      type: String,
      default: ''
    },
    // 数据请求地址
    apiUrl: {
      type: String,
      default: ''
    },
    // 数据方式
    requestMode: {
      type: String,
      default: 'post'
    },
    // 接口参数
    requestParam: {
      type: Object
    },
    // 数据返回层级名
    requestFormat: {
      type: String,
      default: 'list'
    },
    // 默认一页加载20条数据
    perPage: {
      type: Number,
      default: 20
    },
    // 页数的字段名
    pageNumParam: {
      type: String,
      default: 'page'
    },
    // 条数的字段名
    pageSizeParam: {
      type: String,
      default: 'pageSize'
    },
    // el-option的key
    optionsKey: {
      type: String,
      default: 'id'
    },
    // el-option的label
    optionsLabel: {
      type: String,
      default: 'name'
    },
    // el-option的value；多选时，才参数必传
    optionsValue: {
      type: String,
      default: 'name'
    },
    // 作为 value 唯一标识的键名，绑定值为对象类型时必填
    valueKey: {
      type: String,
      default: 'name'
    },
    // 是否多选
    multiple: {
      type: Boolean,
      default: false
    },
    // 綁定的字段名
    name: {
      type: String
    },
    // 需不需要分页
    needPagination: {
      type: Boolean,
      default: true
    },
    // 远程加载时显示的文字
    loadingText: {
      type: String
    },
    // 是否自定义模板
    isSlot: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      options: [], // 下拉数据
      el: '', // 父级元素
      total: 0, // 总条数
      page: 1, // 页数
      loading: false,
      loadingWords: this.loadingText,
      query: ''
    }
  },
  mounted() {
    this.el = ''
    this.setLoadMore()
  },
  // 销毁监听
  destroyed() {
    this.el && this.el.removeEventListener('scroll', this.scrollFn)
  },
  methods: {
    /**
     * @description 搜索
     * @param query 搜索框输入的值
     */
    remoteMethod: debounce(function(query) {
      this.query = query
      this.page = 1
      this.options = []
      this.getListData()
    }, 300),
    /**
     * @description 获得el-select父级元素
     */
    setLoadMore() {
      this.el = document
        .getElementById(this.selectEle) && document.getElementById(this.selectEle).getElementsByClassName('el-select-dropdown__wrap')[0]
    },
    /**
     * @description 下拉加载数据
     */
    scrollFn() {
      const scrollDistance =
        this.el.scrollHeight - this.el.scrollTop - this.el.clientHeight
      // 下拉距离到底部并且数据没有全部加载完成时，获取下一页数据
      if (
        scrollDistance <= 0 &&
        this.total > 0 &&
        this.total !== this.options.length &&
        this.needPagination
      ) {
        this.page++
        this.getListData()
      }
    },
    /**
     * @description 获取下拉数据
     */
    async getListData() {
      const url = `${this.apiUrl}`
      const queryParams = {}
      if (this.needPagination) {
        if (this.searchValue) {
          // url = `/${this.apiUrl}?${this.pageNumParam}=${this.page}&${this.pageSizeParam}=${this.perPage}&${this.searchValue}=${this.query}`;
          queryParams[this.pageNumParam] = this.page
          queryParams[this.pageSizeParam] = this.perPage
          queryParams[this.searchValue] = this.query
        } else {
          // url = `/${this.apiUrl}?${this.pageNumParam}=${this.page}&${this.pageSizeParam}=${this.perPage}`;
          queryParams[this.pageNumParam] = this.page
          queryParams[this.pageSizeParam] = this.perPage
        }
      } else {
        if (this.searchValue) {
          // url = `/${this.apiUrl}?${this.searchValue}=${this.query}`;
          queryParams[this.searchValue] = this.query
        }
        this.el && this.el.removeEventListener('scroll', this.scrollFn)
      }
      const result = await request({
        url,
        method: this.requestMode,
        data: { ...this.requestParam, ...queryParams }
      })
      if (result.code === 200) {
        this.total =
          result['data'] && result['data'].total ? result['data'].total : 0
        this.options = this.options.concat(
          result['data'] && result['data'][this.requestFormat]
            ? result['data'][this.requestFormat]
            : []
        )
        if (!this.options.length) {
          this.loadingWords = '无数据'
        } else {
          this.loading = false
          this.loadingWords = ''
        }
      }
    },
    /**
     * @description 展开或关闭下拉框
     */
    visibleChange(e) {
      this.query = ''
      this.loading = false
      this.page = 1
      if (!e) {
        this.el && this.el.removeEventListener('scroll', this.scrollFn)
      } else {
        this.options = []
        this.el && this.el.addEventListener('scroll', this.scrollFn)
        this.getListData()
      }
      this.$emit('visibleChange', e)
    },
    /**
     * @description 选中值
     */
    change(data) {
      // console.log(data);
      const multipleData = []
      // 处理多选
      if (this.multiple) {
        this.options.forEach((item) => {
          if (data.includes(item[this.optionsValue])) {
            multipleData.push(item)
          }
        })
      }
      this.$emit('changeSelectVal', {
        name: this.name,
        data,
        multipleData
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.product-select-search {
  width: 100%;
}
</style>
