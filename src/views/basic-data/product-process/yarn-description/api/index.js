// 纱长描述页面API
import request from '@/utils/request'

// 列表
export function yarnList(data = {}) {
  const defaultParams = { page: 1, pageSize: 20 }
  return request({
    url: '/basis/api/YarnLengthDescription/index',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 新增
export function yarnAdd(data) {
  return request({
    url: '/basis/api/YarnLengthDescription/store',
    method: 'post',
    data
  })
}

// 点击编辑
export function yarnEdit(data) {
  return request({
    url: '/basis/api/YarnLengthDescription/show',
    method: 'post',
    data
  })
}

// 更新
export function yarnUpdate(data) {
  return request({
    url: '/basis/api/YarnLengthDescription/update',
    method: 'post',
    data
  })
}

// 删除
export function yarnDelete(data) {
  return request({
    url: '/basis/api/YarnLengthDescription/destroy',
    method: 'post',
    data
  })
}

// 审核
export function yarnApprove(data) {
  return request({
    url: '/basis/api/YarnLengthDescription/approve',
    method: 'post',
    data
  })
}

// 启用禁用
export function yarnEnabled(data) {
  return request({
    url: '/basis/api/YarnLengthDescription/enabled',
    method: 'post',
    data
  })
}
