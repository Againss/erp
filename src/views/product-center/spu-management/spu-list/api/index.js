/*
 * @Author: Sanmao
 * @Date: 2020-09-28 14:46:27
 * @LastEditTime: 2021-06-15 16:23:11
 * @LastEditors: zhengjin
 * @Descripttion: spu管理列表api文件
 */
import request from '@/utils/request'
import configData from '@/views/product-center/configDock/index.js'
// 分页查询spu管理列表
export function pageList(data = {}) {
  const defaultParams = {
    page: 1,
    pageSize: 20
  }
  return request({
    url: `${configData.productRequestPrefix}/api/spu/index`,
    method: 'post',
    data: {
      ...defaultParams,
      ...data
    }
  })
}
// spu列表导出
export function spuExport(data = {}) {
  return request({
    url: `${configData.productRequestPrefix}/api/spu/export`,
    method: 'post',
    data: {
      ...data
    }
  })
}
// spu列表删除
export function spuDestory(data = {}) {
  return request({
    url: `${configData.productRequestPrefix}/api/spu/destroy`,
    method: 'post',
    data: {
      ...data
    }
  })
}
// spu详情
export function spuShow(data = {}) {
  return request({
    url: `${configData.productRequestPrefix}/api/spu/show`,
    method: 'post',
    data: {
      ...data
    }
  })
}
// spu添加
export function spuStore(data = {}) {
  return request({
    url: `${configData.productRequestPrefix}/api/spu/store`,
    method: 'post',
    data: {
      ...data
    }
  })
}

// 面料大类
export function clothMaterialList(data = {}) {
  return request({
    url: `basis/api/fabricCategory/option`,
    method: 'post',
    data: {
      ...data
    }
  })
}
// 布种大类
export function clothCategoryList(data = {}) {
  return request({
    url: `basis/api/clothCategory/option`,
    method: 'post',
    data: {
      ...data
    }
  })
}
// 主成分
export function zhuIngredientsList(data = {}) {
  return request({
    url: `basis/api/classifications/option`,
    method: 'post',
    data: {
      ...data
    }
  })
}
// 次成分
export function ciIngredientsList(data = {}) {
  return request({
    url: `basis/api/classifications/option`,
    method: 'post',
    data: {
      ...data
    }
  })
}
// 印染类型
export function dyePrintTypeList(data = {}) {
  return request({
    url: `basis/api/printingDyeingType/option`,
    method: 'post',
    data: {
      ...data
    }
  })
}
// 工艺要求（标记为特殊工艺的值）
export function specialTecHList(data = {}) {
  return request({
    url: `basis/api/requirementsDye/option`,
    method: 'post',
    data: {
      ...data
    }
  })
}
// 克重替换
export function getFabricWeight(data = {}) {
  return request({
    url: `${configData.productRequestPrefix}/api/range/fabricWeight/search`,
    method: 'post',
    data
  })
}
