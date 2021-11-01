<!--
 * @Author: ll
 * @Date: 2021-01-12 11:09:38
 * @LastEditTime: 2021-07-27 17:19:51
 * @LastEditors: OBKoro1
 * @Description: 色板申请列表
-->

<template>
  <div class="swatches-application">
    <!-- 搜索表单 -->
    <div class="search">
      <cs-custom-form ref="searchForm" :data-source="searchData" :options="formOtions" />
    </div>
    <!-- tab页签切换 -->
    <div class="tabchange">
      <div class="tabchange_he">
        <el-tabs v-model="activeName" class="puactive_class" @tab-click="handleClick">
          <el-tab-pane label=" 全部 " name="-1" />
          <el-tab-pane label=" 待提交 " name="0" />
          <el-tab-pane label=" 进行中 " name="1" />
          <el-tab-pane label=" 已完结 " name="3" />
        </el-tabs>
        <!-- 新建 -->
        <div class="createbutton">
          <el-button
            v-permission="['customerOrder:colorModel:colorModelApply:add']"
            size="small"
            type="primary"
            @click="addHandler"
          >新建</el-button>
        </div>
      </div>

    </div>
    <!-- table表格 -->
    <div class="page-table">
      <cs-custom-table
        tooltip-effect="dark"
        :columns="columns"
        :autoresize="false"
        :table-scrollx="true"
        :data-source="dataSource"
        :operates="popOperates"
        :pagination="pagination"
        edit-type="pop"
        highlight-current-row
      />
    </div>
  </div>
</template>
<script>
import { pageList, getFinish, getCancel } from './api/index.js'
import { PublicCustomer } from '@/views/customer-order/public/index'
import moreShow from '../public/components/moreShow'
export default {
  name: 'SwatchesApplication',
  mixins: [PublicCustomer],
  data() {
    const searchData = [
      {
        prop: 'id',
        itemType: 'input',
        itemStyle: { width: '25%' },
        label: '色板单号',
        clearable: true
        // placeholder: '请输入姓名'
      },
      {
        prop: 'customerId',
        itemType: 'select',
        itemStyle: { width: '25%' },
        label: '客户',
        clearable: true,
        filterable: true,
        visibleChange: (value) => {
          if (value) {
            this.getCustomerSelect()
          }
        }
      },
      {
        prop: 'orgId',
        itemType: 'select',
        itemStyle: { width: '25%' },
        label: '销售团队',
        clearable: true,
        filterable: true,
        visibleChange: (value) => {
          if (value) {
            this.getSellTeamSelect()
          }
        }
      },
      {
        prop: 'createdBy',
        itemType: 'input',
        itemStyle: { width: '25%' },
        label: '创建人',
        clearable: true
      },
      {
        prop: 'yarnName',
        itemType: 'input',
        itemStyle: { width: '25%' },
        label: '纱支',
        clearable: true
      },
      {
        prop: 'compositionName',
        itemType: 'input',
        itemStyle: { width: '25%' },
        label: '成份',
        clearable: true
      },
      {
        prop: 'clothName',
        itemType: 'input',
        itemStyle: { width: '25%' },
        label: '布类',
        clearable: true
      },
      {
        itemType: 'date',
        type: 'daterange',
        prop: 'dateRange',
        label: '下单日期',
        itemStyle: { width: '346px' },
        // pickerOptions: pickerOptions,
        startPlaceholder: '开始日期',
        endPlaceholder: '结束日期',
        format: 'yyyy-MM-dd',
        valueFormat: 'timestamp',
        defaultTime: ['00:00:00', '23:59:59']
        // change: timeChange
      },
      {
        itemType: 'operate',
        submitText: '查询',
        submitHandle: params => {
          if (params.dateRange) {
            params.createdStartTime = params.dateRange[0]
            params.createdEndTime	 = params.dateRange[1]
          } else {
            params.createdStartTime = null
            params.createdEndTime	 = null
          }
          this.getList(params)
          this.searchFormDatas = params
        },
        resetHandle: () => {
          this.searchFormDatas = {}
        }
      }
    ]
    // 操作栏 和权限配置
    let popOperatesDataSource = [
      {
        label: '编辑',
        permitTag: ['customerOrder:colorModel:colorModelApply:modify'],
        isShow: (scope) => {
          return scope.row.status === 0
        },
        // isShow: true,
        handle: scope => {
          this.$router.push(// 跳转到详情页
            `/customer-order/analysis-application/swatches-application/detail/${scope.row.id}/edit`
          )
        }
      },
      {
        label: '完结',
        permitTag: ['customerOrder:colorModel:colorModelApply:finish'],
        isShow: (scope) => {
          return scope.row.status === 1
        },
        // isShow: true,
        handle: scope => {
          this.$confirm('确认完结订单吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true,
            customClass: 'customClass'
          })
            .then(() => {
              this.approveFabricTypes(scope.row.id)
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '已取消审核'
              })
            })
        }
      },
      {
        label: '取消生产',
        permitTag: ['customerOrder:colorModel:colorModelApply:cancel'],
        isShow: (scope) => {
          return scope.row.status === 1
        },
        // isShow: true,
        handle: scope => {
          this.$confirm('确认取消生产吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true,
            customClass: 'customClass'
          })
            .then(() => {
              this.cancelData(scope.row.id)
            })
            .catch(() => {
              this.$message({ type: 'info', message: '已取消删除' })
            })
        }
      }
    ]
    popOperatesDataSource = this.$filterPermission(popOperatesDataSource)
    // 操作信息
    const popOperates = {
      label: '操作',
      width: '150',
      fixed: 'right',
      // moreOptions: {
      //   maxLength: 2// 最大超过多少个显示more功能，默认为2
      // },
      dataSource: popOperatesDataSource
    }
    // 分页配置
    const pagination = {
      currentChange: (val) => { // 切换页数
        this.getList({ pageSize: this.pagination.pageSize || 20, pageNum: val })
      },
      sizeChange: (val) => { // 切换条数
        this.getList({ pageNum: this.pagination.pageNum || 1, pageSize: val })
      }
    }
    // 表格信息
    const columns = [
      {
        prop: 'index',
        label: '序号',
        minWidth: '60',
        fixed: true,
        showOverflowTooltip: true
      },
      {
        prop: 'id',
        label: '色板单号',
        minWidth: '150',
        fixed: true,
        showOverflowTooltip: true,
        handle: (scope) => {
          this.$router.push(
            `/customer-order/analysis-application/swatches-application/detail/${scope.row.id}/show`
          )
        },
        style: {
          color: 'rgb(24, 144, 255)',
          cursor: 'pointer'
        }
      },
      {
        prop: 'colorModelTypeName',
        label: '色板类型',
        minWidth: '150',
        showOverflowTooltip: true
      },
      {
        prop: 'garmentPartName',
        label: '成衣部位',
        minWidth: '150',
        showOverflowTooltip: true
      },
      {
        prop: 'customerName',
        label: '客户',
        minWidth: '150',
        showOverflowTooltip: true
      },
      {
        prop: 'sellerTeamName',
        label: '销售团队',
        minWidth: '150',
        showOverflowTooltip: true
      },
      {
        prop: 'yarnName',
        label: '纱支',
        minWidth: '150',
        components: {
          moreShow
        },
        componentsOptions: {
          type: 'yarnName'
        }
      },
      {
        prop: 'compositionName',
        label: '成份',
        minWidth: '150',
        components: {
          moreShow
        },
        componentsOptions: {
          type: 'compositionName'
        }
      },
      {
        prop: 'clothName',
        label: '布类',
        minWidth: '150',
        showOverflowTooltip: true
      },
      {
        prop: 'createdName',
        label: '创建人',
        minWidth: '100',
        showOverflowTooltip: true
      },
      {
        prop: 'createdTime',
        label: '下单日期',
        minWidth: '150',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.createdTime ? this.$filters.parseTime(scope.row.createdTime + '', '{y}-{m}-{d}') : ''
        }
      },
      {
        prop: 'updatedName',
        label: '操作人',
        minWidth: '100',
        showOverflowTooltip: true
      },
      {
        prop: 'updatedTime',
        label: '操作时间',
        minWidth: '150',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.updatedTime ? this.$filters.parseTime(scope.row.updatedTime + '', '{y}-{m}-{d} {h}:{i}') : ''
        }
      },
      {
        prop: 'status',
        label: '状态',
        minWidth: '100',
        formater: (scope) => {
          return this.getStatus(scope.row.status)
        }
      }
    ]
    return {
      activeName: '0',
      searchData,
      columns,
      popOperates,
      dataSource: [],
      pagination,
      popOperatesDataSource,
      formOtions: {
        layout: true,
        size: 'small',
        inline: true
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // tab页签切换
    handleClick() {
      if (this.activeName === '3') {
        this.popOperates = null
      } else {
        this.popOperates = {
          label: '操作',
          width: '150',
          fixed: 'right',
          dataSource: this.popOperatesDataSource
        }
      }
      this.getList()
    },
    // 获取客户下拉
    getCustomerSelect() {
      this.getCustomer().then(res => {
        this.$set(this.searchData[1], 'dataSource', res)
      })
    },
    // 获取销售团队下拉
    getSellTeamSelect() {
      this.getSellTeam({ functionTag: 'SAL' }).then(res => {
        this.$set(this.searchData[2], 'dataSource', res)
      })
    },
    // 获取列表
    async getList(data = {}) {
      const obj = { status: this.activeName - 0 }
      const res = await pageList({
        ...this.searchFormDatas,
        ...obj,
        ...data
      })
      res.data && res.data.list && res.data.list.map((item, index) => {
        item.index = ((res.data.pageNum - 1) * res.data.pageSize + index + 1)
      })
      const dataList = res.data ? res.data.list : []
      this.dataSource = dataList
      this.pagination = {
        ...this.pagination,
        dataTotal: res.data ? res.data.total : 0,
        ...data,
        currentPage: res.data.pageNum,
        pageSize: res.data.pageSize,
        page: res.data.pageNum
      }
    },
    // 新建
    addHandler() {
      this.$router.push('/customer-order/analysis-application/swatches-application/create')
    },
    // 是否完结订单
    async approveFabricTypes(id) {
      const res = await getFinish({ id: id })
      if (res.code !== 200) { return false }
      this.$message({
        type: 'success',
        message: '完结成功!'
      })
      this.getList({ pageNum: this.pagination.page || 1, pageSize: this.pagination.pageSize || 20 })
    },
    // 取消生产
    async cancelData(id) {
      const res = await getCancel({ id: id })
      if (res.code !== 200) { return false }
      this.$message({
        type: 'success',
        message: '取消生产成功!'
      })
      this.getList({ pageNum: this.pagination.page || 1, pageSize: this.pagination.pageSize || 20 })
    },
    // 处理状态数据
    getStatus(data) {
      let str = ''
      // 进行中  草稿 已取消 已完成
      switch (data) {
        case 0:
          str = '草稿'
          // str = `<span style="color:#888E9E">草稿</span>`
          break
        case 1:
          // str = `<span style="color:#FF9B02">进行中</span>`
          str = '进行中'
          break
        case 2:
          str = '已取消'
          break
        case 3:
          str = '已完成'
          break
        default:
          break
      }
      return str
    }
  }
}
</script>
<style lang='scss' scoped>
  .swatches-application {
    padding: 20px;
    padding-bottom: 0;
    .el-table_1_column_1 span{
      color: #0000FF;
    }
    .tabchange{
      display: flex;
      position: relative;
      padding-bottom: 0;
      background-color: #fff;
      border-bottom: 1px solid #dfe6ec;
      .tabchange_he{
        display: flex;
        width: 100%;
        font-family: PingFangSC-Medium;
        font-size: 14px;
        color: #3C4043;
        text-align: center;
        /deep/ .el-tabs__header {
          margin-bottom: 0px;
        }
        /deep/ .el-tabs__nav-wrap::after{
          height: 0px !important;
        }
        /deep/ .el-tabs__item {
          height: 60px;
          line-height: 60px;
          padding: 0 26px;
        }
      }
      .createbutton{
        line-height: 60px;
        margin-right: 20px;
      }
     .puactive_class{
        flex: 1;
      }
    }
  }
</style>
