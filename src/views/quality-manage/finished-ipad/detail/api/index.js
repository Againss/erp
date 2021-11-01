// 成品物测api
import request from '@/utils/request'
// 编辑-(获取详情信息)
export function getPhysicalInfo(data) {
  return request({
    url: '/qa/finishFabricPhysical/info',
    method: 'post',
    data
  })
}

// 修改
export function physicalModify(data) {
  return request({
    url: '/qa/finishFabricPhysical/modify',
    method: 'post',
    data
  })
}

// 审核
export function physicalDelete(data) {
  return request({
    url: '/qa/finishFabricPhysical/review',
    method: 'post',
    data
  })
}

// 重检
export function physicalRepeat(data) {
  return request({
    url: '/qa/finishFabricPhysical/repeat',
    method: 'post',
    data
  })
}
