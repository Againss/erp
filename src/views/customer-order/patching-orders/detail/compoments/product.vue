<template>
  <div class="product">
    <div class="product-header">
      <span style="border-bottom: 1px solid #EEEFF0;display: block;padding-bottom: 15px;width: 100%;font-weight: 400;">工艺信息</span>
    </div>
    <cs-custom-form
      ref="product"
      class="detailClass"
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
    const itemStyle = { width: '33%', 'margin-bottom': 0 }
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
        itemType: 'itemview',
        className: 'inputWidth',
        itemStyle,
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
      _shrinkL: {
        prop: 'shrinkL',
        itemType: 'itemview',
        itemStyle,
        label: '缩水(LxW):',
        clearable: true,
        disabled: true,
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return value ? `<div class="render-content" title='${formDatas.shrinkL}X${formDatas.shrinkW}' >${formDatas.shrinkL}X${formDatas.shrinkW}</div>` : ''
        }
      },
      _dyeCraft: {
        prop: 'dyeCraft',
        itemType: 'itemview',
        // className: 'viewStyle',
        labelWidth: '120px',
        itemStyle,
        label: '染整工艺:',
        // valueType: 'object',
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
        itemStyle,
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
        itemType: 'itemview',
        itemStyle: { 'width': '63%', 'margin-bottom': 0 },
        style: { 'width': '80%' },
        label: '克重验收标准:',
        // rules: [{ required: true, message: '克重验收标准不能为空', trigger: 'change' }],
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return value ? `<div title='${value.label || ''}'>${value.label || ''}</div>` : ''
        }
      },
      _weightBeforeView: {
        itemType: 'view',
        className: 'titleView noBefore',
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
        className: 'titleView noBefore',
        // style: headerTitleLeftStyle,
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
        itemType: 'itemview',
        itemStyle: { 'width': '28%', 'margin-right': '6%' },
        label: '克重:',
        labelWidth: '82px',
        clearable: true,
        disabled: true,
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          if (value) {
            return `<div title='${value} g/m²' class='yarn-style'>${value} g/m²</div>`
          } else {
            return ''
          }
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
        itemType: 'itemview',
        itemStyle: { 'width': '28%', 'margin-right': '6%' },
        label: '洗前公差:',
        labelWidth: '82px',
        valueType: 'object',
        clearable: true,
        disabled: true,
        // rules: [{ required: true, message: '洗前公差不能为空', trigger: 'change' }],
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return value ? `<div title='${value.label || ''}' class='yarn-style'>${value.label || ''}</div>` : ''
        }
      },
      _weightAfterRange: {
        prop: 'weightAfterRange',
        itemType: 'itemview',
        itemStyle: { 'width': '28%', 'margin-right': '6%' },
        label: '洗后公差:',
        labelWidth: '82px',
        valueType: 'object',
        clearable: true,
        disabled: true,
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return value ? `<div title='${value.label || ''}' class='yarn-style'>${value.label || ''}</div>` : ''
        }
      },
      _range: {
        prop: 'range',
        itemType: 'itemview',
        itemStyle: { 'width': '28%' },
        label: '幅宽公差:',
        labelWidth: '82px',
        valueType: 'object',
        clearable: true,
        disabled: true,
        // rules: [{ required: true, message: '幅宽公差不能为空', trigger: 'change' }],
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return value ? `<div title='${value.label || ''}' class='yarn-style'>${value.label || ''}</div>` : ''
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
          console.log(syncData)
          this.syncMoudleDataHandle('productData', syncData)
        }
      }
    }
  },
  computed: {
    // 编辑、详情状态不同的类
    // getEditClass() {
    //   if (this.isEdit) {
    //     return 'editClass'
    //   } else {
    //     return 'detailClass'
    //   }
    // }
  },
  watch: {
    // isEdit: {
    //   handler(val, oldVal) {
    //     this.changeStatus(val)
    //   },
    //   deep: true,
    //   immediate: true
    // },
    data: {
      handler(val, oldVal) {
        console.log(val)
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
        this.$set(this.productData._weightBefore, 'append', 'g/m²')
        this.$set(this.productData._weightAfter, 'append', 'g/m²')
      }
    },
    setData(data) {
      const productKey = ['range', 'weightBeforeRange', 'weightAfterRange']
      this.formDatas = {
        dryWay: data.dryWay,
        dyeCraft: data.dyeCraft,
        shrinkL: data.shrinkL,
        shrinkW: data.shrinkW,
        printCraft: data.printCraft,
        weightAcceptanceCriteria: data.weightAcceptanceCriteria,
        ingredient: data.ingredient,
        ratio: data.ratio,
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
      // font-weight: 600;
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
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
