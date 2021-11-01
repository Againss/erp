// 组合成分页面API
import request from '@/utils/request'

// 分页查询
export function combinedList(data = {}) {
  const defaultParams = { page: 1, pageSize: 20 }
  return request({
    url: '/basis/api/assemblyIngredients/index',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 新增
export function combinedAdd(data) {
  return request({
    url: '/basis/api/assemblyIngredients/store',
    method: 'post',
    data
  })
}

// 编辑
export function combinedEdit(data) {
  return request({
    url: '/basis/api/assemblyIngredients/show',
    method: 'post',
    data
  })
}

// 更新
export function combinedUpdate(data) {
  return request({
    url: '/basis/api/assemblyIngredients/update',
    method: 'post',
    data
  })
}

// 删除
export function combinedDelete(data) {
  return request({
    url: '/basis/api/assemblyIngredients/destroy',
    method: 'post',
    data
  })
}

// 审核
export function combinedApprove(data) {
  return request({
    url: '/basis/api/assemblyIngredients/approve',
    method: 'post',
    data
  })
}

// 启用禁用
export function combinedEnabled(data) {
  return request({
    url: '/basis/api/assemblyIngredients/enabled',
    method: 'post',
    data
  })
}

// 组合成分下拉--中文组合下拉
export function combinedSelect(data) {
  return request({
    url: '/basis/api/ingredients/option',
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

