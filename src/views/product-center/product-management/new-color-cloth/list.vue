<!--
 * @Author: Sanmao
 * @Date: 2020-09-28 09:47:08
 * @LastEditTime: 2021-07-26 11:44:08
 * @LastEditors: zhengjin
 * @Descripttion: 色布列表
-->
<template>
  <div class="product-list-content color-cloth-list">
    <!-- 搜索表单 -->
    <div class="search islayoutForm">
      <cs-custom-form
        ref="searchForm"
        :data-source="searchData"
        :options="formOtions"
        :form-datas="searchFormDatas"
      />
    </div>
    <div class="button">
      <!-- v-permission="['catalog:Api:Cloth:ClothProductFabricMain:store']" -->
      <el-button
        v-permission="['catalog:Api:Cloth:ClothProductFabricMain:store']"
        type="primary"
        size="small"
        @click="addColourCloth"
      >新增</el-button>
      <el-button
        v-permission="['catalog:Api:Cloth:ClothProductFabricMain:import']"
        size="small"
        @click="importOrder"
      >批量导入</el-button>
      <el-button
        v-permission="['catalog:Api:Cloth:ClothProductFabricMain:export']"
        size="small"
        :loading="exportLoadingFlag"
        @click="exportList"
      >批量导出</el-button>
    </div>
    <div class="page-table">
      <cs-custom-table
        ref="singleTable"
        :columns="columns"
        :data-source="dataSource"
        :pagination="pagination"
        :data-total="dataSource.length"
        :operates="popOperates"
        table-scrollx
        :class="{ 'list-end': !dataSource.length }"
      />
    </div>
  </div>
</template>
<script>
import configData from '@/views/product-center/configDock/index.js'
import logMethods from '@/views/product-center/mixin/log-methods.js'
// import searchInput from '@/views/product-center/spu-management/spu-list/components/searchInput.vue'
import techRquire from '@/components/tech-requireItem/tech-require'

import {
  pageList,
  fabricationDyedList,
  fabricationKnitList,
  fabricationsList,
  chemicalFiberDestory,
  // fabricWidthTypeList,
  productFabricExport,
  getClothSelectData
} from './api'
import { debounce } from '@/utils'

export default {
  name: 'ColourClothList',
  // components: {
  //   search,
  // },
  mixins: [logMethods],
  data() {
    const columns = [
      {
        prop: 'code',
        label: '色布编码',
        minWidth: '180',
        fixed: true,
        showOverflowTooltip: true,
        formater: scope => scope.row.code || '-',
        handle: (scope) => {
          this.$router.push({
            path: `/product-center/product-management/color-cloth/is-show/${scope.row.id}`
          })
        },
        style: {
          color: 'rgb(24, 144, 255)',
          cursor: 'pointer'
        }
      },
      {
        prop: 'productColor',
        label: '色号',
        minWidth: '150',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.productColor ? `${scope.row.productColor.code}${scope.row.colorName ? '-' + scope.row.colorName : ''}` : `${scope.row.colorName ? scope.row.colorName : ''}`
        }
      },
      // {
      //   prop: 'productFlower',
      //   label: '花号',
      //   minWidth: '120',
      //   showOverflowTooltip: true,
      //   formater: (scope) => {
      //     return scope.row.productFlower && scope.row.productFlower.name
      //   }
      // },
      {
        prop: 'fabricWidth',
        label: '色布幅宽(cm)',
        minWidth: '120',
        align: 'right',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.fabricWidth ? scope.row.fabricWidth + (scope.row.fabricWidthType && scope.row.fabricWidthType.name ? scope.row.fabricWidthType.name : '') : ''
        }
      },
      {
        prop: 'fabricWeight',
        label: '色布克重(g/m²)',
        minWidth: '120',
        align: 'right',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row && scope.row.fabricWeight
            ? scope.row.fabricWeight : ''
        }
      },
      {
        prop: 'dyePrintType',
        label: '染整类型',
        minWidth: '120',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.dyePrintType ? scope.row.dyePrintType.name : ''
        }
      },
      {
        prop: 'dyeElement',
        label: '染色成分',
        minWidth: '150',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.dyeElementName && scope.row.dyeElementName.length
            ? scope.row.dyeElementName.join('/')
            : ''
        }
      },
      {
        prop: 'dyeProcessGroup',
        label: '染整工艺组合',
        minWidth: '150',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row && scope.row.dyeProcessGroup
            ? scope.row.dyeProcessGroup.name
            : ''
        }
      },
      {
        prop: 'productStyle',
        label: '风格整理',
        minWidth: '150',
        showOverflowTooltip: true,
        formater: (scope) => {
          const productStyleName = []
          if (scope.row.productStyle && scope.row.productStyle.length) {
            scope.row.productStyle.forEach((item) => {
              productStyleName.push(
                (item.styleParentTech ? item.styleParentTech.name + '--' : '') +
                (item.styleChildTech && item.styleChildTech.name
                  ? item.styleChildTech.name
                  : '')
              )
            })
          }
          return productStyleName.length ? productStyleName.join(' / ') : ''
        }
      },
      {
        prop: 'productFunction',
        label: '功能性整理',
        minWidth: '150',
        showOverflowTooltip: true,
        formater: (scope) => {
          const productStyleName = []
          if (scope.row.productFunction && scope.row.productFunction.length) {
            scope.row.productFunction.forEach((item) => {
              productStyleName.push(
                (item.functionParentTech
                  ? item.functionParentTech.name + '--'
                  : '') +
                (item.functionChildTech && item.functionChildTech.name
                  ? item.functionChildTech.name
                  : '')
              )
            })
          }
          return productStyleName.length ? productStyleName.join(' / ') : ''
        }
      },
      {
        prop: 'productFeel',
        label: '手感整理',
        minWidth: '150',
        showOverflowTooltip: true,
        formater: (scope) => {
          const productStyleName = []
          if (scope.row.productFeel && scope.row.productFeel.length) {
            scope.row.productFeel.forEach((item) => {
              productStyleName.push(
                (item.feelParentTech ? item.feelParentTech.name : '') +
                (item.feelChildTech && item.feelChildTech.name
                  ? '--' + item.feelChildTech.name
                  : '')
              )
            })
          }
          return productStyleName.length ? productStyleName.join(' / ') : ''
        }
      },
      {
        prop: 'productFeel',
        label: '制软要求',
        minWidth: '120',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.softMethod ? scope.row.softMethod.name : ''
        }
      },
      {
        prop: 'embryoCode',
        label: '坯布SKU编码',
        minWidth: '150',
        showOverflowTooltip: true
      },
      {
        prop: 'cloth',
        label: '布类',
        minWidth: '150',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.cloth ? scope.row.cloth.name : ''
        }
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
          // return scope.row && scope.row.dataSource
          //   ? scope.row.dataSource === 1
          //     ? '产品目录库'
          //     : '样板'
          //   : ''
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
        minWidth: '100',
        formater: (scope) => {
          return scope.row.skuStatus === 1 ? '正式' : (scope.row.skuStatus === 2 ? '临时' : '')
        }
      },
      {
        prop: 'updator',
        label: '更新人',
        minWidth: '180',
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
        minWidth: '140',
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
        label: '色布编码:',
        placeholder: '请输入色布编码',
        itemType: 'input',
        itemStyle: { width: '33.33%' }
      },
      {
        prop: 'spuCode',
        label: 'SPU编码:',
        placeholder: '请输入SPU编码',
        itemType: 'input',
        itemStyle: { width: '33.33%' }
      },
      {
        prop: 'embryoCode',
        label: '坯布编码:',
        placeholder: '请输入坯布编码',
        itemType: 'input',
        itemStyle: { width: '33.33%' }
      },
      {
        prop: 'bdClothUuid',
        label: '布类:',
        placeholder: '请选择布类',
        itemType: 'select',
        filterable: true,
        clearable: true,
        visibleChange: (flag) => {
          if (flag) {
            this.setSelectData('布类', 3)
          } else {
            this.setSelectData('布类', 3, true)
          }
        },
        dataSource: [],
        itemStyle: { width: '33.33%' }
      },
      {
        prop: 'bdFabrication',
        label: '布种:',
        placeholder: '请选择布种',
        itemType: 'select',
        filterable: true,
        clearable: true,
        visibleChange: (flag) => {
          if (flag) {
            this.setSelectData('布种', 4)
          } else {
            this.setSelectData('布种', 4, true)
          }
        },
        dataSource: [],
        itemStyle: { width: '33.33%' }
      },
      {
        prop: 'produceModeDye',
        label: '染方式:',
        placeholder: '请选择染方式',
        itemType: 'select',
        visibleChange: (flag) => {
          if (flag) {
            this.setSelectData('染方式', 5)
          } else {
            this.setSelectData('染方式', 5, true)
          }
        },
        dataSource: [],
        itemStyle: { width: '33.33%' }
      },
      {
        prop: 'produceModeKnit',
        label: '织造花型:',
        placeholder: '请选择织造花型',
        itemType: 'select',
        visibleChange: (flag) => {
          if (flag) {
            this.setSelectData('织造花型', 6)
          } else {
            this.setSelectData('织造花型', 6, true)
          }
        },
        dataSource: [],
        itemStyle: { width: '33.33%' }
      },
      {
        prop: 'totalNeedleTop',
        itemType: 'input',
        label: '总针数:',
        itemStyle: { width: '19.3%' }
      },
      {
        prop: 'totalNeedleEnd',
        itemType: 'input',
        label: '-',
        itemStyle: { width: '15.33%', marginLeft: '-1.3%' }
      },
      {
        prop: 'fabricWidthTop',
        itemType: 'input',
        label: '色布幅宽:',
        itemStyle: { width: '19.3%' }
      },
      {
        prop: 'fabricWidthEnd',
        itemType: 'input',
        label: '-',
        itemStyle: { width: '15.33%', marginLeft: '-1.3%' }
      },
      {
        prop: 'fabricWeightTop',
        itemType: 'input',
        label: '色布克重:',
        itemStyle: { width: '19.3%' }
      },
      {
        prop: 'fabricWeightEnd',
        itemType: 'input',
        label: '-',
        itemStyle: { width: '19.33%', marginLeft: '-5.3%' }
      },
      {
        prop: 'dyeTech',
        label: '染整方式:',
        placeholder: '请选择染整方式',
        valueType: 'object',
        itemType: 'select',
        itemStyle: { width: '31.1%', marginRight: '19px' },
        components: { techRquire },
        tabArr: [{ label: '普通', name: 'normal' }, { label: '手感风格', name: 'feelStyle' }, { label: '功能', name: 'function' }],
        componentsOptions: {
          checkValList: [],
          ok: (checkValList) => {
            this.$set(this.searchData[this.searchData.length - 3].componentsOptions, 'checkValList', checkValList)
            this.searchFormDatas = { dyeTech: checkValList }
          }
        }
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
        ],
        itemStyle: { width: '33.33%', marginLeft: '12px' }
      },
      {
        itemType: 'operate',
        submitText: '查询',
        submitHandle: (params) => {
          this.getList(params)
          this.searchFormDatas = params
        },
        resetHandle: () => {
          // 清空染整方式
          this.$set(this.searchData[this.searchData.length - 3].componentsOptions, 'checkValList', [])
          this.searchFormDatas = { dyeTech: [] }
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
        permitTag: ['catalog:Api:Cloth:ClothProductFabricMain:update'],
        isShow: true,
        handle: async(params) => {
          this.$router.push(
            // {
            //   path: `/product-center/product-management/color-cloth/show/${params.row.id}`,
            //   query: {
            //     isEdit: true
            //   }
            // }
            // `/product-center/product-management/new-color-cloth/show/${params.row.id}?isEdit=true`
            `/product-center/product-management/color-cloth/show/${params.row.id}?isEdit=true`
          )
        }
      },
      {
        label: '删除',
        style: { color: '#FF4444' },
        permitTag: ['catalog:Api:Cloth:ClothProductFabricMain:destroy'],
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
      width: '100',
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
      searchFormDatas: { dyeTech: [] },
      isFirstEnter: false

    }
  },
  created() {
    this.getList()
    this.isFirstEnter = true
  },
  activated() {
    // console.log('来了-colorList', this.isFirstEnter)
    if (this.isFirstEnter) {
      this.isFirstEnter = false // 恢复默认值
      return
    }
    this.getList()
  },
  deactivated() {
    // console.log('离开-colorList')
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
     * @description 进入添加色布页面
     */
    addColourCloth() {
      this.$router.push({ name: 'ColourClothCreate' })
    },
    /**
     * @description 进入批量导入页面
     */
    importOrder() {
      this.$router.push({ name: 'ColourClothImport' })
    },
    /**
     * @description 批量导出
     */
    exportList: debounce(
      function() {
        this.exportLoadingFlag = true
        productFabricExport({ ...this.searchFormDatas })
          .then((res) => {
            location.href = res.data.url
            // this.fetchLog(
            //   this.getLogMessages('EXPORT', `${configData.productRequestPrefix}/api/cloth/productFabric/export`),
            //   { ...this.searchFormDatas },
            //   JSON.stringify({
            //     beforeText: `在'产品目录库-产品管理-色/花布列表'批量导出成功`,
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
      await chemicalFiberDestory({ id: row.id })
      this.fetchLog(
        this.getLogMessages('DEL', `${configData.productRequestPrefix}/api/cloth/productFabric/destroy`),
        { id: row.id, code: row.code },
        JSON.stringify({
          beforeText: `在'产品目录库-产品管理-色布列表'删除一条记录`,
          beforeCode: { id: row.id, code: row.code }
        })
      )
      await this.getList({
        ...this.searchFormDatas,
        pageSize: this.pagination.pageSize,
        page: this.pagination.page
      })
    },

    /**
     * @description 请求下拉数据
     */
    async setSelectData(typeName, index, init = false) {
      if (init) {
        this.$set(this.searchData[index], 'dataSource', [])
        this.$set(this.searchData[index], 'loading', true)
      } else {
        let res = null
        switch (typeName) {
          case '布类':
            res = await getClothSelectData()
            break
          case '布种':
            res = await fabricationsList()
            break
          case '染方式':
            res = await fabricationDyedList({ 'mode': 'D' })
            break
          case '织造花型':
            res = await fabricationKnitList({ 'mode': 'K' })
            break
          // case '幅宽类型':
          //   res = await fabricWidthTypeList()
          //   break
        }
        let data = []
        if (res.data && res.data.list) {
          data = res.data.list.map((item) => {
            item.label = item.name
            item.value = item.uuid
            return item
          })
        } else {
          data = res.data.map((item) => {
            item.label = item.name
            item.value = item.uuid
            return item
          })
        }
        this.$set(this.searchData[index], 'dataSource', data)
        this.$set(this.searchData[index], 'loading', false)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
$m-left: 3px !important;
.color-cloth-list {
  .search /deep/ .custom-form .el-form--inline {
    & > :nth-child(9) {
      .el-form-item__label-wrap {
        margin-left: $m-left;
      }
    }
    & > :nth-child(11) {
      .el-form-item__label-wrap {
        margin-left: $m-left;
      }
    }
    & > :nth-child(14) {
      .el-form-item__label-wrap {
        margin-left: 29px;
        // margin-left: $m-left;
      }
    }
  }
  .list-end /deep/ .el-table__empty-block {
    justify-content: end;
  }
}
</style>

