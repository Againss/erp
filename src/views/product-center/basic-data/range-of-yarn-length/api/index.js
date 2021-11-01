/*
 * @Date: 2021-04-22 09:20:06
 * @Author: Againss
 * @LastEditTime: 2021-04-26 11:20:28
 * @LastEditors: Againss
 * @Descripttion:纱长区间API 占时只有列表跟新增接口  其他接口为防止以后会加上  所以先保留
 */
import request from '@/utils/request'
import configData from '@/views/product-center/configDock/index.js'
// 列表
export function yarnList(data = {}) {
  const defaultParams = { page: 1, pageSize: 20 }
  return request({
    url: `${configData.productRequestPrefix}/api/range/yarnLength/index`,
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 新增
export function yarnAdd(data) {
  return request({
    url: `${configData.productRequestPrefix}/api/range/yarnLength/store`,
    method: 'post',
    data
  })
}

// 点击编辑
export function yarnEdit(data) {
  return request({
    url: `${configData.productRequestPrefix}/api/range/yarnLength/show`,
    method: 'post',
    data
  })
}

// 更新
export function yarnUpdate(data) {
  return request({
    url: `${configData.productRequestPrefix}/api/range/yarnLength/update`,
    method: 'post',
    data
  })
}

// 删除
export function yarnDelete(data) {
  return request({
    url: `${configData.productRequestPrefix}/api/range/yarnLength/destroy`,
    method: 'post',
    data
  })
}

// 审核
export function yarnApprove(data) {
  return request({
    url: `${configData.productRequestPrefix}/api/range/yarnLength/approve`,
    method: 'post',
    data
  })
}

// 启用禁用
export function yarnEnabled(data) {
  return request({
    url: `${configData.productRequestPrefix}/api/range/yarnLength/enabled`,
    method: 'post',
    data
  })
}
