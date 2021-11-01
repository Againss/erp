/*
 * @Date: 2020-09-27 15:24:17
 * @Author: Againss
 * @LastEditTime: 2021-06-15 16:23:11
 * @LastEditors: zhengjin
 * @Descripttion: 天然纤维
 */
import request from '@/utils/request'
import configData from '@/views/product-center/configDock/index.js'

// 列表
export function pageList(data = {}) {
  const defaultParams = { page: 1, pageSize: 20 }
  return request({
    url: `${configData.productRequestPrefix}/api/naturalFiber`,
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}
// 列表导出
export function naturalFiberExport(data = {}) {
  return request({
    url: `${configData.productRequestPrefix}/api/naturalFiber/export`,
    method: 'post',
    data: {
      ...data
    }
  })
}
// 引入坯纱编码
export function getEmbryoCode(data = {}) {
  return request({
    url: `${configData.productRequestPrefix}/api/naturalFiber/searchCode`,
    method: 'post',
    data
  })
}
// 新增
export function store(data = {}) {
  return request({
    url: `${configData.productRequestPrefix}/api/naturalFiber/store`,
    method: 'post',
    data
  })
}
// 详情
export function show(data = {}) {
  return request({
    url: `${configData.productRequestPrefix}/api/naturalFiber/show`,
    method: 'post',
    data
  })
}
// 详情
export function update(data = {}) {
  return request({
    url: `${configData.productRequestPrefix}/api/naturalFiber/update`,
    method: 'post',
    data
  })
}
// 删除
export function destroy(data = {}) {
  return request({
    url: `${configData.productRequestPrefix}/api/naturalFiber/destroy`,
    method: 'post',
    data
  })
}
// 成分列表
export function ingredientsList(data = {}) {
  return request({
    url: `${configData.productRequestPrefix}/api/bd/allIngredients/all`,
    method: 'post',
    data: { ...data }
  })
}
// 查询色号
export function getColor(data = {}) {
  return request({
    url: `${configData.productRequestPrefix}/api/color/dataColor`,
    method: 'post',
    data: { ...data }
  })
}
// 属性组合列表
export function compositePropertiesList(data = {}) {
  const defaultParams = { page: 1, pageSize: 20 }
  return request({
    url: `${configData.productRequestPrefix}/api/bd/yarnTypeAttr/all`,
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}
