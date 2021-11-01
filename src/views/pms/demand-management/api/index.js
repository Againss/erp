import request from '@/utils/request'

// 分页查询列表
export function list(params, pages) {
  return request({
    url: '/pms/purchaseDemand/page',
    method: 'post',
    data: { ...params, ...pages }
  })
}
// tab数量
export function count(params) {
  return request({
    url: '/pms/purchaseDemand/count',
    method: 'post',
    data: params
  })
}
