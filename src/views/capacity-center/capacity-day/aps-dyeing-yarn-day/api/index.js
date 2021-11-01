import request from '@/utils/request'

// 列表
export function apsDyeingYarnDayList(data = {}) {
  return request({
    url: '/bmpAps/apsDyeingYarnDay/page',
    method: 'post',
    data: { ...{ pageNum: 1, pageSize: 20 }, ...data }
  })
}
// 启用停用
export function changeApsDyeingYarnDay(data = {}) {
  return request({
    url: '/bmpAps/apsDyeingYarnDay/status',
    method: 'post',
    data: { ...{ workflowId: 1, status: 0 }, ...data }
  })
}
// 新增
export function addApsDyeingYarnDay(data = {}) {
  return request({
    url: '/bmpAps/apsDyeingYarnDay/add',
    method: 'post',
    data: { ...data }
  })
}
// 编辑
export function modifyApsDyeingYarnDay(data = {}) {
  return request({
    url: '/bmpAps/apsDyeingYarnDay/modify',
    method: 'post',
    data: { ...data }
  })
}
// 删除
export function deleteApsDyeingYarnDay(data = {}) {
  return request({
    url: '/bmpAps/apsDyeingYarnDay/delete',
    method: 'post',
    data: { ...data }
  })
}
