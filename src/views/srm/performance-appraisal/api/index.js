import request from '@/utils/request'
/* 获取列表 */
export const getSupplilerListData = (params = {}) => {
  let pageNum = 1; let pageSize = 20
  if (params.hasOwnProperty('pageNum')) {
    pageNum = params.pageNum
  }
  if (params.hasOwnProperty('pageSize')) {
    pageSize = params.pageSize
  }
  return request({
    method: 'post',
    url: '/srm/supplierPerformance/page',
    data: {
      ...params,
      pageNum,
      pageSize
    }
  })
}

/* 绩效考核-确认考核 */
export const confirmSupplilerData = (params) => {
  return request({
    method: 'post',
    url: '/srm/supplierPerformance/confirm',
    data: params
  })
}

/* 历史考核记录 */
export const getSupplierHistoryData = (params) => {
  const pageNum = 1
  const pageSize = 20
  return request({
    method: 'post',
    url: '/srm/supplierPerformance/history',
    data: {
      ...params,
      pageNum,
      pageSize
    }
  })
}
/* 绩效考核-详情 */
export const getSupplierInfoByIdData = (params) => {
  console.log('走供应商详情', params)
  return request({
    method: 'post',
    url: `/srm/supplierPerformance/info/${params.id}`,
    data: params
  })
}
/* 绩效考核列表_导出 */
export const getSupplierExportData = (params) => {
  return request({
    method: 'post',
    url: '/srm/supplierPerformance/list/export',
    data: params,
    responseType: 'arraybuffer'
  })
}
/* 绩效考核-批量导入 */
export const getSupplierExcelData = (params) => {
  return request({
    method: 'post',
    url: '/srm/supplierPerformance/import/excel',
    data: params
  })
}

/* 根据分数算出考核等级和结果 */
export const getRankByScoreData = (params) => {
  return request({
    method: 'post',
    url: '/srm/supplier/score/rank',
    data: params
  })
}

// 等级list
export const getSupplierLevelList = (params) => {
  return request({
    method: 'post',
    url: '/srm/supplierPerformance/supplierLevelList',
    data: params
  })
}

// 新增绩效考核接口--考核接口保存
export function getUpdate(params) {
  return request({
    url: '/srm/supplierPerformance/confirm',
    method: 'post',
    data: params
  })
}

// 新增绩效考核接口--考核接口详情
export function getDetail(params) {
  return request({
    url: `/srm//supplierPerformance/info/${params.id}`,
    method: 'post',
    data: params
  })
}

/* 获取考核周期和考核期数 查询条件 联动数据 */
export const getSupplierPerformancePeriod2noData = (data = {}) => {
  return request({
    method: 'post',
    url: '/srm/supplierPerformance/query/period2no',
    data
  })
}

// 获取省市区信息
export function openapiAreaSearch(data = {}) {
  return request({
    url: '/basis/openapi/area/search',
    method: 'post',
    data
  })
}
