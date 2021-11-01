<!--
 * @name: panmr
 * @description: 寄件要求
 * @author: panmr
 * @time: 2021-05-21 16:41:34
-->
<template>
  <div class="table-item basic-data preArrayClss" :class="isEdit?'':'isDisabled'">
    <div class="tabs">
      <el-tabs v-model="baseFormDatas.thingType" class="el-tabs" @tab-click="tabClick">
        <el-tab-pane label="寄件要求" disabled class="tab-title" />
        <el-tab-pane :disabled="baseFormDatas.id && !isEdit" label="外部件" name="2" />
        <el-tab-pane :disabled="baseFormDatas.id && !isEdit" label="内部件" name="1" />
      </el-tabs>
    </div>
    <cs-custom-form ref="basicData" :data-source="basicData" :options="formOptions" :form-datas="baseFormDatas" />
  </div>
</template>
<script>
import { PublicCustomer } from '@/views/customer-order/public/index'
import { optionConfigSelect, receiverCompanySelect, sysUserSelect, areaInfo } from '../api/index'
import LABEL from './label'

export default {
  name: 'BaseInfo',
  mixins: [PublicCustomer],
  props: {
    isEdit: {
      type: Boolean
    },
    rule: {
      type: Object
    },
    data: {
      type: Object
    },
    syncMoudleDataHandle: {
      type: Function
    },
    setParentDataHandle: {
      type: Function
    },
    vInfo: {
      type: Array
    },
    isCopy: {
      type: Boolean
    }
  },
  data() {
    // 公用验证正则
    // const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    return {
      basicData: {},
      basicData1: { // 外部件
        _expressCompany: { // 快递公司
          prop: 'expressCompany', itemType: this.selectTypeChange, className: 'commonRemoteSearch', itemStyle: { 'width': '30%' }, style: { 'width': '100%' }, placeholder: '输入文字模糊查询',
          label: `${LABEL.expressCompany}:`, valueType: 'object', clearable: true, disabled: false, filterable: true, isShow: true, rules: [{ required: true, message: '快递公司不能为空', trigger: 'change' }],
          change: (value) => {},
          visibleChange: (value, val) => {
            if (value) {
              this.getExpressCompanySelect()
            }
          },
          renderContent: (obj) => obj ? obj.label : '',
          dataSource: []
        },
        _payMethod: { // 付费方式
          prop: 'payMethod', itemType: this.selectTypeChange, className: 'commonRemoteSearch', itemStyle: { 'width': '30%' }, style: { 'width': '100%' },
          label: `${LABEL.payMethod}:`, clearable: false, disabled: false, isShow: true, rules: [{ required: true, message: '付费方式不能为空', trigger: 'change' }],
          change: (value) => { },
          renderContent: (obj) => obj ? obj.label === 1 ? '寄付' : '到付' : '',
          dataSource: LABEL.dict.PAY_METHODS
        },
        _addressee: { // 收件人
          prop: 'addressee', itemType: this.inputTypeChange, labelWidth: '120px', className: 'commonRemoteSearch', maxlength: 50, itemStyle: { 'width': '30%' },
          style: { 'width': '100%' }, label: `${LABEL.addressee}:`, isShow: true, rules: [{ required: true, message: '收件人不能为空', trigger: 'blur' }],
          trim: (value) => {
            return value
          },
          dataSource: []
        },
        _receiverTel: { // 收件人电话
          prop: 'receiverTel', itemType: this.inputTypeChange, labelWidth: '120px', maxlength: 50, itemStyle: { 'width': '30%' },
          style: { 'width': '100%' }, label: `${LABEL.receiverTel}:`, isShow: true, rules: [{ required: true, message: '收件人电话不能为空', trigger: 'blur' }],
          trim: (value) => {
            return value
          },
          dataSource: []
        },
        _receiverCompany: { // 收件公司
          prop: 'receiverCompany', itemType: this.selectTypeChange, className: 'commonRemoteSearch', itemStyle: { 'width': '30%' }, style: { 'width': '100%' }, valueType: 'object',
          label: `${LABEL.receiverCompany}:`, clearable: true, disabled: false, filterable: true, isShow: true, rules: [{ required: true, message: '收件公司不能为空', trigger: 'blur' }],
          change: (value, form, formDatas, setFormDatas) => {
            if (value && value.value) {
              const customers = this.receiverCompanyList.filter(n => n.customerId === value.value)
              if (customers.length === 1) {
                if (customers[0].areaId) { // 存在区县的id
                  this.getAreaInfoById(customers[0].areaId, customers[0].address, setFormDatas)
                  return
                }
                if (customers[0].cityId) { // 存在城市id
                  this.getAreaInfoById(customers[0].cityId, customers[0].address, setFormDatas)
                  return
                }
                if (customers[0].provinceId) { // 存在省份id
                  this.getAreaInfoById(customers[0].provinceId, customers[0].address, setFormDatas)
                  return
                }
              } else {
                // 清空收件地址
                setFormDatas({ receiverAddress: '' })
              }
            } else {
              // 清空收件地址
              setFormDatas({ receiverAddress: '' })
            }
          },
          visibleChange: (value, val) => {
            if (value) {
              this.getReceiverCompanySelect()
            }
          },
          renderContent: (obj) => obj ? obj.label : '',
          dataSource: []
        },
        _deliveryTime: { // 要求寄出时间
          prop: 'deliveryTime', itemType: this.dateTypeChange, type: 'datetime', labelWidth: '120px', itemStyle: { 'width': '30%' }, style: { 'width': '100%' }, format: 'yyyy-MM-dd HH:mm',
          valueFormat: 'timestamp', label: `${LABEL.deliveryTime}:`, isShow: true, rules: [{ required: true, message: '要求寄出时间不能为空', trigger: 'change' }], popperClass: 'datePicker',
          trim: (value) => {
            return value
          },
          renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
            return value ? this.$utils.parseTime(value, '{y}-{m}-{d} {h}:{i}') : ''
          },
          pickerOptions: {
            disabledDate(time) {
              return time.getTime() < Date.now() - 1 * 24 * 60 * 60 * 1000
            },
            selectableRange: []
          },
          focus(val) {
            val.pickerOptions.selectableRange = []
            const myDate = new Date()
            const timeer = `${myDate.getHours()}:${myDate.getMinutes()}:${myDate.getSeconds()}`
            const newTime = `${timeer} - 23:59:59`
            val.pickerOptions.selectableRange.push(newTime)
          },
          dataSource: []
        },
        _tagLanguage: { // 标签语言
          prop: 'tagLanguage', itemType: this.radioGroupTypeChange, labelWidth: '120px', itemStyle: { 'width': '30%' }, style: {}, label: `${LABEL.tagLanguage}:`, isShow: true,
          trim: (value) => {
            return value
          },
          renderContent: (value) => value === 1 ? '中文' : '英文',
          dataSource: [{ value: 1, label: '中文' }, { value: 2, label: '英文' }]
        },

        _receiverAddress: { // 收件地址
          prop: 'receiverAddress', itemType: this.inputTypeChange, type: 'textarea', labelWidth: '120px', maxlength: 500, rows: 1,
          itemStyle: { 'width': '60%' }, style: { 'width': '100%' }, label: `${LABEL.receiverAddress}:`, isShow: true,
          trim: (value) => {
            return value
          },
          renderContent: value => {
            return `<span style="position: relative; overflow: hidden; text-overflow: ellipsis; white-space: normal;">${value}</span>`
          },
          dataSource: []
        },
        _cancelReason: { // 取消原因
          prop: 'cancelReason', itemType: 'itemview', labelWidth: '120px', className: 'commonRemoteSearch', maxlength: 50,
          itemStyle: { 'width': '30%' }, style: { 'width': '100%' }, label: `${LABEL.cancelReason}:`, isShow: false
        }
      },
      basicData2: { // 内部件
        _receiver: { // 接收人
          prop: 'receiver', itemType: this.selectTypeChange, labelWidth: '120px', className: 'commonRemoteSearch', valueType: 'object', maxlength: 50, itemStyle: { 'width': '25%' },
          style: { 'width': '100%' }, label: `${LABEL.receiver}:`, filterable: true, isShow: true, rules: [{ required: true, message: '接收人不能为空', trigger: 'blur' }],
          change: (value, form, formDatas, setFormDatas) => {
            // 设置所在部门输入框
            const item = this.userList.filter(n => n.userId === value.value) || {} // 通过 userId查找用户信息
            setFormDatas({ departmentName: item.length ? item[0].orgs.length ? item[0].orgs[0].name : '' : '' })
          },
          renderContent: (obj) => obj ? obj.label : '',
          visibleChange: (value, val) => {
            if (value) {
              this.getSysUserSelect()
            }
          },
          dataSource: []
        },
        _departmentName: { // 所在部门
          prop: 'departmentName', itemType: this.inputTypeChange, labelWidth: '120px', className: 'commonRemoteSearch', valueType: 'object', maxlength: 50,
          itemStyle: { 'width': '30%' }, style: { 'width': '100%' }, isShow: true, disabled: true, label: `${LABEL.departmentName}:`,
          trim: (value) => {
            return value
          },
          dataSource: []
        },
        _deliveryTime: { // 要求寄出时间
          prop: 'deliveryTime', itemType: this.dateTypeChange, type: 'datetime', labelWidth: '120px', itemStyle: { 'width': '30%' }, style: { 'width': '100%' }, format: 'yyyy-MM-dd HH:mm',
          valueFormat: 'timestamp', label: `${LABEL.deliveryTime}:`, isShow: true, rules: [{ required: true, message: '要求寄出时间不能为空', trigger: 'change' }], popperClass: 'datePicker',
          trim: (value) => {
            return value
          },
          renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
            return value ? this.$utils.parseTime(value, '{y}-{m}-{d} {h}:{i}') : ''
          },
          pickerOptions: {
            disabledDate(time) {
              return time.getTime() < Date.now() - 1 * 24 * 60 * 60 * 1000
            },
            selectableRange: []
          },
          focus(val) {
            val.pickerOptions.selectableRange = []
            const myDate = new Date()
            const timeer = `${myDate.getHours()}:${myDate.getMinutes()}:${myDate.getSeconds()}`
            const newTime = `${timeer} - 23:59:59`
            val.pickerOptions.selectableRange.push(newTime)
          },
          dataSource: []
        },
        _cancelReason: { // 取消原因
          prop: 'cancelReason', itemType: 'itemview', labelWidth: '120px', className: 'commonRemoteSearch', maxlength: 50,
          itemStyle: { 'width': '30%' }, style: { 'width': '100%' }, label: `${LABEL.cancelReason}:`, isShow: false
        }
      },
      formOptions: {
        size: 'small',
        hideRequiredAsterisk: false,
        labelWidth: '120px',
        inline: true,
        syncDataHandle: (syncData) => {
          this.tabName = syncData.thingType
          if (syncData.thingType + '' === '2') {
            this.basicData = this.basicData1
          }
          if (syncData.thingType + '' === '1') {
            this.basicData = this.basicData2
          }
          this.syncMoudleDataHandle('baseInfo', { ...syncData, thingType: syncData.thingType ? Number(syncData.thingType) : 2 })
        }
      },
      baseFormDatas: {
        thingType: '2', // 默认选中外部件
        tagLanguage: 1, // 默认选中中文
        payMethod: 1 // 付费方式默认是寄付
      },
      tabName: '',
      userList: [], // 用户列表
      receiverCompanyList: [] // 客户列表
    }
  },
  computed: {
  },
  watch: {
    data: {
      handler(v = {}) {
        if (v && Object.keys(v).length) {
          const orderData = this.$utils.deepClone(v)
          this.tabName = orderData && orderData.baseInfo && orderData.baseInfo.thingType
          if ((this.tabName + '') === '2') { // 外部件
            this.basicData = Object.assign({}, this.basicData1)
            this.baseFormDatas = { ...orderData.baseInfo, thingType: orderData.baseInfo.thingType ? orderData.baseInfo.thingType + '' : '' }
          }
          if ((this.tabName + '') === '1') { // 内部件
            this.basicData = Object.assign({}, this.basicData2)
            this.baseFormDatas = { ...orderData.baseInfo, thingType: orderData.baseInfo.thingType ? orderData.baseInfo.thingType + '' : '' }
          }
          if (orderData && orderData.baseInfo && orderData.baseInfo.status === 4) { // 状态为已取消4 显示 取消原因文字
            this.basicData['_cancelReason'].isShow = true
          }
          this.$nextTick(() => {
            this.$refs.basicData.form.clearValidate()
          })
        }
      },
      deep: true,
      immediate: true
    },
    isEdit: {
      handler(v) {
        this.formOptions.hideRequiredAsterisk = !v
        this.inputTypeChange(v)
        this.radioGroupTypeChange(v)
        this.selectTypeChange(v)
        if (this.baseFormDatas && (this.baseFormDatas.thingType + '') === '2') { // 外部件
          this.basicData['_expressCompany'].dataSource = this.baseFormDatas.expressCompany ? [this.baseFormDatas.expressCompany] : []
          this.basicData['_receiverCompany'].dataSource = this.baseFormDatas.receiverCompany ? [this.baseFormDatas.receiverCompany] : []
          return
        }
        if (this.baseFormDatas && (this.baseFormDatas.thingType + '') === '1') { // 内部件
          this.basicData['_receiver'].dataSource = this.baseFormDatas.receiver ? [this.baseFormDatas.receiver] : []
          return
        }
      },
      deep: true,
      immediate: true
    }
  },
  created() { },
  methods: {
    // 改变寄件要求
    tabClick(tab) {
      if ((tab.name + '') === (this.tabName + '')) { // 点击的是当前高亮的tab项，不执行任何操作
        return
      }
      this.tabName = tab.name
      this.checkTabs(tab.name)
    },
    checkTabs(thingType) {
      if ((thingType + '') === '2') { // 外部件
        // 外部件要显示的内容
        this.basicData = Object.assign({}, this.basicData1)
        // 外部件要隐藏的内容
        this.baseFormDatas.departmentName = undefined
        this.baseFormDatas.deliveryTime = undefined
        this.baseFormDatas.receiver = null
        this.baseFormDatas.tagLanguage = 1
        this.baseFormDatas.payMethod = 1
      }
      if ((thingType + '') === '1') { // 内部件
        // 内部件要隐藏的内容
        this.basicData = Object.assign({}, this.basicData2)
        this.baseFormDatas.expressCompany = null
        this.baseFormDatas.payMethod = undefined
        this.baseFormDatas.addressee = undefined
        this.baseFormDatas.receiverTel = undefined
        this.baseFormDatas.receiverCompany = null
        this.baseFormDatas.receiverAddress = undefined
        this.baseFormDatas.tagLanguage = undefined
        // 设置接收人为当前用户, 部门为当前用户的部门
        this.baseFormDatas.deliveryTime = undefined
        const userInfo = JSON.parse(localStorage.userInfo || '{}')
        this.baseFormDatas.receiver = { value: userInfo.userId, label: userInfo.realName }
        this.basicData['_receiver'].dataSource = [{ value: userInfo.userId, label: userInfo.realName }]
        this.baseFormDatas.departmentName = userInfo.orgs ? userInfo.orgs[0].name : ''
        // if (!this.baseFormDatas.id) {
        //   this.baseFormDatas.deliveryTime = undefined
        //   const userInfo = JSON.parse(localStorage.userInfo || '{}')
        //   this.baseFormDatas.receiver = { value: userInfo.userId, label: userInfo.realName }
        //   this.basicData['_receiver'].dataSource = [{ value: userInfo.userId, label: userInfo.realName }]
        //   this.baseFormDatas.departmentName = userInfo.orgs ? userInfo.orgs[0].name : ''
        // }
      }
      this.$nextTick(() => {
        this.$refs.basicData.form.clearValidate()
      })
    },
    // 收件公司下拉
    async getReceiverCompanySelect() {
      const { code = 0, data = [] } = await receiverCompanySelect()
      if (code === 200) { // 表示成功
        this.receiverCompanyList = data
        this.basicData['_receiverCompany'].dataSource = data.map(n => ({ label: n.name, value: n.customerId }))
      }
    },
    // 通过id获取省市区信息 id的值 可以是 区id  或 城市id 或 省份id
    async getAreaInfoById(id, address, setFormDatas) {
      const { code = 0, data = { mergerName: '' }} = await areaInfo({ id: id, enabled: 'Y' })
      if (code === 200) { // 表示成功
        setFormDatas({ receiverAddress: (data.mergerName || '') + (address || '') })
      } else {
        setFormDatas({ receiverAddress: '' })
      }
    },
    // 接收人下拉
    async getSysUserSelect() {
      const { code = 0, data = { list: [] }} = await sysUserSelect({ requireOrgFlag: '1' })
      if (code === 200) { // 表示成功
        this.userList = data.list
        this.basicData['_receiver'].dataSource = data.list.map(n => ({ label: n.realName, value: n.userId }))
      }
    },
    // 快递公司下拉
    async getExpressCompanySelect() {
      const { code = 0, data = [] } = await optionConfigSelect({ fieldName: '快递公司', pageName: '仓库剪样申请单', enabled: 'Y' })
      if (code === 200) { // 表示成功
        this.basicData['_expressCompany'].dataSource = data.map(n => ({ label: n.fieldValue, value: String(n.fieldValueId) }))
      }
    },
    inputTypeChange() {
      if (this.isEdit) {
        return 'input'
      }
      return 'itemview'
    },
    selectTypeChange() {
      if (this.isEdit) {
        return 'select'
      }
      return 'itemview'
    },
    dateTypeChange() {
      if (this.isEdit) {
        return 'date'
      }
      return 'itemview'
    },
    radioGroupTypeChange() {
      if (this.isEdit) {
        return 'radio-group'
      }
      return 'itemview'
    }
  }
}
</script>
<style lang="scss">
.datePicker .el-button--text {
  display: none;
}
</style>
<style lang="scss" scoped>
.preArrayClss {

  /deep/.el-tabs__nav-wrap {
    padding-left: 26px;
    background: #fff;
    &::after {
      height: 1px;
    }
  }
  /deep/ .el-form-item--small.el-form-item{
    margin-bottom: 14px;
  }
  /deep/ .el-tabs__item {
    height: 60px;
    line-height: 60px;
    padding: 0 26px;
  }
  /deep/.precMaleft label {
    margin-left: 127px;
  }
  /deep/.precMaright {
    label {
      margin-left: 129px;
    }
  }
  /deep/ .el-tabs__item:nth-child(2) {
    font-family: PingFangSC-Regular;
    font-size: 16px;
    color: #151222;
  }
}
.isDisabled{
   /deep/ .el-form-item--small.el-form-item{
     margin-bottom: 0;
   }
}
</style>
