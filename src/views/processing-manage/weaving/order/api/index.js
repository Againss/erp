import request from '@/utils/request'
// 分页查询
export function list(data = {}) {
  return request({
    url: '/processingMgr/knitOrder/page',
    method: 'post',
    data: data
  })
}
// 详情
export function info(data = {}) {
  return request({
    url: '/processingMgr/knitOrder/info',
    method: 'post',
    data: data
  })
}

// 织订单-原料调拨通知
export function allot(data = {}) {
  return request({
    url: '/processingMgr/knitOrder/allot',
    method: 'post',
    data: data
  })
}
// 织订单-原料调拨确认
export function allotConfirm(data = {}) {
  return request({
    url: '/processingMgr/knitOrder/allotConfirm',
    method: 'post',
    data: data
  })
}

// 统计
export function count(data = {}) {
  return request({
    url: '/processingMgr/knitOrder/pageGroupCount',
    method: 'post',
    data: data
  })
}

// 提交批量提交
export function submit(data = {}) {
  return request({
    url: '/processingMgr/knitOrder/submit',
    method: 'post',
    data: data
  })
}

// 撤回
export function recall(data = {}) {
  return request({
    url: '/processingMgr/knitOrder/recall',
    method: 'post',
    data: data
  })
}
// 取消
export function cancel(data = {}) {
  return request({
    url: '/processingMgr/knitOrder/cancel',
    method: 'post',
    data: data
  })
}

// 完工
export function finish(data = {}) {
  return request({
    url: '/processingMgr/knitOrder/finish',
    method: 'post',
    data: data
  })
}
// 获取分析单详情
export async function getDetail(data) {
  return request({
    url: 'techManage/sampleAnalysisResult/info',
    method: 'post',
    data
  })
}

// 获取打印详情
export async function getPrintDetail(data) {
  return request({
    url: '/processingMgr/knitOrder/print',
    method: 'post',
    data
  })
}
