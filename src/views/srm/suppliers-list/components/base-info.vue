<template>
  <div class="basc">
    <cs-custom-form
      ref="baseinfo"
      :form-datas="info"
      :data-source="dataSource"
      :options="{ ...options, disabled: type === 'detail' }"
    />
    <el-dialog
      title="添加详细地址"
      :modal-append-to-body="false"
      :append-to-body="true"
      width="60%"
      :close-on-click-modal="false"
      :visible.sync="showMap"
    >
      <div class="el-vue-search-box-container">
        <div class="search-box-wrapper">
          <input
            v-model="addressValue"
            type="text"
            :disabled="type === 'detail'"
            @input="autoComplete"
          >
          <span v-if="type !== 'detail'" class="search-btn" @click="autoComplete">搜索</span>
        </div>
        <div class="search-tips">
          <ul>
            <li
              v-for="(tip, index) in tips"
              :key="index"
              :class="{ 'autocomplete-selected': index === selectedTip }"
              @click="onSearchResult(tip)"
              @mouseover="selectedTip = index"
            >
              {{ tip.name }}
              <span style="margin-left:10px; color: #777; font-size: 10px;">
                {{ tip.district }}
              </span>
            </li>
          </ul>
        </div>
      </div>
      <div id="container" />
      <span
        v-if="type !== 'detail'"
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="showMap = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import * as api from '../api/index'
import { loadMP } from './common/amap'
export default {
  name: 'BaseInfo',
  props: {
    info: {
      type: Object,
      default: () => ({})
    },
    setData: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    const itemStyle = {
      width: '45%',
      display: 'inline-block'
    }
    const regNum = (rule, value, callback) => {
      const reg = /(^[1-9](\d+)?(\.\d{1,2})?$)|(^\d\.\d{1,2}$)/
      if (!value) {
        return callback(new Error('请输入'))
      } else if (value && !reg.test(value)) {
        return callback(new Error('请输入正数且最多两位小数'))
      }
      return callback()
    }
    const dataSource = {
      _supplierNo: {
        prop: 'supplierNo',
        itemType: 'input',
        labelWidth: '200px',
        label: '供应商编码',
        placeholder: '保存后自动生成',
        disabled: true,
        itemStyle
      },
      _supplierName: {
        prop: 'supplierName',
        itemType: 'input',
        labelWidth: '200px',
        label: '公司名称',
        rules: [{
          required: true,
          message: '请输入名称！',
          trigger: 'blur'
        }],
        itemStyle
      },
      _supplierAbbreviation: {
        prop: 'supplierAbbreviation',
        itemType: 'input',
        labelWidth: '200px',
        label: '公司简称',
        rules: [{
          required: true,
          message: '请输入简称！',
          trigger: 'blur'
        }],
        itemStyle
      },
      _creditCode: {
        prop: 'creditCode',
        itemType: 'input',
        labelWidth: '200px',
        maxlength: 20,
        label: '统一社会信用代码',
        rules: [
          {
            required: true,
            message: '请输入！',
            trigger: 'blur'
          },
          this.$getRules({
            type: 'password',
            pattern: /^[0-9]{2,20}$|^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{2,20}$/,
            trigger: 'blur',
            message: '最多20位数字或数字加字母'
          })
        ],
        itemStyle
      },
      _establishedTime: {
        prop: 'establishedTime',
        itemType: 'date',
        labelWidth: '200px',
        label: '成立时间',
        rules: [{
          required: true,
          message: '请选择时间！',
          trigger: 'change'
        }],
        itemStyle
      },
      _status: {
        prop: 'status',
        itemType: 'select',
        labelWidth: '200px',
        label: '供应商状态',
        dataSource: [
          { label: '待审', value: 1 },
          { label: '草稿', value: 0 },
          { label: '不合格', value: 6 },
          { label: '战略', value: 3 },
          { label: '核心', value: 4 },
          { label: '合格', value: 5 },
          { label: '备用', value: 2 }
        ],
        itemStyle
      },
      _supplierCategory: {
        prop: 'supplierCategory',
        itemType: 'radio-group',
        labelWidth: '200px',
        label: '供应商类别',
        dataSource: [
          { label: '采购', value: 0 },
          { label: '服务', value: 1 }
        ],
        rules: [{
          required: true,
          message: '请选择类别！',
          trigger: 'change'
        }],
        change: (val, form, formDatas, setFormDatas) => {
          const obj = { ...formDatas }
          obj.supplierTypeIdList = []
          setFormDatas({ ...obj })
          this.resetForm(obj)
        },
        itemStyle
      },
      _supplierTypeIdList: {
        prop: 'supplierTypeIdList',
        itemType: 'select',
        labelWidth: '200px',
        label: '供应商类型',
        multiple: true,
        clearable: true,
        collapseTags: false,
        rules: [{
          required: true,
          message: '请选择类型！',
          trigger: 'change'
        }],
        dataSource: [],
        change: (val, form, formDatas, setFormDatas) => {
          // setFormDatas({ ...formDatas, supplierType: val })
          this.setData('supplierInfo', { ...formDatas, supplierTypeIdList: val })
        },
        itemStyle
      },
      _region: {
        prop: 'region',
        itemType: 'select',
        labelWidth: '200px',
        label: '所属区域',
        dataSource: [
          { label: '大陆', value: 1 },
          { label: '港澳台', value: 2 },
          { label: '海外', value: 3 }
        ],
        rules: [{
          required: true,
          message: '请选择区域！',
          trigger: 'change'
        }],
        itemStyle,
        change: (val, form, formDatas, setFormDatas) => {
          const obj = { ...formDatas }
          obj.provinceCode = obj.cityCode = obj.areaCode = ''
          setFormDatas({ ...obj })
          this.resetForm(obj)
        }
      },
      _provinceCode: {
        isShow: () => this.formDev && this.formDev.dynamicValidateFormRuleForm.region !== 3,
        prop: 'provinceCode',
        itemType: 'select',
        labelWidth: '200px',
        label: '所属地区',
        placeholder: '省',
        dataSource: [],
        itemStyle: {
          display: 'inline-block',
          width: '23%'
        },
        rules: [{
          required: true,
          message: '请选择省！',
          trigger: 'change'
        }],
        change: (val, form, formDatas, setFormDatas) => {
          const obj = { ...formDatas }
          obj.cityCode = obj.areaCode = ''
          setFormDatas({ ...obj })
          this.resetForm(obj)
        }
      },
      _cityCode: {
        isShow: () => this.formDev && this.formDev.dynamicValidateFormRuleForm.region !== 3,
        prop: 'cityCode',
        itemType: 'select',
        labelWidth: '10px',
        placeholder: '市',
        dataSource: [],
        itemStyle: {
          display: 'inline-block',
          width: '11%'
        },
        rules: [{
          required: true,
          message: '请选择市！',
          trigger: 'change'
        }],
        change: (val, form, formDatas, setFormDatas) => {
          const obj = { ...formDatas }
          obj.areaCode = ''
          setFormDatas({ ...obj })
          this.resetForm(obj)
        }
      },
      _areaCode: {
        isShow: () => this.formDev && this.formDev.dynamicValidateFormRuleForm.region !== 3,
        prop: 'areaCode',
        itemType: 'select',
        labelWidth: '10px',
        placeholder: '区',
        rules: [{
          required: true,
          message: '请选择区！',
          trigger: 'change'
        }],
        dataSource: [],
        itemStyle: {
          display: 'inline-block',
          width: '11%'
        },
        change: (val, form, formDatas, setFormDatas) => {
          const obj = { ...formDatas }
          setFormDatas({ ...obj })
          this.resetForm(obj)
        }
      },
      _addressDetailed: {
        prop: 'addressDetailed',
        itemType: 'input',
        labelWidth: '200px',
        label: '详细地址',
        disabled: true,
        title: true,
        rules: [{
          required: true,
          message: '地址不能为空',
          trigger: 'blur'
        }],
        itemStyle: {
          display: 'inline-block',
          width: '38%'
        },
        isShow: () => this.formDev && this.formDev.dynamicValidateFormRuleForm.region !== 3
      },
      _ditu: {
        prop: 'ditu',
        itemType: 'itemview',
        labelWidth: '10px',
        renderContent: () => {
          return `<div style="color: #0986ff;cursor: pointer;">查看地图</div>`
        },
        handle: () => {
          const info = {
            addressDetailed: this.info.addressDetailed,
            addressLongitude: this.info.addressLongitude,
            addressLatitude: this.info.addressLatitude
          }
          this.open(info)
        },
        itemStyle: {
          display: 'inline-block',
          width: '7%'
        },
        isShow: () => this.formDev && this.formDev.dynamicValidateFormRuleForm.region !== 3
      },
      _areaCovered: {
        prop: 'areaCovered',
        itemType: 'input',
        labelWidth: '200px',
        label: '占地面积(平米)',
        rules: [{
          required: true,
          trigger: 'blur',
          validator: regNum
        }],
        itemStyle
      },
      _registeredCapital: {
        prop: 'registeredCapital',
        itemType: 'input',
        labelWidth: '200px',
        label: '注册资本',
        rules: [{ trigger: 'blur', validator: regNum }],
        itemStyle: {
          display: 'inline-block',
          width: '35%'
        }
      },
      _registeredCapitalUnit: {
        prop: 'registeredCapitalUnit',
        itemType: 'select',
        labelWidth: '10px',
        itemStyle: {
          display: 'inline-block',
          width: '10%'
        },
        dataSource: [
          { label: '万元', value: 0 },
          { label: '万美元', value: 1 },
          { label: '万港元', value: 2 }
        ]
      },
      _legalPerson: {
        prop: 'legalPerson',
        itemType: 'input',
        labelWidth: '200px',
        label: '法人代表',
        rules: [{
          required: true,
          message: '请输入法人代表！',
          trigger: 'blur'
        }],
        itemStyle
      },
      _assessmentPeriodId: {
        prop: 'assessmentPeriodId',
        itemType: 'select',
        labelWidth: '200px',
        label: '考核周期',
        rules: [{
          required: true,
          message: '请选择考核周期！',
          trigger: 'change'
        }],
        dataSource: [
          { label: '月', value: 1 },
          { label: '季', value: 2 },
          { label: '半年', value: 3 },
          { label: '年', value: 4 }
        ],
        itemStyle
      },
      _payMode: {
        prop: 'payMode',
        itemType: 'select',
        labelWidth: '200px',
        label: '付款方式',
        rules: [{
          required: true,
          message: '请选择付款方式！',
          trigger: 'change'
        }],
        dataSource: [],
        itemStyle
      },
      _taxRate: {
        prop: 'taxRate',
        itemType: 'input',
        labelWidth: '200px',
        label: '税率（%）',
        rules: [{
          required: true,
          trigger: 'blur',
          validator: regNum
        }],
        itemStyle
      },
      _systemBrand: {
        prop: 'systemBrand',
        itemType: 'input',
        labelWidth: '200px',
        label: 'ERP系统品牌',
        rules: [{
          required: true,
          message: '请输入系统品牌！',
          trigger: 'blur'
        }],
        itemStyle
      },
      _plantCapacity: {
        prop: 'plantCapacity',
        itemType: 'input',
        labelWidth: '200px',
        label: '工厂总产能（吨/月）',
        rules: [{
          required: true,
          trigger: 'blur',
          validator: regNum
        }],
        itemStyle
      },
      _availableZhibuCapacity: {
        prop: 'availableZhibuCapacity',
        itemType: 'input',
        labelWidth: '200px',
        label: '可供智布总产能（吨/月）',
        rules: [{
          required: true,
          trigger: 'blur',
          validator: regNum
        }],
        itemStyle
      },
      _employeeTotal: {
        prop: 'employeeTotal',
        itemType: 'input',
        labelWidth: '200px',
        maxlength: 50,
        label: '职工总数',
        rules: [
          this.$getRules({
            type: 'password',
            pattern: /(^[1-9]\d*$)/,
            trigger: 'blur',
            message: '只能输正整数'
          })
        ],
        itemStyle
      },
      _workerTotal: {
        prop: 'workerTotal',
        itemType: 'input',
        labelWidth: '200px',
        maxlength: 50,
        label: '生产人员总数',
        rules: [
          this.$getRules({
            type: 'password',
            pattern: /(^[1-9]\d*$)/,
            trigger: 'blur',
            message: '只能输正整数'
          })
        ],
        itemStyle
      },
      _hasOffice: {
        prop: 'hasOffice',
        itemType: 'radio-group',
        labelWidth: '200px',
        label: '佛山是否有办事处',
        maxlength: '10',
        dataSource: [
          { label: '有', value: 1 },
          { label: '无', value: 0 }
        ],
        itemStyle
      },
      _hasOverseasFactory: {
        prop: 'hasOverseasFactory',
        itemType: 'radio-group',
        labelWidth: '200px',
        label: '有无海外工厂',
        maxlength: '10',
        dataSource: [
          { label: '有', value: 1 },
          { label: '无', value: 0 }
        ],
        itemStyle
      },
      _hasExportRight: {
        prop: 'hasExportRight',
        itemType: 'radio-group',
        labelWidth: '200px',
        label: '有无自营出口权',
        dataSource: [
          { label: '有', value: 1 },
          { label: '无', value: 0 }
        ],
        itemStyle
      },
      _hasSocial: {
        prop: 'hasSocial',
        itemType: 'radio-group',
        labelWidth: '200px',
        label: '社会责任认证',
        dataSource: [
          { label: '有', value: 1 },
          { label: '无', value: 0 }
        ],
        itemStyle
      },
      _isErpUser: {
        isShow: () => {
          const data = this.formDev && this.formDev.dynamicValidateFormRuleForm.supplierTypeIdList
          return data && data.includes(10003)
        },
        prop: 'isErpUser',
        itemType: 'radio-group',
        labelWidth: '200px',
        label: '是否织ERP用户',
        dataSource: [
          { label: '是', value: true },
          { label: '否', value: false }
        ],
        itemStyle,
        rules: [{ required: true, message: '请选择！', trigger: 'change' }]
      },
      _isMesUser: {
        isShow: () => {
          const data = this.formDev && this.formDev.dynamicValidateFormRuleForm.supplierTypeIdList
          return data && data.includes(10003)
        },
        prop: 'isMesUser',
        itemType: 'radio-group',
        labelWidth: '200px',
        label: '是否MES用户',
        dataSource: [
          { label: '是', value: true },
          { label: '否', value: false }
        ],
        itemStyle,
        rules: [{
          required: true,
          message: '请选择！',
          trigger: 'change'
        }]
      },
      _isPartner: {
        isShow: () => {
          const data = this.formDev && this.formDev.dynamicValidateFormRuleForm.supplierTypeIdList
          return data && data.includes(10003)
        },
        prop: 'isPartner',
        itemType: 'radio-group',
        labelWidth: '200px',
        label: '是否接智布订单',
        dataSource: [
          { label: '是', value: true },
          { label: '否', value: false }
        ],
        itemStyle,
        rules: [{
          required: true,
          message: '请选择！',
          trigger: 'change'
        }]
      }
    }
    return {
      options: {
        getForm: val => {
          this.formDev = val.$parent
        }
      },
      dataSource,
      areaList: [],
      supplierTypeList: [],
      // 地图相关
      showMap: false,
      tips: [],
      addressValue: '',
      searchDatas: {},
      selectedTip: -1
    }
  },
  computed: {
    type() {
      return this.$route.params.type
    },
    _autoComplete() {
      return new window.AMap.Autocomplete({
        city: '全国',
        citylimit: true
      })
    }
  },
  created() {
    this.getDataSource()
    loadMP()
  },
  methods: {
    autoComplete() {
      if (this.addressValue && window.AMap) {
        window.AMap.plugin('AMap.Autocomplete', () => {
          const cityID = this.areaList.find(e => this.formDev.dynamicValidateFormRuleForm && this.formDev.dynamicValidateFormRuleForm.cityCode && e.value * 1 === this.formDev.dynamicValidateFormRuleForm.cityCode * 1)
          const city = cityID && cityID.label || '全国'
          const autoComplete = new window.AMap.Autocomplete({
            city,
            citylimit: true
          })
          autoComplete.search(this.addressValue, (status, res) => {
            if (status === 'complete') {
              this.tips = res.tips
            }
          })
        })
      }
    },
    open(info) {
      this.showMap = true
      let center = null
      if (info.addressLongitude && info.addressLatitude) {
        center = [info.addressLongitude, info.addressLatitude]
      }
      if (info.addressDetailed) {
        this.addressValue = info.addressDetailed
        this.searchDatas = { ...info }
      }
      this.$nextTick(() => {
        this.map = new window.AMap.Map('container', {
          zoom: 11,
          center: center || [113.936407, 22.522776]
        })
        if (center && center.every(e => e)) {
          const marker = new window.AMap.Marker({
            position: center
          })
          this.map.add(marker)
        }
        this.tips = []
      })
    },
    onSearchResult(pois) {
      const center = [pois.location.lng, pois.location.lat]
      this.searchDatas = {
        addressDetailed: pois.name,
        addressLongitude: pois.location.lng,
        addressLatitude: pois.location.lat
      }
      this.addressValue = pois.name
      this.map = new window.AMap.Map('container', {
        zoom: 16,
        center
      })
      const marker = new window.AMap.Marker({
        position: center
      })
      this.map.add(marker)
      this.tips = []
    },
    submit() {
      if (!this.searchDatas.addressDetailed) {
        this.$message.info('请选择详细地址')
      } else {
        this.setData('supplierInfo', {
          ...this.formDev.dynamicValidateFormRuleForm,
          ...this.searchDatas
        })
        this.showMap = false
      }
    },
    // 下拉选数据
    async getDataSource() {
      const resArea = await api.openapiAreaSearch()
      this.areaList = (resArea.data || []).map(e => ({
        label: e.name,
        value: String(e.id),
        parentId: String(e.parentId)
      }))
      const resPay = await api.getPaymentData()
      this.dataSource['_payMode'].dataSource = (resPay.data && resPay.data.list || []).map(e => ({
        label: e.payWay,
        value: String(e.id),
        disabled: !e.status
      }))
      const resCyc = await api.getPublicCycleData()
      this.dataSource['_assessmentPeriodId'].dataSource = (resCyc.data && resCyc.data.list || []).map(e => ({
        label: e.assessmentPeriodType,
        value: parseInt(e.id),
        disabled: !e.status
      }))
      const resSup = await api.getSupplierTypeListData({ status: 1 })
      this.supplierTypeList = (resSup.data && resSup.data.list || []).map(e => ({
        label: e.typeName,
        value: e.id,
        supplierCategory: e.supplierCategory
      }))
      this.setDataSource(this.info)
      this.$nextTick(() => {
        if (this.info.status < 2) {
          this.$set(this.dataSource['_status'], 'disabled', true)
        } else {
          const arr = [...this.dataSource['_status'].dataSource]
          arr[0].disabled = arr[1].disabled = true
          this.$set(this.dataSource['_status'], 'dataSource', arr)
        }
      })
    },
    // 地区、省市区切换
    setDataSource(val = {}) {
      this.dataSource['_supplierTypeIdList'].dataSource = this.supplierTypeList.filter(e => e.supplierCategory === val.supplierCategory)
      if (val.region) {
        const list = this.areaList.filter(e => e.parentId === '0')
        if (val.region === 1) {
          this.dataSource['_provinceCode'].dataSource = list.filter(e => !(e.label.includes('香港') || e.label.includes('台湾') || e.label.includes('澳门')))
        }
        if (val.region === 2) {
          this.dataSource['_provinceCode'].dataSource = list.filter(e => e.label.includes('香港') || e.label.includes('台湾') || e.label.includes('澳门'))
        }
        if (val.provinceCode) {
          this.dataSource['_cityCode'].dataSource = this.areaList.filter(e => e.parentId === val.provinceCode)
        }
        if (val.cityCode) {
          this.dataSource['_areaCode'].dataSource = this.areaList.filter(e => e.parentId === val.cityCode)
        }
      }
    },
    resetForm(data) {
      this.$nextTick(() => {
        this.setData('supplierInfo', data)
        this.setDataSource(data)
        this.$refs.baseinfo.form.clearValidate()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
#container {
  margin-top: -50px;
  width: 100%;
  height: 450px;
}
.el-vue-search-box-container {
  position: relative;
  width: 360px;
  height: 45px;
  background: #fff;
  box-shadow: 0 2px 2px rgba(0,0,0,.15);
  border-radius: 2px 3px 3px 2px;
  margin-left: 20px;
  z-index: 10;
  white-space: nowrap;
  .search-box-wrapper {
    position: absolute;
    display: flex;
    align-items: center;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    box-sizing: border-box;

    input {
      flex: 1;
      height: 20px;
      line-height: 20px;
      letter-spacing: .5px;
      font-size: 14px;
      text-indent: 10px;
      box-sizing: border-box;
      border: none;
      outline: none;
    }

    .search-btn {
      width: 45px;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: transparent;
      cursor: pointer;
    }
  }

  .search-tips {
    position: absolute;
    top: 100%;
    border: 1px solid #dbdbdb;
    background: #FFF;
    overflow: auto;

    ul {
      padding: 0;
      margin: 0;

      li {
        height: 40px;
        line-height: 40px;
        box-shadow: 0 1px 1px rgba(0,0,0,.1);
        padding: 0 10px;
        cursor: pointer;

        &.autocomplete-selected {
          background: #eee;
        }
      }
    }
  }
}
.basc {
  margin-top: 20px;
  /deep/ .el-form {
    display: flex;
    flex-wrap: wrap;
  }
}
.amap-page-container {
    margin-top: -50px;
    margin-bottom: 50px;
    width: 100%;
    height: 450px;
  }
  .search-box {
    margin-top: 0px;
    position: relative;
    top: 65px;
    left: 20px;
  }
</style>
