import request from '@/utils/request'

// 分页查询
export function pageList(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/qa/qaFinishFabricInspectionTask/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}
// 每个分组对应的数量
export function pageCount(data = {}) {
  return request({
    url: '/qa/qaFinishFabricInspectionTask/countAllStatuses',
    method: 'post',
    data: { ...data }
  })
}
// 任务指派
export function assignTask(data = {}) {
  return request({
    url: '/qa/qaFinishFabricInspectionTask/assign',
    method: 'post',
    data: { ...data }
  })
}
// 任务指派-接收人下拉选项
export async function conditionList(data = { isEnabled: 1 }) {
  const res = (await request({
    url: '/sysSettings/task/outworker/condition/list',
    method: 'post',
    data
  })).data || []
  return res.map(e => ({
    label: e.realName,
    value: e.sysUserUuid
  }))
}
