<template>
  <div class="product-info" :class="isEdit?'':'product-info-disable'">
    <div class="data-info">
      <div class="title-max" style="position: relative;">
        <div>基本信息</div>
        <!-- :disabled="data.version!==1&&data." -->
        <div class="versions-val">
          <el-select
            v-model="data.version"
            style="width: 80px;"
            size="small"
            @change="versionInfoChange"
          >
            <el-option
              v-for="item in getVersionsList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>

      </div>
      <cs-custom-form ref="basicData" :data-source="basicCommon" :options="formOptions" :form-datas="formDatas" />
    </div>
    <div class="data-info" style="padding: 20px;padding-top: 0;">
      <div class="title-max">产品信息</div>
      <div style="margin-left: -20px;">
        <cs-custom-form ref="basicData" :sync-form-datas-to-data-source="false" :data-source="productCommon" :options="formOptions" :form-datas="formDatas" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object
    },
    isEdit: {
      type: Boolean
    },
    isCopy: {
      type: Boolean
    },
    getDetailData: {
      type: Function
    }
  },

  data() {
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    const itemStyle = { 'width': '30%' }
    const basicCommon = {
      _physicalId: {
        prop: 'physicalTaskNo',
        itemType: this.inputTypeChange,
        itemStyle,
        label: '物测编号:'
      },
      _dyelotNo: {
        prop: 'dyelotNo',
        itemType: this.inputTypeChange,
        itemStyle,
        label: '缸号:'
      },
      _produceOrderCode: {
        prop: 'produceOrderCode',
        itemType: this.inputTypeChange,
        itemStyle,
        label: '生产订单:'
      },
      _currentProgress: {
        prop: 'currentProgress',
        itemType: this.inputTypeChange,
        itemStyle,
        label: '当前进度:',
        renderContent: this.renderContent
      },
      _factoryName: {
        prop: 'factoryName',
        itemType: this.inputTypeChange,
        itemStyle,
        label: '染印厂:',
        renderContent: this.renderContent
      },
      _customerName: {
        prop: 'customerName',
        itemType: this.inputTypeChange,
        itemStyle,
        label: '客户:',
        renderContent: this.renderContent
      },
      _brandName: {
        prop: 'brandName',
        itemType: this.inputTypeChange,
        itemStyle,
        label: '品牌商:',
        renderContent: this.renderContent
      },
      _customerServiceName: {
        prop: 'customerServiceName',
        itemType: this.inputTypeChange,
        itemStyle,
        label: '客服:'
      },
      _billMan: {
        prop: 'billMan',
        itemType: this.inputTypeChange,
        itemStyle,
        label: '跟单员:'
      },
      _clothingExportName: {
        prop: 'clothingExportName',
        itemType: this.inputTypeChange,
        itemStyle,
        label: '成衣信息:',
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          // clothingTypeName+clothingStyleName+clothingExportName 成衣类型-成衣款式-成衣出口
          const str = (formDatas.clothingExportName ? formDatas.clothingExportName + '-' : '') + (formDatas.clothingTypeName ? formDatas.clothingTypeName + '-' : '') + (formDatas.clothingStyleName ? formDatas.clothingStyleName : '')
          return value ? `<div class="render-content" title='${str}' >${str}</div>` : ''
        }
      },
      _techRequire: {
        prop: 'techRequire',
        itemType: this.inputTypeChange,
        itemStyle,
        label: '工艺要求:',
        renderContent: this.renderContent
      },
      _reportTypeName: {
        prop: 'reportTypeName',
        itemType: this.inputTypeChange,
        itemStyle,
        label: '报告类型:',
        renderContent: this.renderContent
      },
      _careLabel: {
        prop: 'careLabel',
        itemType: this.inputTypeChange,
        itemStyle,
        label: '洗唛:',
        renderContent: this.renderContent
      },
      _remarks: {
        prop: 'remarks',
        itemType: this.remarksTypeChange,
        maxlength: 200,
        itemStyle,
        label: '备注:',
        renderContent: this.renderContent
      }
    }
    const productCommon = {
      _productNo: {
        prop: 'productNo',
        itemType: this.inputTypeChange,
        itemStyle,
        label: '产品编码:'
      },
      _fabricType: {
        prop: 'fabricType',
        itemType: this.inputTypeChange,
        itemStyle,
        label: '布类:'
      },
      _yarnCountName: {
        prop: 'yarnCountName',
        itemType: this.inputTypeChange,
        itemStyle,
        label: '纱名:',
        renderContent(value, options, form, formDatas, setFormDatas, scope) {
          let str = ''
          str += (formDatas.yarnCountName || '') + ' ' + (formDatas.ingredientsName || '') + (formDatas.proportion || '') + ' ' + (formDatas.yarnTypeName || '') + ' ' + (formDatas.cardingMethodName || '') + ' ' + (formDatas.spinningMethodName || '')
          return `<div class="render-content" title='${str}' >${str}</div>`
        }
      },
      _composition: {
        prop: 'composition',
        itemType: this.inputTypeChange,
        itemStyle,
        label: '成份比例:'
      },
      _productSize: {
        prop: 'productSize',
        itemType: this.inputTypeChange,
        itemStyle,
        label: '成品规格:',
        renderContent(value, options, form, formDatas, setFormDatas, scope) {
          if (formDatas.realWidth) {
            return formDatas.realWidth + (formDatas.unit === 2 ? 'cm' : '"') + '-' + formDatas.realWeight + 'g/m²'
          }
        }
      },
      _customerColor: {
        prop: 'customerColor',
        itemType: this.inputTypeChange,
        itemStyle,
        label: '客户颜色:'
      }
    }
    return {
      commonBlurReg,
      itemStyle,
      basicCommon,
      productCommon,
      formOptions: {
        inline: true,
        labelWidth: '140px',
        popError: true,
        size: 'small',
        syncFormDatasToDataSource: false,
        validate: (flag, res, err) => {
          // console.log(flag, res, err)
        },
        syncDataHandle: (formDatas) => {
          // console.log(formDatas)
          this.$emit('syncDataHandle', formDatas)
        }
      },
      versionsVal: ''
    }
  },
  computed: {
    formDatas() {
      return this.$utils.deepClone(this.data || {})
    },
    getVersionsList() {
      let list = []
      if (this.data && this.data.versionInfoList) {
        list = this.data.versionInfoList.map(v => {
          return {
            ...v,
            label: 'v' + v.version,
            value: v.version
          }
        })
      }
      return list
    }
  },
  watch: {
    'data.version': {
      handler(val, oldVal) {
        if (val) {
          this.versionsVal = val
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    // 版本号
    versionInfoChange(version) {
      this.versionsVal = version
      const arr = this.$utils.deepClone(this.getVersionsList || [])
      let isMaxVersion = true
      arr.sort((a, b) => {
        return b.version - a.version
      })
      if (arr[0].version === version) {
        console.log('当前最大版本')
        isMaxVersion = true
      } else {
        console.log('其它版本')
        isMaxVersion = false
      }
      this.getDetailData(version, isMaxVersion)
    },
    renderContent(value, options, form, formDatas, setFormDatas, scope) {
      return value ? `<div class="render-content" title='${value}' >${value}</div>` : ''
    },
    inputTypeChange() {
      // return this.isEdit ? 'input' : 'itemview'
      return 'itemview'
    },
    selectTypeChange() {
      // return this.isEdit ? 'select' : 'itemview'
      return 'itemview'
    },
    // 重检的备注必填
    remarksTypeChange() {
      if (this.isCopy) {
        this.$set(this.basicCommon._remarks, 'rules', this.commonBlurReg)
        return 'input'
      } else {
        this.$set(this.basicCommon._remarks, 'rules', [])
        return 'itemview'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .product-info{

    .data-info{
      padding: 20px 0;
      padding-top: 0;
      background-color: #FFFFFF;
       /deep/ .el-form-item{
        margin-bottom: 0px;
      }
      /deep/ .el-form-item__content{
        color: #474747;
      }
    }
    .data-info{
      background-color: #FFFFFF;
       /deep/ .el-form-item__label{
         color: #888E9E;
      }
    }
    .title-max{
      font-size: 16px;
      color: #151222;
      height: 57px;
      line-height: 57px;
      border-bottom: 1px solid #EEEFF0;
      padding: 0 20px;
      margin-bottom: 20px;
    }
    .versions-val{
      position: absolute;
      top: 0;
      left: 100px;
    }
  }
  //查看状态
  .product-info-disable{
    .data-info{
      background-color: #FFFFFF;
       /deep/ .el-form-item__label{
         color: #888E9E;
      }
    }
  }

</style>
