import request from '@/utils/request'

// 坯布确板详情
export function qaGreySwatchesTaskInfo(data = {}) {
  return request({
    url: '/qa/qaGreigeSwatchesTask/info',
    method: 'post',
    data
  })
}

// 坯布确板编辑
export function qaGreySwatchesTaskModify(data = {}) {
  return request({
    url: '/qa/qaGreigeSwatchesTask/modify',
    method: 'post',
    data
  })
}

// 坯布确板取消
export function greigeSwatchesTaskCancel(data = {}) {
  return request({
    url: 'qa/qaGreigeSwatchesTask/cancel',
    method: 'post',
    data
  })
}
