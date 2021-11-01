// import { log } from '@/api/app'
import * as api from './api/index'
export const PublicCustomer = PublicCustomer || {
  methods: {
    // 订单类型下拉接口
    async getOptionConfig (params = {}) {
      const res = await api.optionConfigSelect(params)
      let formaterList = []
      if (this.$pub.responseValidate(res)) {
        const list = res.data
        if (list && list.length > 0) {
          formaterList = list.map(item => ({ value: '' + item.fieldValueId, label: item.fieldValue }))
        }
      }
      return formaterList
    },
    // 品牌商下拉接口
    async getBrand (params = {}) {
      const res = await api.brandSelect(params)
      let formaterList = []
      if (this.$pub.responseValidate(res)) {
        const list = res.data
        if (list && list.length > 0) {
          formaterList = list.map(item => ({ value: '' + item.id, label: item.name }))
        }
      }
      return formaterList
    },
    // 客户下拉接口
    async getCustomer (params = {}) {
      const res = await api.customerSelect(params)
      let formaterList = []
      if (this.$pub.responseValidate(res)) {
        const list = res.data
        if (list && list.length > 0) {
          formaterList = list.map(item => ({ value: item.customerId, label: item.name }))
        }
      }
      return formaterList
    },
    // 销售团队下拉
    async getSellTeam (params = {}) {
      const res = await api.sellTeamselect(params)
      let formaterList = []
      if (this.$pub.responseValidate(res)) {
        const list = res.data
        if (list && list.length > 0) {
          formaterList = list.map(item => ({ value: '' + item.orgId, label: item.name }))
        }
      }
      return formaterList
    },
    // 销售员下拉
    async getSeller (params = {}) {
      const res = await api.sellerSelect(params)
      let formaterList = []
      if (this.$pub.responseValidate(res)) {
        const list = res.data
        if (list && list.length > 0) {
          formaterList = list.map(item => ({ value: '' + item.userId, label: item.realName || '' }))
        }
      }
      return formaterList
    },
    // 年份下拉
    async getYear (params = {}) {
      const res = await api.yearSelect(params)
      let formaterList = []
      if (this.$pub.responseValidate(res)) {
        const list = res.data
        if (list && list.length > 0) {
          formaterList = list.map(item => ({ value: '' + item.value, label: item.label }))
        }
      }
      return formaterList
    },
    // 币别下拉
    async getCurrency (params = {}) {
      const res = await api.currencySelect(params)
      let formaterList = []
      if (this.$pub.responseValidate(res)) {
        const list = res.data
        if (list && list.length > 0) {
          formaterList = list.map(item => ({ value: item.uuid, label: item.name, nameEn: item.nameEn, code: item.code }))
        }
      }
      return formaterList
    },
    // 价格条款下拉
    async getPricingTerm (params = {}) {
      const res = await api.pricingTermSelect(params)
      let formaterList = []
      if (this.$pub.responseValidate(res)) {
        const list = res.data
        if (list && list.length > 0) {
          formaterList = list.map(item => ({ value: item.uuid, label: item.name }))
        }
      }
      return formaterList
    },
    // 付款条件下拉
    async getPaymentTerm (params = {}) {
      const res = await api.paymentTermSelect(params)
      let formaterList = []
      if (this.$pub.responseValidate(res)) {
        const list = res.data
        if (list && list.length > 0) {
          formaterList = list.map(item => ({ value: item.uuid, label: item.name }))
        }
      }
      return formaterList
    },
    // 布类下拉
    async getCloth (params = {}) {
      const res = await api.clothSelect(params)
      let formaterList = []
      if (this.$pub.responseValidate(res)) {
        const list = res.data
        if (list && list.length > 0) {
          formaterList = list.map(item => ({ value: item.uuid, label: item.name }))
        }
      }
      return formaterList
    },
    // 订单号下拉
    async getOrderNo (params = {}) {
      const res = await api.orderNoSelect(params)
      let formaterList = []
      if (this.$pub.responseValidate(res)) {
        const list = res.data
        if (list && list.length > 0) {
          formaterList = list.map(item => ({ value: item.orderId, label: item.code }))
        }
      }
      return formaterList
    },
    // 坯布编码下拉
    async getGreyClothCodes (params = {}) {
      const res = await api.greyClothCodesSelect(params)
      let formaterList = []
      if (this.$pub.responseValidate(res)) {
        const list = res.data
        if (list && list.length > 0) {
          formaterList = list.map(item => ({ value: item.value, label: item.label }))
        }
      }
      return formaterList
    },
    // 印花工艺下拉
    async getPrintCraft (params = {}) {
      const res = await api.printCraftSelect(params)
      let formaterList = []
      if (this.$pub.responseValidate(res)) {
        const list = res.data
        if (list && list.length > 0) {
          formaterList = list.map(item => ({ value: item.uuid, label: item.name,id:item.id }))
        }
      }
      return formaterList
    },
    // 纱支、细度下拉 combine组合
    async getYarn (types) {
      let type = types.type
      const resYarnCount = await api.yarnSelect({ categoryId: '9', enabled: types.enabled || "" })
      let yarnCount = []
      let fineness = []
      let formaterList = []
      if (this.$pub.responseValidate(resYarnCount)) {
        const list = resYarnCount.data
        if (list && list.length > 0) {
          yarnCount = list.map(item => ({ value: item.uuid, label: item.name, type: 0 }))
        }
      }
      const resFineness = await api.yarnSelect({ categoryId: '12', enabled: types.enabled || "" })
      if (this.$pub.responseValidate(resFineness)) {
        const list = resFineness.data
        if (list && list.length > 0) {
          fineness = list.map(item => ({ value: item.uuid, label: item.name, type: 1 }))
        }
      }
      if (type === 'yarn') {
        formaterList = yarnCount
      } else if (type === 'fineness') {
        formaterList = fineness
      } else if (type === 'combine') {
        formaterList = yarnCount.concat(fineness)
      }
      return formaterList
    },
    // 纱类、丝类下拉
    async getYarnType (types) {
      let type = types.type
      const resYarnCount = await api.yarnTypeSelect({ categoryId: '1', enabled: types.enabled || "" })
      let yarnCount = []
      let silk = []
      let formaterList = []
      if (this.$pub.responseValidate(resYarnCount)) {
        const list = resYarnCount.data
        if (list && list.length > 0) {
          yarnCount = list.map(item => ({ value: item.uuid, label: item.name, type: 0 }))
        }
      }
      const resSilk = await api.yarnTypeSelect({ categoryId: '4', enabled: types.enabled || "" })
      if (this.$pub.responseValidate(resSilk)) {
        const list = resSilk.data
        if (list && list.length > 0) {
          silk = list.map(item => ({ value: item.uuid, label: item.name, type: 1 }))
        }
      }
      if (type === 'yarn') {
        formaterList = yarnCount
      } else if (type === 'silk') {
        formaterList = silk
      } else if (type === 'combine') {
        formaterList = yarnCount.concat(silk)
      }
      // debugger
      return formaterList
    },
    // 成份下拉 (一张表的数据成份id会出现相同情况，查询时id怎么传)
    async getComposition (type) {
      const resComposition = await api.compositionSelect(type)
      let compositionList = []
      let ZhcompositionList = []
      let formaterList = []
      if (this.$pub.responseValidate(resComposition)) {
        const list = resComposition.data
        if (list && list.length > 0) {
          compositionList = list.map(item => ({ value: item.uuid, label: item.name, type: '0', names: item.name }))
        }
      }
      const resZhComposition = await api.zhCompositionSelect(type)
      if (this.$pub.responseValidate(resZhComposition)) {
        const list = resZhComposition.data
        if (list && list.length > 0) {
          ZhcompositionList = list.map(item => ({ value: item.uuid, label: item.name, type: '1', names: item.names }))
        }
      }
      formaterList = compositionList.concat(ZhcompositionList)
      return formaterList
    },
    // lst对色光源下拉
    async getFirstLight (params = {}) {
      const res = await api.firstLightSelect(params)
      let formaterList = []
      if (this.$pub.responseValidate(res)) {
        const list = res.data
        if (list && list.length > 0) {
          formaterList = list.map(item => ({ value: item.uuid, label: item.name }))
        }
      }
      return formaterList
    },
    // 色板单号下拉
    async getSwatchesNo (params = {}) {
      const res = await api.swatchesNoSelect(params)
      console.log(res)
      let formaterList = []
      if (this.$pub.responseValidate(res)) {
        const list = res.data
        if (list && list.length > 0) {
          formaterList = list.map(item => ({ value: item.id, label: item.id }))
        }
      }
      return formaterList
    },
    // 印花SO单号下拉
    async getPrintApplyNo (params = {}) {
      const res = await api.printApplyNoSelect(params)
      console.log(res)
      let formaterList = []
      if (this.$pub.responseValidate(res)) {
        const list = res.data
        if (list && list.length > 0) {
          formaterList = list.map(item => ({ value: item.id, label: item.id }))
        }
      }
      return formaterList
    },
    // 单位下拉
    async getUnits (params = {}) {
      const res = await api.UnitsSelect(params)
      let formaterList = []
      if (this.$pub.responseValidate(res)) {
        const list = res.data
        if (list && list.length > 0) {
          formaterList = list.map(item => ({ value: '' + item.id, label: item.name }))
        }
      }
      console.log("go1111", formaterList)
      return formaterList
    },
    // 客样分析编号下拉
    async getSampleAnalysisNo (params = {}) {
      const res = await api.sampleAnalysisNoSelect(params)
      let formaterList = []
      if (this.$pub.responseValidate(res)) {
        const list = res.data
        if (list && list.length > 0) {
          formaterList = list.map(item => ({ value: item.csSampleAnalysisApplayId, label: item.id }))
        }
      }
      return formaterList
    },
    //港口-列表-查询
    async DestinationPort (params = {}) {
      const res = await api.openapiSearch(params)
      let formaterList = []
      if (this.$pub.responseValidate(res)) {
        const list = res.data
        if (list && list.length > 0) {
          formaterList = list.map(item => ({ value: '' + item.id, label: item.name }))
        }
      }
      return formaterList
    },
    //国家-列表-查询
    async CountryPort (params = {}) {
      const res = await api.openapiCountry(params)
      let formaterList = []
      if (this.$pub.responseValidate(res)) {
        const list = res.data
        if (list && list.length > 0) {
          formaterList = list.map(item => ({ value: '' + item.id, label: item.name }))
        }
      }
      return formaterList
    },
    //1.5-运输方式-列表-查询
    async openShipMethodPort (params = {}) {
      const res = await api.openShipMethod(params)
      let formaterList = []
      if (this.$pub.responseValidate(res)) {
        const list = res.data
        if (list && list.length > 0) {
          formaterList = list.map(item => ({ value: '' + item.id, label: item.name }))
        }
      }
      return formaterList
    },
    // categoryId 纱支 9/梳棉方法 3/ 纺纱方法 2/ 捻向 10/纱类 1/细度 12/品名 4/丝类 13/ 网络度 15光泽度 5/组合方式 21 /包覆方式 20/功能14
    async CardingMethod (params = {}) {
      const res = await api.yarnTypeSelect({ categoryId: params.type, enabled: "Y" })
      let formaterList = []
      if (this.$pub.responseValidate(res)) {
        const list = res.data
        if (list && list.length > 0) {
          formaterList = list.map(item => ({ value: item.uuid, label: item.name }))
        }
      }
      return formaterList

    },
    // 的供应商列表 2.04
    async supplierListMethod (params = {}) {
      const res = await api.supplierList(params)
      let formaterList = []
      if (this.$pub.responseValidate(res)) {
        const list = res.data
        if (list && list.length > 0) {
          formaterList = list.map(item => ({ value: "" + item.id, label: item.supplierName }))
        }
      }
      return formaterList
    },
    // 布类获取织造花型
    async getWeavingPattern(name,uuid){
      const res = await api.getFabricList({name})
      let data = null
      let result = null
      if (this.$pub.responseValidate(res)) {
        const list = res.data
        if (list && list.length > 0) {
          data = list.find(item => item.uuid === uuid)
        }
        if(data&&data.knitDye){
          const res1 = await api.getKnitDye({id:data.knitDye.id})
          if (this.$pub.responseValidate(res1)){
            result = res1.data&&res1.data.knitModel
          }
        }
      }
      return result
    },
    //获取成分所属分类
    async getFabricComposition(data={}){
      const res = await api.getFabricComposition(data)
      let list = []
      if (this.$pub.responseValidate(res)) {
         list = res.data
      }
      return list
    },
    async exchangeRatemnnameEn(params = {}) {//税率请求接口
      const res = await api.exchangeRatemn(params)
      let formaterList = []
      if (this.$pub.responseValidate(res)) {
        const list = res.data&&res.data.list||[]
        if (list && list.length > 0) {
          formaterList = list.map(item => ({
            value: "" + item.id, 
            label: item.exchangeRate, //汇率
            sourceCurrencyEname:item.sourceCurrencyEname , //源货币英文名 人民币-RMB/港币-HKD/美元-USD
            targetCurrencyEname:item.targetCurrencyEname //目标货币英文名 人民币-RMB/港币-HKD/美元-USD
          }))
        }
      }
      return formaterList
    },

    async colorGradeIndexData(params = {}) {//获取色级列表
      const res = await api.colorGradeIndex(params)
      let formaterList = []
      if (this.$pub.responseValidate(res)) {
        const list = res.data
        if (list && list.length > 0) {
          formaterList = list.map(item => ({ value: '' + item.uuid, label: item.name }))
        }
      }
      return formaterList
    },

    async singleDoubleDyeData(params = {}) {//单双染下拉
      const res = await api.singleDoubleDyes(params)
      let formaterList = []
      if (this.$pub.responseValidate(res)) {
        const list = res.data
        if (list && list.length > 0) {
          formaterList = list.map(item => ({ value: '' + item.uuid, label: item.name }))
        }
      }
      return formaterList
    },





  }
}
