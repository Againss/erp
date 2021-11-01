/*
 * @Description: 基础数据-色级api文件
 * @Autor: zhengjin
 * @Date: 2021-06-18 09:33:23
 * @LastEditors: zhengjin
 * @LastEditTime: 2021-06-18 16:35:47
 */

import request from '@/utils/request'

// 分页查询色系管理列表
export function pageList(data = {}) {
  return request({
    url: '/basis/api/colorGrade/index',
    method: 'post',
    data: {
      ...data
    }
  })
}
// 新增
export function colorSystemAdd(data) {
  return request({
    url: '/basis/api/colorGrade/store',
    method: 'post',
    data
  })
}

// 点击编辑
export function colorSystemEdit(data) {
  return request({
    url: '/basis/api/colorGrade/show',
    method: 'post',
    data
  })
}

// 更新
export function colorSystemUpdate(data) {
  return request({
    url: '/basis/api/colorGrade/update',
    method: 'post',
    data
  })
}

// 删除
export function colorSystemDelete(data) {
  return request({
    url: '/basis/api/colorGrade/destroy',
    method: 'post',
    data
  })
}

// 审核
export function colorSystemApprove(data) {
  return request({
    url: '/basis/api/colorGrade/approve',
    method: 'post',
    data
  })
}

// 启用禁用
export function colorSystemEnabled(data) {
  return request({
    url: '/basis/api/colorGrade/enabled',
    method: 'post',
    data
  })
}
