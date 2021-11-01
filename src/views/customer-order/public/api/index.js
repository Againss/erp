import request from '@/utils/request'
import { filterOptions } from '@/utils/index'
// 获取基础数据的下拉选数据
const props = {
  id: 'value',
  name: 'label',
  enabled: 'disabled',
  enabledValue: false,
  disabledValue: true,
  disabledName: v => v
}
/* 选项配置下拉 */
export const optionConfigSelect = (params = {}) => {
  return request({
    // url: '/baseData/optionConfig/list',
    url: '/basis/api/optionConfig/option', // /api/optionConfig/option
    method: 'post',
    data: params
    // ,
    // headers: {
    //   'Content-Type': 'application/json; charset=utf-8',
    //   'spathv': 'product'
    // }
  })
}
/* 品牌商下拉 */
export const brandSelect = (params = {}) => {
  return request({
    url: '/crm/brand/list',
    method: 'post',
    data: params
  })
}
/* 客户下拉 */
export const customerSelect = (params = {}) => {
  return request({
    url: '/crm/customer/list',
    method: 'post',
    data: params
  })
}
/* 销售团队下拉 */
export const sellTeamselect = (params = {}) => {
  return request({
    url: '/crm/sysOrg/list',
    method: 'post',
    data: params
  })
}
/* 销售员下拉 */
export const sellerSelect = (params = {}) => {
  return request({
    url: '/customerOrder/colorModel/colorModelApply/salerList',
    method: 'post',
    data: params
  })
}
/* 布类下拉 */
export const clothSelect = (params = {}) => {
  return request({
    url: '/basis/api/cloths/index',
    method: 'post',
    data: params
  })
}
/* 纱支下拉 */
export const yarnSelect = (params = {}) => {
  return request({
    url: '/basis/openapi/yarnType/search',
    method: 'post',
    data: params
  })
}
/* 纱支下拉 */
export const yarnTypeSelect = (params = {}) => {
  return request({
    url: '/basis/api/yarnTypes/index',
    method: 'post',
    data: params
  })
}
/* 成份下拉 */
export const compositionSelect = (params = {}) => {
  return request({
    url: '/basis/api/ingredients/index',
    method: 'post',
    data: params
  })
}
/* 组合成份下拉 */
export const zhCompositionSelect = (params = {}) => {
  return request({
    url: '/basis/openapi/assemblyIngredient/search',
    method: 'post',
    data: params
  })
}
/* 年份下拉 */
export const yearSelect = (params = {}) => {
  return request({
    url: '/customerOrder/sampleAnalysisApply/year',
    method: 'post',
    data: params
  })
}
/* 币别下拉 */
export const currencySelect = (params = {}) => {
  return request({
    url: '/basis/api/currencies/index',
    method: 'post',
    data: { ...params, enabled: 'Y' }
  })
}
/* 价格条款下拉 */
export const pricingTermSelect = (params = {}) => {
  return request({
    url: '/basis/api/priceTerms/index',
    method: 'post',
    data: { ...params, enabled: 'Y' }
  })
}
/* 付款条件下拉 */
export const paymentTermSelect = (params = {}) => {
  return request({
    url: '/basis/api/paymentTerms/index',
    method: 'post',
    data: { ...params, enabled: 'Y' }
  })
}
/* 订单号下拉 */
export const orderNoSelect = (params = {}) => {
  return request({
    url: '/customerOrder/coOrder/list',
    method: 'post',
    data: params
  })
}
/* 印花工艺下拉 */
export const printCraftSelect = (params = {}) => {
  return request({
    url: '/basis/api/requirementsPrinting/index',
    method: 'post',
    data: params
  })
}
// 对色光源下拉
export const firstLightSelect = (params = {}) => {
  return request({
    url: '/basis/api/lightSources/index',
    method: 'post',
    data: params
  })
}
// 色板单号下拉
export const swatchesNoSelect = (params = {}) => {
  return request({
    url: '/customerOrder/colorModel/colorModelApply/list',
    method: 'post',
    data: params
  })
}
// 印花SO单号下拉
export const printApplyNoSelect = (params = {}) => {
  return request({
    url: '/customerOrder/soPrint/printApply/list',
    method: 'post',
    data: params
  })
}
// 单位下拉
export const UnitsSelect = (params = {}) => {
  return request({
    url: '/basis/api/units/option',
    method: 'post',
    data: { ...params, enabled: 'Y' }
  })
}
// 单位下拉 设置
export async function getUnitsSelect(data, parmas) {
  const res = (await request({
    url: '/basis/api/units/option',
    method: 'post',
    data
  })).data || []
  parmas.data = res.map(e => ({
    value: String(e.id),
    label: e.name,
    disabled: e.enabled === 'N'
  }))
  console.log("Sssss8585",parmas)
  return filterOptions({ ...parmas, props })
}
// 单位下拉
export const greyClothCodesSelect = (params = {}) => {
  return request({
    url: '/customerOrder/coOrder/getGreyClothCodes',
    method: 'post',
    data: params
  })
}
// 客样分析编号下拉
export const sampleAnalysisNoSelect = (params = {}) => {
  return request({
    url: '/techManage/sampleAnalysisResult/list',
    method: 'post',
    data: params
  })
}

// 1.5-港口-列表-查询
export const openapiSearch = (params = {}) => {
  return request({
    url: '/basis/openapi/port/search',
    method: 'post',
    data: params
  })
}

// 国家-列表-查询
export const openapiCountry = (params = {}) => {
  return request({
    url: '/basis/openapi/country/search',
    method: 'post',
    data: params
  })
}

// 1.5-运输方式-列表-查询
export const openShipMethod = (params = {}) => {
  return request({
    url: '/basis/openapi/shipMethod/search',
    method: 'post',
    data: params
  })
}

// 花号分页列表
export function queryFlowerNoPage(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 10 }
  return request({
    url: '/customerOrder/soPrint/printApply/queryFlowerNoPage',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 的供应商列表 2.04
export function supplierList(data = {}) {
  const defaultParams = { isEnabled: 1}
  return request({
    url: '/srm/supplier/searchList',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// ERP2报价单分页
export function quotationSheet(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 10 }
  return request({
    url: '/crm/quotationSheet/quotationPage',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// ERP2税率换算
export function exchangeRatemn(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 10 }
  return request({
    url: '/priceCenter/exchangeRate/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}
// 布类 获取织染方式 
export function getFabricList(data = {}) {
  return request({
    url: '/basis/api/cloths/index',
    method: 'post',
    data: { ...data }
  })
}
// 织染方式 获取织造花型 
export function getKnitDye(data = {}) {
  return request({
    url: '/basis/api/knitDyes/show',
    method: 'post',
    data: { ...data }
  })
}
//获取成分所属分类
export function getFabricComposition(data = {}) {
  return request({
    url: '/basis/api/batch/ingredientSearch',
    method: 'post',
    data: data
    // ,
    // headers: {
    //   'Content-Type': 'application/json; charset=utf-8',
    //   'spathv': 'dev4'
    // }

  })
}

//获取色级列表
export function colorGradeIndex(data = {}) {
  return request({
    url: '/basis/api/colorGrade/option',
    method: 'post',
    data: data
    // ,
    // headers: {
    //   'Content-Type': 'application/json; charset=utf-8',
    //   'spathv': 'dev4'
    // }

  })
}

// 单双染下拉
export function singleDoubleDyes(data = {}) {
  return request({
    url: 'basis/openapi/singleDoubleDye/search',
    method: 'post',
    data
  })
}
