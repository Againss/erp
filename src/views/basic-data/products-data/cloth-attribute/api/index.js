import request from '@/utils/request'

// 布种分类列表、查询
export function typePageList(data = {}) {
  const defaultParams = { page: 1, pageSize: 20 }
  return request({
    url: '/basis/api/clothCategory/index',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 新增布种分类
export function typeListAdd(data) {
  return request({
    url: '/basis/api/clothCategory/store',
    method: 'post',
    data
  })
}

// 修改布种分类
export function typeListUpdate(data) {
  return request({
    url: '/basis/api/clothCategory/update',
    method: 'post',
    data
  })
}

// 删除布种分类
export function typeListDelete(data) {
  return request({
    url: '/basis/api/clothCategory/destroy',
    method: 'post',
    data
  })
}

// 布种分类审核
export function typeListApprove(data) {
  return request({
    url: '/basis/api/clothCategory/approve',
    method: 'post',
    data
  })
}

// 布种分类启用禁用
export function typeListEnabled(data) {
  return request({
    url: '/basis/api/clothCategory/enabled',
    method: 'post',
    data
  })
}

// 布种分类详情
export function typeListDetail(data) {
  return request({
    url: '/basis/api/clothCategory/show',
    method: 'post',
    data
  })
}

// 布种列表、查询
export function clothPageList(data = {}) {
  const defaultParams = { page: 1, pageSize: 20 }
  return request({
    url: '/basis/api/fabrications/index',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 新增布种
export function clothListAdd(data) {
  return request({
    url: '/basis/api/fabrications/store',
    method: 'post',
    data
  })
}

// 修改布种
export function clothListUpdate(data) {
  return request({
    url: '/basis/api/fabrications/update',
    method: 'post',
    data
  })
}

// 删除布种
export function clothListDelete(data) {
  return request({
    url: '/basis/api/fabrications/destroy',
    method: 'post',
    data
  })
}

// 布种审核
export function clothListApprove(data) {
  return request({
    url: '/basis/api/fabrications/approve',
    method: 'post',
    data
  })
}

// 布种启用禁用
export function clothListEnabled(data) {
  return request({
    url: '/basis/api/fabrications/enabled',
    method: 'post',
    data
  })
}

// 布种详情
export function clothListDetail(data) {
  return request({
    url: '/basis/api/fabrications/show',
    method: 'post',
    data
  })
}

// 织造花型和染方式列表、查询
export function sysDataGroupPage(data = {}) {
  const defaultParams = { page: 1, pageSize: 20 }
  return request({
    url: '/basis/api/fabricationProduceModes/index',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 新增织造花型和染方式
export function sysDataGroupAdd(data) {
  return request({
    url: '/basis/api/fabricationProduceModes/store',
    method: 'post',
    data
  })
}

// 修改织造花型和染方式
export function sysDataGroupModify(data) {
  return request({
    url: '/basis/api/fabricationProduceModes/update',
    method: 'post',
    data
  })
}

// 删除织造花型和染方式
export function sysDataGroupDelete(data) {
  return request({
    url: '/basis/api/fabricationProduceModes/destroy',
    method: 'post',
    data
  })
}

// 织造花型和染方式审核
export function sysDataGroupApprove(data) {
  return request({
    url: '/basis/api/fabricationProduceModes/approve',
    method: 'post',
    data
  })
}

// 织造花型和染方式启用禁用
export function sysDataGroupEnabled(data) {
  return request({
    url: '/basis/api/fabricationProduceModes/enabled',
    method: 'post',
    data
  })
}

// 布种详情
export function sysDataGroupDetail(data) {
  return request({
    url: '/basis/api/fabricationProduceModes/show',
    method: 'post',
    data
  })
}

// 布种分类下拉
export function clothCategoryOption(data) {
  return request({
    url: '/basis/api/clothCategory/option',
    method: 'post',
    data
  })
}
