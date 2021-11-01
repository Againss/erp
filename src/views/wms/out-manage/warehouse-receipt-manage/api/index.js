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
    url: '/wms/out/form/page',
    data: {
      ...params,
      pageNum,
      pageSize
    }
  })
}

export const warehouseGetDetailBase = (params = {}) => {
  return request({
    method: 'post',
    url: '/wms/out/form/info',
    data: params
  })
}

export const warehouseGetDetailPage = (params = {}) => {
  let pageNum = 1; let pageSize = 20
  if (params.hasOwnProperty('pageNum')) {
    pageNum = params.pageNum
  }
  if (params.hasOwnProperty('pageSize')) {
    pageSize = params.pageSize
  }
  return request({
    method: 'post',
    url: '/wms/out/form/product/page',
    data: {
      ...params,
      pageNum,
      pageSize
    }
  })
}

