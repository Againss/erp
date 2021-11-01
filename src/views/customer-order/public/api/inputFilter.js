/* 金额展示 */
export function numRecursion(num) {
  if (!/^[0-9]+.?[0-9]*$/.test(num)) {
    return 0.00
  }
  function zzz(num) {
    if (num / 1000 >= 1) {
      zzz(parseInt(num / 1000))
      const temp = (num % 1000 + '').padStart(3, '0')
      newStr = newStr + ',' + temp
    } else {
      newStr = num % 1000
    }
    return newStr
  }
  return zzz(parseInt(num)) + '.' + num.toFixed(2).split('.')[1]
}

/* 输入过滤 */
export function inputFilter(val, decimal) {
  val = val.replace(/[^\d.]/g, '') // 清除“数字”和“.”以外的字符
  val = val.replace(/\.{2,}/g, '.') // 只保留第一个. 清除多余的
  val = val.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
  if (decimal === 4) {
    val = val.replace(/^(\-)*(\d+)\.(\d{4}).*$/, '$1$2.$3') // 只能输入四个小数
  } else if (decimal === 1) {
    val = val.replace(/^(\-)*(\d+)\.(\d{1}).*$/, '$1$2.$3') // 只能输入一个小数
  } else {
    val = val.replace(/^(\-)*(\d+)\.(\d{2}).*$/, '$1$2.$3') // 只能输入两个小数
  }
  if (val.indexOf('.') < 0 && val !== '') {
    // 以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
    val = parseFloat(val)
  }
  return val
}

/* 输入过滤整数 */
export function integerFilter(val, decimal) {
  val = val.replace(/[^\d]/g, '') // 清除“数字”和“.”以外的字符
  if (val.indexOf('.') < 0 && val !== '') {
    // 以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
    val = parseFloat(val)
  }
  return val
}
export function getStatus(data) {
  let status = ''
  switch (data) {
    case 'W':
      status = `<span style="color:#FF9214">待提交</span>`
      break
    case 'S':
      status = `<span style="color:#00BCC5">已提交</span>`
      break
    case 'R':
      status = `<span style="color:#FF4444">已回撤</span>`
      break
    case 'F':
      status = `<span style="color:#00BCC5">已完工</span>`
      break
    case 'C':
      status = `<span style="color:#888E9E">已取消</span>`
      break
    default:
      status = ''
      break
  }
  return status
}