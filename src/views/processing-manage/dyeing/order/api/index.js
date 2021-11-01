/*
 * @Descripttion:
 * @Author: hzq
 * @Date: 2021-06-01 10:03:07
 * @LastEditors: anthony
 * @LastEditTime: 2021-06-21 11:01:18
 */
import request from '@/utils/request'

// 染整订单-分页查询
export function list(data = {}) {
  return request({
    url: '/processingMgr/pdDyeOrder/page',
    method: 'post',
    data: data
  })
}

// 数量统计查询
export function count(data = {}) {
  return request({
    url: '/processingMgr/pdDyeOrder/statistics',
    method: 'post',
    data: data
  })
}

// 染整订单-明细详情信息
export function info(data = {}) {
  return request({
    url: '/processingMgr/pdDyeOrder/versionInfo',
    // url: '/processingMgr/pdDyeOrder/info',
    method: 'post',
    data: data
  })
}

// 染整订单-提交
export function submit(data = {}) {
  return request({
    url: '/processingMgr/pdDyeOrder/submit',
    method: 'post',
    data: data
  })
}

// 染整订单-（已提交-撤回）
export function withdraw(data = {}) {
  return request({
    url: '/processingMgr/pdDyeOrder/recall',
    method: 'post',
    data: data
  })
}

// 染整订单-（已提交-取消）
export function cancel(data = {}) {
  return request({
    url: '/processingMgr/pdDyeOrder/cancel',
    method: 'post',
    data: data
  })
}

// 染整订单-（已提交-完工）
export function finish(data = {}) {
  return request({
    url: '/processingMgr/pdDyeOrder/finish',
    method: 'post',
    data: data
  })
}

// 染整订单-原料调拨通知
export function allot(data = {}) {
  return request({
    url: '/processingMgr/pdDyeAllotNotice/details',
    method: 'post',
    data: data
  })
}
// 染整订单-原料调拨确认
export function allotConfirm(data = {}) {
  return request({
    url: '/processingMgr/pdDyeAllotNotice/save',
    method: 'post',
    data: data
  })
}

export function getprintDetail(data = {}) {
  return request({
    url: '/processingMgr/pdDyeOrder/print',
    method: 'post',
    data
  })
}
