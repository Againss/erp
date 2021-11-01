/*
 * @Date: 2020-12-31 10:28:46
 * @Author: anthony
 * @LastEditTime: 2021-01-05 09:42:10
 * @LastEditors: anthony
 * @Descripttion: 损耗分类
 */
import request from '@/utils/request'

// 损耗分类列表、查询
export function sysDataGroupPage(data = {}) {
  const defaultParams = { page: 1, pageSize: 20 }
  return request({
    url: '/basis/api/wastageCategory/index',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 新增损耗分类
export function sysDataGroupAdd(data) {
  return request({
    url: '/basis/api/wastageCategory/store',
    method: 'post',
    data
  })
}

// 修改损耗分类
export function sysDataGroupModify(data) {
  return request({
    url: '/basis/api/wastageCategory/update',
    method: 'post',
    data
  })
}

// 删除损耗分类
export function sysDataGroupDelete(data) {
  return request({
    url: '/basis/api/wastageCategory/destroy',
    method: 'post',
    data
  })
}

// 损耗分类审核
export function sysDataGroupApprove(data) {
  return request({
    url: '/basis/api/wastageCategory/approve',
    method: 'post',
    data
  })
}

// 损耗分类启用禁用
export function sysDataGroupEnabled(data) {
  return request({
    url: '/basis/api/wastageCategory/enabled',
    method: 'post',
    data
  })
}

// 损耗分类详情
export function sysDataGroupDetail(data) {
  return request({
    url: '/basis/api/wastageCategory/show',
    method: 'post',
    data
  })
}

