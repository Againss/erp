// 印花证书页面API
import request from '@/utils/request'

// 分页查询印花证书列表
export function printingCertInfoPage(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/priceCenter/printingCertInfo/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 新增
export function printingCertInfoAdd(data) {
  return request({
    url: '/priceCenter/printingCertInfo/add',
    method: 'post',
    data
  })
}

// 编辑--详情
export function printingCertInfoDetail(data) {
  return request({
    url: '/priceCenter/printingCertInfo/info',
    method: 'post',
    data
  })
}

// 修改
export function printingCertInfoModify(data) {
  return request({
    url: '/priceCenter/printingCertInfo/modify',
    method: 'post',
    data
  })
}

// 删除
export function printingCertInfoDelete(data) {
  return request({
    url: '/priceCenter/printingCertInfo/delete',
    method: 'post',
    data
  })
}

// 启用禁用
export function printingCertInfoEnabled(data) {
  return request({
    url: '/priceCenter/printingCertInfo/status',
    method: 'post',
    data
  })
}
// 证书选项-选项配置-印花证书选择
export function printingCertificateOption(data) {
  return request({
    url: '/priceCenter/printingCertificateOption/list',
    method: 'post',
    data
  })
}
