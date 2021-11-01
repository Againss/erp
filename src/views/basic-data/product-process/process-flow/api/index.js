// 工序流程页面API
import request from '@/utils/request'

// 列表
export function processList(data = {}) {
  const defaultParams = { page: 1, pageSize: 20 }
  return request({
    url: '/basis/api/processFlow/index',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 新增
export function processAdd(data) {
  return request({
    url: '/basis/api/processFlow/store',
    method: 'post',
    data
  })
}

// 点击编辑
export function processEdit(data) {
  return request({
    url: '/basis/api/processFlow/show',
    method: 'post',
    data
  })
}

// 更新
export function processUpdate(data) {
  return request({
    url: '/basis/api/processFlow/update',
    method: 'post',
    data
  })
}

// 删除
export function processDelete(data) {
  return request({
    url: '/basis/api/processFlow/destroy',
    method: 'post',
    data
  })
}

// 审核
export function processApprove(data) {
  return request({
    url: '/basis/api/processFlow/approve',
    method: 'post',
    data
  })
}

// 启用禁用
export function processEnabled(data) {
  return request({
    url: '/basis/api/processFlow/enabled',
    method: 'post',
    data
  })
}
