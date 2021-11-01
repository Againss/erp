const SPAN_PROPS = ['batchRequire', 'templateType', 'standard']

export const VALUE_KEY = 'value'

// 和system-settings/template-params/commons.js下的保持一致
export const SETTING_TYPE = {
  BATCH_TO_TEMPLATE: 1,
  TEMPLATE_TO_STANDARD: 2,
  STANDARD_TO_UNIT: 3
}

export function isObject(target) {
  return Object.prototype.toString.call(target) === '[object Object]'
}

export function sameSpan(curRow, cmpRow, spanProps = SPAN_PROPS) {
  if (!curRow || !cmpRow) {
    return false
  }

  for (let i = 0; i < spanProps.length; i++) {
    const prop = spanProps[i]
    let curVal = curRow[prop]
    let cmpVal = cmpRow[prop]

    if (isObject(curVal) && isObject(cmpVal)) {
      curVal = curVal[VALUE_KEY]
      cmpVal = cmpVal[VALUE_KEY]
    }

    if (curVal !== cmpVal) {
      return false
    }
  }

  return true
}

export function selectObjFormatter(objName, labelName = 'label') {
  return scope => {
    const obj = scope.row[objName] || {}

    return obj[labelName] || '-'
  }
}

export function commonItemViewRender(labelName = 'label') {
  return (value) => {
    let val = value

    if (isObject(value)) {
      val = value[labelName]
    }

    val = (val === null || val === undefined || val === '') ? '-' : val

    // itemview 使用v-html进行渲染，这里可能存在xss攻击
    return `<span title="${val}">${val}</span>`
  }
}

export function updateSelectDataSource(formContent, formData, forceClear = false) {
  for (const itemName in formContent) {
    if (formContent.hasOwnProperty(itemName)) {
      const item = formContent[itemName]
      let itemType = item.itemType

      if (Object.prototype.toString.call(itemType) === '[object Function]') {
        itemType = itemType()
      }

      if (itemType === 'select' && item.valueType === 'object' && (forceClear || !item.dataSource.length)) {
        const option = formData[item.prop]
        item.dataSource = option ? [option] : []
      }
    }
  }
}

export function getUUID() {
  let d = new Date().getTime()

  if (window.performance && typeof window.performance.now === 'function') {
    d += performance.now() // use high-precision timer if available
  }

  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (d + Math.random() * 16) % 16 | 0
    d = Math.floor(d / 16)
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
  })
}
