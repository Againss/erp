/*
 * @Descripttion:
 * @version:
 * @Author: ll
 * @Date: 2020-10-28
 * @LastEditors: anthony
 * @LastEditTime: 2021-01-08 10:00:05
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
      } else if ((v.enabled === 'N') && (Object.prototype.toString.call(id) !== '[object Array]' && (parseInt(id) === v[getId] || id === v[getId])) || (Object.prototype.toString.call(id) === '[object Array]' && [...id].indexOf(v[getId]) > -1)) {
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
