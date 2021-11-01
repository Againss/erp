import request from '@/utils/request'
// 查询列表
export function holidaySetList(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/bmpAps/ltset/apsHolidaySet/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}
// 详细信息
export function holidaySetDetail(data) {
  return request({
    url: '/bmpAps/ltset/apsHolidaySet/info',
    method: 'post',
    data
  })
}

// 新增
export function holidaySetAdd(data) {
  return request({
    url: '/bmpAps/ltset/apsHolidaySet/add',
    method: 'post',
    data
  })
}
// 更新
export function holidaySetUpdate(data) {
  return request({
    url: '/bmpAps/ltset/apsHolidaySet/modify',
    method: 'post',
    data
  })
}
// 删除
export function holidaySetDelete(data) {
  return request({
    url: '/bmpAps/ltset/apsHolidaySet/delete',
    method: 'post',
    data
  })
}
// 启用、禁用短信提醒
export function holidaySetEnabled(data) {
  return request({
    url: '/bmpAps/ltset/apsHolidaySet/updateStatus',
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
// 已存在任务地点查询
export function existFactory(data) {
  return request({
    url: '/sysSettings/task/area/exist/factory',
    method: 'post',
    data
  })
}
