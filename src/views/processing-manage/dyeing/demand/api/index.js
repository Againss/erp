/*
 * @Descripttion:
 * @Author: admin
 * @Date: 2021-06-01 10:03:07
 * @LastEditors: anthony
 * @LastEditTime: 2021-06-18 13:49:35
 */
import request from '@/utils/request'

// 分页查询列表
export function list(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/processingMgr/pdDyeDemand/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}
// 全部页签数量统计接口
export function count(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/processingMgr/pdDyeDemand/statistics',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}
// 染整需求已排厂列表
export function planList(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/processingMgr/pdDyeDemand/factory/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}
// 已排厂添加弹窗数据
export function getPupList(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/processingMgr/pdDyeDemand/factory/demand',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}
// 待排厂详情
export function getWaitInfo(data = {}) {
  return request({
    url: '/processingMgr/pdDyeDemand/info',
    method: 'post',
    data: { ...data }
  })
}
// 已排厂详情
export function getPlanInfo(data = {}) {
  return request({
    url: '/processingMgr/pdDyeDemand/factory/info',
    method: 'post',
    data: { ...data }
  })
}
// 待排厂提交
export function saveWaitInfo(data = {}) {
  return request({
    url: '/processingMgr/pdDyeDemand/factory/save',
    method: 'post',
    data: { ...data }
  })
}
// 已排厂提交
export function savePlanInfo(data = {}) {
  return request({
    url: '/processingMgr/pdDyeDemand/factory/modify',
    method: 'post',
    data: { ...data }
  })
}

// 染整需求变更排厂校验调拨数量
export function savePlanInfoChecked(data = {}) {
  return request({
    url: '/processingMgr/pdDyeDemand/factory/modify/validate',
    method: 'post',
    data: { ...data }
  })
}
