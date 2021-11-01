import request from '@/utils/request'

// 分页查询列表
export function page(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/aps/loss/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 分页查询count
export function count(data) {
  const defaultParams = { pageNum: 1, pageSize: 20, orderStatus: '' }
  return request({
    url: '/aps/loss/page/count',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

export function refresh(data) {
  return request({
    url: '/aps/loss/refresh',
    method: 'post',
    data
  })
}

// 查询详情
export function detail(data) {
  return request({
    url: '/aps/loss/info',
    method: 'post',
    data
  })
}

export function confirm(data) {
  return request({
    url: '/aps/loss/confirm',
    method: 'post',
    data
  })
}

