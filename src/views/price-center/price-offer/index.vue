<template>
  <div class="offer">
    <!-- 搜索表单 -->
    <div class="search">
      <cs-custom-form ref="searchForm" :data-source="searchData" :options="formOtions" :form-datas="formDatas" />
    </div>
    <div class="button">
      <el-button v-if="/crm/.test(branch) && $permission(['crm:quotationSheet:draft','crm:quotationSheet:submit'])" size="small" type="primary" @click="createOffer">新建</el-button>
      <el-button v-if="!/crm/.test(branch) && $permission(['price:quotationSheet:add'])" size="small" type="primary" @click="createOffer">新建</el-button>
    </div>
    <!-- table表格 -->
    <div class="page-table">
      <cs-custom-table
        :table-scrollx="true"
        tooltip-effect="dark"
        :columns="columns"
        :data-source="offerDataSource"
        :operates="popOperates"
        :pagination="pagination"
        edit-type="pop"
      />
    </div>
  </div>
</template>

<script>
import { Offer } from './components/index'
import { OfferRelevant } from './components/relevantIndex.js'
// import { PublicCrm } from '@/views/price-center/public/index'
import { PublicCrm } from '../public/index'
import status from './config/status.js'
import statusColor from '../public/config/statusColor'
export default {
  name: 'OfferList',
  mixins: [Offer, PublicCrm, OfferRelevant],
  data() {
    // 查询/重置 form表单配置信息
    const crmSearchData = [
      {
        prop: 'dataTag',
        itemType: 'select',
        label: '范围:',
        dataSource: [
          {
            value: 'ALL',
            label: '全部'
          },
          {
            value: 'ME',
            label: '我的'
          }
        ]
        // placeholder: '请输入员工姓名或者工号'
      },
      {
        prop: 'keyword',
        itemType: 'input',
        label: '请输入:',
        placeholder: '报价/商机/客户名称'
      },
      {
        prop: 'status',
        itemType: 'select',
        label: '状态:',
        dataSource: [
          {
            label: '全部',
            value: null
          },
          { value: 'D', label: '草稿' },
          { value: 'W', label: '审批中' },
          { value: 'C', label: '已同意' },
          { value: 'U', label: '使用中' },
          { value: 'A', label: '已接受' },
          { value: 'V', label: '已否决' },
          { value: 'R', label: '已拒绝' },
          { value: 'E', label: '已过期' }
        ]
      },
      {
        itemType: 'operate',
        submitText: '查询',
        submitHandle: params => {
          console.log('查询', params)
          this.getOfferPage(params)
          this.searchFormDatas = params
        },
        resetHandle: () => {
          this.searchFormDatas = {}
        }
      }
    ]
    // 查询/重置 form表单配置信息
    const priceSearchData = [
      {
        prop: 'dataTag',
        itemType: 'select',
        label: '范围:',
        dataSource: [
          {
            value: 'ALL',
            label: '全部'
          },
          {
            value: 'ME',
            label: '我的'
          }
        ]
      },
      {
        prop: 'keyword',
        itemType: 'input',
        maxlength: 50,
        placeholder: '输入报价/客户/品牌名称'
      },
      {
        itemType: 'operate',
        submitText: '查询',
        submitHandle: params => {
          console.log('查询', params)
          this.getOfferPage(params)
          this.searchFormDatas = params
        },
        resetHandle: () => {
          this.searchFormDatas = {}
        }
      }
    ]
    // 表格表头配置信息/以下五个都是table的配置信息
    const crmColumns = [
      {
        prop: 'id',
        label: '序号',
        width: '60',
        formater: scope => {
          return this.pagination.currentPage && (this.pagination.currentPage - 1) * 20 + scope.$index + 1
        }
      },
      {
        prop: 'quotationId',
        label: '报价编号',
        width: '140',
        showOverflowTooltip: true
      },
      {
        prop: 'quotationName',
        label: '报价名称',
        minWidth: '140',
        showOverflowTooltip: true,
        handle: scope => {
          console.log('scope', scope)
          this.$router.push(`/offer/offer-details-page/${scope.row.quotationId}`)
        },
        style: {
          color: '#1890ff',
          cursor: 'pointer'
        }
      },
      {
        prop: 'customerName',
        label: '客户',
        minWidth: '140',
        showOverflowTooltip: true,
        handle: scope => {
          scope.row.customerId && this.$router.push(`/customer/customer-details-page/${scope.row.customerId}`)
        },
        formater: scope => {
          return scope.row[scope.column.property] ? `<span style="color: #1890ff;cursor: pointer">${scope.row[scope.column.property]}</span>` : ''
        }
      },
      {
        prop: 'status',
        label: '报价状态',
        width: '100',
        formater: scope => {
          return scope.row[scope.column.property] ? `<span style="color: ${statusColor[status[scope.row[scope.column.property]]]}">${status[scope.row[scope.column.property]]}</span>` : ''
        }
      },
      {
        prop: 'fabricCount',
        label: '布类数量',
        showOverflowTooltip: true,
        align: 'right',
        minWidth: '100',
        formater: scope => {
          return scope.row[scope.column.property] || ''
        }
      },
      {
        prop: 'totalWeight',
        label: '数量合计(KG)',
        showOverflowTooltip: true,
        align: 'right',
        width: '120',
        style: { 'text-align': 'right', 'display': 'block', 'padding-right': '10px' },
        formater: scope => {
          return scope.row[scope.column.property] ? this.numRecursion(scope.row[scope.column.property]) : 0.00
        }
      },
      {
        prop: 'countryName',
        label: '国家/地区',
        showOverflowTooltip: true,
        minWidth: '100',
        formater: scope => {
          return scope.row[scope.column.property] || ''
        }
      },
      {
        prop: 'targetProfitRate',
        label: '目标利润率',
        showOverflowTooltip: true,
        align: 'right',
        minWidth: '100',
        formater: scope => {
          return scope.row[scope.column.property] ? scope.row[scope.column.property] + '%' : ''
        }
      },
      {
        prop: 'overallProfitMargin',
        label: '整体实际利润率',
        showOverflowTooltip: true,
        align: 'right',
        minWidth: '150',
        formater: scope => {
          return (scope.row.status !== 'D' && scope.row[scope.column.property]) ? scope.row[scope.column.property] + '%' : ''
        }
      },
      {
        prop: 'createdTime',
        label: '创建日期',
        width: '160',
        formater: scope => {
          return scope.row[scope.column.property] ? this.$filters.parseTime(scope.row[scope.column.property] + '', '{y}-{m}-{d} {h}:{i}') : ''
        }
      },
      {
        prop: 'follower',
        label: '所有人',
        showOverflowTooltip: true,
        minWidth: '70'
      }
    ]
    // 表格表头配置信息/以下五个都是table的配置信息
    const priceColumns = [
      {
        prop: 'id',
        label: '序号',
        width: '60',
        formater: scope => {
          return this.pagination.currentPage && (this.pagination.currentPage - 1) * 20 + scope.$index + 1
        }
      },
      {
        prop: 'quotationId',
        label: '报价编号',
        minWidth: '140',
        showOverflowTooltip: true
      },
      {
        prop: 'quotationName',
        label: '报价名称',
        minWidth: '150',
        showOverflowTooltip: true,
        handle: scope => {
          this.$router.push(`/price-offer/offer-details-page/${scope.row.quotationId}/${scope.row.id}`)
        },
        style: {
          color: '#1890ff',
          cursor: 'pointer'
        }
      },
      {
        prop: 'customerName',
        label: '客户',
        minWidth: '120',
        showOverflowTooltip: true
      },
      {
        prop: 'sellerTeamName',
        label: '销售部门',
        showOverflowTooltip: true,
        minWidth: '120'
      },
      {
        prop: 'sellerName',
        label: '销售员',
        showOverflowTooltip: true,
        minWidth: '100'
      },
      {
        prop: 'fabricCount',
        label: '布类数量',
        showOverflowTooltip: true,
        align: 'right',
        minWidth: '100',
        formater: scope => {
          return scope.row[scope.column.property] || ''
        }
      },
      {
        prop: 'totalWeight',
        label: '数量总计(KG)',
        showOverflowTooltip: true,
        align: 'right',
        width: '120',
        formater: scope => {
          return scope.row[scope.column.property] ? this.numRecursion(scope.row[scope.column.property]) : 0.00
        }
      },
      {
        prop: 'countryName',
        label: '国家/地区',
        showOverflowTooltip: true,
        minWidth: '100',
        formater: scope => {
          return scope.row[scope.column.property] || ''
        }
      },
      {
        prop: 'targetProfitRate',
        label: '目标利润率',
        showOverflowTooltip: true,
        align: 'right',
        minWidth: '100',
        formater: scope => {
          return scope.row[scope.column.property] ? scope.row[scope.column.property] + '%' : ''
        }
      },
      {
        prop: 'overallProfitMargin',
        label: '整体实际利润率',
        align: 'right',
        showOverflowTooltip: true,
        minWidth: '150',
        formater: scope => {
          return (scope.row.status !== 'D' && scope.row[scope.column.property]) ? scope.row[scope.column.property] + '%' : ''
        }
      },
      {
        prop: 'createdTime',
        label: '创建日期',
        width: '160',
        formater: scope => {
          return scope.row[scope.column.property] ? this.$filters.parseTime(scope.row[scope.column.property] + '', '{y}-{m}-{d} {h}:{i}') : ''
        }
      },
      {
        prop: 'createdBy',
        label: '创建人',
        showOverflowTooltip: true,
        minWidth: '70'
      }
    ]
    // 分页配置信息
    const pagination = {
      currentChange: val => {
        this.getOfferPage({ pageSize: this.pagination.pageSize || 20, pageNum: val })
      },
      sizeChange: val => {
        this.$set(this.pagination, 'currentPage', 1)
        this.getOfferPage({ pageNum: 1, pageSize: val })
      }
    }
    let crmHandleConf = [
      {
        label: '编辑',
        permitTag: ['crm:quotationSheet:modify'],
        isShow: scope => {
          return scope.row.status === 'D'
        },
        handle: params => {
          console.log(params)
          const branchFlag = /crm/.test(this.branch)
          // this.$router.push({ name: 'offer-add-edit-page', params: { id: params.row.quotationId }})
          this.$router.push(`/${branchFlag ? 'offer' : 'price-offer'}/offer-add-edit-page/${params.row.quotationId}`)
        }
      },
      {
        label: '删除',
        style: { 'color': '#FE4949' },
        permitTag: ['crm:quotationSheet:delete'],
        isShow: scope => {
          return scope.row.status === 'D'
        },
        handle: params => {
          this.$confirm(' 你确认要删除该报价吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              this.deleteOffer({ quotationId: params.row.quotationId })
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
    let priceHandleConf = [
      {
        label: '编辑',
        permitTag: ['price:quotationSheet:modify'],
        isShow: true,
        handle: params => {
          const branchFlag = /crm/.test(this.branch)
          this.$router.push(`/${branchFlag ? 'offer' : 'price-offer'}/offer-add-edit-page/${params.row.quotationId}/${branchFlag ? '' : params.row.id}`)
        }
      },
      {
        label: '删除',
        style: { 'color': '#FE4949' },
        permitTag: ['price:quotationSheet:delete'],
        isShow: true,
        handle: params => {
          this.$confirm(' 你确认要删除该报价吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              this.deleteOffer({ quotationId: params.row.quotationId, id: params.row.id })
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
    crmHandleConf = this.$filterPermission(crmHandleConf)
    priceHandleConf = this.$filterPermission(priceHandleConf)
    // 表格操作栏里面的配置信息
    const crmPopOperates = {
      label: '操作',
      width: '100',
      fixed: 'right',
      dataSource: crmHandleConf
    }
    // 表格操作栏里面的配置信息
    const pricePopOperates = {
      label: '操作',
      width: '100',
      fixed: 'right',
      dataSource: priceHandleConf
    }

    return {
      crmSearchData,
      priceSearchData,
      searchData: /crm/.test(this.branch) ? crmSearchData : priceSearchData,
      formDatas: {
        dataTag: 'ALL'
      },
      formOtions: {
        size: 'small',
        inline: true
      },
      crmColumns,
      priceColumns,
      columns: /crm/.test(this.branch) ? crmColumns : priceColumns,
      pagination,
      crmPopOperates,
      pricePopOperates,
      popOperates: /crm/.test(this.branch) ? crmPopOperates : pricePopOperates,
      offerDataSource: [],
      searchFormDatas: {},
      rowInfoMessages: {}
    }
  },
  computed: {
    // 获取分支是crm或者erp
    branch() {
      return this.$utils.getEnvInfo().branch
    }
  },
  created() {
    this.getOfferPage()
  },
  mounted() {
    this.searchData = /crm/.test(this.branch) ? this.crmSearchData : this.priceSearchData
    this.columns = /crm/.test(this.branch) ? this.crmColumns : this.priceColumns
    this.popOperates = /crm/.test(this.branch) ? this.crmPopOperates : this.pricePopOperates
  },
  methods: {
    createOffer() {
      // this.$router.push({ name: 'offer-add-edit-page' })
      this.$router.push(`/${/crm/.test(this.branch) ? 'offer' : 'price-offer'}/offer-add-edit-page`)
    }
  }
}
</script>

<style lang='scss' scoped>
.offer {
  padding: 20px;

}
</style>

<style lang="scss">
.popOptionsClass {
  .el-textarea__inner { //el_input中的隐藏属性
    resize: none;  //主要是这个样式
  }
}
</style>
