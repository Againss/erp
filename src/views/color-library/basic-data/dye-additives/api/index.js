/*
 * @Author: Sanmao
 * @Date: 2020-11-03 10:14:07
 * @LastEditors: Sanmao
 * @LastEditTime: 2020-12-11 10:55:59
 * @Descripttion:色号库-基础数据-染料助剂api文件
 */
import request from '@/utils/request'
import configData from '@/views/product-center/configDock/index.js'
// 分页查询染料助剂类型列表
export function dyestuffAssistTypeList(data = {}) {
  return request({
    url: `${configData.colorRequestPrefix}/api/colorBd/dyestuffAssistType`,
    method: 'post',
    data: {
      ...data
    }
  })
}
export function dyestuffAssistTypeEnabledList(data = {}) {
  return request({
    url: `${configData.colorRequestPrefix}/api/colorBd/dyestuffAssistType/all`,
    method: 'post',
    data: {
      ...data
    }
  })
}
// 新增染料助剂类型
export function dyestuffAssistTypeAdd(data) {
  return request({
    url: `${configData.colorRequestPrefix}/api/colorBd/dyestuffAssistType/store`,
    method: 'post',
    data
  })
}

// 点击编辑 染料助剂类型
export function dyestuffAssistTypeEdit(data) {
  return request({
    url: `${configData.colorRequestPrefix}/api/colorBd/dyestuffAssistType/show`,
    method: 'post',
    data
  })
}

// 更新染料助剂类型
export function dyestuffAssistTypeUpdate(data) {
  return request({
    url: `${configData.colorRequestPrefix}/api/colorBd/dyestuffAssistType/update`,
    method: 'post',
    data
  })
}

// 删除染料助剂类型
export function dyestuffAssistTypeDelete(data) {
  return request({
    url: `${configData.colorRequestPrefix}/api/colorBd/dyestuffAssistType/destroy`,
    method: 'post',
    data
  })
}

// 审核染料助剂类型
export function dyestuffAssistTypeApprove(data) {
  return request({
    url: `${configData.colorRequestPrefix}/api/colorBd/dyestuffAssistType/approve`,
    method: 'post',
    data
  })
}

// 启用禁用染料助剂类型
export function dyestuffAssistTypeEnabled(data) {
  return request({
    url: `${configData.colorRequestPrefix}/api/colorBd/dyestuffAssistType/enable`,
    method: 'post',
    data
  })
}

// 分页查询染料助剂列表
export function dyestuffAssistList(data = {}) {
  const defaultParams = {
    page: 1,
    pageSize: 20
  }
  return request({
    url: `${configData.colorRequestPrefix}/api/colorBd/dyestuffAssist`,
    method: 'post',
    data: {
      ...defaultParams,
      ...data
    }
  })
}
// 新增染料助剂
export function dyestuffAssistAdd(data) {
  return request({
    url: `${configData.colorRequestPrefix}/api/colorBd/dyestuffAssist/store`,
    method: 'post',
    data
  })
}

// 点击编辑 染料助剂
export function dyestuffAssistEdit(data) {
  return request({
    url: `${configData.colorRequestPrefix}/api/colorBd/dyestuffAssist/show`,
    method: 'post',
    data
  })
}

// 更新染料助剂
export function dyestuffAssistUpdate(data) {
  return request({
    url: `${configData.colorRequestPrefix}/api/colorBd/dyestuffAssist/update`,
    method: 'post',
    data
  })
}

// 删除染料助剂
export function dyestuffAssistDelete(data) {
  return request({
    url: `${configData.colorRequestPrefix}/api/colorBd/dyestuffAssist/destroy`,
    method: 'post',
    data
  })
}

// 审核染料助剂
export function dyestuffAssistApprove(data) {
  return request({
    url: `${configData.colorRequestPrefix}/api/colorBd/dyestuffAssist/approve`,
    method: 'post',
    data
  })
}

// 启用禁用染料助剂
export function dyestuffAssistEnabled(data) {
  return request({
    url: `${configData.colorRequestPrefix}/api/colorBd/dyestuffAssist/enable`,
    method: 'post',
    data
  })
}
