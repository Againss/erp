import request from '@/utils/request'
/* 准入供应商评估部门-分页列表 */
export const getJudgmentDepartmentData = (params = {}) => {
  let pageNum = 1; let pageSize = 20
  if (params.hasOwnProperty('pageNum')) {
    pageNum = params.pageNum
  }
  if (params.hasOwnProperty('pageSize')) {
    pageSize = params.pageSize
  }
  return request({
    method: 'post',
    url: '/srm/judgmentDepartment/page',
    data: {
      ...params,
      pageNum,
      pageSize
    }
  })
}
/* 获取合格供应商审核部门列表 */
export const getReviewDepartmentData = (params = {}) => {
  let pageNum = 1; let pageSize = 20
  if (params.hasOwnProperty('pageNum')) {
    pageNum = params.pageNum
  }
  if (params.hasOwnProperty('pageSize')) {
    pageSize = params.pageSize
  }
  return request({
    method: 'post',
    url: '/srm/reviewDepartment/page',
    data: {
      ...params,
      pageNum,
      pageSize
    }
  })
}
/* 获取供应商类型列表 */
export const getSupplierTypeListData = (params = {}) => {
  let pageNum = 1; let pageSize = 20
  if (params.hasOwnProperty('pageNum')) {
    pageNum = params.pageNum
  }
  if (params.hasOwnProperty('pageSize')) {
    pageSize = params.pageSize
  }
  return request({
    method: 'post',
    url: '/srm/supplierType/list',
    data: {
      ...params,
      pageNum,
      pageSize
    }
  })
}
/* 准入供应商评估部门-刪除 */
export const deleteJudgmentDepartmentData = (params) => {
  return request({
    method: 'post',
    url: '/srm/judgmentDepartment/delete',
    data: params
  })
}
/* 准入供应商评估部门-信息 */
export const getJudgmentDepartmentInfoData = (params) => {
  return request({
    method: 'post',
    url: '/srm/judgmentDepartment/info',
    data: params
  })
}
/* 准入供应商评估部门-编辑 */
export const updateJudgmentDepartmentData = (params) => {
  return request({
    method: 'post',
    url: '/srm/judgmentDepartment/modify',
    data: params
  })
}
/* 准入供应商评估部门-新增 */
export const insertJudgmentDepartmentData = (params) => {
  return request({
    method: 'post',
    url: '/srm/judgmentDepartment/add',
    data: params
  })
}
/* 准入供应商评估部门-新增 */
export const insertAuditingData = (params) => {
  return request({
    method: 'post',
    url: '/srm/reviewDepartment/page',
    data: params
  })
}

/* 合格供应商审核部門增加 */
export const insertReviewDepartmentData = (params) => {
  return request({
    method: 'post',
    url: '/srm/reviewDepartment/addBatch',
    data: params
  })
}
/* 合格供应商审核部门编辑 */
export const updateReviewDepartmentData = (params) => {
  return request({
    method: 'post',
    url: '/srm/reviewDepartment/modify',
    data: params
  })
}

/* 合格供应商审核部門刪除 */
export const deleteReviewDepartmentData = (params) => {
  return request({
    method: 'post',
    url: '/srm/reviewDepartment/delete',
    data: params
  })
}

/* 通过id获取合格供应商审核部门信息 */
export const getReviewDepartmentByIdData = (params) => {
  return request({
    method: 'post',
    url: '/srm/reviewDepartment/info',
    data: params
  })
}

/* 合格供应商审核部门状态更新 */
export const updateReviewDepartmentStateData = (params) => {
  return request({
    method: 'post',
    url: '/srm/reviewDepartment/operat',
    data: params
  })
}
