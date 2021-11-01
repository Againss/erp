import request from '@/utils/request'
// import { createAxios } from '@/utils/public'
/* 上架单管理-列表 */
export const getPutupManageData = (params = {}) => {
  let pageNum = 1; let pageSize = 20
  if (params.hasOwnProperty('pageNum')) {
    pageNum = params.pageNum
  }
  if (params.hasOwnProperty('pageSize')) {
    pageSize = params.pageSize
  }
  return request({
    method: 'post',
    url: '/wms/stockIn/shelf/page',
    data: {
      ...params,
      pageNum,
      pageSize
    }
  })
}

/* 上架单管理-详情 */
export const getStockInShelfInfoData = (params) => {
  return request({
    method: 'post',
    url: '/wms/stockIn/shelf/info/' + params.shelfNo,
    data: params
  })
}

/* 上架单管理-详情-待上架货物明细列表 */
export const getWaitingShelfProductData = (params = {}) => {
  let pageNum = 1; let pageSize = 20
  if (params.hasOwnProperty('pageNum')) {
    pageNum = params.pageNum
  }
  if (params.hasOwnProperty('pageSize')) {
    pageSize = params.pageSize
  }
  return request({
    method: 'post',
    url: '/wms/stockIn/shelf/product/page',
    data: {
      ...params,
      pageNum,
      pageSize
    }
  })
}

/* 上架单管理-详情-已上架货物明细列表 */
export const getAlreadyShelfProductData = (params = {}) => {
  let pageNum = 1; let pageSize = 20
  if (params.hasOwnProperty('pageNum')) {
    pageNum = params.pageNum
  }
  if (params.hasOwnProperty('pageSize')) {
    pageSize = params.pageSize
  }
  return request({
    method: 'post',
    url: '/wms/stockIn/shelf/product/detail/page',
    data: {
      ...params,
      pageNum,
      pageSize
    }
  })
}

/* 上架单管理-详情-货物明细-明细列表 */
export const getStockInShelfProductDetailData = (params = {}) => {
  let pageNum = 1; let pageSize = 20
  if (params.hasOwnProperty('pageNum')) {
    pageNum = params.pageNum
  }
  if (params.hasOwnProperty('pageSize')) {
    pageSize = params.pageSize
  }
  return request({
    method: 'post',
    url: '/wms/stockIn/shelf/product/detail/' + params.productId,
    data: {
      ...params,
      pageNum,
      pageSize
    }
  })
}

/* 上架单管理-上架确认-完成上架 */
export const confirmFinishPutAwayData = (params) => {
  return request({
    method: 'post',
    url: '/wms/stockIn/shelf/complete',
    data: params
  })
}

/* 上架单管理-上架确认-添加上架明细查询 */
// export const getProductDetailsData = (params = {}) => {
//   return createAxios({
//     method: 'post',
//     url: '/wms/stockIn/shelf/product/detail/info',
//     data: params
//   })
// }
export const getProductDetailsData = (params = {}) => {
  return request({
    method: 'post',
    url: '/wms/stockIn/shelf/product/detail/info',
    data: params
  })
}

/* 上架单管理-上架确认-添加上架明细-提交 */
export const savedetailInfoData = (params) => {
  return request({
    method: 'post',
    url: '/wms/stockIn/shelf/product/up',
    data: params
  })
}

/* 上架单管理-上架确认- 上架明细 列表 */
export const getProductDetailsListData = (params) => {
  return request({
    method: 'post',
    url: '/wms/stockIn/shelf/product/detail/list',
    data: params
  })
}

// 数量统计
export function putupCount(data) {
  return request({
    url: '/wms/stockIn/shelf/count',
    method: 'post',
    data
  })
}
