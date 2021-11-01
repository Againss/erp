import request from '@/utils/request'

// 列表
export function apsPrintDayList(data = {}) {
  return request({
    url: '/bmpAps/apsPrintDay/page',
    method: 'post',
    data: { ...{ pageNum: 1, pageSize: 20 }, ...data }
  })
}
// 启用停用
export function changeApsPrintDay(data = {}) {
  return request({
    url: '/bmpAps/apsPrintDay/status',
    method: 'post',
    data: { ...{ workflowId: 1, status: 0 }, ...data }
  })
}
// 新增
export function addApsPrintDay(data = {}) {
  return request({
    url: '/bmpAps/apsPrintDay/add',
    method: 'post',
    data: { ...data }
  })
}
// 编辑
export function modifyApsPrintDay(data = {}) {
  return request({
    url: '/bmpAps/apsPrintDay/modify',
    method: 'post',
    data: { ...data }
  })
}
// 删除
export function deleteApsPrintDay(data = {}) {
  return request({
    url: '/bmpAps/apsPrintDay/delete',
    method: 'post',
    data: { ...data }
  })
}
