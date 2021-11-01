/*
 * @Author: Sanmao
 * @Date: 2020-12-31 10:06:39
 * @LastEditors: Sanmao
 * @LastEditTime: 2021-01-21 19:13:11
 * @Descripttion:
 */
import request from '@/utils/request'

// 纱属性列表、查询
export function sysDataGroupPage(data = {}) {
  const defaultParams = { page: 1, pageSize: 20 }
  return request({
    url: '/basis/api/yarnTypes/index',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 新增纱属性
export function sysDataGroupAdd(data) {
  return request({
    url: '/basis/api/yarnTypes/store',
    method: 'post',
    data
  })
}

// 修改纱属性
export function sysDataGroupModify(data) {
  return request({
    url: '/basis/api/yarnTypes/update',
    method: 'post',
    data
  })
}

// 删除纱属性
export function sysDataGroupDelete(data) {
  return request({
    url: '/basis/api/yarnTypes/destroy',
    method: 'post',
    data
  })
}

// 纱属性审核
export function sysDataGroupApprove(data) {
  return request({
    url: '/basis/api/yarnTypes/approve',
    method: 'post',
    data
  })
}

// 纱属性启用禁用
export function sysDataGroupEnabled(data) {
  return request({
    url: '/basis/api/yarnTypes/enabled',
    method: 'post',
    data
  })
}

// 纱属性页签
export function sysDataGroupCategory(data) {
  return request({
    url: '/basis/api/yarnTypes/category',
    method: 'post',
    data
  })
}

// 纱属性详情
export function sysDataGroupDetail(data) {
  return request({
    url: '/basis/api/yarnTypes/show',
    method: 'post',
    data
  })
}
// 属性组合，梳棉方法、纺纱方法、纱类下拉数据
export function attributeCombiningPopOpData(data) {
  return request({
    url: '/basis/api/yarnTypes/option',
    method: 'post',
    data
  })
}

