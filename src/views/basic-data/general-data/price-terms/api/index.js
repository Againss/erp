// 价格条款页面API
import request from '@/utils/request'

// 分页查询价格条款列表
export function pricePage(data = {}) {
  const defaultParams = { page: 1, pageSize: 20 }
  return request({
    url: '/basis/api/priceTerms/index',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 新增
export function priceAdd(data) {
  return request({
    url: '/basis/api/priceTerms/store',
    method: 'post',
    data
  })
}

// 编辑--详情
export function priceDetail(data) {
  return request({
    url: '/basis/api/priceTerms/show',
    method: 'post',
    data
  })
}

// 更新
export function priceUpdate(data) {
  return request({
    url: '/basis/api/priceTerms/update',
    method: 'post',
    data
  })
}

// 删除
export function priceDelete(data) {
  return request({
    url: '/basis/api/priceTerms/destroy',
    method: 'post',
    data
  })
}

// 审核
export function priceApprove(data) {
  return request({
    url: '/basis/api/priceTerms/approve',
    method: 'post',
    data
  })
}

// 启用禁用
export function priceEnabled(data) {
  return request({
    url: '/basis/api/priceTerms/enabled',
    method: 'post',
    data
  })
}
