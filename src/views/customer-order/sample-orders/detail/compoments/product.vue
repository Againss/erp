<template>
  <div class="product">
    <div class="product-header">
      <span style="border-bottom: 1px solid #EEEFF0;display: block;padding-bottom: 15px;width: 100%;font-weight: 400;">工艺信息</span>
    </div>
    <cs-custom-form
      ref="product"
      :class="getEditClass"
      :data-source="productData"
      :options="formOptions"
      :form-datas="formDatas"
    />
  </div>
</template>

<script>
import techRquire from '@/views/customer-order/public/components/tech-require'
import { PublicCustomer } from '@/views/customer-order/public/index'
export default {
  name: 'Product',
  mixins: [PublicCustomer],
  props: {
    isEdit: {
      type: Boolean
    },
    data: {
      type: Object
    },
    syncMoudleDataHandle: {
      type: Function
    },
    setParentDataHandle: {
      type: Function
    }
  },
  data() {
    // 产品信息标题样式
    const headerTitleLeftStyle = {
      'margin-right': '6%'
    }
    // const headerTitleRightStyle = {
    //   'margin-left': '2%'
    // }
    // 公用验证正则
    // const commonChangeReg = this.$getRules({})
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    // 最大值99的校验
    const checkNum = (rule, value, callback) => {
      const reg = /^[1-9]\d*$/
      if (!value) {
        return callback(new Error('必填项不能为空'))
      } else if (value === 0 || !reg.test(value)) {
        return callback(new Error('请填写正整数'))
      } else if (value > 99) {
        return callback(new Error('最大值99'))
      } else {
        callback()
      }
    }
    // 最大999.99正则
    const max999Reg = this.$getRules({ type: 'number', pattern: /^(([1-9]{1}\d{0,2})|(0{1}))(\.\d{1,2})?$/, message: '0~999.99', trigger: ['blur'] })
    const max9999Reg = this.$getRules({ type: 'number', pattern: /^(([1-9]{1}\d{0,3})|(0{1}))(\.\d{1,2})?$/, message: '0~9999.99', trigger: ['blur'] })
    // 产品信息
    const productData = {
      _dyeCraft: {
        prop: 'dyeCraft',
        itemType: 'select',
        className: 'inputWidth',
        itemStyle: { 'width': '33%' },
        style: { 'width': '80%' },
        label: '染整工艺:',
        labelWidth: '120px',
        valueType: 'object',
        clearable: true,
        disabled: true,
        rules: [{ required: true, message: '染整工艺不能为空', trigger: 'change' }],
        title: true,
        components: { techRquire },
        componentsOptions: {
          checkValList: [],
          ok: (checkValList) => {
            const arr = checkValList.length && checkValList.filter(item => {
              return item.type * 1 === 4
            }) || []
            if (checkValList.length) {
              if (!arr.length) {
                this.$set(this.productData._printCraft, 'isShow', false)
                this.$set(this.productData._weightAfterView1, 'style', { width: '50%' })
              } else {
                this.$set(this.productData._printCraft, 'isShow', true)
                this.$set(this.productData._weightAfterView1, 'style', { width: '33%' })
              }
            } else {
              this.$set(this.productData._printCraft, 'isShow', true)
              this.$set(this.productData._weightAfterView1, 'style', { width: '33%' })
            }
            this.$set(this.productData._dyeCraft.componentsOptions, 'checkValList', checkValList)
            this.formDatas = { dyeCraft: checkValList }
          }
        },
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return value ? `<div title="${value}">${value}</div>` : ''
        }
      },
      _dryWay: {
        prop: 'dryWay',
        itemType: this.selectTypeChange,
        className: 'inputWidth',
        itemStyle: { 'width': '33%' },
        style: { 'width': '80%' },
        label: '干燥方式:',
        valueType: 'object',
        clearable: true,
        disabled: true,
        rules: [{ required: true, message: '干燥方式不能为空', trigger: 'change' }],
        dataSource: [
          { label: '烘干', value: '烘干' },
          { label: '铺干', value: '铺干' },
          { label: '挂干', value: '挂干' }
        ],
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return value ? `<div title="${value.label || ''}">${value.label || ''}</div>` : ''
        }
      },
      _shrinkL: {
        prop: 'shrinkL',
        itemType: this.inputTypeChange,
        itemStyle: { 'width': '18%' },
        label: '缩水(LxW):',
        disabled: true,
        rules: [commonBlurReg, { required: true, validator: checkNum, trigger: 'blur' }],
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return value ? `<div class="render-content" title='${formDatas.shrinkL}X${formDatas.shrinkW}' >${formDatas.shrinkL}X${formDatas.shrinkW}</div>` : ''
        }
      },
      _shrinkX: {
        itemType: 'view',
        style: { display: 'inline-block', height: '32px', 'line-height': '32px', 'margin': '0 6px', color: '#666666', 'font-size': '12px' },
        text: 'X',
        isShow: () => {
          if (this.isEdit) {
            return true
          }
          return false
        }
      },
      _shrinkW: {
        prop: 'shrinkW',
        itemType: this.inputTypeChange,
        itemStyle: { 'width': '10%' },
        label: '',
        labelWidth: '0',
        disabled: true,
        rules: [commonBlurReg, { required: true, validator: checkNum, trigger: 'blur' }],
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return ''
        }
      },
      _printCraft: {
        prop: 'printCraft',
        itemType: this.selectTypeChange,
        className: 'commonRemoteSearch',
        itemStyle: { 'width': '33%' },
        style: { 'width': '80%' },
        placeholder: '输入文字模糊查询',
        label: '印花工艺:',
        valueType: 'object',
        clearable: true,
        disabled: true,
        collapseTags: true,
        multiple: true,
        filterable: true,
        // rules: [{ required: true, message: '印花工艺不能为空', trigger: 'change' }],
        change: (value) => {
          // this.setParentDataHandle('printCraftChanged', true)
          this.setParentDataHandle('printCraftChanged', Date.parse(new Date()) + '')
        },
        visibleChange: (value, val) => {
          if (value) {
            // this.setReferencePlate()
            this.getPrintCraftSelect('product')
          }
        },
        dataSource: [],
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          console.log(value)
          let str = ''
          if (value && value.length && Array.isArray(value)) {
            const list = value
            for (let i = 0; i < list.length; i++) {
              str += list[i].label + '，'
            }
            str = str.substring(0, str.length - 1)
          }
          return `<div title="${str}" class='yarn-style'>${str}</div>`
        }
      },
      _weightAcceptanceCriteria: {
        prop: 'weightAcceptanceCriteria',
        itemType: this.selectTypeChange,
        itemStyle: { 'width': '33%' },
        style: { 'width': '80%' },
        label: '克重验收标准:',
        valueType: 'object',
        clearable: true,
        disabled: true,
        rules: [{ required: true, message: '克重验收标准不能为空', trigger: 'change' }],
        visibleChange: (value) => {
          if (value) {
            this.getOptionConfigSelect({ pageName: '样板开发单', fieldName: '克重验收标准' }, 'weightAcceptanceCriteria')
          }
        },
        dataSource: [],
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return value ? `<div title="${value.label || ''}">${value.label || ''}</div>` : ''
        }
      },
      _weightAfterView1: {
        itemType: 'view',
        style: { width: '33%' },
        text: ''
      },
      _weightBeforeView: {
        itemType: 'view',
        className: 'titleView',
        style: headerTitleLeftStyle,
        text: '克重（洗前）'
      },
      _weightAfterView: {
        itemType: 'view',
        className: 'titleView noBefore',
        style: headerTitleLeftStyle,
        text: '克重（洗后）'
      },
      _suggestWidthView: {
        itemType: 'view',
        className: 'titleView',
        text: '幅宽'
      },
      _weightBefore: {
        prop: 'weightBefore',
        itemType: this.inputTypeChange,
        itemStyle: { 'width': '28%', 'margin-right': '6%' },
        label: '克重:',
        labelWidth: '82px',
        rules: [commonBlurReg],
        clearable: true,
        disabled: true,
        blur: (e, form, formDatas) => {
          const reg = /^\d+(\.\d{0,2})?$/
          if (formDatas.weightBefore && reg.test(formDatas.weightBefore)) {
            const min = (formDatas.weightBefore * 1 - 5 <= 0) ? 1 : this.$utils.getFloat(formDatas.weightBefore * 1 - 5, 2)
            const max = this.$utils.getFloat(formDatas.weightBefore * 1 + 5, 2)
            this.$set(this.productData._weightAfterView, 'text', `克重（洗后）(范围${min}-${max})`)
            const checkNum = (rule, value, callback) => {
              // const reg = /^\d+(\.\d{0,2})?$/
              if (value && !reg.test(value)) {
                return callback(new Error('数字(两位小数)'))
              } else if (value && value < min * 1) {
                return callback(new Error(`范围${min}~${max}`))
              } else if (value && value > max * 1) {
                return callback(new Error(`范围${min}~${max}`))
              } else {
                callback()
              }
            }
            const rules = { type: 'number', validator: checkNum, trigger: ['blur'] }
            this.$set(this.productData._weightAfter, 'rules', [rules])
          } else {
            this.$set(this.productData._weightAfterView, 'text', `克重（洗后）`)
          }
        },
        change: (value) => {
          this.setParentDataHandle('weightBefore', value)
        },
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return value ? `<div title='${value} g/m²' class='yarn-style'>${value} g/m²</div>` : ''
        }
      },
      _weightAfter: {
        prop: 'weightAfter',
        itemType: this.inputTypeChange,
        itemStyle: { 'width': '28%', 'margin-right': '6%' },
        label: '克重:',
        labelWidth: '82px',
        clearable: true,
        disabled: true,
        blur: (e, form, formDatas) => {
          if (!formDatas.weightBefore) {
            this.$message.warning('请先填写洗后克重')
            this.$set(this.formDatas, 'weightAfter', '')
          }
        },
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return value ? `<div title='${value} g/m²' class='yarn-style'>${value} g/m²</div>` : ''
        }
      },
      _suggestWidth: {
        prop: 'suggestWidth',
        itemType: this.inputTypeChange,
        itemStyle: { 'width': '22%', 'margin-right': '1%' },
        label: '幅宽:',
        labelWidth: '82px',
        rules: [commonBlurReg],
        clearable: true,
        disabled: true,
        change: (value) => {
          this.setParentDataHandle('suggestWidth', value)
        },
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return value ? `<div title="${value}" class='yarn-style'>${value} ${formDatas.suggestWidthUnit || ''}</div>` : ''
        }
      },
      _suggestWidthUnit: {
        prop: 'suggestWidthUnit',
        itemType: this.selectTypeChange,
        itemStyle: { 'width': '5%' },
        label: '',
        labelWidth: '0',
        clearable: true,
        disabled: true,
        dataSource: [
          {
            label: '"',
            value: '"'
          },
          {
            label: 'cm',
            value: 'cm'
          }
        ],
        change: (value, form, formDatas) => {
          this.$set(this.formDatas, 'suggestWidthUnit', value)
          if (value === '"') {
            const suggestWidth = this.$utils.getFloat(formDatas.suggestWidth / 2.54, 2)
            this.$set(this.formDatas, 'suggestWidth', suggestWidth)
            if (this.formDatas.widthMinVal && this.formDatas.widthMaxVal) {
              this.formDatas.widthMinVal = this.$utils.getFloat(this.formDatas.widthMinVal / 2.54, 2)
              this.formDatas.widthMaxVal = this.$utils.getFloat(this.formDatas.widthMaxVal / 2.54, 2)
              this.$set(this.productData._suggestWidthView, 'text', `幅宽(范围${this.formDatas.widthMinVal}-${this.formDatas.widthMaxVal})`)
              const checkNum = (rule, value, callback) => {
                const reg = /^\d+(\.\d{0,2})?$/
                if (value && !reg.test(value)) {
                  return callback(new Error('数字(两位小数)'))
                } else if (value && value < this.formDatas.widthMinVal * 1) {
                  return callback(new Error(`范围${this.formDatas.widthMinVal}~${this.formDatas.widthMaxVal}`))
                } else if (value && value > this.formDatas.widthMaxVal * 1) {
                  return callback(new Error(`范围${this.formDatas.widthMinVal}~${this.formDatas.widthMaxVal}`))
                } else {
                  callback()
                }
              }
              const rules = { type: 'number', validator: checkNum, trigger: ['blur'] }
              this.$set(this.productData._suggestWidth, 'rules', [rules])
            } else {
              this.$set(this.productData._suggestWidth, 'rules', [this.max999Reg])
              this.$set(this.productData._suggestWidthView, 'text', `幅宽`)
            }
          } else if (value === 'cm') {
            const suggestWidth = this.$utils.getFloat(formDatas.suggestWidth * 2.54, 2)
            this.$set(this.formDatas, 'suggestWidth', suggestWidth)
            if (this.formDatas.widthMinVal && this.formDatas.widthMaxVal) {
              this.formDatas.widthMinVal = this.$utils.getFloat(this.formDatas.widthMinVal * 2.54, 2)
              this.formDatas.widthMaxVal = this.$utils.getFloat(this.formDatas.widthMaxVal * 2.54, 2)
              this.$set(this.productData._suggestWidthView, 'text', `幅宽(范围${this.formDatas.widthMinVal}-${this.formDatas.widthMaxVal})`)
              const checkNum = (rule, value, callback) => {
                const reg = /^\d+(\.\d{0,2})?$/
                if (value && !reg.test(value)) {
                  return callback(new Error('数字(两位小数)'))
                } else if (value && value < this.formDatas.widthMinVal * 1) {
                  return callback(new Error(`范围${this.formDatas.widthMinVal}~${this.formDatas.widthMaxVal}`))
                } else if (value && value > this.formDatas.widthMaxVal * 1) {
                  return callback(new Error(`范围${this.formDatas.widthMinVal}~${this.formDatas.widthMaxVal}`))
                } else {
                  callback()
                }
              }
              const rules = { type: 'number', validator: checkNum, trigger: ['blur'] }
              this.$set(this.productData._suggestWidth, 'rules', [rules])
            } else {
              this.$set(this.productData._suggestWidth, 'rules', [this.max999Reg])
              this.$set(this.productData._suggestWidthView, 'text', `幅宽`)
            }
          }
          this.setParentDataHandle('suggestWidthUnit', value)
        },
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return ''
        }
      },
      _weightBeforeRange: {
        prop: 'weightBeforeRange',
        itemType: this.selectTypeChange,
        itemStyle: { 'width': '28%', 'margin-right': '6%' },
        label: '洗前公差:',
        labelWidth: '82px',
        valueType: 'object',
        clearable: true,
        disabled: true,
        rules: [{ required: true, message: '洗前公差不能为空', trigger: 'change' }],
        visibleChange: value => {
          this.getOptionConfigSelect({ pageName: '样板开发单', fieldName: '公差范围(克重)' }, 'weightBeforeRange')
        },
        dataSource: [],
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return value ? `<div title="${value.label || ''}">${value.label || ''} </div>` : ''
        }
      },
      _weightAfterRange: {
        prop: 'weightAfterRange',
        itemType: this.selectTypeChange,
        itemStyle: { 'width': '28%', 'margin-right': '6%' },
        label: '洗后公差:',
        labelWidth: '82px',
        valueType: 'object',
        clearable: true,
        disabled: true,
        visibleChange: value => {
          this.getOptionConfigSelect({ pageName: '样板开发单', fieldName: '公差范围(克重)' }, 'weightAfterRange')
        },
        dataSource: [],
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return value ? `<div title='${value.label || ''}' class='yarn-style'>${value.label || ''}</div>` : ''
        }
      },
      _range: {
        prop: 'range',
        itemType: this.selectTypeChange,
        itemStyle: { 'width': '28%' },
        label: '幅宽公差:',
        labelWidth: '82px',
        valueType: 'object',
        clearable: true,
        disabled: true,
        rules: [{ required: true, message: '幅宽公差不能为空', trigger: 'change' }],
        visibleChange: value => {
          this.getOptionConfigSelect({ pageName: '样板开发单', fieldName: '公差范围(幅宽)' }, 'range')
        },
        dataSource: [],
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return value ? `<div title="${value.label || ''}">${value.label || ''} </div>` : ''
        }
      }
    }
    return {
      max999Reg,
      max9999Reg,
      productData,
      formDatas: {
        suggestWidthUnit: '"',
        weightBeforeUnit: 'g/m²',
        weightAfterRange: 'g/m²'
      },
      formOptions: {
        size: 'small',
        inline: true,
        labelWidth: '120px',
        syncDataHandle: (syncData) => {
          console.log(syncData)
          this.syncMoudleDataHandle('productData', { ...syncData, dyeCraft: syncData.dyeCraft ? JSON.stringify(syncData.dyeCraft) : '', printCraft: syncData.printCraft ? JSON.stringify(syncData.printCraft) : '', weightAcceptanceCriteria: syncData.weightAcceptanceCriteria && syncData.weightAcceptanceCriteria.value ? syncData.weightAcceptanceCriteria : '' })
        }
      }
    }
  },
  computed: {
    // 编辑、详情状态不同的类
    getEditClass() {
      if (this.isEdit) {
        return 'editClass'
      } else {
        return 'detailClass'
      }
    }

  },
  watch: {
    isEdit: {
      handler(val, oldVal) {
        console.log(val, 'llll')
        this.changeStatus(val)
        // if (val) {
        //   this.$set(this.productData._ingredient, 'itemStyle', { 'width': '18%' })
        // } else {
        //   this.$set(this.productData._ingredient, 'itemStyle', { 'width': '33%' })
        // }
      },
      deep: true,
      immediate: true
    },
    data: {
      handler(val, oldVal) {
        console.log(val, '2222')
        if (val) {
          this.$nextTick(() => {
            this.$refs.product.form.clearValidate()
          })
          val.suggestWidthUnit = val.suggestWidthUnit ? val.suggestWidthUnit : '"'
          this.setParentDataHandle('suggestWidthUnit', val.suggestWidthUnit)
          this.setData(val)
        } else {
          this.formDatas = {
            suggestWidthUnit: '"'
          }
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    inputTypeChange() {
      return this.isEdit ? 'input' : 'itemview'
    },
    selectTypeChange() {
      return this.isEdit ? 'select' : 'itemview'
    },
    // 状态变化下拉框的变化
    changeStatus(val) {
      if (val) {
        for (const key in this.productData) {
          this.productData[key].disabled = false
        }
        this.$set(this.productData._weightBefore, 'append', 'g/m²')
        this.$set(this.productData._weightAfter, 'append', 'g/m²')
      } else {
        for (const key in this.productData) {
          this.productData[key].disabled = true
        }
        this.$set(this.productData._weightBefore, 'append', 'g/m²')
        this.$set(this.productData._weightAfter, 'append', 'g/m²')
      }
    },
    setData(data) {
      const productKey = ['weightAcceptanceCriteria', 'range', 'weightBeforeRange', 'weightAfterRange']
      // const productKey = ['ingredient', 'range', 'weightBeforeRange', 'weightAfterRange']
      this.formDatas = {
        dryWay: data.dryWay,
        dyeCraft: data.dyeCraft ? JSON.parse(data.dyeCraft) : '',
        shrinkL: data.shrinkL,
        shrinkW: data.shrinkW,
        printCraft: data.printCraft ? JSON.parse(data.printCraft) : '',
        // ingredient: data.ingredient,
        // ratio: data.ratio,
        weightAcceptanceCriteria: data.weightAcceptanceCriteria,
        suggestWidth: data.suggestWidth,
        suggestWidthUnit: data.suggestWidthUnit,
        weightBefore: data.weightBefore,
        range: data.range,
        weightBeforeRange: data.weightBeforeRange,
        weightBeforeUnit: data.weightBeforeUnit || 'g/m²',
        weightAfter: data.weightAfter || '',
        weightAfterRange: data.weightAfterRange, // 公差不需要带单位
        weightAfterUnit: data.weightAfterUnit,
        minVal: data.minVal || '', // 洗前克重最小值
        maxVal: data.maxVal || '', // 洗前克重最大值
        widthMinVal: data.widthMinVal || '', // 幅宽最小值
        widthMaxVal: data.widthMaxVal || '' // 幅宽最大值
      }
      const arr = this.formDatas.dyeCraft.length && this.formDatas.dyeCraft.filter(item => {
        return item.type * 1 === 4
      }) || []
      if (this.formDatas.dyeCraft) {
        if (!arr.length) {
          this.$set(this.productData._printCraft, 'isShow', false)
          this.$set(this.productData._weightAfterView1, 'style', { width: '50%' })
        } else {
          if (!data.printCraft) {
            const printCraft = arr.map(item => {
              return {
                label: item.name,
                value: item.uuid
              }
            })
            this.$set(this.formDatas, 'printCraft', printCraft)
          }
          this.$set(this.productData._printCraft, 'isShow', true)
          this.$set(this.productData._weightAfterView1, 'style', { width: '33%' })
        }
      } else {
        this.$set(this.productData._printCraft, 'isShow', true)
        this.$set(this.productData._weightAfterView1, 'style', { width: '33%' })
      }
      // 设置洗前克重范围
      if (data.minVal && data.maxVal) {
        // data.minVal = this.$utils.getFloat(data.minVal * 1, 2)
        // data.maxVal = this.$utils.getFloat(data.maxVal * 1, 2)
        this.$set(this.productData._weightBeforeView, 'text', `克重（洗前）(范围${data.minVal}-${data.maxVal})`)
        const checkNum = (rule, value, callback) => {
          const reg = /^\d+(\.\d{0,2})?$/
          if (!value) {
            return callback(new Error('必填项不能为空'))
          } else if (value && !reg.test(value)) {
            return callback(new Error('数字(两位小数)'))
          } else if (value && value < data.minVal * 1) {
            return callback(new Error(`范围${data.minVal}~${data.maxVal}`))
          } else if (value && value > data.maxVal * 1) {
            return callback(new Error(`范围${data.minVal}~${data.maxVal}`))
          } else {
            callback()
          }
        }
        const rules = { type: 'number', required: true, validator: checkNum, trigger: ['blur'] }
        this.$set(this.productData._weightBefore, 'rules', [rules])
      } else {
        this.$set(this.productData._weightBefore, 'rules', [this.max999Reg])
        this.$set(this.productData._weightBeforeView, 'text', `克重（洗前）`)
      }
      // 设置洗后克重范围
      if (data.weightBefore) {
        const min = (data.weightBefore * 1 - 5 <= 0) ? 1 : this.$utils.getFloat(data.weightBefore * 1 - 5, 2)
        const max = this.$utils.getFloat(data.weightBefore * 1 + 5, 2)
        this.$set(this.productData._weightAfterView, 'text', `克重（洗后）(范围${min}-${max})`)
        const checkNum = (rule, value, callback) => {
          const reg = /^\d+(\.\d{0,2})?$/
          if (value && !reg.test(value)) {
            return callback(new Error('数字(两位小数)'))
          } else if (value && value < min * 1) {
            return callback(new Error(`范围${min}~${max}`))
          } else if (value && value > max * 1) {
            return callback(new Error(`范围${min}~${max}`))
          } else {
            callback()
          }
        }
        const rules = { type: 'number', validator: checkNum, trigger: ['blur'] }
        this.$set(this.productData._weightAfter, 'rules', [rules])
      } else {
        this.$set(this.productData._weightAfterView, 'text', `克重（洗后）`)
      }
      // 设置幅宽范围
      if (data.widthMinVal && data.widthMaxVal) {
        data.widthMinVal = this.$utils.getFloat(data.widthMinVal, 2)
        data.widthMaxVal = this.$utils.getFloat(data.widthMaxVal, 2)
        this.$set(this.productData._suggestWidthView, 'text', `幅宽(范围${data.widthMinVal}-${data.widthMaxVal})`)
        const checkNum = (rule, value, callback) => {
          const reg = /^\d+(\.\d{0,2})?$/
          if (!value) {
            return callback(new Error('必填项不能为空'))
          } else if (value && !reg.test(value)) {
            return callback(new Error('数字(两位小数)'))
          } else if (value && value < data.widthMinVal * 1) {
            return callback(new Error(`范围${data.widthMinVal}~${data.widthMaxVal}`))
          } else if (value && value > data.widthMaxVal * 1) {
            return callback(new Error(`范围${data.widthMinVal}~${data.widthMaxVal}`))
          } else {
            callback()
          }
        }
        const rules = { type: 'number', required: true, validator: checkNum, trigger: ['blur'] }
        this.$set(this.productData._suggestWidth, 'rules', [rules])
      } else {
        this.$set(this.productData._suggestWidth, 'rules', [this.max999Reg])
        this.$set(this.productData._suggestWidthView, 'text', `幅宽`)
      }
      this.$set(this.productData._dyeCraft.componentsOptions, 'checkValList', this.formDatas.dyeCraft || [])
      console.log(this.formDatas.printCraft)
      this.$set(this.productData._printCraft, 'dataSource', this.formDatas.printCraft || [])
      productKey.forEach(item => {
        this.$set(this.productData['_' + item], 'dataSource', this.formDatas[item] && this.formDatas[item].label && this.formDatas[item].value ? [this.formDatas[item]] : null)
      })
    },
    // 选项配置下拉
    getOptionConfigSelect(data, type) {
      this.getOptionConfig(data).then(res => {
        if (type === 'orderType') { // 订单类型
          this.$set(this.baseData._orderType, 'dataSource', res)
        } else if (type === 'garmentPart') { // 成衣部位
          this.$set(this.columns._garmentPart.editOptions, 'dataSource', res)
        } else if (type === 'referenceContent') { // 参考内容
          this.$set(this.versionContent._referenceContent, 'dataSource', res)
        } else if (type === 'weightAcceptanceCriteria') { // 克重验收标准
          this.$set(this.productData._weightAcceptanceCriteria, 'dataSource', res)
        } else if (type === 'range') { // 公差范围(幅宽)
          this.$set(this.productData._range, 'dataSource', res)
        } else if (type === 'weightBeforeRange') { // 公差范围(克重)
          this.$set(this.productData._weightBeforeRange, 'dataSource', res)
        } else if (type === 'weightAfterRange') { // 公差范围(克重)
          this.$set(this.productData._weightAfterRange, 'dataSource', res)
        } else if (type === 'naturalFiber') { // 证书要求
          this.$set(this.naturalFiberContent._certificate, 'dataSource', res)
        } else if (type === 'chemicalFiber') { // 证书要求
          this.$set(this.chemicalFiberContent._certificate, 'dataSource', res)
        } else if (type === 'combine') { // 证书要求
          this.$set(this.materialContent._certificateCombine, 'dataSource', res)
        } else if (type === 'type') { // 剪板要求类型
          this.$set(this.shearingRequirementsContent._type, 'dataSource', res)
        } else if (type === 'stripeSpacingRange') { // 公差范围(条纹间距)
          this.$set(this.allContent._range, 'dataSource', res)
        } else if (type === 'baseData') { // 销售季度
          this.$set(this.baseData._sellQuarter, 'dataSource', res)
        } else if (type === 'chooseSearch') {
          this.$set(this.chooseSearch._sellQuarter, 'dataSource', res)
        } else if (type === 'allRange') {
          this.$set(this.productData._range, 'dataSource', res)
          this.$set(this.productData._weightBeforeRange, 'dataSource', res)
          this.$set(this.productData._weightAfterRange, 'dataSource', res)
        }
      })
    },
    // 成份下拉
    getCompositionSelect(type) {
      if (type === 'product') {
        this.getComposition({ enabled: 'Y' }).then(res => {
          // this.$set(this.productData._ingredient, 'dataSource', res)
        })
      } else if (type === 'naturalFiber') {
        this.getComposition({ enabled: 'Y' }).then(res => {
          this.$set(this.naturalFiberContent._element, 'dataSource', res)
        })
      } else if (type === 'chemicalFiber') {
        this.getComposition({ enabled: 'Y' }).then(res => {
          this.$set(this.chemicalFiberContent._element, 'dataSource', res)
        })
      }
    },
    // 印花工艺下拉
    getPrintCraftSelect(type) {
      this.getPrintCraft({ classificationName: '印花工艺' }).then(res => {
        if (type === 'product') {
          this.$set(this.productData._printCraft, 'dataSource', res)
        } else if (type === 'chooseSearch') {
          this.$set(this.chooseSearch._printCraft, 'dataSource', res)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.product {
  background: #ffffff;
  .product-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    span {
      font-size: 16px;

    }
  }
}
</style>

<style lang="scss">
.detailClass .el-input__inner {
  padding: 0;
  border: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  background: #fff;
  font-size: 14px;
}
.detailClass .el-form-item {
  margin-bottom: 14px;
}
.editClass .el-form-item {
  margin-bottom: 20px;
}
.detailClass .el-input__icon {
  display: none;
}
.detailClass {
  .el-input-group__append {
    background: #ffffff;
    border: 0;
  }
}
.product{
  .yarn-style{
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

</style>
