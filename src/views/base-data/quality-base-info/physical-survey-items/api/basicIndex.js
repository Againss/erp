import request from '@/utils/request'

// 纱线等级三个下拉框数据
export function yarnTypeSearch(data = {}) {
  return request({
    url: '/basis/openapi/yarnType/search',
    method: 'post',
    data
  })
}

// 成分下拉框数据
export function ingredientSearch(data = {}) {
  return request({
    url: '/basis/openapi/ingredient/search',
    method: 'post',
    data
  })
}

// 组合成分下拉框数据
export function assemblyIngredientSearch(data = {}) {
  return request({
    url: '/basis/openapi/assemblyIngredient/search',
    method: 'post',
    data
  })
}
