// 印花证书页面API
import request from '@/utils/request'

// 分页查询印花证书列表
export function afterfinishingLossPage(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/priceCenter/afterfinishLoss/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 新增
export function afterfinishingLossList(data) {
  return request({
    url: '/priceCenter/afterfinishLoss/optionsFilled',
    method: 'post',
    data
  })
}

// 新增
export function afterfinishingLossAdd(data) {
  return request({
    url: '/priceCenter/afterfinishLoss/add',
    method: 'post',
    data
  })
}

// 编辑--详情
export function afterfinishingLossDetail(data) {
  return request({
    url: '/priceCenter/afterfinishLoss/info',
    method: 'post',
    data
  })
}

// 修改
export function afterfinishingLossModify(data) {
  return request({
    url: '/priceCenter/afterfinishLoss/modify',
    method: 'post',
    data
  })
}

// 删除
export function afterfinishingLossDelete(data) {
  return request({
    url: '/priceCenter/afterfinishLoss/delete',
    method: 'post',
    data
  })
}

// 启用禁用
export function afterfinishingLossEnabled(data) {
  return request({
    url: '/priceCenter/afterfinishLoss/status',
    method: 'post',
    data
  })
}
