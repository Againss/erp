<template>
  <div :class="isEdit === 'detail' ? 'product-box' : 'product'" class="a-product">
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
  getGongXu,
  getDryingMethod
} from '../api/index.js'
export default {
  name: 'AProduct',
  props: {
    isEdit: {
      type: String
    },
    orderType: {
      type: String
    }
  },
  data() {
    // 公用组件样式
    const style2 = {
      'width': '100%',
      'fontSize': '16px',
      'color': '#151222',
      'border-bottom': '1px #EEEFF0 solid',
      'margin': '0 20px 15px',
      'padding': '20px 0 15px'
    }
    const itemStyle = {
      'width': '46%', 'padding-left': '20px', 'margin-bottom': '16px', 'margin-right': '0'
    }

    const maxNumberReg = this.$getRules({
      type: 'number',
      pattern: /^[1-9]\d*$/,
      message: '请输入最多三位正整数',
      trigger: ['blur']
    })
    const analysisData = {
      _view: {
        itemType: 'view',
        text: '产品信息',
        style: style2
      },
      _cloth: {
        prop: 'cloth',
        label: '布类',
        itemType: this.inputTypeChange,
        itemStyle,
        placeholder: '',
        disabled: true,
        showOverflowTooltip: true,
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return value ? `<div class="render-content" title='${value}' >${value}</div>` : ''
        }
      },
      _garmentPartInfo: {
        prop: 'garmentPartInfo',
        label: '成衣部位',
        itemType: this.inputTypeChange,
        itemStyle,
        placeholder: '',
        disabled: true,
        showOverflowTooltip: true,
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return value ? `<div class="render-content" title='${value}' >${value}</div>` : ''
        }
      },
      _suggestWidth: {
        prop: 'suggestWidth',
        label: '成品幅宽/公差',
        itemType: this.inputTypeChange,
        itemStyle,
        placeholder: '',
        disabled: true,
        showOverflowTooltip: true,
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return value ? `<div class="render-content" title='${value}' >${value}</div>` : ''
        }
      },
      _weightBefore: {
        prop: 'weightBefore',
        label: '成品克重(洗前)/公差',
        itemType: this.inputTypeChange,
        itemStyle,
        placeholder: '',
        disabled: true,
        showOverflowTooltip: true,
        renderContent: (value) => {
          return value ? `<div class="render-content" title='${value}' >${value}</div>` : ''
        }
      },
      _weightAfter: {
        prop: 'weightAfter',
        label: '成品克重(洗后)/公差',
        itemType: this.inputTypeChange,
        itemStyle,
        placeholder: '',
        disabled: true,
        showOverflowTooltip: true,
        renderContent: (value) => {
          return value ? `<div class="render-content" title='${value}' >${value}</div>` : ''
        }
      },
      _suggestWeight: {
        prop: 'suggestWeight',
        label: '成品规格',
        itemType: this.inputTypeChange,
        itemStyle,
        placeholder: '',
        disabled: true,
        showOverflowTooltip: true,
        isShow: false,
        renderContent: (value) => {
          return value ? `<div class="render-content" title='${value}' >${value}</div>` : ''
        }
      },
      _weightAcceptanceCriteria: {
        prop: 'weightAcceptanceCriteria',
        label: '克重标准',
        itemType: this.inputTypeChange,
        itemStyle,
        placeholder: '',
        disabled: true,
        showOverflowTooltip: true,
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return value || ''
        }
      },
      _elementRatio: {
        prop: 'elementRatio',
        label: '成份比例(客户)',
        itemType: this.inputTypeChange,
        itemStyle,
        placeholder: '',
        disabled: true,
        showOverflowTooltip: true,
        renderContent: (value) => {
          return value ? `<div class="render-content" title='${value}' >${value}</div>` : ''
        }
      },
      _craftElementRatio: {
        prop: 'craftElementRatio',
        label: '成份比例(工艺)',
        itemType: this.inputTypeChange,
        itemStyle,
        placeholder: '',
        disabled: true,
        showOverflowTooltip: true,
        renderContent: (value) => {
          return value ? `<div class="render-content" title='${value}' >${value}</div>` : ''
        }
      },
      _customerColor: {
        prop: 'customerColor',
        label: '客户颜色',
        itemType: this.inputTypeChange,
        itemStyle,
        placeholder: '',
        disabled: true,
        showOverflowTooltip: true,
        isShow: () => {
          // 订单类型为备坯：不显示
          return this.showProp
        }
      },
      _colorLevel: {
        prop: 'colorLevel',
        label: '色级',
        itemType: this.selectTypeChange,
        itemStyle,
        placeholder: '',
        disabled: true,
        dataSource: [
          {
            value: '1',
            label: '深'
          },
          {
            value: '2',
            label: '中'
          },
          {
            value: '3',
            label: '浅'
          },
          {
            value: '4',
            label: '白'
          }
        ],
        renderContent: (value) => {
          return value ? `<div class="render-content" title='${value}' >${value}</div>` : ''
        }
      },
      _fabricColorNo: {
        prop: 'fabricColorNo',
        label: '智布色号',
        itemType: this.inputTypeChange,
        itemStyle,
        placeholder: '',
        disabled: true,
        showOverflowTooltip: true,
        isShow: () => {
          // 订单类型为备坯：不显示
          return this.showProp
        },
        renderContent: (value) => {
          return value ? `<div class="render-content" title='${value}' >${value}</div>` : ''
        }

      },
      _colorInfoType: {
        prop: 'colorInfoType',
        label: '色号类型/编号',
        itemType: this.inputTypeChange,
        itemStyle,
        placeholder: '',
        disabled: true,
        showOverflowTooltip: true,
        isShow: () => {
          // 订单类型为备坯：不显示
          return this.showProp
        },
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          // const colorInfoType = formDatas.colorInfoType || ''// 类型
          // const colorCode = formDatas.colorCode || ''// 编号
          // const str = (colorInfoType ? colorInfoType + '/' : '') + colorCode
          return value ? `<div class="render-content" title='${value}' >${value}</div>` : ''
        }
      },

      _fabricFlowerNo: {
        prop: 'fabricFlowerNo',
        label: '智布花号',
        itemType: this.inputTypeChange,
        itemStyle,
        placeholder: '',
        disabled: true,
        showOverflowTooltip: true,
        isShow: () => {
          // 订单类型为备坯：不显示
          return this.showProp
        },
        renderContent: (value) => {
          return value ? `<div class="render-content" title='${value}' >${value}</div>` : ''
        }
      },
      _flowerInfoType: {
        prop: 'flowerInfoType',
        label: '花号类型/编号',
        itemType: this.inputTypeChange,
        itemStyle,
        placeholder: '',
        disabled: true,
        showOverflowTooltip: true,
        isShow: () => {
          // 订单类型为备坯：不显示
          return this.showProp
        },
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          // const flowerInfoType = formDatas.flowerInfoType || ''// 类型
          // const flowerCode = formDatas.flowerCode || ''// 编号
          // const str = (flowerInfoType ? flowerInfoType + '/' : '') + flowerCode
          return value ? `<div class="render-content" title='${value}' >${value}</div>` : ''
        }

      },
      _shrinkL: {
        prop: 'shrinkL',
        label: '缩水',
        itemType: this.inputTypeChange,
        itemStyle,
        placeholder: '',
        disabled: true,
        renderContent: (value) => {
          return value ? `<div class="render-content" title='${value}' >${value}</div>` : ''
        }
      },
      _dryWayInfo: {
        prop: 'dryWayInfo',
        label: '干燥方式',
        // valueType: 'object',
        // itemType: 'select',
        itemType: this.selectTypeChange,
        itemStyle,
        placeholder: '',
        disabled: true,
        readonly: true,
        showOverflowTooltip: true,
        // title: true,
        isShow: true,
        dataSource: [],
        visibleChange: (flag) => {
          flag && getDryingMethod({ enabled: 'Y' }).then(res => {
            const dataList = res.data
            this.$set(this.analysisData._dryWayInfo, 'dataSource', dataList.map(item => {
              return {
                label: item.name,
                value: item.id + ''
              }
            }))
          })
        },
        renderContent: (value) => {
          return value ? `<div class="render-content" title='${value}'>${value}</div>` : ''
        }
      },
      _knitNo: {
        prop: 'knitNo',
        label: '坯布编码',
        itemType: this.inputTypeChange,
        itemStyle,
        placeholder: '',
        disabled: true
      },
      _dyeCraft: {
        prop: 'dyeCraft',
        label: '染整工艺(客户)',
        itemType: this.inputTypeChange,
        itemStyle,
        placeholder: '',
        disabled: true,
        readonly: true,
        showOverflowTooltip: true,
        title: true,
        renderContent: (value) => {
          return value ? `<div class="render-content" title='${value}'>${value}</div>` : ''
        }
      },
      _cpi: {
        prop: 'cpi',
        label: 'CPI/WPI',
        itemType: this.inputTypeChange,
        maxlength: 3,
        rules: [maxNumberReg],
        placeholder: '',
        style: { 'width': '100%' },
        itemStyle: { width: '32%', 'margin-bottom': '15px', 'margin-right': '0', 'padding-left': '20px' },
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          if (formDatas.cpi || formDatas.wpi) {
            return `<span title=${formDatas.cpi}/${formDatas.wpi}>${formDatas.cpi}/${formDatas.wpi}</span>`
          } else {
            return ''
          }
        }
      },
      _wpi: {
        prop: 'wpi',
        itemType: this.inputTypeChange,
        maxlength: 3,
        rules: [maxNumberReg],
        placeholder: '',
        itemStyle: { 'width': '14%', 'margin-bottom': '15px', 'padding-left': '10px', 'margin-right': '0px' },
        style: { 'width': '100%' },
        label: '',
        labelWidth: '10',
        // isShow: () => {
        //   if (this.isEdit === 'edit') {
        //     return true
        //   }
        //   return false
        // },
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return ''
        }
      },

      _isSoft: {
        prop: 'isSoft',
        label: '是否制软',
        itemType: 'select',
        itemStyle,
        placeholder: '',
        disabled: true,
        readonly: true,
        isShow: false,
        dataSource: [
          {
            value: 'N',
            label: '否'
          },
          {
            value: 'Y',
            label: '是'
          }
        ]
      },
      _isPique: {
        prop: 'isPique',
        label: '是否珠地边',
        itemType: 'select',
        itemStyle,
        placeholder: '',
        disabled: true,
        readonly: true,
        isShow: false,
        dataSource: [
          {
            value: 'N',
            label: '否'
          },
          {
            value: 'Y',
            label: '是'
          }
        ]
      },
      _cutGummed: {
        prop: 'cutGummed',
        label: '浆切边',
        itemType: 'select',
        itemStyle,
        placeholder: '',
        disabled: true,
        readonly: true,
        isShow: false,
        dataSource: [
          {
            value: 'Y',
            label: '浆切边'
          },
          {
            value: 'N',
            label: '浆边不切边'
          }
        ]
      },
      _oilFeel: {
        prop: 'oilFeel',
        label: '硅油手感',
        itemType: 'select',
        itemStyle,
        placeholder: '',
        disabled: true,
        readonly: true,
        isShow: false,
        dataSource: [
          {
            value: 'N',
            label: '否'
          },
          {
            value: 'Y',
            label: '是'
          }
        ]
      },

      _printCraft: {
        prop: 'printCraft',
        label: '印花工艺(客户)',
        itemType: this.inputTypeChange,
        itemStyle,
        placeholder: '',
        disabled: true,
        readonly: true,
        showOverflowTooltip: true,
        title: true,
        renderContent: (value) => {
          return value ? `<div class="render-content" title='${value}'>${value}</div>` : ''
        }
      },
      _productProcedure: {
        prop: 'productProcedure',
        label: '生产流程',
        itemType: this.inputTypeChange,
        itemStyle,
        placeholder: '',
        disabled: true,
        showOverflowTooltip: true,
        title: true,
        renderContent: (value) => {
          return value ? `<div class="render-content" title='${value}' >${value}</div>` : ''
        }

      },
      _sampleAnalysisResultId: {
        prop: 'sampleAnalysisResultId',
        label: '客样分析单',
        itemType: this.inputTypeChange,
        itemStyle,
        placeholder: '',
        disabled: true,
        showOverflowTooltip: true,
        isShow: false
      },
      _processFlow: {
        prop: 'processFlow',
        label: '工序流程',
        itemType: this.inputTypeChange,
        itemStyle: { 'width': '60%', 'margin-bottom': '15px', 'margin-right': '0', 'padding-left': '20px' },
        placeholder: '',
        disabled: true,
        showOverflowTooltip: true,
        title: true,
        isShow: false
      },
      _view11: {
        itemType: 'view',
        text: '',
        style: { 'width': '50%', 'padding-left': '149px', 'color': '#0986ff', 'font-size': '14px', 'cursor': 'pointer' },
        // handle: () => {
        //   this.$emit('showRequire')
        // },
        isShow: () => {
          return this.shwoView
        }
      },
      _view1: {
        itemType: 'view',
        text: '染纱详情',
        style: { 'padding-left': '149px', 'color': '#0986ff', 'font-size': '14px', 'cursor': 'pointer' },
        handle: () => {
          this.$emit('showRequire')
        },
        isShow: () => {
          return this.shwoView
        }
      }
    }

    return {
      formOtions: {
        inline: true,
        labelWidth: '200px'
      },
      allTechArr: [],
      analysisData,
      formDatas: {},
      wpi: ''
    }
  },
  computed: {
    shwoView() {
      let t = false
      const data = this.formDatas && this.formDatas.productProcedure
      if (data && data.indexOf('染纱') !== -1) {
        t = true
      } else {
        t = false
      }
      return t
    },
    showProp() {
      return this.orderType !== 'R'
    }
  },
  watch: {
    isEdit(n, o) {
      if (n && n === 'edit') {
        this.$set(this.analysisData._wpi, 'label', '/')
      } else {
        this.$set(this.analysisData._wpi, 'label', '')
      }
      this.initData(n)
    }
  },
  mounted() {
    this.getDryingMethodData()
    this.getData()
  },
  methods: {
    inputTypeChange() {
      return this.isEdit === 'edit' ? 'input' : 'itemview'
    },
    selectTypeChange() {
      return this.isEdit === 'edit' ? 'select' : 'itemview'
    },
    getData() {
      return new Promise((res, rej) => {
        const obj = {}
        Promise.all([
          this.getSelectDataFun(getMianClass, 'fabricCategoryInfo').then(res => {
            obj.fabricCategoryInfo = res
          }),
          // this.getSelectDataFun(getDeingType, 'printDeyTypeInfo').then(res => {
          //   obj.printDeyTypeInfo = res
          // }),
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
          })
          // this.getAnalysis().then(res => {
          //   obj.analyzeReferencesNo = res
          // })
        ]).then(() => {
          Object.keys(obj).forEach(ele => {
            // debugger
            // console.log(this.analysisData)
            // const i = this.analysisData.findIndex(e => e.prop === ele)
            // this.$set(this.analysisData[i], 'dataSource', obj[ele])
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
      // this.$set(this.analysisData[19].componentsOptions, 'checkValList', obj.craftRequire)
      this.$set(this, 'formDatas', obj)
      this.$set(this.$refs.proForm, 'dynamicValidateFormRuleForm', obj)
      this.$nextTick(() => {
        this.$refs.proForm.form.clearValidate()
      })
    },
    setProDataBiliSelect(object) {
      this.object = { ...object }

      this.$set(this, 'formDatas', object)
    },
    // 有一些数据需要转换
    initData(val) {
      if (val === 'edit') {
        this.$set(this.analysisData._wpi, 'label', '')
        this.$set(this, 'formDatas', this.object)
      } else {
        // for (const key in this.analysisData) {
        //   this.analysisData[key].disabled = true
        // }
        // this.$set(this.formDatas, 'ieEdit', false)
        this.$set(this.$refs.proForm.dynamicValidateFormRuleForm, 'ieEdit', false)
      }
    },
    // 获取下拉选数据
    async getSelectDataFun(fn, key, data = {}) {
      const res = await fn({ enabled: 'Y', ...data })
      const dataList = res.data || []
      return dataList.map(ele => ({
        value: ele.uuid,
        label: ele.name
      }))
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
    },
    // 布类下拉
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
    // async getAnalysis(value) {
    //   const res = (await getAnalysisData({ keyword: value })).data || []
    //   const list = res.filter(v => v.id).map(item => {
    //     return {
    //       label: item.id,
    //       value: item.csSampleAnalysisApplayId
    //     }
    //   })
    //   return list
    // },
    // 获取干燥方式下拉数据
    async getDryingMethodData() {
      const res = (await getDryingMethod({ enabled: 'Y' })).data || []
      const listArr = res.filter(v => v.id).map(item => {
        return {
          label: item.name,
          value: item.id + ''
        }
      })

      this.$set(this.analysisData._dryWayInfo, 'dataSource', listArr)
    }
  }
}
</script>
<style scoped>
  .product{
    margin: 0;
  }

</style>
<style lang="scss">
  .a-product{
    .el-form-item__label {
      flex-shrink: 0;
    }
    .el-form-item__content{
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
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
.knitting-wrap .render-content{
    position: relative;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
.knitting-wrap .product {
  background: #ffffff;
  // margin: 0 20px;
  margin: 0 !important;
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
  margin: 0;
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
