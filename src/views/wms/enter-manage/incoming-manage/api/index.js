import request from '@/utils/request'
/* 入库单管理-列表 */
export const getStockInFormData = (params = {}) => {
  let pageNum = 1; let pageSize = 20
  if (params.hasOwnProperty('pageNum')) {
    pageNum = params.pageNum
  }
  if (params.hasOwnProperty('pageSize')) {
    pageSize = params.pageSize
  }
  return request({
    method: 'post',
    url: '/wms/stockIn/form/page',
    data: {
      ...params,
      pageNum,
      pageSize
    }
  })
}
/* 入库单管理-详情 */
export const getStockInFormInfoData = (params) => {
  return request({
    method: 'post',
    url: '/wms/stockIn/form/info/' + params.formNo,
    data: params
  })
}

/* 入库单管理-详情-货物明细 */
export const getStockInFormProductData = (params = {}) => {
  let pageNum = 1; let pageSize = 20
  if (params.hasOwnProperty('pageNum')) {
    pageNum = params.pageNum
  }
  if (params.hasOwnProperty('pageSize')) {
    pageSize = params.pageSize
  }
  return request({
    method: 'post',
    url: '/wms/stockIn/form/product/page',
    data: {
      ...params,
      pageNum,
      pageSize
    }
  })
}

/* 入库单管理-详情-货物明细-明细 */
export const getProductDetailListData = (params = {}) => {
  let pageNum = 1; let pageSize = 10
  if (params.hasOwnProperty('pageNum')) {
    pageNum = params.pageNum
  }
  if (params.hasOwnProperty('pageSize')) {
    pageSize = params.pageSize
  }
  return request({
    method: 'post',
    url: '/wms/stockIn/form/product/detail/list',
    data: {
      ...params,
      pageNum,
      pageSize
    }
  })
}
