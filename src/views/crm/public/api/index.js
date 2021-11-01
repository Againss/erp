import request from '@/utils/request'

// 获取省市区信息
export function openapiAreaSearch(data) {
  return request({
    url: '/basis/openapi/area/search',
    method: 'post',
    data
  })
}

// 获取省市区信息
export function openapiAreaDetail(data) {
  return request({
    url: '/basis/openapi/area/detail',
    method: 'post',
    data
  })
}

// 获取付款条件列表
export function paymentTerms(data) {
  return request({
    url: '/basis/api/paymentTerms/index',
    method: 'post',
    data
  })
}

// 获取付款条款列表
export function priceTerms(data) {
  return request({
    url: '/basis/api/priceTerms/index',
    method: 'post',
    data
  })
}

// 查找用户名
export function sysUserPage(data) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/crm/sysUser/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 根据客户查品牌商
export function customerBrandBrandPage(data) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/crm/customer/brand/brandPage',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 根据销售员查销售部门
export function sysUserInfo(data) {
  return request({
    url: '/crm/sysUser/info',
    method: 'post',
    data
  })
}

// 附件下载接口
export function attachmentDownload(data) {
  return request({
    url: '/crm/attachment/download',
    method: 'get',
    responseType: 'arraybuffer',
    params: data
  })
}

// 附件删除接口
export function attachmentDelete(data) {
  return request({
    url: '/crm/attachment/delete',
    method: 'get',
    // responseType: 'arraybuffer',
    params: data
  })
}
