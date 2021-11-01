import request from '@/utils/request'

/* 查询供应商申请列表*/
export const getApplicationData = (params = {}) => {
  let pageNum = 1; let pageSize = 20
  if (params.hasOwnProperty('pageNum')) {
    pageNum = params.pageNum
  }
  if (params.hasOwnProperty('pageSize')) {
    pageSize = params.pageSize
  }
  return request({
    method: 'post',
    url: '/srm/supplier/applicant/page',
    data: {
      ...params,
      pageNum,
      pageSize
    }
  })
}

/* 新增供应商申请 */
export const insertApplicationSupplierData = (params) => {
  return request({
    method: 'post',
    url: '/srm/supplier/applicant/add',
    data: params
  })
}

/* 编辑供应商申请 */
export const updateApplicationData = (params) => {
  return request({
    method: 'post',
    url: '/srm/supplier/applicant/modify',
    data: params
  })
}

/* 供应商申请详情 */
export const getApplicationInfoData = (params) => {
  return request({
    method: 'post',
    url: '/srm/supplier/applicant/info',
    data: params
  })
}

/* 删除供应商申请 */
export const deleteAuditingData = (params) => {
  return request({
    method: 'post',
    url: '/srm/supplier/applicant/delete',
    data: params
  })
}

/* 审批供应商申请 */
export const auditApplicationData = (params) => {
  return request({
    method: 'post',
    url: '/srm/supplier/applicant/audit',
    data: params
  })
}

/* 根据供应商类型查询供应商信息 */
export const getAuditingListByTypeData = (params) => {
  return request({
    method: 'post',
    url: '/srm/supplier/list',
    data: params
  })
}

/* 分配供应商 */
export const distributionApplicationData = (params) => {
  return request({
    method: 'post',
    url: '/srm/supplier/applicant/modify/distribution',
    data: params
  })
}

/* 考核表详细信息 */
export const getUploadApplicationInfoData = (params) => {
  return request({
    method: 'post',
    url: '/srm/supplier/upload/audit/info',
    data: params
  })
}
