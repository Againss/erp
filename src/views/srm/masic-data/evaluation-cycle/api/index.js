import request from '@/utils/request'
/* 列表 */
export const getEvaluationCycleData = (params = {}) => {
  let pageNum = 1; let pageSize = 20
  if (params.hasOwnProperty('pageNum')) {
    pageNum = params.pageNum
  }
  if (params.hasOwnProperty('pageSize')) {
    pageSize = params.pageSize
  }
  return request({
    method: 'post',
    url: '/srm/assessmentPeriod/list',
    data: {
      ...params,
      pageNum,
      pageSize
    }
  })
}

/* 状态更新 */
export const disableTypeSupplierData = (params) => {
  return request({
    method: 'post',
    url: '/srm/assessmentPeriod/operate',
    data: params
  })
}

