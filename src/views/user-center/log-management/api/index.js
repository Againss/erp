import request from '@/utils/request'

// 日志分页查看
export function sysUserLogpage(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/userCenter/sysUserLog/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 获取
export function appIdList(data) {
  return request({
    url: '/userCenter/sysUserLog/appId/list',
    method: 'post',
    data
  })
}
