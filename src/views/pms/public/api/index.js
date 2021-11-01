import request from '@/utils/request'
/* 根据供应商类型查询供应商信息 */
export const getSupplier = (params = {}) => {
  return request({
    method: 'post',
    url: '/srm/supplier/list',
    data: params
  })
}
/* 根据供应商类型查询供应商信息--查询的是全部的供应商，包括合格和不合格的 */
export const getAllSupplier = (params = {}) => {
  return request({
    method: 'post',
    url: '/srm/supplier/searchList',
    data: params
  })
}
// 根据供应商--查出供应商详情内容
export function supplierInfodata(params) {
  return request({
    url: '/srm/supplier/info',
    method: 'post',
    data: params
  })
}
/* 币别*/
export const getCurrency = (params = {}) => {
  return request({
    method: 'post',
    url: '/basis/openapi/currency/search',
    data: params
  })
}

