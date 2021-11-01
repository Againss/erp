<!--
 * @Author: Againss
 * @Date: 2020-09-27 15:25:42
 * @LastEditors: zhengjin
 * @LastEditTime: 2021-07-26 15:57:09
 * @Descripttion: 组合纱列表
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
        v-permission="['catalog:Api:Yarn:Composite:store']"
        size="small"
        type="primary"
        @click="addButton"
      >新增</el-button>
      <el-button
        v-permission="['catalog:Api:Yarn:Composite:import']"
        size="small"
        @click="importOrder"
      >批量导入</el-button>
      <el-button
        v-permission="['catalog:Api:Yarn:Composite:export']"
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
import { pageList, destroy, spuExport } from './api'
import { debounce } from '@/utils'
export default {
  name: 'CombinationList',
  mixins: [logMethods],
  data() {
    const columns = [
      {
        prop: 'code',
        label: '纱线编码',
        minWidth: '150',
        fixed: true,
        showOverflowTooltip: true,
        formater: scope => scope.row.code || '-',
        handle: (scope) => {
          this.$router.push(
            `/product-center/yarn-management/combination-yarn/is-show/${scope.row.id}?isShow=true`
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
      // {
      //   prop: 'yarnType',
      //   label: '纱线类型',
      //   minWidth: '180',
      //   formater: (scope) => {
      //     return scope.row.yarnType === 1 ? '包覆纱' : '合捻纱'
      //   }
      // },
      {
        prop: 'composeMethod',
        label: '组合方式',
        minWidth: '120',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.composeMethod ? scope.row.composeMethod.name : ''
        }
      },
      {
        prop: 'resilience',
        label: '是否弹力',
        minWidth: '100',
        formater: (scope) => {
          return scope.row.resilience === 1 ? '是' : '否'
        }
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
        prop: 'combination',
        label: '纱线组合',
        minWidth: '250',
        showOverflowTooltip: true,
        formater: (scope) => {
          return this.getHtml(scope)
        },
        style: {
          color: 'rgb(24, 144, 255)',
          cursor: 'pointer'
        }
      },
      {
        prop: 'dataSource',
        label: '数据来源',
        minWidth: '120',
        formater: (scope) => {
          // return scope.row.dataSource === 1 ? '产品目录库' : '样板'
          return this.getDataFrom(scope.row.dataSource)
        }
      },
      // {
      //   prop: 'productSource',
      //   label: '产品来源',
      //   minWidth: '120',
      //   formater: (scope) => {
      //     return scope.row.productSource === 1 ? '自有' : '外来'
      //   }
      // },
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
        minWidth: '140',
        formater: (scope) => {
          return scope.row.updatedTime ? this.$filters.parseTime(
            scope.row.updatedTime,
            '{y}-{m}-{d} {h}:{i}'
          ) : ''
        }
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
        prop: 'codes',
        itemType: 'input',
        label: '组合编码:',
        placeholder: '请输入组合编码'
      },
      {
        prop: 'skuStatus',
        label: '状态:',
        placeholder: '请选择状态',
        itemType: 'select',
        dataSource: [
          {
            label: '全部',
            value: ''
          },
          {
            label: '正式',
            value: '1'
          },
          {
            label: '临时',
            value: '2'
          }
        ]
      },
      {
        itemType: 'operate',
        submitText: '查询',
        submitHandle: (params) => {
          console.log('查询', params)
          // const orgIds = params.orgIds ? params.orgIds[0] ? params.orgIds : [] : []
          // this.getUserList({ ...params, orgIds })
          // this.searchFormDatas = { ...params, orgIds }
          this.searchFormDatas = params
          this.getList(params)
        },
        resetHandle: () => {
          this.searchFormDatas = {}
          // this.getList()
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
        permitTag: ['catalog:Api:Yarn:Composite:update'],
        isShow: true,
        handle: async(params) => {
          this.$router.push({
            name: 'combinationDtails',
            params: { id: params.row.id }
          })
        }
      },
      {
        label: '删除',
        style: { 'color': '#FE4949' },
        permitTag: ['catalog:Api:Yarn:Composite:destroy'],
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
                this.getLogMessages('DEL', `${configData.productRequestPrefix}/api/yarn/composite/destroy`),
                { id: params.row.id, code: params.row.code },
                JSON.stringify({
                  beforeText: `在'产品目录库-纱线管理-组合纱'删除一条记录`,
                  beforeCode: { id: params.row.id, code: params.row.code }
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
    // const combinationArr = []
    // const combinationstr = ''
    return {
      columns,
      searchData,
      pagination,
      dataList,
      popOperates,
      dataSource: [],
      formOtions: {
        inline: true,
        size: 'small'
      },
      exportLoadingFlag: false,
      isFirstEnter: false
      // combinationArr,
      // combinationstr
    }
  },
  created() {
    this.getList()
    this.isFirstEnter = true
  },
  activated() {
    // console.log('来了-组合List', this.isFirstEnter)
    if (this.isFirstEnter) {
      this.isFirstEnter = false // 恢复默认值
      return
    }
    this.getList()
  },
  deactivated() {
    // console.log('离开-组合List')
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
    getHtml(data) {
      let options = ''
      let itemFlag = false
      const ulrarr = window.location.href.split('product-center/')
      data.row.combination.map((red) => {
        const item = `${red.yarnClass === 1 ? '天然纤维' : '化学纤维'}-${red.yarnCode
        }/${red.proportion}%<br>`
        if (red.yarnClass === 1) {
          // 跳转到天然纤维
          itemFlag = false
        } else {
          // 跳转到化学纤维
          itemFlag = true
        }
        options += `<a href="${itemFlag
          ? ulrarr[0] +
          `product-center/yarn-management/chemical-fiber?yarnCode=${red.yarnCode}`
          : ulrarr[0] +
          `product-center/yarn-management/natural-fiber?yarnCode=${red.yarnCode}`
        }">${item}</a>`
      })
      return options
    },
    // 获取列表
    async getList(data = {}) {
      const res = await pageList({
        ...this.searchFormDatas,
        ...data,
        requireOrgFlag: 1,
        requireDataGroupFlag: 1
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
    // 新增
    addButton() {
      this.$router.push({ name: 'combinationCreate' })
    },
    /**
     * @description 搜索组件展开收起
     */
    extend() {
      // this.setTableHeight()
    },
    /**
     * @description 进入批量导入页面
     */
    importOrder() {
      this.$router.push({ name: 'combinationYarnImport' })
    },
    /**
     * @description 批量导出
     */
    exportList: debounce(
      function() {
        this.exportLoadingFlag = true
        spuExport({ ...this.searchFormDatas })
          .then((res) => {
            console.log(res, 'res')
            location.href = res.data.url
            // return
            // const url = window.location.href.substring(4, 5)
            // if (url === 's') {
            //   location.href = 'https://' + res.data.url
            // } else {
            //   location.href = 'http://' + res.data.url
            // }
            // const a = document.getElementById('downloadId')
            // const a_href = document.createAttribute('href')
            // a_href.nodeValue = res.data.url
            // a.setAttributeNode(a_href)
            // const e = document.createEvent('MouseEvents')
            // e.initEvent('click', true, true)
            // a.dispatchEvent(e)
            // this.fetchLog(
            //   this.getLogMessages('EXPORT', `${configData.productRequestPrefix}/api/yarn/chemicalFiber/export`),
            //   { ...this.searchFormDatas },
            //   JSON.stringify({
            //     beforeText: `在'产品目录库-纱线管理-组合纱列表'批量导出成功`,
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
<style lang="scss" scoped>
</style>
