import request from '@/utils/request'

// 分页查询应用系统列表
export function sysAppSystem(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/userCenter/sysAppSystem/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 查询应用系统列表
export function sysAppSystemList(data) {
  return request({
    url: '/userCenter/sysAppSystem/list',
    method: 'post',
    data
  })
}

// 添加应用系统
export function addSysAppSystem(data) {
  return request({
    url: '/userCenter/sysAppSystem/add',
    method: 'post',
    data
  })
}

// 修改应用系统
export function modifySysAppSystem(data) {
  return request({
    url: '/userCenter/sysAppSystem/modify',
    method: 'post',
    data
  })
}

// 删除应用系统
export function deleteSysAppSystem(data) {
  return request({
    url: '/userCenter/sysAppSystem/delete',
    method: 'post',
    data
  })
}

// 查询权限列表
export function permitList(data) {
  return request({
    url: '/userCenter/sysPermit/list',
    method: 'post',
    data
  })
}

// 获取系统关联的权限
export function appSystemPermits(data) {
  return request({
    url: '/userCenter/sysAppSystem/appSysDatePermitIds',
    method: 'post',
    data
  })
}

// 设置数据范围
export function setAppSysDataPermit(data) {
  return request({
    url: '/userCenter/sysAppSystem/setAppSyDataPermit',
    method: 'post',
    data
  })
}

// 查应用系统详情
export function sysAppSystemInfo(data) {
  return request({
    url: '/userCenter/sysAppSystem/info',
    method: 'post',
    data
  })
}

// 查询用户应用系统id列表
export function sysAppSystemAppSystemIdList(data) {
  return request({
    url: '/userCenter/sysAppSystem/appSystemIdList',
    // url: '/mock/20/sysAppSystem/appSystemIdList',
    method: 'post',
    data
  })
}
