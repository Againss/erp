import request from '@/utils/request'

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
