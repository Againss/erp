import request from '@/utils/request'

// 染色类型列表、查询
export function sysDataGroupPage(data = {}) {
  const defaultParams = { page: 1, pageSize: 20 }
  return request({
    url: '/basis/api/dyeType/index',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 新增染色类型
export function sysDataGroupAdd(data) {
  return request({
    url: '/basis/api/dyeType/store',
    method: 'post',
    data
  })
}

// 修改染色类型
export function sysDataGroupModify(data) {
  return request({
    url: `/basis/api/dyeType/update`,
    method: 'post',
    data
  })
}

// 删除染色类型
export function sysDataGroupDelete(data) {
  return request({
    url: `/basis/api/dyeType/destroy`,
    method: 'post',
    data
  })
}

// 染色类型审核
export function sysDataGroupApprove(data) {
  return request({
    url: '/basis/api/dyeType/approve',
    method: 'post',
    data
  })
}

// 染色类型启用禁用
export function sysDataGroupEnabled(data) {
  return request({
    url: '/basis/api/dyeType/enabled',
    method: 'post',
    data
  })
}

// 染色类型详情
export function sysDataGroupDetail(data) {
  return request({
    url: '/basis/api/dyeType/show',
    method: 'post',
    data
  })
}

