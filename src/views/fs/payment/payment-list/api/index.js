import request from '@/utils/request'

// 分页查询付款单列表
export function paymentList(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/finance/payment/application/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 下拉付款账户
export function paymentData(data = {}) {
  return request({
    url: '/finance/payment/account/list',
    method: 'post',
    data: { ...data }
  })
}

// 下拉收款账户
export function receiptData(data = {}) {
  return request({
    url: '/finance/collection/account/list',
    method: 'post',
    data: { ...data }
  })
}

// 下拉费用类型
export function matchData(data = {}) {
  return request({
    url: 'finance/payment/match/list',
    method: 'post',
    data: { ...data }
  })
}

// 付款账户列表导出
export function paymentExport(data = {}) {
  return request({
    url: '/finance/payment/application/export',
    method: 'post',
    data,
    responseType: 'arraybuffer'
  })
}

// 付款账户列表更新
export function paymentModify(data = {}) {
  return request({
    url: '/finance/payment/application/modify',
    method: 'post',
    data
  })
}

// 付款账户详情
export function paymentDetail(data = {}) {
  return request({
    url: '/finance/payment/application/detail',
    method: 'post',
    data
  })
}

