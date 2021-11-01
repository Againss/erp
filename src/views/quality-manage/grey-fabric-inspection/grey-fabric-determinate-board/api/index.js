import request from '@/utils/request'

// 坯布确板分页查询列表
export function qaGreySwatchesTaskPage(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/qa/qaGreigeSwatchesTask/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 坯布确板各状态数量
export function greigeSwatchesTaskStatusCount(data = {}) {
  return request({
    url: '/qa/qaGreigeSwatchesTask/countAllStatuses',
    method: 'post',
    data
  })
}

// 坯布确板根据工厂id获取外勤人员
export function taskOutworkerConditionList(data = {}) {
  return request({
    url: '/sysSettings/task/outworker/condition/list',
    method: 'post',
    data
  })
}

// 坯布织厂获取待处理的织单
export function pendingKnitOrders(data = {}) {
  return request({
    url: '/qa/qaGreigeFabricTask/pendingKnitOrders',
    method: 'post',
    data
  })
}

// 坯布根据织厂织单获取已发布织机
export function getPublishedMachineNoByKnitOrderNo(data = {}) {
  return request({
    url: '/qa/qaGreigeSwatchesTask/getPublishedMachineNoByKnitOrderNo',
    method: 'post',
    data
  })
}

// 坯布确板准备发布任务
export function greigeSwatchesTaskPreparePublish(data = {}) {
  return request({
    url: '/qa/qaGreigeSwatchesTask/preparePublish',
    method: 'post',
    data
  })
}

// 坯布确板发布任务
export function qaGreySwatchesTaskAdd(data = {}) {
  return request({
    url: '/qa/qaGreigeSwatchesTask/confirmPublish',
    method: 'post',
    data
  })
}
