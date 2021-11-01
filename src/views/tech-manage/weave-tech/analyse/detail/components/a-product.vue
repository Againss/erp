<template>
  <div :class="isEdit === 'detail' ? 'product-box' : 'product'">
    <cs-custom-form
      ref="proForm"
      :data-source="analysisData"
      :options="formOtions"
      :form-datas="formDatas"
    />
  </div>
</template>

<script>
import {
  getMianClass,
  getMaoMao,
  getClothClass,
  getAnalysisData,
  getDeingType,
  getGongXu
  // getZhiRan
} from '../api/index.js'
import techRquire from './common/tech-require'
export default {
  name: 'AProduct',
  props: {
    isEdit: {
      type: String
    }
  },
  data() {
    // 公用验证正则
    const commonChangeReg = this.$getRules({})
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    // 正整数正则
    const integerReg = this.$getRules({ type: 'number', pattern: /^[1-9]\d*$/, message: '请输入正整数', trigger: ['blur'] })
    // 1~100正整数正则
    const max100Reg = this.$getRules({ type: 'number', pattern: /^([1-9]|[1-9]\d|100)$/, message: '请输入1~100的整数', trigger: ['blur'] })
    // 最大999.99正则
    const max999Reg = this.$getRules({ type: 'number', pattern: /^(([1-9]{1}\d{0,2})|(0{1}))(\.\d{1,2})?$/, message: '请输入最大3位整数或保留1到2位小数', trigger: ['blur'] })
    // 最大99999.99正则
    const max9999Reg = this.$getRules({ type: 'number', pattern: /^(([1-9]{1}\d{0,3})|(0{1}))(\.\d{1,2})?$/, message: '请输入最大4位整数或保留1到2位小数', trigger: ['blur'] })
    // const searchClothsTypeId = value => {
    //   // 获取搜索布种
    //   this.getClothsTypeId(value)
    // }
    // const searchAnalysis = value => {
    //   this.getAnalysis(value)
    // }
    // 公用组件样式
    const style = {
      'width': '100%',
      'font-size': '16px',
      'color': '#151222',
      'border-bottom': '1px #EEEFF0 solid',
      'padding': '20px 0 15px 20px',
      'margin-bottom': '15px'
    }
    const style2 = {
      'width': '100%',
      'fontSize': '16px',
      'fontWeight': '600',
      'color': '#151222',
      'border-bottom': '1px #EEEFF0 solid',
      'margin': '0 20px 15px',
      'padding': '20px 0 15px'
    }
    const itemStyle = {
      'width': '24%', 'padding-left': '20px', 'margin-bottom': '16px', 'margin-right': '0'
    }
    const analysisData = [
      {
        itemType: 'view',
        text: '分析结果',
        style
      },
      {
        prop: 'sampleAnalysisResultId',
        label: '分析编号',
        disabled: true,
        className: 'a-product-select-class',
        itemType: 'input',
        itemStyle,
        style: { 'width': '80%' },
        readonly: true
      },
      {
        prop: 'guestSample',
        label: '客样原板',
        className: 'a-product-input-class',
        itemType: 'select',
        itemStyle,
        style: { 'width': '80%' },
        placeholder: '',
        disabled: true,
        dataSource: [
          // {
          //   label: '空白',
          //   value: 'BLA'
          // },
          {
            label: '',
            value: ''
          },
          {
            label: '洗前',
            value: 'BWA'
          },
          {
            label: '洗后',
            value: 'AWA'
          }
        ]
      },
      {
        prop: 'analyzeReferencesNo',
        label: '分析引用',
        itemType: 'select',
        filterable: true,
        // remote: true,
        // remoteMethod: searchAnalysis,
        className: 'commonRemoteSearch',
        itemStyle,
        style: { 'width': '80%' },
        placeholder: '请输入客样分析单号',
        disabled: true,
        visibleChange: (value) => {
          if (value) {
            this.getAnalysis().then(res => {
              this.$set(this.analysisData[3], 'dataSource', res)
            })
          }
        },
        change: value => {
          this.$emit('getDetail', value, 'copy')
        },
        dataSource: []
      },
      {
        itemType: 'view',
        text: '产品信息',
        style: style2
      },
      {
        prop: 'fabricCategoryInfo',
        label: '面料大类',
        rules: [commonChangeReg],
        itemType: 'select',
        itemStyle,
        style: { 'width': '80%' },
        placeholder: '',
        disabled: true,
        valueType: 'object',
        dataSource: [],
        visibleChange: (flag) => {
          // this.getSelectDataFun(getMianClass, 'fabricCategoryInfo')
          flag && this.getSelectDataFunCopy(getMianClass, 'fabricCategoryInfo', {}, 5)
        }
      },
      {
        prop: 'clothsTypeInfo',
        label: '布类',
        rules: [commonChangeReg],
        itemType: 'select',
        filterable: true,
        clearable: true,
        remote: true,
        // remoteMethod: searchClothsTypeId,
        className: 'commonRemoteSearch',
        itemStyle,
        style: { 'width': '80%' },
        placeholder: '',
        disabled: true,
        valueType: 'object',
        change: (value, form, formDatas, setFormDatas) => {
          // 毛圈必填项判断条件：如果布类包含【卫衣】两个字，毛圈为必填，否则非必填，
          console.log(value)
          // this.getClothsTypeInfo(value)
          this.$emit('getClothsTypeInfo', value)
          if (value && value.label && value.label.indexOf('卫衣') > -1) {
            this.$set(this.analysisData[8], 'rules', [commonChangeReg])
          } else {
            this.$set(this.analysisData[8], 'rules', [])
          }
        },
        visibleChange: (flag) => {
          // if (value) {
          // this.getClothsTypeId('')
          flag && this.getClothsTypeIdCopy('', 6)
          // }
        },
        dataSource: []
      },
      {
        prop: 'printDeyTypeInfo',
        label: '印染类型',
        rules: [commonChangeReg],
        itemType: 'select',
        itemStyle,
        style: { 'width': '80%' },
        valueType: 'object',
        placeholder: '',
        disabled: true,
        dataSource: [],
        visibleChange: (flag) => {
          // this.getSelectDataFun(getDeingType, 'printDeyTypeInfo')
          flag && this.getSelectDataFunCopy(getDeingType, 'printDeyTypeInfo', {}, 7)
        }
      },
      {
        prop: 'terryInfo',
        label: '毛圈',
        itemType: 'select',
        rules: [commonChangeReg],
        itemStyle,
        style: { 'width': '80%' },
        placeholder: '',
        disabled: true,
        valueType: 'object',
        dataSource: [],
        visibleChange: (flag) => {
          // this.getSelectDataFun(getMaoMao, 'terryInfo', { typical: 'MQ' })
          flag && this.getSelectDataFunCopy(getMaoMao, 'terryInfo', { typical: 'MQ' }, 8)
        }
      },
      {
        prop: 'hairinessInfo',
        label: '毛羽',
        // rules: [commonChangeReg],
        valueType: 'object',
        itemType: 'select',
        itemStyle,
        style: { 'width': '80%' },
        placeholder: '',
        disabled: true,
        dataSource: [],
        visibleChange: (flag) => {
          // this.getSelectDataFun(getMaoMao, 'hairinessInfo', { typical: 'MY' })
          flag && this.getSelectDataFunCopy(getMaoMao, 'hairinessInfo', { typical: 'MY' }, 9)
        }
      },
      {
        prop: 'dryWayInfo',
        label: '干燥方式',
        rules: [commonChangeReg],
        valueType: 'object',
        itemType: 'select',
        itemStyle,
        style: { 'width': '80%' },
        placeholder: '',
        disabled: true,
        dataSource: [
          {
            value: '烘干',
            label: '烘干'
          },
          {
            value: '铺干',
            label: '铺干'
          },
          {
            value: '挂干',
            label: '挂干'
          }
        ]
      },
      {
        prop: 'shrinkL',
        label: '缩水(LxW)',
        rules: [commonBlurReg, integerReg],
        itemType: 'input',
        trim: (value) => {
          if (/^[1-9]\d*$/.test(value)) {
            this.$set(this.analysisData[11], 'error', '')
            return value
          } else {
            this.$set(this.analysisData[11], 'error', '正整数')
          }
        },
        placeholder: '整数',
        title: true,
        disabled: true,
        itemStyle: { width: '16%', 'margin-bottom': '15px', 'margin-right': '0', 'padding-left': '20px', 'padding-right': '2%' }
      },
      {
        prop: 'shrinkW',
        itemType: 'input',
        title: true,
        rules: [integerReg],
        trim: (value) => {
          if (/^[1-9]\d*$/.test(value)) {
            this.$set(this.analysisData[12], 'error', '')
            return value
          } else {
            this.$set(this.analysisData[12], 'error', '正整数')
          }
        },
        placeholder: '整数',
        itemStyle: { 'width': '8%', 'margin-bottom': '15px', 'padding-left': '10px', 'margin-left': '-2%' },
        style: { 'width': '82%' },
        label: 'X',
        disabled: true,
        labelWidth: '10'
      },
      {
        prop: 'suggestWidth',
        label: '成品布封(建议)',
        rules: [commonBlurReg, max999Reg],
        trim: (value) => {
          if (/^(([1-9]{1}\d{0,2})|(0{1}\.\d{0,2}|[1-9]{1}\d{0,2}\.\d{0,2}))$/.test(value)) {
            this.$set(this.analysisData[13], 'error', '')
            return value
          } else {
            this.$set(this.analysisData[13], 'error', '数/最大999.99')
          }
        },
        placeholder: '数字',
        itemType: 'input',
        disabled: true,
        itemStyle: { width: '16%', 'margin-bottom': '15px', 'margin-right': '0', 'padding-left': '10px', 'margin-left': '2%' }
      },
      {
        prop: 'suggestWidthUnit',
        itemType: 'select',
        itemStyle: { 'width': '8%', 'margin-bottom': '15px' },
        style: { 'width': '56%' },
        clearable: true,
        placeholder: '',
        rules: [commonChangeReg],
        disabled: true,
        dataSource: [
          {
            value: '"',
            label: '"'
          },
          {
            value: 'cm',
            label: 'cm'
          }
        ]
      },
      {
        prop: 'suggestWeight',
        label: '成品克重(建议)',
        trim: (value) => {
          if (/^(([1-9]{1}\d{0,3})|(0{1}\.\d{0,2}|[1-9]{1}\d{0,3}\.\d{0,2}))$/.test(value)) {
            this.$set(this.analysisData[15], 'error', '')
            return value
          } else {
            this.$set(this.analysisData[15], 'error', '数字/最大9999.99')
          }
        },
        placeholder: '数字',
        rules: [commonBlurReg, max9999Reg],
        itemType: 'input',
        itemStyle,
        style: { 'width': '80%' },
        disabled: true
      },
      {
        prop: 'measuredWeight',
        label: '成品克重(实测)',
        trim: (value) => {
          if (/^(([1-9]{1}\d{0,3})|(0{1}\.\d{0,2}|[1-9]{1}\d{0,3}\.\d{0,2}))$/.test(value)) {
            this.$set(this.analysisData[16], 'error', '')
            return value
          } else {
            this.$set(this.analysisData[16], 'error', '数字/最大9999.99')
          }
        },
        placeholder: '数字',
        // rules: [commonBlurReg, max9999Reg],
        itemType: 'input',
        itemStyle,
        style: { 'width': '80%' },
        disabled: true
      },
      {
        prop: 'twist',
        label: '扭度',
        trim: (value) => {
          if (/^([1-9]|[1-9]\d|100)$/.test(value)) {
            this.$set(this.analysisData[17], 'error', '')
            return value
          } else {
            this.$set(this.analysisData[17], 'error', '整数/最大100')
          }
        },
        placeholder: '正整数且最大100',
        rules: [commonBlurReg, max100Reg],
        itemType: 'input',
        itemStyle,
        style: { 'width': '80%' },
        disabled: true
      },
      {
        prop: 'slope',
        label: '斜度',
        trim: (value) => {
          if (/^([1-9]|[1-9]\d|100)$/.test(value)) {
            this.$set(this.analysisData[18], 'error', '')
            return value
          } else {
            this.$set(this.analysisData[18], 'error', '整数/最大100')
          }
        },
        placeholder: '正整数且最大100',
        rules: [commonBlurReg, max100Reg],
        itemType: 'input',
        disabled: true,
        style: { 'width': '80%' },
        itemStyle
      },
      {
        prop: 'craftRequire',
        label: '工艺要求',
        rules: [commonChangeReg],
        itemType: 'input',
        itemStyle: { 'width': '48%', 'margin-right': '0', 'padding-left': '20px', 'margin-bottom': '16px' },
        style: { 'width': '93%' },
        disabled: true,
        title: true,
        components: { techRquire },
        componentsOptions: {
          checkValList: [],
          ok: (checkValList) => {
            this.$set(this.analysisData[19].componentsOptions, 'checkValList', checkValList)
            this.formDatas = { craftRequire: checkValList }
          }
        }
      },
      {
        prop: 'processFlowInfo',
        label: '工序流程',
        // rules: [commonChangeReg],
        itemType: 'select',
        itemStyle: { 'width': '48%', 'margin-right': '0', 'padding-left': '20px', 'margin-bottom': '16px' },
        style: { 'width': '93%' },
        placeholder: '',
        disabled: true,
        dataSource: [],
        valueType: 'object',
        visibleChange: (flag) => {
          // this.getSelectDataFun(getGongXu, 'processFlowInfo')
          flag && this.getSelectDataFunCopy(getGongXu, 'processFlowInfo', {}, 20)
        }
      }
    ]

    return {
      commonChangeReg,
      formOtions: {
        inline: true,
        labelWidth: '130px'
      },
      allTechArr: [],
      analysisData,
      formDatas: {}
    }
  },
  watch: {
    isEdit(n, o) {
      this.initData(n)
    }
  },
  methods: {
    getData() {
      return new Promise((res, rej) => {
        const obj = {}
        Promise.all([
          this.getSelectDataFun(getMianClass, 'fabricCategoryInfo').then(res => {
            obj.fabricCategoryInfo = res
          }),
          this.getSelectDataFun(getDeingType, 'printDeyTypeInfo').then(res => {
            obj.printDeyTypeInfo = res
          }),
          this.getSelectDataFun(getMaoMao, 'terryInfo', { typical: 'MQ' }).then(res => {
            obj.terryInfo = res
          }),
          this.getSelectDataFun(getMaoMao, 'hairinessInfo', { typical: 'MY' }).then(res => {
            obj.hairinessInfo = res
          }),
          this.getSelectDataFun(getGongXu, 'processFlowInfo').then(res => {
            obj.processFlowInfo = res
          }),
          this.getClothsTypeId('').then(res => {
            obj.clothsTypeInfo = res
          }),
          this.getAnalysis().then(res => {
            obj.analyzeReferencesNo = res
          })
        ]).then(() => {
          Object.keys(obj).forEach(ele => {
            const i = this.analysisData.findIndex(e => e.prop === ele)
            this.$set(this.analysisData[i], 'dataSource', obj[ele])
          })
          res()
        })
      })
    },
    setProDataBili(data) {
      if (this.isEdit === 'edit') {
        this.initData('edit')
      }
      const obj = JSON.parse(JSON.stringify(data || {}))
      if (obj.craftRequire && obj.craftRequire.includes('[')) {
        obj.craftRequire = JSON.parse(obj.craftRequire)
      } else {
        obj.craftRequire = []
      }
      if (obj.suggestWeight) {
        this.$set(this.analysisData[15], 'append', 'g/m²')
      }
      if (obj.measuredWeight) {
        this.$set(this.analysisData[16], 'append', 'g/m²')
      }
      this.$set(this.analysisData[19].componentsOptions, 'checkValList', obj.craftRequire)
      this.$set(this, 'formDatas', obj)
      this.$set(this.$refs.proForm, 'dynamicValidateFormRuleForm', obj)
      this.$nextTick(() => {
        this.$refs.proForm.form.clearValidate()
      })
    },
    setProDataBiliSelect(object, num) {
      this.$set(this.analysisData[num], 'dataSource', object ? [object] : [])
    },
    // 有一些数据需要转换
    initData(val) {
      if (val === 'edit') {
        // 编辑状态
        const obj = JSON.parse(JSON.stringify(this.$refs.proForm.dynamicValidateFormRuleForm))
        // 毛圈必填项判断条件：如果布类包含【卫衣】两个字，毛圈为必填，否则非必填，
        if (obj && obj.clothsTypeInfo && obj.clothsTypeInfo.label && obj.clothsTypeInfo.label.indexOf('卫衣') > -1) {
          this.$set(this.analysisData[8], 'rules', [this.commonChangeReg])
        } else {
          this.$set(this.analysisData[8], 'rules', [])
        }
        obj.craftRequire = this.formDatas.craftRequire
        obj.ieEdit = true
        if (obj.analyzeReferencesNo) {
          this.$nextTick(() => {
            this.$set(this.formDatas, 'analyzeReferencesNo', obj.analyzeReferencesNo)
          })
        }
        if (!obj.suggestWidthUnit || obj.suggestWidthUnit === null) {
          obj.suggestWidthUnit = '"'
        }
        this.$set(this, 'formDatas', obj)
        this.$set(this.$refs.proForm, 'dynamicValidateFormRuleForm', obj)
        this.$nextTick(() => {
          this.$refs.proForm.form.clearValidate()
        })
        this.analysisData.forEach(ele => {
          ele.disabled = false
        })
        // if (!this.analysisData[11].label) {
        //   this.$set(this.analysisData[11], 'label', 'X')
        // }
        this.$set(this.analysisData[1], 'placeholder', '自动生成')
        this.$set(this.analysisData[1], 'disabled', true)
        // this.$set(this.analysisData[11], 'placeholder', '点击弹框')
        this.$set(this.analysisData[15], 'append', 'g/m²')
        this.$set(this.analysisData[16], 'append', 'g/m²')
      } else {
        this.$set(this.analysisData[11], 'placeholder', '')
        this.$set(this.analysisData[1], 'placeholder', '')
        this.analysisData.forEach(ele => {
          ele.disabled = true
        })
        this.$set(this.formDatas, 'ieEdit', false)
        this.$set(this.$refs.proForm.dynamicValidateFormRuleForm, 'ieEdit', false)
      }
    },
    // 获取下拉选数据
    async getSelectDataFun(fn, key, data = {}) {
      // const i = this.analysisData.findIndex(ele => ele.prop === key)
      // if (!this.analysisData[i].dataSource.length) {
      const res = await fn({ enabled: 'Y', ...data })
      const dataList = res.data || []
      return dataList.map(ele => ({
        value: ele.uuid,
        label: ele.name
      }))
      // const proForm = this.$refs.proForm.dynamicValidateFormRuleForm
      // console.log(proForm[key + 'Id'])
      // const tempList = this.$utils.filterOptions({ id: proForm[key + 'Id'] ? proForm[key + 'Id'] * 1 : '', data: res })
      // this.$set(this.analysisData[i], 'dataSource', res.map(ele => ({
      //   value: ele.uuid,
      //   label: ele.name
      // })))
    },
    async getSelectDataFunCopy(fn, key, data = {}, num) {
      const res = await fn({ enabled: 'Y', ...data })
      const dataList = res.data || []
      const tempList = dataList.map(ele => ({
        value: ele.uuid,
        label: ele.name
      }));
      (dataList.length !== 0) && this.$set(this.analysisData[num], 'dataSource', tempList)
    },
    // 布种搜索下拉
    async getClothsTypeId(value) {
      const res = (await getClothClass({ enabled: 'Y', name: value })).data || []
      return res.map(ele => ({
        value: ele.uuid,
        label: ele.name
      }))
      // const proForm = this.$refs.proForm.dynamicValidateFormRuleForm
      // const tempList = this.$utils.filterOptions({ id: proForm.clothsTypeId ? proForm.clothsTypeId * 1 : '', data: res })
      // this.$set(this.analysisData[6], 'dataSource', res.map(ele => ({
      //   value: ele.uuid,
      //   label: ele.name
      // })))
    },
    async getClothsTypeIdCopy(value, num) {
      const res = await getClothClass({ enabled: 'Y', name: value })
      const dataList = res.data || []
      const tempList = dataList.map(ele => ({
        value: ele.uuid,
        label: ele.name
      }))
      this.$set(this.analysisData[num], 'dataSource', tempList)
    },
    // 分析引用下拉
    async getAnalysis(value) {
      const res = (await getAnalysisData({ keyword: value })).data || []
      const list = res.filter(v => v.id).map(item => {
        return {
          label: item.id,
          value: item.csSampleAnalysisApplayId
        }
      })
      return list
      // this.$set(this.analysisData[3], 'dataSource', list)
    }
  }
}
</script>

<style lang="scss">
.el-checkbox-group {
  width: 100% !important;
  .el-checkbox__label {
    display: inline-block;
    width: 100%;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
    line-height: 12px;
  }
}
.custom-form {
  .el-form-item__label {
    color: #888E9E;
  }
}
.product {
  background: #ffffff;
  margin: 0 20px;
  .techRequire::before {
    display: block;
    content: '*';
    color: #ff4949;
    position: absolute;
    left: 60px;
  }
  .el-input-group__append {
    padding: 0 10px;
  }
}
.product-box {
  background: #ffffff;
  margin: 0 20px;
  .el-input.is-disabled .el-input__inner {
    background-color: transparent;
    border: none;
    color: #777;
    text-overflow: ellipsis;
    padding: 0;
  }
  .el-input__suffix {
    display: none;
  }

  .el-input__inner {
    background-color: transparent;
    border: none;
    text-overflow: ellipsis;
    color: #777;
  }
  .el-input-group__append {
    background-color: transparent;
    border: none;
    color: #777;
  }
  .techRequire::before {
    display: block;
    content: '*';
    color: #ff4949;
    position: absolute;
    left: 60px;
  }
}
</style>
