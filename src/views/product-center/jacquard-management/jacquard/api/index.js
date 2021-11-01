/*
 * @Author: Sanmao
 * @Date: 2021-06-21 10:00:13
 * @LastEditors: Sanmao
 * @LastEditTime: 2021-06-23 10:36:38
 * @Descripttion: 提花号 api文件
 */
import request from '@/utils/request'
import configData from '@/views/product-center/configDock/index.js'
// 分页查询提花号管理列表
export function pageList(data = {}) {
  const defaultParams = {
    page: 1,
    pageSize: 20
  }
  return request({
    url: `${configData.productRequestPrefix}/api/jacquard/index`,
    method: 'post',
    data: {
      ...defaultParams,
      ...data
    }
  })
}

// 提花号管理列表添加
export function jacquardStore(data = {}) {
  return request({
    url: `${configData.productRequestPrefix}/api/jacquard/store`,
    method: 'post',
    data: {
      ...data
    }
  })
}
