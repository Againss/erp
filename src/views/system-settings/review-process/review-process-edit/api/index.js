/*
 * @Descripttion:
 * @version:
 * @Author: shujing
 * @Date: 2020-11-17 14:57:49
 * @LastEditors: zhushuiliang
 * @LastEditTime: 2021-03-24 16:32:42
 */
import request from '@/utils/request'

// 新增流程
export function workflow(data = {}) {
  return request({
    url: '/sysSettings/workflow/info',
    method: 'post',
    data: { ...data }
  })
}
// 新增流程
export function addWorkflow(data = {}) {
  return request({
    url: '/sysSettings/workflow/add',
    method: 'post',
    data: { ...data }
  })
}
// 列表状态数量
export function modifyWorkflow(data = {}) {
  return request({
    url: '/sysSettings/workflow/modify',
    method: 'post',
    data: { ...data }
  })
}
// 业务表单列表
export function businessNoList(data = {}) {
  return request({
    url: '/sysSettings/businessNo/list',
    method: 'post',
    data: { ...data }
  })
}
