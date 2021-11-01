/*
 * @Date: 2020-11-03 17:24:06
 * @Author: Againss
 * @LastEditTime: 2021-06-23 15:11:44
 * @LastEditors: zhengjin
 * @Descripttion:
 */
import request from '@/utils/request'
// 更新
export function update(data = {}) {
  return request({
    url: '/color/api/formula/update',
    method: 'post',
    data: { ...data }
  })
}
// 详情
export function show(data = {}) {
  return request({
    url: '/color/api/formula/show',
    method: 'post',
    data: { ...data }
  })
}
// 删除
export function showTop(data = {}) {
  return request({
    url: '/color/api/color/colorManage/show',
    method: 'post',
    data: { ...data }
  })
}
// 纱支列表
export function yarnCounList(data = {}) {
  return request({
    url: '/color/api/bd/yarn/all',
    method: 'post',
    data: { ...data }
  })
}
// 成分列表
export function ingredientsList(data = {}) {
  return request({
    url: '/color/api/bd/element/all',
    method: 'post',
    data: { ...data }
  })
}
// 布类列表
export function clothList(data = {}) {
  return request({
    url: '/color/api/bd/cloth/all',
    method: 'post',
    data: { ...data }
  })
}
// 分页查询色/花布管理列表
export function colourClothList(data = {}) {
  const defaultParams = {
    page: 1,
    pageSize: 20
  }
  return request({
    url: '/color/api/colorBd/dyestuffAssist/all',
    method: 'post',
    data: {
      ...defaultParams,
      ...data
    }
  })
}
// 染色成份接口
export function dyeingIngredients(data = {}) {
  const defaultParams = {
    page: 1,
    pageSize: 20
  }
  return request({
    url: '/basis/api/dyeIngredient/option',
    method: 'post',
    data: {
      ...defaultParams,
      ...data
    }
  })
}
// 新增配方
export function storePeifang(data) {
  return request({
    url: '/color/api/formula/store',
    method: 'post',
    data
  })
}
// 审核
export function approve(data = {}) {
  return request({
    url: '/color/api/color/colorManage/approve',
    method: 'post',
    data: { ...data }
  })
}

