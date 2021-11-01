
import request from '@/utils/request'

// 成品批色-分页列表
export function pageList(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 10 }
  return request({
    url: '/qa/qaFinishBatchColor/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}
// 成品批色-每个分组对应的数量
export function pageCount(data = {}) {
  return request({
    url: '/qa/qaFinishBatchColor/countAllStatuses',
    method: 'post',
    data: data
  })
}
// 成品批色-指派
export function qaFinishBatchColorAssign(data = {}) {
  return request({
    url: '/qa/qaFinishBatchColor/assign',
    method: 'post',
    data: data
  })
}
// 成品批色-无需权限指派
export function qaFinishBatchColorAssignNoAuth(data = {}) {
  return request({
    url: '/qa/qaFinishBatchColor/assignNoAuth',
    method: 'post',
    data: data
  })
}

// 成品批色-指派-下拉框数据源
export function outworkerList(data = {}) {
  return request({
    url: '/sysSettings/task/outworker/condition/list',
    method: 'post',
    data: data
  })
}

// 染印厂下拉框数据
export function getfactoryNamesList(data = {}) {
  const defaultParams = { isEnabled: '1', supplierCategory: 1, supplierTypeList: ['10001', '10004'] }
  return request({
    url: '/srm/supplier/searchList',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}
