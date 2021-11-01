import request from '@/utils/request'
// 分页查询
export function list(data = {}) {
  return request({
    url: '/processingMgr/knitProductionSchedule/page',
    method: 'post',
    data: data
  })
}

// 获取页签数据
export function count(data = {}) {
  return request({
    url: '/processingMgr/knitProductionSchedule/pageGroupCount',
    method: 'post',
    data: data
  })
}

// 导出
export function exportSchedule(data = {}) {
  return request({
    url: '/processingMgr/knitProductionSchedule/exportSchedule',
    method: 'post',
    responseType: 'arraybuffer',
    data: data
  })
}
