import request from '@/utils/request'

// 客户分页查询
export function customerPage(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/crm/customer/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 客户列表
export function customerList(data) {
  return request({
    url: '/crm/customer/list',
    method: 'post',
    data
  })
}

// 客户详情
export function customerInfo(data) {
  return request({
    url: '/crm/customer/info',
    method: 'post',
    data
  })
}

// 客户新增
export function customerAdd(data) {
  return request({
    url: '/crm/customer/add',
    method: 'post',
    data
  })
}

// 客户删除
export function customerDelete(data) {
  return request({
    url: '/crm/customer/delete',
    method: 'post',
    data
  })
}

// 客户修改
export function customerModify(data) {
  return request({
    url: '/crm/customer/modify',
    method: 'post',
    data
  })
}

// 客户更改所有人
export function customerModifyFollower(data) {
  return request({
    url: '/crm/customer/modify/follower',
    method: 'post',
    data
  })
}
