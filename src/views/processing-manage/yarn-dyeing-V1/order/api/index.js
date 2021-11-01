/*
 * @Descripttion:染纱订单
 * @Author: admin
 * @Date: 2021-03-04 14:03:07
 * @LastEditors: OBKoro1
 * @LastEditTime: 2021-06-21 16:57:33
 */
import request from '@/utils/request'

// 分页查询列表
export function list(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/processingMgr/pdDyeingOrder/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 列表各个状态数量
export function orderStatusNum(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/processingMgr/pdDyeingOrder/AllCountsGroupByStatus',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 染纱订单详情信息
export function orderInfo(data = {}) {
  return request({
    url: '/processingMgr/pdDyeingOrder/info',
    method: 'post',
    data: { ...data }
  })
}

// 染纱订单提交
export function orderSubmit(data = {}) {
  return request({
    url: '/processingMgr/pdDyeingOrder/submit',
    method: 'post',
    data: { ...data }
  })
}

// 染纱订单变更
export function orderChange(data = {}) {
  return request({
    url: '/processingMgr/pdDyeingOrder/update',
    method: 'post',
    data: { ...data }
  })
}

// 已提交-原料调拨列表 染纱订单
export function TransferList(data = {}) {
  return request({
    url: '/processingMgr/pdDyeingOrder/material/detail/list',
    method: 'post',
    data: { ...data }
  })
}

// 已提交-生成原料调拨通知单 染纱订单
export function TransferNotice(data = {}) {
  return request({
    url: '/processingMgr/pdDyeingOrder/material/detail/submit',
    method: 'post',
    data: { ...data }
  })
}

// 染纱订单 撤回
export function orderWithdrawt(data = {}) {
  return request({
    url: '/processingMgr/pdDyeingOrder/withdraw',
    method: 'post',
    data: { ...data }
  })
}

// 染纱订单 取消
export function orderCancel(data = {}) {
  return request({
    url: '/processingMgr/pdDyeingOrder/cancel',
    method: 'post',
    data: { ...data }
  })
}

// 染纱订单完结
export function orderFinish(data = {}) {
  return request({
    url: '/processingMgr/pdDyeingOrder/finish',
    method: 'post',
    data: { ...data }
  })
}

// 下载文件 新
export function downFile(data = {}) {
  return request({
    url: `/common/file/download/${data}`,
    responseType: 'arraybuffer',
    method: 'get',
    params: {}
  })
}

// 详情文件展示
export function fileListArray(data = {}) {
  const defaultParams = { 'bizType': 'ORDER' }
  return request({
    url: '/common/file/list',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 待排厂-需求详情
export function WaitingPlant(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/processingMgr/pdDyeingDemand/detail/list',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 打印
export function print(data = {}) {
  return request({
    url: '/processingMgr/pdDyeingOrder/info/print',
    method: 'post',
    data: data
  })
}

