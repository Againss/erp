/*
 * @Date: 2020-12-10 11:46:11
 * @Author: Againss
 * @LastEditTime: 2021-06-23 15:34:37
 * @LastEditors: zhengjin
 * @Descripttion:花号管理
 */
import request from '@/utils/request'
import configData from '@/views/product-center/configDock/index.js'

// 列表
export function pageList(data = {}) {
  const defaultParams = { page: 1, pageSize: 20 }
  return request({
    url: `${configData.colorRequestPrefix}/api/flower/flowerManage/index`,
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}
// 提交
export function submit(data = {}) {
  return request({
    url: `${configData.colorRequestPrefix}/api/flower/flowerManage/submit`,
    method: 'post',
    data
  })
}
// 详情
export function show(data = {}) {
  return request({
    url: `${configData.colorRequestPrefix}/api/flower/flowerManage/show`,
    method: 'post',
    data
  })
}
// 保存为草稿
export function update(data = {}) {
  return request({
    url: `${configData.colorRequestPrefix}/api/flower/flowerManage/update`,
    method: 'post',
    data
  })
}
// 启用禁用
export function enabled(data = {}) {
  return request({
    url: `${configData.colorRequestPrefix}/api/flower/flowerManage/enable`,
    method: 'post',
    data
  })
}
// 变更
export function change(data = {}) {
  return request({
    url: `${configData.colorRequestPrefix}/api/flower/flowerManage/change`,
    method: 'post',
    data
  })
}
// 审核
export function approve(data = {}) {
  return request({
    url: `${configData.colorRequestPrefix}/api/flower/flowerManage/approve`,
    method: 'post',
    data
  })
}
// 驳回
export function disapprove(data = {}) {
  return request({
    url: `${configData.colorRequestPrefix}/api/flower/flowerManage/disapprove`,
    method: 'post',
    data
  })
}
// 印花工艺
export function actualTechnology(data = {}) {
  return request({
    url: `basis/api/requirementsPrinting/option`,
    method: 'post',
    data
  })
}

