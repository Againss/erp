import request from '@/utils/request'
// 分页查询列表
export function list(params, pages) {
  return request({
    url: '/pms/inquiry/page',
    method: 'post',
    data: { ...params, ...pages }
  })
}
// tab数量
export function count(params) {
  return request({
    url: 'pms/inquiry/count',
    method: 'post',
    data: params
  })
}
// 生成询价单
export function creat(params) {
  return request({
    url: '/pms/inquiry/add',
    method: 'post',
    data: params
  })
}
// 明细基本信息
export function info(id) {
  return request({
    url: '/pms/inquiry/info/' + id,
    method: 'post'
  })
}
// 询价清单明细分页
export function detailPage(params) {
  return request({
    url: `pms/inquiry/info/${params.code}/bomDetail`,
    method: 'post'
  })
}
// 询价清单汇总分页
export function billPagexq(params) {
  return request({
    url: `/pms/inquiry/info/${params.code}/bom`,
    method: 'post'
  })
}
// 询价报价汇总分页
export function billPagegys(params) {
  return request({
    url: `/pms/inquiry/info/${params.code}/quotation`,
    method: 'post'
  })
}
// 提交报价
export function submitQuote(params) {
  return request({
    url: `/pms/inquiry/quote/${params.code}`,
    method: 'post',
    data: params.data
  })
}

// 完成报价
export function complete(params) {
  return request({
    url: `/pms/inquiry/complete/${params}`,
    method: 'post'
  })
}
// 删除
export function del(params) {
  return request({
    url: '/pms/inquiry/delete/' + params,
    method: 'post'
  })
}
// 保存询价订单
export function add(params) {
  return request({
    url: '/pms/inquiry/add',
    method: 'post',
    data: params
  })
}
// 提交询价订单
export function submit(params, id) {
  return request({
    url: '/pms/inquiry/modify/' + id,
    method: 'post',
    data: params
  })
}
// 取消订单
export function cancel(params) {
  return request({
    url: '/pms/inquiry/cancel/' + params,
    method: 'post'
  })
}

// 下载报价单
export function download(id) {
  return request({
    url: '/pms/inquiry/download/' + id,
    method: 'get',
    responseType: 'arraybuffer'
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
