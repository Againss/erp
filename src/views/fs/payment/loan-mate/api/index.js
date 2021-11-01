import request from '@/utils/request'

// 分页查询付款匹配列表
export function paymentList(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/finance/payment/match/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 付款匹配列表导出
export function paymentExport(data = {}) {
  return request({
    url: '/finance/payment/match/export',
    method: 'post',
    data,
    responseType: 'arraybuffer'
  })
}

// 付款匹配列表新增
export function paymentAdd(data = {}) {
  return request({
    url: '/finance/payment/match/add',
    method: 'post',
    data
  })
}

// 付款匹配列表更新
export function paymentModify(data = {}) {
  return request({
    url: '/finance/payment/match/modify',
    method: 'post',
    data
  })
}

// 付款匹配详情
export function paymentDetail(data = {}) {
  return request({
    url: '/finance/payment/match/detail',
    method: 'post',
    data
  })
}

