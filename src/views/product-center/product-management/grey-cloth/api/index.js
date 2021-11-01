/*
 * @Date: 2020-09-29 09:31:29
 * @Author: Againss
 * @LastEditTime: 2021-07-13 14:33:17
 * @LastEditors: zhengjin
 * @Descripttion: 坯布api
 */
import request from '@/utils/request'
import configData from '@/views/product-center/configDock/index.js'

// 列表
export function pageList(data = {}) {
  const defaultParams = {
    page: 1,
    pageSize: 20
  }
  return request({
    url: `${configData.productRequestPrefix}/api/embryo`,
    method: 'post',
    data: {
      ...defaultParams,
      ...data
    }
  })
}
// spu列表导出
export function embryoExport(data = {}) {
  return request({
    url: `${configData.productRequestPrefix}/api/embryo/export`,
    method: 'post',
    data: {
      ...data
    }
  })
}
// 新增
export function store(data = {}) {
  return request({
    url: `${configData.productRequestPrefix}/api/embryo/store`,
    method: 'post',
    data
  })
}
// 详情
export function show(data = {}) {
  return request({
    url: `${configData.productRequestPrefix}/api/embryo/show`,
    method: 'post',
    data
  })
}
// 详情
export function update(data = {}) {
  return request({
    url: `${configData.productRequestPrefix}/api/embryo/update`,
    method: 'post',
    data
  })
}
// 删除
export function destroy(data = {}) {
  return request({
    url: `${configData.productRequestPrefix}/api/embryo/destroy`,
    method: 'post',
    data
  })
}

// 布种
export function fabricationsList(data = {}) {
  return request({
    url: `basis/api/fabrications/option`,
    method: 'post',
    data
  })
}
// 染方式
export function modeDyedList(data = {}) {
  return request({
    url: `basis/api/fabricationProduceModes/option`,
    method: 'post',
    data
  })
}
// 织造花型
export function modeKnitList(data = {}) {
  return request({
    url: `basis/api/fabricationProduceModes/option`,
    method: 'post',
    data
  })
}
// 主成分
export function ingredientsList(data = {}) {
  return request({
    url: `${configData.productRequestPrefix}/api/bd/ingredients/all`,
    method: 'post',
    data
  })
}
// 纱长描述
export function yarnLengthDescList(data = {}) {
  return request({
    url: `basis/api/YarnLengthDescription/option`,
    method: 'post',
    data
  })
}
// 纱长描述
export function getYarnLengthValue(data = {}) {
  return request({
    url: `${configData.productRequestPrefix}/api/range/yarnLength/search`,
    method: 'post',
    data
  })
}

// 提花号下拉
export function jacquardCodeAll(data = {}) {
  return request({
    url: `${configData.productRequestPrefix}/api/jacquard/droplist`,
    method: 'post',
    data: {
      ...data
    }
  })
}
// 布类查询
export function clothList(data = {}) {
  return request({
    url: `${configData.productRequestPrefix}/api/bd/cloth/all`,
    method: 'post',
    data: {
      ...data
    }
  })
}
