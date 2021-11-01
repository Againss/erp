import request from '@/utils/request'

// 分页查询 待复期
export function unrepeatList(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/aps/planSchedule/unrepeat/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}
// 分页查询
export function pageList(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/aps/planSchedule/repeated/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}
// 待复期分录list
export function getSuBpageList(data = {}) {
  return request({
    url: '/aps/planSchedule/unrepeat/list',
    method: 'post',
    data
  })
}
// 更新计划排序明细
export function updateDetail(data = {}) {
  return request({
    url: '/aps/planSchedule/updateApsPlanScheduleDetail',
    method: 'post',
    data
  })
}
// 交期确认
export function deliveryConfirm(data = {}) {
  return request({
    url: '/aps/planSchedule/deliveryConfirm',
    method: 'post',
    data
  })
}
// 下发生成生产需求 //已复期 下发所选
export function planScheduleSend(data = {}) {
  return request({
    url: '/aps/planSchedule/send',
    method: 'post',
    data
  })
}
// 下发生成生产需求 //已复期 取消交期确认
export function cancelDeliveried(data = {}) {
  return request({
    url: '/aps/planSchedule/cancelDeliveried',
    method: 'post',
    data
  })
}
// 发送纱期
export function sendYarnDate(data = {}) {
  return request({
    url: '/aps/planSchedule/sendYarnDate',
    method: 'post',
    data
  })
}
// 发送纱期
export function getPlanSchedule(data = {}) {
  return request({
    url: '/aps/planSchedule/getPlan',
    method: 'post',
    data
  })
}
