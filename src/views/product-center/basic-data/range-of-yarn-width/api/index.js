/*
 * @Date: 2021-04-22 09:20:06
 * @Author: Againss
 * @LastEditTime: 2021-04-25 16:33:50
 * @LastEditors: anthony
 * @Descripttion:纱长区间API
 */
// 付款条件页面API
import request from '@/utils/request'
import configData from '@/views/product-center/configDock/index.js'

// 分页查询付款条件列表
export function paymentPage(data = {}) {
  const defaultParams = { page: 1, pageSize: 20 }
  return request({
    url: `${configData.productRequestPrefix}/api/range/fabricWidth/index`,
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 新增
export function paymentAdd(data) {
  return request({
    url: `${configData.productRequestPrefix}/api/range/fabricWidth/store`,
    method: 'post',
    data
  })
}

