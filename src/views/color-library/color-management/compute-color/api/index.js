/*
 * @Author: Sanmao
 * @Date: 2020-11-07 09:39:42
 * @LastEditors: Sanmao
 * @LastEditTime: 2020-12-11 11:24:25
 * @Descripttion: 电脑配色api文件
 */

import request from '@/utils/request'
import configData from '@/views/product-center/configDock/index.js'
// 电脑配色新增
export function store(data = {}) {
  return request({
    url: `${configData.colorRequestPrefix}/api/datacolor/store`,
    method: 'post',
    data: {
      ...data
    }
  })
}
// 电脑配色编辑
export function update(data = {}) {
  return request({
    url: `${configData.colorRequestPrefix}/api/datacolor/update`,
    method: 'post',
    data: {
      ...data
    }
  })
}
// 电脑配色刷新列表
export function refreshList(data = {}) {
  return request({
    url: `${configData.colorRequestPrefix}/api/datacolor/refresh`,
    method: 'post',
    data: {
      ...data
    }
  })
}
// 从色号列表进入时，获取基本信息
export function getColorCode(data = {}) {
  return request({
    url: `${configData.colorRequestPrefix}/api/datacolor/create`,
    method: 'post',
    data: { ...data }
  })
}
// 查看详情
export function show(data = {}) {
  return request({
    url: `${configData.colorRequestPrefix}/api/datacolor/show`,
    method: 'post',
    data: { ...data }
  })
}
