import request from '@/utils/request'

// 联系人分页查询
export function contactPersonPage(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/crm/contactPerson/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 联系人详情
export function contactPersonInfo(data) {
  return request({
    url: '/crm/contactPerson/info',
    method: 'post',
    data
  })
}

// 联系人列表查询
export function contactPersonList(data) {
  return request({
    url: '/crm/contactPerson/list',
    method: 'post',
    data
  })
}

// 修改联系人
export function contactPersonModify(data) {
  return request({
    url: '/crm/contactPerson/modify',
    method: 'post',
    data
  })
}

// 删除联系人
export function contactPersonDelete(data) {
  return request({
    url: '/crm/contactPerson/delete',
    method: 'post',
    data
  })
}

// 新增联系人
export function contactPersonAdd(data) {
  return request({
    url: '/crm/contactPerson/add',
    method: 'post',
    data
  })
}

// 新增更改所有人
export function contactPersonModifyFollower(data) {
  return request({
    url: '/crm/contactPerson/modify/follower',
    method: 'post',
    data
  })
}

