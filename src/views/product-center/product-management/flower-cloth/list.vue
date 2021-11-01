<!--
 * @Date: 2021-04-26 15:53:26
 * @Author: Againss
 * @LastEditTime: 2021-07-26 11:52:18
 * @LastEditors: zhengjin
 * @Descripttion:花布
-->
<template>
  <div class="product-list-content flower-cloth-list">
    <!-- 搜索表单 -->
    <div class="search islayoutForm">
      <cs-custom-form
        ref="searchForm"
        :data-source="searchData"
        :options="formOtions"
      />
    </div>
    <div class="button">
      <el-button
        v-permission="['catalog:Api:Cloth:ClothFlowerFabricMain:store']"
        type="primary"
        size="small"
        @click="addColourCloth"
      >新增</el-button>
      <el-button
        v-permission="['catalog:Api:Cloth:ClothFlowerFabricMain:import']"
        size="small"
        @click="importOrder"
      >批量导入</el-button>
      <el-button
        v-permission="['catalog:Api:Cloth:ClothFlowerFabricMain:export']"
        size="small"
        :loading="exportLoadingFlag"
        @click="exportList"
      >批量导出</el-button>
    </div>
    <div class="page-table">
      <cs-custom-table
        ref="singleTable"
        tooltip-effect="light"
        :columns="columns"
        :data-source="dataSource"
        :pagination="pagination"
        :data-total="dataSource.length"
        :operates="popOperates"
        :class="{ 'list-end': !dataSource.length }"
        table-scrollx
      />
    </div>
  </div>
</template>
<script>
import configData from '@/views/product-center/configDock/index.js'
import logMethods from '@/views/product-center/mixin/log-methods.js'
import {
  pageList,
  flowerFabricDestory,
  flowerFabricExport
} from './api'
import { debounce } from '@/utils'
export default {
  name: 'FlowerClothList',
  mixins: [logMethods],
  data() {
    const columns = [
      {
        prop: 'code',
        label: '花布编码',
        minWidth: '180',
        fixed: true,
        showOverflowTooltip: true,
        formater: scope => scope.row.code || '-',
        handle: (scope) => {
          this.$router.push(
            `/product-center/product-management/flower-cloth/is-show/${scope.row.id}`
          )
        },
        style: {
          color: 'rgb(24, 144, 255)',
          cursor: 'pointer'
        }
      },
      {
        prop: 'productFlower',
        label: '花号',
        minWidth: '150',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.productFlower && scope.row.productFlower.name
        }
      },
      {
        prop: 'fabricWidth',
        label: '花布幅宽(cm)',
        minWidth: '120',
        align: 'right',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.fabricWidth ? scope.row.fabricWidth + (scope.row.fabricWidthType && scope.row.fabricWidthType.name ? scope.row.fabricWidthType.name : '') : ''
        }
      },
      {
        prop: 'fabricWeight',
        label: '花布克重(g/m²)',
        minWidth: '120',
        align: 'right',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row && scope.row.fabricWeight
            ? scope.row.fabricWeight : ''
        }
      },
      {
        prop: 'colorCode',
        label: '色布编码',
        minWidth: '180',
        showOverflowTooltip: true
      },
      {
        prop: 'spuCode',
        label: 'SPU编码',
        minWidth: '150',
        showOverflowTooltip: true
      },
      {
        prop: 'dataSource',
        label: '数据来源',
        minWidth: '120',
        formater: (scope) => {
          let dataSourceName = ''
          switch (scope.row.dataSource) {
            case 1:
              dataSourceName = '产品目录库'
              break
            case 2:
              dataSourceName = '样板开发'
              break
            case 3:
              dataSourceName = '客户订单'
              break
            case 4:
              dataSourceName = '采购订单'
              break
            case 5:
              dataSourceName = '工艺总结'
              break
            default:
              dataSourceName = ''
          }
          return dataSourceName
          // 数据来源 1产品目录库,2样板开发，3客户订单，4采购订单，5工艺总结
        },
        showOverflowTooltip: true
      },
      {
        prop: 'productSource',
        label: '产品来源',
        minWidth: '120',
        formater: (scope) => {
          return scope.row && scope.row.productSource
            ? scope.row.productSource === 1
              ? '自有'
              : '外来'
            : ''
        },
        showOverflowTooltip: true
      },
      {
        prop: 'skuStatus',
        label: '状态',
        minWidth: '80',
        formater: (scope) => {
          // 正式/临时
          return scope.row && scope.row.skuStatus
            ? scope.row.skuStatus === 1
              ? '正式'
              : '临时'
            : ''
        },
        showOverflowTooltip: true
      },
      {
        prop: 'updator',
        label: '更新人',
        minWidth: '150',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.updator
            ? scope.row.updator.name
              ? scope.row.updator.name + '/' + scope.row.updator.realName
              : scope.row.updator.realName
            : scope.row.creator
              ? scope.row.creator.name
                ? scope.row.creator.name + '/' + scope.row.creator.realName
                : scope.row.creator.realName
              : ''
        }
      },
      {
        prop: 'operatedTime',
        label: '更新时间',
        minWidth: '150',
        formater: (scope) => {
          return (
            scope.row.operatedTime &&
            this.$filters.parseTime(
              scope.row.operatedTime,
              '{y}-{m}-{d} {h}:{i}'
            )
          )
        },
        showOverflowTooltip: true
      }
    ]
    // 搜索
    const searchData = [
      {
        prop: 'code',
        label: '花布编码:',
        placeholder: '请输入花布编码',
        itemType: 'input'
      },
      {
        prop: 'spuCode',
        label: 'SPU编码:',
        placeholder: '请输入SPU编码',
        itemType: 'input'
      },
      {
        prop: 'colorCode',
        label: '色布编码:',
        placeholder: '请输入色布编码',
        itemType: 'input'
      },
      {
        prop: 'productFlowerCode',
        label: '花号:',
        placeholder: '请输入花号',
        itemType: 'input'
      },
      {
        prop: 'skuStatus',
        label: '状态:',
        placeholder: '请选择状态',
        itemType: 'select',
        dataSource: [
          {
            label: '全部',
            value: null
          },
          {
            label: '正式',
            value: 1
          },
          {
            label: '临时',
            value: 2
          }
        ]
      },
      {
        prop: 'fabricWidthTop',
        itemType: 'input',
        label: '花布幅宽:',
        itemStyle: { width: '166px', 'padding-right': '15px !important' }
      },
      {
        prop: 'fabricWidthEnd',
        itemType: 'input',
        label: '-',
        itemStyle: { width: '124px' }
      },
      {
        prop: 'fabricWeightTop',
        itemType: 'input',
        label: '花布克重:',
        itemStyle: { width: '162px', 'padding-right': '15px !important' }
      },
      {
        prop: 'fabricWeightEnd',
        itemType: 'input',
        label: '-',
        itemStyle: { width: '122px' }
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
    // 分页配置信息
    const pagination = {
      currentChange: (val) => {
        // 切换页数
        this.getList({
          pageSize: this.pagination.pageSize || 10,
          page: val
        })
      },
      sizeChange: (val) => {
        // 切换条数
        this.getList({ pageSize: val, page: this.pagination.page || 1 })
      }
    }
    // 表头操作栏里dataSource的配置信息
    let dataList = [
      {
        label: '编辑',
        permitTag: ['catalog:Api:Cloth:ClothFlowerFabricMain:update'],
        isShow: true,
        handle: async(params) => {
          this.$router.push(
            `/product-center/product-management/flower-cloth/show/${params.row.id}?isEdit=true`
          )
        }
      },
      {
        label: '删除',
        style: { color: '#FE4949' },
        permitTag: ['catalog:Api:Cloth:ClothFlowerFabricMain:destroy'],
        isShow: true,
        handle: async(params) => {
          this.$confirm(' 你确认要删除该数据吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              this.deleteData(params.row)
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              })
            })
        }
      }
    ]
    dataList = this.$filterPermission(dataList)
    // 表头操作栏的配置信息
    const popOperates = {
      label: '操作',
      width: '120',
      fixed: 'right',
      dataSource: dataList
    }
    return {
      columns,
      searchData,
      pagination,
      dataList,
      popOperates,
      dataSource: [],
      formOtions: {
        layout: true,
        inline: true,
        size: 'small'
      },
      exportLoadingFlag: false,
      isFirstEnter: false

    }
  },
  created() {
    this.getList()
    this.isFirstEnter = true
  },
  activated() {
    // console.log('来了-flowerList', this.isFirstEnter)
    if (this.isFirstEnter) {
      this.isFirstEnter = false // 恢复默认值
      return
    }
    this.getList()
  },
  deactivated() {
    // console.log('离开-flowerList')
  },
  methods: {
    // 获取列表
    async getList(data = {}) {
      const res = await pageList({
        ...this.searchFormDatas,
        ...data
      })
      const userList = res.data.list || []
      this.dataSource = userList
      this.pagination = {
        ...this.pagination,
        dataTotal: res.data ? res.data.total : 0,
        ...data,
        page: res.data.page,
        pageSize: res.data.pageSize
      }
    },

    /**
     * @description 设置搜索范围输入框
     */
    setSearchData() {
      this.searchData.forEach((ele) => {
        if (ele.componentsOptions && ele.componentsOptions.reset === false) {
          ele.componentsOptions.reset = true
        }
      })
    },
    /**
     * @description 进入添加花布页面
     */
    addColourCloth() {
      this.$router.push({ name: 'flowerClothCreate' })
    },
    /**
     * @description 进入批量导入页面
     */
    importOrder() {
      this.$router.push({ name: 'flowerClothImport' })
    },
    /**
     * @description 批量导出
     */
    exportList: debounce(
      function() {
        this.exportLoadingFlag = true
        flowerFabricExport({ ...this.searchFormDatas })
          .then((res) => {
            location.href = res.data.url
            // this.fetchLog(
            //   this.getLogMessages('EXPORT', `${configData.productRequestPrefix}/api/cloth/flowerFabric/export`),
            //   { ...this.searchFormDatas },
            //   JSON.stringify({
            //     beforeText: `在'产品目录库-产品管理-花布列表'批量导出成功`,
            //     beforeCode: { ...this.searchFormDatas }
            //   })
            // )
            this.exportLoadingFlag = false
          })
          .catch(() => {
            this.exportLoadingFlag = false
          })
      },
      300,
      true
    ),
    /**
     * @description 删除数据
     */
    async deleteData(row) {
      await flowerFabricDestory({ id: row.id })
      this.fetchLog(
        this.getLogMessages('DEL', `${configData.productRequestPrefix}/api/cloth/flowerFabric/destroy`),
        { id: row.id, code: row.code },
        JSON.stringify({
          beforeText: `在'产品目录库-产品管理-花布列表'删除一条记录`,
          beforeCode: { id: row.id, code: row.code }
        })
      )
      await this.getList({
        ...this.searchFormDatas,
        pageSize: this.pagination.pageSize,
        page: this.pagination.page
      })
    }
  }
}
</script>

<style lang="scss" scoped>
$m-left: 3px !important;
.flower-cloth-list {
 .search /deep/ .custom-form .el-form--inline {
  & > :nth-child(9) {
    .el-form-item__label-wrap {
      margin-left: 0 !important;
    }
  }
  & > :nth-child(7) {
    .el-form-item__label-wrap {
      margin-left: 0 !important;
    }
  }
}
}
</style>

