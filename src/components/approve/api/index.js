import request from '@/utils/request'

/* 审核流程详情*/
export const getWorkflowInfo = (params = {}) => {
  return request({
    method: 'post',
    url: '/sysSettings/workflow/queryAuditRecord',
    data: params
  })
}
/* 审核*/
export const submitWorkflow = (params = {}) => {
  return request({
    method: 'post',
    url: '/sysSettings/workflow/workflowRun',
    data: params
  })
}
/* 审核流程详情基本资料*/
export const getWorkflowBaseInfo = (params = {}) => {
  return request({
    method: 'post',
    url: '/sysSettings/workflow/queryAuditInfo',
    data: params
  })
}
/* 查询是否有审核权限*/
export const getAuthority = (params = {}) => {
  return request({
    method: 'post',
    url: '/sysSettings/workflow/workflowTask',
    data: params
  })
}

