/*
 * @Date: 2020-11-03 17:24:06
 * @Author: Againss
 * @LastEditTime: 2021-06-24 09:47:00
 * @LastEditors: zhengjin
 * @Descripttion:
 */
import request from '@/utils/request'
// 更新
export function update(data = {}) {
  return request({
    url: '/color/api/color/colorManage/update',
    method: 'post',
    data: { ...data }
  })
}
// 保存
export function store(data = {}) {
  return request({
    url: '/color/api/color/colorManage/store',
    method: 'post',
    data: { ...data }

  })
}
// 详情
export function show(data = {}) {
  return request({
    url: '/color/api/color/colorManage/show',
    method: 'post',
    data: { ...data }
  })
}
// 删除
export function destroy(data = {}) {
  return request({
    url: '/color/api/color/colorManage/destroy',
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
// 染色类型
export function DyeList(data = {}) {
  return request({
    url: '/basis/api/dyeType/option',
    method: 'post',
    data: { ...data }
  })
}

