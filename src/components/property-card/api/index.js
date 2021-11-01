import request from '@/utils/request'

export function info(params) {
  return request({
    url: '/common/generic/product/detail/' + params,
    method: 'post'
  })
}
