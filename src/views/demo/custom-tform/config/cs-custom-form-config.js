/**
 * @Description: 配置项
 * @author Roman
 * @date 2020/7/3
 */
const data = [
  {
    params: 'data-source',
    info: '表单配置属性',
    type: 'array',
    optional: '—',
    default: '[]'
  },
  {
    params: 'options',
    info: 'form属性,详细参考elementUi-form组件属性',
    type: 'object',
    optional: '—',
    default: '{}'
  },
  {
    params: 'form-datas',
    info: '表单初始化属性',
    type: 'object',
    optional: '—',
    default: '—'
  }
]
export default data
