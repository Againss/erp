/**
 * @Description: 配置项
 * @author Amos
 * @date 2020/9/15
*/
const data = [
  {
    params: 'INSET',
    info: '新增类型',
    type: 'string',
    optional: '—',
    remark: `description内容描述: {beforeText: '在'用户中心-角色管理'新增一条记录', beforeCode: 成功参数{}}, 后面beforeCode改为传返回id对象`
  },
  {
    params: 'UPDATE',
    info: '修改类型',
    type: 'string',
    optional: '—',
    remark: `description内容描述: {beforeText: '在...将', beforeCode: 修改前参数{}, afterText:'修改为', afterCode: 修改后参数{}}`
  },
  {
    params: 'SET',
    info: '设置类型',
    type: 'string',
    optional: `—`,
    remark: `description内容描述: {beforeText: '在...将', beforeCode: 修改前参数{}, afterText:'设置为', afterCode: 修改后参数{}}`
  },
  {
    params: 'DEL',
    info: '删除类型',
    type: 'string',
    optional: '—',
    remark: `description内容描述: {beforeText: '在...删除一条记录', beforeCode: 删除的id对象{id: id}`
  },
  {
    params: 'LOGIN',
    info: '登录类型',
    type: 'string',
    optional: '—',
    remark: `description内容描述: {beforeText: '登录成功', beforeCode: {username: xxx}`
  },
  {
    params: 'LOGOUT',
    info: '登出类型',
    type: 'string',
    optional: '—',
    remark: `description内容描述: {beforeText: '登出成功', beforeCode: {username: xxx}`
  },
  {
    params: 'IMPORT',
    info: '导入类型',
    type: 'string',
    optional: '—',
    remark: `description内容描述: {beforeText: '在...(批量)导入成功'}`
  }
]
export default data

