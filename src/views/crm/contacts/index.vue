<template>
  <div class="contacts">
    <!-- 搜索表单 -->
    <div class="search">
      <cs-custom-form ref="searchForm" :data-source="searchData" :options="formOtions" :form-datas="formDatas" />
    </div>
    <div class="button">
      <el-button v-permission="['userCenter:sysUser:add']" size="small" type="primary" @click="createContacts">新建</el-button>
    </div>
    <!-- table表格 -->
    <div class="page-table">
      <cs-custom-table
        tooltip-effect="dark"
        :columns="columns"
        :data-source="contactsDataSource"
        :operates="popOperates"
        :pagination="pagination"
        edit-type="pop"
        highlight-current-row
      />
    </div>
    <!-- 导入pop弹出层 -->
    <div class="pop">
      <cs-custom-pop :options="contactsPopOptions" />
    </div>
  </div>
</template>

<script>
// import { competitorPage, competitorAdd } from './api/index.js'
import { Contacts } from './components/index'
import { ContactsRelevant } from './components/relevantIndex.js'
import { PublicCrm } from '@/views/crm/public/index'
export default {
  mixins: [Contacts, PublicCrm, ContactsRelevant],
  data() {
    // 公用验证正则
    const commonChangeReg = this.$getRules({})
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    // 手机验证正则
    const phoneReg = this.$getRules({ type: 'phone', trigger: ['blur'] })
    // 邮箱验证正则
    const emailReg = this.$getRules({ type: 'email', trigger: ['blur'] })
    // 数字验证
    const numberReg = this.$getRules({ type: 'number', trigger: ['blur'] })
    // const emailReg2 = this.$getRules({ type: 'email2', trigger: ['blur'] })
    // 姓名正则
    // const nameReg = this.$getRules({ type: 'department', message: '最大长度为50', trigger: ['blur'] })
    // 远程搜索
    // const remoteSearch = value => {
    //   console.log(value)
    //   if (value === '') {
    //     this.$set(this.OwnerPopOptions.content[0], 'dataSource', [])
    //   } else {
    //     if (!this.getData) {
    //       this.getData = this.$utils.debounce(this.getUserList, 300)
    //     }
    //     this.getData({ realName: value }, 0)
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
        placeholder: '请输入姓名或者公司名称'
      },
      {
        itemType: 'operate',
        submitText: '查询',
        submitHandle: params => {
          console.log('查询', params)
          this.getContactsPage(params)
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
        label: '姓名',
        minWidth: '80',
        showOverflowTooltip: true,
        handle: scope => {
          console.log('scope', scope)
          this.$router.push(`/crm/contacts/contacts-details-page/${scope.row.contactPersonId}`)
        },
        style: {
          color: '#1890ff',
          cursor: 'pointer'
        }
      },
      {
        prop: 'gender',
        label: '性别',
        width: '80',
        formater: scope => {
          return scope.row[scope.column.property] === 'M' ? '男' : scope.row[scope.column.property] === 'W' ? '女' : ''
        }
      },
      {
        prop: 'customerName',
        label: '公司名称',
        showOverflowTooltip: true,
        minWidth: '80',
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
        prop: 'mobile',
        label: '手机',
        width: '120'
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
    // 分页配置信息
    const pagination = {
      // currentPage: 1,
      // pageSize: 20,
      // dataTotal: dataSource.length,
      currentChange: val => {
        // console.log('currentChange', this.pagination)
        this.getContactsPage({ pageSize: this.pagination.pageSize || 20, pageNum: val })
      },
      sizeChange: val => {
        // console.log('sizeChange', this.pagination)
        this.getContactsPage({ pageNum: this.pagination.pageNum || 1, pageSize: val })
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
          this.PopDialogHandle(this.contactsPopOptions, '编辑联系人')
          this.getContactsInfo({ contactPersonId: params.row.contactPersonId })
        }
      },
      {
        label: '删除',
        style: { 'color': '#FE4949' },
        // permitTag: ['userCenter:sysDataMaskingRule:modify'],
        isShow: true,
        handle: params => {
          this.$confirm(' 你确认要删除该联系人吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
          })
            .then(() => {
              this.deleteContacts({ contactPersonId: params.row.contactPersonId })
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
    const contactsPopOptions = {
      itemType: 'dialog',
      visible: false,
      title: '修改',
      width: '720px',
      // okText: '保存',
      customClass: 'popOptionsClass',
      ok: params => {
        console.log('确认', params)
        delete params.follower
        this.addOrEditContacts(params)
      },
      cancel: params => {
        this.closePopDialogHandle(this.contactsPopOptions)
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
          maxlength: 10,
          label: '姓名',
          rules: [commonBlurReg],
          placeholder: '请输入联系人姓名'
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
              value: 'M',
              label: '男'
            },
            {
              value: 'W',
              label: '女'
            }
          ]
        },
        {
          prop: 'customerId',
          itemType: 'select',
          itemStyle: { 'width': '47%', 'marginRight': '0px' },
          label: '公司名称',
          className: 'commonRemoteSearch',
          filterable: true,
          remote: true,
          remoteMethod: this.remoteSearch,
          rules: [commonChangeReg],
          dataSource: [],
          placeholder: '请查找客户'
        },
        {
          prop: 'mobile',
          itemType: 'input',
          labelWidth: '97px',
          itemStyle: { 'width': '53%', 'marginRight': '0px' },
          label: '手机',
          rules: [commonBlurReg, phoneReg],
          placeholder: '请输入手机号'
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
          prop: 'department',
          itemType: 'input',
          itemStyle: { 'width': '47%', 'marginRight': '0px' },
          maxlength: 10,
          label: '部门',
          // rules: [commonBlurReg, nameReg],
          placeholder: '请输入部门'
        },
        {
          prop: 'phone',
          itemType: 'input',
          labelWidth: '97px',
          itemStyle: { 'width': '53%', 'marginRight': '0px' },
          maxlength: 12,
          label: '座机',
          rules: [numberReg],
          placeholder: '请输入座机号'
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
      contactsDataSource: [],
      type: 'edit',
      contactsPopOptions,
      searchFormDatas: {}
    }
  },
  created() {
    this.getContactsPage()
  },
  methods: {
    createContacts() {
      this.type = 'add'
      this.PopDialogHandle(this.contactsPopOptions, '新建联系人')
    }
  }
}
</script>

<style lang='scss' scoped>
.contacts {
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
