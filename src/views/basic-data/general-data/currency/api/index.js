// 币别页面API
import request from '@/utils/request'

// 分页查询--币别搜索
export function currencySearch(data = {}) {
  const defaultParams = { page: 1, pageSize: 20 }
  return request({
    url: '/basis/api/currencies/index',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 编辑--详情
export function currencyDetail(data) {
  return request({
    url: '/basis/api/currencies/show',
    method: 'post',
    data
  })
}

// 新增
export function currencyAdd(data) {
  return request({
    url: '/basis/api/currencies/store',
    method: 'post',
    data
  })
}

// 更新
export function currencyUpdate(data) {
  return request({
    url: '/basis/api/currencies/update',
    method: 'post',
    data
  })
}

// 删除
export function currencyDelete(data) {
  return request({
    url: '/basis/api/currencies/destroy',
    method: 'post',
    data
  })
}

// 审核
export function currencyApprove(data) {
  return request({
    url: '/basis/api/currencies/approve',
    method: 'post',
    data
  })
}

// 启用禁用
export function currencyEnabled(data) {
  return request({
    url: '/basis/api/currencies/enabled',
    method: 'post',
    data
  })
}
