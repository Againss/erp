/**
 *
 * @typical MY:毛羽,MQ:毛圈,SG:手感,MX:毛效,XSX:吸水性,TX:弹性
 */

import request from '@/utils/request'

// 成品布面效果列表、查询
export function sysDataGroupPage(data = {}) {
  const defaultParams = { page: 1, pageSize: 20 }
  return request({
    url: '/basis/api/finishedFabric/index',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 新增成品布面效果
export function sysDataGroupAdd(data) {
  return request({
    url: '/basis/api/finishedFabric/store',
    method: 'post',
    data
  })
}

// 修改成品布面效果
export function sysDataGroupUpdate(data) {
  return request({
    url: '/basis/api/finishedFabric/update',
    method: 'post',
    data
  })
}

// 删除成品布面效果
export function sysDataGroupDelete(data) {
  return request({
    url: '/basis/api/finishedFabric/destroy',
    method: 'post',
    data
  })
}

// 审核成品布面效果
export function sysDataGroupApprove(data) {
  return request({
    url: '/basis/api/finishedFabric/approve',
    method: 'post',
    data
  })
}

// 成品布面效果启用、禁用
export function sysDataGroupEnabled(data) {
  return request({
    url: '/basis/api/finishedFabric/enabled',
    method: 'post',
    data
  })
}

// 成品布面效果详情
export function sysDataGroupDetail(data) {
  return request({
    url: '/basis/api/finishedFabric/show',
    method: 'post',
    data
  })
}

// 所属上级下拉
export function sysDataGroupOption(data) {
  return request({
    url: '/basis/api/finishedFabric/option',
    method: 'post',
    data
  })
}
