import request from '@/utils/request'

// 面料大类列表、查询
export function sysDataGroupPage(data = {}) {
  const defaultParams = { page: 1, pageSize: 20 }
  return request({
    url: '/basis/api/fabricCategory/index',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 新增面料大类
export function sysDataGroupAdd(data) {
  return request({
    url: '/basis/api/fabricCategory/store',
    method: 'post',
    data
  })
}

// 修改面料大类
export function sysDataGroupModify(data) {
  return request({
    url: '/basis/api/fabricCategory/update',
    method: 'post',
    data
  })
}

// 删除面料大类
export function sysDataGroupDelete(data) {
  return request({
    url: '/basis/api/fabricCategory/destroy',
    method: 'post',
    data
  })
}

// 面料大类下拉
export function bussinessBillList(data) {
  return request({
    url: '/basis/api/fabricCategory/option',
    method: 'post',
    data
  })
}

// 面料大类审核
export function sysDataGroupApprove(data) {
  return request({
    url: '/basis/api/fabricCategory/approve',
    method: 'post',
    data
  })
}

// 面料大类启用禁用
export function sysDataGroupEnabled(data) {
  return request({
    url: '/basis/api/fabricCategory/enabled',
    method: 'post',
    data
  })
}

// 面料大类详情
export function sysDataGroupDetail(data) {
  return request({
    url: '/basis/api/fabricCategory/show',
    method: 'post',
    data
  })
}
