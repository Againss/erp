// 成品物测api
import request from '@/utils/request'
// 编辑-(获取详情信息)
export function getPhysicalInfo(data) {
  return request({
    url: '/qa/qaFinishFabricPhysical/info',
    method: 'post',
    data
  })
}

// 修改
export function physicalModify(data) {
  return request({
    url: '/qa/qaFinishFabricPhysical/modify',
    method: 'post',
    data
  })
}
// 修改(无权限)
export function modifyNoAuth(data) {
  return request({
    url: '/qa/qaFinishFabricPhysical/modifyNoAuth',
    method: 'post',
    data
  })
}

// 修改状态
export function physicalExchange(data) {
  return request({
    url: '/qa/qaFinishFabricPhysical/exchange',
    method: 'post',
    data
  })
}
// 审核
export function physicalReview(data) {
  return request({
    url: '/qa/qaFinishFabricPhysical/review',
    method: 'post',
    data
  })
}

// 重检
export function physicalRepeat(data) {
  return request({
    url: '/qa/qaFinishFabricPhysical/repeat',
    method: 'post',
    data
  })
}

// 下载文件 新
export function downFile(data = {}) {
  return request({
    url: `/common/file/download/${data.url}`,
    responseType: 'arraybuffer',
    method: 'get',
    params: {}
  })
}
// 用户(员工)列表查询
export function outworkerList(data) {
  return request({
    url: '/userCenter/sysUser/list',
    method: 'post',
    data
  })
}
