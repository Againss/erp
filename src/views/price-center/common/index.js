/*
 * @Descripttion:
 * @version:
 * @Author: ll
 * @Date: 2020-10-28
 * @LastEditors: admin
 * @LastEditTime: 2021-05-06 17:33:26
 */

// 过滤options方法
export function filterOptions(id, data, type, props = {}) {
  const getId = props.id || 'id'
  //   const getName = props.name || 'name'
  const filterArr = []
  if (data.length && type === 'add') {
    data.forEach(v => {
      if (v.enabled === 'Y') {
        filterArr.push(v)
      }
    })
  }
  if (data.length && type === 'edit') {
    // filterArr = Object.freeze([])
    data.forEach(v => {
      if (v.enabled === 'Y') {
        filterArr.push(v)
      } else if ((v.enabled === 'N') && (Object.prototype.toString.call(id) !== '[object Array]' && parseInt(id) === v[getId]) || (Object.prototype.toString.call(id) === '[object Array]' && [...id].indexOf(v[getId]) > -1)) {
        // v[getName] = v[getName] + '(已禁用)'
        filterArr.push(v)
      }
    })
  }
  return filterArr
}

// 取消弹窗确认方法
export function dataComparision(oldData, newData, type = 'edit') {
  let hadInput = false
  if (type === 'edit' || !Object.keys(oldData).length) {
    for (const i in newData) {
      if (newData[i] !== oldData[i]) {
        hadInput = true
        break
      }
    }
  } else if (Object.keys(oldData).length > 0) {
    hadInput = true
  }
  return hadInput
}

// 获取搜索下拉数据
export function setSearchData(res, parmas) {
  const r = res.reduce((a, n) => {
    const keyArr = Object.keys(n).filter(e => typeof n[e] === 'object')
    keyArr.forEach(e => {
      if (n[e] && n[e].value && (parmas ? parmas.value === n[parmas.key] : true)) {
        const data = {
          value: n[e].value,
          label: n[e].label
        }
        if (e === 'composition') {
          data.type = n[e].type
        }
        if (a[e]) {
          const has = a[e].find(item => JSON.stringify(item) === JSON.stringify(data))
          if (!has) {
            a[e].push(data)
          }
        } else {
          a[e] = [data]
        }
      }
    })
    return a
  }, {})
  return r
}

export function checkMin(value, data) {
  const reg = /^[0-9]\d{0,8}?$/
  if ((data.minWeight && !reg.test(data.minWeight))) {
    return '0~999999999'
  }
  if (data.minWeight && data.maxWeight && (data.minWeight * 1 > data.maxWeight * 1)) {
    return '前值不能大于后值'
  }
}

export function checkMax(value, data) {
  const regMax = /^(([1-9]{1}\d{0,8})|(0{1}))(\.\d{1,3})?$/
  if (data.maxWeight === '0') {
    return '0.001~999999999.999'
  }
  if ((data.maxWeight && !regMax.test(data.maxWeight))) {
    return '0.001~999999999.999'
  }
  if (data.minWeight && data.maxWeight && (data.minWeight * 1 > data.maxWeight * 1)) {
    return '前值不能大于后值'
  }
}

// 验证两个值大小
export function checkValues(value, data) {
  const reg = /^[1-9]\d{0,8}?$/
  if ((data.minWeight && !reg.test(data.minWeight)) || (data.maxWeight && !reg.test(data.maxWeight))) {
    return '请输入最多9位正整数'
  }
  if (data.minWeight && data.maxWeight && (data.minWeight * 1 > data.maxWeight * 1)) {
    return '前值不能大于后值'
  }
}

// 验证 验证两个值大小 支持小数点后2位，前3位
export function compareValues(value, data, reg) {
  const regNew = reg || /^(([1-9]{1}\d{0,2})|(0{1}))(\.\d{1,2})?$/
  if ((data.minWeight && !regNew.test(data.minWeight)) || (data.maxWeight && !regNew.test(data.maxWeight))) {
    return reg ? '请输入正整数' : '最大3位整数或保留1到2位小数'
  }
  if (data.minWeight && data.maxWeight && (data.minWeight * 1 > data.maxWeight * 1)) {
    return '前值不能大于后值'
  }
}
