/**
 * @Description: 配置项
 * @author Roman
 * @date 2020/7/3
*/
const data = [
  {
    params: 'origin',
    info: '前端路由列表,请在需要权限控制的路由对象下meta对象添加permitTag属性，值为对应的权限标识，例如：permitTag: "userCenter"',
    type: 'array',
    optional: '—',
    default: '—'
  },
  {
    params: 'asyncList',
    info: '权限标识列表',
    type: 'array',
    optional: '—',
    default: '—'
  }
]
export default data
