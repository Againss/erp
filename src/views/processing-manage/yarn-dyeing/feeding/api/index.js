/*
 * @Descripttion:送纱通知单
 * @Author: admin
 * @Date: 2021-03-04 14:03:07
 * @LastEditors: OBKoro1
 * @LastEditTime: 2021-06-11 10:40:56
 */
import request from '@/utils/request'

// 分页查询列表
export function list(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/processingMgr/pdDyeingSendNotify/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 送纱通知单 详情信息
export function orderInfo(data = {}) {
  return request({
    url: '/processingMgr/pdDyeingSendNotify/info',
    method: 'post',
    data: { ...data }
  })
}

