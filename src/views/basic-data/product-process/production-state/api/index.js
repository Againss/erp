/*
 * @Descripttion: 生产状态
 * @version:
 * @Author: shujing
 * @Date: 2020-09-25 11:05:11
 * @LastEditors: shujing
 * @LastEditTime: 2020-10-20 13:42:29
 */

import request from '@/utils/request'

// 列表数据
export function sysDataGroupIndex(data = {}) {
  const defaultParams = { page: 1, pageSize: 20 }
  return request({
    url: '/basis/api/produceStates/index',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 启用/禁用
export function sysDataGroupEnable(data) {
  return request({
    url: '/basis/api/produceStates/enabled',
    method: 'post',
    data
  })
}

// 新增保存
export function sysDataGroupAdd(data) {
  return request({
    url: '/basis/api/produceStates/store',
    method: 'post',
    data
  })
}

// 编辑保存
export function sysDataGroupModify(data) {
  return request({
    url: '/basis/api/produceStates/update',
    method: 'post',
    data
  })
}

// 删除
export function sysDataGroupDelete(data) {
  return request({
    url: '/basis/api/produceStates/destroy',
    method: 'post',
    data
  })
}

// 审核
export function sysDataGroupExam(data) {
  return request({
    url: '/basis/api/produceStates/approve',
    method: 'post',
    data
  })
}

// 排序
export function sysDataGroupsort(data) {
  return request({
    url: '/basis/api/produceStates/sort',
    method: 'post',
    data
  })
}
// 编辑详情
export function sysDataGroupInfo(data) {
  return request({
    url: '/basis/api/produceStates/show',
    method: 'post',
    data
  })
}

