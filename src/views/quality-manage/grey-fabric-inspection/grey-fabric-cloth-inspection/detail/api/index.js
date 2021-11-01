import request from '@/utils/request'

// 坯布验布详情
export function qaGreyFabricTaskInfo(data = {}) {
  return request({
    url: '/qa/qaGreigeFabricTask/info',
    method: 'post',
    data
  })
}

// 坯布验布编辑
export function qaGreigeFabricTaskModify(data = {}) {
  return request({
    url: '/qa/qaGreigeFabricTask/modify',
    method: 'post',
    data
  })
}

// 坯布验布取消任务
export function qaGreyFabricTaskCancel(data = {}) {
  return request({
    url: '/qa/qaGreigeFabricTask/cancel',
    method: 'post',
    data
  })
}
