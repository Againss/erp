import request from '@/utils/request'

// 备纱单详情
export function yarnPlanOrderInfo(data = {}) {
  return request({
    url: '/aps/yarnPlanOrder/info',
    method: 'post',
    data
  })
}

// 备纱单保存
export function yarnPlanOrderSave(data = {}) {
  return request({
    url: '/aps/yarnPlanOrder/save',
    method: 'post',
    data
  })
}

// 抽纱详情信息
export function grayYarnInfo(data = {}) {
  return request({
    url: '/aps/grayYarn/info',
    method: 'post',
    data
  })
}

// 抽纱详情纱库存列表
export function grayYarnStockList(data = {}) {
  return request({
    url: '/aps/grayYarn/stockList',
    method: 'post',
    data
  })
}

// 抽纱划扣
export function grayYarnAddRecord(data = {}) {
  return request({
    url: '/aps/grayYarn/addRecord',
    method: 'post',
    data
  })
}

// 备纱单变更
export function yarnPlanOrderAlter(data = {}) {
  return request({
    url: '/aps/yarnPlanOrder/alter',
    method: 'post',
    data
  })
}

// 备纱单查看明细划扣记录
export function grayYarnRecordList(data = {}) {
  return request({
    url: '/aps/grayYarn/recordList',
    method: 'post',
    data
  })
}

// 备纱单-抽纱详情信息
export function yarnPlanOrderInfoList(data = {}) {
  return request({
    url: '/aps/yarnPlanOrder/infoList',
    method: 'post',
    data
  })
}
