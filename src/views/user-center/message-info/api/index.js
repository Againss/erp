import request from '@/utils/request'

// 查询消息详情
export function userInfo(data) {
  return request({
    url: '/msg/user/info',
    method: 'post',
    data
  })
}
