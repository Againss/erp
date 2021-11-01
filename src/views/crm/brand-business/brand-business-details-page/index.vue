<template>
  <div class="brand-business-details-page">
    <div class="brandBusinessHeader">
      <span class="brandBusinessText">品牌商</span>
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
      <el-tab-pane label="相关" name="relevant"><relevantTable :relevant-options="relevantCustomerOptions" /></el-tab-pane>
    </el-tabs>
    <!-- 导入pop弹出层 -->
    <div class="pop">
      <cs-custom-pop :options="brandBusinessPopOptions" />
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
import { BrandBusiness } from '../components/index'
import { BrandBusinessRelevant } from '../components/relevantIndex.js'
import { BusinessOpportunityRelevant } from '../../business-opportunity/components/relevantIndex.js'
import { PublicCrm } from '@/views/crm/public/index'
// import lineJump from '@/views/crm/public/components/line-jump.vue'
export default {
  components: {
    // changeOwner,
    relevantTable
  },
  mixins: [BrandBusiness, PublicCrm, BusinessOpportunityRelevant, BrandBusinessRelevant],
  data() {
    // 公用验证正则
    // const commonChangeReg = this.$getRules({})
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    // 手机验证正则
    // const phoneReg = this.$getRules({ type: 'phone', trigger: ['blur'] })
    // 邮箱验证正则
    // const emailReg = this.$getRules({ type: 'email', trigger: ['blur'] })
    // 数字验证
    // const numberReg = this.$getRules({ type: 'number', trigger: ['blur'] })
    // 金额数字正则
    // const moneyReg = this.$getRules({ type: 'number', pattern: /^(([1-9]{1}\d{0,8})|(0{1}))(\.\d{1,2})?$/, message: '请输入最多9位整数或保留1到2位小数', trigger: ['blur'] })
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

    // 远程客户搜索
    const remoteCustomerSearch = (value) => {
      console.log(value)
      if (value === '') {
        this.$set(this.customerPopOptions.content[0], 'dataSource', [])
      } else {
        if (!this.getData1) {
          this.getData1 = this.$utils.debounce(this.remoteCustomerPage, 300)
        }
        this.getData1({ name: value, dataTag: 'ALL' }, 0, this.customerPopOptions)
      }
    }

    // 客户关联弹出框
    const customerPopOptions = {
      itemType: 'dialog',
      visible: false,
      title: '修改',
      //   width: '720px',
      // okText: '保存',
      customClass: 'popOptionsClass',
      ok: params => {
        console.log('确认', params)
        // const customerId = params.customerName
        // delete params.follower
        // const salesAmount = params.salesAmount && params.salesAmount * 10000
        // this.addOrEditBusinessOpportunity({ ...params, salesAmount })
        this.brandLinkCustomer({ ...params, brandId: this.routeId })
      },
      cancel: params => {
        this.closePopDialogHandle(this.customerPopOptions)
        // console.log(params)
      },
      formDatas: {
      },
      formOptions: {
        // inline: true
        // className: 'detailLabel'
        // labelWidth: '111px'
      },
      content: [
        {
          prop: 'customerId',
          itemType: 'select',
          filterable: true,
          className: 'commonRemoteSearch',
          remote: true,
          remoteMethod: remoteCustomerSearch,
          loading: false,
          rules: [commonBlurReg],
          // itemStyle: { 'width': '50%', 'marginRight': 0 },
          label: '客户',
          dataSource: [],
          placeholder: '关联客户'
        }
      ]
    }

    // 商机表格头部列表
    const customerColumns = [
      {
        prop: 'id',
        label: '序号',
        width: '60',
        formater: scope => {
          // console.log('scope', scope, this.pagination)
          return scope.$index + 1
        // return scope.$index + 1
        }
      },
      {
        prop: 'name',
        label: '客户名称',
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
        prop: 'shortName',
        label: '中文简称',
        showOverflowTooltip: true,
        width: '120'
      },
      {
        prop: 'ename',
        label: '英文简称',
        showOverflowTooltip: true,
        width: '120'
      },
      {
        prop: 'customerTypeName',
        label: '客户类型',
        showOverflowTooltip: true,
        width: '120'
      },
      {
        prop: 'levelName',
        label: '客户级别',
        showOverflowTooltip: true,
        width: '120'
      }
    ]

    // 商机操作栏
    const customerHandleConf = [
      {
        label: '取消关联',
        // permitTag: ['userCenter:sysDataMaskingRule:modify'],
        isShow: true,
        handle: params => {
          this.$confirm(' 你确认要取消关联该客户吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
          })
            .then(() => {
              this.brandUnlinkCustomer({ id: params.row.customerBrandId })
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

    const customerPopOperates = {
      label: '操作',
      width: '80',
      dataSource: customerHandleConf
    }
    // relevantOptions表格弹框配置信息
    const relevantCustomerOptions = {
      relevantAddText: '关联',
      title: '客户',
      tip: 0,
      //   hiddenAddButton: true,
      isTwo: true,
      relevantAdd: () => {
        this.PopDialogHandle(this.customerPopOptions, '关联客户')
      },
      viewAll: () => {
        this.$router.push(`/crm/brand-business/brand-business-view-all-page/${this.$route.params.id}`)
      },
      dataSource: this.customerDataSource,
      popOperates: customerPopOperates,
      columns: customerColumns,
      popOptions: customerPopOptions
    }

    // pop弹出框配置信息
    const brandBusinessPopOptions = {
      itemType: 'dialog',
      visible: false,
      title: '修改',
      width: '720px',
      // okText: '保存',
      customClass: 'popOptionsClass',
      ok: params => {
        console.log('确认', params)
        delete params.follower
        this.editBrandBusiness(params, true)
      },
      cancel: params => {
        this.closePopDialogHandle(this.brandBusinessPopOptions)
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
          label: '品牌商名称',
          rules: [commonBlurReg],
          placeholder: '请输入品牌商姓名'
        },
        {
          prop: 'provinceId',
          itemType: 'select',
          labelWidth: '121px',
          itemStyle: { 'width': '53%', 'marginRight': '0px' },
          label: '省',
          dataSource: [],
          change: this.brandProvinceChange
        },
        {
          prop: 'cityId',
          itemType: 'select',
          itemStyle: { 'width': '47%', 'marginRight': '0px' },
          label: '市',
          dataSource: [],
          change: this.brandCityChange
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
          prop: 'description',
          itemType: 'input',
          itemStyle: { 'width': '100%', 'marginRight': 0 },
          maxlength: 1000,
          type: 'textarea',
          autosize: { minRows: 2, maxRows: 4 },
          label: '概述',
          // rules: [commonBlurReg, nameReg],
          placeholder: '请输入概述'
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
        label: '品牌商名称:',
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
        prop: 'description',
        itemType: 'input',
        type: 'textarea',
        autosize: true,
        itemStyle: { 'width': '100%', 'marginRight': 0 },
        label: '概述:',
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
      relevantCustomerOptions,
      customerPopOptions,
      OwnerPopOptions,
      businessDataSource: [],
      brandBusinessPopOptions,
      searchData,
      detailsFormDatas: {},
      formDatas: {
        dataTag: 'ALL'
      },
      searchFormDatas: {
        brandId: this.$route.params.id
      },
      activeName: 'detailed',
      visible: false,
      businessOpportunityStage: [],
      businessTotal: 0,
      brandBusinessCustomerTotal: 0,
      type: 'add',
      areaList: []
      // customerId: ''
    }
  },
  computed: {
    routeId() {
      return this.$route.params.id
    }
    // customerId() {
    //   return this.detailsFormDatas.customerId
    // }
  },
  watch: {
    brandBusinessCustomerTotal() {
      this.$set(this.relevantCustomerOptions, 'tip', this.brandBusinessCustomerTotal || 0)
    }
    // customerId(newVal, oldNew) {
    //   this.$set(this.searchData[3].componentsOptions, 'url', `/crm/customer/customer-details-page/${newVal}`)
    // }
  },
  async created() {
    // console.log(this.getBusinessOpportunityPage({ businessOpportunityId: this.routeId, dataTag: 'ALL' }))
    this.getBrandBusinessCustomerPage()
    await this.getAreaSearch({}, this.brandBusinessPopOptions, 1)
    this.routeId && this.getBrandBusinessInfoDisplay({ id: this.routeId })
  },
  methods: {
    // 编辑
    detailEdit() {
      this.PopDialogHandle(this.brandBusinessPopOptions, '编辑品牌商')
      this.getBrandBusinessInfo({ id: this.routeId })
    },

    // 删除
    detailDelete() {
      this.$confirm(' 你确认要删除该品牌商吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(() => {
          this.deleteBrandBusiness({ id: this.routeId }, true)
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
.brand-business-details-page {
    margin:20px;
    background-color: #fff;

    .brandBusinessHeader {
        height: 60px;
        border-bottom: 1px solid #E9EFF2;
        // background-color: #eee;
        // border-radius: 5px;
        display: flex;
        align-items: center;
        margin-bottom: 20px;
        // border-bottom: 1px #ccc solid;
    }

    .brandBusinessText {
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
.brand-business-details-page {
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
