import request from '@/utils/request'

// 查询加密规则分页
export function sysDataMaskingRulePage(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/userCenter/sysDataMaskingRule/page',
    method: 'post',
    data: { ...defaultParams, ...data }
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

// 新增加密规则
export function sysDataMaskingRuleAdd(data) {
  return request({
    url: '/userCenter/sysDataMaskingRule/add',
    method: 'post',
    data
  })
}

// 修改加密规则
export function sysDataMaskingRuleModify(data) {
  return request({
    url: '/userCenter//sysDataMaskingRule/modify',
    method: 'post',
    data
  })
}

// 删除加密规则
export function sysDataMaskingRuleDelete(data) {
  return request({
    url: '/userCenter/sysDataMaskingRule/delete',
    method: 'post',
    data
  })
}

// 加密规则详情
export function sysDataMaskingRuleInfo(data) {
  return request({
    url: '/userCenter/sysDataMaskingRule/info',
    method: 'post',
    data
  })
}

// 业务单据列表查询
export function formList(data) {
  return request({
    url: '/userCenter/sysDataMaskingRule/form/list',
    method: 'post',
    data
  })
}

// 设置规则对应的业务表单即表单对应的字段加密数据
export function ruleFormModify(data) {
  return request({
    url: '/userCenter/sysDataMaskingRule/rule/form/modify',
    method: 'post',
    data
  })
}

// 重置规则对应的业务表单即表单对应的字段加密数据
export function ruleFormReset(data) {
  return request({
    url: '/userCenter/sysDataMaskingRule/rule/form/reset',
    method: 'post',
    data
  })
}

// 查询数据脱敏关联角色列表
export function getRelateRoleList(data) {
  return request({
    url: '/userCenter/sysDataMaskingRule/relate/role/list',
    method: 'post',
    data
  })
}
// 修改数据脱敏关联角色
export function relateRoleModify(data) {
  return request({
    url: '/userCenter/sysDataMaskingRule/relate/role/modify',
    method: 'post',
    data
  })
}
// 修改数据脱敏关联用户
export function relateUserModify(data) {
  return request({
    url: '/userCenter/sysDataMaskingRule/relate/user/modify',
    method: 'post',
    data
  })
}
// 查询数据脱敏关联用户列表
export function getRelateUserList(data) {
  return request({
    url: '/userCenter/sysDataMaskingRule/relate/user/list',
    method: 'post',
    data
  })
}

