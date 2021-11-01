// 选项配置-纱线证书选项页面API
import request from '@/utils/request'

// 分页查询纱线证书选项列表
export function yarnCertificateOptionPage(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/priceCenter/yarnCertificateOption/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 新增
export function yarnCertificateOptionAdd(data) {
  return request({
    url: '/priceCenter/yarnCertificateOption/add',
    method: 'post',
    data
  })
}

// 编辑--详情
export function yarnCertificateOptionDetail(data) {
  return request({
    url: '/priceCenter/yarnCertificateOption/info',
    method: 'post',
    data
  })
}

// 修改
export function yarnCertificateOptionModify(data) {
  return request({
    url: '/priceCenter/yarnCertificateOption/modify',
    method: 'post',
    data
  })
}

// 删除
export function yarnCertificateOptionDelete(data) {
  return request({
    url: '/priceCenter/yarnCertificateOption/delete',
    method: 'post',
    data
  })
}

// 启用禁用
export function yarnCertificateOptionEnabled(data) {
  return request({
    url: '/priceCenter/yarnCertificateOption/status',
    method: 'post',
    data
  })
}
