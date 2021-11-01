export function checkNum(rule, value, callback) {
  const reg = /^[1-9]\d{0,9}?$/
  if (value && (parseInt(value) === 0 || !reg.test(value))) {
    return callback(new Error('请填写正整数'))
  } else {
    callback()
  }
}
