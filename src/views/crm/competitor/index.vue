<template>
  <div class="competitor">
    <!-- 搜索表单 -->
    <div class="search">
      <cs-custom-form ref="searchForm" :data-source="searchData" :options="formOtions" :form-datas="formDatas" />
    </div>
    <div class="button">
      <el-button v-permission="['userCenter:sysUser:add']" size="small" type="primary" @click="createCompetitor">新建</el-button>
    </div>
    <!-- table表格 -->
    <div class="page-table">
      <cs-custom-table
        tooltip-effect="dark"
        :columns="columns"
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
// import { competitorPage, competitorAdd } from './api/index.js'
import { Competitor } from './components/index'
import { PublicCrm } from '@/views/crm/public/index'
export default {
  mixins: [Competitor, PublicCrm],
  data() {
    // 公用验证正则
    // const commonChangeReg = this.$getRules({})
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    // 手机验证正则
    // const phoneReg = this.$getRules({ type: 'phone', trigger: ['blur'] })
    // 数字验证
    const numberReg = this.$getRules({ type: 'number', trigger: ['blur'] })
    // 金额数字正则
    const moneyReg = this.$getRules({ type: 'number', pattern: /^(([1-9]{1}\d{0,8})|(0{1}))(\.\d{1,2})?$/, message: '请输入最多9位整数或保留1到2位小数', trigger: ['blur'] })
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
        prop: 'name',
        itemType: 'input',
        label: '名称:',
        placeholder: '请输入竞争对手名称'
      },
      {
        itemType: 'operate',
        submitText: '查询',
        submitHandle: params => {
          console.log('查询', params)
          this.getCompetitorPage(params)
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
        label: '竞争对手名',
        showOverflowTooltip: true,
        minWidth: '60',
        handle: scope => {
          console.log('scope', scope)
          this.$router.push(`/crm/competitor/competitor-details-page/${scope.row.id}`)
        },
        style: {
          color: '#1890ff',
          cursor: 'pointer'
        }
      },
      {
        prop: 'provinceId',
        label: '省',
        width: '100',
        showOverflowTooltip: true,
        formater: scope => {
          // console.log(scope.row[scope.column.property], this.areaList.filter(item => item.id === scope.row[scope.column.property]))
          const array = this.areaList.filter(item => item.id === scope.row[scope.column.property] * 1)
          return array.length !== 0 ? array[0].name : ''
        }
      },
      {
        prop: 'cityId',
        label: '市',
        width: '100',
        showOverflowTooltip: true,
        formater: scope => {
          const array = this.areaList.filter(item => item.id === scope.row[scope.column.property] * 1)
          return array.length !== 0 ? array[0].name : ''
        }
      },
      {
        prop: 'areaId',
        label: '区',
        width: '100',
        showOverflowTooltip: true,
        formater: scope => {
          const array = this.areaList.filter(item => item.id === scope.row[scope.column.property] * 1)
          return array.length !== 0 ? array[0].name : ''
        }
      },
      {
        prop: 'address',
        label: '详细地址',
        showOverflowTooltip: true
        // width: '80'
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
        width: '80'
      }
    ]
    // 分页配置信息
    const pagination = {
      // currentPage: 1,
      // pageSize: 20,
      // dataTotal: dataSource.length,
      currentChange: val => {
        // console.log('currentChange', this.pagination)
        this.getCompetitorPage({ pageSize: this.pagination.pageSize || 20, pageNum: val })
      },
      sizeChange: val => {
        // console.log('sizeChange', this.pagination)
        this.getCompetitorPage({ pageNum: this.pagination.pageNum || 1, pageSize: val })
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
          this.PopDialogHandle(this.popOptions, '编辑竞争对手')
          this.getCompetitorInfo({ id: params.row.id })
        }
      },
      {
        label: '删除',
        style: { 'color': '#FE4949' },
        // permitTag: ['userCenter:sysDataMaskingRule:modify'],
        isShow: true,
        handle: params => {
          this.$confirm(' 你确认要删除该竞争对手吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
          })
            .then(() => {
              this.deleteCompetitor({ id: params.row.id })
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

    // 省切换
    // const provinceChange = this.provinceChange

    // 省切换
    // const cityChange = this.cityChange

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
        const lastYearsSales = params.lastYearsSales && (params.lastYearsSales * 10000).toFixed()
        this.addOrEditCompetitor({ ...params, lastYearsSales })
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
          itemStyle: { 'width': '47%', 'marginRight': '0px' },
          maxlength: 50,
          label: '竞争对手名',
          rules: [commonBlurReg],
          placeholder: '请输入名称'
        },
        {
          prop: 'provinceId',
          itemType: 'select',
          labelWidth: '121px',
          itemStyle: { 'width': '53%', 'marginRight': '0px' },
          label: '省',
          dataSource: [],
          change: this.provinceChange
        },
        {
          prop: 'cityId',
          itemType: 'select',
          itemStyle: { 'width': '47%', 'marginRight': '0px' },
          label: '市',
          dataSource: [],
          change: this.cityChange
        },
        {
          prop: 'areaId',
          itemType: 'select',
          labelWidth: '121px',
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
          prop: 'phone',
          itemType: 'input',
          labelWidth: '121px',
          itemStyle: { 'width': '53%', 'marginRight': '0px' },
          maxlength: 12,
          label: '座机',
          rules: [numberReg],
          placeholder: '请输入座机号'
        },
        {
          prop: 'personNum',
          itemType: 'input',
          itemStyle: { 'width': '47%', 'marginRight': '0px' },
          maxlength: 7,
          label: '总人数',
          rules: [numberReg],
          placeholder: '请输入总人数'
        },
        {
          prop: 'lastYearsSales',
          itemType: 'input',
          labelWidth: '121px',
          itemStyle: { 'width': '53%', 'marginRight': '0px' },
          maxlength: 12,
          label: '上年销售额',
          rules: [moneyReg],
          placeholder: '请输入上年销售额'
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
      dataSource: [],
      type: 'edit',
      popOptions,
      searchFormDatas: {},
      areaList: []
    }
  },
  created() {
    this.getCompetitorPage()
    this.getAreaSearch({}, this.popOptions, 1)
  },
  methods: {}
}
</script>

<style lang='scss' scoped>
.competitor {
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
</style>
