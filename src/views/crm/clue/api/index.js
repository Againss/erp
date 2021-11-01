import request from '@/utils/request'

// 线索分页查询
export function cluesPage(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/crm//clues/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 线索详情
export function cluesInfo(data) {
  return request({
    url: '/crm/clues/info',
    method: 'post',
    data
  })
}

// 线索新增
export function cluesAdd(data) {
  return request({
    url: '/crm/clues/add',
    method: 'post',
    data
  })
}

// 线索删除
export function cluesDelete(data) {
  return request({
    url: '/crm/clues/delete',
    method: 'post',
    data
  })
}

// 线索修改
export function cluesModify(data) {
  return request({
    url: '/crm/clues/modify',
    method: 'post',
    data
  })
}

// 线索更改所有人
export function cluesModifyFollower(data) {
  return request({
    url: '/crm/clues/modify/follower',
    method: 'post',
    data
  })
}

// 线索状态修改
export function cluesModifyClueStaus(data) {
  return request({
    url: '/crm/clues/modify/clueStaus',
    method: 'post',
    data
  })
}

// 转化线索
export function cluesTransform(data) {
  return request({
    url: '/crm/clues/transform',
    method: 'post',
    data
  })
}
