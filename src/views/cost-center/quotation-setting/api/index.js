/*
 * @Descripttion: 报价设置api
 * @Author: admin
 * @Date: 2021-07-08 16:21:46
 * @LastEditors: admin
 * @LastEditTime: 2021-07-14 10:23:09
 */
import request from '@/utils/request'

// 分页查询列表
export function list(params, pages) {
  return request({
    url: '/costCenter/offer/page',
    method: 'post',
    data: { ...params, ...pages }
  })
}

// 批量设置
export function batchSet(data) {
  return request({
    url: '/costCenter/offer/batchSet',
    method: 'post',
    data
  })
}

// 设置
export function set(data) {
  return request({
    url: '/costCenter/offer/set',
    method: 'post',
    data
  })
}
