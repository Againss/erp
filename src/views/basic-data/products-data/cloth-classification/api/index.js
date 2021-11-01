import request from '@/utils/request'

// 布类列表、查询
export function sysDataGroupPage(data = {}) {
  const defaultParams = { page: 1, pageSize: 20 }
  return request({
    url: '/basis/api/cloths/index',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 新增布类
export function sysDataGroupAdd(data) {
  return request({
    url: '/basis/api/cloths/store',
    method: 'post',
    data
  })
}

// 修改布类
export function sysDataGroupModify(data) {
  return request({
    url: '/basis/api/cloths/update',
    method: 'post',
    data
  })
}

// 删除布类
export function sysDataGroupDelete(data) {
  return request({
    url: '/basis/api/cloths/destroy',
    method: 'post',
    data
  })
}

// 布类审核
export function sysDataGroupApprove(data) {
  return request({
    url: '/basis/api/cloths/approve',
    method: 'post',
    data
  })
}

// 布类启用禁用
export function sysDataGroupEnabled(data) {
  return request({
    url: '/basis/api/cloths/enabled',
    method: 'post',
    data
  })
}

// 布类详情
export function sysDataGroupDetail(data) {
  return request({
    url: '/basis/api/cloths/show',
    method: 'post',
    data
  })
}

// 织染方式下拉
export function weaveDyeOption(data) {
  return request({
    url: '/basis/api/knitDyes/index',
    method: 'post',
    data
  })
}

// 布种下拉
export function dyeOption(data) {
  return request({
    url: '/basis/api/fabrications/option',
    method: 'post',
    data
  })
}
