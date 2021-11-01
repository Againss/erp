/*
 * @Descripttion: 染整api
 * @Author: admin
 * @Date: 2021-06-11 10:24:30
 * @LastEditors: admin
 * @LastEditTime: 2021-07-13 10:26:16
 */
import request from '@/utils/request'
// 分页查询列表
export function list(params, pages) {
  return request({
    url: '/costCenter/dye/page',
    method: 'post',
    data: { ...params, ...pages }
  })
}
// tab数量
export function count(params) {
  return request({
    url: '/costCenter/dye/count',
    method: 'post',
    data: params
  })
}
// 详情
export function dyeingFinishingDetail(data) {
  return request({
    url: '/costCenter/dye/info',
    method: 'post',
    data
  })
}

// 确认价格
export function confirm(data) {
  return request({
    url: `/costCenter/dye/confirm`,
    method: 'post',
    data
  })
}
// 修改价格  提交
export function modifyPrice(data) {
  return request({
    url: `/costCenter/dye/modifyPrice`,
    method: 'post',
    data
  })
}
// 撤回
export function withdraw(data) {
  return request({
    url: `/costCenter/dye/withdraw`,
    method: 'post',
    data
  })
}

