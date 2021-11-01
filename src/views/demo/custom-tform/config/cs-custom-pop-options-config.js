/**
 * @Description: 配置项
 * @author Roman
 * @date 2020/7/3
 */
const data = [
  {
    id: 1,
    params: 'itemType',
    info: '弹窗类型',
    type: 'string',
    optional: 'drawer、dialog',
    default: '—'
  },
  {
    id: 2,
    params: 'ok',
    info: '弹窗确认按钮回调事件,参数（ data,form）data为表单数据,form为表单实例',
    type: 'function',
    optional: '—',
    default: '—'
  },
  {
    id: 3,
    params: 'okText',
    info: '弹窗确认按钮文本',
    type: 'string',
    optional: '—',
    default: '确 定'
  },
  {
    id: 4,
    params: 'okHidden',
    info: '隐藏确认按钮',
    type: 'boolean',
    optional: '—',
    default: '—'
  },
  {
    id: 5,
    params: 'cancel',
    info: '弹窗取消按钮回调事件,参数（ data,form）data为表单数据,form为表单实例',
    type: 'function',
    optional: '—',
    default: '—'
  },
  {
    id: 6,
    params: 'cancelText',
    info: '弹窗取消按钮文本',
    type: 'string',
    optional: '—',
    default: '取 消'
  },
  {
    id: 7,
    params: 'cancelHidden',
    info: '隐藏取消按钮',
    type: 'boolean',
    optional: '—',
    default: '—'
  },
  {
    id: 8,
    params: 'saveAndadd',
    info: '弹窗保存并提交按钮回调事件,参数（ data,form）data为表单数据,form为表单实例',
    type: 'function',
    optional: '—',
    default: '—'
  },
  {
    id: 9,
    params: 'saveAndaddText',
    info: '弹窗弹窗保存并提交按钮文本',
    type: 'string',
    optional: '—',
    default: '提交继续添加'
  },
  {
    id: 10,
    params: 'formDatas',
    info: '表单初始化数据',
    type: 'object',
    optional: '—',
    default: '—'
  },
  {
    id: 11,
    params: 'formOptions',
    info: '表单配置 参考elementUI官网配置文件',
    type: 'object',
    optional: '—',
    default: '—'
  },
  {
    id: 12,
    params: 'content',
    info: '表单内容，详细参考cs-custom-form data-source',
    type: 'array',
    optional: '—',
    default: '—'
  },
  {
    id: 13,
    params: 'visible等其他Popover属性',
    info: 'visible等其他Popover属性,详细参考elementUi-Popover组件属性',
    type: 'string',
    optional: '—',
    default: '—'
  }
]
export default data
