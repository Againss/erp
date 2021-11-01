// 港口页面API
import request from '@/utils/request'

// 分页查询港口列表
export function harbourPage(data = {}) {
  const defaultParams = { page: 1, pageSize: 20 }
  return request({
    url: '/basis/api/ports/index',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 编辑--详情
export function harbourDetail(data) {
  return request({
    url: '/basis/api/ports/show',
    method: 'post',
    data
  })
}

// 新增
export function harbourAdd(data) {
  return request({
    url: '/basis/api/ports/store',
    method: 'post',
    data
  })
}

// 更新
export function harbourUpdate(data) {
  return request({
    url: '/basis/api/ports/update',
    method: 'post',
    data
  })
}

// 删除
export function harbourDelete(data) {
  return request({
    url: '/basis/api/ports/destroy',
    method: 'post',
    data
  })
}

// 审核
export function harbourApprove(data) {
  return request({
    url: '/basis/api/ports/approve',
    method: 'post',
    data
  })
}

// 启用禁用
export function harbourEnabled(data) {
  return request({
    url: '/basis/api/ports/enabled',
    method: 'post',
    data
  })
}

// 港口下拉--国家地区下拉
export function harbourSelect(data) {
  return request({
    url: '/basis/api/countries/option',
    method: 'post',
    data
  })
}
