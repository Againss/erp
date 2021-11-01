import request from '@/utils/request'

// 样板开发分页查询
export function modelDevelopPage(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/crm/model/develop/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 样板开发列表
export function modelDevelopList(data) {
  return request({
    url: '/crm/model/develop/list',
    method: 'post',
    data
  })
}

// 样板开发详情
export function modelDevelopInfo(data) {
  return request({
    url: '/crm/model/develop/info',
    method: 'post',
    data
  })
}

// 样板开发新增
export function modelDevelopAdd(data) {
  return request({
    url: '/crm/model/develop/add',
    method: 'post',
    data
  })
}

// 样板开发删除
export function modelDevelopDelete(data) {
  return request({
    url: '/crm/model/develop/delete',
    method: 'post',
    data
  })
}

// 样板开发修改
export function modelDevelopModify(data) {
  return request({
    url: '/crm/model/develop/modify',
    method: 'post',
    data
  })
}

// 样板开发更改所有人
export function modelDevelopModifyFollower(data) {
  return request({
    url: '/crm/model/develop/modify/follower',
    method: 'post',
    data
  })
}

// 样板开发状态变更
export function modelDevelopModifyStatus(data) {
  return request({
    url: '/crm/model/develop/modify/status',
    method: 'post',
    data
  })
}

// 样板开发查看工艺分析单
// export function modelDevelopReport(data) {
//   return request({
//     url: '/crm/model/develop/report',
//     method: 'post',
//     data
//   })
// }
