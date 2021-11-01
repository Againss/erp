import request from '@/utils/request'
import { filterOptions } from '@/utils/index'

// 获取基础数据的下拉选数据
const props = {
  id: 'value',
  name: 'label',
  enabled: 'disabled',
  enabledValue: false,
  disabledValue: true,
  disabledName: v => v + '(禁用)'
}

// categoryId 纱支 9/梳棉方法 3/ 纺纱方法 2/ 捻向 10/纱类 1/细度 12/品名 4/丝类 13/ 网络度 15光泽度 5/组合方式 21 /包覆方式 20/功能14
export async function getSelectData(data, parmas) {
  const res = (await request({
    url: 'basis/openapi/yarnType/search',
    method: 'post',
    data
  })).data || []
  parmas.data = res.map(e => ({
    value: String(e.id),
    label: e.name,
    disabled: e.enabled === 'N'
  }))
  return filterOptions({ ...parmas, props })
}

// 成份/组合成份
export async function getChengFen(data, parmas) {
  const res1 = (await request({
    url: 'basis/openapi/ingredient/search',
    method: 'post',
    data
  })).data || []
  const res2 = (await request({
    url: 'basis/openapi/assemblyIngredient/search',
    method: 'post',
    data
  })).data || []
  // type S组合成份
  parmas.data = [...res1, ...res2].map(e => ({
    value: e.id + '-' + e.name,
    type: e.ids ? 'S' : 'C',
    disabled: e.enabled === 'N',
    label: e.name
  }))
  return filterOptions({ ...parmas, props })
}

// 获取下拉选数据 mode: 织造花型 K、染方式 D
export async function getZhiRan(data, parmas) {
  const res = (await request({
    url: 'basis/openapi/fabricationProduceMode/search',
    method: 'post',
    data
  })).data || []
  parmas.data = res.map(e => ({
    value: String(e.id),
    label: e.name,
    disabled: e.enabled === 'N'
  }))
  return filterOptions({ ...parmas, props })
}

// 布种
export async function getBuZhong(data, parmas) {
  const res = (await request({
    url: 'basis/openapi/fabrication/search',
    method: 'post',
    data
  })).data || []
  parmas.data = res.map(e => ({
    value: String(e.id),
    label: e.name,
    disabled: e.enabled === 'N'
  }))
  return filterOptions({ ...parmas, props })
}

// 布类
export async function getBuLei(data, parmas) {
  const res = (await request({
    url: 'basis/api/cloths/index',
    method: 'post',
    data
  })).data || []
  parmas.data = res.map(e => ({
    value: e.uuid,
    label: e.name,
    disabled: e.enabled === 'N'
  }))
  return filterOptions({ ...parmas, props })
}

// 工艺要求 染整
export async function getRanZheng(data, parmas) {
  const res = (await request({
    url: '/basis/openapi/requirementDye/search',
    method: 'post',
    data
  })).data || []
  parmas.data = res.map(e => ({
    value: String(e.id),
    label: e.name,
    disabled: e.enabled === 'N'
  }))
  return filterOptions({ ...parmas, props })
}

// 单双染
export async function getDoubleDye(data, parmas) {
  const res = (await request({
    url: 'basis/api/singleDoubleDye/option',
    method: 'post',
    data
  })).data || []
  parmas.data = res.map(e => ({
    value: String(e.id),
    label: e.name,
    disabled: e.enabled === 'N'
  }))
  return filterOptions({ ...parmas, props })
}

// 选项配置 成分占比
export async function getZhanBi(data, parmas) {
  const res = (await request({
    url: '/priceCenter/componentRate/list',
    method: 'post',
    data
  })).data || []
  parmas.data = res.map(e => ({
    value: e.id,
    label: e.componentRateName,
    disabled: e.status === 0
  }))
  return filterOptions({ ...parmas, props })
}

// 选项配置 纱线证书
export async function getZhengShu(data, parmas) {
  const res = (await request({
    url: '/priceCenter/yarnCertificateOption/list',
    method: 'post',
    data
  })).data || []
  parmas.data = res.map(e => ({
    value: e.id,
    label: e.yarnCertName,
    disabled: e.status === 0
  }))
  return filterOptions({ ...parmas, props })
}

// 选项配置 染纱颜色
export async function getRanSha(data, parmas) {
  const res = (await request({
    url: '/priceCenter/dyeYarnLossColor/list',
    method: 'post',
    data
  })).data || []
  parmas.data = res.map(e => ({
    value: e.id,
    label: e.dyeYarnLossColorName,
    disabled: e.status === 0
  }))
  return filterOptions({ ...parmas, props })
}

// 选项配置 布类等级
export async function getDengJi(data, parmas) {
  const res = (await request({
    url: '/priceCenter/fabricGrade/list',
    method: 'post',
    data
  })).data || []
  parmas.data = res.map(e => ({
    value: e.id,
    label: e.fabricGradeName,
    disabled: e.status === 0
  }))
  return filterOptions({ ...parmas, props })
}

// 选项配置 颜色深浅
export async function getShenQian(data, parmas) {
  const res = (await request({
    url: '/priceCenter/dyeFinishLossColorShade/list',
    method: 'post',
    data
  })).data || []
  parmas.data = res.map(e => ({
    value: e.id,
    label: e.dyeFinishLossColorShadeName,
    disabled: e.status === 0
  }))
  return filterOptions({ ...parmas, props })
}

// 选项配置 测试标准
export async function getBiaoZhui(data) {
  const res = (await request({
    // url: 'basis/api/singleDoubleDye/option',
    method: 'post',
    data
  })).data || []
  return res.map(e => ({
    value: e.id,
    label: e.name,
    disabled: e.enabled === 'N'
  }))
}

// 色号库 智布色号
export async function getSeHao(data, parmas) {
  const res = (await request({
    url: '/color/openapi/color/droplist',
    method: 'post',
    data
  })).data || []
  parmas.data = res.map(e => ({
    value: String(e.id),
    label: e.code,
    disabled: e.enabled === 'N'
  }))
  return filterOptions({ ...parmas, props })
}

// 选项配置供应商色号下拉
export async function getColorNo(data, parmas) {
  const res = (await request({
    url: '/priceCenter/supplierColor/list',
    method: 'post',
    data
  })).data || []
  parmas.data = res.map(e => ({
    value: String(e.id),
    label: e.supplierColorName,
    disabled: e.enabled === 'N'
  }))
  return filterOptions({ ...parmas, props })
}

// 选项配置纱线品牌下拉
export async function getYarnBrand(data, parmas) {
  const res = (await request({
    url: '/priceCenter/yarnBrand/list',
    method: 'post',
    data
  })).data || []
  parmas.data = res.map(e => ({
    value: String(e.id),
    label: e.yarnBrandName,
    disabled: e.enabled === 'N'
  }))
  return filterOptions({ ...parmas, props })
}

// 基础 港口
export async function portsOption(data) {
  const res = (await request({
    url: 'basis/api/ports/option',
    method: 'post',
    data
  })).data || []
  return res.map(e => ({
    value: String(e.id),
    label: e.name
  }))
}

// 基础 省市
export async function areasOption(data) {
  const res = (await request({
    url: '/basis/api/areas/option',
    method: 'post',
    data
  })).data || []
  return res.map(e => ({
    value: String(e.id),
    label: e.name
  }))
}

// 基础 价格条款
export async function priceTermsOption(data) {
  const res = (await request({
    url: '/basis/api/priceTerms/option',
    method: 'post',
    data
  })).data || []
  return res.map(e => ({
    value: String(e.id),
    label: e.nameEn
  }))
}

// 基础-国家地区
export async function countriesOption(data, parmas) {
  const res = (await request({
    url: '/basis/api/countries/option',
    method: 'post',
    data
  })).data || []
  parmas.data = res.map(e => ({
    value: String(e.id),
    label: e.name,
    abbr: e.abbr,
    disabled: e.enabled === 'N'
  }))
  return filterOptions({ ...parmas, props })
}

// 印花工艺下拉选项
export async function requirementsPrinting(data, parmas) {
  const res = (await request({
    url: '/basis/api/requirementsPrinting/index',
    method: 'post',
    data
  })).data || []
  parmas.data = res.map(e => ({
    value: String(e.id),
    label: e.name,
    disabled: e.enabled === 'N'
  }))
  return filterOptions({ ...parmas, props })
}

// 运输方式
export async function shipMethodOption(data, parmas) {
  const res = (await request({
    url: '/basis/api/shipMethod/index',
    method: 'post',
    data
  })).data || []
  parmas.data = res.map(e => ({
    value: String(e.id),
    label: e.name,
    disabled: e.enabled === 'N'
  }))
  return filterOptions({ ...parmas, props })
}

// 付款条件下拉选项
export async function paymentTermsList(data, parmas) {
  const res = (await request({
    url: '/basis/api/paymentTerms/option',
    method: 'post',
    data
  })).data || []
  parmas.data = res.map(e => ({
    value: String(e.id),
    label: e.name,
    disabled: e.enabled === 'N'
  }))
  return filterOptions({ ...parmas, props })
}

// 付款条件搜索下拉选项
export function paymentTermsSearch(data) {
  return request({
    url: '/priceCenter/paymentMethod/optionsFilled',
    method: 'post',
    data
  })
  // const res = (await request({
  //   url: '/priceCenter/paymentMethod/optionsFilled',
  //   method: 'post',
  //   data
  // })).data.paymentMethod || []
  // return res
}

// 基础-工艺要求-染整下拉选项
export async function requirementsDyeOption(data, parmas) {
  const res = (await request({
    url: '/basis/api/requirementsDye/option',
    method: 'post',
    data
  })).data || []
  parmas.data = res.map(e => ({
    value: String(e.id),
    label: e.name,
    disabled: e.enabled === 'N'
  }))
  return filterOptions({ ...parmas, props })
}
