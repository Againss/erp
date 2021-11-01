/**
 * @Description: 获取公共方法
 * @author Roman
 * @date 2020/5/28
 */
/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
  if (!time || arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string')) {
      if ((/^[0-9]+$/.test(time))) {
        // support "1548221490638"
        time = parseInt(time)
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        time = time.replace(new RegExp(/-/gm), '/')
      }
    }

    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function getQueryObject(url) {
  url = url == null ? window.location.href : url
  const search = url.substring(url.lastIndexOf('?') + 1)
  const obj = {}
  const reg = /([^?&=]+)=([^?&=]*)/g
  search.replace(reg, (rs, $1, $2) => {
    const name = decodeURIComponent($1)
    let val = decodeURIComponent($2)
    val = String(val)
    obj[name] = val
    return rs
  })
  return obj
}

/**
 * @param {string} input value
 * @returns {number} output value
 */
export function byteLength(str) {
  // returns the byte length of an utf8 string
  let s = str.length
  for (var i = str.length - 1; i >= 0; i--) {
    const code = str.charCodeAt(i)
    if (code > 0x7f && code <= 0x7ff) {
      s++
    } else if (code > 0x7ff && code <= 0xffff) s += 2
    if (code >= 0xDC00 && code <= 0xDFFF) i--
  }
  return s
}

/**
 * @param {Array} actual
 * @returns {Array}
 */
export function cleanArray(actual) {
  const newArray = []
  for (let i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i])
    }
  }
  return newArray
}

/**
 * @param {Object} json
 * @returns {Array}
 */
export function param(json) {
  if (!json) return ''
  return cleanArray(
    Object.keys(json).map(key => {
      if (json[key] === undefined) return ''
      return encodeURIComponent(key) + '=' + encodeURIComponent(json[key])
    })
  ).join('&')
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
    decodeURIComponent(search)
      .replace(/"/g, '\\"')
      .replace(/&/g, '","')
      .replace(/=/g, '":"')
      .replace(/\+/g, ' ') +
    '"}'
  )
}

/**
 * @param {string} val
 * @returns {string}
 */
export function html2Text(val) {
  const div = document.createElement('div')
  div.innerHTML = val
  return div.textContent || div.innerText
}

/**
 * Merges two objects, giving the last one precedence
 * @param {Object} target
 * @param {(Object|Array)} source
 * @returns {Object}
 */
export function objectMerge(target, source) {
  if (typeof target !== 'object') {
    target = {}
  }
  if (Array.isArray(source)) {
    return source.slice()
  }
  Object.keys(source).forEach(property => {
    const sourceProperty = source[property]
    if (typeof sourceProperty === 'object') {
      target[property] = objectMerge(target[property], sourceProperty)
    } else {
      target[property] = sourceProperty
    }
  })
  return target
}

/**
 * @param {HTMLElement} element
 * @param {string} className
 */
export function toggleClass(element, className) {
  if (!element || !className) {
    return
  }
  let classString = element.className
  const nameIndex = classString.indexOf(className)
  if (nameIndex === -1) {
    classString += '' + className
  } else {
    classString =
      classString.substr(0, nameIndex) +
      classString.substr(nameIndex + className.length)
  }
  element.className = classString
}

/**
 * @param {string} type
 * @returns {Date}
 */
export function getTime(type) {
  if (type === 'start') {
    return new Date().getTime() - 3600 * 1000 * 24 * 90
  } else {
    return new Date(new Date().toDateString())
  }
}

/**
 * @Description: 间隔防抖函数
 * @author Roman
 * @date 2021-06-01 19:56:43
 * @edit 2021-06-01 19:56:43
*/
export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result

  const later = function() {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function(...argss) {
    context = this
    args = argss
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, argss)
      context = argss = null
    }

    return result
  }
}

export function _debounce(wait) {
  return function(target, name, descriptor) {
    descriptor.value = debounce(descriptor.value, wait, true)
  }
}
/**
 * @Description: 异步防抖函数
 * @author Roman
 * @date 2021-06-01 19:56:10
 * @edit 2021-06-01 19:56:10
*/
export function debounceAsync(func) {
  let context; let result; let callNow = true
  return async function(...args) {
    context = this
    if (callNow) {
      callNow = false
      result = await func.apply(context, args)
      callNow = true
      context = args = null
    }
    return result
  }
}

export function _debounceAsync() {
  return function(target, name, descriptor) {
    descriptor.value = debounceAsync(descriptor.value)
  }
}
/**
 * @Description:间隔节流函数
 * @author Roman
 * @date 2021-06-01 16:31:51
 * @edit 2021-06-01 16:31:51
 * @param leading：false 表示禁用第一次执行
 * @param  trailing: false 表示禁用停止触发的回调
*/
export function throttle(func, wait, options) {
  let time, context, args
  let previous = 0
  if (!options) options = {}

  const later = function() {
    previous = options.leading === false ? 0 : new Date().getTime()
    time = null
    func.apply(context, args)
    if (!time) context = args = null
  }

  const throttled = function() {
    const now = new Date().getTime()
    if (!previous && options.leading === false) previous = now
    const remaining = wait - (now - previous)
    context = this
    args = arguments
    if (remaining <= 0 || remaining > wait) {
      if (time) {
        clearTimeout(time)
        time = null
      }
      previous = now
      func.apply(context, args)
      if (!time) context = args = null
    } else if (!time && options.trailing !== false) {
      time = setTimeout(later, remaining)
    }
  }
  return throttled
}

export function _throttle(wait) {
  return function(target, name, descriptor) {
    descriptor.value = throttle(descriptor.value, wait)
  }
}
/**
 * This is just a simple version of deep copy
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 * @param {Object} source
 * @returns {Object}
 */
export function deepClone(source, isfreeze = false) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'deepClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys], isfreeze)
    } else {
      targetObj[keys] = source[keys]
    }
  })
  if (isfreeze) {
    return Object.freeze(targetObj)
  }
  return targetObj
}

/**
 * @param {Array} arr
 * @returns {Array}
 */
export function uniqueArr(arr) {
  return Array.from(new Set(arr))
}

/**
 * @returns {string}
 */
export function createUniqueString() {
  const timestamp = +new Date() + ''
  const randomNum = parseInt((1 + Math.random()) * 65536) + ''
  return (+(randomNum + timestamp)).toString(32)
}

/**
 * Check if an element has a class
 * @param {HTMLElement} elm
 * @param {string} cls
 * @returns {boolean}
 */
export function hasClass(ele, cls) {
  return !!ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))
}

/**
 * Add class to element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function addClass(ele, cls) {
  if (!hasClass(ele, cls)) ele.className += ' ' + cls
}

/**
 * Remove class from element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function removeClass(ele, cls) {
  if (hasClass(ele, cls)) {
    const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)')
    ele.className = ele.className.replace(reg, ' ')
  }
}

export function getArrayFromKey(data, list, props, arr = []) {
  data.forEach(item => {
    if (list.includes(item[props.key])) {
      arr.push(
        item
      )
    }
    if (item[props.children] && item[props.children].length) {
      getArrayFromKey(item[props.children], list, props, arr)
    }
  })
  return arr
}

export function downloadStream(res) {
  let name = res.headers['content-disposition'] || ''
  name = decodeURIComponent(name.replace(/.*fileName=(.*)/gi, '$1'))
  const content = res.data
  const blob = new Blob([content])
  if (window.navigator.msSaveBlob) {
    navigator.msSaveBlob(blob, name)
  } else {
    const link = document.createElement('a')
    link.download = name
    link.style.display = 'none'
    link.href = URL.createObjectURL(blob)
    document.body.appendChild(link)
    link.click()
    URL.revokeObjectURL(link.href)
    document.body.removeChild(link)
  }
}

export function getStreamUrl(res) {
  const content = res.data
  const type = res.headers['content-type']
  const blob = new Blob([content], { type })
  return URL.createObjectURL(blob)
}

export function getEnvInfo() {
  const envObj = {
    'mock': 'mock数据开发环境',
    'development': '本地开发环境',
    'sit': '测试环境',
    'staging': '开发环境',
    'production': '生产环境',
    'demo': '演示环境'
  }
  const branch = process.env.envData.branch
  return { env: `${envObj[process.env.VUE_APP_ENV]}`, branch }
}

export function printEnvInfo() {
  const { env, branch } = getEnvInfo()
  console.info(
    `%c 当前环境 %c ${env} - ${branch} %c`,
    'background:#35495e ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff',
    'background:#1890ff ; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff',
    'background:transparent'
  )
}

/**
 * @Description: 过滤options方法
 * @author Roman
 * @date 2021-01-05 09:55:26
 * @edit 2021-01-05 09:55:26
 * @param {(string|number|array|object)} id 对应option选项里面的 value 值  在编辑状态下做回显用
 * @param {(array)} data 下拉框数组
 * @param {(string)} type edit 或 add
 * @param {(object)} props 字段映射  {id:'value',name:'label',enabled:'enabled',enabledValue:'Y',disabledValue:'N',disabledName:FUNCTION(方法)}
 * @param {(object)} enabled 如果字段为enabled为对象类似:  可以通过enabled:'enabled.code' 传参即可
 * @param "enabled": {
                "code": "Y",
                "describe": "启用"
           }
 使用示例:
 const data ={"id": 1,"name": "货交承运人","enabled": {"code": "N","describe": "启用"}},//此处 id 为 1 的 数据项为禁用数据
 {"id": 2,"name": "工厂交货","enabled": {"code": "Y","describe": "启用"}}
 const props = {id: 'id',name: 'name',enabled: 'enabled.code',enabledValue: 'Y',disabledValue: 'N'}
 filterOptions({ id : 1, data : data, type : 'edit', props : props})// 此处为编辑状态  且传参 id : 1 ,在编辑状态下会返回两条数据
 filterOptions({  data : data, type : 'add', props : props})// 此处为新增状态会过滤禁用数据 返回一条数据
 */
export function filterOptions({ id = '', data = [], type = 'edit', props = {}}) {
  const getId = props.id || 'id'
  const newID = Object.prototype.toString.call(id) === '[object Object]' ? id[getId] : id
  const getName = props.name || 'name'
  let enabled = props.enabled || 'enabled'
  enabled = enabled.split('.')

  function getEnabled(item, enabledArr) {
    let o = item
    enabledArr.forEach(v => {
      o = o[v]
    })
    return o
  }

  const enabledValue = Object.prototype.toString.call(props.enabledValue) !== '[object Undefined]' ? props.enabledValue : 'Y'
  const disabledValue = Object.prototype.toString.call(props.disabledValue) !== '[object Undefined]' ? props.disabledValue : 'N'
  const disabledName = props.disabledName
  const filterArr = []
  if (data.length && type === 'add') {
    data.forEach(v => {
      if (getEnabled(v, enabled) === enabledValue) {
        filterArr.push(v)
      }
    })
  }
  if (data.length && type === 'edit') {
    data.forEach(v => {
      let flag = false
      if (Object.prototype.toString.call(id) === '[object Array]') {
        id.forEach(j => {
          if (Object.prototype.toString.call(j) === '[object Object]') {
            if (j[getId] === v[getId]) {
              flag = true
            }
          } else {
            if (j === v[getId]) {
              flag = true
            }
          }
        })
      }
      if (getEnabled(v, enabled) === enabledValue) {
        filterArr.push(v)
      } else if ((getEnabled(v, enabled) === disabledValue) && (Object.prototype.toString.call(newID) !== '[object Array]' && v[newID] === v[getId]) || flag) {
        if (disabledName) {
          v[getName] = disabledName(v[getName], v)
        }
        filterArr.push(v)
      }
    })
  }
  return filterArr
}

/**
 * @Description: 小数四舍五入且保留n位小数
 * @author Roman
 * @date 2021-01-05 09:55:26
 * @edit 2021-01-05 09:55:26
 * @param {(string|number)} number 比如 getFloat(1.1234, 4) 返回值：1.1234
 * @param {(number)} n 比如 getFloat(1.1234, 2) 返回值：1.12
 * @param {(boolean)} keepInt 是否保持整数输出为整数  比如 getFloat(1, 4, keepInt = true) 返回值：1 类型为number ， getFloat(1, 4, keepInt = false) 返回值：'1.0000' 类型为string
 */
export function getFloat(number, n, keepInt = true) {
  if (!number && number !== 0) return ''
  if (Object.prototype.toString.call(number) === '[object String]' && /\*/.test(number)) {
    return number
  }
  let v = 1
  if (number < 0) v = -1
  n = n ? parseInt(n) : 0
  if (n <= 0) return Math.round(number)
  number = (Math.abs(number) * Math.pow(10, n)).toFixed(n + 2)
  number = Math.round(number) / Math.pow(10, n) * v
  if (!keepInt) {
    number = number.toFixed(n)
  }
  return number
}

/**
 * @Description: 价格格式化
 * @author Roman
 * @date 2021-04-01 19:48:38
 * @edit 2021-04-01 19:48:38
 */

export function priceFormat(value) {
  if (!value && value !== 0) return ''
  if (Object.prototype.toString.call(value) === '[object String]' && /\*/.test(value)) {
    return value
  }
  const intPart = Number(value) | 0
  const intPartFormat = intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') // 将整数部分逢三一断

  let floatPart = '.00'
  const value2Array = value.toString().split('.')

  if (value2Array.length === 2) {
    floatPart = value2Array[1].toString()

    if (floatPart.length === 1) {
      return intPartFormat + '.' + floatPart + '0'
    } else {
      return intPartFormat + '.' + floatPart
    }
  } else {
    return intPartFormat + floatPart
  }
}

/**
 * @Description: 深度对比两个对象是否相等
 * @author panmr
 * @date 2021-04-14
 * @edit 2021-04-14
 */

export function deepCompare(x, y) {
  var i, l, leftChain, rightChain

  function compare2Objects(x, y) {
    var p

    // remember that NaN === NaN returns false
    // and isNaN(undefined) returns true
    if (isNaN(x) && isNaN(y) && typeof x === 'number' && typeof y === 'number') {
      return true
    }

    // Compare primitives and functions.
    // Check if both arguments link to the same object.
    // Especially useful on the step where we compare prototypes
    if (x === y) {
      return true
    }

    // Works in case when functions are created in constructor.
    // Comparing dates is a common scenario. Another built-ins?
    // We can even handle functions passed across iframes
    if ((typeof x === 'function' && typeof y === 'function') ||
      (x instanceof Date && y instanceof Date) ||
      (x instanceof RegExp && y instanceof RegExp) ||
      (x instanceof String && y instanceof String) ||
      (x instanceof Number && y instanceof Number)) {
      return x.toString() === y.toString()
    }

    // At last checking prototypes as good as we can
    if (!(x instanceof Object && y instanceof Object)) {
      return false
    }

    if (x.isPrototypeOf(y) || y.isPrototypeOf(x)) {
      return false
    }

    if (x.constructor !== y.constructor) {
      return false
    }

    if (x.prototype !== y.prototype) {
      return false
    }

    // Check for infinitive linking loops
    if (leftChain.indexOf(x) > -1 || rightChain.indexOf(y) > -1) {
      return false
    }

    // Quick checking of one object being a subset of another.
    // todo: cache the structure of arguments[0] for performance
    for (p in y) {
      if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
        return false
      } else if (typeof y[p] !== typeof x[p]) {
        return false
      }
    }

    for (p in x) {
      if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
        return false
      } else if (typeof y[p] !== typeof x[p]) {
        return false
      }

      switch (typeof (x[p])) {
        case 'object':
        case 'function':

          leftChain.push(x)
          rightChain.push(y)

          if (!compare2Objects(x[p], y[p])) {
            return false
          }

          leftChain.pop()
          rightChain.pop()
          break

        default:
          if (x[p] !== y[p]) {
            return false
          }
          break
      }
    }

    return true
  }

  if (arguments.length < 1) {
    return true // Die silently? Don't know how to handle such case, please help...
    // throw "Need two or more arguments to compare";
  }

  for (i = 1, l = arguments.length; i < l; i++) {
    leftChain = [] // Todo: this can be cached
    rightChain = []

    if (!compare2Objects(arguments[0], arguments[i])) {
      return false
    }
  }

  return true
}

// 日志描述新老数据比对
export function compareData(oldData, newData, id) {
  const comparedKeys = Object.keys(newData).filter(item => {
    if (Array.isArray(newData[item])) {
      return JSON.stringify(oldData[item] || []) !== JSON.stringify(newData[item])
    } else {
      return oldData[item] !== newData[item]
    }
  })
  const oldObj = {}
  const newObj = {}
  comparedKeys.forEach(item => {
    oldObj[item] = oldData[item]
    newObj[item] = newData[item]
  })
  return {
    beforeCode: { ...oldObj, [id]: newData[id] },
    afterCode: { ...newObj, [id]: newData[id] }
  }
}

export async function resetKeepAlive(to) {
  if (to.matched && to.matched.length > 2) {
    for (let i = 0; i < to.matched.length; i++) {
      const component = to.matched[i]
      if (component.components.default.name === 'LevelLayout') {
        to.matched.splice(i, 1)
        await resetKeepAlive(to)
      }
      if (typeof component.components.default === 'function') {
        await component.components.default()
        await resetKeepAlive(to)
      }
    }
  }
}
export async function resetRepeat(noRepeat) {
  for (const i in noRepeat) {
    console.log(i)
    const req = noRepeat[i]
    req('cancelReq')
    delete noRepeat[i]
  }
}
/**
 * @Description:一键全屏
 * @author Roman
 * @date 2021-06-24 16:35:59
 * @edit 2021-06-24 16:35:59
*/
export function fullScreen(el) {
  if (document.fullscreenElement) {
    exitFullscreen()
  } else {
    enterfullScreen(el)
  }
}
/**
 * @Description: 指定元素全屏
 * @author Roman
 * @date 2021-06-23 20:29:27
 * @edit 2021-06-23 20:29:27
*/
export function enterfullScreen(el) {
  const element = el || document.documentElement
  if (element.requestFullScreen) {
    element.requestFullScreen()
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen()
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen()
  } else if (element.webkitRequestFullScreen) {
    element.webkitRequestFullScreen()
  }
}
/**
 * @Description: 退出全屏
 * @author Roman
 * @date 2021-06-23 20:29:27
 * @edit 2021-06-23 20:29:27
 */
export function exitFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen()
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen()
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen()
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen()
  }
}
// 单位换算公共方法
/** *
 * quantity 数量
 * unit 单位
 * suggestWidth  成品幅宽
 * suggestWidthUnit  成品幅宽单位
 * weightBefore 克重
 */
export function auxiliaryQuantityExpressionData(parm = {}) {
  const Tim = {
    quantity: parm.quantity || 0,
    unit: parm.unit ? parm.unit.label : '',
    suggestWidth: parm.suggestWidth || 0,
    suggestWidthUnit: parm.suggestWidthUnit || '"',
    weightBefore: parm.weightBefore || 0
  }
  let suggestFabric = Tim.suggestWidth
  let auxiliaryQuantity = 0
  if (Tim.suggestWidth && Tim.suggestWidthUnit) {
    suggestFabric = Tim.suggestWidthUnit && Tim.suggestWidthUnit === '"' ? Tim.suggestWidth : (Tim.suggestWidth * 2.54)
  }
  // 码
  const base_weight = Tim.quantity * 1 * suggestFabric * Tim.weightBefore * 0.00081925 / 16 / 2.2046
  // 千克
  const base_kg = Tim.quantity * 1
  // 磅
  const base_pound = Tim.quantity * 1 * 2.2046
  // //米
  const base_m = base_weight / 0.9144

  if (Tim.unit === '磅') {
    auxiliaryQuantity = base_pound
  } else if (Tim.unit === '码') {
    auxiliaryQuantity = base_weight
  } else if (Tim.unit === '米') {
    auxiliaryQuantity = base_m
  } else { // 千克
    auxiliaryQuantity = base_kg
  }
  return getFloat(auxiliaryQuantity, 2)
}
