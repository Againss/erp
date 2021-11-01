<!--
 * @Date: 2020-09-29 17:06:16
 * @Author: Againss
 * @LastEditTime: 2021-07-26 13:41:38
 * @LastEditors: zhengjin
 * @Descripttion: 复合布列表
-->

<template>
  <div class="list-content">
    <!-- 搜索表单 -->
    <div class="search">
      <cs-custom-form
        ref="searchForm"
        :data-source="searchData"
        :options="formOtions"
        :form-datas="formDatas"
      />
    </div>
    <div class="add-btn">
      <el-button
        v-permission="['catalog:Api:Cloth:ClothCombineFabric:store']"
        size="small"
        type="primary"
        @click="addChemicalFiber"
      >新增</el-button>
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
import { pageList, destroy } from './api'
import configData from '@/views/product-center/configDock/index.js'
export default {
  name: 'CompositeClothList',
  mixins: [logMethods],
  data() {
    const columns = [
      {
        prop: 'code',
        label: '复合布编码',
        minWidth: '150',
        fixed: true,
        showOverflowTooltip: true,
        formater: scope => scope.row.code || '-',
        handle: (scope) => {
          this.$router.push(
            `/product-center/product-management/composite-cloth/is-show/${scope.row.id}`
          )
        },
        style: {
          color: 'rgb(24, 144, 255)',
          cursor: 'pointer'
        }
      },
      {
        prop: 'productFabric',
        label: '布料组合',
        minWidth: '200',
        formater: (scope) => {
          return scope.row[scope.column.property]
            ? this.combinationFormater(scope.row.productFabric)
            : ''
        }
      },
      {
        prop: 'spuCode',
        label: 'SPU编码',
        minWidth: '180'
      },
      {
        prop: 'dataSource',
        label: '数据来源',
        minWidth: '180',
        formater: (scope) => {
          return scope.row.dataSource === 1 ? '产品目录库' : '样板'
        }
      },
      {
        prop: 'productSource',
        label: '产品来源',
        minWidth: '180',
        formater: (scope) => {
          return scope.row.productSource === 1 ? '自有' : '外来'
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
        prop: 'updatedTime',
        label: '更新时间',
        minWidth: '140',
        formater: (scope) => {
          return (
            scope.row.updatedTime &&
            this.$filters.parseTime(
              scope.row.updatedTime,
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
        itemType: 'input',
        label: '复合布编码:',
        placeholder: '请输入复合布编码'
      },
      {
        prop: 'productFabricCode',
        itemType: 'input',
        label: '组合编码:',
        placeholder: '请输入组合编码'
      },
      {
        prop: 'spuCode',
        itemType: 'input',
        label: 'SPU编码:',
        placeholder: '请输入SPU编码'
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
          // this.getUserList({ pageNum: 1, pageSize: 20 })
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
          pageSize: this.pagination.pageSize || 10,
          pageNum: val
        })
      },
      sizeChange: (val) => {
        // 切换条数
        this.getList({ pageNum: this.pagination.pageNum || 1, pageSize: val })
        // this.setTableHeight()
      }
    }
    // 表头操作栏里dataSource的配置信息
    let dataList = [
      {
        label: '编辑',
        permitTag: ['catalog:Api:Cloth:ClothCombineFabric:update'],
        isShow: true,
        handle: async(params) => {
          this.$router.push(
            `/product-center/product-management/composite-cloth/show/${params.row.id}?isEdit=true`
          )
        }
      },
      {
        label: '删除',
        style: { 'color': '#FE4949' },
        permitTag: ['catalog:Api:Cloth:ClothCombineFabric:destroy'],
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
                this.getLogMessages(
                  'DEL',
                  `${configData.productRequestPrefix}/api/cloth/combineFabric/destroy`
                ),
                { id: params.row.id, code: params.row.code },
                JSON.stringify({
                  beforeText: `在'产品目录库-产品管理-复合布列表'删除一条记录`,
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
      width: '150',
      fixed: 'right',
      dataSource: dataList
    }
    return {
      formOtions: {
        size: 'small',
        // layout: true,
        inline: true
      },
      columns,
      searchData,
      pagination,
      dataList,
      popOperates,
      dataSource: [],
      formDatas: {},
      isFirstEnter: false
    }
  },
  created() {
    this.getList()
    this.isFirstEnter = true
  },
  activated() {
    // console.log('来了-comList', this.isFirstEnter)
    if (this.isFirstEnter) {
      this.isFirstEnter = false // 恢复默认值
      return
    }
    this.getList()
  },
  deactivated() {
    // console.log('离开-comList')
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
      // console.log('用户列表', res)
      const userList = res.data.list || []
      this.dataSource = userList
      this.pagination = {
        ...this.pagination,
        dataTotal: res.data ? res.data.total : 0,
        ...data,
        currentPage: res.data.pageNum,
        pageSize: res.data.pageSize
      }
    },
    // 格式化布料组合
    combinationFormater(productFabric) {
      return productFabric.reduce((res, cru) => {
        return res + `${cru.code}<br>`
      }, '')
    },
    /**
     * @description 删除数据
     */
    deleteData(row) { },
    addChemicalFiber() {
      this.$router.push({ name: 'compositeClothCreate' })
    }
  }
}
</script>
<style lang="scss" scoped>
.list-content {
  padding: 20px;
}
.add-btn {
  margin-bottom: 10px;
  text-align: left;
}
</style>
