import request from '@/utils/request'

// 分页查询组织机构列表
export function orgPage(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 50 }
  return request({
    url: '/userCenter/sysOrg/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 查询组织机构列表
export function sysOrgList(data) {
  return request({
    url: '/userCenter/sysOrg/list',
    method: 'post',
    data
  })
}

// 添加组织机构
export function sysOrgAdd(data) {
  return request({
    url: '/userCenter/sysOrg/add',
    method: 'post',
    data
  })
}

// 编辑组织机构
export function sysOrgModify(data) {
  return request({
    url: '/userCenter/sysOrg/modify',
    method: 'post',
    data
  })
}

// 删除组织机构
export function sysOrgDelete(data) {
  return request({
    url: '/userCenter/sysOrg/delete',
    method: 'post',
    data
  })
}

// 幂等性(创建请求token)
export function apiIdempotentCreateToken(data) {
  return request({
    url: '/userCenter/apiIdempotent/createToken',
    method: 'post',
    data
  })
}

// 查看组织机构详情
export function sysOrgInfo(data) {
  return request({
    url: '/userCenter/sysOrg/info',
    method: 'post',
    data
  })
}

// 修改部门下员工列表
export function sysOrgUserModify(data) {
  return request({
    url: '/userCenter/sysOrg/user/modify',
    method: 'post',
    data
  })
}

// 用户下拉列表
export function getUserListOption(data) {
  return request({
    url: '/userCenter/sysUser/basicList',
    method: 'post',
    data
  })
}
// 部门类型列表
export function getSysOrgTypeOption(data) {
  return request({
    url: '/userCenter/sysOrgType/list',
    method: 'post',
    data
  })
}
// 企业微信同步
export function sysOrgSync(data) {
  return request({
    url: '/userCenter/sysOrg/sync',
    method: 'post',
    data
  })
}

