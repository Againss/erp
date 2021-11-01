export function numberBlurReg(rule, value, callback) {
  const res = /^[0-9]*$/
  if (!res.test(value)) {
    callback(new Error('手机号必须是数字'))
  } else {
    callback()
  }
}
export function phoneBlurReg(rule, value, callback) {
  const res = /^1[3-578]\d{9}$/
  if (!res.test(value)) {
    callback(new Error('请输入正确的手机号码格式'))
  } else {
    callback()
  }
}
