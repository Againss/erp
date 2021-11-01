<template>
  <div class="business-opportunity">
    <!-- 搜索表单 -->
    <div class="search">
      <cs-custom-form ref="searchForm" :data-source="searchData" :options="formOtions" :form-datas="formDatas" />
    </div>
    <div class="button">
      <el-button v-permission="['userCenter:sysUser:add']" size="small" type="primary" @click="createBusinessOpportunity">新建</el-button>
    </div>
    <!-- table表格 -->
    <div class="page-table">
      <cs-custom-table
        tooltip-effect="dark"
        :columns="columns"
        :autoresize="true"
        :data-source="businessDataSource"
        :operates="popOperates"
        :pagination="pagination"
        edit-type="pop"
        highlight-current-row
      />
    </div>
    <!-- 导入pop弹出层 -->
    <div class="pop">
      <cs-custom-pop :options="businessPopOptions" />
    </div>
  </div>
</template>

<script>
// import { competitorPage, competitorAdd } from './api/index.js'
import { BusinessOpportunity } from './components/index'
import { BusinessOpportunityRelevant } from './components/relevantIndex.js'
import { PublicCrm } from '@/views/crm/public/index'
export default {
  mixins: [BusinessOpportunity, PublicCrm, BusinessOpportunityRelevant],
  data() {
    // 公用验证正则
    const commonChangeReg = this.$getRules({})
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    // 金额数字正则
    const moneyReg = this.$getRules({ type: 'number', pattern: /^(([1-9]{1}\d{0,8})|(0{1}))(\.\d{1,2})?$/, message: '请输入最多9位整数或保留1到2位小数', trigger: ['blur'] })
    // 姓名正则
    // const nameReg = this.$getRules({ type: 'department', message: '最大长度为50', trigger: ['blur'] })
    // 远程搜索
    // const remoteSearch = value => {
    //   console.log(value)
    //   if (value === '') {
    //     this.$set(this.businessPopOptions.content[1], 'dataSource', [])
    //   } else {
    //     if (!this.getData) {
    //       this.getData = this.$utils.debounce(this.remoteCustomerPage, 300)
    //     }
    //     this.getData({ name: value, dataTag: 'ALL' }, 1)
    //   }
    // }
    // 查询/重置 form表单配置信息
    const searchData = [
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
        label: '名称:',
        placeholder: '请输入商机或者客户名称'
      },
      {
        prop: 'businessStageId',
        itemType: 'select',
        label: '商机阶段:',
        dataSource: []
        // placeholder: '请输入员工姓名或者工号'
      },
      {
        itemType: 'operate',
        submitText: '查询',
        submitHandle: params => {
          console.log('查询', params)
          this.getBusinessOpportunityPage(params)
          this.searchFormDatas = params
        },
        resetHandle: () => {
          this.searchFormDatas = {}
        }
      }
    ]
    // 表格表头配置信息/以下五个都是table的配置信息
    const columns = [
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
          this.$router.push(`/crm/business-opportunity/business-opportunity-details-page/${scope.row.id}`)
        },
        style: {
          color: '#1890ff',
          cursor: 'pointer'
        }
      },
      {
        prop: 'customerName',
        label: '客户',
        minWidth: '60',
        showOverflowTooltip: true,
        handle: scope => {
          console.log('scope', scope)
          this.$router.push(`/crm/customer/customer-details-page/${scope.row.customerId}`)
        },
        style: {
          color: '#1890ff',
          cursor: 'pointer'
        }
      },
      {
        prop: 'salesAmount',
        label: '销售金额',
        width: '120',
        align: 'right',
        formater: scope => {
          return scope.row[scope.column.property] && this.numRecursion(scope.row[scope.column.property] / 10000)
        }
      },
      {
        prop: 'endDate',
        label: '结束日期',
        width: '120',
        formater: scope => {
          return scope.row[scope.column.property] ? this.$filters.parseTime(scope.row[scope.column.property] + '', '{y}-{m}-{d}') : ''
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
        minWidth: '70'
      }
    ]
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
    let handleConf = [
      {
        label: '编辑',
        // permitTag: ['userCenter:sysDataMaskingRule:modify'],
        isShow: scope => {
          console.log(scope)
          return scope.row.businessStageWinRate !== '0'
        },
        handle: params => {
          this.type = 'edit'
          console.log('编辑', params)
          this.PopDialogHandle(this.businessPopOptions, '编辑商机')
          this.getBusinessOpportunityInfo({ id: params.row.id })
        }
      },
      {
        label: '删除',
        // permitTag: ['userCenter:sysDataMaskingRule:modify'],
        style: { 'color': '#FE4949' },
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
    handleConf = this.$filterPermission(handleConf)
    // 表格操作栏里面的配置信息
    const popOperates = {
      label: '操作',
      width: '100',
      fixed: 'right',
      dataSource: handleConf
    }

    // pop弹出框配置信息
    const businessPopOptions = {
      itemType: 'dialog',
      visible: false,
      title: '修改',
      width: '720px',
      // okText: '保存',
      customClass: 'popOptionsClass',
      ok: params => {
        console.log('确认', params)
        // const customerId = params.customerName
        delete params.follower
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
    return {
      searchData,
      formDatas: {
        dataTag: 'ALL'
      },
      formOtions: {
        size: 'small',
        inline: true
      },
      columns,
      pagination,
      popOperates,
      businessDataSource: [],
      type: 'edit',
      businessPopOptions,
      searchFormDatas: {},
      businessOpportunityStage: []
    }
  },
  created() {
    this.getBusinessOpportunityPage()
    // this.getBusinessOpportunityStage()
  },
  methods: {
    createBusinessOpportunity() {
      this.type = 'add'
      this.PopDialogHandle(this.businessPopOptions, '新建商机')
      this.$set(this.businessPopOptions.content[1], 'dataSource', [])
    }
  }
}
</script>

<style lang='scss' scoped>
.business-opportunity {
  padding: 20px;
  // padding-bottom: 0;
  .button {
    // margin-bottom: 22px;
  }

}
</style>

<style lang="scss">
.popOptionsClass {
  .el-textarea__inner { //el_input中的隐藏属性
    resize: none;  //主要是这个样式
  }
}
</style>

<style lang="scss">
.business-opportunity {
  .search {
    .el-form.el-form--inline .el-form-item__label-wrap {
      margin-left: 0px !important;
    }
  }
}
</style>

