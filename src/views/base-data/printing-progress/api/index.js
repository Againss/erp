/*
 * @Author: xj
 * @Description: 基础数据》印花进度
 * @Date: 2020-12-10 11:12:28
 * @LastEditors: OBKoro1
 * @LastEditTime: 2020-12-17 19:04:32
 */
import request from '@/utils/request'
// 印花列表查询
export function sysDataGroupPage(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/baseData/soPrint/printProcessConf/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}
// 印花按钮新增
export function countryAdd(data) {
  return request({
    url: '/baseData/soPrint/printProcessConf/add',
    method: 'post',
    data
  })
}
// 印花列表 编辑
export function countryUpdate(data) {
  return request({
    url: '/baseData/soPrint/printProcessConf/modify',
    method: 'post',
    data
  })
}
// 印花列表审核
export function sysDataGroupApprove(data) {
  return request({
    url: '/baseData/soPrint/printProcessConf/opare',
    method: 'post',
    data
  })
}
// 印花启用禁用
export function sysDataGroupEnabled(data) {
  return request({
    url: '/baseData/soPrint/printProcessConf/isEnable',
    method: 'post',
    data
  })
}
// 删除印花
export function sysDataGroupDelete(data) {
  return request({
    url: '/baseData/soPrint/printProcessConf/delete',
    method: 'post',
    data
  })
}
// 编辑--查看
export function countryDetail(data) {
  return request({
    url: '/baseData/soPrint/printProcessConf/info',
    method: 'post',
    data
  })
}

