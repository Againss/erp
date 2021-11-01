<!--
 * @Author: ll
 * @Date: 2021-01-12 11:09:38
 * @LastEditTime: 2021-01-27 10:31:03
 * @LastEditors: admin
 * @Description: 色板生产进度列表
-->
<template>
  <div class="swatches-list">
    <!-- 搜索表单 -->
    <div class="search">
      <cs-custom-form
        ref="searchForm"
        :data-source="searchData"
        :options="formOtions"
      />
    </div>

    <div class="swatches-tabs">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="全部" name="0" />
        <el-tab-pane label="进行中" name="1" />
        <el-tab-pane label="已完结" name="2" />
      </el-tabs>
    </div>

    <!-- 表格 -->
    <div class="page-table">
      <cs-custom-table
        tooltip-effect="dark"
        :columns="columns"
        :autoresize="false"
        :table-scrollx="true"
        :data-source="dataSource"
        :pagination="pagination"
        :data-total="dataSource.length"
        :operates="popOperates"
        edit-type="pop"
        :span-method="spanMethod"
        :row-class-name="rowClassName"
      />
    </div>
  </div>
</template>
<script>

import { pageList, colorModelDelete } from './api/index.js'
import moreShow from '../public/components/moreShow'
import logMethods from '@/views/product-center/mixin/log-methods'
export default {
  mixins: [logMethods],
  data() {
    // 查询信息
    const searchData = [
      {
        prop: 'colorModelApplyId',
        itemType: 'input',
        label: '色板单号：',
        placeholder: '请输入色板单号'
      },
      {
        prop: 'fabricColorNo',
        itemType: 'input',
        label: '智布色号：',
        placeholder: '请输入智布色号'
      },
      {
        prop: 'dyeFactoryName',
        itemType: 'input',
        label: '染厂：',
        placeholder: '请输入染厂'
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
        fixed: true,
        minWidth: '50'
      },
      {
        prop: 'fabricColorNo',
        label: '智布色号',
        minWidth: '150',
        fixed: true,
        showOverflowTooltip: true
        // style: {
        //   color: '#1890ff',
        // }
      },
      {
        prop: 'colorModelApplyId',
        label: '色板单号',
        width: '180',
        showOverflowTooltip: true
      },
      {
        prop: 'clothName',
        label: '布类',
        width: '180',
        showOverflowTooltip: true
      },
      {
        prop: 'yarn',
        label: '纱支',
        minWidth: '150',
        components: {
          moreShow
        },
        componentsOptions: {
          type: 'yarn'
        }
      },
      {
        prop: 'composition',
        label: '成份',
        minWidth: '150',
        components: {
          moreShow
        },
        componentsOptions: {
          type: 'composition'
        }
      },
      {
        prop: 'dyeFactoryName',
        label: '染厂',
        width: '120',
        showOverflowTooltip: true
      },
      {
        prop: 'scheduleName',
        label: '当前进度',
        width: '120',
        showOverflowTooltip: true
      },
      {
        prop: 'delivery',
        label: '交期',
        width: '150',
        showOverflowTooltip: true
      },
      {
        prop: 'reissue',
        label: '复期',
        width: '150',
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
        permitTag: ['aps-center:aps:colorModelSchedule:addDyeFactory'],
        isShow: (scope) => {
          return scope.row.status === 0
        },
        // isShow: true,
        handle: (params) => {
          this.$router.push({
            name: 'swatchesScheduleDetail',
            params: { id: params.row.colorModelScheduleDetailId, type: 'factory', colorModelApplyId: params.row.colorModelApplyId, antitype: 'DEI' }
          })
        }
      },
      {
        label: '更新进度',
        permitTag: ['aps-center:aps:colorModelSchedule:updateSchedule'],
        isShow: (scope) => {
          return scope.row.status === 0
        },
        // isShow: true,
        handle: (params) => {
          this.$router.push({
            name: 'swatchesScheduleDetail',
            params: { id: params.row.colorModelScheduleDetailId, type: 'progress', colorModelApplyId: params.row.colorModelApplyId, antitype: 'AllWalks' }
          })
        }
      },
      {
        label: '收样记录',
        permitTag: ['aps-center:aps:colorModelSchedule:receiveRecords'],
        isShow: (scope) => {
          return scope.row.status === 0
        },
        // isShow: true,
        handle: (params) => {
          this.$router.push({
            name: 'swatchesScheduleDetail',
            params: { id: params.row.colorModelScheduleDetailId, type: 'demorecord', colorModelApplyId: params.row.colorModelApplyId, antitype: 'AllWalks' }
          })
        }
      },
      {
        label: '客户审核',
        permitTag: ['aps-center:aps:colorModelSchedule:customerCheck'],
        isShow: (scope) => {
          return scope.row.status === 0
        },
        // isShow: true,
        handle: (params) => {
          this.$router.push({
            name: 'swatchesScheduleDetail',
            params: { id: params.row.colorModelScheduleDetailId, type: 'examine', colorModelApplyId: params.row.colorModelApplyId, antitype: 'AllWalks' }
          })
        }
      },
      {
        label: '详情',
        isShow: true,
        handle: (params) => {
          this.$router.push({
            name: 'swatchesScheduleDetail',
            params: { id: params.row.colorModelScheduleDetailId, type: 'show' }
          })
        }
      },
      {
        label: '删除',
        permitTag: ['aps-center:aps:colorModelSchedule:delete'],
        style: { 'color': '#FE4949' },
        isShow: (scope) => {
          return scope.row.status === 0
        },
        // isShow: true,
        handle: (params) => {
          this.$confirm(' 确认要删除该数据吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async() => {
            const res = await colorModelDelete(params.row.colorModelScheduleDetailId)
            if (res.code !== 200) {
              return
            }
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.fetchLog(
              this.getLogMessages('DEL', '/aps/colorModel/schedule/delete', 'aps'),
              { colorModelScheduleDetailId: params.row.colorModelScheduleDetailId },
              JSON.stringify({
                beforeText: `在'计划管理-生产进度-色板生产进度'删除一条记录`,
                beforeCode: { colorModelScheduleDetailId: params.row.colorModelScheduleDetailId }
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
      width: '240',
      fixed: 'right',
      moreOptions: {
        maxLength: 2
      },
      dataSource: dataList
    }
    // 分页配置信息
    const pagination = {
      // currentPage: 1,
      // pageSize: 20,
      // dataTotal: 1
      currentChange: (val) => {
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
      dataList,
      mergingRows: [],
      mergingPos: 0
      // totalNum: {},
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 获取列表数据
    async getList(data = {}) {
      const obj = { status: this.activeName - 0 }
      const res = await pageList({
        ...this.searchFormDatas,
        ...obj,
        ...data
      })

      this.dataSource =
        (res.data.list &&
          res.data.list.map((item, index) => {
            item.index = (res.data.pageNum - 1) * res.data.pageSize + index + 1
            if (index === 0) {
              item.flag = true
            } else {
              if (item.fabricColorNo === res.data.list[index - 1].fabricColorNo) {
                item.flag = res.data.list[index - 1].flag
              } else {
                item.flag = !res.data.list[index - 1].flag
              }
            }
            return item
          })) || []
      this.pagination = {
        ...this.pagination,
        dataTotal: res.data ? res.data.total : 0,
        ...data,
        currentPage: res.data.pageNum,
        pageSize: res.data.pageSize
      }
      this.dataPretreatment(this.dataSource)
    },
    handleClick() {
      // if (this.activeName - 0 === 2) {
      //   this.popOperates = null
      // } else {
      //   this.popOperates = {
      //     label: '操作',
      //     width: '240',
      //     fixed: 'right',
      //     moreOptions: {
      //       maxLength: 2
      //     },
      //     dataSource: this.$filterPermission(this.dataList)
      //   }
      // }
      this.getList()
    },
    // 处理表格的合并的数据，找到要合并的数组
    dataPretreatment(data) {
      // 注意因为需要多次处理后台数据合并 所以合并前初始化这两个
      this.mergingRows = []
      this.mergingPos = 0
      for (let i = 0; i < data.length; i++) {
        // data传入的表格数据源
        if (i === 0) {
          this.mergingRows.push(1)
          this.mergingPos = 0
        } else {
          if (data[i].fabricColorNo && data[i - 1].fabricColorNo) {
            // 哪些数据是要合并的 合并的条件是什么
            if (data[i].fabricColorNo === data[i - 1].fabricColorNo) {
              this.mergingRows[this.mergingPos] += 1
              this.mergingRows.push(0)
            } else {
              this.mergingRows.push(1)
              this.mergingPos = i
            }
          } else {
            this.mergingRows.push(1)
            this.mergingPos = i
          }
        }
      }
    },
    spanMethod({ row, column, rowIndex, columnIndex }) {
      // 第一列
      // if (columnIndex === 0) {
      //   const _row = this.mergingRows[rowIndex]
      //   const _col = _row > 0 ? 1 : 0
      //   return {
      //     rowspan: _row,
      //     colspan: _col
      //   }
      // }
      // 第二列
      if (columnIndex === 1) {
        const _row = this.mergingRows[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
        }
      }
    },
    rowClassName({ row, rowIndex }) {
      if (row.flag) {
        return 'whiteColor'
      } else {
        return 'blueColor'
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .swatches-list{
    padding: 20px;
  }
  .swatches-tabs{
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
// /deep/ .page-table .el-table__row td{
//   padding: 8px 0;
// }
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

<style lang="scss">
.swatches-list{
  .page-table {
    // .table tbody {
    //   border-left: 1px solid #dfe6ec;
    // }
    // .table tbody tr td {
    //   border-bottom: 1px solid #dfe6ec;
    //   border-right: 1px solid #dfe6ec;
    // }
    .whiteColor {
      background: #ffffff;
    }
    .blueColor {
      background: #eaf5ff;
    }
  }
}
</style>

