// 省市区页面API
import request from '@/utils/request'

// 分页查询省市区列表
export function provincePage(data = {}) {
  const defaultParams = { page: 1, pageSize: 20 }
  return request({
    url: '/basis/api/areas/index',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 省市区下拉
export function provinceSelect(data) {
  return request({
    url: '/basis/api/areas/option',
    method: 'post',
    data
  })
}
