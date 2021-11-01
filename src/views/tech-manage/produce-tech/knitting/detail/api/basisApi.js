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

// 基础数据-生产工艺-染整工艺
export async function tmDyeFinishTechList(data) {
  const res = (await request({
    url: '/baseData/tmDyeFinishTech/list',
    method: 'post',
    data
  })).data || []
  return res.map(e => ({
    label: e.name,
    value: e.uuid
  }))
}

// 生产工艺-染整（启用/审核）
export async function getProduceStates(data) {
  const res = (await request({
    url: '/basis/api/requirementsDye/option',
    method: 'post',
    data
  })).data || []
  return res.map(e => ({
    label: e.name,
    value: e.uuid
  }))
}

// 生产工艺-染色（启用/审核）
export async function getDyeIngredient(data) {
  const res = (await request({
    url: '/basis/api/dyeIngredient/option',
    method: 'post',
    data
  })).data || []
  return res.map(e => ({
    label: e.name,
    value: e.uuid
  }))
}

// 生产工艺-制软要求（启用/审核）
export async function getSoftMethod(data) {
  const res = (await request({
    url: '/basis/openapi/softMethod/search',
    method: 'post',
    data
  })).data || []
  return res.map(e => ({
    label: e.name,
    value: e.uuid
  }))
}

// 生产工艺-标准工序流程列表
export async function getProcessFlow(data) {
  const res = (await request({
    // url: '/basis/openapi/standardProcessFlow/search',
    url: '/basis/api/standardProcessFlow/option',

    method: 'post',
    data
    // ,
    // headers: {
    //   'Content-Type': 'application/json; charset=utf-8',
    //   'spathv': 'product'
    // }
  })).data || []
  return res
}
// 生产工艺--标准工序流程列表
export async function getProcessFlowList(data) {
  const res = (await request({
    url: '/basis/openapi/standardProcessFlow/search',
    method: 'post',
    data
    // ,
    // headers: {
    //   'Content-Type': 'application/json; charset=utf-8',
    //   'spathv': 'product'
    // }
  })).data || []
  return res
}

// 工艺要求-染整组合
export async function getRequirementCombination(data) {
  const res = (await request({
    url: '/basis/api/requirementsCombination/option',
    method: 'post',
    data
    // ,
    // headers: {
    //   'Content-Type': 'application/json; charset=utf-8',
    //   'spathv': 'product'
    // }
  })).data || []
  return res
}

// 工艺要求-工艺要求染整(风格整理\功能性整理\手感整理)
export async function requirementDye(data) {
  const res = (await request({
    url: '/basis/openapi/requirementDye/search',
    method: 'post',
    data
  })).data || []
  return res
}

// 色号全量查询接口 （色号类型（智布色号、色板申请）获取智布色号）
export async function getColorManageList(data) {
  const res = (await request({
    url: '/openapi/color/colorManageList',
    method: 'post',
    data
  })).data || []
  return res
}
