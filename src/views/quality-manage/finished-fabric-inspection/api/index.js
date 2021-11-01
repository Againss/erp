
import request from '@/utils/request'

// 成品验布-分页查询
export function pageList(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 10 }
  return request({
    url: '/qa/qaFinishFabricInspectionTask/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}
// 成品验布-每个分组对应的数量
export function pageCount(data = {}) {
  return request({
    url: '/qa/qaFinishFabricInspectionTask/countAllStatuses',
    method: 'post',
    data: data
  })
}

// 成品验布-指派
export function qaFinishBatchColorAssign(data = {}) {
  return request({
    url: '/qa/qaFinishFabricInspectionTask/assign',
    method: 'post',
    data: data
  })
}

// 成品验布-指派-下拉框数据源
export function outworkerList(data = {}) {
  return request({
    url: '/sysSettings/task/outworker/condition/list',
    method: 'post',
    data: data
  })
}

// 获取所有的员工
export function getAllUser(data = {}) {
  return request({
    url: '/userCenter/sysUser/list',
    method: 'post',
    data: data
  })
}
