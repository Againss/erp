<!--
 * @Author: Do not edit
 * @Date: 2020-12-03 09:13:35
 * @LastEditTime: 2019-10-15 15:00:45
 * @LastEditors: Aurnm
 **  库存管理页面
 -->
<template>
  <div class="stock-manage">
    <!-- 搜索页面 -->
    <div class="search">
      <cs-custom-form ref="searchForm" :data-source="searchData" :options="formOtions" :form-datas="formDatas" />
    </div>
    <!-- 页签和按钮部分 -->
    <div v-permission="['wms:stock:lock']" class="stock-button">
      <el-button
        size="small"
        type="primary"
        @click="addList"
      >锁定</el-button>
      <el-button
        size="small"
        type="primary"
        @click="backList"
      >解锁</el-button>
    </div>

    <!-- table表格 -->
    <div class="page-table">
      <cs-custom-table
        ref="table"
        tooltip-effect="dark"
        :table-scrollx="true"
        :columns="columns"
        :data-source="dataSource"
        :operates="popOperates"
        :pagination="pagination"
        edit-type="pop"
      />
    </div>
  </div>
</template>

<script>
import { stockPage } from './api/index.js'
export default {
  name: 'StockManage',
  components: {},
  data() {
    // 查询/重置表单配置信息
    const searchData = [
      {
        prop: 'materiel',
        itemType: 'input',
        label: '产品编号',
        clearable: true,
        placeholder: '请输入单号'
      },
      {
        prop: 'warehouseName',
        itemType: 'input',
        label: '仓库',
        clearable: true,
        placeholder: '请输入仓库'
      },
      {
        prop: 'materielType',
        itemType: 'select',
        label: '物料类型',
        dataSource: [
          {
            label: '全部',
            value: ''
          },
          {
            label: '天然纤维',
            value: '0101'
          },
          {
            label: '化学纤维',
            value: '0102'
          },
          {
            label: '组合纱线',
            value: '0103'
          },
          {
            label: '坯布',
            value: '0201'
          },
          {
            label: '色布',
            value: '0202'
          },
          {
            label: '组合布',
            value: '0203'
          },
          {
            label: '花布',
            value: '0204'
          }
        ]
      },
      {
        itemType: 'operate',
        submitText: '查询',
        submitHandle: params => {
          this.getRulePage(params)
          this.searchFormDatas = params
        },
        resetHandle: (params) => {
          this.searchFormDatas = {}
        }
      }
    ]
    // 表格表头的配置信息
    const columns = [
      {
        prop: 'materiel',
        label: '产品编号',
        minWidth: '180',
        handle: (scope) => {
          this.$router.push({
            path:
              '/wms/stock-manage/stock-manage/components/details/',
            query: { materiel: scope.row.materiel, materielType: scope.row.materielType, warehouseCode: scope.row.warehouseCode, type: 'details' }
          })
        },
        style: {
          color: '#1890ff',
          cursor: 'pointer'
        }
      },
      {
        prop: 'materielType',
        label: '物料类型',
        minWidth: '100',
        formater: scope => {
          return this.getStatus(scope.row.materielType)
        }
      },
      {
        prop: 'materielInfo.yarnName',
        label: '纱名',
        minWidth: '180',
        formater: scope => {
          if (scope.row.materielInfo) {
            return scope.row.materielInfo.yarnName
          } else {
            return '--'
          }
        },
        showOverflowTooltip: true
      },
      {
        prop: 'materielInfo.yarnProperty',
        label: '纱属性',
        minWidth: '180',
        formater: scope => {
          if (scope.row.materielInfo) {
            return scope.row.materielInfo.yarnProperty
          } else {
            return '--'
          }
        },
        showOverflowTooltip: true
      },
      {
        prop: 'warehouseName',
        label: '仓库',
        minWidth: '150',
        showOverflowTooltip: true
      },
      {
        prop: 'stock',
        label: '总库存数/KG',
        minWidth: '130',
        formater: (scope) => {
          return (
            `${scope.row.stock}/${scope.row.weight}`
          )
        }
      },
      {
        prop: 'tempStock',
        label: '暂存库存数/KG',
        minWidth: '130',
        formater: (scope) => {
          return (
            `${scope.row.tempStock}/${scope.row.tempWeight}`
          )
        }
      },
      {
        prop: 'usableStock',
        label: '可用库存数/KG',
        minWidth: '130',
        formater: (scope) => {
          return (
            `${scope.row.usableStock}/${scope.row.usableWeight}`
          )
        }
      },
      {
        prop: 'lockStock',
        label: '锁定库存数/KG',
        minWidth: '130',
        formater: (scope) => {
          return (
            `${scope.row.lockStock}/${scope.row.lockWeight}`
          )
        }
      },
      {
        prop: 'unusableStock',
        label: '不可用库存数/KG',
        minWidth: '140',
        formater: (scope) => {
          return (
            `${scope.row.unusableStock}/${scope.row.unusableWeight}`
          )
        }
      },
      {
        prop: 'materielType',
        label: '包装单位',
        minWidth: '100',
        showOverflowTooltip: true,
        formater: scope => {
          return this.getUnit(scope.row.materielType)
        }
      }
    ]
    let popOperatesDataSource = [
      {
        label: '详情',
        isShow: this.$permission(['wms:stock:detail']),
        handle: scope => {
          // 跳转到详情页面
          this.$router.push({
            path:
              '/wms/stock-manage/stock-manage/components/details/',
            query: { materiel: scope.row.materiel, materielType: scope.row.materielType, warehouseCode: scope.row.warehouseCode, type: 'details' }
          })
        }
      }]
    popOperatesDataSource = this.$filterPermission(popOperatesDataSource)
    const popOperates = {
      label: '操作',
      width: '80',
      fixed: 'right',
      dataSource: popOperatesDataSource
    }
    // 分页配置信息
    const pagination = {
      currentChange: val => {
        this.getRulePage({ pageSize: this.pagination.pageSize || 20, pageNum: val })
      },
      sizeChange: val => {
        this.pagination.pageSize = val
        this.pagination.pageNum = 1
        this.pagination.currentPage = 1
        this.getRulePage({ pageNum: this.pagination.pageNum || 1, pageSize: val })
      }
    }
    return {
      formOtions: {
        // layout: true,
        size: 'small',
        inline: true
      },
      formDatas: {},
      searchData,
      columns,
      dataSource: [],
      pagination,
      popOperates
    }
  },
  watch: {
  },
  created() {
    this.getRulePage()
  },
  mounted() {},
  methods: {
    // 新增--跳转到别的页面
    addList() {
      // console.log('打印新增页面')
      this.$router.push('/wms/stock-manage/stock-manage/components/isLock/lock')
    },
    backList() {
      // console.log('打印解锁')
      this.$router.push('/wms/stock-manage/stock-manage/components/isLock/unlock')
    },
    // 货物类型
    getStatus(data) {
      let str = ''
      switch (data) {
        case '0101':
          str = '天然纤维'
          break
        case '0102':
          str = '化学纤维'
          break
        case '0103':
          str = '组合纱线'
          break
        case '0201':
          str = '坯布'
          break
        case '0202':
          str = '色布'
          break
        case '0203':
          str = '组合布'
          break
        case '0204':
          str = '花布'
          break
        default:
          break
      }
      return str
    },
    // 获取单位
    getUnit(data) {
      let str = ''
      switch (data) {
        case '0101':
          str = '件'
          break
        case '0102':
          str = '件'
          break
        case '0103':
          str = '件'
          break
        case '0201':
          str = '卷'
          break
        case '0202':
          str = '卷'
          break
        case '0203':
          str = '卷'
          break
        case '0204':
          str = '卷'
          break
        default:
          break
      }
      return str
    },
    // 列表查询
    async getRulePage(data = {}) {
      const res = await stockPage({ ...this.searchFormDatas, ...data })
      const listData = res.data ? res.data.list : []
      this.dataSource = listData
      this.total = res.data.total || {}
      this.pagination = {
        ...this.pagination,
        dataTotal: res.data.total,
        ...data,
        currentPage: res.data.pageNum,
        pageSize: data.pageSize,
        pageNum: res.data.pageNum
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.stock-manage {
  padding: 20px;
  padding-bottom: 0px;

  .stock-button {
    margin-bottom: 15px;
  }
  /deep/ .el-tabs__header {
    margin: 0;
    .el-tabs__item {
      font-weight: 400;
    }
  }
}
</style>
<style lang="scss">
.stock-manage {
  .el-form.el-form--inline .el-form-item__label-wrap {
    margin-left: 0px !important
  }
  .movePop{
    .el-dialog{
      width: 1300px !important;
    }
    .el-dialog__body{
      padding: 20px !important;
    }
  }
}
</style>
