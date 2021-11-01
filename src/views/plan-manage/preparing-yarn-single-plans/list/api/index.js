import request from '@/utils/request'
// 备纱单查询列表
export function yarnPlanPage(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/aps/yarnPlanOrder/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 备纱单变更
export function yarnPlanOrderAlter(data = {}) {
  return request({
    url: '/aps/yarnPlanOrder/alter',
    method: 'post',
    data
  })
}
