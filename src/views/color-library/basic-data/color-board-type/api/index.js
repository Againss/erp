/*
 * @Date: 2020-11-03 10:06:26
 * @Author: Againss
 * @LastEditTime: 2020-11-17 16:05:43
 * @LastEditors: Againss
 * @Descripttion: 色板类型
 */
import request from '@/utils/request'

// 列表
export function pageList(data = {}) {
  return request({
    url: '/color/api/colorBd/colorPlateType',
    method: 'post',
    data: { ...data }
  })
}
// 禁用启用
export function enabled(data = {}) {
  return request({
    url: '/color/api/colorBd/colorPlateType/enable',
    method: 'post',
    data: { ...data }
  })
}
// 删除
export function destroy(data = {}) {
  return request({
    url: '/color/api/colorBd/colorPlateType/destroy',
    method: 'post',
    data: { ...data }
  })
}
// 新增
export function store(data = {}) {
  return request({
    url: '/color/api/colorBd/colorPlateType/store',
    method: 'post',
    data: { ...data }
  })
}
// 审核
export function approve(data = {}) {
  return request({
    url: '/color/api/colorBd/colorPlateType/approve',
    method: 'post',
    data: { ...data }
  })
}

// 编辑
export function update(data = {}) {
  return request({
    url: '/color/api/colorBd/colorPlateType/update',
    method: 'post',
    data: { ...data }
  })
}

