import request from '@/utils/request'

// 证书分页查询数据
export function getCertificatePage(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/priceCenter/yarnCertInfo/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 证书删除
export function deleteCertificate(data = {}) {
  return request({
    url: '/priceCenter/yarnCertInfo/delete',
    method: 'post',
    data
  })
}

// 证书编辑
export function editCertificate(data = {}) {
  return request({
    url: '/priceCenter/yarnCertInfo/modify',
    method: 'post',
    data
  })
}

// 证书新增
export function addCertificate(data = {}) {
  return request({
    url: '/priceCenter/yarnCertInfo/add',
    method: 'post',
    data
  })
}

// 证书启用禁用
export function enabledCertificate(data = {}) {
  return request({
    url: '/priceCenter/yarnCertInfo/status',
    method: 'post',
    data
  })
}

// 证书详情
export function getCertificateDetail(data = {}) {
  return request({
    url: '/priceCenter/yarnCertInfo/info',
    method: 'post',
    data
  })
}
