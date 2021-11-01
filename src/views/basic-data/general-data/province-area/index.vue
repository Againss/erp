<!--
 * @Author: Do not edit
 * @Date: 2020-09-25 09:13:35
 * @LastEditTime: 2019-10-15 15:00:45
 * @LastEditors: Aurnm
 **  省市区页面
 -->
<template>
  <div class="provincePage">
    <!-- 搜索页面 -->
    <div class="search">
      <cs-custom-form ref="searchForm" :data-source="searchData" :options="formOtions" :form-datas="formDatas" />
    </div>
    <!-- table表格 -->
    <div class="page-table">
      <cs-custom-table
        :columns="columns"
        :data-source="dataSource"
        lazy
        :pagination="pagination"
        edit-type="pop"
        table-scrollx
      />
    </div>
  </div>
</template>

<script>
import { provincePage, provinceSelect } from './api/index.js'

export default {
  name: 'ProvinceArea',
  components: {},
  data() {
    // 下拉变换时，旁边的搜索框获取值，产生；联动效果
    const changeParent = (value, form, formDatas, setFormDatas) => {
      setFormDatas({ parentId: null })
      this.getArea(value)
    }
    // 查询/重置表单配置信息
    const searchData = [
      {
        prop: 'parent',
        itemType: 'select',
        filterable: true,
        label: '省份:',
        placeholder: '请选择',
        dataSource: [],
        change: changeParent
      },
      {
        prop: 'parentId',
        itemType: 'select',
        filterable: true,
        label: '城市:',
        placeholder: '请选择',
        dataSource: []
      },
      {
        itemType: 'operate',
        submitText: '查询',
        submitHandle: params => {
          const newData = {}
          if (params.parentId) {
            newData.parentId = params.parentId
          } else {
            newData.parentId = params.parent
          }
          if (params.parent === undefined || params.parent === '') {
            this.searchFormDatas = { ...params }
            this.getRulePage({ ...params })
          } else {
            this.searchFormDatas = { ...newData }
            this.getRulePage({ ...newData })
          }
        },
        resetHandle: (params) => {
          this.searchData[1].dataSource = [{ label: '全部', value: '' }]
          this.searchFormDatas = {}
        }
      }
    ]
    // 表格表头的配置信息
    const columns = [
      {
        prop: 'areaCode',
        label: '行政编码',
        showOverflowTooltip: true,
        minWidth: '80'
      },
      {
        prop: 'name',
        label: '名称',
        showOverflowTooltip: true,
        minWidth: '80'
      },
      {
        prop: 'mergerName',
        label: '全称',
        showOverflowTooltip: true,
        minWidth: '80'
      },
      {
        prop: 'parentId',
        label: '上级编码',
        showOverflowTooltip: true,
        minWidth: '80'
      },
      {
        prop: 'level',
        label: '层次'
      }
    ]
    // 分页配置信息
    const pagination = {
      currentChange: val => {
        this.getRulePage({ pageSize: this.pagination.pageSize || 20, page: val })
      },
      sizeChange: val => {
        this.getRulePage({ page: this.pagination.page || 1, pageSize: val })
      }
    }
    return {
      formOtions: {
        size: 'small',
        inline: true
      },
      searchData,
      columns,
      dataSource: [],
      pagination,
      type: 'add',
      formDatas: {
        // parentId: ''
      }
    }
  },
  created() {
    this.getRulePage()
    this.getOption()
    // this.getArea()
  },
  mounted() {},
  methods: {
    // 省市区列表查询
    async getRulePage(data = {}) {
      const res = await provincePage({ ...this.searchFormDatas, ...data })
      res.data.list && res.data.list.map((item, index) => { item.code = res.data.total - ((res.data.page - 1) * res.data.pageSize + index) })
      const listData = res.data ? res.data.list : []
      this.dataSource = listData
      this.pagination = {
        ...this.pagination,
        dataTotal: res.data.total,
        ...data,
        currentPage: res.data.page,
        pageSize: data.pageSize
      }
    },
    // 省市区下拉--省下拉页面
    async getOption(data) {
      const res = await provinceSelect({ parentId: 0 })
      if (res.code !== 200) {
        return false
      }
      const dataCopy = res.data
      dataCopy.map((item, index) => {
        item.label = item.name
        item.value = item.id
      })
      this.searchData[0].dataSource = [{ label: '全部', value: '' }, ...dataCopy]
      this.$set(this.formDatas, 'parentId', '')
    },
    // 市区下拉页面
    async getArea(data) {
      const res = await provinceSelect({ parentId: data })
      if (res.code !== 200) {
        return false
      }
      const dataCopy = res.data
      dataCopy.map((item, index) => {
        item.label = item.name
        item.value = item.id
      })
      this.searchData[1].dataSource = [{ label: '全部', value: '' }, ...dataCopy]
    }
  }
}
</script>

<style lang='scss' scoped>
.provincePage {
  padding: 20px;
  padding-bottom: 0px;
}
</style>
<style lang='scss'>
.provincePage {
  .el-form.el-form--inline .el-form-item__label-wrap {
    margin-left: 0px !important;
  }
}
</style>
