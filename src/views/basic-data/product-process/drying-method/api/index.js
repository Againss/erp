/*
 * @Date: 2020-12-31 10:30:44
 * @Author: Againss
 * @LastEditTime: 2021-01-04 19:27:58
 * @LastEditors: Againss
 * @Descripttion:干燥方式
 */
import request from '@/utils/request'
// 分页查询色系管理列表
export function pageList(data = {}) {
  const defaultParams = {
    page: 1,
    pageSize: 20
  }
  return request({
    url: `/basis/api/dryingMethod/index`,
    method: 'post',
    data: {
      ...defaultParams,
      ...data
    }
  })
}
// 新增
export function dryingMethodAdd(data) {
  return request({
    url: `/basis/api/dryingMethod/store`,
    method: 'post',
    data
  })
}

// 点击编辑
export function dryingMethodEdit(data) {
  return request({
    url: `/basis/api/dryingMethod/show`,
    method: 'post',
    data
  })
}

// 更新
export function dryingMethodUpdate(data) {
  return request({
    url: `/basis/api/dryingMethod/update`,
    method: 'post',
    data
  })
}

// 删除
export function dryingMethodDelete(data) {
  return request({
    url: `/basis/api/dryingMethod/destroy`,
    method: 'post',
    data
  })
}

// 审核
export function dryingMethodApprove(data) {
  return request({
    url: `/basis/api/dryingMethod/approve`,
    method: 'post',
    data
  })
}

// 启用禁用
export function dryingMethodEnabled(data) {
  return request({
    url: `/basis/api/dryingMethod/enabled`,
    method: 'post',
    data
  })
}
