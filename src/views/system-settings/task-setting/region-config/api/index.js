import request from '@/utils/request'
// 分页查询指派管理列表
export function regionPage(data = {}) {
  const defaultParams = { page: 1, pageSize: 20 }
  return request({
    url: '/sysSettings/task/area/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}
// 区域分页汇总
export function regionPageCount(data) {
  return request({
    url: '/sysSettings/task/area/pageCount',
    method: 'post',
    data
  })
}
// 工厂查询
export function taskList(data) {
  return request({
    url: '/srm/supplier/searchList',
    method: 'post',
    data
  })
}
// 区域详情查询
export function regionDetail(data) {
  return request({
    url: '/sysSettings/task/area/info',
    method: 'post',
    data
  })
}
// 已存在任务地点查询
export function existFactory(data) {
  return request({
    url: '/sysSettings/task/area/exist/factory',
    method: 'post',
    data
  })
}
// 新增
export function regionAdd(data) {
  return request({
    url: '/sysSettings/task/area/add',
    method: 'post',
    data
  })
}
// 更新
export function regionUpdate(data) {
  return request({
    url: '/sysSettings/task/area/modify',
    method: 'post',
    data
  })
}
// 删除
export function regionDelete(data) {
  return request({
    url: '/sysSettings/task/area/delete',
    method: 'post',
    data
  })
}
