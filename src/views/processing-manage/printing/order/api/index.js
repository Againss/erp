/*
 * @Date: 2021-06-04 08:52:21
 * @Author: anthony
 * @LastEditTime: 2021-07-06 09:49:51
 * @LastEditors: anthony
 * @Descripttion:
 */
import request from '@/utils/request'
// 分页查询
export function list(data = {}) {
  return request({
    url: '/processingMgr/pdPrintOrder/page',
    method: 'post',
    data: data
  })
}
// 数量统计查询
export function listTotal(data = {}) {
  return request({
    url: '/processingMgr/pdPrintOrder/statistics',
    method: 'post',
    data: data
  })
}
// 详情
export function info(data = {}) {
  return request({
    // url: '/processingMgr/pdPrintOrder/info',
    url: '/processingMgr/pdPrintOrder/versionInfo',
    method: 'post',
    data: data
  })
}
// 提交
export function save(data = {}) {
  return request({
    url: '/processingMgr/pdPrintOrder/submit',
    method: 'post',
    data: data
  })
}
// 回撤
export function reBack(data = {}) {
  return request({
    url: '/processingMgr/pdPrintOrder/recall',
    method: 'post',
    data: data
  })
}
// 完工
export function finish(data = {}) {
  return request({
    url: '/processingMgr/pdPrintOrder/finish',
    method: 'post',
    data: data
  })
}
// 取消
export function closeFlag(data = {}) {
  return request({
    url: '/processingMgr/pdPrintOrder/cancel',
    method: 'post',
    data: data
  })
}

// 织订单-原料调拨通知
export function allot(data = {}) {
  return request({
    url: '/processingMgr/pdPrintAllotDetail/details',
    method: 'post',
    data: data
  })
}
// 织订单-原料调拨确认
export function allotConfirm(data = {}) {
  return request({
    url: '/processingMgr/pdPrintAllotDetail/save',
    method: 'post',
    data: data
  })
}
// 打印页面数据
export function getprintDetail(data = {}) {
  return request({
    url: '/processingMgr/pdPrintOrder/info/print',
    method: 'post',
    data: data
  })
}
