import request from '@/utils/request'

// 查看角色拥有权限
export function currentUserInfo(data) {
  return request({
    url: '/userCenter/sysUser/currentUser/info',
    method: 'post',
    data
  })
}

// 修改邮箱发送验证码邮件
export function sendEmail(data) {
  return request({
    url: '/userCenter/sysUser/email/modify/sendEmail',
    method: 'post',
    data
  })
}

// 修改手机号
export function mobileModify(data) {
  return request({
    url: '/userCenter/sysUser/mobile/modify',
    method: 'post',
    data
  })
}

// 修改手机号发送验证码短信
export function sendSMS(data) {
  return request({
    url: '/userCenter/sysUser/mobile/modify/sendSMS',
    method: 'post',
    data
  })
}

// 修改邮箱
export function emailModify(data) {
  return request({
    url: '/userCenter/sysUser/email/modify',
    method: 'post',
    data
  })
}

