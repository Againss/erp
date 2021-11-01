import request from '@/utils/request'

// 对色光源列表、查询
export function sysDataGroupPage(data = {}) {
  const defaultParams = { page: 1, pageSize: 20 }
  return request({
    url: '/basis/api/lightSources/index',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 新增对色光源
export function sysDataGroupAdd(data) {
  return request({
    url: '/basis/api/lightSources/store',
    method: 'post',
    data
  })
}

// 修改对色光源
export function sysDataGroupModify(data) {
  return request({
    url: '/basis/api/lightSources/update',
    method: 'post',
    data
  })
}

// 删除对色光源
export function sysDataGroupDelete(data) {
  return request({
    url: '/basis/api/lightSources/destroy',
    method: 'post',
    data
  })
}

// 对色光源审核
export function sysDataGroupApprove(data) {
  return request({
    url: '/basis/api/lightSources/approve',
    method: 'post',
    data
  })
}

// 对色光源启用禁用
export function sysDataGroupEnabled(data) {
  return request({
    url: '/basis/api/lightSources/enabled',
    method: 'post',
    data
  })
}

// 对色光源详情
export function sysDataGroupDetail(data) {
  return request({
    url: '/basis/api/lightSources/show',
    method: 'post',
    data
  })
}

