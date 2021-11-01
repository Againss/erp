import request from '@/utils/request'
// 损耗订单查询
export function grayclothList(data = {}) {
  return request({
    url: '/aps/grayClothLoan/grey/list',
    method: 'post',
    data: { ...data }
  })
}

// 坯布库存查询
export function grayclothStockQuery(data = {}) {
  return request({
    url: '/aps/grayClothLoan/stock/query',
    method: 'post',
    data: { ...data }
  })
}

// 借调新增
export function grayclothSave(data = {}) {
  return request({
    url: '/aps/grayClothLoan/add',
    method: 'post',
    data: { ...data }
  })
}

// 借调列表划扣重量编辑
export function grayclothUpdate(data = {}) {
  return request({
    url: '/aps/grayClothLoan/update',
    method: 'post',
    data: { ...data }
  })
}

