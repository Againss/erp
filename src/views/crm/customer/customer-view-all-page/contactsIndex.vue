<template>
  <div class="contacts-view-all-page">
    <div class="contactsHeader">
      <span v-if="customerFormDatas.name" class="contactsText">{{ customerFormDatas.name }}</span>
      <div class="details-button">
        <el-button size="mini" @click="viewAllAdd">新建</el-button>
        <!-- <el-button @click="$router.back()">返回</el-button> -->
      </div>
    </div>
    <!-- table表格 -->
    <div class="page-table">
      <cs-custom-table
        tooltip-effect="dark"
        :columns="contactsColumns"
        :data-source="contactsDataSource"
        :operates="contactsPopOperates"
        :pagination="pagination"
        edit-type="pop"
        highlight-current-row
      />
    </div>
    <!-- 导入更改所有人pop弹出层 -->
    <div class="pop">
      <cs-custom-pop :options="contactsPopOptions" />
    </div>
  </div>
</template>

<script>
import { PublicCrm } from '@/views/crm/public/index'
import { ContactsRelevant } from '../../contacts/components/relevantIndex.js'
import { customerInfo } from '../api/index.js'
export default {
  mixins: [PublicCrm, ContactsRelevant],
  data() {
    // 公用验证正则
    const commonChangeReg = this.$getRules({})
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    // 手机验证正则
    const phoneReg = this.$getRules({ type: 'phone', trigger: ['blur'] })
    // 邮箱验证正则
    const emailReg = this.$getRules({ type: 'email', trigger: ['blur'] })
    // 为数字正则
    const numberReg = this.$getRules({ type: 'number', trigger: ['blur'] })
    // const emailReg2 = this.$getRules({ type: 'email2', trigger: ['blur'] })

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
    // 合同pop弹出框配置信息
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
          disabled: true,
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
    // 合同表格表头配置信息
    const contactsColumns = [
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
          return scope.row[scope.column.property] === 'M' ? '男' : '女'
        }
      },
      // {
      //   prop: 'customerName',
      //   label: '公司名称',
      //   minWidth: '80',
      //   showOverflowTooltip: true,
      //   handle: scope => {
      //     console.log('scope', scope)
      //     // this.$router.push(`/crm/contacts/contacts-details-page/${scope.row.id}`)
      //   },
      //   style: {
      //     color: '#1890ff',
      //     cursor: 'pointer'
      //   }
      // },
      {
        prop: 'mobile',
        label: '手机',
        width: '120'
      },
      {
        prop: 'mobile',
        label: '邮箱',
        minWidth: '60'
      },
      {
        prop: 'createdTime',
        label: '创建日期',
        width: '160',
        formater: scope => {
          return scope.row[scope.column.property] ? this.$filters.parseTime(scope.row[scope.column.property] + '', '{y}-{m}-{d}') : ''
        }
      },
      {
        prop: 'follower',
        label: '所有人',
        showOverflowTooltip: true,
        minWidth: '70'
      }
    ]
    // 合同操作栏
    const contactsPopOperates = {
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
    }
    // relevantContactsOptions表格弹框配置信息
    // const relevantContactsOptions = {
    //   relevantAddText: '新建',
    //   title: '合同',
    //   tip: 0,
    //   isTwo: true,
    //   viewAll: () => {},
    //   relevantAdd: () => {
    //     this.type = 'add'
    //     this.PopDialogHandle(this.contactsPopOptions, '新建合同')
    //   },
    //   dataSource: [],
    //   popOperates: contactsPopOperates,
    //   columns: contactsColumns,
    //   popOptions: contactsPopOptions
    // }
    return {
      contactsPopOptions,
      contactsColumns,
      contactsDataSource: [],
      contactsPopOperates,
      pagination,
      contactsName: '',
      type: 'add',
      userList: [],
      customerFormDatas: {},
      formDatas: {
        dataTag: 'ALL'
      },
      searchFormDatas: {
        customerId: this.$route.params.id,
        customerIds: [this.$route.params.id]
      }
    }
  },
  computed: {
    routeId() {
      return this.$route.params.id
    }
  },
  created() {
    this.getContactsPage()
    this.getCustomerInfo({ customerId: this.routeId })
  },
  methods: {
    viewAllAdd() {
      this.type = 'add'
      this.PopDialogHandle(this.contactsPopOptions, '新建合同')
      const customerFormDatas = this.customerFormDatas
      this.$set(this.contactsPopOptions.content[2], 'dataSource', [{ label: customerFormDatas.name, value: customerFormDatas.customerId }])
      this.setFormDatas(this.contactsPopOptions, { customerId: customerFormDatas.customerId })
    },
    // 获取商机详情
    async getCustomerInfo(data = {}) {
      const res = await customerInfo(data)
      console.log('详情', res)
      // this.contactsName = res.data.name
      this.customerFormDatas = res.data
      // const endDate = res.data.endDate ? this.$filters.parseTime(res.data.endDate + '', '{y}-{m}-{d}') : null
      // this.setFormDatas(this.businessPopOptions, { ...res.data, endDate })
      // this.stageChange(res.data.businessStageId)
    }
  }
}
</script>

<style lang='scss' scoped>
.contacts-view-all-page {
    padding:20px;
    // padding-bottom: 0;

    .contactsHeader {
        height: 60px;
        border-bottom: 1px solid #E9EFF2;
        background-color: #fff;
        display: flex;
        align-items: center;
    }

    .contactsText {
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
