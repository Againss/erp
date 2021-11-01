import request from '@/utils/request'

// 坯布验布分页查询列表
export function qaGreyFabricTaskPage(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/qa/qaGreigeFabricTask/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 坯布验布各状态数量
export function greigeFabricTaskStatusCount(data = {}) {
  return request({
    url: '/qa/qaGreigeFabricTask/countStatus',
    method: 'post',
    data
  })
}

