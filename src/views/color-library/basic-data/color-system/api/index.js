/*
 * @Author: Sanmao
 * @Date: 2020-11-03 10:14:07
 * @LastEditors: Sanmao
 * @LastEditTime: 2020-12-11 11:17:02
 * @Descripttion: 基础数据-色系api文件
 */
import request from '@/utils/request'
import configData from '@/views/product-center/configDock/index.js'
// 分页查询色系管理列表
export function pageList(data = {}) {
  const defaultParams = {
    page: 1,
    pageSize: 20
  }
  return request({
    url: `${configData.colorRequestPrefix}/api/colorBd/colorSystem`,
    method: 'post',
    data: {
      ...defaultParams,
      ...data
    }
  })
}
// 新增
export function colorSystemAdd(data) {
  return request({
    url: `${configData.colorRequestPrefix}/api/colorBd/colorSystem/store`,
    method: 'post',
    data
  })
}

// 点击编辑
export function colorSystemEdit(data) {
  return request({
    url: `${configData.colorRequestPrefix}/api/colorBd/colorSystem/show`,
    method: 'post',
    data
  })
}

// 更新
export function colorSystemUpdate(data) {
  return request({
    url: `${configData.colorRequestPrefix}/api/colorBd/colorSystem/update`,
    method: 'post',
    data
  })
}

// 删除
export function colorSystemDelete(data) {
  return request({
    url: `${configData.colorRequestPrefix}/api/colorBd/colorSystem/destroy`,
    method: 'post',
    data
  })
}

// 审核
export function colorSystemApprove(data) {
  return request({
    url: `${configData.colorRequestPrefix}/api/colorBd/colorSystem/approve`,
    method: 'post',
    data
  })
}

// 启用禁用
export function colorSystemEnabled(data) {
  return request({
    url: `${configData.colorRequestPrefix}/api/colorBd/colorSystem/enable`,
    method: 'post',
    data
  })
}
