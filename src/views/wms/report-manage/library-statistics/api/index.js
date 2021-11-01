import request from '@/utils/request'

export const getLibraryReport = (params = {}) => {
  let pageNum = 1; let pageSize = 20
  if (params.hasOwnProperty('pageNum')) {
    pageNum = params.pageNum
  }
  if (params.hasOwnProperty('pageSize')) {
    pageSize = params.pageSize
  }
  return request({
    method: 'post',
    url: '/wms/report/stockIn/page',
    data: {
      ...params,
      pageNum,
      pageSize
    }
  })
}
export const libraryDetail = (params = {}) => {
  return request({
    method: 'post',
    url: '/wms/report/stockIn/detail/page',
    data: params
  })
}
export const exportFile = (params = {}) => {
  return request({
    method: 'post',
    url: '/wms/report/stockIn/export',
    data: params,
    responseType: 'arraybuffer'
  })
}
export const libraryTotal = (params = {}) => {
  return request({
    method: 'post',
    url: '/wms/report/stockIn/count',
    data: params
  })
}
