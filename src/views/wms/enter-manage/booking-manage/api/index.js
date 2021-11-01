import request from '@/utils/request'
/* 预约单管理-列表 */
export const getBookingManageData = (params = {}) => {
  let pageNum = 1; let pageSize = 20
  if (params.hasOwnProperty('pageNum')) {
    pageNum = params.pageNum
  }
  if (params.hasOwnProperty('pageSize')) {
    pageSize = params.pageSize
  }
  console.log('params', params)
  return request({
    method: 'post',
    url: '/wms/stockIn/reservation/page',
    data: {
      ...params,
      pageNum,
      pageSize
    }
  })
}

/* 预约单管理-审核 */
export const getReservationAuditData = (params) => {
  return request({
    method: 'post',
    url: '/wms/stockIn/reservation/audit/' + params.reservationNo,
    data: params
  })
}

/* 预约单管理-详情 */
export const getReservationInfoData = (params) => {
  return request({
    method: 'post',
    url: '/wms/stockIn/reservation/info/' + params.reservationNo,
    data: params
  })
}

/* 预约单管理-详情-货物明细 */
export const getReservationProductData = (params) => {
  let pageNum = 1; let pageSize = 20
  if (params.hasOwnProperty('pageNum')) {
    pageNum = params.pageNum
  }
  if (params.hasOwnProperty('pageSize')) {
    pageSize = params.pageSize
  }
  return request({
    method: 'post',
    url: '/wms/stockIn/reservation/product/page',
    data: {
      ...params,
      pageNum,
      pageSize
    }
  })
}

/* 预约单管理-详情-货物明细-抽磅  确认 */
export const getReservationProductPoundAddData = (params) => {
  return request({
    method: 'post',
    url: '/wms/stockIn/reservation/product/' + params.productId + '/pound/add/',
    data: params
  })
}

/* 预约单管理-详情-货物明细-抽磅记录 */
export const getReservationProductPoundData = (params) => {
  return request({
    method: 'post',
    url: '/wms/stockIn/reservation/product/' + params.productId + '/pound',
    data: params
  })
}

/* 预约单管理-开始收货-保存(暂停收货) */
export const stopReservationSaveData = (params) => {
  return request({
    method: 'post',
    url: '/wms/stockIn/reservation/save',
    data: params
  })
}

/* 预约单管理-开始收货-完成收货 */
export const saveReservationCompleteData = (params) => {
  return request({
    method: 'post',
    url: '/wms/stockIn/reservation/complete',
    data: params
  })
}
/* 预约单管理-详情-货物明细-拆分 */
export const getSpllitCargoDetailInfoData = (params) => {
  return request({
    method: 'post',
    url: '/wms/stockIn/reservation/product/split',
    data: params
  })
}
/* 预约单管理-详情-货物明细-修改 */
export const updateReservationProductInfoData = (params) => {
  return request({
    method: 'post',
    url: '/wms/stockIn/reservation/product/modify',
    data: params
  })
}

/* 预约单管理-打印贴码-数据查询 */
export const getProductDetailListData = (params) => {
  return request({
    method: 'post',
    url: '/wms/stockIn/reservation/product/detail/list',
    data: params
  })
}

export const wmsFileDownload = (params) => {
  return request({
    method: 'get',
    responseType: 'arraybuffer',
    url: '/wms/download',
    params: params
  })
}

/* 预约单管理-其他入库-[增加产品]搜索列表 */
export const getProduct = (params) => {
  return request({
    method: 'post',
    url: '/common/generic/product/page',
    data: params
  })
}
export const getProductPage = data => {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    method: 'post',
    url: '/common/generic/product/page',
    data: { ...defaultParams, ...data }
  })
}
export const submit = params => {
  return request({
    method: 'post',
    url: '/wms/stockIn/reservation/other/submit',
    data: params
  })
}
// 货主
export const customerList = () => {
  return request({
    url: '/crm/customer/list',
    method: 'post',
    data: {}
  })
}
/* 根据供应商类型查询供应商信息 */
export const supplierList = data => {
  return request({
    method: 'post',
    url: '/srm/supplier/list',
    data
  })
}

// 数量统计
export function bookCount(data) {
  return request({
    url: '/wms/stockIn/reservation/count',
    method: 'post',
    data
  })
}

// 生产单号的下拉接口
export const productList = () => {
  return request({
    method: 'post',
    url: '/wms/mock/in/production/order/list',
    data: {}
  })
}

// 根据生产单号查询生产的信息
export const productDetail = (params) => {
  return request({
    method: 'post',
    url: '/wms/mock/in/production/order/' + params
  })
}

// 根据供应商id，查仓库资料的内容
// 仓库名称--全量查询
export function storePage(data = {}) {
  return request({
    url: '/wms/warehouse/list',
    method: 'post',
    data
  })
}

// 导入模板下载
export function mouldDown(data = {}) {
  return request({
    url: '/wms/stockIn/reservation/production/template/download',
    method: 'post',
    data,
    responseType: 'arraybuffer'
  })
}

// 货物明细导入解析
export function detailImport(data = {}) {
  return request({
    url: '/wms/stockIn/reservation/production/import/resolve',
    method: 'post',
    data,
    responseType: 'arraybuffer'
  })
}

// 已签收--通过/拒收的接口
export function passList(data) {
  return request({
    url: '/wms/stockIn/reservation/audit/signed',
    method: 'post',
    data
  })
}

// 生成单号的接口
export function productAdd(data) {
  return request({
    url: '/wms/stockIn/reservation/production/submit',
    method: 'post',
    data
  })
}
