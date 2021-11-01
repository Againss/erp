import request from '@/utils/request'

// 查询销售目标完成情况
export function querySalesTargetHistogram(data) {
  return request({
    url: '/crm/statistics/querySalesTargetHistogram',
    method: 'post',
    data
  })
}

// 查询商机阶段 漏斗
export function queryBusinessStageBucket(data) {
  return request({
    url: '/crm/statistics/queryBusinessStageBucket',
    method: 'post',
    data
  })
}

// 查询商机销售金额 排行榜
export function queryBusinessStageHistogram(data) {
  return request({
    url: '/crm/statistics/queryBusinessStageHistogram',
    method: 'post',
    data
  })
}

// 查询商机销售金额 趋势
export function querySalesAmountsLine(data) {
  return request({
    url: '/crm/statistics/querySalesAmountsLine',
    method: 'post',
    data
  })
}

// 查询今日昨天新增数据
export function queryStatictisData(data) {
  return request({
    url: '/crm/statistics/queryStatictisData',
    method: 'post',
    data
  })
}

// 查询组织机构
export function sysOrgList(data) {
  return request({
    url: '/crm/sysOrg/list',
    method: 'post',
    data
  })
}

// 查询人员
export function sysUserList(data) {
  return request({
    url: '/crm/sysUser/list',
    method: 'post',
    data
  })
}
