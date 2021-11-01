import request from '@/utils/request'

// 品牌商分页查询
export function brandPage(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/crm/brand/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 品牌商全量列表
export function brandList(data) {
  return request({
    url: '/crm/brand/list',
    method: 'post',
    data
  })
}

// 品牌商详情
export function brandInfo(data) {
  return request({
    url: '/crm/brand/info',
    method: 'post',
    data
  })
}

// 品牌商更改所有人
export function brandModifyFollower(data) {
  return request({
    url: '/crm/brand/modify/follower',
    method: 'post',
    data
  })
}

// 修改品牌商
export function brandModify(data) {
  return request({
    url: '/crm/brand/modify',
    method: 'post',
    data
  })
}

// 删除品牌商
export function brandDelete(data) {
  return request({
    url: '/crm/brand/delete',
    method: 'post',
    data
  })
}

// 新增品牌商
export function brandAdd(data) {
  return request({
    url: '/crm/brand/add',
    method: 'post',
    data
  })
}

// 品牌商关联客户
export function customerBrandLink(data) {
  return request({
    url: '/crm/customer/brand/link',
    method: 'post',
    data
  })
}
// 品牌商取消关联客户
export function customerBrandUnlink(data) {
  return request({
    url: '/crm/customer/brand/unlink',
    method: 'post',
    data
  })
}

// 品牌商相关客户分页
export function customerBrandCustomerPage(data) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/crm/customer/brand/customerPage',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 客户相关品牌商分页
export function customerBrandBrandPage(data) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/crm/customer/brand/brandPage',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}
