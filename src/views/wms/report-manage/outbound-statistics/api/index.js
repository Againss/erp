import request from '@/utils/request'

export const warehouseGetPage = (params = {}) => {
  let pageNum = 1; let pageSize = 20
  if (params.hasOwnProperty('pageNum')) {
    pageNum = params.pageNum
  }
  if (params.hasOwnProperty('pageSize')) {
    pageSize = params.pageSize
  }
  return request({
    method: 'post',
    url: '/wms/out/form/report/page',
    data: {
      ...params,
      pageNum,
      pageSize
    }
  })
}
export const warehouseDetail = (params = {}) => {
  return request({
    method: 'post',
    url: '/wms/out/form/report/detail',
    data: params
  })
}
export const exportFile = (params = {}) => {
  return request({
    method: 'post',
    url: '/wms/out/form/report/export',
    data: params,
    responseType: 'arraybuffer'
  })
}
export const warehouseTotal = (params = {}) => {
  return request({
    method: 'post',
    url: '/wms/out/form/report/total',
    data: params
  })
}

