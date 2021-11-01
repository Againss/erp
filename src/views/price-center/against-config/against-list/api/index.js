// 页面API
import request from '@/utils/request'

// 分页查询列表
export function exchangeRatePage(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/priceCenter/exchangeRate/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 新增
export function exchangeRateAdd(data) {
  return request({
    url: '/priceCenter/exchangeRate/add',
    method: 'post',
    data
  })
}

// 编辑--详情
export function exchangeRateDetail(data) {
  return request({
    url: '/priceCenter/exchangeRate/info',
    method: 'post',
    data
  })
}

// 修改
export function exchangeRateModify(data) {
  return request({
    url: '/priceCenter/exchangeRate/modify',
    method: 'post',
    data
  })
}

// 删除
export function exchangeRateDelete(data) {
  return request({
    url: '/priceCenter/exchangeRate/delete',
    method: 'post',
    data
  })
}

// 启用禁用
export function exchangeRateEnabled(data) {
  return request({
    url: '/priceCenter/exchangeRate/status',
    method: 'post',
    data
  })
}

