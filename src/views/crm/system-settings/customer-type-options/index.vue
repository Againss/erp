<template>
  <div class="customer-type">
    <div class="button">
      <el-button v-permission="['userCenter:sysUser:add']" size="small" type="primary" @click="createCustomerType">新建</el-button>
    </div>
    <!-- table表格 -->
    <div class="page-table">
      <cs-custom-table
        tooltip-effect="dark"
        :columns="columns"
        :autoresize="true"
        :data-source="dataSource"
        :operates="popOperates"
        :pagination="pagination"
        edit-type="pop"
        highlight-current-row
      />
    </div>
    <!-- 导入pop弹出层 -->
    <div class="pop">
      <cs-custom-pop :options="popOptions" />
    </div>
  </div>
</template>

<script>
import { CustomerType } from './components/index'
import { PublicCrm } from '@/views/crm/public/index'
export default {
  mixins: [CustomerType, PublicCrm],
  data() {
    // 公用验证正则
    // const commonChangeReg = this.$getRules({})
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    // 为数字正则
    const numberReg = this.$getRules({ type: 'number', pattern: /^([12][0-9]|30|[1-9])$/, message: '请输入1~30的整数', trigger: ['blur'] })

    // 表格表头配置信息/以下五个都是table的配置信息
    const columns = [
      {
        prop: 'sort',
        label: '序号',
        width: '80'
        // formater: scope => {
        //   // console.log('scope', scope, this.pagination)
        //   return this.pagination.currentPage && (this.pagination.currentPage - 1) * 20 + scope.$index + 1
        // // return scope.$index + 1
        // }
      },
      {
        prop: 'name',
        label: '客户类型选项名称',
        showOverflowTooltip: true,
        minWidth: '60'
      },
      {
        prop: 'createdTime',
        label: '创建日期',
        width: '160',
        formater: scope => {
          return scope.row[scope.column.property] ? this.$filters.parseTime(scope.row[scope.column.property] + '', '{y}-{m}-{d} {h}:{i}:{s}') : ''
        }
      }
    ]
    // 分页配置信息
    const pagination = {
      // currentPage: 1,
      // pageSize: 20,
      // dataTotal: dataSource.length,
      currentChange: val => {
        // console.log('currentChange', this.pagination)
        this.getCustomerTypePage({ pageSize: this.pagination.pageSize || 20, pageNum: val })
      },
      sizeChange: val => {
        // console.log('sizeChange', this.pagination)
        this.getCustomerTypePage({ pageNum: this.pagination.pageNum || 1, pageSize: val })
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
          this.PopDialogHandle(this.popOptions, '编辑客户类型选项')
          this.getCustomerTypeInfo({ id: params.row.id })
        }
      },
      {
        label: '删除',
        style: { 'color': '#FE4949' },
        // permitTag: ['userCenter:sysDataMaskingRule:modify'],
        isShow: true,
        handle: params => {
          this.$confirm(' 你确认要删除该客户类型选项吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
          })
            .then(() => {
              this.deleteCustomerType({ id: params.row.id })
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
      dataSource: handleConf
    }
    // pop弹出框配置信息
    const popOptions = {
      itemType: 'dialog',
      visible: false,
      title: '修改',
      width: '720px',
      // okText: '保存',
      customClass: 'popOptionsClass',
      ok: params => {
        console.log('确认', params)
        delete params.follower
        this.addOrEditCustomerType(params)
      },
      cancel: params => {
        this.closePopDialogHandle(this.popOptions)
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
          label: '类型名称',
          itemStyle: { 'width': '47%', 'marginRight': '0px' },
          rules: [commonBlurReg],
          maxlength: 20,
          placeholder: '请输入客户类型选项名称'
        },
        {
          prop: 'sort',
          itemType: 'input',
          label: '序号',
          labelWidth: '97px',
          itemStyle: { 'width': '53%', 'marginRight': '0px' },
          rules: [commonBlurReg, numberReg],
          placeholder: '请输入1~30的整数'
        }
      ]
    }
    return {
      formOtions: {
        inline: true
      },
      formDatas: {},
      columns,
      pagination,
      dataSource: [],
      popOperates,
      popOptions
    }
  },
  created() {
    this.getCustomerTypePage()
  },
  methods: {
    // createCustomerType() {

    // }
  }
}
</script>

<style lang='scss'>
.customer-type {
  padding: 20px;
  padding-bottom: 0;
  .button {
    // margin-bottom: 22px;
  }
  .el-dialog__body {
    padding: 30px 60px;
  }
}
</style>

