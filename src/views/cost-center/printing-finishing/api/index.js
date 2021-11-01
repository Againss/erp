/*
 * @Descripttion: 印花api
 * @Author: admin
 * @Date: 2021-06-11 10:24:30
 * @LastEditors: admin
 * @LastEditTime: 2021-07-16 11:25:59
 */
import request from '@/utils/request'
// 分页查询列表
export function list(params, pages) {
  return request({
    url: '/costCenter/print/page',
    method: 'post',
    data: { ...params, ...pages }
  })
}
// tab数量
export function count(params) {
  return request({
    url: '/costCenter/print/count',
    method: 'post',
    data: params
  })
}
// 详情
export function printingFinishingDetail(data) {
  return request({
    url: '/costCenter/print/info',
    method: 'post',
    data
  })
}

// 确认价格
export function confirm(data) {
  return request({
    url: `/costCenter/print/confirm`,
    method: 'post',
    data
  })
}
// 修改价格  提交
export function modifyPrice(data) {
  return request({
    url: `/costCenter/print/modifyPrice`,
    method: 'post',
    data
  })
}
// 撤回
export function withdraw(data) {
  return request({
    url: `/costCenter/print/withdraw`,
    method: 'post',
    data
  })
}

