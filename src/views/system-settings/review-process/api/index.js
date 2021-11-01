import request from '@/utils/request'

/* 流程详情*/
export const getWorkflowInfo = (params = {}) => {
  return request({
    method: 'post',
    url: '/workflow/info',
    data: params
  })
}

// // 查询历史审批记录
// export const getRecordInfo = (params = {}) => {
//   return request({
//     method: 'post',
//     url: '/sysSettings/workflow/queryAuditRecord',
//     data: params
//   })
// }

// 员工列表
export const getUser = (params = {}) => {
  return request({
    method: 'post',
    url: '/userCenter/sysUser/list',
    data: { requireOrgFlag: 1, pageNum: 1, pageSize: 99999999, requireDataGroupFlag: 1 }
  })
}
export function userPageList(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/userCenter/sysUser/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 条件分支
export const getParams = (params = {}) => {
  return request({
    method: 'post',
    url: '/sysSettings/businessParam/list',
    data: params
  })
}

// /* 审核流程详情基本资料*/
// export const getWorkflowBaseInfo = (params = {}) => {
//   return request({
//     method: 'post',
//     url: '/sysSettings/workflow/queryAuditInfo',
//     data: params
//   })
// }
