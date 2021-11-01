import request from '@/utils/request'

// 分页查询付款账户列表
export function paymentSList(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/finance/collection/account/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 付款账户列表导出
export function paymentExport(data = {}) {
  return request({
    url: '/finance/collection/account/export',
    method: 'post',
    data,
    responseType: 'arraybuffer'
  })
}

// 导入模板下载
export function paymentExportIn(data = {}) {
  return request({
    url: '/finance/collection/account/template',
    method: 'post',
    data,
    responseType: 'arraybuffer'
  })
}

// 付款账户列表新增
export function paymentAdd(data = {}) {
  return request({
    url: '/finance/collection/account/add',
    method: 'post',
    data
  })
}

// 付款账户列表更新
export function paymentModify(data = {}) {
  return request({
    url: '/finance/collection/account/modify',
    method: 'post',
    data
  })
}

// 付款账户状态
export function paymentStatus(data = {}) {
  return request({
    url: '/finance/collection/account/status',
    method: 'post',
    data
  })
}

// 付款账户详情
export function paymentDetail(data = {}) {
  return request({
    url: '/finance/collection/account/detail',
    method: 'post',
    data
  })
}

