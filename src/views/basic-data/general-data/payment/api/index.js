// 付款条件页面API
import request from '@/utils/request'

// 分页查询付款条件列表
export function paymentPage(data = {}) {
  const defaultParams = { page: 1, pageSize: 20 }
  return request({
    url: '/basis/api/paymentTerms/index',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 新增
export function paymentAdd(data) {
  return request({
    url: '/basis/api/paymentTerms/store',
    method: 'post',
    data
  })
}

// 编辑--详情
export function paymentDetail(data) {
  return request({
    url: '/basis/api/paymentTerms/show',
    method: 'post',
    data
  })
}

// 更新
export function paymentUpdate(data) {
  return request({
    url: '/basis/api/paymentTerms/update',
    method: 'post',
    data
  })
}

// 删除
export function paymentDelete(data) {
  return request({
    url: '/basis/api/paymentTerms/destroy',
    method: 'post',
    data
  })
}

// 审核
export function paymentApprove(data) {
  return request({
    url: '/basis/api/paymentTerms/approve',
    method: 'post',
    data
  })
}

// 启用禁用
export function paymentEnabled(data) {
  return request({
    url: '/basis/api/paymentTerms/enabled',
    method: 'post',
    data
  })
}
