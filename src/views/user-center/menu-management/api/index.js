import request from '@/utils/request'

// 分页查询权限列表
export function sysPermitPage(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/userCenter/sysPermit/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 添加权限列表
export function sysPermitAdd(data) {
  return request({
    url: '/userCenter/sysPermit/add',
    method: 'post',
    data
  })
}

// 编辑权限列表
export function sysPermitModify(data) {
  return request({
    url: '/userCenter/sysPermit/modify',
    method: 'post',
    data
  })
}

// 删除权限列表
export function sysPermitDelete(data) {
  return request({
    url: '/userCenter/sysPermit/delete',
    method: 'post',
    data
  })
}

// 查询权限列表
export function sysPermitList(data) {
  return request({
    url: '/userCenter/sysPermit/list',
    method: 'post',
    data
  })
}

// 查询权限详情
export function sysPermitInfo(data) {
  return request({
    url: '/userCenter/sysPermit/info',
    method: 'post',
    data
  })
}
