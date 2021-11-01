import request from '@/utils/request'
// 分页查询指派管理列表
export function assignPage(data = {}) {
  const defaultParams = { page: 1, pageSize: 20 }
  return request({
    url: '/sysSettings/task/outworker/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}
// 指派管理分页汇总
export function assignPageCount(data) {
  return request({
    url: '/sysSettings/task/outworker/pageCount',
    method: 'post',
    data
  })
}
// 区域列表
export function areaList(data) {
  return request({
    url: '/sysSettings/task/area/list',
    method: 'post',
    data
  })
}
// 外勤人员查询(搜索)
export function searchOutworkerList(data) {
  return request({
    url: '/sysSettings/task/outworker/condition/list',
    method: 'post',
    data
  })
}
// 外勤人员查询(弹框)
export function outworkerList(data) {
  return request({
    url: '/userCenter/sysUser/list',
    method: 'post',
    data
  })
}
// 外勤人员查询
export function outworkerDetail(data) {
  return request({
    url: '/sysSettings/task/outworker/info',
    method: 'post',
    data
  })
}
// 新增
export function assignAdd(data) {
  return request({
    url: '/sysSettings/task/outworker/add',
    method: 'post',
    data
  })
}
// 更新
export function assignUpdate(data) {
  return request({
    url: '/sysSettings/task/outworker/modify',
    method: 'post',
    data
  })
}
// 删除
export function assignDelete(data) {
  return request({
    url: '/sysSettings/task/outworker/delete',
    method: 'post',
    data
  })
}
// 启用、禁用短信提醒
export function assignEnabled(data) {
  return request({
    url: '/sysSettings/task/outworker/enableSms',
    method: 'post',
    data
  })
}
