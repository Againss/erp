<!--
 * @Descripttion: 客户列表
 * @Author: admin
 * @Date: 2021-03-04 14:01:19
 * @LastEditors: zhengjin
 * @LastEditTime: 2021-08-06 16:40:55
-->
<template>
  <div class="goods-orders">
    <!-- 搜索表单 -->
    <div class="search">
      <cs-custom-form ref="searchForm" :data-source="searchData" :options="formOtions" />
    </div>
    <!-- 列表 -->
    <div class="page-table">
      <cs-custom-table
        ref="filterTable"
        tooltip-effect="dark"
        :columns="columns"
        :data-source="dataSource"
        :pagination="pagination"
        :table-scrollx="true"
        edit-type="pop"
      />
    </div>

  </div>
</template>

<script>
import {
  list,
  customerType,
  levelType,
  followerType
} from '../api/index'
export default {
  name: 'CustomerList',
  components: { },
  props: {},
  data() {
    const searchData = {
      _keyword: {
        prop: 'keyword',
        itemType: 'input',
        itemStyle: { width: '25%' },
        placeholder: '全称/中英文简称模糊匹配',
        label: '客户',
        change: (value) => {
          this.searchFormDatas.keyword = value
        },
        clearable: true
      },
      _customerTypeId: {
        prop: 'customerTypeId',
        itemType: 'select',
        label: '客户类型',
        placeholder: '',
        itemStyle: { width: '25%' },
        clearable: true,
        change: (value) => {
          this.searchFormDatas.customerTypeId = value
        },
        visibleChange: (value) => {
          if (value) {
            this.customerTypelist()
          }
        },
        dataSource: []
      },
      _level: {
        prop: 'level',
        itemType: 'select',
        label: '客户级别',
        placeholder: '',
        itemStyle: { width: '25%' },
        clearable: true,
        change: (value) => {
          this.searchFormDatas.level = value
        },
        visibleChange: (value) => {
          if (value) {
            this.levelTypeList()
          }
        },
        dataSource: []
      },
      _area: {
        prop: 'area',
        itemType: 'select',
        label: '市场类型',
        placeholder: '',
        itemStyle: { width: '25%' },
        clearable: true,
        change: (value) => {
          this.searchFormDatas.area = value
        },
        dataSource: [
          {
            label: '国内',
            value: 'DOMESTIC'
          },
          {
            label: '海外',
            value: 'ABROAD'
          }
        ]
      },
      _follower: {
        prop: 'follower',
        itemType: 'select',
        label: '所有人',
        placeholder: '',
        itemStyle: { width: '25%' },
        filterable: true,
        change: (value) => {
          console.log(value, '----')
          const obj = []
          obj.push(value)
          this.$set(this.searchFormDatas, 'follower', obj)
        },
        visibleChange: (value) => {
          if (value) {
            this.followerTypeList()
          }
        },
        filterMethod: (value) => {
          console.log(value, '自定义搜索', this.followerList)
          this.followerTypeList({
            'realName': value
          })
        },
        // loadMore: (value) => {
        //   console.log(value, '滚动加载')
        //   ++this.pageNum
        //   this.followerTypeList()
        // },
        dataSource: []
      },
      _dateRange: {
        itemType: 'date',
        type: 'daterange',
        itemStyle: { width: '25%' },
        prop: 'dateRange',
        label: '更新时间',
        startPlaceholder: '开始日期',
        endPlaceholder: '结束日期',
        format: 'yyyy-MM-dd',
        valueFormat: 'yyyy-MM-dd',
        clearable: true,
        change: (value) => {
          if (!value) {
            this.$set(this.searchFormDatas, 'updatedTimeStart', '')
            this.$set(this.searchFormDatas, 'updatedTimeEnd', '')
            return
          }
          this.$set(this.searchFormDatas, 'updatedTimeStart', value[0])
          this.$set(this.searchFormDatas, 'updatedTimeEnd', value[1])
        }
      },
      _operate: {
        itemType: 'operate',
        submitText: '查询',
        submitHandle: params => {
          console.log(this.searchFormDatas)
          this.list()
        },
        resetHandle: () => {
          this.searchFormDatas = {}
        }
      }
    }
    // 表格表头配置信息/以下五个都是table的配置信息
    const columns = {
      _index: {
        prop: 'index',
        label: '序号',
        minWidth: '60',
        fixed: true
      },
      _name: {
        prop: 'name',
        label: '客户全称',
        minWidth: '150',
        fixed: true,
        showOverflowTooltip: true,
        handle: (scope) => {
          this.$router.push({ path: `/customer-info/customer-management/details/${scope.row.customerId}` })
        },
        formater: scope => scope.row && scope.row.name || '-',
        style: {
          color: 'rgb(24, 144, 255)',
          cursor: 'pointer'
        }
      },
      _shortName: {
        prop: 'shortName',
        label: '中文简称',
        minWidth: '120',
        fixed: true,
        showOverflowTooltip: true,
        formater: scope => scope.row && scope.row.shortName || '-'
      },
      _ename: {
        prop: 'ename',
        label: '英文简称',
        minWidth: '120',
        fixed: true,
        showOverflowTooltip: true,
        formater: scope => scope.row && scope.row.ename || '-'

      },

      _customerTypeName: {
        prop: 'customerTypeName',
        label: '客户类型',
        minWidth: '120',
        showOverflowTooltip: true,
        formater: scope => scope.row && scope.row.customerTypeName || '-'
      },
      _levelName: {
        prop: 'levelName',
        label: '客户级别',
        minWidth: '120',
        showOverflowTooltip: true,
        formater: scope => scope.row.levelName || '-'
      },
      _area: {
        prop: 'area',
        label: '市场类型',
        minWidth: '120',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.area === 'DOMESTIC'
            ? `<span style="color:#FF9214">国内</span>`
            : `<span style="color:#00BCC5">海外</span>` || '-'
        }
      },
      _follower: {
        prop: 'follower',
        label: '所有人',
        minWidth: '120',
        showOverflowTooltip: true,
        formater: scope => scope.row && scope.row.follower || '-'
      },
      _createdTime: {
        prop: 'createdTime',
        label: '创建时间',
        minWidth: '150',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.createdTime ? this.$filters.parseTime(scope.row.createdTime + '', '{y}-{m}-{d} {h}:{i}') : '-'
        }
      },
      _updatedBy: {
        prop: 'updatedBy',
        label: '更新人',
        minWidth: '110',
        showOverflowTooltip: true,
        formater: scope => scope.row && scope.row.updatedBy || '-'
      },
      _updatedTime: {
        prop: 'updatedTime',
        label: '更新时间',
        minWidth: '150',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.updatedTime ? this.$filters.parseTime(scope.row.updatedTime + '', '{y}-{m}-{d} {h}:{i}') : '-'
        }
      }
    }
    const pagination = {
      currentChange: val => {
        const page = { pageSize: this.pagination.pageSize || 20, pageNum: val }
        this.list(page)
      },
      sizeChange: val => {
        this.$set(this.pagination, 'currentPage', 1)
        const page = { pageNum: 1, pageSize: val }
        this.list(page)
      }
    }
    return {
      userId: [],
      formOtions: {
        layout: true,
        size: 'small',
        inline: true
      },
      searchData,
      dataSource: [],
      columns,
      pagination,
      sellTeamData: [],
      totalNum: {},
      searchFormDatas: {},
      isFirstEnter: false,
      pageNum: 1,
      pageSize: 20,
      followerList: []
    }
  },
  watch: {},
  created() {
    this.list()
    this.isFirstEnter = true
  },
  activated() {
    if (this.isFirstEnter) {
      this.isFirstEnter = false // 恢复默认值
      return
    }
    this.list()
  },
  deactivated() {
    this.pageNum = 1
  },
  methods: {
    // 获取列表数据
    async list(data = {}) {
      const res = await list({
        dataTag: 'ALL',
        ...data,
        ...this.searchFormDatas
      })
      if (res.code !== 200) return
      if (res.data && res.data.list) {
        res.data.list &&
          res.data.list.map((item, index) => {
            item.index = (res.data.pageNum - 1) * res.data.pageSize + index + 1
          })
      }
      const listData = res.data.list || []
      this.dataSource = listData
      this.pagination = {
        ...this.pagination,
        dataTotal: res.data.total || 0,
        currentPage: res.data.pageNum,
        pageNum: res.data.pageNum,
        pageSize: res.data.pageSize
      }
    },
    // 客户类型
    async customerTypelist() {
      const res = await customerType({})
      if (res.code !== 200) return
      console.log(res, '----------------')
      let data = []
      data = res.data.map((item) => {
        item.label = item.name
        item.value = item.id
        return item
      })
      this.$set(this.searchData['_customerTypeId'], 'dataSource', data)
    },
    // 客户级别
    async levelTypeList() {
      const res = await levelType({})
      if (res.code !== 200) return
      console.log(res, '----------------')
      let data = []
      data = res.data.map((item) => {
        item.label = item.name
        item.value = item.id
        return item
      })
      this.$set(this.searchData['_level'], 'dataSource', data)
    },
    // 所有人
    async followerTypeList(param = {}) {
      const res = await followerType({
        ...param
      })
      if (res.code !== 200) {
        return
      } else {
        if (res.data && res.data.list === null) return
      }
      let data = []
      data = res.data.list.map((item) => {
        const obj = {
          'label': item.realName,
          'value': item.userId
        }
        return obj
      })
      // console.log(data)
      // this.followerList.push(...data)
      // this.followerList = this.followerList.concat(data)
      // this.$set(this.searchData['_follower'], 'dataSource', this.followerList)
      this.$set(this.searchData['_follower'], 'dataSource', data)
    },
    fitterItem(arr, value) {
      return arr.find((item) => item.value === value)
    }
  }
}
</script>

<style lang="scss" scoped>
  .goods-orders {
    padding: 20px;
    padding-bottom: 0;
    .el-table_1_column_1 span{
      color: #0000FF;
    }
  }
  .popOptionsClass {
      .el-textarea__inner{
          resize: none;
      }
  }
  .createbutton_btn{
    display: flex;
    .cr_btn_left{
      margin-right: 20px;
    }
  }

  .page-table /deep/ .el-table--medium th{
    height: 44px;
    padding:  0 !important;
  }

</style>
