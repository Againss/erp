/**
 * @Description: 配置项
 * @author Roman
 * @date 2020/7/3
*/
const data = [
  {
    params: 'columns',
    info: '列属性',
    type: 'array',
    optional: '—',
    default: '[]'
  },
  {
    params: 'data-source',
    info: '表格数据',
    type: 'array',
    optional: '—',
    default: '[]'
  },
  {
    params: 'selection',
    info: '复选框属性',
    type: 'object',
    optional: '—',
    default: '—'
  },
  {
    params: 'loading',
    info: '是否显示加载等待图标',
    type: 'boolean',
    optional: 'true、false',
    default: 'false'
  },
  {
    params: 'editType',
    info: '编辑当前行的编辑类型',
    type: 'string',
    optional: 'inline、pop',
    default: 'pop'
  },
  {
    params: 'pagination',
    info: '分页属性,只有当前页大于每页总条数才会显示分页组件，详细参考elementUi-pagination组件属性',
    type: 'object',
    optional: '—',
    default: 'null'
  },
  {
    params: 'lazy',
    info: '是否懒加载子节点数据,当lazy为true时，只需配置好tree-props,row-key这两个属性即可，无需配置load方法，已内置写好',
    type: 'object',
    optional: '—',
    default: 'null'
  },
  {
    params: '其他table属性',
    info: '其他table属性,详细参考elementUi-talbe组件属性',
    type: '—',
    optional: '—',
    default: '—'
  }
]
export default data
