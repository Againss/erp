import request from '@/utils/request'
// 分页查询
export function list(data = {}) {
  return request({
    url: '/processingMgr/knitAllotNotice/page',
    method: 'post',
    data: data
  })
}
// 详情
export function info(data = {}) {
  return request({
    url: '/processingMgr/knitAllotNotice/info',
    method: 'post',
    data: data
  })
}

// 统计
export function count(data = {}) {
  return request({
    url: '/processingMgr/knitAllotNotice/pageGroupCount',
    method: 'post',
    data: data
  })
}

// 撤回
export function recall(data = {}) {
  return request({
    url: '/processingMgr/knitAllotNotice/recall',
    method: 'post',
    data: data
  })
}

// 取消
export function cancel(data = {}) {
  return request({
    url: '/processingMgr/knitAllotNotice/cancel',
    method: 'post',
    data: data
  })
}

// 提交
export function submit(data = {}) {
  return request({
    url: '/processingMgr/knitAllotNotice/submit',
    method: 'post',
    data: data
  })
}
// 修改原料调拨单
export function allotConfirm(data = {}) {
  return request({
    url: '/processingMgr/knitAllotNotice/modify',
    method: 'post',
    data: data
  })
}

