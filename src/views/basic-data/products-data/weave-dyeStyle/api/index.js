import request from '@/utils/request'

// 织染方式列表、查询
export function sysDataGroupPage(data = {}) {
  const defaultParams = { page: 1, pageSize: 20 }
  return request({
    url: '/basis/api/knitDyes/index',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 新增织染方式
export function sysDataGroupAdd(data) {
  return request({
    url: '/basis/api/knitDyes/store',
    method: 'post',
    data
  })
}

// 修改织染方式
export function sysDataGroupModify(data) {
  return request({
    url: '/basis/api/knitDyes/update',
    method: 'post',
    data
  })
}

// 删除织染方式
export function sysDataGroupDelete(data) {
  return request({
    url: '/basis/api/knitDyes/destroy',
    method: 'post',
    data
  })
}

// 织染方式审核
export function sysDataGroupApprove(data) {
  return request({
    url: '/basis/api/knitDyes/approve',
    method: 'post',
    data
  })
}

// 织染方式启用禁用
export function sysDataGroupEnabled(data) {
  return request({
    url: '/basis/api/knitDyes/enabled',
    method: 'post',
    data
  })
}

// 织染方式详情
export function sysDataGroupDetail(data) {
  return request({
    url: '/basis/api/knitDyes/show',
    method: 'post',
    data
  })
}

// 织造花型、染方式下拉
export function sysDataGroupOption(data) {
  return request({
    url: '/basis/api/fabricationProduceModes/option',
    method: 'post',
    data
  })
}

