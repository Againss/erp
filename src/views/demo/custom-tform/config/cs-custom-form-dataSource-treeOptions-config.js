/**
 * @Description: 配置项
 * @author Roman
 * @date 2020/7/3
 */
const data = [
  {
    params: 'isPopTree',
    info: 'tree组件是否以popover形式展示',
    type: 'boolean',
    optional: '',
    default: '—'
  },
  {
    params: 'treeSelectTitle',
    info: '树标题',
    type: 'string',
    optional: '—',
    default: '—'
  },
  {
    params: 'treeSelectedTitle',
    info: '已选择标题',
    type: 'string',
    optional: '—',
    default: '—'
  },
  {
    params: 'span',
    info: '树与已选择的栅格布局',
    type: 'array',
    optional: '—',
    default: '[12,12]'
  },
  {
    params: 'searchValue',
    info: '树搜索框内容,须先加载树节点数据后生效',
    type: 'string',
    optional: '—',
    default: '—'
  },
  {
    params: 'domScript',
    info: '对树节点进行dom操作',
    type: 'function',
    optional: '—',
    default: '—'
  },
  {
    params: 'searchNeedChild',
    info: '搜索是否需要显示子节点',
    type: 'boolean',
    optional: '—',
    default: '—'
  },
  {
    params: 'checkNeedChild',
    info: '勾选父节点是否联通子节点一起勾选',
    type: 'boolean',
    optional: '—',
    default: '—'
  },
  {
    params: 'maxLength',
    info: '最多选择多少子节点',
    type: 'number',
    optional: '—',
    default: '—'
  },
  {
    params: 'bindParentTags',
    info: '已选择标签label是否需要携带父-祖级label,默认显示label,当为true时,label显示为 祖-父-子 label',
    type: 'boolean',
    optional: '—',
    default: 'false'
  },
  {
    params: 'checkStrictly',
    info: '在显示复选框的情况下，是否严格的遵循父子不互相关联的做法，默认为 true',
    type: 'boolean',
    optional: '—',
    default: 'true'
  },
  {
    params: 'depend',
    info: '多选框状态下，选择树节点是否需要依赖父级关系,默认为true,选择子节点会自动带上父节点，为false时，只会选中当前节点',
    type: 'boolean',
    optional: '—',
    default: 'true'
  },
  {
    params: 'data',
    info: '树显示数据，特殊属性请参考cs-custom-form data-source treeOptions data',
    type: 'array',
    optional: '—',
    default: '—'
  }
]
export default data
