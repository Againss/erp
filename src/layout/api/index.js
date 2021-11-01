import request from '@/utils/request'

// 用户(员工)列表查询
export function userPasswordModify(data) {
  return request({
    url: '/userCenter/sysUser/password/modify',
    method: 'post',
    data
  })
}

// 调java灰度服务接口
export function getJavaGrayService() {
  let url = `/java/gray/dev.json`
  if (process.env.VUE_APP_ENV === 'sit') {
    url = `/java/gray/sit.json`
  }
  url += `?${new Date().getTime()}`
  return request({
    url,
    method: 'get'
  })
}
