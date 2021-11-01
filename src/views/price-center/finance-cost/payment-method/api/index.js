// 选项配置-公证行页面API
import request from '@/utils/request'

// 分页查询公证行列表
export function paymentMethodPage(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/priceCenter/paymentMethod/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 新增
export function paymentMethodAdd(data) {
  return request({
    url: '/priceCenter/paymentMethod/add',
    method: 'post',
    data
  })
}

// 编辑--详情
export function paymentMethodDetail(data) {
  return request({
    url: '/priceCenter/paymentMethod/info',
    method: 'post',
    data
  })
}

// 修改
export function paymentMethodModify(data) {
  return request({
    url: '/priceCenter/paymentMethod/modify',
    method: 'post',
    data
  })
}

// 删除
export function paymentMethodDelete(data) {
  return request({
    url: '/priceCenter/paymentMethod/delete',
    method: 'post',
    data
  })
}

// 启用禁用
export function paymentMethodEnabled(data) {
  return request({
    url: '/priceCenter/paymentMethod/status',
    method: 'post',
    data
  })
}

