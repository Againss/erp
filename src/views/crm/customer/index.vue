<template>
  <div class="customer">
    <!-- 搜索表单 -->
    <div class="search">
      <cs-custom-form ref="searchForm" :data-source="searchData" :options="formOtions" :form-datas="formDatas" />
    </div>
    <div class="button">
      <el-button v-permission="['userCenter:sysUser:add']" size="small" type="primary" @click="createCustomer">新建</el-button>
    </div>
    <!-- table表格 -->
    <div class="page-table">
      <cs-custom-table
        tooltip-effect="dark"
        :columns="columns"
        :data-source="customerDataSource"
        :operates="popOperates"
        :pagination="pagination"
        edit-type="pop"
        highlight-current-row
      />
    </div>
    <!-- 导入pop弹出层 -->
    <div class="pop">
      <cs-custom-pop :options="customerPopOptions" />
    </div>
  </div>
</template>

<script>
// import { competitorPage, competitorAdd } from './api/index.js'
import { Customer } from './components/index'
import { PublicCrm } from '@/views/crm/public/index'
import { CustomerRelevant } from './components/relevantIndex.js'
export default {
  mixins: [Customer, PublicCrm, CustomerRelevant],
  data() {
    // 公用验证正则
    const commonChangeReg = this.$getRules({})
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    // 姓名正则
    // const nameReg = this.$getRules({ type: 'department', message: '最大长度为50', trigger: ['blur'] })
    // 省切换
    const provinceChange = this.customerProvinceChange

    // 省切换
    const cityChange = this.customerCityChange

    // const style = {
    //   'fontSize': '14px',
    //   'color': '#606266',
    //   'fontWeight': '400',
    //   'marginBottom': '5px',
    //   'marginLeft': '10px'
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
        placeholder: '请输入客户或中英文简称'
      },
      {
        prop: 'level',
        itemType: 'select',
        label: '客户级别:',
        dataSource: []
        // placeholder: '请输入员工姓名或者工号'
      },
      {
        itemType: 'operate',
        submitText: '查询',
        submitHandle: params => {
          console.log('查询', params)
          this.getCustomerPage(params)
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
        label: '客户名称',
        minWidth: '80',
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
        prop: 'shortName',
        label: '中文简称',
        showOverflowTooltip: true,
        width: '100'
        // handle: scope => {
        //   console.log('scope', scope)
        // }
      },
      {
        prop: 'ename',
        label: '英文简称',
        showOverflowTooltip: true,
        width: '100'
        // handle: scope => {
        //   console.log('scope', scope)
        // }
      },
      {
        prop: 'customerTypeName',
        label: '客户类型',
        showOverflowTooltip: true,
        minWidth: '80'
      },
      {
        prop: 'levelName',
        label: '客户级别',
        showOverflowTooltip: true,
        minWidth: '80'
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
        this.getCustomerPage({ pageSize: this.pagination.pageSize || 20, pageNum: val })
      },
      sizeChange: val => {
        // console.log('sizeChange', this.pagination)
        this.getCustomerPage({ pageNum: this.pagination.pageNum || 1, pageSize: val })
      }
    }
    let handleConf = [
      {
        label: '编辑',
        // permitTag: ['userCenter:sysDataMaskingRule:modify'],
        isShow: true,
        handle: params => {
          this.type = 'edit'
          console.log('编辑', params)
          this.PopDialogHandle(this.customerPopOptions, '编辑客户')
          this.getCustomerInfo({ customerId: params.row.customerId })
        }
      },
      {
        label: '删除',
        style: { 'color': '#FE4949' },
        // permitTag: ['userCenter:sysDataMaskingRule:modify'],
        isShow: true,
        handle: params => {
          this.$confirm(' 你确认要删除该客户吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
          })
            .then(() => {
              this.deleteCustomer({ customerId: params.row.customerId })
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
    const customerPopOptions = {
      itemType: 'dialog',
      visible: false,
      title: '修改',
      width: '720px',
      // okText: '保存',
      customClass: 'popOptionsClass',
      ok: params => {
        console.log('确认', params)
        delete params.follower
        this.addOrEditCustomer(params)
      },
      cancel: params => {
        this.closePopDialogHandle(this.customerPopOptions)
        // console.log(params)
      },
      formDatas: {
      },
      formOptions: {
        inline: true
        // labelWidth: '138px'
        // labelWidth: '111px'
      },
      content: [
        {
          prop: 'name',
          itemType: 'input',
          itemStyle: { 'width': '47%', 'marginRight': '0px' },
          maxlength: 50,
          label: '客户名称',
          rules: [commonBlurReg],
          placeholder: '请输入客户名称'
        },
        {
          prop: 'ename',
          itemType: 'input',
          labelWidth: '97px',
          itemStyle: { 'width': '53%', 'marginRight': '0px' },
          maxlength: 100,
          label: '英文名称',
          // rules: [commonBlurReg],
          placeholder: '请输入英文名称'
        },
        {
          prop: 'customerTypeId',
          itemType: 'select',
          itemStyle: { 'width': '47%', 'marginRight': '0px' },
          label: '客户类型',
          rules: [commonChangeReg],
          dataSource: []
        },
        {
          prop: 'level',
          itemType: 'select',
          labelWidth: '97px',
          itemStyle: { 'width': '53%', 'marginRight': '0px' },
          label: '客户级别',
          rules: [commonChangeReg],
          dataSource: []
        },
        {
          itemType: 'input',
          prop: 'shortName',
          maxlength: 20,
          itemStyle: { 'width': '47%', 'marginRight': '0px' },
          label: '中文简称',
          // rules: [commonChangeReg],
          placeholder: '请输入中文简称'
        },
        {
          prop: 'provinceId',
          itemType: 'select',
          labelWidth: '97px',
          itemStyle: { 'width': '53%', 'marginRight': '0px' },
          label: '省',
          dataSource: [],
          change: provinceChange
        },
        {
          prop: 'cityId',
          itemType: 'select',
          itemStyle: { 'width': '47%', 'marginRight': '0px' },
          label: '市',
          dataSource: [],
          change: cityChange
        },
        {
          prop: 'areaId',
          itemType: 'select',
          labelWidth: '97px',
          itemStyle: { 'width': '53%', 'marginRight': '0px' },
          label: '区',
          dataSource: []
        },
        {
          prop: 'address',
          itemType: 'input',
          itemStyle: { 'width': '47%', 'marginRight': '0px' },
          maxlength: 100,
          label: '详细地址',
          // rules: [commonBlurReg, nameReg],
          placeholder: '请输入详细地址'
        },
        {
          prop: 'customerDesc',
          itemType: 'input',
          itemStyle: { 'width': '100%', 'marginRight': 0 },
          maxlength: 1000,
          type: 'textarea',
          autosize: { minRows: 2, maxRows: 4 },
          label: '客户概述',
          // rules: [commonBlurReg, nameReg],
          placeholder: '请输入客户概述'
        },
        // {
        //   itemType: 'view',
        //   itemStyle: { 'width': '100%', 'marginRight': 0 },
        //   text: '签收、对帐、开票、支付方式等情况说明',
        //   style
        // },
        {
          prop: 'payDesc',
          itemType: 'input',
          itemStyle: { 'width': '100%', 'marginRight': 0 },
          maxlength: 1000,
          type: 'textarea',
          autosize: { minRows: 2, maxRows: 4 },
          label: '情况说明',
          // rules: [commonBlurReg, nameReg],
          placeholder: '签收、对帐、开票、支付方式等情况说明'
        },
        {
          prop: 'especiallyDesc',
          itemType: 'input',
          itemStyle: { 'width': '100%', 'marginRight': 0 },
          maxlength: 1000,
          type: 'textarea',
          autosize: { minRows: 2, maxRows: 4 },
          label: '特殊说明',
          // rules: [commonBlurReg, nameReg],
          placeholder: '请输入说明'
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
      customerDataSource: [],
      type: 'edit',
      customerPopOptions,
      searchFormDatas: {},
      customerleveList: [],
      customerTypeList: [],
      areaList: []
    }
  },
  created() {
    this.getCustomerPage()
    this.getAreaSearch({}, this.customerPopOptions, 5)
    this.getCustomerLeveList()
    this.getCustomerTypeList()
    // this.getCustomerLeveList()
  },
  methods: {
    createCustomer() {
      this.type = 'add'
      this.PopDialogHandle(this.customerPopOptions, '新建客户')
    }
  }
}
</script>

<style lang='scss' scoped>
.customer {
  padding: 20px;
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
.customer {
  .search {
    .el-form.el-form--inline .el-form-item__label-wrap {
      margin-left: 0px !important;
    }
  }
}
</style>

