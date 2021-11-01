/**
 * @Description: 配置项
 * @author Roman
 * @date 2020/7/3
 */
const data = [
  {
    params: 'slot',
    info: '动态组件匹配类型，支持多种类型',
    type: 'string',
    optional: 'tip、trigger、""',
    default: '—'
  },
  {
    params: 'component',
    info: 'upload 对应tip、trigger、"" 3种组件，详细参考elementUi-upload 手动上传trigger、tip',
    type: 'function',
    optional: '—',
    default: '—'
  }
]
export default data
