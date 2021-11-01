/*
 * @Author: zhushuiliang
 * @Description:
 * @Date: 2021-03-12 13:49:48
 * @LastEditors: zhushuiliang
 * @LastEditTime: 2021-03-23 17:38:08
 */
import request from '@/utils/request'

// 流程列表
export function workflowList(data = {}) {
  return request({
    url: '/sysSettings/workflow/page',
    method: 'post',
    data: { ...{ pageNum: 1, pageSize: 20 }, ...data }
  })
}
// 启用停用流程
export function changeWorkflow(data = {}) {
  return request({
    url: '/sysSettings/workflow/change',
    method: 'post',
    data: { ...{ workflowId: 1, status: 0 }, ...data }
  })
}
// 流程分组
export function getWorkflowGroup(data = {}) {
  return request({
    url: '/sysSettings/workflowGroup/list',
    method: 'post',
    data: { ...data }
  })
}
// 移动流程分组
export function moveGroup(data = {}) {
  return request({
    url: '/sysSettings/workflow/moveGroup',
    method: 'post',
    data: { ...data }
  })
}
// 新增流程分组
export function addGroup(data = {}) {
  return request({
    url: '/sysSettings/workflowGroup/add',
    method: 'post',
    data: { ...data }
  })
}
// 重命名流程分组
export function modifyGroup(data = {}) {
  return request({
    url: '/sysSettings/workflowGroup/modify',
    method: 'post',
    data: { ...data }
  })
}
// 删除流程分组
export function deleteGroup(data = {}) {
  return request({
    url: '/sysSettings/workflowGroup/delete',
    method: 'post',
    data: { ...data }
  })
}
// 每个分组对应的流程数量
export function flowAllCounts(data = {}) {
  return request({
    url: '/sysSettings/workflow/flowAllCounts',
    method: 'post',
    data: { ...data }
  })
}
