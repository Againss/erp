import request from '@/utils/request'

// 搜索下拉数据
export function getSearchSelect(data = {}) {
  return request({
    url: '/priceCenter/wovenTechInfo/optionsFilled',
    method: 'post',
    data
  })
}

// 织工分页查询数据
export function getCertificatePage(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/priceCenter/wovenTechInfo/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 织工删除
export function deleteCertificate(data = {}) {
  return request({
    url: '/priceCenter/wovenTechInfo/delete',
    method: 'post',
    data
  })
}

// 织工编辑
export function editCertificate(data = {}) {
  return request({
    url: '/priceCenter/wovenTechInfo/modify',
    method: 'post',
    data
  })
}

// 织工新增
export function addCertificate(data = {}) {
  return request({
    url: '/priceCenter/wovenTechInfo/add',
    method: 'post',
    data
  })
}

// 织工启用禁用
export function enabledCertificate(data = {}) {
  return request({
    url: '/priceCenter/wovenTechInfo/status',
    method: 'post',
    data
  })
}

// 织工详情
export function getCertificateDetail(data = {}) {
  return request({
    url: '/priceCenter/wovenTechInfo/info',
    method: 'post',
    data
  })
}
