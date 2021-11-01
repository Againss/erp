/*
 * @Date: 2020-09-29 09:31:29
 * @Author: Againss
 * @LastEditTime: 2021-02-22 17:09:26
 * @LastEditors: anthony
 * @Descripttion: 组合纱api
 */
import request from '@/utils/request'
import configData from '@/views/product-center/configDock/index.js'

// 分页组合纱列表
export function pageList(data = {}) {
  const defaultParams = {
    page: 1,
    pageSize: 20
  }
  return request({
    url: `${configData.productRequestPrefix}/api/yarn/composite/index`,
    method: 'post',
    data: {
      ...defaultParams,
      ...data
    }
  })
}
// 分页查询天然纤维列表
export function naturalList(data = {}) {
  const defaultParams = {
    page: 1,
    pageSize: 10
  }
  return request({
    url: `${configData.productRequestPrefix}/api/naturalFiber/get`,
    method: 'post',
    data: {
      ...defaultParams,
      ...data
    }
  })
}
// 分页查询化学纤维列表
export function chemicalList(data = {}) {
  const defaultParams = {
    page: 1,
    pageSize: 10
  }
  return request({
    url: `${configData.productRequestPrefix}/api/yarn/chemicalFiber/get`,
    method: 'post',
    data: {
      ...defaultParams,
      ...data
    }
  })
}
// 组合纱列表导出
export function spuExport(data = {}) {
  return request({
    url: `${configData.productRequestPrefix}/api/yarn/composite/export`,
    method: 'post',
    data: {
      ...data
    }
  })
}
export function compositeList(data = {}) {
  const defaultParams = {
    page: 1,
    pageSize: 10
  }
  return request({
    url: `${configData.productRequestPrefix}/api/yarn/composite/get`,
    method: 'post',
    data: {
      ...defaultParams,
      ...data
    }
  })
}
// 新增
export function store(data = {}) {
  return request({
    url: `${configData.productRequestPrefix}/api/yarn/composite/store`,
    method: 'post',
    data
  })
}
// 删除
export function destroy(data = {}) {
  return request({
    url: `${configData.productRequestPrefix}/api/yarn/composite/destroy`,
    method: 'post',
    data
  })
}
// 详情
export function show(data = {}) {
  return request({
    url: `${configData.productRequestPrefix}/api/yarn/composite/show`,
    method: 'post',
    data
  })
}
// 详情
export function update(data = {}) {
  return request({
    url: `${configData.productRequestPrefix}/api/yarn/composite/update`,
    method: 'post',
    data
  })
}
