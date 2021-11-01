<!--
 * @Date: 2020-09-29 17:06:16
 * @Author: Againss
 * @LastEditTime: 2021-07-26 11:48:44
 * @LastEditors: zhengjin
 * @Descripttion: 坯布列表
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
        v-permission="['catalog:Api:Cloth:Embryo:store']"
        size="small"
        type="primary"
        @click="addButton"
      >新增</el-button>
      <el-button
        v-permission="['catalog:Api:Cloth:Embryo:import']"
        size="small"
        @click="importOrder"
      >批量导入</el-button>
      <el-button
        v-permission="['catalog:Api:Cloth:Embryo:export']"
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
import logMethods from '@/views/product-center/mixin/log-methods'
import configData from '@/views/product-center/configDock/index.js'
import { debounce } from '@/utils'
import {
  pageList,
  destroy,
  fabricationsList,
  modeDyedList,
  modeKnitList,
  ingredientsList,
  embryoExport
} from './api'
export default {
  name: 'GreyClothList',
  mixins: [logMethods],
  data() {
    const columns = [
      {
        prop: 'code',
        label: '坯布编码',
        minWidth: '180',
        fixed: true,
        showOverflowTooltip: true,
        formater: scope => scope.row.code || '-',
        handle: (scope) => {
          this.$router.push(
            `/product-center/product-management/grey-cloth/is-show/${scope.row.id}?isShow=true`
          )
        },
        style: {
          color: 'rgb(24, 144, 255)',
          cursor: 'pointer'
        }
      },
      {
        prop: 'ingredients',
        label: '主成分',
        minWidth: '120',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row[scope.column.property]
            ? scope.row[scope.column.property].name
            : ''
        }
      },
      {
        prop: 'resilience',
        label: '是否弹力',
        minWidth: '80',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row[scope.column.property] === 1 ? '是' : '否'
        }
      },
      {
        prop: 'combination',
        label: '纱线组合',
        minWidth: '200',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row[scope.column.property]
            ? this.combinationFormater(scope.row.combination)
            : ''
        }
      },
      {
        prop: 'fabrication',
        label: '布种',
        minWidth: '150',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row[scope.column.property]
            ? scope.row[scope.column.property].name
            : ''
        }
      },
      {
        prop: 'fabricationDyed',
        label: '染方式',
        minWidth: '150',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row[scope.column.property]
            ? scope.row[scope.column.property].name
            : ''
        }
      },
      {
        prop: 'fabricationKnit',
        label: '织造花型',
        minWidth: '150',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row[scope.column.property]
            ? scope.row[scope.column.property].name
            : ''
        }
      },
      {
        prop: 'spacing',
        label: '条纹间距',
        showOverflowTooltip: true,
        minWidth: '150',
        formater: (scope) => {
          return scope.row[scope.column.property]
            ? this.spacingFormater(scope.row.spacing)
            : ''
        }
      },
      {
        prop: 'totalNeedleNumber',
        label: '总针数',
        minWidth: '80',
        align: 'right',
        showOverflowTooltip: true
      },
      {
        prop: 'weavingTech',
        label: '织工艺编码',
        minWidth: '120',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row[scope.column.property]
            ? scope.row[scope.column.property].name
            : ''
        }
      },
      {
        prop: 'dataSource',
        label: '数据来源',
        minWidth: '100',
        formater: (scope) => {
          return this.getDataFrom(scope.row.dataSource)
        }
      },
      {
        prop: 'productFrom',
        label: '产品来源',
        minWidth: '80',
        formater: (scope) => {
          return scope.row.productFrom === 1 ? '自有' : '外来'
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
        prop: 'updatedBy',
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
        prop: 'updatedTime',
        label: '更新时间',
        minWidth: '150',
        formater: (scope) => {
          return scope.row.createdTime && this.$filters.parseTime(
            scope.row.updatedTime || scope.row.createdTime,
            '{y}-{m}-{d} {h}:{i}'
          ) || ''
        }
      }
    ]
    // 搜索
    const searchData = [
      {
        prop: 'code',
        itemType: 'input',
        label: '坯布编码:',
        placeholder: '请输入坯布编码'
      },
      {
        prop: 'bdIngredientsUuid',
        label: '主成分:',
        placeholder: '请选择主成分',
        itemType: 'select',
        clearable: true,
        filterable: true,
        visibleChange: (flag) => {
          if (flag) {
            this.setSelectData('主成分', 1)
          }
        },
        dataSource: []
      },
      {
        prop: 'yarnCode',
        label: '纱线编码:',
        placeholder: '请输入纱线编码',
        itemType: 'input'
      },
      {
        prop: 'bdFabricationsUuid',
        label: '布种:',
        placeholder: '请选择布种',
        itemType: 'select',
        clearable: true,
        filterable: true,
        visibleChange: (flag) => {
          if (flag) {
            this.setSelectData('布种', 3)
          }
        },
        dataSource: []
      },
      {
        prop: 'bdFabricationProduceModeDyedUuid',
        label: '染方式:',
        placeholder: '染方式',
        itemType: 'select',
        filterable: true,
        clearable: true,
        visibleChange: (flag) => {
          if (flag) {
            this.setSelectData('染方式', 4)
          }
        },
        dataSource: []
      },
      {
        prop: 'bdFabricationProduceModeKnitUuid',
        label: '织造花型:',
        placeholder: '织造花型',
        itemType: 'select',
        filterable: true,
        clearable: true,
        visibleChange: (flag) => {
          if (flag) {
            this.setSelectData('织造花型', 5)
          }
        },
        dataSource: []
      },
      {
        prop: 'totalNeedleNumberTop',
        itemType: 'input',
        label: '总针数:',
        itemStyle: { width: '164px', 'padding-right': '15px !important' }
      },
      {
        prop: 'totalNeedleNumberEnd',
        itemType: 'input',
        label: '-',
        itemStyle: { width: '124px' }
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
          // const orgIds = params.orgIds ? params.orgIds[0] ? params.orgIds : [] : []
          // this.getUserList({ ...params, orgIds })
          // this.searchFormDatas = { ...params, orgIds }
          this.getList(params)
          this.searchFormDatas = params
        },
        resetHandle: () => {
          this.searchFormDatas = {}
          // console.log('重置', this.pagination)
          // this.getList({ pageNum: 1, pageSize: 20 })
        }
      }
    ]
    // 分页配置信息
    const pagination = {
      // currentPage: 1,
      // pageSize: 20,
      // dataTotal: dataSource.length,
      currentChange: (val) => {
        // 切换页数
        this.getList({
          pageSize: this.pagination.pageSize || 20,
          page: val
        })
      },
      sizeChange: (val) => {
        // 切换条数
        this.getList({ page: this.pagination.page || 1, pageSize: val })
        // this.setTableHeight()
      }
    }
    // 表头操作栏里dataSource的配置信息
    let dataList = [
      {
        label: '编辑',
        permitTag: ['catalog:Api:Cloth:Embryo:update'],
        isShow: true,
        handle: async(params) => {
          this.$router.push({
            name: 'greyClothDtails',
            params: { id: params.row.id }
          })
        }
      },
      {
        label: '删除',
        style: { 'color': '#FE4949' },
        permitTag: ['catalog:Api:Cloth:Embryo:destroy'],
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
                this.getLogMessages('DEL', `${configData.productRequestPrefix}/api/embryo/destroy`),
                { uuid: params.row.uuid, code: params.row.code },
                JSON.stringify({
                  beforeText: `在'产品目录库-产品管理-坯布'删除一条记录`,
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
      exportLoadingFlag: false,
      isFirstEnter: false
    }
  },
  created() {
    this.getList()
    this.isFirstEnter = true
  },
  activated() {
    // console.log('来了-greyList', this.isFirstEnter)
    if (this.isFirstEnter) {
      this.isFirstEnter = false // 恢复默认值
      return
    }
    this.getList()
  },
  deactivated() {
    // console.log('离开-greyList')
  },
  methods: {
    // 获取列表
    async getList(data = {}) {
      const res = await pageList({
        ...this.searchFormDatas,
        ...data,
        requireOrgFlag: 1,
        requireDataGroupFlag: 1
      })
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
      this.$router.push({ name: 'greyClothImport' })
    },
    /**
     * @description 批量导出
     */
    exportList: debounce(
      function() {
        this.exportLoadingFlag = true
        embryoExport({ ...this.searchFormDatas })
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
    // 新增
    addButton() {
      this.$router.push({ name: 'greyClothCreate' })
    },
    // 搜索数据源
    async setSelectData(typeName, index, init = false) {
      if (init) {
        this.$set(this.searchData[index], 'dataSource', [])
        this.$set(this.searchData[index], 'loading', true)
      } else {
        let res = null
        switch (typeName) {
          case '主成分':
            res = await ingredientsList()
            break
          case '布种':
            res = await fabricationsList()
            break
          case '染方式':
            res = await modeDyedList({ 'mode': 'D' })
            break
          case '织造花型':
            res = await modeKnitList({ 'mode': 'K' })
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
    // 格式化纱线组合
    combinationFormater(combination) {
      return combination.reduce((res, cru) => {
        return res + `${cru.code}/${cru.ratio}${cru.yarnLevel ? ('/' + cru.yarnLevel) : ''}<br>`
      }, '')
    },
    // 格式化间距
    spacingFormater(spacing) {
      return spacing.reduce((res, cru) => {
        res
          ? (res += ` | ${cru.colorYarnColorCode}${cru.colorName ? '-' + cru.colorName : ''}/${cru.height}`)
          : (res += `${cru.colorYarnColorCode}${cru.colorName ? '-' + cru.colorName : ''}/${cru.height}`)
        return res
      }, '')
    },
    /**
     * @description 搜索组件展开收起
     */
    extend() {
      // this.setTableHeight()
    },
    /**
     * @description 删除数据
     */
    deleteData(row) { }
  }
}
</script>

<style lang="scss" scoped>
.search /deep/ .custom-form .el-form--inline {
  & > :nth-child(8) {
    .el-form-item__label-wrap {
      margin-left: 0 !important;
    }
  }
}
</style>
