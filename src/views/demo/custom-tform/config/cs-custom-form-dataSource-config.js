/**
 * @Description: 配置项
 * @author Roman
 * @date 2020/7/3
 */
const data = [
  {
    params: 'itemType',
    info: '动态组件匹配类型，支持多种类型，每个配置项的传参属性可以参考elementUi-Tree各个对应的组件属性即可，带-的属性请替换为驼峰格式',
    type: 'string',
    optional: 'select、input、date、radio-group、icon、radio-button-group、checkbox-button-group、checkbox-group、operate、radio、switch、time、upload、view、tree、tabs、table、table-search、table-form',
    default: '—'
  },
  {
    params: 'prop',
    info: '表单域 model 字段，在使用 validate、resetFields 方法的情况下，该属性是必填的',
    type: 'string',
    optional: '—',
    default: '—'
  },
  {
    params: 'change',
    info: '表单项的值发生改变时的回调函数，参数为(value, form, formDatas, setFormDatas),value当前项值，form表单实例，formDatas表单所有项值，setFormDatas设置表单项值',
    type: 'function',
    optional: '—',
    default: '—'
  },
  {
    params: 'style',
    info: '表单项样式配置',
    type: 'object',
    optional: '—',
    default: '—'
  },
  {
    params: 'itemStyle',
    info: '表单项外层Form-Item样式配置',
    type: 'object',
    optional: '—',
    default: '—'
  },
  {
    params: 'dataSource',
    info: 'itemType为select、tabs、table-form、checkbox-group、radio-group时，该属性才生效，select、tabs、checkbox-group、radio-group属为select option内容;table-form属为table option内容,并且当itemType为table-form时,弹出框popOptions里的formDatas里必填tableForm: tableFormDataSource',
    type: 'array',
    optional: '—',
    default: '—'
  },
  {
    params: 'columns',
    info: 'itemType为table-form时，该属性才生效，参考cs-custom-table表格columns配置',
    type: 'array',
    optional: '—',
    default: '—'
  },
  {
    params: 'content',
    info: '只有itemType为upload时，该属性才生效',
    type: 'array',
    optional: '—',
    default: '—'
  },
  {
    params: 'viewContent',
    info: '只有itemType为tree时，该属性才生效,该属性为自定义组件，参数为labels数组，展示树在弹窗中展示的已选择内容',
    type: 'array',
    optional: '—',
    default: '—'
  },
  {
    params: 'popoverOptions',
    info: '只有itemType为tree时，该属性才生效，详细参考elementUi-Popover组件属性',
    type: 'object',
    optional: '—',
    default: '—'
  },
  {
    params: 'treeOptions',
    info: '只有itemType为tree时，该属性才生效，特殊属性参考cs-custom-form data-source treeOptions，其他属性参考elementUi-Tree组件属性',
    type: 'object',
    optional: '—',
    default: '—'
  },
  {
    params: 'tableOptions',
    info: '只有itemType为table-search时，该属性才生效，特殊属性参考cs-custom-form data-source tableOptions，其他属性参考cs-custom-table组件属性',
    type: 'object',
    optional: '—',
    default: '—'
  },
  {
    params: 'searchOptions',
    info: '只有itemType为table-search时，该属性才生效,该属性为input框发生input事件时生效,参数为input框里的value',
    type: 'function',
    optional: '—',
    default: '—'
  },
  {
    params: 'submitHandle',
    info: '提交按钮回调函数，参数为表单数据，只有itemType为operate时，该属性才生效',
    type: 'function',
    optional: '—',
    default: '—'
  },
  {
    params: 'submitText',
    info: '提交按钮文本，只有itemType为operate时，该属性才生效',
    type: 'string',
    optional: '—',
    default: '提交'
  },
  {
    params: 'submitHidden',
    info: '隐藏提交按钮，只有itemType为operate时，该属性才生效',
    type: 'string',
    optional: '—',
    default: '提交'
  },
  {
    params: 'resetHandle',
    info: '重置按钮回调函数，参数为表单数据，只有itemType为operate时，该属性才生效',
    type: 'function',
    optional: '—',
    default: '—'
  },
  {
    params: 'resetText',
    info: '重置按钮文本，只有itemType为operate时，该属性才生效',
    type: 'string',
    optional: '—',
    default: '重置'
  },
  {
    params: 'resetHidden',
    info: '隐藏重置按钮，只有itemType为operate时，该属性才生效',
    type: 'string',
    optional: '—',
    default: '提交'
  },
  {
    params: 'label等其他Form-Item属性',
    info: 'label等其他Form-Item属性，详细参考Form-Item Attributes组件属性',
    type: '—',
    optional: '—',
    default: '—'
  }
]
export default data
