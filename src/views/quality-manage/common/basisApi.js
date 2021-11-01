import request from '@/utils/request'
// import { filterOptions } from '@/utils/index'
// const props = {
//   id: 'value',
//   name: 'label',
//   enabled: 'disabled',
//   enabledValue: false,
//   disabledValue: true,
//   disabledName: v => v
// }

// 质量管理-试纱项目
export function yarnTestConfig(data = { isEnabled: 1 }) {
  return request({
    url: '/baseData/qa/yarnTestConfig/list',
    method: 'post',
    data
  })
}

// export function dyeColorTestConfig(data = {}) {
//   return request({
//     url: '/baseData/qa/dyeColorTestConfig/list',
//     method: 'post',
//     data
//   })
// }
// 质量管理-试染颜色
export async function dyeColorTestConfig(data = { isEnabled: 1 }) {
  const res = (await request({
    url: '/baseData/qa/dyeColorTestConfig/list',
    method: 'post',
    data
  })).data || []
  return res.map(e => ({
    label: e.name,
    value: e.uuid
  }))
}

// 审核人-用户中心员工管理
export async function getUserData(data = {}) {
  const res = (await request({
    url: '/userCenter/sysUser/list',
    method: 'post',
    data
  })).data || []
  return res.list && res.list.map(e => ({
    label: e.realName,
    value: e.userId
  }))
}

// 供应商-供应商列表（供应商类别=采购，供应商类型=纱供应商，供应商状态ALL）
export async function getSupplierData(data) {
  const res = (await request({
    url: '/srm/supplier/searchList', // 还没有灰度暂时用page
    method: 'post',
    data
    // ,
    // headers: {
    //   'Content-Type': 'application/json; charset=utf-8',
    //   'spathv': 'stable'
    // }

  })).data || []
  return res.map(e => ({
    label: e.supplierName,
    value: e.id + ''
  }))
}
// 纱支-通用基础数据-产品-纱属性-短纤-纱支
// 获取下拉选数据
export async function getSelectData(data) {
  const res = (await request({
    url: 'basis/openapi/yarnType/search',
    method: 'post',
    data
  })).data || []
  return res.map(e => ({
    label: e.name,
    value: e.uuid

  }))
}
// 成份-通用基础数据-产品-成份+组合成份纤维类型为短纤
export async function getIngredientsData(data) {
  let res = (await request({
    url: '/basis/openapi/ingredient/search', // 成分
    method: 'post',
    data
  })).data || []
  const res2 = (await request({
    url: '/basis/openapi/assemblyIngredient/search', // 组合成分
    method: 'post',
    data
  })).data || []
  res = res.concat(res2)
  return res.map(e => ({
    value: e.uuid,
    label: e.name,
    names: e.names
  }))
}

// 生产状态--生产工艺-生产状态-染整（启用/审核）
export async function getProduceStates(data) {
  const res = (await request({
    url: '/basis/openapi/produceState/search',
    method: 'post',
    data
  })).data || []
  return res.map(e => ({
    label: e.name,
    value: e.uuid
  }))
}

// 染厂-供应商列表-供应商类型=染整厂（供应商状态ALL）
export async function getSupplier(data) {
  const res = (await request({
    // url: '/srm/supplier/page',
    url: '/srm/supplier/searchList', // 还没有灰度暂时用page
    method: 'post',
    data
    // ,
    // headers: {
    //   'Content-Type': 'application/json; charset=utf-8',
    //   'spathv': 'stable'
    // }
  })).data || []
  return res && res.map(e => ({
    label: e.supplierName,
    value: e.id + ''
  }))
}

// 不可排布类-通用基础数据-产品-布类
export async function getCloths(data) {
  const res = (await request({
    url: '/basis/api/cloths/index',
    method: 'post',
    data
  })).data || []
  return res.map(e => ({
    label: e.name,
    value: e.uuid
  }))
}
// 试纱-已采购库存产品
export function inOutDetail(data = {}) {
  return request({
    url: '/wms/materiel/inOut/detail/page',
    method: 'post',
    data
  })
}
// 附件删除接口
export function attachmentDelete(data) {
  return request({
    url: '/crm/attachment/delete',
    method: 'get',
    // responseType: 'arraybuffer',
    params: data
  })
}
