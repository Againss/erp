import request from '@/utils/request'

// 分页查询
export function pageList(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 10 }
  return request({
    url: '/qa/qaFinishFabricPhysical/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}
// 每个分组对应的数量
export function pageCount(data = {}) {
  return request({
    url: '/qa/qaFinishFabricPhysical/countAllStatuses',
    method: 'post',
    data: { ...data }
  })
}

// 用户(员工)列表查询
export function userList(data = {}) {
  return request({
    url: '/userCenter/sysUser/list',
    method: 'post',
    data: { ...data }
  })
}

// 用户(员工)列表查询
export function outworkerList(data) {
  return request({
    url: '/userCenter/sysUser/list',
    method: 'post',
    data
  })
}
