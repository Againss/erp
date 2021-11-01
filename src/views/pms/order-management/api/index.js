import request from '@/utils/request'
// 分页查询列表
export function list(params, pages) {
  return request({
    url: '/pms/purchaseOrder/page',
    method: 'post',
    data: { ...params, ...pages }
  })
}
// tab数量
export function count(params) {
  return request({
    url: '/pms/purchaseOrder/count',
    method: 'post',
    data: params
  })
}
// 明细基本信息
export function info(data) {
  return request({
    url: '/pms/purchaseOrder/info',
    method: 'post',
    data
  })
}
// 明细基本信息
export function revision(code) {
  return request({
    url: '/pms/purchaseOrder/revisionNum/' + code,
    method: 'post'
  })
}
// 采购清单明细分页
export function detailPage(params, pages) {
  const page = pages || {
    pageNum: 1,
    pageSize: 500
  }
  return request({
    url: '/pms/purchaseOrder/billDetail/page',
    method: 'post',
    data: { ...params, ...page }
  })
}
// 采购清单汇总分页
export function billPage(params, pages) {
  const page = pages || {
    pageNum: 1,
    pageSize: 500
  }
  return request({
    url: '/pms/purchaseOrder/bill/page',
    method: 'post',
    data: { ...params, ...page }
  })
}
// 删除
export function del(params) {
  return request({
    url: '/pms/purchaseOrder/delete/' + params,
    method: 'post'
  })
}
// 保存采购订单
export function add(params) {
  return request({
    url: '/pms/purchaseOrder/add',
    method: 'post',
    data: params
  })
}
// 提交采购订单
export function submit(params) {
  return request({
    url: '/pms/purchaseOrder/submit',
    method: 'post',
    data: params
  })
}

// 采购订单变更
export function change(params) {
  return request({
    url: '/pms/purchaseOrder/change',
    method: 'post',
    data: params
  })
}
// 采购进度查看
export function billProgress(params) {
  return request({
    url: '/pms/purchaseOrder/bill/progress/' + params,
    method: 'post'
  })
}
// 撤回订单
export function revoke(params) {
  return request({
    url: '/pms/purchaseOrder/revoke/' + params,
    method: 'post'
  })
}
// 取消订单
export function cancel(params) {
  return request({
    url: '/pms/purchaseOrder/cancel/' + params,
    method: 'post'
  })
}
// 上传
export function upload(key, id) {
  return request({
    url: '/pms/purchaseOrder/upload/' + id,
    method: 'post',
    data: key
  })
}

// 查询供应商
export function getSupplier(params) {
  return request({
    url: '/srm/supplier/info',
    method: 'post',
    data: params
  })
}
// 付款方式
export const getPayMode = (params = {}) => {
  return request({
    method: 'post',
    url: '/srm/payMode/list',
    data: params
  })
}
