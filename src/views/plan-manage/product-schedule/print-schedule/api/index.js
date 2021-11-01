/*
 * @Descripttion:印花SO生产进度
 * @Author: shujing
 * @Date: 2020-12-15 10:08:08
 * @LastEditors: admin
 * @LastEditTime: 2021-01-27 14:33:07
 */
import request from '@/utils/request'
// 列表
export function pageList(data = {}) {
  return request({
    url: '/aps/soPrint/printProduceProgress/page',
    method: 'post',
    data: { ...{ pageNum: 1, pageSize: 20 }, ...data }
  })
}
// 删除
export function soPrintDelete(data = {}) {
  return request({
    url: '/aps/soPrint/printProduceProgress/delete',
    method: 'post',
    data: { ...data }
  })
}
// 详情
export function soPrintDetail(data = {}) {
  return request({
    url: '/aps/soPrint/printProduceProgress/info',
    method: 'post',
    data: { ...data }
  })
}
// 印花厂详情
export function soPrintFactoryDetail(data = {}) {
  return request({
    url: '/aps/soPrint/printProduceProgress/getFactory',
    method: 'post',
    data: { ...data }
  })
}
// 生产进度下拉
export function soPrintTypeDown(data = {}) {
  return request({
    url: '/baseData/soPrint/printProcessConf/list',
    method: 'post',
    data: { ...data }
  })
}
// 生产进度保存
export function soPrintProcessSave(data = {}) {
  return request({
    url: '/aps/soPrint/printProduceProgress/add/progress',
    method: 'post',
    data: { ...data }
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
// 客户审批保存 印花生产进度-选择工厂
export function soPrintFactorySave(data = {}) {
  return request({
    url: '/aps/soPrint/printProduceProgress/add/fac',
    method: 'post',
    data: { ...data }
  })
}
