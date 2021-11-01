// 国家/地区页面API
import request from '@/utils/request'

// 分页查询国家/地区列表
export function profitPage(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/priceCenter/profit/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 下拉选项
export function getSearchSelect(data = {}) {
  return request({
    url: '/priceCenter/profit/optionsFilled',
    method: 'post',
    data
  })
}
// 新增
export function profitAdd(data) {
  return request({
    url: '/priceCenter/profit/add',
    method: 'post',
    data
  })
}

// 编辑--详情
export function profitDetail(data) {
  return request({
    url: '/priceCenter/profit/info',
    method: 'post',
    data
  })
}

// 修改
export function profitModify(data) {
  return request({
    url: '/priceCenter/profit/modify',
    method: 'post',
    data
  })
}

// 删除
export function profitDelete(data) {
  return request({
    url: '/priceCenter/profit/delete',
    method: 'post',
    data
  })
}

// 启用禁用
export function profitEnabled(data) {
  return request({
    url: '/priceCenter/profit/status',
    method: 'post',
    data
  })
}
