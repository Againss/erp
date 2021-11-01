<!--
 * @Author: xj
 * @Description: 大货开发==》质量要求
 * @Date: 2021-03-11 19:37:46
 * @LastEditors: OBKoro1
 * @LastEditTime: 2021-06-24 19:24:17
 * @FilePath: d:\ysxg\src\views\customer-order\goods-orders\detail-bak\compoments\qualityRequirement.vue
-->
<template>
  <div class="qualityrequ">
    <!-- 对色标准 -->
    <div class="table-item basic-data">
      <div class="header-top basic-top">
        <span>对色标准</span>
      </div>
      <cs-custom-form
        ref="basicDataOne"
        :class="getEditClass"
        :data-source="baseData"
        :options="formOptions"
        :form-datas="formDatasData"
      />
    </div>
    <!-- 批色要求 -->
    <div class="table-item basic-data">
      <div class="header-top basic-top">
        <span>批色要求</span>
      </div>
      <cs-custom-form
        ref="batchColor"
        :class="getEditClass"
        :data-source="batchColor"
        :options="formOptions"
        :form-datas="formDatasColor"
      />
    </div>
    <!-- QC验货 -->
    <div class="table-item basic-data">
      <div class="header-top basic-top">
        <span>QC验货</span>
      </div>
      <cs-custom-form
        ref="Inspection"
        :class="getEditClass"
        :data-source="Inspection"
        :options="formOptions"
        :form-datas="formDatasction"
      />
    </div>
  </div>
</template>

<script>
import { PublicCustomer } from '@/views/customer-order/public/index'
export default {
  name: 'QualityRequirements',
  components: {},
  mixins: [PublicCustomer],
  props: {
    isEdit: {
      type: Boolean
    },
    orderData: {
      type: Object
    }
  },
  data() {
    const baseData = {
      _colorMatching: {
        prop: 'colorMatching',
        itemType: 'select',
        className: 'inputWidth',
        itemStyle: { 'width': '25%' },
        labelWidth: '104px',
        label: '对色方式:',
        valueType: 'object',
        clearable: true,
        disabled: true,
        rules: [{ required: true, message: '对色方式不能为空', trigger: 'change' }],
        change: (value) => {},
        visibleChange: (value, val) => {
          if (value) {
            this.getOptionConfigSelect({ pageName: '大货订单', fieldName: '对色方式' }, 'colorMatching')
          }
        },
        dataSource: []
      },
      _colorData: {
        prop: 'colorData',
        itemType: 'select',
        className: 'inputWidth',
        itemStyle: { 'width': '25%' },
        labelWidth: '104px',
        label: '对色资料:',
        clearable: true,
        disabled: true,
        dataSource: [
          {
            label: '',
            value: ''
          },
          {
            label: 'OK LD',
            value: '1'
          },
          {
            label: '原板',
            value: '2'
          }
        ]
      },
      _bodyAndBottom: {
        prop: 'bodyAndBottom',
        itemType: 'select',
        className: 'inputWidth',
        itemStyle: { 'width': '25%' },
        label: '衫身和下栏:',
        clearable: true,
        disabled: true,
        dataSource: [
          {
            label: '',
            value: ''
          },
          {
            label: '撞色',
            value: '1'
          },
          {
            label: '配色',
            value: '2'
          }
        ]
      },
      _tolerance: {
        prop: 'tolerance',
        itemType: 'select',
        className: 'inputWidth',
        itemStyle: { 'width': '25%' },
        label: '公差:',
        valueType: 'object',
        clearable: true,
        disabled: true,
        change: (value) => {},
        visibleChange: (value, val) => {
          if (value) {
            this.getOptionConfigSelect({ pageName: '大货订单', fieldName: '公差(对色)' }, 'tolerance')
          }
        },
        dataSource: []
      },
      _lstLightSource: {
        prop: 'lstLightSource',
        itemType: 'select',
        className: 'inputWidth',
        itemStyle: { 'width': '25%' },
        labelWidth: '104px',
        label: '1st对色光源:',
        valueType: 'object',
        rules: [{ required: true, message: '1st对色光源', trigger: 'change' }],
        clearable: true,
        disabled: true,
        change: (value) => {},
        visibleChange: (value, val) => {
          if (value) {
            this.getFirstLights()
          }
        },
        dataSource: []
      },
      _twondLightSource: {
        prop: 'twondLightSource',
        itemType: 'select',
        className: 'inputWidth',
        itemStyle: { 'width': '25%', 'margin-left': '0' },
        label: '2nd对色光源:',
        valueType: 'object',
        clearable: true,
        disabled: true,
        change: (value) => {},
        visibleChange: (value, val) => {
          if (value) {
            this.getFirstLights()
          }
        },
        dataSource: []
      },
      _threerdLightSource: {
        prop: 'threerdLightSource',
        itemType: 'select',
        className: 'inputWidth',
        itemStyle: { 'width': '25%' },
        label: '3rd对色光源:',
        valueType: 'object',
        clearable: true,
        disabled: true,
        change: (value) => {},
        visibleChange: (value, val) => {
          if (value) {
            this.getFirstLights()
          }
        },
        dataSource: []
      }
    }
    const batchColor = {
      _headCylinder: {
        prop: 'headCylinder',
        itemType: 'select',
        className: 'inputWidth',
        itemStyle: { 'width': '25%' },
        label: '衫身头缸:',
        clearable: true,
        rules: [{ required: true, message: '衫身头缸不能为空', trigger: 'change' }],
        disabled: true,
        dataSource: [
          {
            label: '',
            value: ''
          },
          {
            label: '客人批',
            value: '1'
          },
          {
            label: '卖家批',
            value: '2'
          }
        ]
      },
      _dropHeadCylinder: {
        prop: 'dropHeadCylinder',
        itemType: 'select',
        className: 'inputWidth',
        itemStyle: { 'width': '25%' },
        label: '下栏头缸:',
        clearable: true,
        disabled: true,
        dataSource: [
          {
            label: '',
            value: ''
          },
          {
            label: '撞色',
            value: '1'
          },
          {
            label: '配色',
            value: '2'
          }
        ]
      },
      _cylinderDifference: {
        prop: 'cylinderDifference',
        itemType: 'select',
        className: 'inputWidth',
        itemStyle: { 'width': '25%' },
        label: '缸差:',
        rules: [{ required: true, message: '缸差不能为空', trigger: 'change' }],
        clearable: true,
        disabled: true,
        dataSource: [
          {
            label: '',
            value: ''
          },
          {
            label: '客人批每缸',
            value: '1'
          },
          {
            label: '客人批任一缸',
            value: '2'
          },
          {
            label: '卖家批',
            value: '3'
          }
        ]
      },
      _pitch: {
        prop: 'pitch',
        itemType: 'select',
        className: 'inputWidth',
        itemStyle: { 'width': '25%' },
        label: '匹差:',
        clearable: true,
        disabled: true,
        dataSource: [
          {
            label: '',
            value: ''
          },
          {
            label: '客人批每匹',
            value: '1'
          },
          {
            label: '客人批任一匹',
            value: '2'
          },
          {
            label: '卖家批',
            value: '3'
          }
        ]
      }
    }
    const Inspection = {
      _chabStandard: {
        prop: 'chabStandard',
        itemType: 'select',
        className: 'inputWidth',
        itemStyle: { 'width': '25%' },
        labelWidth: '110px',
        label: '查布标准:',
        clearable: true,
        rules: [{ required: true, message: '查布标准不能为空', trigger: 'change' }],
        disabled: true,
        dataSource: [
          {
            label: '',
            value: ''
          },
          {
            label: '国际四分制',
            value: '1'
          },
          {
            label: '国际十分制',
            value: '2'
          }
        ]
      },
      _scoreStandard: {
        prop: 'scoreStandard',
        itemType: 'select',
        className: 'inputWidth',
        itemStyle: { 'width': '25%' },
        labelWidth: '110px',
        rules: [{ required: true, message: '分数标准不能为空', trigger: 'change' }],
        label: '分数标准:',
        clearable: true,
        disabled: true,
        dataSource: [
          {
            label: '',
            value: ''
          },
          {
            label: '20',
            value: '1'
          },
          {
            label: '22',
            value: '2'
          },
          {
            label: '24',
            value: '3'
          },
          {
            label: '25',
            value: '4'
          },
          {
            label: '26',
            value: '5'
          },
          {
            label: '28',
            value: '6'
          }
        ]
      },
      _checkClothLanguage: {
        prop: 'checkClothLanguage',
        itemType: 'select',
        className: 'inputWidth',
        itemStyle: { 'width': '25%' },
        label: '查布语言:',
        rules: [{ required: true, message: '查布语言不能为空', trigger: 'change' }],
        clearable: true,
        disabled: true,
        dataSource: [
          {
            label: '',
            value: ''
          },
          {
            label: '中文',
            value: '1'
          },
          {
            label: '英文',
            value: '2'
          }
        ]
      },
      _checkClothMethod: {
        prop: 'checkClothMethod',
        itemType: 'select',
        className: 'inputWidth',
        itemStyle: { 'width': '25%' },
        label: '查布方式:',
        rules: [{ required: true, message: '查布方式不能为空', trigger: 'change' }],
        clearable: true,
        disabled: true,
        dataSource: [
          {
            label: '',
            value: ''
          },
          {
            label: '抽查',
            value: '1'
          },
          {
            label: '全查',
            value: '2'
          }
        ]
      },
      _isGuestsCheck: {
        prop: 'isGuestsCheck',
        itemType: 'select',
        className: 'inputWidth',
        itemStyle: { 'width': '25%' },
        label: '客人是否查验:',
        rules: [{ required: true, message: '客人是否查验不能为空', trigger: 'change' }],
        clearable: true,
        disabled: true,
        dataSource: [
          {
            label: '',
            value: ''
          },
          {
            label: '是',
            value: '1'
          },
          {
            label: '否',
            value: '2'
          }
        ]
      },
      _isProvideReport: {
        prop: 'isProvideReport',
        itemType: 'select',
        className: 'inputWidth',
        itemStyle: { 'width': '25%' },
        label: '是否提供报告:',
        rules: [{ required: true, message: '是否提供报告不能为空', trigger: 'change' }],
        clearable: true,
        disabled: true,
        dataSource: [
          {
            label: '',
            value: ''
          },
          {
            label: '是',
            value: '1'
          },
          {
            label: '否',
            value: '2'
          }
        ]
      }
    }
    return {
      baseData, // 对色标准信息
      batchColor, // 批色要求
      Inspection, // QC验货
      isEditType: false, // 页面IED
      basicData: {},
      formOptions: {
        size: 'small',
        inline: true
      },
      formDatasData: {}, // 对色标准
      formDatasColor: {}, // 批色要求
      formDatasction: {} // QC验货
    }
  },
  computed: {
    getEditClass() {
      if (this.isEdit) {
        return 'editClass'
      } else {
        return 'detailClass'
      }
    },
    sidebar() {
      return this.$store.state.app.sidebar.opened
    }
  },
  watch: {
    orderData: {
      handler(val, oldVal) {
        if (val !== null && Object.keys(val).length) {
          this.initializationCom(val)
        }
      },
      deep: true,
      immediate: true
    },
    isEdit: {
      handler(val, oldVal) {
        if (val) {
          this.editChange()
        } else {
          this.editChange(true)
        }
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    this.init()// 初始化数据
    this.getFirstLights()
  },
  mounted() { },
  methods: {
    // 选项配置下拉
    getOptionConfigSelect(data, type) {
      this.getOptionConfig(data).then(res => {
        res.unshift({ value: '', label: '' })
        if (type === 'colorMatching') { // 对色方式
          this.$set(this.baseData._colorMatching, 'dataSource', res)
        } else if (type === 'tolerance') { // 公差
          this.$set(this.baseData._tolerance, 'dataSource', res)
        }
      })
    },
    // 编辑状态
    editChange(type = false) {
      for (const key in this.baseData) { // 对色标准信息
        this.baseData[key].disabled = type
      }
      for (const key in this.batchColor) { // 批色要求
        this.batchColor[key].disabled = type
      }
      for (const key in this.Inspection) { // QC验货
        this.Inspection[key].disabled = type
      }
    },
    // 像外返回数据汇总
    DataSummary() {
      const baseDataArray = this.$refs.basicDataOne.dynamicValidateFormRuleForm || ''// 对色标准信息
      const batchColorArray = this.$refs.batchColor.dynamicValidateFormRuleForm || ''// 批色要求
      const InspectionArray = this.$refs.Inspection.dynamicValidateFormRuleForm || ''// QC验货
      const pupType = this.LightSource(baseDataArray)
      const obj = {
        colorStandard: baseDataArray,
        batchColorRequirements: batchColorArray,
        qcInspection: InspectionArray
      }
      const dataTim = {
        data: obj,
        isshow: pupType
      }
      console.log('ol', dataTim)
      return dataTim
    },
    // 3个对色光源不能相同
    LightSource(base) {
      const arrIndex = []
      let isType = true
      let arr2 = []
      arrIndex[0] = base.lstLightSource && base.lstLightSource.label ? base.lstLightSource.label : ''
      arrIndex[1] = base.twondLightSource && base.twondLightSource.label ? base.twondLightSource.label : ''
      arrIndex[2] = base.threerdLightSource && base.threerdLightSource.label ? base.threerdLightSource.label : ''
      var newArr = arrIndex.filter(item => item)
      // const allEqual = arr => arr.every(val => val === arr[0])
      if (newArr.length <= 1) {
        isType = false
      } else if (newArr.length > 1) {
        // isType = !!allEqual(arrIndex)
        arr2 = newArr.filter((x, index, self) => self.indexOf(x) === index)
        if (arr2.length !== newArr.length) { isType = true } else { isType = false }
      }
      return isType
    },
    // 页面初始化
    initializationCom(data) {
      const that = this
      if (this.$route.query.requireId) {
        return false
      }
      that.formDatasData = {
        colorMatching: that.setValue(data.colorStandard.colorMatching), // 对色方式
        tolerance: that.setValue(data.colorStandard.tolerance), // 公差
        colorData: data.colorStandard.colorData, // 对色资料{1=OKLD，2=原板}
        bodyAndBottom: data.colorStandard.bodyAndBottom, // 衫身和下栏{1=撞色，2=配色}
        lstLightSource: that.setValue(data.colorStandard.lstLightSource), // lst对色光源
        twondLightSource: that.setValue(data.colorStandard.twondLightSource), // 2nd对色光源
        threerdLightSource: that.setValue(data.colorStandard.threerdLightSource), // 3rd对色光源
        colorStandardId: data.colorStandard.colorStandardId || ''
      }
      this.$set(this.baseData._lstLightSource, 'dataSource', that.formDatasData.lstLightSource ? [that.formDatasData.lstLightSource] : [])
      this.$set(this.baseData._twondLightSource, 'dataSource', that.formDatasData.twondLightSource ? [that.formDatasData.twondLightSource] : [])
      this.$set(this.baseData._threerdLightSource, 'dataSource', that.formDatasData.threerdLightSource ? [that.formDatasData.threerdLightSource] : [])
      this.$set(this.baseData._colorMatching, 'dataSource', that.formDatasData.colorMatching ? [that.formDatasData.colorMatching] : [])
      this.$set(this.baseData._tolerance, 'dataSource', that.formDatasData.tolerance ? [that.formDatasData.tolerance] : [])
      that.formDatasColor = {// 批色要求
        headCylinder: data.batchColorRequirements.headCylinder, // 衫身头缸{1=客人批，2=卖家批}
        dropHeadCylinder: data.batchColorRequirements.dropHeadCylinder, // 下拉头缸{1=撞色，2=配色}
        cylinderDifference: data.batchColorRequirements.cylinderDifference, // 缸差{1=客人批每缸，2=客人批任一缸，3=卖家批}
        pitch: data.batchColorRequirements.pitch, // 匹差{1=客人批每缸，2=客人批任一缸，3=卖家批}
        batchColorId: data.batchColorRequirements.batchColorId || ''// 批色要求ID
      }
      that.formDatasction = {// QC验货
        chabStandard: data.qcInspection.chabStandard || '', // 查布标准{1=国际四分制，2=国际十分制}
        scoreStandard: data.qcInspection.scoreStandard || '', // 分数标准{0，20，22，24，25，26，28}
        isGuestsCheck: data.qcInspection.isGuestsCheck || '', // 客人是否查验{1=是，2=否}
        isProvideReport: data.qcInspection.isProvideReport || '', // 是否提供报告{1=是，2=否}
        checkClothMethod: data.qcInspection.checkClothMethod || '', // 查布方式{1=抽查，2=全查}
        checkClothLanguage: data.qcInspection.checkClothLanguage || '', // 查布语言{1=中文，2=英文}
        qcInspectionId: data.qcInspection.qcInspectionId || ''// QC验货表ID
      }
    },
    // 对色光源下拉
    async getFirstLights() {
      this.getFirstLight({ enabled: 'Y' }).then(res => {
        res.unshift({ value: '', label: '' })
        this.$set(this.baseData._lstLightSource, 'dataSource', res)
        this.$set(this.baseData._twondLightSource, 'dataSource', res)
        this.$set(this.baseData._threerdLightSource, 'dataSource', res)
      })
    },
    init() {
      const that = this
      that.formDatasData = {
        colorMatching: '', // 对色方式
        tolerance: '', // 公差
        colorData: '', // 对色资料{1=OKLD，2=原板}
        bodyAndBottom: '', // 衫身和下栏{1=撞色，2=配色}
        lstLightSource: '', // lst对色光源
        twondLightSource: '', // 2nd对色光源
        threerdLightSource: '' // 3rd对色光源
      } // 对色标准
      that.formDatasColor = {// 批色要求
        headCylinder: '', // 衫身头缸{1=客人批，2=卖家批}
        dropHeadCylinder: '', // 下拉头缸{1=撞色，2=配色}
        cylinderDifference: '', // 缸差{1=客人批每缸，2=客人批任一缸，3=卖家批}
        pitch: '' // 匹差{1=客人批每缸，2=客人批任一缸，3=卖家批}
      }
      that.formDatasction = {// QC验货
        chabStandard: '', // 查布标准{1=国际四分制，2=国际十分制}
        scoreStandard: '', // 分数标准{0，20，22，24，25，26，28}
        isGuestsCheck: '', // 客人是否查验{1=是，2=否}
        isProvideReport: '', // 是否提供报告{1=是，2=否}
        checkClothMethod: '', // 查布方式{1=抽查，2=全查}
        checkClothLanguage: ''// 查布语言{1=中文，2=英文}
      }
    },
    // 纯数据展示
    setValue(it) {
      if (it && it.value) {
        it.value = it.value !== null ? it.value : ''
      } else {
        it = ''
      }
      return it
    }
  }
}
</script>
<style lang="scss" scoped>
.qualityrequ {
  padding-bottom: 60px;
  // margin-top: 20px;
  .table-item {
    background: #ffffff;
    margin: 20px 20px 0;
    margin-bottom: 20px;
    .header-top {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      padding: 20px 20px 15px 20px;
      span {
        font-size: 16px;
        display: flex;
        font-weight: 400;
      }
      .el-button {
        display: flex;
        span {
          font-size: 14px;
        }
      }
    }
    .basic-top {
      border-bottom: 1px solid #eeeff0;
      margin-bottom: 20px;
    }
  }
  /deep/ .el-input.is-disabled .el-input__inner {
    color: #666666;
  }
  /deep/ .el-form--inline .el-form-item {
    margin-right: 0;
  }
  .detailClass /deep/.el-input__inner {
    padding: 0;
    border: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    background: #fff;
    font-size: 14px;
  }
  .detailClass /deep/ .el-form-item {
    margin-bottom: 14px;
  }
  .editClass /deep/ .el-form-item {
    margin-bottom: 20px;
  }
  .detailClass /deep/ .el-input__icon {
    display: none;
  }
  .basic-data  /deep/ .el-input.is-disabled .el-input__suffix {
    display: none;
  }
  .basic-data {
    margin-top: 0;
    padding-bottom: 20px;
    .custom-form {
      margin: 0 20px;
    }
  }
  .detailClass {
   /deep/ .el-input-group__append {
    background: #ffffff;
    border: 0;
    }
  }
}
</style>
