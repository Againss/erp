import request from '@/utils/request'

// 列表
export function apsKnitDayList(data = {}) {
  return request({
    url: '/bmpAps/apsKnitDay/page',
    method: 'post',
    data: { ...{ pageNum: 1, pageSize: 20 }, ...data }
  })
}
// 启用停用
export function changeApsKnitDay(data = {}) {
  return request({
    url: '/bmpAps/apsKnitDay/status',
    method: 'post',
    data: { ...{ workflowId: 1, status: 0 }, ...data }
  })
}
// 新增
export function addApsKnitDay(data = {}) {
  return request({
    url: '/bmpAps/apsKnitDay/add',
    method: 'post',
    data: { ...data }
  })
}
// 编辑
export function modifyApsKnitDay(data = {}) {
  return request({
    url: '/bmpAps/apsKnitDay/modify',
    method: 'post',
    data: { ...data }
  })
}
// 删除
export function deleteApsKnitDay(data = {}) {
  return request({
    url: '/bmpAps/apsKnitDay/delete',
    method: 'post',
    data: { ...data }
  })
}
