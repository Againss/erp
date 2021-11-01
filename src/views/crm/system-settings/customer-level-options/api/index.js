import request from '@/utils/request'

// 客户级别选项分页查询
export function customerLevelPage(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/crm/customer/level/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 客户级别选项详情
export function customerLevelInfo(data) {
  return request({
    url: '/crm/customer/level/info',
    method: 'post',
    data
  })
}

// 客户级别选项修改
export function customerLevelModify(data) {
  return request({
    url: '/crm/customer/level/modify',
    method: 'post',
    data
  })
}

// 客户级别选项全量列表
export function customerLevelList(data) {
  return request({
    url: '/crm/customer/level/list',
    method: 'post',
    data
  })
}

// 客户级别选项新增
export function customerLevelAdd(data) {
  return request({
    url: '/crm/customer/level/add',
    method: 'post',
    data
  })
}

// 客户级别选项删除
export function customerLevelDelete(data) {
  return request({
    url: '/crm/customer/level/delete',
    method: 'post',
    data
  })
}

