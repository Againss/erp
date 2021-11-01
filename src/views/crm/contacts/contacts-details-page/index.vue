<template>
  <div class="contacts-details-page">
    <div class="contactsHeader">
      <span class="contactsText">联系人</span>
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
          <cs-custom-form ref="searchForm" :data-source="searchData" :options="formOtions" :form-datas="detailsFormDatas" />
        </div>
      </el-tab-pane>
      <el-tab-pane label="相关" name="relevant"><relevantTable :relevant-options="relevantBusinessOptions" /></el-tab-pane>
    </el-tabs>
    <!-- 导入pop弹出层 -->
    <div class="pop">
      <cs-custom-pop :options="contactsPopOptions" />
    </div>
    <!-- 导入更改所有人pop弹出层 -->
    <div class="pop">
      <cs-custom-pop :options="OwnerPopOptions" />
    </div>
  </div>
</template>

<script>
// import changeOwner from '@/views/crm/public/components/change-owner.vue'
import relevantTable from '@/views/crm/public/components/relevant-table.vue'
import { Contacts } from '../components/index'
import { ContactsRelevant } from '../components/relevantIndex.js'
import { BusinessOpportunityRelevant } from '../../business-opportunity/components/relevantIndex.js'
import { PublicCrm } from '@/views/crm/public/index'
import lineJump from '@/views/crm/public/components/line-jump.vue'
export default {
  components: {
    // changeOwner,
    relevantTable
  },
  mixins: [Contacts, PublicCrm, BusinessOpportunityRelevant, ContactsRelevant],
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
    // 金额数字正则
    const moneyReg = this.$getRules({ type: 'number', pattern: /^(([1-9]{1}\d{0,8})|(0{1}))(\.\d{1,2})?$/, message: '请输入最多9位整数或保留1到2位小数', trigger: ['blur'] })
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

    // 远程搜索
    const businessRemoteSearch = (value) => {
      console.log(value)
      if (value === '') {
        this.$set(this.businessPopOptions.content[1], 'dataSource', [])
      } else {
        if (!this.getData1) {
          this.getData1 = this.$utils.debounce(this.remoteCustomerPage, 300)
        }
        this.getData1({ name: value, dataTag: 'ALL' }, 1, this.businessPopOptions)
      }
    }

    // 商机弹出框
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
        inline: true,
        className: 'detailLabel'
        // labelWidth: '111px'
      },
      content: [
        {
          prop: 'name',
          itemType: 'input',
          itemStyle: { 'width': '47%', 'marginRight': '20px' },
          maxlength: 50,
          label: '商机名称',
          rules: [commonBlurReg],
          placeholder: '请输入商机名称'
        },
        {
          prop: 'customerId',
          itemType: 'select',
          itemStyle: { 'width': '47%', 'marginRight': '20px' },
          label: '客户',
          filterable: true,
          className: 'commonRemoteSearch',
          remote: true,
          remoteMethod: businessRemoteSearch,
          rules: [commonChangeReg],
          placeholder: '请查找客户',
          dataSource: []
        },
        {
          prop: 'salesAmount',
          itemType: 'input',
          itemStyle: { 'width': '47%', 'marginRight': '20px' },
          maxlength: 12,
          label: '销售金额',
          rules: [commonBlurReg, moneyReg],
          placeholder: '请输入销售金额'
        },
        {
          itemType: 'date',
          prop: 'endDate',
          itemStyle: { 'width': '47%', 'marginRight': '20px' },
          label: '结束日期',
          rules: [commonChangeReg],
          placeholder: '请选择日期'
        },
        {
          prop: 'businessStageId',
          itemType: 'select',
          itemStyle: { 'width': '47%', 'marginRight': '20px' },
          label: '商机阶段',
          change: this.stageChange,
          rules: [commonChangeReg],
          placeholder: '请输入商机阶段',
          dataSource: []
        },
        {
          prop: 'probability',
          itemType: 'input',
          itemStyle: { 'width': '47%', 'marginRight': '20px' },
          label: '赢单概率',
          readonly: true,
          disabled: true,
          rules: [commonBlurReg]
          // placeholder: '请输入座机号'
        },
        {
          prop: 'remark',
          itemType: 'input',
          itemStyle: { 'width': '97%', 'marginRight': 0 },
          maxlength: 1000,
          type: 'textarea',
          autosize: { minRows: 2, maxRows: 4 },
          label: '备注',
          // rules: [commonBlurReg, nameReg],
          placeholder: '请输入备注'
        }
      ]
    }

    // 商机表格头部列表
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
      {
        prop: 'customerName',
        label: '客户',
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
    // const businessHandleConf = [
    //   {
    //     label: '编辑',
    //     // permitTag: ['userCenter:sysDataMaskingRule:modify'],
    //     isShow: true,
    //     handle: params => {
    //       this.type = 'edit'
    //       console.log('编辑', params)
    //       this.PopDialogHandle(this.businessPopOptions, '编辑商机')
    //       this.getBusinessOpportunityInfo({ id: params.row.id })
    //     }
    //   },
    //   {
    //     label: '删除',
    //     // permitTag: ['userCenter:sysDataMaskingRule:modify'],
    //     isShow: true,
    //     handle: params => {
    //       this.$confirm(' 你确认要删除该联系人吗？', '提示', {
    //         confirmButtonText: '确定',
    //         cancelButtonText: '取消',
    //         type: 'warning',
    //         center: true
    //       })
    //         .then(() => {
    //           this.deleteBusinessOpportunity({ id: params.row.id })
    //         })
    //         .catch(() => {
    //           this.$message({
    //             type: 'info',
    //             message: '已取消删除'
    //           })
    //         })
    //     }
    //   }
    // ]

    // const businessPopOperates = {
    //   label: '操作',
    //   width: '100',
    //   dataSource: businessHandleConf
    // }
    // relevantOptions表格弹框配置信息
    const relevantBusinessOptions = {
      relevantAddText: '新建',
      title: '商机',
      tip: 0,
      hiddenAddButton: true,
      isTwo: true,
      relevantAdd: () => {
        this.PopDialogHandle(this.businessPopOptions, '新建商机')
      },
      viewAll: () => {
        this.$router.push(`/crm/contacts/contacts-view-all-page/${this.$route.params.id}`)
      },
      dataSource: this.businessDataSource,
      // popOperates: businessPopOperates,
      columns: businessColumns,
      popOptions: businessPopOptions
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
        this.editContacts(params, true)
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
        label: '姓名:',
        readonly: true
      },
      {
        prop: 'gender',
        itemType: 'input',
        itemStyle: { 'width': '50%', 'marginRight': 0 },
        label: '性别:',
        // disabled: true
        readonly: true
      },
      // {
      //   prop: 'customerId',
      //   itemType: 'input',
      //   itemStyle: { 'width': '50%', 'marginRight': 0 },
      //   label: '公司名称:',
      //   // disabled: true
      //   readonly: true
      // },
      {
        components: {
          lineJump
        },
        componentsOptions: {
          prop: 'customerName',
          label: '公司名称:'
          // text: '深圳市卓色文化艺术有限公司',
          // url: `/crm/customer/customer-details-page/${this.customerId}`
        }
      },
      {
        prop: 'mobile',
        itemType: 'input',
        itemStyle: { 'width': '50%', 'marginRight': 0 },
        label: '手机:',
        // disabled: true
        readonly: true
      },
      {
        prop: 'email',
        itemType: 'input',
        itemStyle: { 'width': '50%', 'marginRight': 0 },
        label: '邮箱:',
        // disabled: true
        readonly: true
      },
      {
        prop: 'position',
        itemType: 'input',
        itemStyle: { 'width': '50%', 'marginRight': 0 },
        label: '职位:',
        // disabled: true
        readonly: true
      },
      {
        prop: 'department',
        itemType: 'input',
        itemStyle: { 'width': '50%', 'marginRight': 0 },
        label: '部门:',
        readonly: true
      },
      {
        prop: 'phone',
        itemType: 'input',
        itemStyle: { 'width': '50%', 'marginRight': 0 },
        label: '座机:',
        readonly: true
      },
      {
        prop: 'remark',
        itemType: 'input',
        type: 'textarea',
        autosize: true,
        itemStyle: { 'width': '100%', 'marginRight': 0 },
        label: '备注:',
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
    // pop弹出框配置信息
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
        inline: true
      },
      relevantBusinessOptions,
      businessPopOptions,
      OwnerPopOptions,
      businessDataSource: [],
      contactsPopOptions,
      searchData,
      detailsFormDatas: {},
      formDatas: {
        dataTag: 'ALL'
      },
      activeName: 'detailed',
      visible: false,
      businessOpportunityStage: [],
      businessTotal: 0,
      type: 'add'
      // customerId: ''
    }
  },
  computed: {
    routeId() {
      return this.$route.params.id
    },
    customerId() {
      return this.detailsFormDatas.customerId
    }
  },
  watch: {
    businessTotal() {
      this.$set(this.relevantBusinessOptions, 'tip', this.businessTotal || 0)
    },
    customerId(newVal, oldNew) {
      this.$set(this.searchData[3].componentsOptions, 'url', `/crm/customer/customer-details-page/${newVal}`)
    }
  },
  created() {
    // console.log(this.getBusinessOpportunityPage({ businessOpportunityId: this.routeId, dataTag: 'ALL' }))
    this.routeId && this.getContactsInfoDisplay({ contactPersonId: this.routeId })
    this.routeId && this.getBusinessOpportunityAbout({ contactPersonId: this.routeId })
  },
  methods: {
    // 编辑
    detailEdit() {
      this.PopDialogHandle(this.contactsPopOptions, '编辑联系人')
      this.getContactsInfo({ contactPersonId: this.routeId })
    },

    // 删除
    detailDelete() {
      this.$confirm(' 你确认要删除该联系人吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(() => {
          this.deleteContacts({ contactPersonId: this.routeId }, true)
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
  }
}
</script>

<style lang='scss' scoped>
.contacts-details-page {
    margin:20px;
    background-color: #fff;

    .contactsHeader {
        height: 60px;
        border-bottom: 1px solid #E9EFF2;
        // background-color: #eee;
        // border-radius: 5px;
        display: flex;
        align-items: center;
        margin-bottom: 20px;
        // border-bottom: 1px #ccc solid;
    }

    .contactsText {
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
.contacts-details-page {
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
