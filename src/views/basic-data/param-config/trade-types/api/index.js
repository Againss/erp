/*
 * @Descripttion: 往来户类别
 * @version:
 * @Author: shujing
 * @Date: 2020-09-24 15:06:28
 * @LastEditors: shujing
 * @LastEditTime: 2020-10-20 13:46:08
 */

import request from '@/utils/request'

// 列表数据
export function sysDataGroupIndex(data = {}) {
  const defaultParams = { page: 1, pageSize: 20 }
  return request({
    url: '/basis/api/currentUser/index',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 启用/禁用
export function sysDataGroupEnable(data) {
  return request({
    url: '/basis/api/currentUser/enabled',
    method: 'post',
    data
  })
}

// 新增保存
export function sysDataGroupAdd(data) {
  return request({
    url: '/basis/api/currentUser/store',
    method: 'post',
    data
  })
}

// 编辑保存
export function sysDataGroupModify(data) {
  return request({
    url: '/basis/api/currentUser/update',
    method: 'post',
    data
  })
}

// 删除
export function sysDataGroupDelete(data) {
  return request({
    url: '/basis/api/currentUser/destroy',
    method: 'post',
    data
  })
}

// 审核
export function sysDataGroupExam(data) {
  return request({
    url: '/basis/api/currentUser/approve',
    method: 'post',
    data
  })
}

// 编辑详情
export function sysDataGroupInfo(data) {
  return request({
    url: '/basis/api/currentUser/show',
    method: 'post',
    data
  })
}

