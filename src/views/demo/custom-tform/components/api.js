import request from '@/utils/request'

export function countryPage(data = {}) {
  const defaultParams = { page: 1, pageSize: 10 }
  return request({
    url: '/basis/api/countries/index',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}
