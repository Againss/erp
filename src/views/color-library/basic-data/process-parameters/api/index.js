/*
 * @Author: Sanmao
 * @Date: 2020-12-11 11:29:16
 * @LastEditors: Sanmao
 * @LastEditTime: 2020-12-11 16:12:13
 * @Descripttion: 色号库-基础数据-工艺参数api文件
 */
import request from '@/utils/request'
import configData from '@/views/product-center/configDock/index.js'

// 分页查询工艺参数类型列表
export function techParamNameList(data = {}) {
  return request({
    url: `${configData.colorRequestPrefix}/api/flowerBd/techParamName`,
    method: 'post',
    data: {
      ...data
    }
  })
}
export function techParamNameEnabledList(data = {}) {
  return request({
    url: `${configData.colorRequestPrefix}/api/flowerBd/techParamName/all`,
    method: 'post',
    data: {
      ...data
    }
  })
}
// 新增工艺参数类型
export function techParamNameAdd(data) {
  return request({
    url: `${configData.colorRequestPrefix}/api/flowerBd/techParamName/store`,
    method: 'post',
    data
  })
}

// 点击编辑 工艺参数类型
export function techParamNameEdit(data) {
  return request({
    url: `${configData.colorRequestPrefix}/api/flowerBd/techParamName/show`,
    method: 'post',
    data
  })
}

// 更新工艺参数类型
export function techParamNameUpdate(data) {
  return request({
    url: `${configData.colorRequestPrefix}/api/flowerBd/techParamName/update`,
    method: 'post',
    data
  })
}

// 删除工艺参数类型
export function techParamNameDelete(data) {
  return request({
    url: `${configData.colorRequestPrefix}/api/flowerBd/techParamName/destroy`,
    method: 'post',
    data
  })
}

// 审核工艺参数类型
export function techParamNameApprove(data) {
  return request({
    url: `${configData.colorRequestPrefix}/api/flowerBd/techParamName/approve`,
    method: 'post',
    data
  })
}

// 启用禁用工艺参数类型
export function techParamNameEnabled(data) {
  return request({
    url: `${configData.colorRequestPrefix}/api/flowerBd/techParamName/enable`,
    method: 'post',
    data
  })
}

// 分页查询工艺参数名称列表
export function techParamList(data = {}) {
  const defaultParams = {
    page: 1,
    pageSize: 20
  }
  return request({
    url: `${configData.colorRequestPrefix}/api/flowerBd/techParam`,
    method: 'post',
    data: {
      ...defaultParams,
      ...data
    }
  })
}
// 新增工艺参数名称
export function techParamAdd(data) {
  return request({
    url: `${configData.colorRequestPrefix}/api/flowerBd/techParam/store`,
    method: 'post',
    data
  })
}

// 点击编辑 工艺参数名称
export function techParamEdit(data) {
  return request({
    url: `${configData.colorRequestPrefix}/api/flowerBd/techParam/show`,
    method: 'post',
    data
  })
}

// 更新工艺参数名称
export function techParamUpdate(data) {
  return request({
    url: `${configData.colorRequestPrefix}/api/flowerBd/techParam/update`,
    method: 'post',
    data
  })
}

// 删除工艺参数名称
export function techParamDelete(data) {
  return request({
    url: `${configData.colorRequestPrefix}/api/flowerBd/techParam/destroy`,
    method: 'post',
    data
  })
}

// 审核工艺参数名称
export function techParamApprove(data) {
  return request({
    url: `${configData.colorRequestPrefix}/api/flowerBd/techParam/approve`,
    method: 'post',
    data
  })
}

// 启用禁用工艺参数名称
export function techParamEnabled(data) {
  return request({
    url: `${configData.colorRequestPrefix}/api/flowerBd/techParam/enable`,
    method: 'post',
    data
  })
}
