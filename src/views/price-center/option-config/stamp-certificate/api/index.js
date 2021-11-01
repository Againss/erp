// 选项配置-印花证书页面API
import request from '@/utils/request'

// 分页查询印花证书列表
export function printingCertificateOptionPage(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/priceCenter/printingCertificateOption/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 新增
export function printingCertificateOptionAdd(data) {
  return request({
    url: '/priceCenter/printingCertificateOption/add',
    method: 'post',
    data
  })
}

// 编辑--详情
export function printingCertificateOptionDetail(data) {
  return request({
    url: '/priceCenter/printingCertificateOption/info',
    method: 'post',
    data
  })
}

// 修改
export function printingCertificateOptionModify(data) {
  return request({
    url: '/priceCenter/printingCertificateOption/modify',
    method: 'post',
    data
  })
}

// 删除
export function printingCertificateOptionDelete(data) {
  return request({
    url: '/priceCenter/printingCertificateOption/delete',
    method: 'post',
    data
  })
}

// 启用禁用
export function printingCertificateOptionEnabled(data) {
  return request({
    url: '/priceCenter/printingCertificateOption/status',
    method: 'post',
    data
  })
}
