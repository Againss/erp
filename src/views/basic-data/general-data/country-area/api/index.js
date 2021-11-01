// 国家/地区页面API
import request from '@/utils/request'

// 分页查询国家/地区列表
export function countryPage(data = {}) {
  const defaultParams = { page: 1, pageSize: 20 }
  return request({
    url: '/basis/api/countries/index',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 新增
export function countryAdd(data) {
  return request({
    url: '/basis/api/countries/store',
    method: 'post',
    data
  })
}

// 编辑--详情
export function countryDetail(data) {
  return request({
    url: '/basis/api/countries/show',
    method: 'post',
    data
  })
}

// 更新
export function countryUpdate(data) {
  return request({
    url: '/basis/api/countries/update',
    method: 'post',
    data
  })
}

// 删除
export function countryDelete(data) {
  return request({
    url: '/basis/api/countries/destroy',
    method: 'post',
    data
  })
}

// 审核
export function countryApprove(data) {
  return request({
    url: '/basis/api/countries/approve',
    method: 'post',
    data
  })
}

// 启用禁用
export function countryEnabled(data) {
  return request({
    url: '/basis/api/countries/enabled',
    method: 'post',
    data
  })
}
