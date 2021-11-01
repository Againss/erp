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
// 纱线物测-详情 /mock/221
export function qaYarnInspectionPhysicalInfo(data = {}) {
  return request({
    url: '/qa/qaYarnInspectionPhysical/info',
    method: 'post',
    data: { ...data }
  })
}
export function deleteQaYarnInspectionPhysical(data = {}) {
  return request({
    url: '/qa/qaYarnInspectionPhysical/delete',
    method: 'post',
    data: { ...data }
  })
}
// 添加评论
export function addComment(data = {}) {
  return request({
    url: '/qa/qaYarnInspectionPhysical/addComment',
    method: 'post',
    data: { ...data }
  })
}
export function qaYarnInspectionPhysicalRepeat(data = {}) {
  return request({
    url: '/qa/qaYarnInspectionPhysical/repeat',
    method: 'post',
    data: { ...data }
  })
}
// 纱线物测-修改状态
export function exchange(data = {}) {
  return request({
    url: '/qa/qaYarnInspectionPhysical/exchange',
    method: 'post',
    data: { ...data }
  })
}
// 纱线物测-新增
export function addQaYarnInspectionPhysical(data = {}) {
  return request({
    url: '/qa/qaYarnInspectionPhysical/add',
    method: 'post',
    data: { ...data }
  })
}
// 纱线物测-修改
export function modifyQaYarnInspectionPhysical(data = {}) {
  console.log(111)
  debugger
  return request({
    url: '/qa/qaYarnInspectionPhysical/modify',
    method: 'post',
    data: { ...data }
  })
}
// 纱线物测-处理
export function processQaYarnInspectionPhysical(data = {}) {
  return request({
    url: '/qa/qaYarnInspectionPhysical/process',
    method: 'post',
    data: { ...data }
  })
}
// 供应商-供应商列表（供应商类别=采购，供应商类型=纱供应商，供应商状态ALL）
// export async function getSupplierData(data) {
//   const res = (await request({
//     url: '/srm/supplier/page',
//     method: 'post',
//     data
//   })).data || []
//   return res.list.map(e => ({
//     label: e.supplierName,
//     value: e.id + ''
//   }))
// }
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
    url: '/basis/openapi/requirementDye/search',
    method: 'post',
    data
  })).data || []
  return res.list.map(e => ({
    label: e.name,
    value: e.uuid
  }))
}

// 染厂-供应商列表-供应商类型=染整厂（供应商状态ALL）
export async function getSupplier(data) {
  const res = (await request({
    url: '/srm/supplier/page',
    method: 'post',
    data
  })).data || []
  return res.list && res.list.map(e => ({
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

// 质量管理基础数据-执行标准
export async function getExecutivsStandardConfig(data) {
  const res = (await request({
    url: '/baseData/qa/executivsStandardConfig/list',
    method: 'post',
    data
  })).data || []
  return res.map(e => ({
    label: e.name,
    value: e.uuid
  }))
}
// 质量管理基础数据-物测项目
export function pysicalSurveyConfigList(data = { isEnabled: 1 }) {
  return request({
    url: '/baseData/qa/pysicalSurveyConfig/list',
    // url: '/baseData/qa/pysicalSurveyConfig/list',
    method: 'post',
    data: { ...data }
  })
}
// export function dyeColorTestConfiList(data = {}) {
//   return request({
//     url: '/baseData/qa/dyeColorTestConfi/list',
//     // url: '/baseData/qa/pysicalSurveyConfig/list',
//     method: 'post',
//     data: { ...data }
//   })
// }
// 纱线检测信息提交前结构体
export function yarnCalculation(data = {}) {
  return request({
    url: '/baseData/qa/yarnGradeConfig/calculation',
    method: 'post',
    data: { ...data }
  })
}
