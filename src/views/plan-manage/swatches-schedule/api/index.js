/*
 * @Author: ll
 * @Date: 2021-01-12 11:54:02
 * @LastEditTime: 2021-01-27 14:26:10
 * @LastEditors: admin
 * @Description: 色板生产进度api
 */

import request from '@/utils/request'
// 列表
export function pageList(data = {}) {
  return request({
    url: '/aps/colorModel/schedule/page',
    method: 'post',
    data: { ...{ pageNum: 1, pageSize: 20 }, ...data }
  })
}
// 删除
export function colorModelDelete(id) {
  return request({
    url: `/aps/colorModel/schedule/delete/${id}`,
    method: 'post'
  })
}
// 详情
export function colorDetail(data = {}) {
  return request({
    url: '/aps/colorModel/schedule/info',
    method: 'post',
    data: { ...data }
  })
}
// 选择工厂
export function colorFactorySave(data = {}) {
  return request({
    url: '/aps/colorModel/schedule/addDyeFactory',
    method: 'post',
    data: { ...data }
  })
}
// 生产进度下拉
export function colorProduceDown(data = {}) {
  return request({
    url: '/baseData/colorModel/colorModelScheduleConf/list',
    method: 'post',
    data: { ...data }
  })
}
// 生产进度保存
export function colorProcessSave(data = {}) {
  return request({
    url: '/aps/colorModel/schedule/updateSchedule',
    method: 'post',
    data: { ...data }
  })
}
// 批量更新弹框详情
export function colorOrderDetail(data = {}) {
  return request({
    url: '/aps/colorModel/schedule/customerColorList',
    method: 'post',
    data: { ...data }
  })
}
// 批量更新保存
export function colorOrderSave(data = {}) {
  return request({
    url: '/aps/colorModel/schedule/batchUpdateSchedule',
    method: 'post',
    data: { ...data }
  })
}
// 收样记录
export function colorDemoSave(data) {
  return request({
    url: '/aps/colorModel/schedule/receiveRecords',
    method: 'post',
    data: data
  })
}
// 客户审核
export function colorExameSave(data) {
  return request({
    url: '/aps/colorModel/schedule/customerCheck',
    method: 'post',
    data: data
  })
}

// 客户审批保存
export function soPrintExamineSave(data = {}) {
  return request({
    url: '/aps/soPrint/printProduceProgress/customer/check',
    method: 'post',
    data: { ...data }
  })
}

