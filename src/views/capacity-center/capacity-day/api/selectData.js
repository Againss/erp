import request from '@/utils/request'

// 纱属性
export function getYarnTypes(data = {}) {
  const defaultParams = { page: 1, pageSize: 100, enabled: 'Y', ...data }
  return request({
    url: '/basis/openapi/yarnType/search',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}
// 组合成份
export function combinedList(data = {}) {
  const defaultParams = { page: 1, pageSize: 100, enabled: 'Y' }
  return request({
    url: '/basis/openapi/assemblyIngredient/search',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}
// 组合成分-下拉
export function assemblyIngredientSelect(data = {}) {
  return request({
    url: '/basis/api/assemblyIngredients/option',
    method: 'post',
    data: data
  })
}

// 成分
export function componentList(data = {}) {
  const defaultParams = { page: 1, pageSize: 100, enabled: 'Y' }
  return request({
    url: '/basis/openapi/ingredient/search',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}
// 染整工艺
export function requirementsDyeList(data = {}) {
  const defaultParams = { page: 1, pageSize: 500, enabled: 'Y' }
  return request({
    url: '/basis/openapi/requirementDye/search',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}
// 印花工艺
export function requirementsPrintingList(data = {}) {
  const defaultParams = { page: 1, pageSize: 100, enabled: 'Y' }
  return request({
    url: '/basis/openapi/requirementPrinting/search',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}
