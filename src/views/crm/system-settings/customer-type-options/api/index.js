import request from '@/utils/request'

// 客户类型选项分页查询
export function customerTypePage(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/crm/customer/type/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 客户类型选项详情
export function customerTypeInfo(data) {
  return request({
    url: '/crm/customer/type/info',
    method: 'post',
    data
  })
}

// 客户类型选项修改
export function customerTypeModify(data) {
  return request({
    url: '/crm/customer/type/modify',
    method: 'post',
    data
  })
}

// 客户类型选项全量列表
export function customerTypeList(data) {
  return request({
    url: '/crm/customer/type/list',
    method: 'post',
    data
  })
}

// 客户类型选项新增
export function customerTypeAdd(data) {
  return request({
    url: '/crm/customer/type/add',
    method: 'post',
    data
  })
}

// 客户类型选项删除
export function customerTypeDelete(data) {
  return request({
    url: '/crm/customer/type/delete',
    method: 'post',
    data
  })
}

