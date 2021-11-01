/*
 * @Date: 2021-06-04 08:52:21
 * @Author: anthony
 * @LastEditTime: 2021-06-21 08:51:05
 * @LastEditors: anthony
 * @Descripttion:
 */
import request from '@/utils/request'
// 分页查询
export function list(data = {}) {
  return request({
    url: '/processingMgr/pdPrintAllotDetail/page',
    method: 'post',
    data: data
  })
}
// 详情
export function info(data = {}) {
  return request({
    url: '/processingMgr/pdPrintAllotDetail/info',
    method: 'post',
    data: data
  })
}

// 统计
export function count(data = {}) {
  return request({
    url: '/processingMgr/pdPrintAllotDetail/statistics',
    method: 'post',
    data: data
  })
}

// 撤回
export function recall(data = {}) {
  return request({
    url: '/processingMgr/pdPrintAllotDetail/recall',
    method: 'post',
    data: data
  })
}

// 取消
export function cancel(data = {}) {
  return request({
    url: '/processingMgr/pdPrintAllotDetail/cancel',
    method: 'post',
    data: data
  })
}

// 提交
export function submit(data = {}) {
  return request({
    url: '/processingMgr/pdPrintAllotDetail/submit',
    method: 'post',
    data: data
  })
}
// 修改原料调拨单
export function allotConfirm(data = {}) {
  return request({
    url: '/processingMgr/pdPrintAllotDetail/modify',
    method: 'post',
    data: data
  })
}

