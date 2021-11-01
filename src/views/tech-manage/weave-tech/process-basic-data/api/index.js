import request from '@/utils/request'

// 分页查询列表
export function list(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/userCenter/sysAppSystem/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 添加
export function add(data) {
  return request({
    url: '/userCenter/sysAppSystem/add',
    method: 'post',
    data
  })
}

// 修改
export function edit(data) {
  return request({
    url: '/userCenter/sysAppSystem/modify',
    method: 'post',
    data
  })
}

// 删除
export function del(data) {
  return request({
    url: '/userCenter/sysAppSystem/delete',
    method: 'post',
    data
  })
}

// 查询详情
export function detail(data) {
  return request({
    url: '/userCenter/sysAppSystem/info',
    method: 'post',
    data
  })
}

