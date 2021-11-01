<!--
 * @Descripttion: 印花SO生产进度列表
 * @Author: shujing
 * @Date: 2020-12-10 17:39:38
 * @LastEditors: admin
 * @LastEditTime: 2021-01-28 14:43:35
-->
<template>
  <div class="print-list">
    <!-- 搜索表单 -->
    <div class="search">
      <cs-custom-form
        ref="searchForm"
        :data-source="searchData"
        :options="formOtions"
      />
    </div>

    <div class="print-tabs">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="全部" name="0" />
        <el-tab-pane label="进行中" name="1" />
        <el-tab-pane label="已完结" name="2" />
      </el-tabs>
    </div>

    <!-- 表格 -->
    <div class="page-table">
      <cs-custom-table
        ref="singleTable"
        :columns="columns"
        :data-source="dataSource"
        :table-scrollx="true"
        :pagination="pagination"
        :data-total="dataSource.length"
        :operates="popOperates"
        tooltip-effect="dark"
      />
    </div>
  </div>
</template>
<script>

import { pageList, soPrintDelete } from './api/index.js'
import moreShow from '../../public/components/moreShow'
import logMethods from '@/views/product-center/mixin/log-methods'
export default {
  mixins: [logMethods],
  data() {
    // 查询信息
    const searchData = [
      {
        prop: 'printSoApplyId',
        itemType: 'input',
        label: 'SO单号:',
        placeholder: '请输入SO单号'
      },
      {
        prop: 'fabricFlowerNo',
        itemType: 'input',
        label: '智布花号:',
        placeholder: '请输入智布花号'
      },
      {
        prop: 'printFactoryName',
        itemType: 'input',
        label: '印花厂:',
        placeholder: '请输入印花厂'
      },
      {
        itemType: 'operate',
        submitText: '查询',
        submitHandle: (params) => {
          this.getList(params)
          this.searchFormDatas = params
        },
        resetHandle: () => {
          this.searchFormDatas = {}
        }
      }
    ]
    // 表格信息
    const columns = [
      {
        prop: 'index',
        label: '序号',
        minWidth: '50'
      },
      {
        prop: 'fabricFlowerNo',
        label: '智布花号',
        width: '180',
        showOverflowTooltip: true,
        handle: (scope) => {
          this.$router.push({
            name: 'printScheduleDetail',
            params: { id: scope.row.printProProDetId, type: 'show', factoryid: scope.row.id, antitype: 'AllWalks' }
          })
        },
        style: {
          color: '#1890ff',
          cursor: 'pointer'
        }
      },
      {
        prop: 'printSoApplyId',
        label: '印花SO申请单号',
        width: '180',
        showOverflowTooltip: true
      },
      {
        prop: 'printColorName',
        label: '印花颜色名',
        width: '180',
        showOverflowTooltip: true
      },
      {
        prop: 'customerServiceName',
        label: '客服',
        width: '90',
        showOverflowTooltip: true
      },
      // {
      //   prop: 'printCraft',
      //   label: '印花工艺',
      //   width: '180',
      //   showOverflowTooltip: true,
      //   formater: (scope) => {
      //     return `<div style='white-space:pre;text-overflow: ellipsis;overflow: hidden;'>${scope.row.printCraft}</div>`
      //   }
      // },
      {
        prop: 'printCraft',
        label: '印花工艺',
        width: '180',
        components: {
          moreShow
        },
        componentsOptions: {
          type: 'printCraft'
        }
      },
      {
        prop: 'printSize',
        label: '印花尺寸',
        width: '120',
        showOverflowTooltip: true
      },
      // {
      //   prop: 'yarn',
      //   label: '纱支',
      //   width: '180',
      //   showOverflowTooltip: true,
      //   formater: (scope) => {
      //     return `<div style='white-space:pre;text-overflow: ellipsis;overflow: hidden;'>${scope.row.yarn}</div>`
      //   }
      // },
      {
        prop: 'yarn',
        label: '纱支',
        width: '180',
        components: {
          moreShow
        },
        componentsOptions: {
          type: 'yarn'
        }
      },
      {
        prop: 'clothName',
        label: '布类',
        width: '180',
        showOverflowTooltip: true
      },
      {
        prop: 'clothComponent',
        label: '布成份',
        width: '120',
        showOverflowTooltip: true
      },
      {
        prop: 'printFactoryName',
        label: '印花厂',
        width: '120',
        showOverflowTooltip: true
      },
      {
        prop: 'printNestedColor',
        label: '印花套色',
        width: '120',
        showOverflowTooltip: true
      },
      {
        prop: 'printColorDesign',
        label: '印花图案',
        width: '120',
        className: 'paintStyle',
        formater: (scope) => {
          return `<img style='width:34px;height:34px' src='${scope.row.printColorDesign}'>`
        }
      },
      {
        prop: 'produceName',
        label: '当前进度',
        width: '120',
        showOverflowTooltip: true
      },
      {
        prop: 'orderDate',
        label: '下单日期',
        width: '120',
        showOverflowTooltip: true
      },
      {
        prop: 'delivery',
        label: '交期',
        width: '120',
        showOverflowTooltip: true
      },
      {
        prop: 'updatedBy',
        label: '操作人',
        width: '90',
        showOverflowTooltip: true
      },
      {
        prop: 'updatedTime',
        label: '操作时间',
        width: '180',
        showOverflowTooltip: true
      }
    ]
    // 操作信息
    const dataList = [
      {
        label: '选择工厂',
        permitTag: ['soPrint:printProduceProgress:add:fac'],
        isShow: (scope) => {
          return scope.row.fabricFlowerNo && scope.row.status !== 1 && scope.row.status !== 2
        },
        handle: (params) => {
          this.$router.push({
            name: 'printScheduleDetail',
            params: { id: params.row.printProProDetId, type: 'factory', factoryid: params.row.id, antitype: 'DEI' }
          })
        }
      },
      {
        label: '更新进度',
        permitTag: ['soPrint:printProduceProgress:add:progress'],
        isShow: (scope) => {
          return scope.row.fabricFlowerNo && scope.row.status !== 1 && scope.row.status !== 2
        },
        handle: (params) => {
          this.$router.push({
            name: 'printScheduleDetail',
            params: { id: params.row.printProProDetId, type: 'progress', factoryid: params.row.id, antitype: 'AllWalks' }
          })
        }
      },
      {
        label: '客户审核',
        permitTag: ['soPrint:printProduceProgress:customer:check'],
        isShow: (scope) => {
          return scope.row.fabricFlowerNo && scope.row.status !== 1 && scope.row.status !== 2
        },
        handle: (params) => {
          this.$router.push({
            name: 'printScheduleDetail',
            params: { id: params.row.printProProDetId, type: 'examine', factoryid: params.row.id, antitype: 'AllWalks' }
          })
        }
      },
      {
        label: '删除',
        permitTag: ['soPrint:printProduceProgress:delete'],
        style: { 'color': '#FE4949' },
        isShow: (scope) => {
          // console.log(scope.row.boundfacNum);
          return scope.row.boundfacNum !== 1 && scope.row.status !== 1 && scope.row.status !== 2
        },
        handle: (params) => {
          this.$confirm(' 确认要删除该数据吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async() => {
            const res = await soPrintDelete({ id: params.row.printProProDetId })
            if (res.code !== 200) {
              return
            }
            this.fetchLog(
              this.getLogMessages('DEL', '/aps/soPrint/printProduceProgress/delete', 'aps'),
              { printProProDetId: params.row.printProProDetId },
              JSON.stringify({
                beforeText: `在'计划管理-生产进度-印花SO生产进度'删除一条记录`,
                beforeCode: { printProProDetId: params.row.printProProDetId }
              })
            )
            this.getList()
          })
        }
      }
    ]
    this.dataList = this.$filterPermission(dataList)
    // 表头操作栏的配置信息
    const popOperates = {
      label: '操作',
      width: '300',
      fixed: 'right',
      dataSource: dataList
    }
    // 分页配置信息
    const pagination = {
      // currentPage: 1,
      // pageSize: 20,
      // dataTotal: 1
      currentChange: (val) => {
        console.log(val)
        // 切换页数
        this.getList({
          pageSize: this.pagination.pageSize || 20,
          pageNum: val
        })
      },
      sizeChange: (val) => {
        // 切换条数
        this.getList({ pageNum: this.pagination.page || 1, pageSize: val })
      }
    }
    return {
      formOtions: {
        inline: true,
        size: 'small'
      },
      searchData,
      activeName: '1',
      dataSource: [],
      columns,
      pagination,
      popOperates,
      dataList
      // totalNum: {},
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 处理印花工艺
    getprintCraft(data) {
      let str = ''
      data = JSON.parse(data)
      //  console.log(data);
      data && data.forEach((item, index) => {
        str = str + item.printCraftName + '<br>'
      })
      // str = str + '印花工艺印花工艺印花工艺印花工艺印花工艺印花工艺印花工艺印花工艺印花工艺印花工艺印花工艺' + '<br>' +'印花工艺印花工艺印花工艺印花工艺印花工艺印花工艺印花工艺印花工艺印花工艺印花工艺' + '<br>'
      //  console.log(str);
      str = str.slice(0, str.length - 4)
      // console.log(str)
      return str
    },
    // 获取列表数据
    async getList(data = {}) {
      const that = this
      const obj = { status: this.activeName - 0 }
      const res = await pageList({
        ...this.searchFormDatas,
        ...obj,
        ...data
      })

      this.dataSource = res.data.list
        ? res.data.list.map((item, index) => {
          item.index = (res.data.pageNum - 1) * res.data.pageSize + index + 1
          item.printCraft = that.getprintCraft(item.printCraft)
          // item.yarn = item.yarn && item.yarn.replace(/,/g, '<br>')
          item.orderDate = item.orderDate.slice(0, item.orderDate.length - 8)
          return item
        }) : []
      // this.totalNum = res.data.total || {}
      this.pagination = {
        ...this.pagination,
        dataTotal: res.data ? res.data.total : 0,
        ...data,
        currentPage: res.data.pageNum,
        pageSize: res.data.pageSize
      }
    },
    handleClick() {
      if (this.activeName - 0 === 2) {
        this.popOperates = null
      } else {
        this.popOperates = {
          label: '操作',
          width: '300',
          fixed: 'right',
          dataSource: this.$filterPermission(this.dataList)
        }
      }
      this.getList()
    }

  }
}
</script>
<style lang="scss" scoped>
  .print-list{
    padding: 20px;
  }
  .print-tabs{
    padding-bottom: 1px;
    background: #fff;
    /deep/.el-tabs__nav .el-tabs__item {
      padding: 0 26px;
      height: 60px;
      line-height: 60px;
    }
  }
  /deep/ .el-tabs__header {
  margin: 0;
  .el-tabs__item {
    font-weight: 400;
  }
}
/deep/ .el-tabs__nav-wrap::after {
  height: 1px;
  background-color: #d0d6da;
}
/deep/ .page-table .el-table__row td{
  padding: 8px 0;
}
.page-table{
 /deep/ .paintStyle{
  .cell {
    span{
      display: flex;
      // justify-content: center;
      align-items: center;
    }
  }
}
}
</style>

