/*
 * @Descripttion:HS Code
 * @version:
 * @Author: shujing
 * @Date: 2020-09-23 13:55:19
 * @LastEditors: shujing
 * @LastEditTime: 2020-10-21 10:14:16
 */

import request from '@/utils/request'

// 列表数据
export function sysDataGroupIndex(data = {}) {
  const defaultParams = { page: 1, pageSize: 20 }
  return request({
    url: '/basis/api/hsCode/index',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 启用/禁用
export function sysDataGroupEnable(data) {
  return request({
    url: '/basis/api/hsCode/enabled',
    method: 'post',
    data
  })
}

// 新增保存
export function sysDataGroupAdd(data) {
  return request({
    url: '/basis/api/hsCode/store',
    method: 'post',
    data
  })
}

// 编辑保存
export function sysDataGroupModify(data) {
  return request({
    url: '/basis/api/hsCode/update',
    method: 'post',
    data
  })
}

// 删除
export function sysDataGroupDelete(data) {
  return request({
    url: '/basis/api/hsCode/destroy',
    method: 'post',
    data
  })
}

// 审核
export function sysDataGroupExam(data) {
  return request({
    url: '/basis/api/hsCode/approve',
    method: 'post',
    data
  })
}

// 编辑详情
export function sysDataGroupInfo(data) {
  return request({
    url: '/basis/api/hsCode/show',
    method: 'post',
    data
  })
}

// 织染方式下拉
export function sysSelectHscode(data) {
  return request({
    url: '/basis/api/knitDyes/option',
    method: 'post',
    data
  })
}
