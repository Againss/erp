/*
 * @Date: 2021-05-11 14:54:29
 * @Author: Againss
 * @LastEditTime: 2021-07-15 11:01:24
 * @LastEditors: Againss
 * @Descripttion:
 */
import request from '@/utils/request'

// 角色列表查询
export function rolePageList(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/userCenter/sysRole/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 新增角色
export function roleAdd(data) {
  return request({
    url: '/userCenter/sysRole/add',
    method: 'post',
    data
  })
}

// 删除角色
export function roleDelete(data) {
  return request({
    url: '/userCenter/sysRole/delete',
    method: 'post',
    data
  })
}

// 修改角色
export function roleModify(data) {
  return request({
    url: '/userCenter/sysRole/modify',
    method: 'post',
    data
  })
}

// 查询角色列表
export function roleList(data) {
  return request({
    url: '/userCenter/sysRole/list',
    method: 'post',
    data
  })
}

// 查询角色拥有用户
export function roleUserList(data) {
  return request({
    url: '/userCenter/sysRole/user/list',
    method: 'post',
    data
  })
}

// 修改角色拥有用户
export function roleUserModify(data) {
  return request({
    url: '/userCenter/sysRole/user/modify',
    method: 'post',
    data
  })
}

// 公司类型列表查询
export function companyAccountTypesList(data) {
  return request({
    url: '/userCenter/companyAccountTypes/list',
    method: 'post',
    data
  })
}

// 公司列表查询
export function companyAccountsList(data) {
  return request({
    url: '/userCenter/companyAccounts/list',
    method: 'post',
    data
  })
}

// 角色详情
export function roleInfo(data) {
  return request({
    url: '/userCenter/sysRole/info',
    method: 'post',
    data
  })
}
