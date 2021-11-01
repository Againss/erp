import request from '@/utils/request'

// 生产分页查询列表
export function produceRequirePage(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 5 }
  return request({
    url: '/aps/produceRequire/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 生产下发操作
export function produceRequireSend(data = {}) {
  return request({
    url: '/aps/produceRequire/send',
    method: 'post',
    data
  })
}

// 采购分页查询列表
export function purchaseRequirePage(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/aps/purchaseRequire/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 采购下发操作
export function purchaseRequireSend(data = {}) {
  return request({
    url: '/aps/purchaseRequire/send',
    method: 'post',
    data
  })
}
