// 选项配置-页面API
import request from '@/utils/request'

// 分页查询列表
export function printingLossInfoPage(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/priceCenter/printingLossInfo/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}
// 列表筛选
export function getSearchSelect(data = {}) {
  return request({
    url: '/priceCenter/printingLossInfo/optionsFilled',
    method: 'post',
    data
  })
}
// 新增
export function printingLossInfoAdd(data) {
  return request({
    url: '/priceCenter/printingLossInfo/add',
    method: 'post',
    data
  })
}

// 编辑--详情
export function printingLossInfoDetail(data) {
  return request({
    url: '/priceCenter/printingLossInfo/info',
    method: 'post',
    data
  })
}

// 修改
export function printingLossInfoModify(data) {
  return request({
    url: '/priceCenter/printingLossInfo/modify',
    method: 'post',
    data
  })
}

// 删除
export function printingLossInfoDelete(data) {
  return request({
    url: '/priceCenter/printingLossInfo/delete',
    method: 'post',
    data
  })
}

// 启用禁用
export function printingLossInfoEnabled(data) {
  return request({
    url: '/priceCenter/printingLossInfo/status',
    method: 'post',
    data
  })
}

