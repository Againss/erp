/*
 * @Date: 2021-04-22 09:20:06
 * @Author: Againss
 * @LastEditTime: 2021-05-06 16:13:52
 * @LastEditors: anthony
 * @Descripttion:克重区间API
 */
import request from '@/utils/request'
import configData from '@/views/product-center/configDock/index.js'

// 分页查询列表
export function paymentPage(data = {}) {
  const defaultParams = { page: 1, pageSize: 20 }
  return request({
    url: `${configData.productRequestPrefix}/api/range/fabricWeight/index`,
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 新增
export function paymentAdd(data) {
  return request({
    url: `${configData.productRequestPrefix}/api/range/fabricWeight/store`,
    method: 'post',
    data
  })
}

