/*
 * @Descripttion: 织机
 * @version:
 * @Author: shujing
 * @Date: 2020-09-24 15:06:28
 * @LastEditors: shujing
 * @LastEditTime: 2020-10-20 13:43:52
 */

import request from '@/utils/request'

// 品牌列表数据
export function sysDataGroupIndex(data = {}) {
  const defaultParams = { page: 1, pageSize: 20 }
  return request({
    url: '/basis/api/loomBrands/index',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 品牌启用/禁用
export function sysDataGroupEnable(data) {
  return request({
    url: '/basis/api/loomBrands/enabled',
    method: 'post',
    data
  })
}

// 品牌新增保存
export function sysDataGroupAdd(data) {
  return request({
    url: '/basis/api/loomBrands/store',
    method: 'post',
    data
  })
}

// 品牌编辑保存
export function sysDataGroupModify(data) {
  return request({
    url: '/basis/api/loomBrands/update',
    method: 'post',
    data
  })
}

// 品牌删除
export function sysDataGroupDelete(data) {
  return request({
    url: '/basis/api/loomBrands/destroy',
    method: 'post',
    data
  })
}

// 品牌审核
export function sysDataGroupExam(data) {
  return request({
    url: '/basis/api/loomBrands/approve',
    method: 'post',
    data
  })
}

// 品牌编辑详情
export function sysDataGroupInfo(data) {
  return request({
    url: '/basis/api/loomBrands/show',
    method: 'post',
    data
  })
}

// 圆机列表数据
export function sysDataGroupIndexRound(data = {}) {
  const defaultParams = { page: 1, pageSize: 20 }
  return request({
    url: '/basis/api/loomCirculars/index',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 圆机启用/禁用
export function sysDataGroupEnableRound(data) {
  return request({
    url: '/basis/api/loomCirculars/enabled',
    method: 'post',
    data
  })
}

// 圆机新增保存
export function sysDataGroupAddRound(data) {
  return request({
    url: '/basis/api/loomCirculars/store',
    method: 'post',
    data
  })
}

// 圆机编辑保存
export function sysDataGroupModifyRound(data) {
  return request({
    url: '/basis/api//loomCirculars/update',
    method: 'post',
    data
  })
}

// 圆机删除
export function sysDataGroupDeleteRound(data) {
  return request({
    url: '/basis/api/loomCirculars/destroy',
    method: 'post',
    data
  })
}

// 圆机审核
export function sysDataGroupExamRound(data) {
  return request({
    url: '/basis/api/loomCirculars/approve',
    method: 'post',
    data
  })
}

// 圆机编辑详情
export function sysDataGroupInfoRound(data) {
  return request({
    url: '/basis/api/loomCirculars/show',
    method: 'post',
    data
  })
}
