import request from '@/utils/request'
// 分页查询
export function list(data = {}) {
  return request({
    url: '/processingMgr/knitSendNotify/page',
    method: 'post',
    data: data
  })
}

export function info(data = {}) {
  return request({
    url: '/processingMgr/knitSendNotify/info',
    method: 'post',
    data: data
  })
}

