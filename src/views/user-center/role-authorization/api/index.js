import request from '@/utils/request'

// 查看角色拥有权限
export function rolePermitList(data) {
  return request({
    url: '/userCenter/sysRole/permit/list',
    method: 'post',
    data
  })
}

// 修改角色拥有权限
export function rolePermitModify(data) {
  return request({
    url: '/userCenter/sysRole/permit/modify',
    method: 'post',
    data
  })
}

// 查询角色拥有加密规则
export function sysDataMaskingRuleRuleList(data) {
  return request({
    url: '/userCenter/sysDataMaskingRule/rule/list',
    method: 'post',
    data
  })
}

// 修改角色拥有加密规则
export function sysDataMaskingRuleRuleModify(data) {
  return request({
    url: '/userCenter/sysDataMaskingRule/role/modify',
    method: 'post',
    data
  })
}
