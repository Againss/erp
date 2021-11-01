import request from '@/utils/request'

// 分页查询个人消息列表
export function msgUserPage(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 10 }
  return request({
    url: '/msg/user/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 查询个人未读消息数量
export function userUnreadCount(data) {
  return request({
    url: '/msg/user/unread/count',
    method: 'post',
    data
  })
}

// 修改个人消息已读状态
export function userRead(data) {
  return request({
    url: '/msg/user/read',
    method: 'post',
    data
  })
}

