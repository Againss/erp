import request from '@/utils/request'

// 分页查询列表
export function list(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/baseData/lossSetting/baseWeaveYarn/list',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 添加
export function add(data) {
  return request({
    url: '/baseData/lossSetting/baseWeaveYarn/add',
    method: 'post',
    data
  })
}

// 修改
export function modify(data) {
  return request({
    url: '/baseData/lossSetting/baseWeaveYarn/modify',
    method: 'post',
    data
  })
}

// 删除
export function del(data) {
  return request({
    url: '/baseData/lossSetting/baseWeaveYarn/delete',
    method: 'post',
    data
  })
}

// 查询详情
export function detail(data) {
  return request({
    url: '/baseData/lossSetting/baseWeaveYarn/info',
    method: 'post',
    data
  })
}

// 启动禁用
export function isEnable(data) {
  return request({
    url: '/baseData/lossSetting/baseWeaveYarn/status',
    method: 'post',
    data
  })
}

// 组合成分下拉--中文组合下拉
export function combinedSelect(data) {
  return request({
    url: '/basis/api/ingredients/index',
    method: 'post',
    data
  })
}

// 组合成分-下拉
export function assemblyIngredientSelect(data = {}) {
  return request({
    url: '/basis/api/assemblyIngredients/index',
    method: 'post',
    data: data
  })
}

