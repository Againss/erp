/*
 * @Descripttion:
 * @Author: admin
 * @Date: 2021-03-04 14:03:07
 * @LastEditors: anthony
 * @LastEditTime: 2021-06-16 17:31:38
 */
import request from '@/utils/request'

// 分页查询列表
// 印花需求全部与未排厂列表 status 状态 N未排厂
export function list(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/processingMgr/pdPrintDemand/page',
    // url: 'mock/240/processingMgr/pdPrintDemand/list',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}
// 分页查询列表 ==》全部页签 待排厂 数量统计接口
export function listCom(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/processingMgr/pdPrintDemand/statistics',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}
// 印花需求已排厂列表
export function planList(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/processingMgr/pdPrintDemand/factory/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 已排厂添加弹窗数据
export function getPupList(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/processingMgr/pdPrintDemand/factory/demand',
    // url: 'mock/240/processingMgr/pdPrintDemand/list',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}
// 待排厂详情
export function getWaitInfo(data = {}) {
  return request({
    url: '/processingMgr/pdPrintDemand/info',
    // url: 'mock/240/processingMgr/pdPrintDemand/info',
    method: 'post',
    data: { ...data }
  })
}
// 已排厂详情
export function getPlanInfo(data = {}) {
  return request({
    // url: 'mock/240/processingMgr/pdPrintDemand/factory/info',
    url: '/processingMgr/pdPrintDemand/factory/info',
    method: 'post',
    data: { ...data }
  })
}
// 待排厂提交
export function saveWaitInfo(data = {}) {
  return request({
    // url: 'mock/240/processingMgr/pdPrintDemand/factory/save',
    url: '/processingMgr/pdPrintDemand/factory/save',
    method: 'post',
    data: { ...data }
  })
}
// 已排厂提交
export function savePlanInfo(data = {}) {
  return request({
    // url: 'mock/240/processingMgr/pdPrintDemand/modify',
    url: '/processingMgr/pdPrintDemand/factory/modify',
    method: 'post',
    data: { ...data }
  })
}
// 印花需求变更排厂校验调拨数量
export function savePlanInfoChecked(data = {}) {
  return request({
    url: '/processingMgr/pdPrintDemand/factory/modify/validate',
    method: 'post',
    data: { ...data }
  })
}

