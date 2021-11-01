/*
 * @Date: 2021-03-15 10:35:46
 * @Author: anthony
 * @LastEditTime: 2021-03-15 13:51:06
 * @LastEditors: anthony
 * @Descripttion:
 */
// 工序流程页面API
import request from '@/utils/request'

// 列表
export function processList(data = {}) {
  const defaultParams = { page: 1, pageSize: 20 }
  return request({
    url: '/basis/api/softMethod/index',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 新增
export function processAdd(data) {
  return request({
    url: '/basis/api/softMethod/store',
    method: 'post',
    data
  })
}

// 点击编辑
export function processEdit(data) {
  return request({
    url: '/basis/api/softMethod/show',
    method: 'post',
    data
  })
}

// 更新
export function processUpdate(data) {
  return request({
    url: '/basis/api/softMethod/update',
    method: 'post',
    data
  })
}

// 删除
export function processDelete(data) {
  return request({
    url: '/basis/api/softMethod/destroy',
    method: 'post',
    data
  })
}

// 审核
export function processApprove(data) {
  return request({
    url: '/basis/api/softMethod/approve',
    method: 'post',
    data
  })
}

// 启用禁用
export function processEnabled(data) {
  return request({
    url: '/basis/api/softMethod/enabled',
    method: 'post',
    data
  })
}
