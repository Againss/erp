import * as api from '../api/basisApi.js'
// import techRquire from '../components/common/tech-require.vue'
export const dyeingTechnology = {
  data() {
    const commonChangeReg = this.$getRules({})
    const maxNumberReg = this.$getRules({
      type: 'number',
      pattern: /^[1-9]\d*$/,
      message: '请输入最多三位正整数',
      trigger: ['blur']
    })
    const style2 = {
      'width': '100%',
      'fontSize': '16px',
      'color': '#151222',
      'border-bottom': '1px #EEEFF0 solid',
      'margin': '0 20px 15px',
      'padding': '20px 0 15px'
    }
    const itemStyle = {
      'width': '46%', 'padding-left': '20px', 'margin-bottom': '16px', 'margin-right': '0', 'position': 'relative'
    }
    const dyeingProduct = {
      _view: {
        itemType: 'view',
        text: '产品信息',
        style: style2
      },
      _clothsTypeInfo: {
        prop: 'clothsTypeInfo',
        label: '布类',
        itemType: this.selectTypeChange,
        valueType: 'object',
        itemStyle,
        placeholder: '',
        disabled: true,
        readonly: true,
        showOverflowTooltip: true,
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return value ? `<div class="render-content" title='${value}' >${value}</div>` : ''
        }
      },
      _garmentPartInfo: {
        prop: 'garmentPartInfo',
        label: '成衣部位',
        itemType: this.selectTypeChange,
        valueType: 'object',
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
        readonly: true,
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
        readonly: true,
        showOverflowTooltip: true,
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return value ? `<div class="render-content" title='${value}' >${value}</div>` : ''
        }
      },
      _weightAfter: {
        prop: 'weightAfter',
        label: '成品克重(洗后)/公差',
        itemType: this.inputTypeChange,
        // valueType: 'object',
        itemStyle,
        placeholder: '',
        disabled: true,
        readonly: true,
        showOverflowTooltip: true,
        rlues: [commonChangeReg],
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
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
        rules: [],
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return value || ''
        }
      },
      _colorSuggestWidth: {
        prop: 'colorSuggestWidth',
        label: '色布幅宽',
        itemType: this.inputTypeChange,
        itemStyle: { ...itemStyle, 'width': 'calc(38% - 5px)', 'margin-right': '5px' },
        placeholder: '',
        disabled: true,
        showOverflowTooltip: true,
        rules: [],
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          if (formDatas.colorSuggestWeight) {
            return `<span title="${formDatas.colorSuggestWeight}${formDatas.colorSuggestWeightUnit}">${formDatas.colorSuggestWidth}${formDatas.colorSuggestWeightUnit}</span>`
          } else {
            return ''
          }
        }
      },
      _colorSuggestWidthUnit: {
        prop: 'colorSuggestWidthUnit',
        itemType: this.selectTypeChange,
        itemStyle: { 'width': '8%', 'margin': '0' },
        label: '',
        labelWidth: '0',
        disabled: true,
        renderContent: (value) => {
          return ''
        },
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
        change: (value, form, formDatas, setFormDatas) => {
          setFormDatas({ colorSuggestWidthUnit: value })
        }
      },
      _colorSuggestWeight: {
        prop: 'colorSuggestWeight',
        label: '色布克重',
        itemType: this.inputTypeChange,
        itemStyle: { ...itemStyle, 'width': 'calc(38% - 5px)', 'margin-right': '5px' },
        placeholder: '',
        disabled: true,
        showOverflowTooltip: true,
        rules: [],
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          if (formDatas.colorSuggestWeight) {
            return `<span title="${formDatas.colorSuggestWeight}${formDatas.colorSuggestWidthUnit}">${formDatas.colorSuggestWeight}${formDatas.colorSuggestWidthUnit}</span>`
          } else {
            return ''
          }
        }
      },
      _colorSuggestWeightUnit: {
        prop: 'colorSuggestWeightUnit',
        itemType: this.inputTypeChange,
        itemStyle: { 'width': '8%', 'margin-right': '0' },
        label: '',
        labelWidth: '0',
        disabled: true,
        change: (value, form, formDatas, setFormDatas) => {
          setFormDatas({ colorSuggestWeightUnit: value })
        },
        renderContent: (value) => {
          return ''
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
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
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
      _yarnName: {
        prop: 'yarnName',
        label: '纱名',
        itemType: this.inputTypeChange,
        itemStyle,
        placeholder: '',
        disabled: true,
        showOverflowTooltip: true,
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
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
        showOverflowTooltip: true
      },
      _colorLevel: {
        prop: 'colorLevel',
        label: '色级',
        itemType: this.inputTypeChange,
        itemStyle,
        placeholder: '',
        disabled: true
      },
      _shrinkL: {
        prop: 'shrinkL',
        label: '缩水(LxW)',
        itemType: this.inputTypeChange,
        itemStyle,
        placeholder: '',
        disabled: true,
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return value ? `<div class="render-content" title='${value}' >${value}</div>` : ''
        }
      },
      _knitNo: {
        prop: 'knitNo',
        label: '坯布编码',
        itemType: this.inputTypeChange,
        itemStyle,
        placeholder: '',
        disabled: true,
        showOverflowTooltip: true
      },
      _fabricColorNo: {
        prop: 'fabricColorNo',
        label: '智布色号',
        itemType: this.inputTypeChange,
        itemStyle,
        placeholder: '',
        disabled: true,
        showOverflowTooltip: true
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
          // const colorInfoType = formDatas.colorInfoType && formDatas.colorInfoType.label || ''// 类型
          // const colorCode = formDatas.colorCode || ''// 编号
          // const str = (colorInfoType ? colorInfoType + '/' : '') + colorCode
          return value ? `<div class="render-content" title='${value}' >${value}</div>` : ''
        }
      },

      _colorNo: {
        prop: 'colorNo',
        label: '色布编码',
        valueType: 'object',
        itemType: this.inputTypeChange,
        itemStyle,
        placeholder: '',
        disabled: true,
        showOverflowTooltip: true,
        dataSource: []
      },
      _fabricFlowerNo: {
        prop: 'fabricFlowerNo',
        label: '智布花号',
        itemType: this.inputTypeChange,
        itemStyle,
        placeholder: '',
        disabled: true,
        showOverflowTooltip: true
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
          // const flowerInfoType = formDatas.flowerInfoType && formDatas.flowerInfoType.lable || ''// 类型
          // const flowerCode = formDatas.flowerCode || ''// 编号
          // const str = (flowerInfoType ? flowerInfoType + '/' : '') + flowerCode
          return value ? `<div class="render-content" title='${value}' >${value}</div>` : ''
        }

      },
      _flowerNo: {
        prop: 'flowerNo',
        label: '花布编码',
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
        showOverflowTooltip: true,
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return value ? `<div class="render-content" title='${value}' >${value}</div>` : ''
        }

      },
      _printCraft: {
        prop: 'printCraft',
        label: '印花工艺(客户)',
        itemType: this.inputTypeChange,
        itemStyle,
        placeholder: '',
        disabled: true,
        showOverflowTooltip: true,
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return value ? `<div class="render-content" title='${value}' >${value}</div>` : ''
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
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return value ? `<div class="render-content" title='${value}' >${value}</div>` : ''
        }
      },
      _view1: {
        itemType: 'view',
        text: '工序流程',
        style: style2
      },
      _flowCode: {
        prop: 'flowCode',
        label: '流程编码',
        itemType: this.selectTypeChange,
        valueType: 'object',
        itemStyle,
        placeholder: '请输入流程编码',
        showOverflowTooltip: true,
        filterable: true,
        rules: [commonChangeReg],
        dataSource: [],
        visibleChange: (flag) => {
          flag && api.getProcessFlow({ enabled: 'Y' }).then(res => {
            this.$set(this.dyeingProduct._flowCode, 'dataSource', res.map(item => {
              return {
                ...item,
                label: item.flowCode,
                value: item.uuid

              }
            }))
          })
        },
        change: (value, form, formDatas, setFormDatas, scope) => {
          this.restructuresData(value, setFormDatas)
        },
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return value && value.label ? `<div class="render-content" title='${value.label}' >${value.label}</div>` : ''
        }

      },
      _dyeType: {
        prop: 'dyeType',
        label: '染整类型',
        itemType: this.selectTypeChange,
        itemStyle,
        valueType: 'object',
        placeholder: '请选择染整类型',
        showOverflowTooltip: true,
        filterable: true,
        rules: [commonChangeReg],
        dataSource: [],
        renderOptions: (item) => {
          return `<span style="display: block;width:300px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">${item.label}</span>`
        },
        visibleChange: (flag) => {
          flag && api.getProduceStates({ enabled: 'Y' }).then(res => {
            this.$set(this.dyeingProduct._dyeType, 'dataSource', res)
          })
        },
        change: this.checkIfCalculat,
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return value && value.label ? `<div class="render-content" title='${value.label}' >${value.label}</div>` : ''
        }
      },
      _dyeIngredient: {
        prop: 'dyeIngredient',
        label: '染色成份',
        itemType: this.selectTypeChange,
        valueType: 'object',
        itemStyle,
        placeholder: '请选择染色成份',
        showOverflowTooltip: true,
        multiple: true,
        clearable: true,
        filterable: true,
        // rules: [commonChangeReg],
        dataSource: [],
        visibleChange: (flag) => {
          flag && api.getDyeIngredient({ enabled: 'Y' }).then(res => {
            this.$set(this.dyeingProduct._dyeIngredient, 'dataSource', res)
          })
        },
        // change: this.checkIfCalculat,
        renderContent: this.renderContent
      },
      _dyeCraftCombination: {
        prop: 'dyeCraftCombination',
        itemType: this.selectTypeChange,
        className: 'inputWidth',
        itemStyle,
        label: '染整工艺组合',
        valueType: 'object',
        rules: [commonChangeReg],
        filterable: true,
        dataSource: [],
        renderOptions: (item) => {
          return `<span style="display: block;width:300px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">${item.label}</span>`
        },
        visibleChange: (flag) => {
          if (flag) {
            this.getRequirementCombination()
          }
        },
        change: (value, form, formDatas, setFormDatas, scope) => {
          // this.dyeingProduct._dyeStyle.disabled = false
          // 获取风格整理二级数据
          this.getDyeStyleData(value)
          this.checkIfCalculat(value, form, formDatas, setFormDatas, scope)
          setFormDatas({ dyeStyle: '' })
        },
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return value && value.label ? `<div class="render-content" title='${value.label}' >${value.label}</div>` : ''
        }

      },
      _processFlow: {
        prop: 'processFlow',
        label: '工序流程',
        itemType: this.selectTypeChange,
        valueType: 'object',
        multiple: true,
        itemStyle,
        placeholder: '',
        disabled: true,
        showOverflowTooltip: true,
        rules: [commonChangeReg],
        dataSource: [],
        renderContent: this.renderContent
      },
      _view2: {
        itemType: 'view',
        text: '染整工艺',
        style: style2
      },
      _dyeStyle: {
        prop: 'dyeStyle',
        label: '风格整理',
        itemType: this.selectTypeChange,
        valueType: 'object',
        itemStyle,
        // disabled: true,
        placeholder: '请选择风格整理',
        // rules: [commonChangeReg],
        dataSource: [],
        // visibleChange: (flag) => {
        //   if (flag) {
        //     console.log(this.ranDetail.dyeCraftCombination.value)
        //     this.getDyeStyleData(this.ranDetail.dyeCraftCombination || '')
        //   }
        // },
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return value && value.label ? `<div class="render-content" title='${value.label}' >${value.label}</div>` : ''
        }
      },
      _dyeFuntion: {
        prop: 'dyeFuntion',
        label: '功能性整理',
        itemType: this.selectTypeChange,
        valueType: 'object',
        multiple: true,
        filterable: true,
        itemStyle,
        placeholder: '请选择功能性整理',
        dataSource: [],
        renderOptions: (item) => {
          return `<span style="display: block;width:300px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">${item.label}</span>`
        },
        visibleChange: (flag) => {
          flag && api.requirementDye({ sortClassify: 2, level: 2, enabled: 'Y' }).then(res => {
            this.$set(this.dyeingProduct._dyeFuntion, 'dataSource', res.map(item => {
              return {
                label: item.name,
                value: item.uuid,
                parentUuid: item.parentUuid || ''
              }
            }))
          })
        },
        renderContent: this.renderContent
      },
      _dyeHandfeel: {
        prop: 'dyeHandfeel',
        label: '手感整理',
        itemType: this.selectTypeChange,
        valueType: 'object',
        itemStyle,
        placeholder: '请选择手感整理',
        filterable: true,
        dataSource: [],
        visibleChange: (flag) => {
          flag && api.requirementDye({ sortClassify: 4, level: 2, enabled: 'Y' }).then(res => {
            this.$set(this.dyeingProduct._dyeHandfeel, 'dataSource', res.map(item => {
              return {
                label: item.name,
                value: item.uuid,
                parentUuid: item.parentUuid || ''
              }
            }))
          })
        },
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return value && value.label ? `<div class="render-content" title='${value.label}' >${value.label}</div>` : ''
        }
      },
      _selvage: {
        prop: 'selvage',
        label: '布边要求',
        itemType: this.selectTypeChange,
        valueType: 'object',
        itemStyle,
        placeholder: '请选布边要求',
        dataSource: [],
        visibleChange: (flag) => {
          flag && api.tmDyeFinishTechList({ enabled: 'Y', type: 'C' }).then(res => {
            this.$set(this.dyeingProduct._selvage, 'dataSource', res)
          })
        },
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return value && value.label ? `<div class="render-content" title='${value.label}' >${value.label}</div>` : ''
        }

      },
      _design: {
        prop: 'design',
        label: '款式要求',
        itemType: this.selectTypeChange,
        valueType: 'object',
        itemStyle,
        placeholder: '请选款式要求',
        dataSource: [],
        visibleChange: (flag) => {
          flag && api.tmDyeFinishTechList({ enabled: 'Y', type: 'P' }).then(res => {
            this.$set(this.dyeingProduct._design, 'dataSource', res)
          })
        },
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return value && value.label ? `<div class="render-content" title='${value.label}' >${value.label}</div>` : ''
        }
      },
      _softMethod: {
        prop: 'softMethod',
        label: '制软要求',
        itemType: this.selectTypeChange,
        valueType: 'object',
        itemStyle,
        placeholder: '请选制软要求',
        filterable: true,
        rules: [commonChangeReg],
        dataSource: [],
        visibleChange: (flag) => {
          flag && api.getSoftMethod({ enabled: 'Y' }).then(res => {
            this.$set(this.dyeingProduct._softMethod, 'dataSource', res)
          })
        },
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return value && value.label ? `<div class="render-content" title='${value.label}' >${value.label}</div>` : ''
        }
      }
    }
    return {
      commonChangeReg,
      maxNumberReg,
      dyeingProduct,
      processFlowData: []// 工艺流程编码
    }
  },
  watch: {
    // ranDetail(n, o) {
    //   console.log(n)
    // }

  },

  methods: {
    // 获取染整组合下拉
    async getRequirementCombination(uuid) {
      const res = await api.getRequirementCombination({ enabled: 'Y' })
      if (uuid) {
        const items = res.find(v => v.uuid === uuid)
        this.getDyeStyleData(items)
      }
      this.$set(this.dyeingProduct._dyeCraftCombination, 'dataSource', res.map(item => {
        return {
          label: item.name,
          value: item.uuid,
          details: item.details
        }
      }))
    },
    async getProcessFlowData() {
      const res = await api.getProcessFlow({ enabled: 'Y' })
      this.processFlowData = res || []
    },
    // 获取风格整理数据
    async getDyeStyleData(val, flow) {
      let details = val.details || []
      if (flow) {
        details = val.combination && val.combination.details || []
      }

      // 过滤是否是风格整理数据
      const pid = []
      for (let i = 0; i < details.length; i++) {
        const item = details[i]
        if (item && item.dye && item.dye.sortClassify === 3) {
          pid.push(item.dye.uuid)
        }
      }
      const res = await api.requirementDye({ sortClassify: 3, level: 2 })
      const data = []
      if (res && res.length > 0) {
        for (let i = 0; i < res.length; i++) {
          const item = res[i]
          if (pid.includes(item.parentUuid)) {
            data.push({
              label: item.name,
              value: item.uuid,
              parentUuid: item.parentUuid
            })
          }
        }
      }
      if (data && data.length > 0) {
        this.$set(this.dyeingProduct._dyeStyle, 'rules', [this.commonChangeReg])
      } else {
        this.$set(this.dyeingProduct._dyeStyle, 'rules', [])
      }

      this.$set(this.dyeingProduct._dyeStyle, 'dataSource', data)
    },
    // 标准工序流程列表
    async checkIfCalculat(value, form, formDatas, setFormDatas, scope) {
      const tempData = this.$refs.dyeingProduct.form.model
      const dyeTypeUuid = tempData.dyeType && tempData.dyeType.value || '' // 染整类型Uuid
      const combinationUuid = tempData.dyeCraftCombination && tempData.dyeCraftCombination.value // 染整组合uuid
      // let dyeIngredientUuid = '' // 染色成分uuid（中文名，用逗号分割）
      // if (tempData.dyeIngredient && tempData.dyeIngredient.length > 0) {
      //   for (let i = 0; i < tempData.dyeIngredient.length; i++) {
      //     dyeIngredientUuid += tempData.dyeIngredient[i].value + ','
      //   }
      //   dyeIngredientUuid = dyeIngredientUuid.substring(0, dyeIngredientUuid.length - 1)
      // }

      if (dyeTypeUuid && combinationUuid) {
        const res = await api.getProcessFlowList({ dyeTypeUuid, combinationUuid })
        if (!res || res.length === 0) {
          // const keyArr = ['dyeType', 'dyeIngredient', 'dyeCraftCombination', 'processFlow', 'flowCode']
          const keyArr = ['processFlow', 'flowCode', 'dyeStyle']
          for (let i = 0; i < keyArr.length; i++) {
            setFormDatas({ [keyArr[i]]: '' })
          }
          this.$refs.dyeingProduct.form.clearValidate()
          this.$message.error('未匹配到流程编码')
        }
      }
    },
    // 重组数据
    restructuresData(value, setFormDatas) {
      const keyArr = {
        dyeType: 'dyeType',
        combination: 'dyeCraftCombination',
        processFlow: 'processFlow'
      }
      for (const key in value) {
        if (keyArr[key]) {
          if (key === 'dyeType' || key === 'combination') {
            if (value[key].name) {
              this.dyeingProduct['_' + keyArr[key]].dataSource = [{ label: value[key].name, value: value[key].uuid }]
              setFormDatas({ [keyArr[key]]: { label: value[key].name, value: value[key].uuid }})
              if (key === 'combination') {
                this.dyeingProduct._dyeStyle.disabled = false
                this.getDyeStyleData(value, 'flow')
              }
            }
          } else {
            const dataSource = value[key] && value[key].length > 0 ? value[key].map(v => {
              return {
                label: v.name,
                value: v.uuid
              }
            }) : []
            // console.log(dataSource)
            this.dyeingProduct['_' + key].dataSource = dataSource
            setFormDatas({ [key]: dataSource })
          }
        }
      }
    },
    // 查看回显数据
    renderContent(value, form) {
      let str = ''
      if (value && Array.isArray(value)) {
        for (let i = 0; i < value.length; i++) {
          const item = value[i]
          if (form.prop === 'processFlow') {
            str += item.label + `→`
          } else {
            str += item.label + '，'
          }
        }
        str = str.substring(0, str.length - 1)
      }
      return `<span title="${str}">${str}</span>`
    },
    inputTypeChange() {
      return this.isEdit === 'edit' ? 'input' : 'itemview'
    },
    selectTypeChange() {
      return this.isEdit === 'edit' ? 'select' : 'itemview'
    }
  }
}
