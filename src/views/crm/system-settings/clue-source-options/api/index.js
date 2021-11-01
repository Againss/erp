import request from '@/utils/request'

// 线索来源分页查询
export function cluesFromPage(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/crm/cluesFrom/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 线索来源详情
export function cluesFromInfo(data) {
  return request({
    url: '/crm/cluesFrom/info',
    method: 'post',
    data
  })
}

// 线索来源修改
export function cluesFromModify(data) {
  return request({
    url: '/crm/cluesFrom/modify',
    method: 'post',
    data
  })
}

// 线索来源全量列表
export function cluesFromList(data) {
  return request({
    url: '/crm/cluesFrom/list',
    method: 'post',
    data
  })
}

// 线索来源新增
export function cluesFromAdd(data) {
  return request({
    url: '/crm/cluesFrom/add',
    method: 'post',
    data
  })
}

// 线索来源删除
export function cluesFromDelete(data) {
  return request({
    url: '/crm/cluesFrom/delete',
    method: 'post',
    data
  })
}

