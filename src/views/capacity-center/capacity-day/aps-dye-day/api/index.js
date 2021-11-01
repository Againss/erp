import request from '@/utils/request'

// 列表
export function apsDyeDayList(data = {}) {
  return request({
    url: '/bmpAps/apsDyeDay/page',
    method: 'post',
    data: { ...{ pageNum: 1, pageSize: 20 }, ...data }
  })
}
// 启用停用
export function changeApsDyeDay(data = {}) {
  return request({
    url: '/bmpAps/apsDyeDay/status',
    method: 'post',
    data: { ...{ workflowId: 1, status: 0 }, ...data }
  })
}
// 新增
export function addApsDyeDay(data = {}) {
  return request({
    url: '/bmpAps/apsDyeDay/add',
    method: 'post',
    data: { ...data }
  })
}
// 编辑
export function modifyApsDyeDay(data = {}) {
  return request({
    url: '/bmpAps/apsDyeDay/modify',
    method: 'post',
    data: { ...data }
  })
}
// 删除
export function deleteApsDyeDay(data = {}) {
  return request({
    url: '/bmpAps/apsDyeDay/delete',
    method: 'post',
    data: { ...data }
  })
}
