import request from '@/utils/request'
/* 绩效考核分析-等级和供应商类型 */
export const getSupplierAnalyseRankTypeData = (params = {}) => {
  let pageNum = 1; let pageSize = 20
  if (params.hasOwnProperty('pageNum')) {
    pageNum = params.pageNum
  }
  if (params.hasOwnProperty('pageSize')) {
    pageSize = params.pageSize
  }
  return request({
    method: 'post',
    url: '/srm/supplierPerformance/analysis/rank-type',
    data: {
      ...params,
      pageNum,
      pageSize
    }
  })
  /* return {
    code: 200,
    message: 'SUCCESS',
    total: 22,
    data: []
  } */
}

/* 绩效考核分析-等级 */
export const getSupplierPerformanceRankData = (data = {}) => {
  return request({
    method: 'post',
    url: '/srm/supplierPerformance/analysis/rank',
    data
  })
}

