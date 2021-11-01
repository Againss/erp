import request from '@/utils/request'
// 分页查询坯布列表
export function fabricsPage(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/baseData/qa/greigeConfig/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}
// 新增
export function fabricsAdd(data) {
  return request({
    url: '/baseData/qa/greigeConfig/add',
    method: 'post',
    data
  })
}
// 更新
export function fabricsUpdate(data) {
  return request({
    url: '/baseData/qa/greigeConfig/modify',
    method: 'post',
    data
  })
}
// 删除
export function fabricsDelete(data) {
  return request({
    url: '/baseData/qa/greigeConfig/delete',
    method: 'post',
    data
  })
}
// 查询详情
export function fabricsDetail(data) {
  return request({
    url: '/baseData/qa/greigeConfig/info',
    method: 'post',
    data
  })
}
// 审核
export function fabricsEnabled(data) {
  return request({
    url: '/baseData/qa/greigeConfig/isEnabled',
    method: 'post',
    data
  })
}
// 启用禁用
export function fabricsCheck(data) {
  return request({
    url: '/baseData/qa/greigeConfig/check',
    method: 'post',
    data
  })
}
// 获取最大顺序
export function ordersMax(data) {
  return request({
    url: '/baseData/qa/greigeConfig/ordersMax',
    method: 'post',
    data
  })
}
