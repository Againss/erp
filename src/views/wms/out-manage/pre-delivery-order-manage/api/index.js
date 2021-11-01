import request from '@/utils/request'

export const reservationGetPage = (params = {}) => {
  let pageNum = 1; let pageSize = 20
  if (params.hasOwnProperty('pageNum')) {
    pageNum = params.pageNum
  }
  if (params.hasOwnProperty('pageSize')) {
    pageSize = params.pageSize
  }
  return request({
    method: 'post',
    url: '/wms/out/reservation/page',
    data: {
      ...params,
      pageNum,
      pageSize
    }
  })
}

export const reservationGetDetailBase = (params = {}) => {
  return request({
    method: 'post',
    url: '/wms/out/reservation/info',
    data: params
  })
}

export const reservationGetDetailPage = (params = {}) => {
  let pageNum = 1; let pageSize = 20
  if (params.hasOwnProperty('pageNum')) {
    pageNum = params.pageNum
  }
  if (params.hasOwnProperty('pageSize')) {
    pageSize = params.pageSize
  }
  return request({
    method: 'post',
    url: '/wms/out/reservation/product/page',
    data: {
      ...params,
      pageNum,
      pageSize
    }
  })
}

export const reservationConfirm = (params = {}) => {
  return request({
    method: 'post',
    url: '/wms/out/reservation/confirm',
    data: params
  })
}
// 出库仓库
export const warehouseList = (params = {}) => {
  return request({
    method: 'post',
    url: '/wms/warehouse/list',
    data: params
  })
}

export const shipperList = () => {
  return request({
    method: 'post',
    url: '/wms/out/reservation/shipper'
  })
}

