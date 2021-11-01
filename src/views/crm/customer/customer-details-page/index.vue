<template>
  <div class="customer-details-page">
    <div class="customerHeader">
      <span class="customerText">客户</span>
      <div class="details-button">
        <el-button size="mini" @click="detailEdit">编辑</el-button>
        <el-button size="mini" type="danger" plain @click="detailDelete">删除</el-button>
        <el-button size="mini" @click="changeOwnerClick">更改所有人</el-button>
        <!-- <changeOwner :ok-click="okClick" :visible="visible" @visibleClick="visiblePopOption" /> -->
        <!-- <el-button @click="$router.back()">返回</el-button> -->
      </div>
    </div>
    <el-tabs v-model="activeName" class="commonTabs" @tab-click="handleClick">
      <el-tab-pane label="详细信息" name="detailed">
        <!-- 搜索表单 -->
        <div class="detailSearch">
          <cs-custom-form ref="searchForm" :data-source="searchData" :options="formOtions" :form-datas="customerFormDatas" />
        </div>
      </el-tab-pane>
      <el-tab-pane label="相关" name="relevant">
        <relevantTable :relevant-options="relevantBusinessOptions" />
        <relevantTable :relevant-options="relevantContactsOptions" />
        <relevantTable :relevant-options="relevantContractOptions" />
        <relevantTable :relevant-options="relevantSalesOrderOptions" />
        <relevantTable :relevant-options="relevantBrandOptions" />
      </el-tab-pane>
    </el-tabs>
    <!-- 导入pop弹出层 -->
    <div class="pop">
      <cs-custom-pop :options="customerPopOptions" />
    </div>
    <!-- 导入更改所有人pop弹出层 -->
    <div class="pop">
      <cs-custom-pop :options="OwnerPopOptions" />
    </div>
    <!-- 导入附件更改所有人pop弹出层 -->
    <!-- <div class="pop">
      <cs-custom-pop :options="businessOwnerPopOptions" />
    </div> -->
  </div>
</template>

<script>
// import changeOwner from '@/views/crm/public/components/change-owner.vue'
import relevantTable from '@/views/crm/public/components/relevant-table.vue'
import { Customer } from '../components/index'
import { CustomerRelevant } from '../components/relevantIndex.js'
import { PublicCrm } from '@/views/crm/public/index'
import { BusinessOpportunityRelevant } from '../../business-opportunity/components/relevantIndex.js'
import { ContactsRelevant } from '../../contacts/components/relevantIndex.js'
import { ContractRelevant } from '../../contract/components/relevantIndex.js'
import { RelevantBrand } from '../components/brandIndex.js'
import status from '@/views/crm/public/config/status.js'
// import lineJump from '@/views/crm/public/components/line-jump.vue'
// import uploadSlotTrigger from '../components/upload-slot-trigger.vue'
// import uploadSlotTip from '../components/upload-slot-tip.vue'

export default {
  components: {
    // changeOwner,
    relevantTable
  },
  mixins: [Customer, PublicCrm, CustomerRelevant, BusinessOpportunityRelevant, ContactsRelevant, ContractRelevant, RelevantBrand],
  data() {
    // 公用验证正则
    const commonChangeReg = this.$getRules({})
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    // 手机验证正则
    const phoneReg = this.$getRules({ type: 'phone', trigger: ['blur'] })
    // 邮箱验证正则
    const emailReg = this.$getRules({ type: 'email', trigger: ['blur'] })
    // 金额数字正则
    const moneyReg = this.$getRules({ type: 'number', pattern: /^(([1-9]{1}\d{0,8})|(0{1}))(\.\d{1,2})?$/, message: '请输入最多9位整数或保留1到2位小数', trigger: ['blur'] })
    const numberReg = this.$getRules({ type: 'number', trigger: ['blur'] })
    // const emailReg2 = this.$getRules({ type: 'email2', trigger: ['blur'] })
    // 公用组件样式
    const style = {
      'width': '100%',
      'font-size': '16px',
      'font-weight': '400',
      'letter-spacing': '2px',
      'color': '#333',
      'border-bottom': '1px #EEEFF0 solid',
      'margin-top': '20px',
      'padding-bottom': '10px',
      'margin-bottom': '10px'
    }

    // 远程用户搜索(更改所有人)
    // const remoteUserSearch2 = value => {
    //   // debugger
    //   // console.log(value)
    //   if (value === '') {
    //     this.$set(this.businessOwnerPopOptions.content[0], 'dataSource', [])
    //   } else {
    //     if (!this.getData4) {
    //       this.getData4 = this.$utils.debounce(this.remoteUserList, 300)
    //     }
    //     this.getData4({ realName: value }, 0, this.businessOwnerPopOptions)
    //   }
    // }
    // 客户搜索
    const customerSearch = value => {
      if (value === '') {
        this.$set(this.contractPopOptions.content[0], 'dataSource', [])
      } else {
        if (!this.getData1) {
          this.getData1 = this.$utils.debounce(this.remoteCustomerPage, 300)
        }
        this.getData1({ name: value, dataTag: 'ALL' }, 1, this.contractPopOptions)
      }
    }
    // 商机搜索
    // const businessSearch = value => {
    //   if (value === '') {
    //     this.$set(this.contractPopOptions.content[0], 'dataSource', [])
    //   } else {
    //     if (!this.getData2) {
    //       this.getData2 = this.$utils.debounce(this.remoteBusinessPage, 300)
    //     }
    //     this.getData2({ name: value, dataTag: 'ALL' }, 2, this.contractPopOptions)
    //   }
    // }
    // 用户搜索
    const userSearch = value => {
      if (value === '') {
        this.$set(this.contractPopOptions.content[9], 'dataSource', [])
      } else {
        if (!this.getData3) {
          this.getData3 = this.$utils.debounce(this.remoteUserList, 300)
        }
        this.getData3({ realName: value, name: value }, 9, this.contractPopOptions)
      }
    }

    // 远程品牌商搜索
    const remoteBrandSearch = (value) => {
      console.log(value)
      if (value === '') {
        this.$set(this.brandPopOptions.content[0], 'dataSource', [])
      } else {
        if (!this.getData1) {
          this.getData1 = this.$utils.debounce(this.remoteBrandPage, 300)
        }
        this.getData1({ name: value, dataTag: 'ALL' }, 0, this.brandPopOptions)
      }
    }

    // 省切换
    const provinceChange = this.customerProvinceChange

    // 省切换
    const cityChange = this.customerCityChange

    // const style2 = {
    //   'fontSize': '14px',
    //   'color': '#606266',
    //   'fontWeight': '400',
    //   'marginBottom': '5px',
    //   'marginLeft': '10px'
    // }

    // 相关内容商机表格头列表
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
        showOverflowTooltip: true,
        minWidth: '80',
        handle: scope => {
          console.log('scope', scope)
          this.$router.push(`/crm/business-opportunity/business-opportunity-details-page/${scope.row.id}`)
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
        minWidth: '70'
      }
    ]
    // 相关内容商机弹出框
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
    // 相关内容商机操作栏
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
    const relevantBusinessOptions = {
      relevantAddText: '新建',
      title: '商机',
      tip: 0,
      isTwo: true,
      viewAll: () => {
        this.$router.push(`/crm/customer/customer-business-index-page/${this.$route.params.id}`)
      },
      relevantAdd: () => {
        // console.log(this.customerFormDatas)
        this.type = 'add'
        this.PopDialogHandle(this.businessPopOptions, '新建商机')
        const customerFormDatas = this.customerFormDatas
        this.$set(this.businessPopOptions.content[1], 'dataSource', [{ label: customerFormDatas.name, value: customerFormDatas.customerId }])
        this.setFormDatas(this.businessPopOptions, { customerId: customerFormDatas.customerId })
        // this.$set(this.businessPopOptions.content[0].data, 'bizId', this.routeId)
        // this.$set(this.businessPopOptions.content[0].data, 'follower', this.follower)
      },
      dataSource: [],
      popOperates: businessPopOperates,
      columns: businessColumns,
      popOptions: businessPopOptions
    }

    // 相关内容联系人弹出框
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
        debugger
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
    // 相关内容联系人表格表头列表
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
        minWidth: '60',
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
      //   showOverflowTooltip: true
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
    const relevantContactsOptions = {
      relevantAddText: '新建',
      title: '联系人',
      tip: 0,
      isTwo: true,
      viewAll: () => {
        this.$router.push(`/crm/customer/customer-contacts-index-page/${this.$route.params.id}`)
      },
      relevantAdd: () => {
        // console.log(111)
        this.type = 'add'
        this.PopDialogHandle(this.contactsPopOptions, '新建联系人')
        const customerFormDatas = this.customerFormDatas
        this.$set(this.contactsPopOptions.content[2], 'dataSource', [{ label: customerFormDatas.name, value: customerFormDatas.customerId }])
        this.setFormDatas(this.contactsPopOptions, { customerId: customerFormDatas.customerId })
        // this.$set(this.businessPopOptions.content[0].data, 'bizId', this.routeId)
        // this.$set(this.businessPopOptions.content[0].data, 'follower', this.follower)
      },
      dataSource: [],
      popOperates: contactsPopOperates,
      columns: contactsColumns,
      popOptions: contactsPopOptions
    }

    // 相关内容合同弹出框
    const contractPopOptions = {
      itemType: 'dialog',
      visible: false,
      title: '修改',
      width: '720px',
      // okText: '保存',
      customClass: 'popOptionsClass',
      ok: params => {
        console.log('确认', params)
        // const businessOpportunityId = params.businessOpportunityName
        // const customerId = params.customerName
        delete params.follower
        const ourSignatoryName = this.userList.length !== 0 ? this.userList.filter(item => item.userId === params.ourSignatory)[0].realName : params.ourSignatoryName
        const totalAmount = params.totalAmount && (params.totalAmount * 10000).toFixed()
        this.addOrEditContract({ ...params, ourSignatoryName, totalAmount })
      },
      cancel: params => {
        this.closePopDialogHandle(this.contractPopOptions)
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
          label: '合同名称',
          rules: [commonBlurReg],
          placeholder: '请输入合同名称'
        },
        {
          prop: 'customerId',
          itemType: 'select',
          filterable: true,
          className: 'commonRemoteSearch',
          disabled: true,
          remote: true,
          change: this.customerChange,
          remoteMethod: customerSearch,
          labelWidth: '121px',
          itemStyle: { 'width': '53%', 'marginRight': '0px' },
          label: '客户',
          rules: [commonChangeReg],
          dataSource: [],
          placeholder: '查找客户'
        },
        {
          prop: 'businessOpportunityId',
          itemType: 'select',
          // props: {
          //   label: 'name',
          //   value: 'id'
          // },
          // filterab le: true,
          // className: 'commonRemoteSearch',
          // remote: true,
          // remoteMethod: businessSearch,
          itemStyle: { 'width': '47%', 'marginRight': '0px' },
          label: '商机',
          rules: [commonChangeReg],
          dataSource: [],
          placeholder: '请先查找用户'
        },
        {
          itemType: 'date',
          prop: 'contractDate',
          labelWidth: '121px',
          itemStyle: { 'width': '53%', 'marginRight': '0px' },
          label: '签约日期',
          rules: [commonChangeReg],
          placeholder: '请选择日期'
        },
        {
          prop: 'status',
          itemType: 'select',
          itemStyle: { 'width': '47%', 'marginRight': '0px' },
          label: '合同状态',
          rules: [commonChangeReg],
          dataSource: [
            {
              value: 'E',
              label: '执行中'
            },
            {
              value: 'C',
              label: '结束'
            },
            {
              value: 'D',
              label: '意外终止'
            }
          ]
        },
        {
          prop: 'totalAmount',
          itemType: 'input',
          labelWidth: '121px',
          itemStyle: { 'width': '53%', 'marginRight': '0px' },
          maxlength: 12,
          label: '总金额',
          rules: [commonBlurReg, moneyReg],
          placeholder: '请输入总金额'
        },
        {
          itemType: 'date',
          prop: 'startTime',
          label: '开始日期',
          change: (value, form, formDatas, setFormDatas) => {
            if (formDatas.endTime) {
              if (new Date(value) > new Date(formDatas.endTime)) {
                this.$message.warning('开始日期不能晚于结束日期')
                setFormDatas({ startTime: '' })
              }
            }
          },
          itemStyle: { 'width': '47%', 'marginRight': '0px' },
          rules: [commonChangeReg],
          placeholder: '请选择日期'
        },
        {
          itemType: 'date',
          prop: 'endTime',
          label: '结束日期',
          change: (value, form, formDatas, setFormDatas) => {
            if (formDatas.startTime) {
              if (new Date(value) < new Date(formDatas.startTime)) {
                this.$message.warning('结束日期不能早于开始日期')
                setFormDatas({ endTime: '' })
              }
            }
          },
          labelWidth: '121px',
          itemStyle: { 'width': '53%', 'marginRight': '0px' },
          rules: [commonChangeReg],
          placeholder: '请选择日期'
        },
        {
          prop: 'customerSignatory',
          itemType: 'input',
          itemStyle: { 'width': '47%', 'marginRight': '0px' },
          maxlength: 10,
          label: '客户签约人',
          rules: [commonBlurReg],
          placeholder: '请输入客户签约人'
        },
        {
          prop: 'ourSignatory',
          itemType: 'select',
          filterable: true,
          className: 'commonRemoteSearch',
          remote: true,
          remoteMethod: userSearch,
          labelWidth: '121px',
          itemStyle: { 'width': '53%', 'marginRight': '0px' },
          label: '我方签约人',
          rules: [commonChangeReg],
          dataSource: [],
          placeholder: '查找系统用户'
        },
        {
          prop: 'payType',
          itemType: 'select',
          itemStyle: { 'width': '47%', 'marginRight': '0px' },
          label: '支付方式',
          rules: [commonChangeReg],
          dataSource: [
            {
              value: 'B',
              label: '银行转账'
            },
            {
              value: 'C',
              label: '支票'
            },
            {
              value: 'M',
              label: '现金'
            },
            {
              value: 'O',
              label: '其他'
            }
          ]
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
    // 相关内容合同表格表头列表
    const contractColumns = [
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
        label: '合同名称',
        minWidth: '80',
        showOverflowTooltip: true,
        handle: scope => {
          console.log('scope', scope)
          this.$router.push(`/crm/contract/contract-details-page/${scope.row.id}`)
        },
        style: {
          color: '#1890ff',
          cursor: 'pointer'
        }
      },
      // {
      //   prop: 'customerName',
      //   label: '客户',
      //   minWidth: '60',
      //   showOverflowTooltip: true,
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
        prop: 'businessOpportunityName',
        label: '商机',
        minWidth: '60',
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
      {
        prop: 'contractDate',
        label: '签约日期',
        width: '120',
        formater: scope => {
          return scope.row[scope.column.property] ? this.$filters.parseTime(scope.row[scope.column.property] + '', '{y}-{m}-{d}') : ''
        }
      },
      {
        prop: 'totalAmount',
        label: '总金额',
        align: 'right',
        width: '120',
        formater: scope => {
          const number = scope.row[scope.column.property]
          return number && this.numRecursion(number / 10000)
        }
      },
      {
        prop: 'status',
        label: '合同状态',
        width: '80',
        formater: scope => {
          const status = scope.row[scope.column.property]
          return status === 'E' ? '执行中' : status === 'C' ? '结束' : status === 'D' ? '意外终止' : ''
        }
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
    // 相关内容合同表格操作栏
    const contractPopOperates = {
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
            this.PopDialogHandle(this.contractPopOptions, '编辑合同')
            this.getContractInfo({ id: params.row.id })
          }
        },
        {
          label: '删除',
          style: { 'color': '#FE4949' },
          // permitTag: ['userCenter:sysDataMaskingRule:modify'],
          isShow: true,
          handle: params => {
            this.$confirm(' 你确认要删除该合同吗？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
              center: true
            })
              .then(() => {
                this.deleteContract({ id: params.row.id })
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
    // relevantContractOptions表格弹框配置信息
    const relevantContractOptions = {
      relevantAddText: '新建',
      title: '合同',
      tip: 0,
      isTwo: true,
      viewAll: () => {
        this.$router.push(`/crm/customer/customer-contract-index-page/${this.$route.params.id}`)
      },
      relevantAdd: () => {
        this.type = 'add'
        this.PopDialogHandle(this.contractPopOptions, '新建合同')
        const customerFormDatas = this.customerFormDatas
        this.$set(this.contractPopOptions.content[1], 'dataSource', [{ label: customerFormDatas.name, value: customerFormDatas.customerId }])
        this.customerChange(customerFormDatas.customerId)
        // this.remoteBusinessPage({ customerId: customerFormDatas.customerId, dataTag: 'ALL' }, 2, this.contractPopOptions)
        this.setFormDatas(this.contractPopOptions, { customerId: customerFormDatas.customerId })
        // this.$set(this.businessPopOptions.content[0].data, 'bizId', this.routeId)
        // this.$set(this.businessPopOptions.content[0].data, 'follower', this.follower)
      },
      dataSource: [],
      popOperates: contractPopOperates,
      columns: contractColumns,
      popOptions: contractPopOptions
    }

    // 相关销售订单表格表头配置信息
    const salesOrderColumns = [
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
        prop: 'customerRequireId',
        label: '销售订单编号',
        minWidth: '140',
        showOverflowTooltip: true,
        handle: scope => {
          console.log('scope', scope)
          this.$router.push(`/crm/sales-order/sales-order-details-page/${scope.row.customerRequireId}`)
        },
        style: {
          color: '#1890ff',
          cursor: 'pointer'
        }
      },
      {
        prop: 'orderType',
        label: '销售订单类型',
        minWidth: '140',
        formater: scope => {
          // const tempArray = []
          const orderTypeObj = { 'B': '大货', 'S': '销售版', 'T': '测试样', 'F': '快反单', 'A': '备成品' }
          return scope.row[scope.column.property] ? orderTypeObj[scope.row[scope.column.property]] : ''
        }
      },
      {
        prop: 'status',
        label: '销售订单状态',
        minWidth: '140',
        formater: scope => {
          // const tempArray = []
          return scope.row[scope.column.property] ? status[scope.row[scope.column.property]] : ''
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
    // relevantSalesOrderOptions销售订单表格弹框配置信息
    const relevantSalesOrderOptions = {
      relevantAddText: '关联',
      title: '销售订单申请',
      tip: 0,
      isTwo: true,
      hiddenAddButton: true,
      viewAll: () => {
        this.$router.push(`/crm/customer/customer-sales-order-index-page/${this.$route.params.id}`)
      },
      relevantAdd: () => {
        this.type = 'add'
        // this.PopDialogHandle(this.competitorPopOptions, '新建竞争对手')
      },
      dataSource: [],
      // popOperates: analysisPopOperates,
      columns: salesOrderColumns
      // popOptions: analysisPopOptions
    }

    // 相关内容品牌商弹出框
    const brandPopOptions = {
      itemType: 'dialog',
      visible: false,
      title: '修改',
      // width: '720px',
      // okText: '保存',
      customClass: 'popOptionsClass',
      ok: params => {
        console.log('确认', params)
        this.relationBrand({ ...params, customerId: this.routeId })
      },
      cancel: params => {
        this.closePopDialogHandle(this.brandPopOptions)
        // console.log(params)
      },
      formDatas: {
      },
      formOptions: {
        // inline: true
        // labelWidth: '111px'
      },
      content: [
        {
          prop: 'brandId',
          itemType: 'select',
          filterable: true,
          className: 'commonRemoteSearch',
          remote: true,
          remoteMethod: remoteBrandSearch,
          loading: false,
          rules: [commonChangeReg],
          // itemStyle: { 'width': '50%', 'marginRight': 0 },
          label: '品牌商',
          dataSource: [],
          placeholder: '关联品牌商'
        }
      ]
    }
    // 相关内容品牌商表格表头列表
    const brandColumns = [
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
        label: '品牌商名称',
        minWidth: '80',
        showOverflowTooltip: true,
        handle: scope => {
          console.log('scope', scope)
          this.$router.push(`/crm/brand-business/brand-business-details-page/${scope.row.id}`)
        },
        style: {
          color: '#1890ff',
          cursor: 'pointer'
        }
      },
      {
        prop: 'provinceId',
        label: '省',
        minWidth: '60',
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
        minWidth: '60',
        showOverflowTooltip: true,
        formater: scope => {
          const array = this.areaList.filter(item => item.id === scope.row[scope.column.property] * 1)
          return array.length !== 0 ? array[0].name : ''
        }
      },
      {
        prop: 'areaId',
        label: '区',
        minWidth: '60',
        showOverflowTooltip: true,
        formater: scope => {
          const array = this.areaList.filter(item => item.id === scope.row[scope.column.property] * 1)
          return array.length !== 0 ? array[0].name : ''
        }
      }
    ]
    // 相关内容合同表格操作栏
    const brandPopOperates = {
      label: '操作',
      width: '100',
      dataSource: [
        {
          label: '取消关联',
          // style: { 'color': '#FE4949' },
          // permitTag: ['userCenter:sysDataMaskingRule:modify'],
          isShow: true,
          handle: params => {
            this.$confirm(' 你确认要取消关联该品牌商吗？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            })
              .then(() => {
                this.disassociateBrand({ id: params.row.brandCustomerId })
              })
              .catch(() => {
                this.$message({
                  type: 'info',
                  message: '已取消'
                })
              })
          }
        }
      ]
    }
    // relevantContractOptions表格弹框配置信息
    const relevantBrandOptions = {
      relevantAddText: '关联',
      title: '品牌商',
      tip: 0,
      isTwo: true,
      viewAll: () => {
        this.$router.push(`/crm/customer/customer-brand-index-page/${this.$route.params.id}`)
      },
      relevantAdd: () => {
        this.type = 'add'
        this.PopDialogHandle(this.brandPopOptions, '关联品牌商')
        // const customerFormDatas = this.customerFormDatas
        // this.$set(this.contractPopOptions.content[1], 'dataSource', [{ label: customerFormDatas.name, value: customerFormDatas.customerId }])
        // this.customerChange(customerFormDatas.customerId)
        // this.setFormDatas(this.contractPopOptions, { customerId: customerFormDatas.customerId })
      },
      dataSource: [],
      popOperates: brandPopOperates,
      columns: brandColumns,
      popOptions: brandPopOptions
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
        this.editCustomer(params, true)
      },
      cancel: params => {
        this.closePopDialogHandle(this.customerPopOptions)
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

    const searchData = [
      {
        itemType: 'view',
        itemStyle: { 'width': '50%', 'marginRight': 0 },
        text: '基本信息',
        style
      },
      {
        prop: 'name',
        itemType: 'input',
        itemStyle: { 'width': '50%', 'marginRight': 0 },
        label: '客户名称:',
        readonly: true
      },
      {
        prop: 'ename',
        itemType: 'input',
        itemStyle: { 'width': '50%', 'marginRight': 0 },
        label: '英文简称:',
        readonly: true
      },
      {
        prop: 'shortName',
        itemType: 'input',
        itemStyle: { 'width': '50%', 'marginRight': 0 },
        label: '中文简称:',
        readonly: true
      },
      {
        prop: 'levelName',
        itemType: 'input',
        itemStyle: { 'width': '50%', 'marginRight': 0 },
        label: '客户级别:',
        readonly: true
      },
      {
        prop: 'customerTypeName',
        itemType: 'input',
        itemStyle: { 'width': '50%', 'marginRight': 0 },
        label: '客户类型:',
        // disabled: true
        readonly: true
      },
      {
        prop: 'provinceId',
        itemType: 'input',
        itemStyle: { 'width': '50%', 'marginRight': 0 },
        label: '省:',
        // disabled: true
        readonly: true
      },
      {
        prop: 'cityId',
        itemType: 'input',
        itemStyle: { 'width': '50%', 'marginRight': 0 },
        label: '市:',
        // disabled: true
        readonly: true
      },
      {
        prop: 'areaId',
        itemType: 'input',
        itemStyle: { 'width': '50%', 'marginRight': 0 },
        label: '区:',
        // disabled: true
        readonly: true
      },
      {
        prop: 'address',
        itemType: 'input',
        itemStyle: { 'width': '50%', 'marginRight': 0 },
        label: '详细地址:',
        readonly: true
      },
      {
        prop: 'customerDesc',
        itemType: 'input',
        type: 'textarea',
        autosize: true,
        itemStyle: { 'width': '100%', 'marginRight': 0 },
        label: '客户概述:',
        // disabled: true
        readonly: true
      },
      // {
      //   itemType: 'view',
      //   itemStyle: { 'width': '100%', 'marginRight': 0 },
      //   text: '签收、对帐、开票、支付方式等情况说明:',
      //   style: style2
      // },
      {
        prop: 'payDesc',
        itemType: 'input',
        type: 'textarea',
        autosize: true,
        className: 'lineBreakLabel',
        itemStyle: { 'width': '100%', 'marginRight': 0 },
        label: '签收、对帐、开票、支付方式等情况说明:',
        // disabled: true
        readonly: true
      },
      {
        prop: 'especiallyDesc',
        itemType: 'input',
        type: 'textarea',
        autosize: true,
        itemStyle: { 'width': '100%', 'marginRight': 0 },
        label: '特殊说明:',
        // disabled: true
        readonly: true
      },
      {
        itemType: 'view',
        text: '系统信息',
        style
      },
      {
        prop: 'follower',
        itemType: 'input',
        itemStyle: { 'width': '50%', 'marginRight': 0 },
        label: '所有人:',
        readonly: true
      },
      {
        prop: 'createdBy',
        itemType: 'input',
        itemStyle: { 'width': '50%', 'marginRight': 0 },
        label: '创建人:',
        readonly: true
      },
      {
        prop: 'createdTime',
        itemType: 'input',
        itemStyle: { 'width': '50%', 'marginRight': 0 },
        label: '创建日期:',
        readonly: true,
        trim: value => {
          console.log(value)
        }
        // formater: scope => {
        //   return scope.row[scope.column.property] ? this.$filters.parseTime(scope.row[scope.column.property] + '', '{y}-{m}-{d} {h}:{i}:{s}') : ''
        // }
      },
      {
        prop: 'updatedBy',
        itemType: 'input',
        itemStyle: { 'width': '50%', 'marginRight': 0 },
        label: '上次修改人:',
        readonly: true
      },
      {
        prop: 'updatedTime',
        itemType: 'input',
        itemStyle: { 'width': '50%', 'marginRight': 0 },
        label: '上次修改日期:',
        readonly: true
        // formater: scope => {
        //   return scope.row[scope.column.property] ? this.$filters.parseTime(scope.row[scope.column.property] + '', '{y}-{m}-{d} {h}:{i}:{s}') : ''
        // }
      }
    ]
    // 更改所有人pop弹出框配置信息
    const OwnerPopOptions = {
      itemType: 'dialog',
      visible: false,
      title: '更改所有人',
      // close: () => { this.$emit('visibleClick', false) },
      //   width: '720px',
      // okText: '保存',
      customClass: 'popOptionsClass',
      ok: this.okClick,
      cancel: params => {
        // this.PopDialogHandle()
        // this.$emit('visibleClick', false)
        this.$set(this.OwnerPopOptions, 'visible', false)
        // console.log(params)
      },
      formDatas: {
        // areaNum: 86
      },
      formOptions: {
        // inline: true
        // labelWidth: '111px'
      },
      content: [
        {
          prop: 'follower',
          itemType: 'select',
          filterable: true,
          className: 'commonRemoteSearch',
          remote: true,
          remoteMethod: this.remoteUserSearch,
          loading: false,
          rules: [commonBlurReg],
          // itemStyle: { 'width': '50%', 'marginRight': 0 },
          label: '用户',
          dataSource: [],
          placeholder: '查找用户'
        }
      ]
    }

    return {
      formOtions: {
        labelWidth: '100px',
        inline: true
      },
      formDatas: {
        dataTag: 'ALL'
      },
      relevantBusinessOptions,
      relevantContactsOptions,
      relevantContractOptions,
      relevantSalesOrderOptions,
      relevantBrandOptions,
      businessPopOptions,
      contactsPopOptions,
      contractPopOptions,
      customerPopOptions,
      brandPopOptions,
      OwnerPopOptions,
      searchData,
      customerFormDatas: {},
      // accept: '.xlsx,.xls,XLSX,.XLS,.ppt,.pdf',
      activeName: 'detailed',
      visible: false,
      businessTotal: 0,
      contactsTotal: 0,
      contractTotal: 0,
      brandTotal: 0,
      salesOrderTotal: 0,
      follower: null,
      customerleveList: [],
      customerTypeList: [],
      areaList: [],
      businessOpportunityStage: [],
      searchFormDatas: {
        customerId: this.$route.params.id,
        customerIds: [this.$route.params.id]
      },
      userList: [],
      type: 'add'
    }
  },
  computed: {
    routeId() {
      return this.$route.params.id
    }
  },
  watch: {
    businessTotal() {
      this.$set(this.relevantBusinessOptions, 'tip', this.businessTotal || 0)
    },
    contactsTotal() {
      this.$set(this.relevantContactsOptions, 'tip', this.contactsTotal || 0)
    },
    contractTotal() {
      this.$set(this.relevantContractOptions, 'tip', this.contractTotal || 0)
    },
    brandTotal() {
      this.$set(this.relevantBrandOptions, 'tip', this.brandTotal || 0)
    },
    salesOrderTotal() {
      this.$set(this.relevantSalesOrderOptions, 'tip', this.salesOrderTotal || 0)
    }
  },
  async created() {
    this.getCustomerLeveList()
    this.getCustomerTypeList()
    this.getBusinessOpportunityPage()
    this.getContactsPage()
    this.getContractPage()
    this.getBrandPage()
    this.getSalesOrderPage()
    await this.getAreaSearch({}, this.customerPopOptions, 5)
    this.routeId && this.getCustomerInfoDisplay({ customerId: this.routeId })
    // this.getfilePage()
  },
  methods: {
    // 编辑
    detailEdit() {
      this.PopDialogHandle(this.customerPopOptions, '编辑客户')
      this.getCustomerInfo({ customerId: this.routeId })
    },

    // 删除
    detailDelete() {
      this.$confirm(' 你确认要删除该客户吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(() => {
          this.deleteCustomer({ customerId: this.routeId }, true)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },

    handleClick(tab, event) {
      console.log(tab, event)
    }

    // visiblePopOption(data) {
    //   this.vis
    // }
  }
}
</script>

<style lang='scss' scoped>
.customer-details-page {
    margin:20px;
    background-color: #fff;

    .customerHeader {
        height: 60px;
        border-bottom: 1px solid #E9EFF2;
        display: flex;
        align-items: center;
        margin-bottom: 20px;
    }

    .customerText {
      font-size: 18px;
      font-weight: 400;
      color: '#151222';
      flex:1;
      margin-left: 20px;
    }

    .details-button {
        display: flex;
        margin-right: 20px;
    }
}
</style>

<style lang="scss">
.customer-details-page {
  .el-tabs__content {
    padding-bottom: 20px;
  }
  .detailSearch {
    // margin-bottom: 20px;

    .el-input__inner,.el-textarea__inner {
      border: 0;
    }

    .el-form-item__label {
      color: #888E9E
    }

    .el-form-item {
      margin-bottom: 0px;
    }

    .el-input__inner {
      padding: 0 8px;
    }
    .el-form {
      .el-form-item:nth-of-type(12) {
        .el-form-item__label {
          line-height: 20px;
          margin: 8px 0;
        }
      }
    }
  }
  .el-textarea__inner { //el_input中的隐藏属性
    resize: none;  //主要是这个样式
  }

  .commonTabs {
    padding: 0 40px;
    .el-tabs__item {
      line-height: 20px;
      font-size: 14px;
    }
    .el-tabs__nav-wrap::after {
      height: 1px;
    }
    .el-tabs__header {
      margin-bottom: 0;
    }
  }
}
</style>

