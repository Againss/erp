import request from '@/utils/request'

// 分页查询数据范围
export function sysDataGroupPage(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/userCenter/sysDataGroup/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 新增数据范围
export function sysDataGroupAdd(data) {
  return request({
    url: '/userCenter/sysDataGroup/add',
    method: 'post',
    data
  })
}

// 修改数据范围
export function sysDataGroupModify(data) {
  return request({
    url: '/userCenter/sysDataGroup/modify',
    method: 'post',
    data
  })
}

// 删除数据范围
export function sysDataGroupDelete(data) {
  return request({
    url: '/userCenter/sysDataGroup/delete',
    method: 'post',
    data
  })
}

// 数据表单列表
export function bussinessBillList(data) {
  return request({
    url: '/userCenter/sysDataGroup/bussinessBillList/tree',
    method: 'post',
    data
  })
}

// 数据范围详情
export function sysDataGroupInfo(data) {
  return request({
    url: '/userCenter/sysDataGroup/info',
    method: 'post',
    data
  })
}

// 查询数据范围(不分页)
export function sysDataGroupList(data) {
  return request({
    url: '/userCenter/sysDataGroup/list',
    method: 'post',
    data
  })
}
// 修改数据范围关联用户列表
export function sysDataGroupUserModify(data) {
  return request({
    url: '/userCenter/sysDataGroup/user/modify',
    method: 'post',
    data
  })
}

