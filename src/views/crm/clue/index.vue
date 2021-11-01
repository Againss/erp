<template>
  <div class="clue">
    <!-- 搜索表单 -->
    <div class="search">
      <cs-custom-form ref="searchForm" :data-source="searchData" :options="formOtions" :form-datas="formDatas" />
    </div>
    <div class="button">
      <el-button v-permission="['userCenter:sysUser:add']" size="small" type="primary" @click="createClue">新建</el-button>
    </div>
    <!-- table表格 -->
    <div class="page-table">
      <cs-custom-table
        tooltip-effect="dark"
        :columns="columns"
        :data-source="clueDataSource"
        :operates="popOperates"
        :pagination="pagination"
        edit-type="pop"
        highlight-current-row
      />
    </div>
    <!-- 导入pop弹出层 -->
    <div class="pop">
      <cs-custom-pop :options="cluePopOptions" />
    </div>
  </div>
</template>

<script>
// import { competitorPage, competitorAdd } from './api/index.js'
import { Clue } from './components/index'
import { PublicCrm } from '@/views/crm/public/index'
import { ClueRelevant } from './components/relevantIndex.js'
export default {
  mixins: [Clue, PublicCrm, ClueRelevant],
  data() {
    // 公用验证正则
    const commonChangeReg = this.$getRules({})
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    // 手机验证正则
    const phoneReg = this.$getRules({ type: 'phone', trigger: ['blur'] })
    // 数字验证
    const numberReg = this.$getRules({ type: 'number', trigger: ['blur'] })
    // 邮箱验证正则
    const emailReg = this.$getRules({ type: 'email', trigger: ['blur'] })
    // const emailReg2 = this.$getRules({ type: 'email2', trigger: ['blur'] })

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
        placeholder: '请输入姓名或者公司'
      },
      {
        prop: 'clueStaus',
        itemType: 'select',
        label: '线索状态:',
        dataSource: [
          {
            value: null,
            label: '全部线索状态'
          },
          {
            value: 'U',
            label: '未跟进'
          },
          {
            value: 'F',
            label: '跟进中'
          },
          {
            value: 'T',
            label: '已转化'
          },
          {
            value: 'C',
            label: '关闭'
          }
        ]
        // placeholder: '请输入员工姓名或者工号'
      },
      {
        itemType: 'operate',
        submitText: '查询',
        submitHandle: params => {
          console.log('查询', params)
          this.getCluePage(params)
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
        prop: 'contactName',
        label: '姓名',
        minWidth: '80',
        showOverflowTooltip: true,
        handle: scope => {
          console.log('scope', scope)
          this.$router.push(`/crm/clue/clue-details-page/${scope.row.id}`)
        },
        style: {
          color: '#1890ff',
          cursor: 'pointer'
        }
      },
      {
        prop: 'companyName',
        label: '公司',
        showOverflowTooltip: true,
        minWidth: '80'
        // handle: scope => {
        //   console.log('scope', scope)
        // }
      },
      {
        prop: 'email',
        label: '邮箱',
        showOverflowTooltip: true,
        minWidth: '80'
      },
      {
        prop: 'clueStaus',
        label: '线索状态',
        width: '100',
        formater: scope => {
          const status = scope.row[scope.column.property]
          return status === 'U' ? '未跟进' : status === 'F' ? '跟进中' : status === 'C' ? '关闭' : status === 'T' ? '已转化' : ''
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
        this.getCluePage({ pageSize: this.pagination.pageSize || 20, pageNum: val })
      },
      sizeChange: val => {
        // console.log('sizeChange', this.pagination)
        this.getCluePage({ pageNum: this.pagination.pageNum || 1, pageSize: val })
      }
    }
    let handleConf = [
      {
        label: '编辑',
        // permitTag: ['userCenter:sysDataMaskingRule:modify'],
        isShow: scope => {
          return scope.row.clueStaus !== 'T'
        },
        handle: params => {
          this.type = 'edit'
          console.log('编辑', params)
          this.PopDialogHandle(this.cluePopOptions, '编辑线索')
          this.getClueInfo({ id: params.row.id })
        }
      },
      {
        label: '删除',
        style: { 'color': '#FE4949' },
        // permitTag: ['userCenter:sysDataMaskingRule:modify'],
        isShow: true,
        handle: params => {
          this.$confirm(' 你确认要删除该线索吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
          })
            .then(() => {
              this.deleteClue({ id: params.row.id })
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
      // center: true,
      fixed: 'right',
      dataSource: handleConf
    }

    // pop弹出框配置信息
    const cluePopOptions = {
      itemType: 'dialog',
      visible: false,
      title: '修改',
      width: '720px',
      // okText: '保存',
      customClass: 'popOptionsClass',
      ok: params => {
        console.log('确认', params)
        delete params.follower
        this.addOrEditClue(params)
      },
      cancel: params => {
        this.closePopDialogHandle(this.cluePopOptions)
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
          prop: 'contactName',
          itemType: 'input',
          itemStyle: { 'width': '47%', 'marginRight': '0px' },
          maxlength: 10,
          label: '姓名',
          rules: [commonBlurReg],
          placeholder: '请输入姓名'
        },
        {
          prop: 'gender',
          itemType: 'select',
          labelWidth: '97px',
          itemStyle: { 'width': '53%', 'marginRight': '0px' },
          label: '性别',
          rules: [commonChangeReg],
          dataSource: [
            {
              label: '男',
              value: 'M'
            },
            {
              label: '女',
              value: 'W'
            }
          ]
        },
        {
          prop: 'companyName',
          itemType: 'input',
          itemStyle: { 'width': '47%', 'marginRight': '0px' },
          maxlength: 50,
          label: '公司名称',
          rules: [commonBlurReg],
          placeholder: '请输入公司名称'
        },
        {
          prop: 'clueStaus',
          itemType: 'select',
          labelWidth: '97px',
          itemStyle: { 'width': '53%', 'marginRight': '0px' },
          label: '线索状态',
          rules: [commonChangeReg],
          dataSource: [
            {
              label: '未跟进',
              value: 'U'
            },
            {
              label: '跟进中',
              value: 'F'
            },
            {
              label: '关闭',
              value: 'C'
            }
          ]
        },
        {
          prop: 'mobile',
          itemType: 'input',
          itemStyle: { 'width': '47%', 'marginRight': '0px' },
          label: '手机',
          rules: [commonBlurReg, phoneReg],
          placeholder: '请输入手机号'
        },
        {
          prop: 'clueFrom',
          itemType: 'select',
          labelWidth: '97px',
          itemStyle: { 'width': '53%', 'marginRight': '0px' },
          label: '线索来源',
          // rules: [commonChangeReg],
          dataSource: []
        },
        {
          itemType: 'input',
          prop: 'department',
          itemStyle: { 'width': '47%', 'marginRight': '0px' },
          label: '部门',
          maxlength: 10,
          // rules: [commonChangeReg],
          placeholder: '请输入部门'
        },
        {
          prop: 'phone',
          itemType: 'input',
          labelWidth: '97px',
          itemStyle: { 'width': '53%', 'marginRight': '0px' },
          label: '座机',
          maxlength: 12,
          rules: [numberReg],
          placeholder: '请输入座机号'
        },
        {
          prop: 'email',
          itemType: 'input',
          itemStyle: { 'width': '47%', 'marginRight': '0px' },
          maxlength: 50,
          label: '邮箱',
          rules: [emailReg],
          placeholder: '请输入邮箱'
        },
        {
          prop: 'position',
          itemType: 'input',
          labelWidth: '97px',
          itemStyle: { 'width': '53%', 'marginRight': '0px' },
          maxlength: 20,
          label: '职位',
          // rules: [emailReg, emailReg2],
          placeholder: '请输入职位'
        },
        {
          prop: 'remark',
          itemType: 'input',
          itemStyle: { 'width': '100%', 'marginRight': 0 },
          maxlength: 1000,
          autosize: { minRows: 2, maxRows: 4 },
          type: 'textarea',
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
      clueDataSource: [],
      type: 'edit',
      cluePopOptions,
      searchFormDatas: {}
    }
  },
  created() {
    this.getClueSourceOptions()
    this.getCluePage()
  },
  methods: {
    createClue() {
      this.type = 'add'
      this.PopDialogHandle(this.cluePopOptions, '新建线索')
    }
  }
}
</script>

<style lang='scss' scoped>
.clue {
  padding: 20px;
  // padding-bottom: 0;
  .button {
    // margin-bottom: 22px;
  }

}
</style>

<style lang="scss">
.clue {
  .search {
    .el-form.el-form--inline .el-form-item__label-wrap {
      margin-left: 0px !important;
    }
  }
  .el-textarea__inner { //el_input中的隐藏属性
    resize: none;  //主要是这个样式
  }
}
</style>

