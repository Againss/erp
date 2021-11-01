/*
 * @Descripttion:
 * @Author: admin
 * @Date: 2021-03-04 14:03:07
 * @LastEditors: OBKoro1
 * @LastEditTime: 2021-06-21 13:40:27
 */
import request from '@/utils/request'

// 分页查询列表 全部页签 待排厂
export function list(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/processingMgr/pdDyeingDemand/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 分页查询列表 ==》全部页签 待排厂 数量统计接口
export function listCom(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/processingMgr/pdDyeingDemand/AllCountsGroupByStatus',
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

// 待排厂-提交
export function WaitingPlantSubmit(data = {}) {
  return request({
    url: '/processingMgr/pdDyeingDemand/submit',
    method: 'post',
    data
  })
}

// 分页查询列表 ==》已排厂
export function ListDischarged(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/processingMgr/pdDyeingOrder/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 分页查询列表 ==》已排厂-变更排厂提交
export function Modifycharged(data = {}) {
  return request({
    url: '/processingMgr/pdDyeingDemand/modify',
    method: 'post',
    raw: true,
    data: { ...data }
  })
}

// 已排厂-需求详情
export function orderInfo(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/processingMgr/pdDyeingDemand/info',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

