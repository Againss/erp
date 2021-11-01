import request from '@/utils/request'

// 分页查询列表
export function list(data = {}) {
  return request({
    url: '/baseData/pdProductionScheduleWarn/list',
    method: 'post',
    data: data
  })
}

// 新增
export function add(data = {}) {
  return request({
    url: '/baseData/pdProductionScheduleWarn/add',
    method: 'post',
    data: data
  })
}

// 编辑
export function edit(data = {}) {
  return request({
    url: '/baseData/pdProductionScheduleWarn/modify',
    method: 'post',
    data: data
  })
}
