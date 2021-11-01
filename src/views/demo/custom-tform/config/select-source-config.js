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
    info: '弹窗确认',
    type: 'function',
    optional: '—',
    default: '—'
  },
  {
    id: 3,
    params: 'okText',
    info: '弹窗确认',
    type: 'string',
    optional: '—',
    default: '确 定'
  },
  {
    id: 4,
    params: 'okHidden',
    info: '隐藏确认',
    type: 'boolean',
    optional: '—',
    default: '—'
  },
  {
    id: 5,
    params: 'cancel',
    info: '弹窗取消',
    type: 'function',
    optional: '—',
    default: '—'
  }
]
export default data
