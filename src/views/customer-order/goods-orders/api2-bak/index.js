/*
 * @Descripttion:
 * @Author: admin
 * @Date: 2021-03-04 14:03:07
 * @LastEditors: OBKoro1
 * @LastEditTime: 2021-04-12 17:43:39
 */
import request from '@/utils/request'

// 分页查询列表
export function list(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20, type: '2' }
  return request({
    url: '/customerOrder/coOrder/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}
// 销售团队下拉
export function sellTeamselect(data = {}) {
  return request({
    url: '/crm/sysOrg/list',
    method: 'post',
    data: { ...data }
  })
}
// 客服下拉
export function salerListselect(data = {}) {
  return request({
    url: '/customerOrder/colorModel/colorModelApply/salerList',
    method: 'post',
    data
  })
}
// 订单类型下拉
export function orderTypeselect(data = {}) {
  return request({
    // url: '/baseData/optionConfig/list',
    url: '/basis/api/optionConfig/option',
    method: 'post',
    data
  })
}
// 列表各个状态数量
export function orderStatusNum(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20, type: '2' }
  return request({
    url: '/customerOrder/coOrder/pageCount',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}
// 解hold
export function orderDeletHold(data = {}) {
  return request({
    url: '/customerOrder/coOrder/removeHold',
    method: 'post',
    data
  })
}

// 需求列表详情
export function guestneedDetail(data = {}) {
  return request({
    url: '/customerOrder/customerRequire/detail',
    method: 'post',
    data: { ...data }
  })
}
// 大货详情信息
export function getDetail(data = {}) {
  return request({
    url: '/customerOrder/coOrder/info',
    method: 'post',
    data: { ...data }
  })
}
// 花号分页列表
export function queryFlowerNoPage(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/customerOrder/soPrint/printApply/queryFlowerNoPage',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}
// 色布/印花布编码分页列表
export function querycolorFabricPage(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 10 }
  return request({
    url: '/customerOrder/coOrder/colorPrintCode',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 详情文件展示
export function fileListArray(data = {}) {
  const defaultParams = { 'bizType': 'ORDER' }
  return request({
    url: '/common/file/list',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 样板复制请求接口
export function gueCopyInfo(data = {}) {
  return request({
    url: '/customerOrder/coOrder/copyInfo',
    method: 'post',
    data: { ...data }
  })
}

// 下载文件 新
export function downFile(data = {}) {
  return request({
    url: `/common/file/download/${data}`,
    responseType: 'arraybuffer',
    method: 'get',
    params: {}
  })
}
// 下载文件 旧
export function downFilelog(data = {}) {
  return request({
    url: '/customerOrder/download',
    method: 'get',
    responseType: 'arraybuffer',
    params: data
  })
}
