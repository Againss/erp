/*
 * @Author: Sanmao
 * @Date: 2020-09-28 10:18:40
 * @LastEditors: zhengjin
 * @LastEditTime: 2021-06-25 14:21:59
 * @Descripttion: 化学纤维api文件
 */
import request from '@/utils/request'
import configData from '@/views/product-center/configDock/index.js'

// 分页查询化学纤维列表
export function pageList(data = {}) {
  const defaultParams = {
    page: 1,
    pageSize: 20
  }
  return request({
    url: `${configData.productRequestPrefix}/api/yarn/chemicalFiber/index`,
    method: 'post',
    data: {
      ...defaultParams,
      ...data
    }
  })
}
// 化学纤维列表导出
export function chemicalFiberExport(data = {}) {
  return request({
    url: `${configData.productRequestPrefix}/api/yarn/chemicalFiber/export`,
    method: 'post',
    data: {
      ...data
    }
  })
}
// 化学纤维列表删除
export function chemicalFiberDestory(data = {}) {
  return request({
    url: `${configData.productRequestPrefix}/api/yarn/chemicalFiber/destroy`,
    method: 'post',
    data: {
      ...data
    }
  })
}

// 化学纤维详情
export function chemicalFiberShow(data = {}) {
  return request({
    url: `${configData.productRequestPrefix}/api/yarn/chemicalFiber/show`,
    method: 'post',
    data: {
      ...data
    }
  })
}
// 化学纤维添加
export function chemicalFiberStore(data = {}) {
  return request({
    url: `${configData.productRequestPrefix}/api/yarn/chemicalFiber/store`,
    method: 'post',
    data: {
      ...data
    }
  })
}
// 化学纤维编辑
export function chemicalFiberUpdate(data = {}) {
  return request({
    url: `${configData.productRequestPrefix}/api/yarn/chemicalFiber/update`,
    method: 'post',
    data: {
      ...data
    }
  })
}
// 引入坯纱编码
export function getEmbryoCode(data = {}) {
  return request({
    url: `${configData.productRequestPrefix}/api/yarn/chemicalFiber/searchCode`,
    method: 'post',
    data
  })
}
// 产品-成分/组合成分
export function ingredientsList(data = {}) {
  return request({
    url: `${configData.productRequestPrefix}/api/bd/ingredientsType/all`,
    method: 'post',
    data: {
      ...data
    }
  })
}
// 长纤-捻向
export function wistDirectionList(data = {}) {
  return request({
    url: `${configData.productRequestPrefix}/api/bd/wistDirection/all`,
    method: 'post',
    data: {
      ...data
    }
  })
}
// 染纱色号
export function yarnColorCodeAll(data = {}) {
  return request({
    url: `color/api/color/droplist`,
    method: 'post',
    data: {
      ...data,
      ...{ type: 1 }
    }
  })
}
// 染纱工艺编码
export function yarnTechnologyCodeAll(data = {}) {
  return request({
    url: `${configData.productRequestPrefix}/api/tech/yarnTechnologyCode/all`,
    method: 'post',
    data: {
      ...data
    }
  })
}

