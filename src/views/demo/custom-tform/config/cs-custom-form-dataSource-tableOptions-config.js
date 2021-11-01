/**
 * @Description: 配置项
 * @author Amos
 * @date 2020/9/28
 */
const data = [
  {
    params: 'rowKey',
    info: '匹配Id字段,当selectedType为"string"时,显示的key',
    type: 'string',
    optional: '—',
    default: '—'
  },
  {
    params: 'useDefaultOperate',
    info: '是否使用默认的操作栏(内容为多选框)',
    type: 'boolean',
    optional: 'true、false',
    default: '—'
  },
  {
    params: 'operates',
    info: '操作栏配置信息(只有useDefaultOperate为true时才生效),参考cs-custom-table表格操作栏的配置信息',
    type: 'object',
    optional: '—',
    default: '—'
  },
  {
    params: 'selectedType',
    info: '如果为string,右边显示的是rowKey匹配的字段, 如果为object, 右边显示的是对象(row,一行的数据,需要自行做处理)',
    type: 'string',
    optional: 'string、object',
    default: '—'
  },
  {
    params: 'isPopTable',
    info: 'table-search组件是否以popover形式展示',
    type: 'boolean',
    optional: 'true、false',
    default: '—'
  },
  {
    params: 'selectTitle',
    info: 'table-search组件待选择标题',
    type: 'string',
    optional: '—',
    default: '—'
  },
  {
    params: 'selectedTitle',
    info: 'table-search组件已选择标题',
    type: 'string',
    optional: '—',
    default: '—'
  },
  {
    params: 'span',
    info: '表格与已选择的栅格布局',
    type: 'array',
    optional: '—',
    default: '[12,12]'
  },
  {
    params: 'maxLength',
    info: '最多选择多少子节点',
    type: 'number',
    optional: '—',
    default: '—'
  },
  {
    params: 'needSearch',
    info: '是否需要搜索框',
    type: 'boolean',
    optional: 'true、false',
    default: '—'
  },
  {
    params: 'dataSource',
    info: '表格显示数据，参考cs-custom-table里的dataSource',
    type: 'array',
    optional: '—',
    default: '—'
  },
  {
    params: 'columns',
    info: '表格表头数据，参考cs-custom-table里的columns',
    type: 'array',
    optional: '—',
    default: '—'
  },
  {
    params: 'checkedTagsRenderContent',
    info: '格式化数据(对每一项数据二次处理)',
    type: 'function',
    optional: '—',
    default: '—'
  },
  {
    params: 'viewContent',
    info: '是否直接展示内容,true直接展示,false则根据input类型为textarea换行显示、其他类型则以逗号隔开',
    type: 'boolean',
    optional: '—',
    default: '—'
  },
  {
    params: 'props',
    info: '字段映射',
    type: 'string',
    optional: '—',
    default: '—'
  }
]
export default data
