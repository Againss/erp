/**
 * @Description: 用户api接口方法
 * @author Roman
 * @date 2020/6/18
*/
import request from '@/utils/request'
// 操作日志接口
export function log(data) {
  return request({
    url: '/ngx-kafka',
    method: 'post',
    data
  })
}

export function sendLocalInfo(info) {
  const url = `/errormsg/cgi-bin/webhook/send?key=816d936e-2286-4738-9139-839ad4b785a8`
  const data = {
    'msgtype': 'text',
    'text': {
      'content': info,
      'mentioned_list': ['@all']
    }
  }
  return request({
    method: 'post',
    url,
    data
  })
}
