import request from '@/utils/request'

// 仪表设置分页查询
export function dashboardPage(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/crm/dashboard/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 仪表设置详情
export function dashboardInfo(data) {
  return request({
    url: '/crm/dashboard/info',
    method: 'post',
    data
  })
}

// 仪表设置修改
export function dashboardModify(data) {
  return request({
    url: '/crm/dashboard/modify',
    method: 'post',
    data
  })
}

// 仪表设置全量列表
export function dashboardList(data) {
  return request({
    url: '/crm/dashboard/list',
    method: 'post',
    data
  })
}

// 仪表设置新增
export function dashboardAdd(data) {
  return request({
    url: '/crm/dashboard/add',
    method: 'post',
    data
  })
}

// 仪表设置删除
export function dashboardDelete(data) {
  return request({
    url: '/crm/dashboard/delete',
    method: 'post',
    data
  })
}

