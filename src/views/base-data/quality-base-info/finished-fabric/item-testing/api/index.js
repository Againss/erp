import request from '@/utils/request'

// 分页 品牌列表
export function brandPageData(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/baseData/qa/finishedFabricPhysicalBrandStandard/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

export function getBAllList(data = {}) {
  return request({
    url: '/baseData/qa/finishedFabricPhysicalTestItems/allList',
    method: 'post',
    data
  })
}

// 品牌列表page(用来匹对添加过的品牌下拉)
export function brandPageDataPage(data = {}) {
  return request({
    url: '/baseData/qa/finishedFabricPhysicalBrandStandard/list',
    method: 'post',
    data
  })
}
// 一级项目或二级项目下拉 0或1
export function physicalTestItemsLsit1(data = {}) {
  return request({
    url: '/baseData/qa/finishedFabricPhysicalTestItems/list ',
    method: 'post',
    data
  })
}
export function physicalTestItemsLsit(data = {}) {
  return request({
    url: '/baseData/qa/finishedFabricPhysicalTestItems/oneLevelList ',
    method: 'post',
    data
  })
}

// 添加(基本信息)
export function brandAddData(data) {
  return request({
    url: '/baseData/qa/finishedFabricPhysicalBrandStandard/add',
    method: 'post',
    data
  })
}

// 修改(基本信息)
export function brandModifyData(data) {
  return request({
    url: '/baseData/qa/finishedFabricPhysicalBrandStandard/modify',
    method: 'post',
    data
  })
}

// 查询详情
export function brandInfo(data) {
  return request({
    url: '/baseData/qa/finishedFabricPhysicalBrandStandard/info',
    method: 'post',
    data
  })
}

// 启用/禁用
export function brandStatusChange(data) {
  return request({
    url: '/baseData/qa/finishedFabricPhysicalBrandStandard/isEnabled',
    method: 'post',
    data
  })
}

// 品牌商下拉
export function brandSelet(data = {}) {
  return request({
    url: '/crm/brand/list',
    method: 'post',
    data: { ...data }
  })
}
// 基础数据-选项配置下拉数据
export function optionConfigSelect(data = {}) {
  return request({
    url: '/basis/api/optionConfig/option',
    method: 'post',
    data: { ...data }
    // ,
    // headers: {
    //   'Content-Type': 'application/json; charset=utf-8',
    //   'spathv': 'product'
    // }

  })
}

// 检测项目-列表
export function checkAgenciesPageData(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/baseData/qa/finishedFabricPhysicalTestItems/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 新增 所属上线下拉选数据
export function checkAgenciesList(data = {}) {
  return request({
    url: '/baseData/qa/finishedFabricPhysicalTestItems/returnSecondaryProject',
    method: 'post',
    data
  })
}

// 检测项目-新增
export function checkAgenciesAddData(data) {
  return request({
    url: '/baseData/qa/finishedFabricPhysicalTestItems/add',
    method: 'post',
    data
  })
}
// 检测项目-新增或取最大值
export function checkAgenciesOrdersMax(data) {
  return request({
    url: '/baseData/qa/finishedFabricPhysicalTestItems/ordersMax',
    method: 'post',
    data
  })
}

// 修改
export function checkAgenciesModifyData(data) {
  return request({
    url: '/baseData/qa/finishedFabricPhysicalTestItems/modify',
    method: 'post',
    data
  })
}

// 查询详情
export function checkAgenciesInfo(data) {
  return request({
    url: '/baseData/qa/finishedFabricPhysicalTestItems/info',
    method: 'post',
    data
  })
}
// 审核
export function checkAgenciesCheckStatus(data) {
  return request({
    url: '/baseData/qa/finishedFabricPhysicalTestItems/check',
    method: 'post',
    data
  })
}
// 启用/禁用
export function checkAgenciesStatusChange(data) {
  return request({
    url: '/baseData/qa/finishedFabricPhysicalTestItems/isEnabled',
    method: 'post',
    data
  })
}
// 删除
export function checkAgenciesDeleteData(data) {
  return request({
    url: '/baseData/qa/finishedFabricPhysicalTestItems/delete',
    method: 'post',
    data
  })
}

// 分页 检测机构
export function testItemsPageData(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/baseData/qa/finishedFabricPhysicalOrganization/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 添加
export function testItemsAddData(data) {
  return request({
    url: '/baseData/qa/finishedFabricPhysicalOrganization/add',
    method: 'post',
    data
  })
}

// 修改
export function testItemsModifyData(data) {
  return request({
    url: '/baseData/qa/finishedFabricPhysicalOrganization/modify',
    method: 'post',
    data
  })
}

// 查询详情
export function testItemsInfo(data) {
  return request({
    url: '/baseData/qa/finishedFabricPhysicalOrganization/info',
    method: 'post',
    data
  })
}

// 启用/禁用
export function testItemsStatusChange(data) {
  return request({
    url: '/baseData/qa/finishedFabricPhysicalOrganization/isEnabled',
    method: 'post',
    data
  })
}
// 审核
export function testItemsCheckStatus(data) {
  return request({
    url: '/baseData/qa/finishedFabricPhysicalOrganization/check',
    method: 'post',
    data
  })
}

// 删除
export function testItemsDeleteData(data) {
  return request({
    url: '/baseData/qa/finishedFabricPhysicalOrganization/delete',
    method: 'post',
    data
  })
}
