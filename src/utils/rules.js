/**
 * @Description: rules验证规则
 * @author Roman
 * @date 2020/5/27
*/
export const regExp = {
  // 正负整数
  int: /^-?\d+$/,
  // 正负整数、小数
  float: /^(-?\d+)(\.\d+)?$/,
  // Email
  email: /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/,
  // 公司Email后缀
  email2: /(fabriciechina\.com|sfabric\.com)$/,
  // URL 地址
  url: /^[a-zA-z]+:\/\/(\w+(-\w+)*)(\.(\w+(-\w+)*))*(\?\S*)?$/,
  // 域名
  domain: /[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?/,
  // IP
  ip: /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,
  // 文件名
  file: /^((\w+)(\.{1})(\w+))$/,
  // 身份证号码
  identity: /^[1-9]{1}[0-9]{14}$|^[1-9]{1}[0-9]{16}([0-9]|[xX])$/,
  // 邮政编码6位
  postal: /[1-9]\d{5}(?!\d)/,
  // 中文
  zh: /^[\u4e00-\u9fa5]+$/,
  // 只能输入英文
  en: /^[a-zA-Z]*$/,
  // 只能输入数字
  number: /^[0-9]*$/,
  // 英文、数字
  en_num: /^[a-zA-Z0-9]*$/,
  // 用户名，只能输入6-20个字母、数字
  username: /^(\w){1,20}$/,
  // 密码强度4，8-20同时包含小写、数字
  department: /^.{1,50}$/,
  // 公司部门名称，最长50个字
  role: /^.{1,20}$/,
  // 角色名称，最长20个字
  password: /^(\w){6,20}$/,
  // 密码强度4，8-20同时包含小写、数字、特殊字符_
  password4: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[_])[A-Za-z\d_]{8,20}/,
  // 密码强度3，8-20位同时包含大写、小写、数字、特殊字符!@#$%^&*?
  password3: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*?])[A-Za-z\d!@#$%^&*?]{8,20}/,
  // 密码强度2，8-16位同时包含大写、小写、数字
  password2: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,20}$/,
  // 密码强度1，必须包含字母和数字，6-20位
  password1: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,20}$/,
  // 手机号码11位
  phone: /^1[3-578]\d{9}$/,
  // 判断普通电话、传真号码：可以“+”开头，除数字外，可含有“-”
  telephone: /^[+]{0,1}(\d){1,3}[ ]?([-]?((\d)|[ ]){1,12})+$/,
  // 只能输入中英文、数字、空格、‘-’
  zh_en_num_blank_hyphen: /^[\u4e00-\u9fa5a-zA-Z0-9\s-]+$/,
  // 首位不能是空格
  firstNotBlank: /^[^ ]+[\s\S]*/,
  // 银行卡
  bankCard: /^([1-9]{1})(\d{15}|\d{18})$/
}

export const getRules = ({ type = 'require', trigger = ['change'], message, pattern }) => {
  const rules = {
    require: {
      required: true,
      message: message || '此项不能为空',
      trigger
    },
    int: {
      pattern: pattern || regExp.int,
      message: message || '只能输入正负整数',
      trigger
    },
    float: {
      pattern: pattern || regExp.float,
      message: message || '只能输入正负整数或小数',
      trigger
    },
    email: {
      pattern: pattern || regExp.email,
      message: message || '请输入正确的 email',
      trigger
    },
    email2: {
      pattern: pattern || regExp.email2,
      message: message || '请输入正确的公司 email',
      trigger
    },
    url: {
      type: pattern || regExp.url,
      message: message || '请输入正确的 url',
      trigger
    },
    domain: {
      type: pattern || regExp.domain,
      message: message || '请输入正确的域名',
      trigger
    },
    ip: {
      type: pattern || regExp.ip,
      message: message || '请输入正确的 IP 地址',
      trigger
    },
    file: {
      type: pattern || regExp.file,
      message: '请输入正确的文件名',
      trigger
    },
    identity: {
      pattern: pattern || regExp.identity,
      message: message || '请输入正确的身份证号码',
      trigger
    },
    postal: {
      pattern: pattern || regExp.postal,
      message: message || '请输入正确的邮政编码',
      trigger
    },
    zh: {
      pattern: pattern || regExp.zh,
      message: message || '只能输入中文',
      trigger
    },
    en: {
      pattern: pattern || regExp.en,
      message: message || '只能输入英文',
      trigger
    },
    number: {
      pattern: pattern || regExp.number,
      message: message || '只能输入数字',
      trigger
    },
    en_num: {
      pattern: pattern || regExp.en_num,
      message: message || '只能输入英文或数字',
      trigger
    },
    username: {
      pattern: pattern || regExp.username,
      message: message || '最大长度20',
      trigger
    },
    department: {
      pattern: pattern || regExp.department,
      message: message || '最大长度50个字',
      trigger
    },
    role: {
      pattern: pattern || regExp.role,
      message: message || '最大长度20个字',
      trigger
    },
    password: {
      pattern: pattern || regExp.password,
      message: message || '请输入6~20位字母、数字、下划线',
      trigger
    },
    password4: {
      pattern: pattern || regExp.password,
      message: message || '请输入6~20位字母、数字、下划线(同时包含)',
      trigger
    },
    password1: {
      pattern: pattern || regExp.password1,
      message: message || '请输入6~16位字符，必须同时包含字母和数字',
      trigger
    },
    password2: {
      pattern: pattern || regExp.password2,
      message: message || '请输入8~16位字符，必须同时包含大小写字母、数字',
      trigger
    },
    password3: {
      pattern: pattern || regExp.password3,
      message: message || '请输入8~16位字符，必须同时包含大小字母、数字、特殊字符',
      trigger
    },
    phone: {
      pattern: pattern || regExp.phone,
      message: message || '请输入正确的11位手机号码',
      trigger
    },
    telephone: {
      pattern: pattern || regExp.telephone,
      message: message || '请输入正确的电话号码',
      trigger
    },
    zh_en_num_blank_hyphen: {
      pattern: pattern || regExp.zh_en_num_blank_hyphen,
      message: message || '只能输入中英文、数字、空格、-，不支持其他特殊字符',
      trigger
    },
    firstNotBlank: {
      pattern: pattern || regExp.firstNotBlank,
      message: message || '首位不能输入空格',
      trigger
    },
    custom: {
      pattern: pattern,
      message: message || 'error',
      trigger
    },
    bankCard: {
      pattern: pattern || regExp.bankCard,
      message: message || '请输入正确的银行账号！',
      trigger
    }
  }
  return rules[type]
}
