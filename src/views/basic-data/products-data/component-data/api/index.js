// 成分页面API
import request from '@/utils/request'

// 分页查询--成分搜索
export function componentList(data = {}) {
  const defaultParams = { page: 1, pageSize: 20 }
  return request({
    url: '/basis/api/ingredients/index',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 成分列表详情
export function componentDetail(data) {
  return request({
    url: '/basis/api/ingredients/show',
    method: 'post',
    data
  })
}

// 新增
export function componentAdd(data) {
  return request({
    url: '/basis/api/ingredients/store',
    method: 'post',
    data
  })
}

// 更新
export function componentUpdate(data) {
  return request({
    url: '/basis/api/ingredients/update',
    method: 'post',
    data
  })
}

// 删除
export function componentDelete(data) {
  return request({
    url: '/basis/api/ingredients/destroy',
    method: 'post',
    data
  })
}

// 审核
export function componentApprove(data) {
  return request({
    url: '/basis/api/ingredients/approve',
    method: 'post',
    data
  })
}

// 损耗分类
export function wastageCategory(data) {
  return request({
    url: '/basis/api/wastageCategory/option',
    method: 'post',
    data
  })
}

// 启用禁用
export function componentEnabled(data) {
  return request({
    url: '/basis/api/ingredients/enabled',
    method: 'post',
    data
  })
}

// 成分大类的下拉
export function componentSelect(data) {
  return request({
    url: '/basis/api/categories/option',
    method: 'post',
    data
  })
}

// 成分分类的API
// 分页查询--成分搜索
export function classifyList(data = {}) {
  const defaultParams = { page: 1, pageSize: 20 }
  return request({
    url: '/basis/api/classifications/index',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 成分列表详情
export function classifyDetail(data) {
  return request({
    url: '/basis/api/classifications/show',
    method: 'post',
    data
  })
}

// 新增
export function classifyAdd(data) {
  return request({
    url: '/basis/api/classifications/store',
    method: 'post',
    data
  })
}

// 更新
export function classifyUpdate(data) {
  return request({
    url: '/basis/api/classifications/update',
    method: 'post',
    data
  })
}

// 删除
export function classifyDelete(data) {
  return request({
    url: '/basis/api/classifications/destroy',
    method: 'post',
    data
  })
}

// 审核
export function classifyApprove(data) {
  return request({
    url: '/basis/api/classifications/approve',
    method: 'post',
    data
  })
}

// 启用禁用
export function classifyEnabled(data) {
  return request({
    url: '/basis/api/classifications/enabled',
    method: 'post',
    data
  })
}

// 成分分类的下拉
export function classifySelect(data) {
  return request({
    url: '/basis/api/classifications/option',
    method: 'post',
    data
  })
}
