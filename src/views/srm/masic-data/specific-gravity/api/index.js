import request from '@/utils/request'
/* 列表 */
export const getSpecificGravityData = (params = {}) => {
  let pageNum = 1; let pageSize = 20
  if (params.hasOwnProperty('pageNum')) {
    pageNum = params.pageNum
  }
  if (params.hasOwnProperty('pageSize')) {
    pageSize = params.pageSize
  }
  return request({
    method: 'post',
    url: '/srm/assessSpecific/list',
    data: {
      ...params,
      pageNum,
      pageSize
    }
  })
}
/* 根据id获取详情 */
export const getSpecificGravityDetailsByIdData = (params) => {
  return request({
    method: 'post',
    url: '/srm/assessSpecific/info',
    data: params
  })
}
/* 状态更新 */
export const disableSpecificGravityData = (params) => {
  return request({
    method: 'post',
    url: '/srm/assessSpecific/operate',
    data: params
  })
}
/* 编辑 */
export const updateSpecificGravityData = (params) => {
  return request({
    method: 'post',
    url: '/srm/assessSpecific/modifyBatch',
    data: params
  })
}
