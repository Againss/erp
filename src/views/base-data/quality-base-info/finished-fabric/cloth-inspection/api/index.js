import request from '@/utils/request'

// 分页 扣分项目
export function deductPageData(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/baseData/qa/finishedFabricPointsDeductedItems/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}
// 检测项目-新增或取最大值
export function deductOrdersMax(data) {
  return request({
    url: '/baseData/qa/finishedFabricPointsDeductedItems/ordersMax',
    method: 'post',
    data
  })
}

// 添加
export function deductAddData(data) {
  return request({
    url: '/baseData/qa/finishedFabricPointsDeductedItems/add',
    method: 'post',
    data
  })
}

// 修改
export function deductModifyData(data) {
  return request({
    url: '/baseData/qa/finishedFabricPointsDeductedItems/modify',
    method: 'post',
    data
  })
}

// 删除
export function deductDeleteData(data) {
  return request({
    url: '/baseData/qa/finishedFabricPointsDeductedItems/delete',
    method: 'post',
    data
  })
}

// 查询详情
export function deductInfo(data) {
  return request({
    url: '/baseData/qa/finishedFabricPointsDeductedItems/info',
    method: 'post',
    data
  })
}

// 审核
export function deductCheckStatus(data) {
  return request({
    url: '/baseData/qa/finishedFabricPointsDeductedItems/check',
    method: 'post',
    data
  })
}

// 启用/禁用
export function deductStatusChange(data) {
  return request({
    url: '/baseData/qa/finishedFabricPointsDeductedItems/isEnabled',
    method: 'post',
    data
  })
}

// 其它项目接口
// 分页
export function otherPageData(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/baseData/qa/finishedFabricOtherProjects/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}
// 其它项目-新增或取最大值
export function otherOrdersMax(data) {
  return request({
    url: '/baseData/qa/finishedFabricOtherProjects/ordersMax',
    method: 'post',
    data
  })
}
// 添加
export function otherAddData(data) {
  return request({
    url: '/baseData/qa/finishedFabricOtherProjects/add',
    method: 'post',
    data
  })
}

// 修改
export function otherModifyData(data) {
  return request({
    url: '/baseData/qa/finishedFabricOtherProjects/modify',
    method: 'post',
    data
  })
}

// 删除
export function otherDeleteData(data) {
  return request({
    url: '/baseData/qa/finishedFabricOtherProjects/delete',
    method: 'post',
    data
  })
}

// 查询详情
export function otherInfo(data) {
  return request({
    url: '/baseData/qa/finishedFabricOtherProjects/info',
    method: 'post',
    data
  })
}

// 审核
export function otherCheckStatus(data) {
  return request({
    url: '/baseData/qa/finishedFabricOtherProjects/check',
    method: 'post',
    data
  })
}

// 启用/禁用
export function otherStatusChange(data) {
  return request({
    url: '/baseData/qa/finishedFabricOtherProjects/isEnabled',
    method: 'post',
    data
  })
}

// 问题类型接口
// 分页
export function problemPageData(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/baseData/qa/finishedFabricProblemType/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 添加
export function problemAddData(data) {
  return request({
    url: '/baseData/qa/finishedFabricProblemType/add',
    method: 'post',
    data
  })
}

// 修改
export function problemModifyData(data) {
  return request({
    url: '/baseData/qa/finishedFabricProblemType/modify',
    method: 'post',
    data
  })
}

// 删除
export function problemDeleteData(data) {
  return request({
    url: '/baseData/qa/finishedFabricProblemType/delete',
    method: 'post',
    data
  })
}

// 查询详情
export function problemInfo(data) {
  return request({
    url: '/baseData/qa/finishedFabricProblemType/info',
    method: 'post',
    data
  })
}

// 审核
export function problemCheckStatus(data) {
  return request({
    url: '/baseData/qa/finishedFabricPointsDeductedItems/check',
    method: 'post',
    data
  })
}

// 启用/禁用
export function problemStatusChange(data) {
  return request({
    url: '/baseData/qa/finishedFabricPointsDeductedItems/isEnabled',
    method: 'post',
    data
  })
}
