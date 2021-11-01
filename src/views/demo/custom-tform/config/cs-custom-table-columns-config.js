/**
 * @Description: 配置项
 * @author Roman
 * @date 2020/7/3
*/
const data = [
  {
    params: 'editOptions',
    info: 'editOptions详细属性请参考cs-custom-form data-source,只有editType为inline时，该属性才生效',
    type: 'string',
    optional: 'inline、pop',
    default: 'pop'
  },
  {
    params: 'components',
    info: '自定义组件',
    type: 'function',
    optional: '—',
    default: '—'
  },
  {
    params: 'componentsOptions',
    info: '自定义组件配置',
    type: 'object',
    optional: '—',
    default: '—'
  },
  {
    params: 'formater',
    info: '内容格式化回调函数,参数(scope),scope为当前行属性',
    type: 'function',
    optional: '—',
    default: '—'
  },
  {
    params: 'style',
    info: '当前项显示样式',
    type: 'object',
    optional: '—',
    default: '—'
  }
]
export default data
