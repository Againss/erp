/**
 * @Description: 配置项
 * @author Amos
 * @date 2020/9/14
*/
const data = [
  {
    params: 'beforeText',
    info: '描述前文字',
    type: 'string',
    optional: '—',
    remark: ``
  },
  {
    params: 'afterText',
    info: '描述后文字',
    type: 'string',
    optional: '—',
    remark: ''
  },
  {
    params: 'beforeCode',
    info: '传参前代码',
    type: 'object',
    optional: `—`,
    remark: `非必填, 当 beforeCode 和 afterCode 均存在需要比较差异性,并对比显示`
  },
  {
    params: 'afterCode',
    info: '传参后代码',
    type: 'object',
    optional: '—',
    remark: '非必填, 当 beforeCode 和 afterCode 均存在需要比较差异性,并对比显示'
  }
]
export default data

