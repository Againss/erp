import request from '@/utils/request'

// 抽纱详情
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

// 抽纱详情弹出框确定划扣
export function grayYarnAddRecord(data = {}) {
  return request({
    url: '/aps/grayYarn/addRecord',
    method: 'post',
    data
  })
}

// 抽纱详情完成抽纱
export function grayYarnConfirmDone(data = {}) {
  return request({
    url: '/aps/grayYarn/confirmDone',
    method: 'post',
    data
  })
}

// 抽纱分页重新抽纱
export function grayYarnRedo(data = {}) {
  return request({
    url: '/aps/grayYarn/redo',
    method: 'post',
    data
  })
}

