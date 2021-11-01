
import request from '@/utils/request'

// 成品批色-详情
export function qaFinishBatchColorInfo(data = {}) {
  return request({
    url: '/qa/qaFinishBatchColor/info',
    method: 'post',
    data: data
  })
}
// 成品批色-修改
export function qaFinishBatchColorInfoModify(data = {}) {
  return request({
    url: '/qa/qaFinishBatchColor/modify',
    method: 'post',
    data: data
  })
}
// 成品批色-修改(无权限)
export function qaFinishBatchColorInfoModifyNoAuth(data = {}) {
  return request({
    url: '/qa/qaFinishBatchColor/modifyNoAuth',
    method: 'post',
    data: data
  })
}
// 成品批色-修改状态
export function exchange(data = {}) {
  return request({
    url: '/qa/qaFinishBatchColor/exchange',
    method: 'post',
    data: data
  })
}
// 成品批色-审核
export function review(data = {}) {
  return request({
    url: '/qa/qaFinishBatchColor/review',
    method: 'post',
    data: data
  })
}

