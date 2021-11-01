<template>
  <!-- 右侧头部 -->
  <div class="top">
    <div class="left">
      <span>客样分析编号: {{ sampleAnalysisResultIdName }}</span>
    </div>
    <!--    <div v-show="!isEdit||(data.demandSource && data.demandCode)" class="left">-->
    <!--      <span>客样分析编号: {{ sampleAnalysisResultIdName }}</span>-->
    <!--    </div>-->
    <!--    <div v-show="isEdit&&(!data.demandSource&&!data.demandCode)" class="right">-->
    <!--      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" inline>-->
    <!--        <el-form-item :hide-required-asterisk="!isEdit" label="客样分析编号" prop="sampleAnalysisResultId">-->
    <!--          <el-select v-model="ruleForm.sampleAnalysisResultId" filterable placeholder="请选择" @change="analysisIdChange">-->
    <!--            <el-option-->
    <!--              v-for="item in sampleAnalysisResultOption"-->
    <!--              :key="item.value"-->
    <!--              :label="item.label"-->
    <!--              :value="item.value"-->
    <!--            />-->
    <!--          </el-select>-->
    <!--        </el-form-item>-->
    <!--      </el-form>-->
    <!--    </div>-->
  </div>
</template>
<script>
import { sampleAnalysisNoSelect } from '@/views/customer-order/public/api/index.js'
import { techgetDetail } from '../api/index'
// import { techgetDetail, fabricWeightRange, fabricWidthRange } from '../api/index'
export default {
  name: 'CustomerSample',
  props: {
    isEdit: {
      type: Boolean
    },
    data: {
      type: Object
    },
    syncMoudleDataHandle: {
      type: Function
    }
  },
  data() {
    return {
      sampleAnalysisResultOption: [],
      ruleForm: {
        sampleAnalysisResultId: ''
      },
      rules: {
        sampleAnalysisResultId: [
          { required: true, message: '请选择客样分析编号', trigger: 'change' }
        ]
      },
      sampleAnalysisResultIdName: '',
      RawMaterialArray: []
    }
  },
  watch: {
    data: {
      async handler(v) {
        console.log(v)
        // console.log(this.$refs)
        if (v && Object.keys(v).length) {
          // debugger
          if (v.sampleAnalysisResultId) {
            this.ruleForm.sampleAnalysisResultId = v.sampleAnalysisResultId
            this.getSampleAnalysisResultId(v)

            // 判断是否从crm过来的编号 是则重新请求数据
            if (v.demandSource && v.demandCode) {
              this.analysisIdChange(v.sampleAnalysisResultId)
            }
          } else {
            this.ruleForm.sampleAnalysisResultId = ''
            this.sampleAnalysisResultIdName = ''
            // this.$nextTick(() => {
            //   this.$refs.ruleForm.clearValidate()
            // })
          }
        }
      },
      deep: true
      // immediate: true
    }
  },
  created() {
    this.getSampleAnalysisNoSelect()
  },
  methods: {
    // 客样分析编号下拉
    async getSampleAnalysisNoSelect() {
      const res = await sampleAnalysisNoSelect({ status: '4' })
      const dataList = res.data.map(item => {
        return {
          value: item.csSampleAnalysisApplayId,
          label: item.id
        }
      })
      // console.log(dataList)
      const tempArray = dataList.filter(item => item.value === this.ruleForm.sampleAnalysisResultId)
      this.sampleAnalysisResultIdName = tempArray.length ? tempArray[0].label : ''
      this.sampleAnalysisResultOption = dataList
    },
    // 根据详情中返回的样板单号取客样分析编号回显
    getSampleAnalysisResultId(data) {
      if (this.sampleAnalysisResultOption.length) {
        const tempArray = this.sampleAnalysisResultOption.filter(item => item.value === data.sampleAnalysisResultId)
        this.sampleAnalysisResultIdName = tempArray.length ? tempArray[0].label : ''
      }
      // this.sampleAnalysisResultIdName = this.sampleAnalysisResultOption.length ? this.sampleAnalysisResultOption.filter(item => item.value === id)[0].label : ''
      // console.log(this.sampleAnalysisResultIdName)
    },
    analysisIdChange(value) {
      console.log(value)
      this.getSnalysisDetailFun(value)
    },

    // 获取客样分析详情
    async getSnalysisDetailFun(id) {
      // 正在请求之前锁屏
      const loading = this.$loading({
        lock: true,
        // text: '客样分析正在请求',
        fullscreen: false,
        spinner: 'el-icon-loading',
        background: 'rgba(255, 255, 255, 0.1)'
      })
      const res = await techgetDetail({ csSampleAnalysisApplayId: id })
      // 锁屏关闭
      loading.close()
      const dataList = res.data || {}
      // 定义布类
      let cloth

      // 处理产品信息
      const productInfo = {}// 产品信息
      // let productInfo = {}// 产品信息
      if (dataList.productInfo) { // 产品信息
        console.log(1)
        productInfo.ingredient = dataList.materialRequirement.elementInfo || '' // 成份
        productInfo.ratio = dataList.materialRequirement.elementRatio || '' // 比例
        productInfo.dryWay = dataList.productInfo.dryWayInfo || '' // 干燥方式
        productInfo.shrinkL = dataList.productInfo.shrinkL ? parseFloat(dataList.productInfo.shrinkL) : '' // 缩水(LxW)
        productInfo.shrinkW = dataList.productInfo.shrinkW ? parseFloat(dataList.productInfo.shrinkW) : '' // shrinkW
        // 染整工艺 ===工艺要求
        if (dataList.productInfo.craftRequire && dataList.productInfo.craftRequire.includes('[')) {
          productInfo.dyeCraft = dataList.productInfo.craftRequire
        } else {
          productInfo.dyeCraft = ''
        }
        // 成品幅宽 ===成品布封(建议)
        productInfo.suggestWidth = dataList.productInfo.suggestWidth ? parseFloat(dataList.productInfo.suggestWidth) : ''
        productInfo.suggestWidthUnit = dataList.productInfo.suggestWidthUnit
        // 成品克重（洗前)
        productInfo.weightBefore = dataList.productInfo.suggestWeight ? parseFloat(dataList.productInfo.suggestWeight) : ''
        // 成品克重（洗后)
        // productInfo.weightAfter = dataList.productInfo.measuredWeight ? parseFloat(dataList.productInfo.measuredWeight) : ''
        productInfo.weightAfter = ''
        console.log('pmc', dataList.productInfo.clothsTypeInfo)
        if (dataList.productInfo.clothsTypeInfo && dataList.productInfo.clothsTypeInfo.value) { // 布类
          console.log('pm', productInfo.clothsTypeInfo)
          cloth = dataList.productInfo.clothsTypeInfo
          // this.$set(this.columns._cloth.editOptions.dataSource, 'dataSource', [dataList.productInfo.clothsTypeInfo])
          // this.$set(this.leftFormDatas, 'cloth', cloth)
          // this.orderDataSource[this.rowIndex - 1].cloth = cloth
        }
      } else {
        productInfo.ingredient = '' // 成份
        productInfo.ratio = '' // 比例
        productInfo.dryWay = '' // 干燥方式
        productInfo.shrinkL = '' // 缩水(LxW)
        productInfo.shrinkW = '' // shrinkW
        // 染整工艺 ===工艺要求
        productInfo.dyeCraft = ''
        // 成品幅宽 ===成品布封(建议)
        productInfo.suggestWidth = ''
        productInfo.suggestWidthUnit = ''
        // 成品克重（洗前)
        productInfo.weightBefore = ''
        // 成品克重（洗后)
        productInfo.weightAfter = ''
      }
      this.RawMaterialArray = []
      this.sampleAnalysis(dataList)
      // if (productInfo.weightBefore) {
      //   const res = await fabricWeightRange({ searchValue: productInfo.weightBefore })
      //   let minVal = ''
      //   let maxVal = ''
      //   if (this.$pub.responseValidate(res) && res.data.maxVal) {
      //     // minVal = res.data && '' + res.data.minVal ? '' + res.data.minVal : ''
      //     // maxVal = res.data && '' + res.data.maxVal ? '' + res.data.maxVal : ''
      //     minVal = '' + res.data.minVal
      //     maxVal = '' + res.data.maxVal
      //   }
      //   productInfo = { ...productInfo, minVal: minVal, maxVal: maxVal }
      // }
      // if (productInfo.suggestWidth) {
      //   const res = await fabricWidthRange({ searchValue: productInfo.suggestWidth })
      //   let widthMinVal = ''
      //   let widthMaxVal = ''
      //   if (this.$pub.responseValidate(res) && res.data.maxVal) {
      //     // widthMinVal = res.data && '' + res.data.minVal ? '' + res.data.minVal : ''
      //     // widthMaxVal = res.data && '' + res.data.maxVal ? '' + res.data.maxVal : ''
      //     widthMinVal = '' + res.data.minVal
      //     widthMaxVal = '' + res.data.maxVal
      //   }
      //   productInfo = { ...productInfo, widthMinVal: widthMinVal, widthMaxVal: widthMaxVal }
      // }
      this.syncMoudleDataHandle('customerSampleData', { cloth, ...productInfo, sampleAnalysisResultId: id, materialInfo: this.RawMaterialArray })
    },
    sampleAnalysis(detailObj) { // 客样分析数据处理  // 原料信息
      // 天然 naturalFibers 纱支/细度
      const GlobalArray = []
      const naturalFibersIndex = detailObj.naturalFibers || [] // 天然
      const chemicalFibersIndex = detailObj.chemicalFibers || [] // 化学纤维
      const combinedData = detailObj.composeYarns || [] // 组合纱线
      GlobalArray.push(
        { type: '0', data: naturalFibersIndex || [] },
        { type: '1', data: chemicalFibersIndex || [] },
        { type: '2', data: combinedData || [] }
      )
      console.log('om', GlobalArray)
      GlobalArray.length && GlobalArray.forEach((itx, imx) => {
        if (itx.type === '0' && itx.data && itx.data.length) { // 天然
          this.naturalFiberFun(itx.data)
        }
        if (itx.type === '1' && itx.data && itx.data.length) { // 化学纤维
          this.chemicalFibersFun(itx.data)
        }
        if (itx.type === '2' && itx.data && itx.data.length) { // 组合纱线
          const dataTims = new Date().getTime()
          itx.data.forEach((item, index) => {
            const that = this
            if ((item.naturalFiberUpdateReqtList && item.naturalFiberUpdateReqtList.length) || (item.chemicalFiberUpdateReqtList && item.chemicalFiberUpdateReqtList.length)) {
              const opm = {
                type: '2',
                certificate: '',
                materialInfoCopy: dataTims * 3 + index + '',
                supplierYarnCode: '',
                chemicalFiber: that.chemicalFibersFun(item.chemicalFiberUpdateReqtList, 2) || [],
                naturalFiber: that.naturalFiberFun(item.naturalFiberUpdateReqtList, 1) || []
              }
              this.RawMaterialArray.push(opm)
            }
          })
        }
      })
      // this.ExternalRawMaterials(this.RawMaterialArray[this.rowIndex - 1], true)
    },
    // 客样分析获取的天然处理
    naturalFiberFun(naturalFibersIndex, istype = 0) {
      const spu = []
      naturalFibersIndex.forEach((item, index) => {
        const obm = { naturalFiber: [] }
        const omg = {}
        obm.type = '0'
        obm.certificate = '' // 证书要求ID
        obm.supplierYarnCode = '' // 供应商纱线编码
        omg.yarn = item.yarnInfo || '' // 纱支ID
        omg.element = item.elementInfo || ''// 成份
        // omg.element.names = '4'
        // omg.yanIndexType="4"
        // if(omg.element.label){
        //   omg.element.names=omg.element.names||""
        // }
        // omg.element=item.elementInfo?(item.elementInfo.names?item.elementInfo.label:""):""// 成份
        omg.elementRatio = item.elementRatio// 比例
        omg.yarnCategory = item.yarnCategoryInfo// 纱类
        obm.naturalFiber.push(omg)
        obm.chemicalFiber = []// 化学纤维
        if (istype) {
          spu.push(omg)
        } else {
          obm.materialInfoCopy = (new Date().getTime() + (index + 1) + '10')
          this.RawMaterialArray.push(obm)
        }
      })
      return spu
    },
    // 客样分析获取的化学处理
    chemicalFibersFun(chemicalFibersIndex, istype = 0) {
      const spu = []
      chemicalFibersIndex.forEach((item, index) => {
        const obm = { chemicalFiber: [] }
        const omg = {}
        obm.type = '1'
        obm.certificate = ''
        obm.supplierYarnCode = ''
        omg.fineness = item.finenessInfo || '' // 细度ID
        omg.element = item.elementInfo || ''// 成份
        omg.wireCategory = item.wireCategoryInfo // 丝类
        obm.chemicalFiber.push(omg)
        obm.naturalFiber = []

        if (istype) {
          spu.push(omg)
        } else {
          obm.materialInfoCopy = (new Date().getTime() * 2 + (index + 1) + '20')
          this.RawMaterialArray.push(obm)
        }
        if (istype) { return spu }
      })
      return spu
    }
  }

}
</script>
