<template>
  <div class="product-list-content color-cloth-list">
    <!-- 搜索表单 -->
    <div class="search islayoutForm">
      <cs-custom-form ref="searchForm" :data-source="searchData" :options="formOtions" :form-datas="formDatas" />
    </div>
    <div class="tabchange">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane v-for="(val,index) in statusArr" :key="index" :name="val.value">
          <span slot="label" :tabindex="val.value" class="labelIndex">{{ `${val.label}(${val.count || 0})` }}</span>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="page-table">
      <!-- tab页签切换 -->
      <cs-custom-table
        tooltip-effect="dark"
        :columns="columns"
        :table-scrollx="true"
        :data-source="dataSource"
        :operates="popOperates"
        :pagination="pagination"
        edit-type="pop"
        highlight-current-row
        @sort-change="changeSort"
      />
    </div>
  </div>
</template>
<script>

import logMethods from '@/views/product-center/mixin/log-methods.js'
import { pageList, pageCount, userList } from './api/index.js'
export default {
  name: 'ColourClothList',
  mixins: [logMethods],
  data() {
    const pickerOptions = {
      shortcuts: [
        {
          text: '今天',
          onClick(picker) {
            const end = new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1)
            const start = new Date(new Date(new Date().toLocaleDateString()).getTime())
            start.setTime(start.getTime())
            picker.$emit('pick', [start, end])
          }
        },
        {
          text: '昨天',
          onClick(picker) {
            const end = new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1)
            const start = new Date(new Date(new Date().toLocaleDateString()).getTime())
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 1)
            end.setTime(end.getTime() - 3600 * 1000 * 24 * 1)
            picker.$emit('pick', [start, end])
          }
        },
        {
          text: '7天内',
          onClick(picker) {
            const end = new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1)
            const start = new Date(new Date(new Date().toLocaleDateString()).getTime())
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 6)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '14天内',
          onClick(picker) {
            const end = new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1)
            const start = new Date(new Date(new Date().toLocaleDateString()).getTime())
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 13)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '30天内',
          onClick(picker) {
            const end = new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1)
            const start = new Date(new Date(new Date().toLocaleDateString()).getTime())
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 29)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '60天内',
          onClick(picker) {
            const end = new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1)
            const start = new Date(new Date(new Date().toLocaleDateString()).getTime())
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 60)
            picker.$emit('pick', [start, end])
          }
        }
      ],
      disabledDate(time) {
        return time.getTime() > new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 23, 59, 59).getTime() || time.getTime() < Date.now() - 3600 * 1000 * 24 * 91
      }
    }
    const searchStyle = { width: '33.33%' }
    const columns = [
      {
        prop: 'code',
        label: '序号',
        width: '60'

      },
      {
        prop: 'physicalTaskNo',
        label: '物测编号',
        minWidth: '180',
        // fixed: true,
        showOverflowTooltip: true,
        style: { color: '#1890ff', 'cursor': 'pointer' },
        handle: (scope) => {
          this.$router.push(`/quality-manage/finished-product-testing/finished-cloth/detail/${scope.row.physicalTaskNo}`)
        }
      },
      {
        prop: 'dyelotNo',
        label: '缸号',
        minWidth: '140',
        showOverflowTooltip: true
      },
      {
        prop: 'produceOrderCode',
        label: '生产订单',
        minWidth: '180',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.qaGreigeInspectionInfoResponse ? scope.row.qaGreigeInspectionInfoResponse.produceOrderCode : ''
        }
      },
      {
        prop: 'brandName',
        label: '品牌商',
        minWidth: '140',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.qaCustomerOrderInfoResponse ? scope.row.qaCustomerOrderInfoResponse.brandName : ''
        }
      },
      {
        prop: 'fabricType',
        label: '布类',
        minWidth: '140',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.qaGreigeInspectionInfoResponse ? scope.row.qaGreigeInspectionInfoResponse.fabricType : ''
        }
      },
      {
        prop: 'productSize',
        label: '成品规格',
        minWidth: '140',
        showOverflowTooltip: true,
        formater: (scope) => {
          const d = scope.row.qaGreigeInspectionInfoResponse || {}
          if (d.realWidth) {
            return d.realWidth + (d.unit === 2 ? 'cm' : '"') + '-' + d.realWeight + 'g/m²'
          }
        }
      },
      {
        prop: 'composition',
        label: '成份比例',
        minWidth: '140',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.qaGreigeInspectionInfoResponse ? scope.row.qaGreigeInspectionInfoResponse.composition : ''
        }
      },
      {
        prop: 'customerColor',
        label: '客户颜色',
        minWidth: '140',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.qaGreigeInspectionInfoResponse ? scope.row.qaGreigeInspectionInfoResponse.customerColor : ''
        }
      },
      {
        prop: 'orderType',
        label: '订单类型',
        minWidth: '140',
        showOverflowTooltip: true,
        formater: (scope) => {
          let str = ''
          if (scope.row.qaCustomerOrderInfoResponse && scope.row.qaCustomerOrderInfoResponse.orderType === 1) {
            str = '大货'
          } else if (scope.row.qaCustomerOrderInfoResponse && scope.row.qaCustomerOrderInfoResponse.orderType === 2) {
            str = '样板'
          }
          return str
        }
      },
      {
        prop: 'isHeadBatch',
        label: '是否头缸',
        minWidth: '140',
        showOverflowTooltip: true,
        formater: (scope) => {
          const d = scope.row.qaGreigeInspectionInfoResponse || {}
          return d && d.isHeadBatch === 1 ? '是' : '否'
        }
      },
      {
        prop: 'reportTypeName',
        label: '报告类型',
        minWidth: '140',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.qaCustomerOrderInfoResponse ? scope.row.qaCustomerOrderInfoResponse.reportTypeName : ''
        }

      },
      {
        prop: 'physicalResult',
        label: '物测结果',
        minWidth: '140',
        showOverflowTooltip: true,
        formater: (scope) => {
          // 1.fail 2.pass 3./
          if (scope.row.physicalInformation && scope.row.physicalInformation.result) {
            scope.row.physicalInformation.result = scope.row.physicalInformation.result + ''
            const obj = {
              '1': 'Fail',
              '2': 'Pass',
              '3': '/'
            }
            return obj[scope.row.physicalInformation.result]
          } else {
            return ''
          }
        }
      },
      {
        prop: 'createdByName',
        label: '创建人',
        minWidth: '140',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.qaGreigeInspectionInfoResponse ? scope.row.qaGreigeInspectionInfoResponse.createdByName : ''
        }
      },
      {
        prop: 'createdTime',
        label: '创建时间',
        minWidth: '150',
        sortable: 'custom',
        formater: (scope) => {
          return (scope.row.qaGreigeInspectionInfoResponse && this.$filters.parseTime(scope.row.qaGreigeInspectionInfoResponse.createdTime, '{y}-{m}-{d} {h}:{i}'))
        }
      },
      {
        prop: 'status',
        label: '状态',
        width: '100',
        fixed: 'right',
        isShow: (scope) => {
          return this.activeName === '-1'
        },
        formater: (scope) => {
          const obj = {
            '0': { text: '待处理', color: '#FF9214' },
            '1': { text: '处理中', color: '#FF4444' },
            '2': { text: '审核中', color: '#FF9214' },
            '3': { text: '已处理', color: '#00BCC5' }
          }

          return scope.row.physicalInformation ? `<span style="color:${obj[scope.row.physicalInformation.status].color}">${obj[scope.row.physicalInformation.status].text}</span>` : ''
        }
      }
    ]

    // 搜索
    const searchData = [
      {
        prop: 'physicalTaskNo',
        label: '物测编号:',
        placeholder: '请输入物测编号',
        itemType: 'input',
        itemStyle: searchStyle
      },
      {
        prop: 'produceOrderCode',
        label: '生产订单:',
        placeholder: '请输入生产订单',
        itemType: 'input',
        itemStyle: searchStyle
      },
      {
        prop: 'dyelotNo',
        label: '缸号:',
        placeholder: '请输入缸号',
        itemType: 'input',
        itemStyle: searchStyle
      },
      {
        prop: 'fabricType',
        label: '布类:',
        placeholder: '请输入布类',
        itemType: 'input',
        filterable: true,
        clearable: true,
        itemStyle: searchStyle
      },
      {
        rowStyle: searchStyle,
        children: [
          {
            prop: 'fabricWidthStart',
            itemType: 'input',
            label: '布封:',
            itemStyle: { 'padding-right': 0 },
            span: 13
          },
          {
            prop: 'view',
            itemType: 'view',
            text: '-',
            style: { 'line-height': '32px', 'text-align': ' center' },
            span: 1
          },
          {
            prop: 'fabricWidthEnd',
            itemType: 'input',
            label: '',
            labelWidth: '0',
            span: 10
          }
        ]
      },
      {
        rowStyle: searchStyle,
        children: [
          {
            prop: 'fabricWeightStart',
            itemType: 'input',
            label: '克重:',
            itemStyle: { 'padding-right': 0 },
            span: 13
          },
          {
            prop: 'view',
            itemType: 'view',
            text: '-',
            style: { 'line-height': '32px', 'text-align': ' center' },
            span: 1
          },
          {
            prop: 'fabricWeightEnd',
            itemType: 'input',
            label: '',
            labelWidth: '0',
            span: 10
          }
        ]
      },
      {
        prop: 'isHeadBatch',
        label: '是否头缸:',
        placeholder: '请选择',
        itemType: 'select',
        dataSource: [
          {
            label: '全部',
            value: ''
          },
          {
            label: '是',
            value: 1
          },
          {
            label: '否',
            value: 0
          }
        ],
        itemStyle: searchStyle
      },
      {
        prop: 'customerColor',
        label: '客户颜色:',
        placeholder: '请输入客户颜色',
        itemType: 'input',
        itemStyle: searchStyle
      },
      {
        prop: 'brandName',
        label: '品牌商:',
        placeholder: '请输入品牌商',
        itemType: 'input',
        itemStyle: searchStyle
      },
      {
        prop: 'createdByList',
        label: '创建人:',
        placeholder: '选择创建人',
        itemType: 'select',
        itemStyle: searchStyle,
        multiple: true,
        clearable: true,
        filterable: true,
        dataSource: []
        // loadMore: () => {
        //   if (this.searchData[11].dataSource.length >= this.total) {
        //     console.log('已加载完成')
        //   } else {
        //     this.getUserList()
        //   }
        // }
      },
      {
        prop: 'createdStartTime',
        label: '创建时间',
        itemType: 'date',
        type: 'daterange',
        format: 'yyyy-MM-dd',
        valueFormat: 'timestamp',
        pickerOptions: pickerOptions,
        defaultTime: ['00:00:00', '23:59:59'],
        startPlaceholder: '开始时间',
        endPlaceholder: '结束时间',
        itemStyle: searchStyle,
        placeholder: '请选择'
      },
      {
        itemType: 'operate',
        submitText: '查询',
        submitHandle: (params) => {
          this.formDatas = params
          // 正整数
          var reg = /^[+]{0,1}(\d+)$/
          if (params.fabricWidthStart && !reg.test(params.fabricWidthStart)) {
            return this.$message.error('布封 请输入正整数进行查询')
          }
          if (params.fabricWidthEnd && !reg.test(params.fabricWidthEnd)) {
            return this.$message.error('布封 请输入正整数进行查询')
          }
          if (params.fabricWeightStart && !reg.test(params.fabricWeightStart)) {
            return this.$message.error('克重 请输入正整数进行查询')
          }
          if (params.fabricWeightEnd && !reg.test(params.fabricWeightEnd)) {
            return this.$message.error('克重 请输入正整数进行查询')
          }

          this.getPageList()
        },
        resetHandle: () => {
          this.formDatas = {}
        }
      }
    ]
    // 分页配置信息
    const pagination = {
      pageSizes: [10, 20, 50, 80, 100],
      currentChange: (val) => {
        // 切换页数
        this.getPageList({
          pageSize: this.pagination.pageSize || 10,
          pageNum: val
        })
      },
      sizeChange: (val) => {
        // 切换条数
        this.$set(this.pagination, 'currentPage', 1)
        this.getPageList({ pageNum: 1, pageSize: val })
      }
    }
    // 表头操作栏里dataSource的配置信息
    let dataList = [
      {
        label: '编辑',
        permitTag: ['catalog:Api:Cloth:ClothProductFabricMain:update'],
        isShow: true,
        handle: async(params) => {
          this.$router.push(`/quality-manage/finished-product-testing/finished-cloth/detail/${params.row.id}`)
        }
      },
      {
        label: '查看',
        permitTag: ['catalog:Api:Cloth:ClothProductFabricMain:show'],
        isShow: true,
        handle: async(params) => {
          this.$router.push(`/quality-manage/finished-product-testing/finished-cloth/detail/${params.row.id}`)
        }
      },
      {
        label: '删除',
        style: { color: '#FE4949' },
        permitTag: ['catalog:Api:Cloth:ClothProductFabricMain:destroy'],
        isShow: true,
        handle: async(params) => {
          const res = await this.$utils.confirmMsg()
          if (res) {
            console.log('确认删除')
          }
        }
      }
    ]
    dataList = this.$filterPermission(dataList)
    // 表头操作栏的配置信息
    const popOperates = {
      label: '操作',
      width: '150',
      fixed: 'right',
      isShow: false,
      dataSource: dataList
    }
    return {
      pickerOptions,
      searchStyle,
      columns,
      searchData,
      pagination,
      dataList,
      popOperates,
      activeName: '0',
      dataSource: [],
      formOtions: {
        layout: true,
        inline: true,
        size: 'small',
        labelWidth: '90px'
      },
      formDatas: {
        createdTimeOrder: 1,
        status: 0
      },
      statusList: {
        '-1': { value: '-1', label: '全部', count: 0 },
        '0': { value: '0', label: '待处理', count: 0 },
        '1': { value: '1', label: '处理中', count: 0 },
        '2': { value: '2', label: '审核中', count: 0 },
        '3': { value: '3', label: '已处理', count: 0 }
      },
      pageNum: 1, // 创建人分页参数
      pageSize: 50, // 创建人分页参数
      total: 0

    }
  },
  computed: {
    statusArr() {
      const res = []
      for (const key in this.statusList) {
        res.push(this.statusList[key])
      }
      return res.sort((a, b) => { return a.value - b.value })
    }
  },
  created() {

  },
  mounted() {
    this.getPageList()
    this.getUserList()
  },
  methods: {
    // 排序点击事件
    changeSort(e) {
      this.formDatas.createdTimeOrder = e.order === 'ascending' ? 0 : 1
      this.getPageList()
    },
    // tab事件
    handleClick(e) {
      this.formDatas.status = e.name
      this.formDatas.pageSize = this.pagination.pageSize || 10
      this.formDatas.pageNum = 1
      this.getPageList()
    },
    // 获取员工下拉选项数据
    async getUserList(data = {}) {
      const res = await userList({
        pageNum: this.pageNum,
        pageSize: this.pageSize
      })
      if (res.data && res.data.list && res.data.list.length) {
        const list = res.data.list.map(v => {
          return {
            label: v.realName,
            value: v.userId
          }
        })
        console.log(this.searchData)
        // const newData = [...this.searchData[11].dataSource, ...list]
        this.searchData.find(n => n.prop === 'createdByList').dataSource = list
        // this.searchData[9].dataSource = list
      }
      // this.pageNum++
      // if (res.data && res.data.total) {
      //   this.total = res.data.total
      // }
    },
    async getPageCount(data = {}) {
      // 分页查询数量统计
      for (const key in this.statusList) {
        this.statusList[key].count = 0
      }
      delete data.status
      const res = await pageCount({
        pageSize: this.pagination.pageSize || 10,
        pageNum: this.pagination.pageNum || 1,
        ...data
      })
      const countList = res.data || []
      countList.forEach(item => {
        this.statusList[item.status + ''].count = item.num
      })
    },
    // 列表数据
    async getPageList(data = {}) {
      const createdStartTime = this.formDatas.createdStartTime && this.formDatas.createdStartTime[0]
      const createdEndTime = this.formDatas.createdStartTime && this.formDatas.createdStartTime[1]
      this.formDatas.status = this.activeName
      if (this.formDatas.status === '-1') {
        this.formDatas.status = ''
      }
      // debugger
      let res = await pageList({ ...this.formDatas, createdStartTime, createdEndTime, ...data })

      // 如果list 不是全部并且list为空重置到全部页签
      res = res.data || {}
      if (this.activeName !== '-1' && !res.list || res.list.length === 0) {
        this.activeName = '-1'
        this.getPageList()
      }
      res.list && res.list.map((item, index) => {
        item.code = (res.pageNum - 1) * res.pageSize + index + 1
      })
      this.dataSource = res.list || []
      this.pagination = {
        ...this.pagination,
        dataTotal: res.total,
        ...data,
        currentPage: res.pageNum,
        pageSize: res.pageSize,
        page: res.pageNum
      }
      this.getPageCount({ ...this.formDatas, createdStartTime, createdEndTime })
    }
  }
}
</script>

<style lang="scss" scoped>
  .tabchange{
    background-color: #FFFFFF;
    .labelIndex{
      padding: 0 10px;
      border: 0 none;
      outline: none;
    }
    /deep/ .el-tabs__header {
      margin-bottom: 0;
    }
    /deep/ .el-tabs__item{
      height: 57px;
      line-height: 57px;
      padding-left: 20px !important;
    }
    /deep/ .el-tabs__active-bar{
      height: 3px;
    }
    /deep/ .el-tabs__nav-wrap::after{
      height: 1px;
      z-index: 8;
    }
  }

</style>
