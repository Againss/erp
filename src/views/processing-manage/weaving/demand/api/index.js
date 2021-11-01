import request from '@/utils/request'
// 织需求-分页查询
export function list(data = {}) {
  return request({
    url: '/processingMgr/knitDemand/page',
    method: 'post',
    data: data
  })
}
// 织需求-统计
export function count(data = {}) {
  return request({
    url: '/processingMgr/knitDemand/pageGroupCount',
    method: 'post',
    data: data
  })
}
// 织需求 - 排厂
export function planFactory(data = {}) {
  return request({
    url: '/processingMgr/knitDemand/planFactory',
    method: 'post',
    data: data
  })
}
// 织需求 - 变更排厂list
export function editFactory(data = {}) {
  return request({
    url: '/processingMgr/knitDemand/editFactory',
    method: 'post',
    data: data
  })
}
// 织需求 - 工艺
export function tech(data = {}) {
  return request({
    url: '/processingMgr/knitDemand/tech',
    method: 'post',
    data: data
  })
}

// 织需求 -  变更排厂确认
export function editFactoryConfirm(data = {}) {
  return request({
    url: '/processingMgr/knitDemand/editFactoryConfirm',
    method: 'post',
    data: data,
    raw: true
  })
}

