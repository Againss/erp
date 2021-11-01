import request from '@/utils/request'

// 分页查询用户(员工)列表
export function userPageList(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/userCenter/sysUser/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 用户(员工)列表查询
export function userList(data) {
  return request({
    url: '/userCenter/sysUser/list',
    method: 'post',
    data
  })
}

// 删除员工
export function userDelete(data) {
  return request({
    url: '/userCenter/sysUser/delete',
    method: 'post',
    data
  })
}

// 添加员工(用户)
export function userAdd(data) {
  return request({
    url: '/userCenter/sysUser/add',
    method: 'post',
    data
  })
}

// 修改员工(用户)
export function userModify(data) {
  return request({
    url: '/userCenter/sysUser/modify',
    method: 'post',
    data
  })
}

// 禁用用户(员工)
export function userDisable(data) {
  return request({
    url: '/userCenter/sysUser/disable',
    method: 'post',
    data
  })
}

// 启用用户(员工)
export function userEnable(data) {
  return request({
    url: '/userCenter/sysUser/enable',
    method: 'post',
    data
  })
}

// 重置登录密码
export function userPasswordReset(data) {
  return request({
    url: '/userCenter/sysUser/password/reset',
    method: 'post',
    data
  })
}

// 查看用户拥有角色
export function userRoleList(data) {
  return request({
    url: '/userCenter/sysUser/role/list',
    method: 'post',
    data
  })
}

// 修改用户角色
export function userRoleModify(data) {
  return request({
    url: '/userCenter/sysUser/role/modify',
    method: 'post',
    data
  })
}

// 获取用户详情
export function userInfo(data) {
  return request({
    url: '/userCenter/sysUser/info',
    method: 'post',
    data
  })
}

// 下载excel模板
export function excelTemplate(data) {
  return request({
    url: '/userCenter/sysUser/download/excel/template',
    method: 'get',
    data
  })
}

// 批量导入用户
export function sysUserBatchAdd(data) {
  return request({
    url: '/userCenter/sysUser/batch/add',
    method: 'get',
    data
  })
}

// 微信解绑
export function sysUserweChatRelease(data) {
  return request({
    url: '/userCenter/sysUser/weChatRelease',
    method: 'post',
    data
  })
}
// 企业微信解绑
export function unBoundWeCom(data) {
  return request({
    url: '/userCenter/sysUser/unBoundWeCom',
    method: 'post',
    data
  })
}
// 查询加密规则列表
export function sysDataMaskingRuleList(data) {
  return request({
    url: '/userCenter/sysDataMaskingRule/list',
    method: 'post',
    data
  })
}

