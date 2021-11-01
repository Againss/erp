<!--
 * @Date: 2020-09-27 14:24:59
 * @Author: Againss
 * @LastEditTime: 2021-07-26 11:25:30
 * @LastEditors: zhengjin
 * @Descripttion: 天然纤维列表
-->
<template>
  <div class="product-list-content">
    <!-- 搜索表单 -->
    <div class="search">
      <cs-custom-form
        ref="searchForm"
        :data-source="searchData"
        :options="formOtions"
      />
    </div>
    <!-- 新增按钮 -->
    <div class="button">
      <el-button
        v-permission="['catalog:Api:Yarn:NaturalFiber:store']"
        size="small"
        type="primary"
        @click="addButton"
      >新增</el-button>
      <el-button
        v-permission="['catalog:Api:Yarn:NaturalFiber:import']"
        size="small"
        @click="importOrder"
      >批量导入</el-button>
      <el-button
        v-permission="['catalog:Api:Yarn:NaturalFiber:export']"
        size="small"
        :loading="exportLoadingFlag"
        @click="exportList"
      >批量导出</el-button>
    </div>
    <!-- 表格 -->
    <div class="page-table">
      <cs-custom-table
        ref="singleTable"
        :columns="columns"
        tooltip-effect="dark"
        :data-source="dataSource"
        :pagination="pagination"
        :data-total="dataSource.length"
        :operates="popOperates"
        edit-type="pop"
        table-scrollx
      />
    </div>
  </div>
</template>

<script>
import logMethods from '@/views/product-center/mixin/log-methods'
import configData from '@/views/product-center/configDock/index.js'
import { debounce } from '@/utils'
import { publicSelectList } from '../../api'
import {
  pageList,
  ingredientsList,
  destroy,
  naturalFiberExport
} from './api'
export default {
  mixins: [logMethods],
  data() {
    // 表格表头配置信息/以下五个都是table的配置信息
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
            `/product-center/yarn-management/natural-fiber/is-show/${scope.row.id}?isShow=true`
          )
        },
        style: {
          color: 'rgb(24, 144, 255)',
          cursor: 'pointer'
        }
      },
      // {
      //   prop: 'yarnLevel',
      //   label: '纱线等级',
      //   minWidth: '100'
      // },
      {
        prop: 'colorYarnColorCode',
        label: '染纱色号',
        showOverflowTooltip: true,
        minWidth: '150',
        formater: (scope) => {
          return `${scope.row.colorYarnColorCode}${scope.row.colorName ? '-' + scope.row.colorName : ''}`
        }
      },
      {
        prop: 'type',
        label: '类型',
        minWidth: '100',
        formater: (scope) => {
          return scope.row.type === 1 ? '坯纱' : '色纱'
        }
      },
      {
        prop: 'embryoCode',
        label: '所属坯纱',
        showOverflowTooltip: true,
        minWidth: '150'
      },
      {
        prop: 'ingredients',
        label: '成分',
        showOverflowTooltip: true,
        minWidth: '150',
        formater: (scope) => {
          return scope.row.ingredients && scope.row.ingredients.name
            ? scope.row.ingredients.name
            : ''
        }
      },
      {
        prop: 'ratio',
        label: '比例',
        minWidth: '150',
        align: 'right',
        showOverflowTooltip: true,
        formater: (scope) => {
          return this.getRatio(scope.row.ratio)
        }
      },
      {
        prop: 'yarnCount',
        label: '纱支',
        minWidth: '120',
        align: 'right',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.yarnCount && scope.row.yarnCount.name
            ? scope.row.yarnCount.name
            : ''
        }
      },

      {
        prop: 'yarnType',
        label: '纱类',
        minWidth: '120',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.yarnType && scope.row.yarnType.name
            ? scope.row.yarnType.name
            : ''
        }
      },
      {
        prop: 'spinningMethod',
        label: '纺纱方法',
        minWidth: '120',
        formater: (scope) => {
          return scope.row.spinningMethod && scope.row.spinningMethod.name
            ? scope.row.spinningMethod.name
            : ''
        }
      },
      {
        prop: 'cardingMethod',
        label: '梳棉方法',
        minWidth: '120',
        formater: (scope) => {
          return scope.row.cardingMethod && scope.row.cardingMethod.name
            ? scope.row.cardingMethod.name
            : ''
        }
      },
      {
        prop: 'shortWistDirection',
        label: '捻向',
        minWidth: '120',
        formater: (scope) => {
          return scope.row.shortWistDirection &&
            scope.row.shortWistDirection.name
            ? scope.row.shortWistDirection.name
            : ''
        }
      },
      {
        prop: 'yarnDyeingAdaptability',
        label: '染色适应性',
        minWidth: '180',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.yarnDyeingAdaptability &&
            scope.row.yarnDyeingAdaptability.name
            ? scope.row.yarnDyeingAdaptability.name
            : ''
        }
      },
      {
        prop: 'dataSource',
        label: '数据来源',
        minWidth: '120',
        formater: (scope) => {
          return this.getDataFrom(scope.row.dataSource)
        }
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
        minWidth: '150',
        showOverflowTooltip: true,
        formater: (scope) => {
          return (
            (scope.row.updator &&
              `${scope.row.updator.name}/${scope.row.updator.realName}`) ||
            (scope.row.creator &&
              `${scope.row.creator.name}/${scope.row.creator.realName}`)
          )
        }
      },
      {
        prop: 'operatedTime',
        label: '更新时间',
        minWidth: '140',
        formater: (scope) => {
          return scope.row.createdTime && this.$filters.parseTime(
            scope.row.updatedTime || scope.row.createdTime,
            '{y}-{m}-{d} {h}:{i}'
          ) || ''
        },
        showOverflowTooltip: true
      }
    ]
    // 搜索
    const searchData = [
      {
        prop: 'code',
        itemType: 'input',
        label: '纱线编码:',
        placeholder: '请输入色纱/坯纱编码'
      },
      {
        prop: 'bdIngredientsUuid',
        label: '成分:',
        placeholder: '请选择成分',
        itemType: 'select',
        clearable: true,
        filterable: true,
        loading: true,
        visibleChange: (flag) => {
          if (flag) {
            this.setSelectData('成分', 1)
          } else {
            this.setSelectData('成分', 1, true)
          }
        },
        dataSource: []
      },
      {
        prop: 'bdYarnCountUuid',
        label: '纱支:',
        placeholder: '请选择纱支',
        itemType: 'select',
        filterable: true,
        clearable: true,
        visibleChange: (flag) => {
          if (flag) {
            this.setSelectData('纱支', 2)
          } else {
            this.setSelectData('纱支', 2, true)
          }
        },
        dataSource: []
      },
      {
        prop: 'bdYarnTypeUuid',
        label: '纱类:',
        placeholder: '请选择纱类',
        itemType: 'select',
        filterable: true,
        clearable: true,
        visibleChange: (flag) => {
          if (flag) {
            this.setSelectData('纱类', 3)
          } else {
            this.setSelectData('纱类', 3, true)
          }
        },
        dataSource: []
      },
      {
        prop: 'bdSpinningMethodUuid',
        label: '纺纱方法:',
        placeholder: '请选择纺纱方法',
        itemType: 'select',
        filterable: true,
        clearable: true,
        visibleChange: (flag) => {
          if (flag) {
            this.setSelectData('纺纱方法', 4)
          } else {
            this.setSelectData('纺纱方法', 4, true)
          }
        },
        dataSource: []
      },
      {
        prop: 'bdCardingMethodUuid',
        label: '梳棉方法:',
        placeholder: '请选择梳棉方法',
        itemType: 'select',
        filterable: true,
        clearable: true,
        visibleChange: (flag) => {
          if (flag) {
            this.setSelectData('梳棉方法', 5)
          } else {
            this.setSelectData('梳棉方法', 5, true)
          }
        },
        dataSource: []
      },
      {
        prop: 'colorYarnColorCode',
        itemType: 'input',
        label: '染纱色号:',
        placeholder: '请输入染纱色号'
      },
      {
        prop: 'type',
        label: '类型:',
        placeholder: '请选择类型',
        itemType: 'select',
        clearable: true,
        dataSource: [
          {
            label: '全部',
            value: null
          },
          {
            label: '色纱',
            value: 2
          },
          {
            label: '坯纱',
            value: 1
          }
        ]
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
        itemType: 'operate',
        submitText: '查询',
        submitHandle: (params) => {
          // console.log(params, '-----')
          this.searchFormDatas = params
          this.getList(params)
        },
        resetHandle: () => {
          this.searchFormDatas = {}
          // this.$router.push({ query: {}})
          // this.getList({ page: 1, pageSize: 20 })
        }
      }
    ]
    // 分页配置信息
    const pagination = {
      // currentPage: 1,
      // pageSize: 20,
      // dataTotal: dataSource.length,
      currentChange: (val) => {
        // console.log('currentChange', this.pagination)
        this.getList({ pageSize: this.pagination.pageSize || 20, page: val })
      },
      sizeChange: (val) => {
        // console.log('sizeChange', this.pagination)
        this.getList({ page: this.pagination.page || 1, pageSize: val })
        // this.setTableHeight()
      }
    }
    // 表头操作栏里dataSource的配置信息
    let dataList = [
      {
        label: '编辑',
        permitTag: ['catalog:Api:Yarn:NaturalFiber:update'],
        isShow: (scope) => {
          return scope.row.type === 2
        },
        handle: async(params) => {
          this.$router.push({
            name: 'naturalFiberdEdit',
            params: { id: params.row.id }
          })
        }
      },
      {
        label: '删除',
        style: { 'color': '#FE4949' },
        permitTag: ['catalog:Api:Yarn:NaturalFiber:destroy'],
        isShow: true,
        handle: async(params) => {
          this.$confirm(' 你确认要删除该数据吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async() => {
            const res = await destroy({ id: params.row.id })
            if (res.code === 200) {
              this.$message({
                type: 'success',
                message: '删除成功'
              })
              this.fetchLog(
                this.getLogMessages('DEL', `${configData.productRequestPrefix}/api/naturalFiber/destroy`),
                { uuid: params.row.uuid, code: params.row.code },
                JSON.stringify({
                  beforeText: `在'产品目录库-纱线管理-天然纤维'删除一条记录`,
                  beforeCode: { uuid: params.row.uuid, code: params.row.code }
                })
              )
              this.getList()
            }
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
    this.getList({ code: this.$route.query.yarnCode || '' })
    this.searchFormDatas = { code: this.$route.query.yarnCode || '' }
  },
  methods: {
    // 获取列表
    async getList(data = {}) {
      const res = await pageList({
        ...this.searchFormDatas,
        ...data
      })
      // console.log('用户列表', res)
      const userList = res.data.list || []
      this.dataSource = userList
      this.pagination = {
        ...this.pagination,
        dataTotal: res.data ? res.data.total : 0,
        ...data,
        currentPage: res.data.page,
        pageSize: res.data.pageSize
      }
    },
    /**
     * @description 进入批量导入页面
     */
    importOrder() {
      this.$router.push({ name: 'naturalManagementImport' })
    },
    /**
     * @description 批量导出
     */
    exportList: debounce(
      function() {
        this.exportLoadingFlag = true
        naturalFiberExport({ ...this.searchFormDatas })
          .then((res) => {
            location.href = res.data.url
            this.exportLoadingFlag = false
          })
          .catch(() => {
            this.exportLoadingFlag = false
          })
      },
      300,
      true
    ),
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
    // 比例
    getRatio(ratio) {
      if (ratio && ratio.length) {
        return ratio.reduce((str, item) => {
          return str ? str + '/' + item.ratio + '%' : str + item.ratio + '%'
        }, '')
      }
      return ''
    },
    // 新增
    addButton() {
      this.$router.push({ name: 'naturalFiberdAdd' })
    },
    // 搜索数据源
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
          case '纱支':
            res = await publicSelectList({ 'categoryId': 9 })
            break
          case '纱类':
            res = await publicSelectList({ 'categoryId': 1 })
            break
          case '纺纱方法':
            res = await publicSelectList({ 'categoryId': 2 })
            break
          case '梳棉方法':
            res = await publicSelectList({ 'categoryId': 3 })
            break
        }
        let data = []
        if (typeName === '成分') {
          if (res.data && res.data.list.length) {
            data = res.data.list.map((item) => {
              item.label = item.name
              item.value = item.uuid + '-' + item.type
              return item
            })
          }
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
    },
    /**
     * @description 搜索组件展开收起
     */
    extend() {
      // this.setTableHeight()
    }
  }
}
</script>

<style lang="scss" scoped>
.list-btn-group {
  display: flex;
  // justify-content: flex-end;
  align-items: center;
  margin-bottom: 10px;
}
</style>
