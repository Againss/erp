/*
 * @Date: 2020-11-03 10:06:26
 * @Author: Againss
 * @LastEditTime: 2020-11-17 16:10:45
 * @LastEditors: Againss
 * @Descripttion: 色号管理
 */
import request from '@/utils/request'

// 列表
export function pageList(data = {}) {
  return request({
    url: '/color/api/color/colorManage',
    method: 'post',
    data: { ...{ page: 1, pageSize: 20 }, ...data }
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
// 审核
export function approve(data = {}) {
  return request({
    url: '/color/api/color/colorManage/approve',
    method: 'post',
    data: { ...data }
  })
}
// 禁用启用
export function enabled(data = {}) {
  return request({
    url: '/color/api/color/colorManage/enabled',
    method: 'post',
    data: { ...data }
  })
}
// 工艺要求
export function requirementList(data = {}) {
  return request({
    url: '/color/api/bd/requirement/all',
    method: 'post',
    data: { ...data }
  })
}
