/*
 * @Author: Sanmao
 * @Date: 2020-09-30 10:06:53
 * @LastEditors: anthony
 * @LastEditTime: 2020-11-26 15:43:01
 * @Descripttion: 色/花布管理列表api文件
 */
import request from '@/utils/request'
import configData from '@/views/product-center/configDock/index.js'

// 分页查询复合布管理列表
export function pageList(data = {}) {
  const defaultParams = {
    page: 1,
    pageSize: 20
  }
  return request({
    url: `${configData.productRequestPrefix}/api/cloth/combineFabric`,
    method: 'post',
    data: {
      ...defaultParams,
      ...data
    }
  })
}
// 分页查询色/花布管理列表
export function colourClothList(data = {}) {
  const defaultParams = {
    page: 1,
    pageSize: 20
  }
  return request({
    url: `${configData.productRequestPrefix}/api/cloth/productFabric/all`,
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
    url: `${configData.productRequestPrefix}/api/cloth/combineFabric/store`,
    method: 'post',
    data
  })
}
// 详情
export function show(data = {}) {
  return request({
    url: `${configData.productRequestPrefix}/api/cloth/combineFabric/show`,
    method: 'post',
    data
  })
}
// 更新
export function update(data = {}) {
  return request({
    url: `${configData.productRequestPrefix}/api/cloth/combineFabric/update`,
    method: 'post',
    data
  })
}
// 删除
export function destroy(data = {}) {
  return request({
    url: `${configData.productRequestPrefix}/api/cloth/combineFabric/destroy`,
    method: 'post',
    data
  })
}
// 预览3D
export function previewCode(data = {}) {
  return request({
    url: `${configData.productRequestPrefix}/api/cloth/lingDi/viewLingDi`,
    method: 'post',
    data: {
      ...data
    }
  })
}
