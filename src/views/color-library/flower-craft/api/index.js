/*
 * @Date: 2020-12-17 10:20:08
 * @Author: anthony
 * @LastEditTime: 2021-06-23 16:07:27
 * @LastEditors: zhengjin
 * @Descripttion: 花号工艺接口文档
 */
import request from '@/utils/request'
import configData from '@/views/product-center/configDock/index.js'

// 列表
export function pageList(data = {}) {
  const defaultParams = { page: 1, pageSize: 20 }
  return request({
    url: `${configData.colorRequestPrefix}/api/flower/tech/index`,
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}
// 新增
export function store(data = {}) {
  return request({
    url: `${configData.colorRequestPrefix}/openapi/flower/tech/store`,
    method: 'post',
    data
  })
}
// 详情
export function show(data = {}) {
  return request({
    url: `${configData.colorRequestPrefix}/api/flower/tech/show`,
    method: 'post',
    data
  })
}
// 保存
export function update(data = {}) {
  return request({
    url: `${configData.colorRequestPrefix}/api/flower/tech/update`,
    method: 'post',
    data
  })
}
// 提交
export function submit(data = {}) {
  return request({
    url: `${configData.colorRequestPrefix}/api/flower/tech/submit`,
    method: 'post',
    data
  })
}
// 驳回
export function reject(data = {}) {
  return request({
    url: `${configData.colorRequestPrefix}/api/flower/tech/disapprove`,
    method: 'post',
    data
  })
}
// 变更
export function change(data = {}) {
  return request({
    url: `${configData.colorRequestPrefix}/api/flower/tech/change`,
    method: 'post',
    data
  })
}
// 审核
export function review(data = {}) {
  return request({
    url: `${configData.colorRequestPrefix}/api/flower/tech/approve`,
    method: 'post',
    data
  })
}
// 删除
export function destroy(data = {}) {
  return request({
    url: `${configData.colorRequestPrefix}/api/naturalFiber/destroy`,
    method: 'post',
    data
  })
}
// 成分列表
export function ingredientsList(data = {}) {
  return request({
    url: `${configData.colorRequestPrefix}/api/bd/allIngredients/all`,
    method: 'post',
    data: { ...data }
  })
}
// 纱支列表
export function yarnCounList(data = {}) {
  return request({
    url: `${configData.colorRequestPrefix}/api/bd/yarnCount/all`,
    method: 'post',
    data: { ...data }
  })
}
// 纱类列表--无引用
export function yarnTypeList(data = {}) {
  return request({
    url: `basis/api/yarnTypes/option`,
    method: 'post',
    data: { ...data }
  })
}
// 纺纱方法列表
export function spinningMethodList(data = {}) {
  return request({
    url: `${configData.colorRequestPrefix}/api/bd/spinningMethod/all`,
    method: 'post',
    data: { ...data }
  })
}
// 梳棉方法列表
export function cardingMethodList(data = {}) {
  return request({
    url: `${configData.colorRequestPrefix}/api/bd/cardingMethod/all`,
    method: 'post',
    data: { ...data }
  })
}
