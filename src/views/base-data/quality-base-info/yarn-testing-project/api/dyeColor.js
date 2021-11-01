import request from '@/utils/request'

// 分页查询列表
export function list(data = {}) {
  const defaultParams = { asc: '', desc: '' }
  return request({
    url: '/baseData/qa/dyeColorTestConfig/list',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 分页查询
export function page(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20, asc: '', desc: '' }
  return request({
    url: '/baseData/qa/dyeColorTestConfig/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 添加
export function add(data) {
  return request({
    url: '/baseData/qa/dyeColorTestConfig/add',
    method: 'post',
    data
  })
}

// 修改
export function edit(data) {
  return request({
    url: '/baseData/qa/dyeColorTestConfig/modify',
    method: 'post',
    data
  })
}

// 审核
export function audited(data) {
  return request({
    url: '/baseData/qa/dyeColorTestConfig/audited',
    method: 'post',
    data
  })
}

// 禁用启用
export function isEnable(data) {
  return request({
    url: '/baseData/qa/dyeColorTestConfig/enabled',
    method: 'post',
    data
  })
}

// 删除
export function del(data) {
  return request({
    url: '/baseData/qa/dyeColorTestConfig/delete',
    method: 'post',
    data
  })
}

// 查询详情
export function detail(data) {
  return request({
    url: '/baseData/qa/dyeColorTestConfig/info',
    method: 'post',
    data
  })
}

