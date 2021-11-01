/**
 * @Description: 配置项
 * @author Amos
 * @date 2020/9/14
*/
const data = [
  {
    params: 'api',
    info: '请求接口',
    type: 'string',
    optional: '—',
    remark: '接口api'
  },
  {
    params: 'topic',
    info: 'topic',
    type: 'string',
    optional: '—',
    remark: '前后端定义的一个topic, 存放在vuex里面'
  },
  {
    params: 'appId',
    info: '应用标识',
    type: 'string',
    optional: `'userCenter': 用户中心,'sfabric': 大布行ERP,'tech': 工艺中心,'mall': 智布商城,'oa': 智布办公小程序,'factory': 智布协同小程序,'SRM': 供应商采购管理`,
    remark: '指明在哪个系统操作的'
  },
  {
    params: 'description',
    info: '日志内容',
    type: 'string',
    optional: '—',
    remark: `JSON.stringify({beforeText:'',beforeCode:'',afterText:'',afterCode:''}), 主要是定义对象里面的四个属性,然后转成字符串`
  },
  {
    params: 'opratorType',
    info: '操作类型',
    type: 'string',
    optional: `'INSET': 新增,'UPDATE': 修改,'SET': 设置,'DEL': 删除,'LOGIN': 登录,'LOGOUT': 退出,'IMPORT': 导入, 'EXPORT': 导出`,
    remark: ''
  },
  {
    params: 'params',
    info: '请求参数',
    type: 'string',
    optional: '—',
    remark: 'JSON.stringify(data), 请求参数为对象,需要转成字符串'
  },
  {
    params: 'realName',
    info: '真实姓名',
    type: 'string',
    optional: '—',
    remark: '从userInfo里面获取,userInfo存放在vuex里面'
  },
  {
    params: 'createTime',
    info: '创建时间',
    type: 'string',
    optional: '—',
    default: 'new Date().getTime()',
    remark: ''
  },
  {
    params: 'type',
    info: '类型',
    type: 'string',
    optional: `'LOGIN': 登录日志,'OP': 操作日志,'SYS': 系统日志`,
    remark: ''
  },
  {
    params: 'userId',
    info: '用户ID',
    type: 'string',
    optional: '—',
    remark: '从userInfo里面获取,userInfo存放在vuex里面'
  },
  {
    params: 'userName',
    info: '用户名',
    type: 'string',
    optional: '—',
    remark: '从userInfo里面获取,userInfo存放在vuex里面'
  }
]
export default data

