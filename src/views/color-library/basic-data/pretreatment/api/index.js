/*
 * @Author: anthony
 * @Date: 2020-11-03 10:14:07
 * @LastEditors: anthony
 * @LastEditTime: 2020-11-17 16:11:01
 * @Descripttion: 基础数据-前处理api文件
 */
import request from '@/utils/request'
// 分页查询色系管理列表
export function pageList(data = {}) {
  const defaultParams = {
    page: 1,
    pageSize: 20
  }
  return request({
    url: '/color/api/colorBd/pretreatment',
    method: 'post',
    data: {
      ...defaultParams,
      ...data
    }
  })
}
// 新增
export function colorSystemAdd(data) {
  return request({
    url: '/color/api/colorBd/pretreatment/store',
    method: 'post',
    data
  })
}

// 点击编辑
export function colorSystemEdit(data) {
  return request({
    url: '/color/api/colorBd/pretreatment/show',
    method: 'post',
    data
  })
}

// 更新
export function colorSystemUpdate(data) {
  return request({
    url: '/color/api/colorBd/pretreatment/update',
    method: 'post',
    data
  })
}

// 删除
export function colorSystemDelete(data) {
  return request({
    url: '/color/api/colorBd/pretreatment/destroy',
    method: 'post',
    data
  })
}

// 审核
export function colorSystemApprove(data) {
  return request({
    url: '/color/api/colorBd/pretreatment/approve',
    method: 'post',
    data
  })
}

// 启用禁用
export function colorSystemEnabled(data) {
  return request({
    url: '/color/api/colorBd/pretreatment/enable',
    method: 'post',
    data
  })
}
