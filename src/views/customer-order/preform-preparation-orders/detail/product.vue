/**
 * @Description: 产品信息
 * @author Roman
 * @date 2021-04-27 15:12:09
 * @edit 2021-04-27 15:12:09
*/
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
import { PublicCustomer } from '@/views/customer-order/public/index'
export default {
  name: 'Product',
  mixins: [PublicCustomer],
  props: {
    isEdit: {
      type: Boolean
    },
    hasDetail: {
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
    const max9999Reg = this.$getRules({ type: 'number', pattern: /^(([1-9]{1}\d{0,3})|(0{1}))(\.\d{1,2})?$/, message: '0~9999.99', trigger: ['blur'] })
    // 产品信息
    const productData = {
      // _ingredient: {
      //   prop: 'ingredient',
      //   itemType: 'itemview',
      //   // className: 'viewStyle',
      //   itemStyle: { 'width': '33%' },
      //   label: '成份/比例',
      //   // valueType: 'object',
      //   clearable: true,
      //   disabled: true,
      //   renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
      //     if (value) {
      //       return `<div title='${value.label ? value.label : ''} ${formDatas.ratio ? formDatas.ratio : ''}' class='yarn-style'>${value.label ? value.label : ''} ${formDatas.ratio ? formDatas.ratio : ''}</div>`
      //     } else {
      //       return ''
      //     }
      //   }
      // },
      _dryWay: {
        prop: 'dryWay',
        itemType: this.selectTypeChange,
        className: 'inputWidth',
        itemStyle: { 'width': '33%' },
        label: '干燥方式:',
        valueType: 'object',
        clearable: true,
        disabled: true,
        dataSource: [
          {
            label: '烘干',
            value: '烘干'
          },
          {
            label: '铺干',
            value: '铺干'
          },
          {
            label: '挂干',
            value: '挂干'
          }
        ],
        renderContent: (value) => {
          return value && value.label
        }
      },
      _shrink: {
        rowStyle: { width: '33%' },
        children: {
          _shrinkL: {
            prop: 'shrinkL',
            itemType: this.inputTypeChange,
            label: '缩水(LxW):',
            span: 12,
            itemStyle: { paddingRight: '0px' },
            placeholder: '',
            renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
              return `<div>${formDatas.shrinkL || ''}X${formDatas.shrinkW || ''}</div>`
            }
          },
          _shrinkX: {
            prop: 'shrinkX',
            itemType: 'view',
            text: 'X',
            span: 2,
            isShow: () => {
              return this.isEdit
            },
            style: { textAlign: 'center', lineHeight: '36px', 'color': '#474747', 'font-size': '12px' },
            labelWidth: '0'
          },
          _shrinkW: {
            prop: 'shrinkW',
            span: 10,
            itemType: this.inputTypeChange,
            label: '',
            isShow: () => {
              return this.isEdit
            },
            labelWidth: '0',
            placeholder: ''
          }
        }
      },
      _dyeCraft: {
        prop: 'dyeCraft',
        itemType: 'itemview',
        itemStyle: { 'width': '33%' },
        label: '染整工艺:',
        clearable: true,
        disabled: true,
        renderContent: (value) => {
          const arr = []
          if (value && value.includes('[')) {
            try {
              const dataList = JSON.parse(value)
              dataList && dataList.length && dataList.forEach(item => {
                arr.push(item.name)
              })
            } catch (error) {
              this.$message({ type: 'error', message: '染整工艺数据有问题' })
            }
            const dyeTech = arr.join(',')
            return `<div title='${dyeTech}' class='yarn-style'>${dyeTech}</div>`
          } else {
            return ''
          }
        }
      },
      _printCraft: {
        prop: 'printCraft',
        itemType: 'itemview',
        // className: 'viewStyle',
        itemStyle: { 'width': '33%' },
        label: '印花工艺:',
        // valueType: 'object',
        clearable: true,
        disabled: true,
        renderContent: (value) => {
          if (value && value.includes('[')) {
            const dataList = JSON.parse(value)
            // let printTech = ''
            const arr = []
            dataList && dataList.length && dataList.forEach(item => {
              arr.push(item.label)
            })
            const printTech = arr.join(',')
            value = printTech
            return `<div title='${value}' class='yarn-style'>${value}</div>`
          } else {
            return ''
          }
        }
      },
      _weightAcceptanceCriteria: {
        prop: 'weightAcceptanceCriteria',
        itemType: this.selectTypeChange,
        itemStyle: { 'width': '60%' },
        style: { 'width': '50%' },
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
        itemType: 'itemview',
        className: 'hideInput',
        itemStyle: { 'width': '28%', 'margin-right': '6%' },
        label: '克重:',
        labelWidth: '82px',
        clearable: true,
        disabled: true,
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          if (value) {
            return `<div title='${value} ${formDatas.weightBeforeUnit}' class='yarn-style'>${value} ${formDatas.weightBeforeUnit}</div>`
          } else {
            return ''
          }
        }
      },
      _weightAfter: {
        prop: 'weightAfter',
        itemType: this.inputTypeChange,
        itemStyle: { 'width': '28%', 'margin-right': '6%' },
        label: '克重:',
        labelWidth: '82px',
        rules: [max9999Reg],
        clearable: true,
        disabled: true,
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return value ? `<div title='${value} g/m²' class='yarn-style'>${value} g/m²</div>` : ''
        }
      },
      _suggestWidth: {
        prop: 'suggestWidth',
        itemType: 'itemview',
        className: 'hideInput',
        itemStyle: { 'width': '28%' },
        label: '幅宽:',
        labelWidth: '82px',
        clearable: true,
        disabled: true,
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          if (value) {
            return `<div title='${value} ${formDatas.suggestWidthUnit}' class='yarn-style'>${value} ${formDatas.suggestWidthUnit}</div>`
          } else {
            return ''
          }
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
        filterable: true,
        disabled: true,
        visibleChange: value => {
          if (value) {
            this.getOptionConfigSelect({ pageName: '备坯单', fieldName: '公差范围(克重)' }, 'weightBeforeRange')
          }
        },
        dataSource: [],
        renderContent: (value) => {
          return value && value.label
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
        filterable: true,
        visibleChange: value => {
          if (value) {
            this.getOptionConfigSelect({ pageName: '备坯单', fieldName: '公差范围(克重)' }, 'weightAfterRange')
          }
        },
        dataSource: [],
        renderContent: (value) => {
          return value && value.label
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
        filterable: true,
        visibleChange: value => {
          if (value) {
            this.getOptionConfigSelect({ pageName: '备坯单', fieldName: '公差范围(幅宽)' }, 'range')
          }
        },
        dataSource: [],
        renderContent: (value) => {
          return value && value.label
        }
      }
    }
    return {
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
          // console.log(syncData)
          this.syncMoudleDataHandle('productData', { ...syncData, weightAcceptanceCriteria: syncData.weightAcceptanceCriteria && syncData.weightAcceptanceCriteria.value ? syncData.weightAcceptanceCriteria : '' })
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
        this.changeStatus(val)
      },
      deep: true,
      immediate: true
    },
    data: {
      handler(val, oldVal) {
        // console.log(val)
        if (val) {
          this.$nextTick(() => {
            this.$refs.product.form.clearValidate()
          })
          this.setData(val)
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
        this.$set(this.productData._weightBefore, 'append', '')
        this.$set(this.productData._weightAfter, 'append', '')
      }
    },
    setData(data) {
      const productKey = ['weightAcceptanceCriteria', 'range', 'weightBeforeRange', 'weightAfterRange']
      this.formDatas = {
        dryWay: data.dryWay,
        dyeCraft: data.dyeCraft,
        shrinkL: data.shrinkL,
        shrinkW: data.shrinkW,
        printCraft: data.printCraft,
        ingredient: data.ingredient,
        ratio: data.ratio,
        weightAcceptanceCriteria: data.weightAcceptanceCriteria,
        suggestWidth: data.suggestWidth,
        suggestWidthUnit: data.suggestWidthUnit,
        weightBefore: data.weightBefore,
        range: data.range,
        weightBeforeRange: data.weightBeforeRange,
        weightBeforeUnit: data.weightBeforeUnit || 'g/m²',
        weightAfter: data.weightAfter,
        weightAfterRange: data.weightAfterRange,
        weightAfterUnit: data.weightAfterUnit
      }
      productKey.forEach(item => {
        this.$set(this.productData['_' + item], 'dataSource', data[item] && data[item].label && data[item].value ? [data[item]] : null)
      })
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
          this.$set(this.productData._ingredient, 'dataSource', res)
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
    padding: 20px 20px 15px 20px;
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
.editClass .hideInput .el-input__inner {
  padding: 0;
  border: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  background: #fff;
  font-size: 14px;
}
.editClass .hideInput .el-form-item {
  margin-bottom: 14px;
}
.editClass .hideInput .el-input__icon {
  display: none;
}
.detailClass {
  .el-input-group__append {
    background: #ffffff;
    border: 0;
  }
}
.yarn-style{
  text-overflow: ellipsis;
  overflow: hidden;
  max-width: 300px;
  white-space: nowrap;
  color: #000;
}
</style>
