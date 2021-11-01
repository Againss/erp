// 过滤options方法
export function filterOptions(id, data, type, props = {}) {
  const getId = props.id || 'id'
  //   const getName = props.name || 'name'
  const filterArr = []
  if (data.length && type === 'add') {
    data.forEach(v => {
      if (v.enabled === 1) {
        filterArr.push(v)
      }
    })
  }
  if (data.length && type === 'edit') {
    data.forEach(v => {
      if (v.enabled === 1) {
        filterArr.push(v)
      } else if ((v.enabled === 0) && (Object.prototype.toString.call(id) !== '[object Array]' && parseInt(id) === v[getId]) || (Object.prototype.toString.call(id) === '[object Array]' && [...id].indexOf(v[getId]) > -1)) {
        // v[getName] = v[getName] + '(已禁用)'
        filterArr.push(v)
      }
    })
  }
  return filterArr
}
