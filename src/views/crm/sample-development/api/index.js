import request from '@/utils/request'

// 样板开发分页查询
export function sampleDevelopPage(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/mock/101/sample/develop/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 样板开发列表
export function sampleDevelopList(data) {
  return request({
    url: '/mock/101/sample/develop/list',
    method: 'post',
    data
  })
}

// 样板开发详情
export function sampleDevelopInfo(data) {
  return request({
    url: '/mock/101/sample/develop/info',
    method: 'post',
    data
  })
}

// 样板开发新增
export function sampleDevelopAdd(data) {
  return request({
    url: '/mock/101/sample/develop/add',
    method: 'post',
    data
  })
}

// 样板开发删除
export function sampleDevelopDelete(data) {
  return request({
    url: '/mock/101/sample/develop/delete',
    method: 'post',
    data
  })
}

// 样板开发修改
export function sampleDevelopModify(data) {
  return request({
    url: '/mock/101/sample/develop/modify',
    method: 'post',
    data
  })
}

// 样板开发更改所有人
export function sampleDevelopModifyFollower(data) {
  return request({
    url: '/mock/101/sample/develop/modify/follower',
    method: 'post',
    data
  })
}

// 样板开发状态变更
export function sampleDevelopModifyStatus(data) {
  return request({
    url: '/mock/101/sample/develop/modify/status',
    method: 'post',
    data
  })
}

// 样板开发查看工艺分析单
// export function sampleDevelopReport(data) {
//   return request({
//     url: '/mock/101/sample/develop/report',
//     method: 'post',
//     data
//   })
// }
