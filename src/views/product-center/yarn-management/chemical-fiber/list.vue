<!--
 * @Author: Sanmao
 * @Date: 2020-09-27 15:25:42
 * @LastEditors: zhengjin
 * @LastEditTime: 2021-07-29 20:19:42
 * @Descripttion: 化学纤维列表
-->
<template>
  <div class="product-list-content chemicalfiber-list">
    <!-- 搜索表单 -->
    <div class="search">
      <!-- <search
        ref="searchForm"
        :data-source="searchData"
        :form-datas="searchFormDatas"
      /> -->
      <cs-custom-form
        ref="searchForm"
        :data-source="searchData"
        :options="formOtions"
      />
    </div>
    <div class="button">
      <el-button
        v-permission="['catalog:Api:Yarn:ChemicalFiber:store']"
        type="primary"
        size="small"
        @click="addChemicalFiber"
      >新增</el-button>
      <el-button
        v-permission="['catalog:Api:Yarn:ChemicalFiber:import']"
        size="small"
        @click="importOrder"
      >批量导入</el-button>
      <el-button
        v-permission="['catalog:Api:Yarn:ChemicalFiber:export']"
        size="small"
        :loading="exportLoadingFlag"
        @click="exportList"
      >批量导出</el-button>
    </div>
    <div class="page-table">
      <cs-custom-table
        ref="singleTable"
        tooltip-effect="dark"
        :columns="columns"
        :data-source="dataSource"
        :pagination="pagination"
        :data-total="dataSource.length"
        :operates="popOperates"
        table-scrollx
      />
    </div>
  </div>
</template>
<script>
import logMethods from '@/views/product-center/mixin/log-methods.js'
import configData from '@/views/product-center/configDock/index.js'
import { publicSelectList } from '../../api/index.js'
import {
  pageList,
  chemicalFiberDestory,
  ingredientsList,
  chemicalFiberExport
} from './api'
import { debounce } from '@/utils'
export default {
  name: 'ChemicalFiberList',
  mixins: [logMethods],
  data() {
    // table数据
    const columns = [
      {
        prop: 'code',
        label: '纱线编码',
        minWidth: '180',
        fixed: true,
        showOverflowTooltip: true,
        formater: scope => scope.row.code || '-',
        handle: (scope) => {
          this.$router.push(
            `/product-center/yarn-management/chemical-fiber/is-show/${scope.row.id}?type=${scope.row.type}`
          )
        },
        style: {
          color: 'rgb(24, 144, 255)',
          cursor: 'pointer'
        }
      },
      {
        prop: 'colorYarnColorCode',
        label: '染纱色号',
        minWidth: '180',
        showOverflowTooltip: true,
        formater: (scope) => {
          return `${scope.row.colorYarnColorCode}${scope.row.colorName ? '-' + scope.row.colorName : ''}`
        }
      },
      {
        prop: 'type',
        label: '类型',
        minWidth: '100',
        formater: (scope) => {
          return scope.row && scope.row.type
            ? scope.row.type === 1
              ? '坯纱'
              : '色纱'
            : ''
        },
        showOverflowTooltip: true
      },
      {
        prop: 'embryoCode',
        label: '所属坯纱',
        minWidth: '150',
        showOverflowTooltip: true
      },
      {
        prop: 'fineness',
        label: '细度',
        minWidth: '120',
        formater: (scope) => {
          return (
            (scope.row && scope.row.fineness && scope.row.fineness.name) || ''
          )
        },
        showOverflowTooltip: true
      },
      {
        prop: 'ingredients',
        label: '成分',
        minWidth: '150',
        formater: (scope) => {
          return (
            (scope.row &&
              scope.row.ingredients &&
              scope.row.ingredients.name) ||
            ''
          )
        },
        showOverflowTooltip: true
      },
      {
        prop: 'productName',
        label: '丝类',
        minWidth: '120',
        formater: (scope) => {
          return (
            (scope.row &&
              scope.row.productName &&
              scope.row.productName.name) ||
            ''
          )
        },
        showOverflowTooltip: true
      },
      {
        prop: 'networkDegree',
        label: '网络度',
        minWidth: '120',
        formater: (scope) => {
          return (
            (scope.row &&
              scope.row.networkDegree &&
              scope.row.networkDegree.name) ||
            ''
          )
        },
        showOverflowTooltip: true
      },
      {
        prop: 'gloss',
        label: '光泽度',
        minWidth: '120',
        formater: (scope) => {
          return (scope.row && scope.row.gloss && scope.row.gloss.name) || ''
        },
        showOverflowTooltip: true
      },
      {
        prop: 'sectionShape',
        label: '截面形状',
        minWidth: '120',
        formater: (scope) => {
          return (
            (scope.row &&
              scope.row.sectionShape &&
              scope.row.sectionShape.name) ||
            ''
          )
        },
        showOverflowTooltip: true
      },
      {
        prop: 'silk',
        label: '特殊丝',
        minWidth: '120',
        formater: (scope) => {
          return (scope.row && scope.row.silk && scope.row.silk.name) || ''
        },
        showOverflowTooltip: true
      },
      {
        prop: 'functions',
        label: '功能',
        minWidth: '120',
        formater: (scope) => {
          return (
            (scope.row && scope.row.functions && scope.row.functions.name) || ''
          )
        },
        showOverflowTooltip: true
      },
      {
        prop: 'longWistDirection',
        label: '捻向',
        minWidth: '120',
        formater: (scope) => {
          return (
            (scope.row &&
              scope.row.longWistDirection &&
              scope.row.longWistDirection.name) ||
            ''
          )
        },
        showOverflowTooltip: true
      },
      {
        prop: 'colorMethod',
        label: '颜色',
        minWidth: '120',
        formater: (scope) => {
          return (
            (scope.row &&
              scope.row.colorMethod &&
              scope.row.colorMethod.name) ||
            ''
          )
        },
        showOverflowTooltip: true
      },
      {
        prop: 'stretch',
        label: '弹力程度',
        minWidth: '120',
        formater: (scope) => {
          return (
            (scope.row && scope.row.stretch && scope.row.stretch.name) || ''
          )
        },
        showOverflowTooltip: true
      },
      {
        prop: 'composeMethod',
        label: '组合方式',
        minWidth: '100',
        showOverflowTooltip: true
      },
      {
        prop: 'dataSource',
        label: '数据来源',
        minWidth: '120',
        formater: (scope) => {
          return this.getDataFrom(scope.row.dataSource)
          // return scope.row && scope.row.dataSource
          //   ? scope.row.dataSource === 1
          //     ? '产品目录库'
          //     : '样板'
          //   : ''
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
      // {
      //   prop: 'productSource',
      //   label: '产品来源',
      //   minWidth: '120',
      //   formater: (scope) => {
      //     return scope.row && scope.row.productSource
      //       ? scope.row.productSource === 1
      //         ? '自有'
      //         : '外来'
      //       : ''
      //   },
      //   showOverflowTooltip: true
      // },
      {
        prop: 'updator',
        label: '更新人',
        minWidth: '150',
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
        },
        showOverflowTooltip: true
      },
      {
        prop: 'updatedTime',
        label: '更新时间',
        minWidth: '140',
        formater: (scope) => {
          return scope.row.updatedTime ? this.$filters.parseTime(
            scope.row.updatedTime,
            '{y}-{m}-{d} {h}:{i}'
          ) : ''
        },
        showOverflowTooltip: true
      }
    ]
    // 搜索字段
    const searchData = [
      {
        prop: 'code',
        itemType: 'input',
        label: '纱线编码:',
        placeholder: '请输入色纱/坯纱编码',
        itemStyle: { width: '33.33%' }
      },
      {
        prop: 'colorYarnColorCode',
        itemType: 'input',
        label: '染纱色号:',
        placeholder: '请输入染纱色号',
        itemStyle: { width: '33.33%' }
      },
      {
        prop: 'composeMethod',
        itemType: 'input',
        label: '组合方式:',
        placeholder: '请输入组合方式',
        itemStyle: { width: '33.33%' }
      },
      {
        prop: 'bdIngredientsUuid',
        label: '成分:',
        placeholder: '请选择成分',
        itemType: 'select',
        loading: true,
        filterable: true,
        clearable: true,
        visibleChange: (flag) => {
          if (flag) {
            this.setSelectData('成分', 3)
          } else {
            this.setSelectData('成分', 3, true)
          }
        },
        dataSource: [],
        itemStyle: { width: '33.33%' }
      },

      {
        prop: 'bdSilkUuid',
        label: '特殊丝:',
        placeholder: '请选择特殊丝',
        itemType: 'select',
        loading: true,
        visibleChange: (flag) => {
          if (flag) {
            this.setSelectData('特殊丝', 4)
          } else {
            this.setSelectData('特殊丝', 4, true)
          }
        },
        dataSource: [],
        itemStyle: { width: '33.33%' }
      },
      {
        prop: 'bdProductNameUuid',
        label: '丝类:',
        placeholder: '请选择丝类',
        itemType: 'select',
        loading: true,
        visibleChange: (flag) => {
          if (flag) {
            this.setSelectData('丝类', 5)
          } else {
            this.setSelectData('丝类', 5, true)
          }
        },
        dataSource: [],
        itemStyle: { width: '33.33%' }
      },
      {
        prop: 'bdNetworkDegreeUuid',
        label: '网络度:',
        placeholder: '请选择网络度',
        itemType: 'select',
        loading: true,
        visibleChange: (flag) => {
          if (flag) {
            this.setSelectData('网络度', 6)
          } else {
            this.setSelectData('网络度', 6, true)
          }
        },
        dataSource: [],
        itemStyle: { width: '33.33%' }
      },

      {
        prop: 'type',
        label: '类型:',
        placeholder: '请选择类型',
        itemType: 'select',
        dataSource: [
          {
            label: '全部',
            value: null
          },
          {
            label: '色纱',
            value: '2'
          },
          {
            label: '坯纱',
            value: '1'
          }
        ],
        itemStyle: { width: '33.33%' }
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
        itemStyle: { width: '33.33%' }
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
          this.$router.push({ query: {}})
          // this.getList()
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
        // this.setTableHeight()
      }
    }
    // 表头操作栏里dataSource的配置信息
    let dataList = [
      {
        label: '编辑',
        permitTag: ['catalog:Api:Yarn:ChemicalFiber:update'],
        isShow: (scope) => {
          return scope.row.type === 2
        },
        handle: async(params) => {
          this.$router.push(
            `/product-center/yarn-management/chemical-fiber/show/${params.row.id}?isEdit=true&type=${params.row.type}`
          )
        }
      },
      {
        label: '删除',
        style: { color: '#FE4949' },
        permitTag: ['catalog:Api:Yarn:ChemicalFiber:destroy'],
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
      exportLoadingFlag: false
    }
  },
  created() {
    // console.log(process.env, 'process.env')
    // if (process.env.NODE_ENV === 'production') {
    //   console.log('生成')
    // } else {
    //   console.log('其他')
    // }
    this.getList({ code: this.$route.query.yarnCode || '' })
    this.searchFormDatas = { code: this.$route.query.yarnCode || '' }
  },

  methods: {
    // 数据来源
    getDataFrom(dataSource) {
      let str = '产品目录库'
      switch (dataSource) {
        case 1:
          str = '产品目录库'
          break
        case 2:
          str = '样板开发'
          break
        case 3:
          str = '客户订单'
          break
        case 4:
          str = '采购订单'
          break
        case 5:
          str = '工艺总结'
          break
        default:
          break
      }
      return str
    },
    /**
     * @description 获取列表
     */
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
     * @description 搜索下拉组件请求数据
     */
    async setSelectData(typeName, index, init = false) {
      if (init) {
        this.$set(this.searchData[index], 'dataSource', [])
        this.$set(this.searchData[index], 'loading', true)
      } else {
        let res = null
        switch (typeName) {
          case '成分':
            res = await ingredientsList()
            break
          case '特殊丝':
            res = await publicSelectList({ 'categoryId': 13 })
            break
          case '丝类':
            res = await publicSelectList({ 'categoryId': 4 })
            break
          case '网络度':
            res = await publicSelectList({ 'categoryId': 15 })
            break
        }
        let data = []
        if (res.data && res.data.list) {
          data = res.data.list.map((item) => {
            item.label = item.name
            item.value = item.uuid
            return item
          })
        } else {
          if (res.data.length > 0) {
            data = res.data.map((item) => {
              item.label = item.name
              item.value = item.uuid
              return item
            })
          }
        }
        this.$set(this.searchData[index], 'dataSource', data)
        this.$set(this.searchData[index], 'loading', false)
      }
    },
    /**
     * @description 删除数据
     */
    async deleteData(row) {
      await chemicalFiberDestory({ id: row.id })
      this.fetchLog(
        this.getLogMessages('DEL', `${configData.productRequestPrefix}/api/yarn/chemicalFiber/destroy`),
        { id: row.id, code: row.code },
        JSON.stringify({
          beforeText: `在'产品目录库-纱线管理-化学纤维列表'删除一条记录`,
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
     * @description 进入新增页面
     */
    addChemicalFiber() {
      this.$router.push({
        path: 'chemical-fiber/create',
        query: { 'type': '2' }
      })
    },
    /**
     * @description 进入批量导入页面
     */
    importOrder() {
      this.$router.push({ name: 'chemicalFiberImport' })
    },
    /**
     * @description 批量导出
     */
    exportList: debounce(
      function() {
        this.exportLoadingFlag = true
        chemicalFiberExport({ ...this.searchFormDatas })
          .then((res) => {
            location.href = res.data.url
            // this.fetchLog(
            //   this.getLogMessages('EXPORT', `${configData.productRequestPrefix}/api/yarn/chemicalFiber/export`),
            //   { ...this.searchFormDatas },
            //   JSON.stringify({
            //     beforeText: `在'产品目录库-纱线管理-化学纤维列表'批量导出成功`,
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
    )
  }
}
</script>

