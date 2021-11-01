import { isObject } from '@/views/customer-info/customer-management/detail/plate-making/common'

export const SETTING_TYPE = {
  BATCH_TO_TEMPLATE: 1,
  TEMPLATE_TO_STANDARD: 2,
  STANDARD_TO_UNIT: 3,
  TEMPLATE_TO_TEST: 4
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

        item.dataSource = Array.isArray(option) ? option : (option ? [option] : [])
      }
    }
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
