/*
 * @Descripttion:原纱调拨通知单
 * @Author: admin
 * @Date: 2021-03-04 14:03:07
 * @LastEditors: OBKoro1
 * @LastEditTime: 2021-06-11 10:42:08
 */
import request from '@/utils/request'

// 分页查询列表
export function list(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/processingMgr/pdDyeingAllotNotify/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 列表各个状态数量
export function orderStatusNum(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/processingMgr/pdDyeingAllotNotify/AllCountsGroupByStatus',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 原纱调拨 详情信息
export function orderInfo(data = {}) {
  return request({
    url: '/processingMgr/pdDyeingAllotNotify/info',
    method: 'post',
    data: { ...data }
  })
}

// 原纱调拨 变更
export function orderChange(data = {}) {
  return request({
    url: '/processingMgr/pdDyeingAllotNotify/update',
    method: 'post',
    data: { ...data }
  })
}

// 原纱调拨 提交
export function orderSubmit(data = {}) {
  return request({
    url: '/processingMgr/pdDyeingAllotNotify/submit',
    method: 'post',
    data: { ...data }
  })
}

// 原纱调拨 撤回
export function orderWithdrawt(data = {}) {
  return request({
    url: '/processingMgr/pdDyeingAllotNotify/withdraw',
    method: 'post',
    data: { ...data }
  })
}

// 原纱调拨 取消
export function orderCancel(data = {}) {
  return request({
    url: '/processingMgr/pdDyeingAllotNotify/cancel',
    method: 'post',
    data: { ...data }
  })
}
