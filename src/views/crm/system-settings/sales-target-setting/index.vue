<template>
  <div class="sale-target">
    <!-- 搜索表单 -->
    <div class="search">
      <cs-custom-form ref="searchForm" :data-source="searchData" :options="formOtions" :form-datas="formDatas" />
    </div>
    <div class="button">
      <el-button v-permission="['userCenter:sysUser:add']" size="small" type="primary" @click="createSaleTarget">新建</el-button>
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
import { SaleTarget } from './components/index'
import { PublicCrm } from '@/views/crm/public/index'
import totalAmount from './components/total-amount.vue'
export default {
  mixins: [SaleTarget, PublicCrm],
  data() {
    // 公用验证正则
    const commonChangeReg = this.$getRules({})
    // 公用验证正则
    // const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    // 为数字正则
    const moneyReg = this.$getRules({ type: 'number', pattern: /^(([1-9]{1}\d{0,8})|(0{1}))(\.\d{1,2})?$/, message: '请输入最大9位整数或保留1到2位小数', trigger: ['blur'] })

    // 客户搜索
    // 用户搜索
    const userSearch = value => {
      if (value === '') {
        this.$set(this.popOptions.content[0], 'dataSource', [])
      } else {
        if (!this.getData3) {
          this.getData3 = this.$utils.debounce(this.remoteUserList, 300)
        }
        this.getData3({ realName: value, name: value }, 0, this.popOptions)
      }
    }
    // 查询/重置 form表单配置信息
    const searchData = [
      {
        prop: 'year',
        itemType: 'select',
        label: '年份:',
        dataSource: [
          {
            value: null,
            label: '全部'
          },
          {
            value: '2020',
            label: '2020'
          },
          {
            value: '2021',
            label: '2021'
          },
          {
            value: '2022',
            label: '2022'
          },
          {
            value: '2023',
            label: '2023'
          },
          {
            value: '2024',
            label: '2024'
          },
          {
            value: '2025',
            label: '2025'
          },
          {
            value: '2026',
            label: '2026'
          },
          {
            value: '2027',
            label: '2027'
          },
          {
            value: '2028',
            label: '2028'
          },
          {
            value: '2029',
            label: '2029'
          }
        ]
        // placeholder: '请输入员工姓名或者工号'
      },
      {
        itemType: 'operate',
        submitText: '查询',
        submitHandle: params => {
          console.log('查询', params)
          this.getSaleTargetPage(params)
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
        width: '80',
        formater: scope => {
          // console.log('scope', scope, this.pagination)
          return this.pagination.currentPage && (this.pagination.currentPage - 1) * 20 + scope.$index + 1
        // return scope.$index + 1
        }
      },
      {
        prop: 'userName',
        label: '用户',
        showOverflowTooltip: true,
        minWidth: '60'
      },
      {
        prop: 'year',
        label: '年份',
        width: '80'
      },
      {
        prop: 'totalAmount',
        label: '销售目标总金额',
        minWidth: '80',
        align: 'right',
        components: {
          totalAmount
        }
        // componentsOptions: {
        //   key: 'orgs',
        //   name: 'name'
        // }
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
        this.getSaleTargetPage({ pageSize: this.pagination.pageSize || 20, pageNum: val })
      },
      sizeChange: val => {
        // console.log('sizeChange', this.pagination)
        this.getSaleTargetPage({ pageNum: this.pagination.pageNum || 1, pageSize: val })
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
          this.PopDialogHandle(this.popOptions, '编辑销售目标')
          this.getSaleTargetInfo({ id: params.row.id })
        }
      },
      {
        label: '删除',
        style: { 'color': '#FE4949' },
        // permitTag: ['userCenter:sysDataMaskingRule:modify'],
        isShow: true,
        handle: params => {
          this.$confirm(' 你确认要删除该销售目标吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
          })
            .then(() => {
              this.deleteSaleTarget({ id: params.row.id })
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
        const [january, february, march, april, may, june, july, august, september, october, november, december] = this.months.map(item => params[item] ? (params[item] * 10000).toFixed() : null)
        // console.log(january, february, march, april, may, june, july, august, september, october, november, december)
        this.addOrEditSaleTarget({ ...params, january, february, march, april, may, june, july, august, september, october, november, december })
      },
      cancel: params => {
        this.closePopDialogHandle(this.popOptions)
        // console.log(params)
      },
      formDatas: {
      },
      formOptions: {
        inline: true,
        labelWidth: '50px'
      },
      content: [
        {
          prop: 'userId',
          itemType: 'select',
          filterable: true,
          className: 'commonRemoteSearch',
          remote: true,
          remoteMethod: userSearch,
          itemStyle: { 'width': '47%', 'marginRight': '0px' },
          label: '用户',
          rules: [commonChangeReg],
          dataSource: [],
          placeholder: '查找用户'
        },
        {
          prop: 'year',
          itemType: 'select',
          label: '年份',
          labelWidth: '70px',
          itemStyle: { 'width': '53%', 'marginRight': '0px' },
          rules: [commonChangeReg],
          dataSource: [
            {
              value: '2020',
              label: '2020'
            },
            {
              value: '2021',
              label: '2021'
            },
            {
              value: '2022',
              label: '2022'
            },
            {
              value: '2023',
              label: '2023'
            },
            {
              value: '2024',
              label: '2024'
            },
            {
              value: '2025',
              label: '2025'
            },
            {
              value: '2026',
              label: '2026'
            },
            {
              value: '2027',
              label: '2027'
            },
            {
              value: '2028',
              label: '2028'
            },
            {
              value: '2029',
              label: '2029'
            }
          ]
        },
        {
          prop: 'january',
          itemType: 'input',
          label: '1月',
          itemStyle: { 'width': '47%', 'marginRight': '0px' },
          rules: [moneyReg],
          placeholder: '请输入数字',
          maxlength: 12
        },
        {
          prop: 'february',
          itemType: 'input',
          label: '2月',
          labelWidth: '70px',
          itemStyle: { 'width': '53%', 'marginRight': '0px' },
          rules: [moneyReg],
          placeholder: '请输入数字',
          maxlength: 12
        },
        {
          prop: 'march',
          itemType: 'input',
          label: '3月',
          itemStyle: { 'width': '47%', 'marginRight': '0px' },
          rules: [moneyReg],
          placeholder: '请输入数字',
          maxlength: 12
        },
        {
          prop: 'april',
          itemType: 'input',
          label: '4月',
          labelWidth: '70px',
          itemStyle: { 'width': '53%', 'marginRight': '0px' },
          rules: [moneyReg],
          placeholder: '请输入数字',
          maxlength: 12
        },
        {
          prop: 'may',
          itemType: 'input',
          label: '5月',
          itemStyle: { 'width': '47%', 'marginRight': '0px' },
          rules: [moneyReg],
          placeholder: '请输入数字',
          maxlength: 12
        },
        {
          prop: 'june',
          itemType: 'input',
          label: '6月',
          labelWidth: '70px',
          itemStyle: { 'width': '53%', 'marginRight': '0px' },
          rules: [moneyReg],
          placeholder: '请输入数字',
          maxlength: 12
        },
        {
          prop: 'july',
          itemType: 'input',
          label: '7月',
          itemStyle: { 'width': '47%', 'marginRight': '0px' },
          rules: [moneyReg],
          placeholder: '请输入数字',
          maxlength: 12
        },
        {
          prop: 'august',
          itemType: 'input',
          label: '8月',
          labelWidth: '70px',
          itemStyle: { 'width': '53%', 'marginRight': '0px' },
          rules: [moneyReg],
          placeholder: '请输入数字',
          maxlength: 12
        },
        {
          prop: 'september',
          itemType: 'input',
          label: '9月',
          itemStyle: { 'width': '47%', 'marginRight': '0px' },
          rules: [moneyReg],
          placeholder: '请输入数字',
          maxlength: 12
        },
        {
          prop: 'october',
          itemType: 'input',
          label: '10月',
          labelWidth: '70px',
          itemStyle: { 'width': '53%', 'marginRight': '0px' },
          rules: [moneyReg],
          placeholder: '请输入数字',
          maxlength: 12
        },
        {
          prop: 'november',
          itemType: 'input',
          label: '11月',
          itemStyle: { 'width': '47%', 'marginRight': '0px' },
          rules: [moneyReg],
          placeholder: '请输入数字',
          maxlength: 12
        },
        {
          prop: 'december',
          itemType: 'input',
          label: '12月',
          labelWidth: '70px',
          itemStyle: { 'width': '53%', 'marginRight': '0px' },
          rules: [moneyReg],
          placeholder: '请输入数字',
          maxlength: 12
        }
      ]
    }
    return {
      searchData,
      formOtions: {
        size: 'small',
        inline: true
      },
      formDatas: {},
      columns,
      pagination,
      dataSource: [],
      months: ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'],
      popOperates,
      popOptions
    }
  },
  created() {
    this.getSaleTargetPage()
  },
  methods: {
    // createSaleTarget() {

    // }
  }
}
</script>

<style lang='scss' scoped>
.sale-target {
  padding: 20px;
  padding-bottom: 0;
  .button {
    // margin-bottom: 22px;
  }
}
</style>
