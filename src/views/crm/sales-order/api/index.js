import request from '@/utils/request'

// 销售订单分页查询
export function salesOrderPage(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/crm/seller/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 销售订单列表
export function salesOrderList(data) {
  return request({
    url: '/crm/seller/list',
    method: 'post',
    data
  })
}

// 销售订单详情
export function salesOrderInfo(data) {
  return request({
    url: '/crm/seller/info',
    method: 'post',
    data
  })
}

// 销售订单新增
export function salesOrderAdd(data) {
  return request({
    url: '/crm/seller/add',
    method: 'post',
    data
  })
}

// 销售订单删除
export function salesOrderDelete(data) {
  return request({
    url: '/crm/seller/delete',
    method: 'post',
    data
  })
}

// 销售订单修改
export function salesOrderModify(data) {
  return request({
    url: '/crm/seller/modify',
    method: 'post',
    data
  })
}

// 销售订单更改所有人
export function salesOrderModifyFollower(data) {
  return request({
    url: '/crm/seller/modify/follower',
    method: 'post',
    data
  })
}

// 销售订单状态变更
export function salesOrderModifyStatus(data) {
  return request({
    url: '/crm/seller/modify/status',
    method: 'post',
    data
  })
}

// 销售订单查看工艺分析单
// export function salesOrderReport(data) {
//   return request({
//     url: '/crm/seller/report',
//     method: 'post',
//     data
//   })
// }
