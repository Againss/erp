// 测试成本页面API
import request from '@/utils/request'

// 国际运费
// 分页查询测试成本列表
export function freightPage(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/priceCenter/freight/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 全量查询国家/地区下拉选项
export function getSearchSelect(data = {}) {
  return request({
    url: '/priceCenter/freight/optionsFilled',
    method: 'post',
    data
  })
}
// 新增
export function internationalFreightAdd(data) {
  return request({
    url: '/priceCenter/internationalFreight/add',
    method: 'post',
    data
  })
}

// 编辑--详情
export function internationalFreightDetail(data) {
  return request({
    url: '/priceCenter/internationalFreight/info',
    method: 'post',
    data
  })
}

// 修改
export function internationalFreightModify(data) {
  return request({
    url: '/priceCenter/internationalFreight/modify',
    method: 'post',
    data
  })
}

// 删除
export function internationalFreightDelete(data) {
  return request({
    url: '/priceCenter/internationalFreight/delete',
    method: 'post',
    data
  })
}

// 启用禁用
export function internationalFreightEnabled(data) {
  return request({
    url: '/priceCenter/internationalFreight/status',
    method: 'post',
    data
  })
}

// 分页列表
// 国内运费-新增
export function freightAdd(data) {
  return request({
    url: '/priceCenter/freight/add',
    method: 'post',
    data
  })
}

// 国内运费-编辑--详情
export function freightDetail(data) {
  return request({
    url: '/priceCenter/freight/info',
    method: 'post',
    data
  })
}

// 国内运费-修改
export function freightModify(data) {
  return request({
    url: '/priceCenter/freight/modify',
    method: 'post',
    data
  })
}

// 国内运费-删除
export function freightDelete(data) {
  return request({
    url: '/priceCenter/freight/delete',
    method: 'post',
    data
  })
}

// 国内运费-启用禁用
export function freightEnabled(data) {
  return request({
    url: '/priceCenter/freight/status',
    method: 'post',
    data
  })
}
