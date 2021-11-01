<template>
  <div class="business-view-all-page">
    <div class="businessHeader">
      <span v-if="customerFormDatas.name" class="businessText">{{ customerFormDatas.name }}</span>
      <div class="details-button">
        <el-button size="mini" @click="viewAllAdd">新建</el-button>
        <!-- <el-button @click="$router.back()">返回</el-button> -->
      </div>
    </div>
    <!-- table表格 -->
    <div class="page-table">
      <cs-custom-table
        tooltip-effect="dark"
        :columns="businessColumns"
        :data-source="businessDataSource"
        :operates="businessPopOperates"
        :pagination="pagination"
        edit-type="pop"
        highlight-current-row
      />
    </div>
    <!-- 导入更改所有人pop弹出层 -->
    <div class="pop">
      <cs-custom-pop :options="businessPopOptions" />
    </div>
  </div>
</template>

<script>
import { PublicCrm } from '@/views/crm/public/index'
import { BusinessOpportunityRelevant } from '../../business-opportunity/components/relevantIndex.js'
import { customerInfo } from '../api/index.js'
export default {
  mixins: [PublicCrm, BusinessOpportunityRelevant],
  data() {
    // 公用验证正则
    const commonChangeReg = this.$getRules({})
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    // 为数字正则
    const moneyReg = this.$getRules({ type: 'number', pattern: /^(([1-9]{1}\d{0,8})|(0{1}))(\.\d{1,2})?$/, message: '请输入最多9位整数或保留1到2位小数', trigger: ['blur'] })

    // 分页配置信息
    const pagination = {
      // currentPage: 1,
      // pageSize: 20,
      // dataTotal: dataSource.length,
      currentChange: val => {
        // console.log('currentChange', this.pagination)
        this.getBusinessOpportunityPage({ pageSize: this.pagination.pageSize || 20, pageNum: val })
      },
      sizeChange: val => {
        // console.log('sizeChange', this.pagination)
        this.getBusinessOpportunityPage({ pageNum: this.pagination.pageNum || 1, pageSize: val })
      }
    }
    // 商机pop弹出框配置信息
    const businessPopOptions = {
      itemType: 'dialog',
      visible: false,
      title: '修改',
      width: '720px',
      // okText: '保存',
      customClass: 'popOptionsClass',
      ok: params => {
        console.log('确认', params)
        delete params.follower
        // const customerId = params.customerName
        const salesAmount = params.salesAmount && (params.salesAmount * 10000).toFixed()
        this.addOrEditBusinessOpportunity({ ...params, salesAmount })
      },
      cancel: params => {
        this.closePopDialogHandle(this.businessPopOptions)
        // console.log(params)
      },
      formDatas: {
      },
      formOptions: {
        inline: true
        // labelWidth: '111px'
      },
      content: [
        {
          prop: 'name',
          itemType: 'input',
          itemStyle: { 'width': '47%', 'marginRight': '0px' },
          maxlength: 50,
          label: '商机名称',
          rules: [commonBlurReg],
          placeholder: '请输入商机名称'
        },
        {
          prop: 'customerId',
          itemType: 'select',
          labelWidth: '97px',
          itemStyle: { 'width': '53%', 'marginRight': '0px' },
          label: '客户',
          className: 'commonRemoteSearch',
          disabled: true,
          filterable: true,
          remote: true,
          remoteMethod: this.remoteSearch,
          rules: [commonChangeReg],
          placeholder: '请查找客户',
          dataSource: []
        },
        {
          prop: 'salesAmount',
          itemType: 'input',
          itemStyle: { 'width': '47%', 'marginRight': '0px' },
          maxlength: 12,
          label: '销售金额',
          rules: [commonBlurReg, moneyReg],
          placeholder: '请输入销售金额'
        },
        {
          itemType: 'date',
          prop: 'endDate',
          labelWidth: '97px',
          itemStyle: { 'width': '53%', 'marginRight': '0px' },
          label: '结束日期',
          rules: [commonChangeReg],
          placeholder: '请选择日期'
        },
        {
          prop: 'businessStageId',
          itemType: 'select',
          itemStyle: { 'width': '47%', 'marginRight': '0px' },
          label: '商机阶段',
          change: this.stageChange,
          rules: [commonChangeReg],
          // placeholder: '请输入商机阶段',
          dataSource: []
        },
        {
          prop: 'probability',
          itemType: 'input',
          labelWidth: '97px',
          itemStyle: { 'width': '53%', 'marginRight': '0px' },
          label: '赢单概率',
          readonly: true,
          disabled: true,
          rules: [commonBlurReg]
          // placeholder: '请输入座机号'
        },
        {
          prop: 'remark',
          itemType: 'input',
          itemStyle: { 'width': '100%', 'marginRight': 0 },
          maxlength: 1000,
          type: 'textarea',
          autosize: { minRows: 2, maxRows: 4 },
          label: '备注',
          // rules: [commonBlurReg, nameReg],
          placeholder: '请输入备注'
        }
      ]
    }
    // 商机表格表头配置信息/以下五个都是table的配置信息
    const businessColumns = [
      {
        prop: 'id',
        label: '序号',
        width: '60',
        formater: scope => {
          // console.log('scope', scope, this.pagination)
          return this.pagination.currentPage && (this.pagination.currentPage - 1) * 20 + scope.$index + 1
        // return scope.$index + 1
        }
      },
      {
        prop: 'name',
        label: '商机名称',
        minWidth: '80',
        showOverflowTooltip: true,
        handle: scope => {
          console.log('scope', scope)
          this.$router.push(`/crm/business-opportunity/business-opportunity-details-page/${scope.row.businessOpportunityId}`)
        },
        style: {
          color: '#1890ff',
          cursor: 'pointer'
        }
      },
      // {
      //   prop: 'customerName',
      //   label: '客户',
      //   minWidth: '80',
      //   handle: scope => {
      //     console.log('scope', scope)
      //     this.$router.push(`/crm/customer/customer-details-page/${scope.row.customerId}`)
      //   },
      //   style: {
      //     color: '#1890ff',
      //     cursor: 'pointer'
      //   }
      // },
      {
        prop: 'salesAmount',
        label: '销售金额',
        align: 'right',
        minWidth: '120',
        formater: scope => {
          return scope.row[scope.column.property] && this.numRecursion(scope.row[scope.column.property] / 10000)
        }
      },
      {
        prop: 'endDate',
        label: '结束日期',
        width: '160',
        formater: scope => {
          return scope.row[scope.column.property] ? this.$filters.parseTime(scope.row[scope.column.property] + '', '{y}-{m}-{d} {h}:{i}:{s}') : ''
        }
      },
      {
        prop: 'businessStageId',
        label: '商机阶段',
        width: '100',
        formater: scope => {
          // console.log(this.businessOpportunityStage, scope.row[scope.column.property])
          return this.businessOpportunityStage.filter(item => item.id === scope.row[scope.column.property] * 1)[0].businessStage
        }
      },
      {
        prop: 'createdTime',
        label: '创建日期',
        width: '160',
        formater: scope => {
          return scope.row[scope.column.property] ? this.$filters.parseTime(scope.row[scope.column.property] + '', '{y}-{m}-{d} {h}:{i}:{s}') : ''
        }
      },
      {
        prop: 'follower',
        label: '所有人',
        showOverflowTooltip: true,
        width: '100'
      }
    ]
    // 商机操作栏
    const businessPopOperates = {
      label: '操作',
      width: '100',
      dataSource: [
        {
          label: '编辑',
          // permitTag: ['userCenter:sysDataMaskingRule:modify'],
          isShow: true,
          handle: params => {
            this.type = 'edit'
            console.log('编辑', params)
            this.PopDialogHandle(this.businessPopOptions, '编辑商机')
            this.getBusinessOpportunityInfo({ id: params.row.id })
          }
        },
        {
          label: '删除',
          style: { 'color': '#FE4949' },
          // permitTag: ['userCenter:sysDataMaskingRule:modify'],
          isShow: true,
          handle: params => {
            this.$confirm(' 你确认要删除该商机吗？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
              center: true
            })
              .then(() => {
                this.deleteBusinessOpportunity({ id: params.row.id })
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
    }
    // relevantBusinessOptions表格弹框配置信息
    // const relevantBusinessOptions = {
    //   relevantAddText: '新建',
    //   title: '商机',
    //   tip: 0,
    //   isTwo: true,
    //   viewAll: () => {},
    //   relevantAdd: () => {
    //     this.type = 'add'
    //     this.PopDialogHandle(this.businessPopOptions, '新建商机')
    //   },
    //   dataSource: [],
    //   popOperates: businessPopOperates,
    //   columns: businessColumns,
    //   popOptions: businessPopOptions
    // }
    return {
      businessPopOptions,
      businessColumns,
      businessDataSource: [],
      businessPopOperates,
      pagination,
      businessName: '',
      type: 'add',
      userList: [],
      businessOpportunityStage: [],
      customerFormDatas: {},
      formDatas: {
        dataTag: 'ALL'
      },
      searchFormDatas: {
        customerId: this.$route.params.id
      }
    }
  },
  computed: {
    routeId() {
      return this.$route.params.id
    }
  },
  created() {
    // this.getAreaSearch()
    this.getBusinessOpportunityPage()
    this.getCustomerInfo({ customerId: this.routeId })
  },
  methods: {
    viewAllAdd() {
      this.type = 'add'
      this.PopDialogHandle(this.businessPopOptions, '新建商机')
      const customerFormDatas = this.customerFormDatas
      this.$set(this.businessPopOptions.content[1], 'dataSource', [{ label: customerFormDatas.name, value: customerFormDatas.customerId }])
      this.setFormDatas(this.businessPopOptions, { customerId: customerFormDatas.customerId })
    },
    // 获取商机详情
    async getCustomerInfo(data = {}) {
      const res = await customerInfo(data)
      console.log('详情', res)
      // this.businessName = res.data.name
      this.customerFormDatas = res.data
      // const endDate = res.data.endDate ? this.$filters.parseTime(res.data.endDate + '', '{y}-{m}-{d}') : null
      // this.setFormDatas(this.businessPopOptions, { ...res.data, endDate })
      // this.stageChange(res.data.businessStageId)
    }
  }
}
</script>

<style lang='scss' scoped>
.business-view-all-page {
    padding:20px;
    // padding-bottom: 0;

    .businessHeader {
        height: 60px;
        border-bottom: 1px solid #E9EFF2;
        background-color: #fff;
        display: flex;
        align-items: center;
    }

    .businessText {
      font-size: 18px;
      font-weight: 400;
      flex:1;
      margin-left: 20px;
    }

    .details-button {
        display: flex;
        margin-right: 20px;
    }
}
</style>
