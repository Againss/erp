// 成分大类页面API
import request from '@/utils/request'

// 分页查询--成分大类搜索
export function categoriesList(data = {}) {
  const defaultParams = { page: 1, pageSize: 20 }
  return request({
    url: '/basis/api/categories/index',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 新增
export function categoriesAdd(data) {
  return request({
    url: '/basis/api/categories/store',
    method: 'post',
    data
  })
}

// 点击编辑
export function categoriesEdit(data) {
  return request({
    url: '/basis/api/categories/show',
    method: 'post',
    data
  })
}

// 更新
export function categoriesUpdate(data) {
  return request({
    url: '/basis/api/categories/update',
    method: 'post',
    data
  })
}

// 删除
export function categoriesDelete(data) {
  return request({
    url: '/basis/api/categories/destroy',
    method: 'post',
    data
  })
}

// 审核
export function categoriesApprove(data) {
  return request({
    url: '/basis/api/categories/approve',
    method: 'post',
    data
  })
}

// 启用禁用
export function categoriesEnabled(data) {
  return request({
    url: '/basis/api/categories/enabled',
    method: 'post',
    data
  })
}
