
import request from '@/utils/request'
// 列表查询
export function list(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/baseData/baseDeliverySet/list',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 列表 编辑
export function modify(data) {
  return request({
    url: '/baseData/baseDeliverySet/modify',
    method: 'post',
    data
  })
}

// 编辑--查看
export function detail(data) {
  return request({
    url: '/baseData/baseDeliverySet/info',
    method: 'post',
    data
  })
}

