import request from '@/utils/request'
// 查询列表
export function specialSetList(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/bmpAps/ltset/apsSpecialHandlerLtSet/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}
// 详情查询
export function specialSetDetail(data) {
  return request({
    url: '/bmpAps/ltset/apsSpecialHandlerLtSet/info',
    method: 'post',
    data
  })
}
// 新增
export function specialSetAdd(data) {
  return request({
    url: '/bmpAps/ltset/apsSpecialHandlerLtSet/add',
    method: 'post',
    data
  })
}
// 更新
export function specialSetUpdate(data) {
  return request({
    url: '/bmpAps/ltset/apsSpecialHandlerLtSet/modify',
    method: 'post',
    data
  })
}
// 删除
export function specialSetDelete(data) {
  return request({
    url: '/bmpAps/ltset/apsSpecialHandlerLtSet/delete',
    method: 'post',
    data
  })
}
// 启用、禁用
export function specialSetEnabled(data) {
  return request({
    url: '/bmpAps/ltset/apsSpecialHandlerLtSet/updateStatus',
    method: 'post',
    data
  })
}

// c查看印花下拉框
export function requirementsPrinting(data) {
  const defaultParams = { page: 1, pageSize: 100 }
  return request({
    url: 'basis/api/requirementsPrinting/index',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}
// c查看染整下拉框
export function requirementsDye(data) {
  const defaultParams = { page: 1, pageSize: 100 }
  return request({
    url: 'basis/api/requirementsDye/index',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}
