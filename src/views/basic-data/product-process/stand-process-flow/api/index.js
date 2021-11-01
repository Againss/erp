/*
 * @Author: Sanmao
 * @Date: 2021-05-21 10:20:50
 * @LastEditors: Sanmao
 * @LastEditTime: 2021-05-22 16:41:58
 * @Descripttion: 标准工序流程页面API
 */

import request from '@/utils/request'

// 分页查询
export function standProcessFlowList(data = {}) {
  const defaultParams = { page: 1, pageSize: 20 }
  return request({
    url: '/basis/api/standardProcessFlow/index',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 新增
export function standProcessFlowAdd(data) {
  return request({
    url: '/basis/api/standardProcessFlow/store',
    method: 'post',
    data
  })
}

// 编辑
export function standProcessFlowEdit(data) {
  return request({
    url: '/basis/api/standardProcessFlow/show',
    method: 'post',
    data
  })
}

// 更新
export function standProcessFlowUpdate(data) {
  return request({
    url: '/basis/api/standardProcessFlow/update',
    method: 'post',
    data
  })
}

// 删除
export function standProcessFlowDelete(data) {
  return request({
    url: '/basis/api/standardProcessFlow/destroy',
    method: 'post',
    data
  })
}

// 审核
export function standProcessFlowApprove(data) {
  return request({
    url: '/basis/api/standardProcessFlow/approve',
    method: 'post',
    data
  })
}

// 启用禁用
export function standProcessFlowEnabled(data) {
  return request({
    url: '/basis/api/standardProcessFlow/enabled',
    method: 'post',
    data
  })
}
// 染整类型下拉
export function selectData(url, data) {
  return request({
    method: 'post',
    url,
    data
  })
}
