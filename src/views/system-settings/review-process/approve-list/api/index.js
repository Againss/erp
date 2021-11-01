import request from '@/utils/request'

// 我审批的流程分页列表
export function myAuditList(data = {}) {
  return request({
    url: '/sysSettings/workflow/myAudit',
    method: 'post',
    data: { ...{ pageNum: 1, pageSize: 20 }, ...data }
  })
}
// 我提交的流程分页列表
export function myApplyList(data = {}) {
  return request({
    url: '/sysSettings/workflow/myApply',
    method: 'post',
    data: { ...{ pageNum: 1, pageSize: 20 }, ...data }
  })
}

// 分页查询用户(员工)列表
export function userPageList(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/userCenter/sysUser/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 根据流程id查询-跳转
export function queryAuditShift(data = {}) {
  return request({
    url: '/sysSettings/workflow/queryAuditShift',
    method: 'post',
    data: { ...data }
  })
}
