/*
 * @Descripttion:
 * @version:
 * @Author: shujing
 * @Date: 2020-11-17 14:57:49
 * @LastEditors: admin
 * @LastEditTime: 2021-03-15 16:24:20
 */
import request from '@/utils/request'

// 列表
export function pageList(data = {}) {
  return request({
    url: '/customerOrder/customerRequire/page',
    method: 'post',
    data: { ...{ pageNum: 1, pageSize: 20 }, ...data }
  })
}
// 列表状态数量
export function ListNum(data = {}) {
  return request({
    url: '/customerOrder/customerRequire/countByStatus',
    method: 'post',
    data: { ...data }
  })
}
// 详情
export function pageDetail(data = {}) {
  return request({
    url: '/customerOrder/customerRequire/detail',
    method: 'post',
    data: { ...data }
  })
}
// 取消需求
export function cancelDemand(data = {}) {
  return request({
    url: '/customerOrder/customerRequire/cancel',
    method: 'post',
    data: { ...data }
  })
}
// 确认处理
export function confirmProcess(data = {}) {
  return request({
    url: '/customerOrder/customerRequire/handle',
    method: 'post',
    data: { ...data }
  })
}
// 确认取消
export function confirmCancel(data = {}) {
  return request({
    url: '/customerOrder/customerRequire/confirmCancel',
    method: 'post',
    data: { ...data }
  })
}
// 下载文件 新
export function downFile(data = {}) {
  return request({
    url: `/common/file/download/${data.url}`,
    responseType: 'arraybuffer',
    method: 'get',
    params: {}
  })
}
// 判断是否已经存在草稿状态开发单
export function confirmDraft(data = {}) {
  return request({
    url: '/customerOrder/coOrder/queryOrderIdByRequirementId',
    method: 'post',
    data: { ...data }
  })
}
// 判断是否已经存在草稿状态（备坯）
export function confirmDraftGrey(data = {}) {
  return request({
    url: '/customerOrder/coGreyOrder/queryOrderIdByRequirementId',
    method: 'post',
    data: { ...data }
  })
}
// 判断是否已经存在草稿状态(备纱)
export function confirmDraftYarn(data = {}) {
  return request({
    url: '/customerOrder/coYarnOrder/queryOrderIdByRequirementId',
    method: 'post',
    data: { ...data }
  })
}
// 操作日志
export function customerRequireLog(data = {}) {
  return request({
    url: '/customerOrder/customerRequire/log',
    method: 'post',
    data: { ...data }
  })
}
// 详情文件展示
export function fileListArray(data = {}) {
  // const defaultParams = { 'bizType': 'ORDER' }
  return request({
    url: '/common/file/list',
    method: 'post',
    data
    // data: { ...defaultParams, ids:['bf35ffca0a464a2888168626ca6d01ab.jpg'] }
  })
}

