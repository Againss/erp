/*
 * @Descripttion:
 * @Author: admin
 * @Date: 2021-03-04 14:03:07
 * @LastEditors: OBKoro1
 * @LastEditTime: 2021-03-29 18:54:51
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

