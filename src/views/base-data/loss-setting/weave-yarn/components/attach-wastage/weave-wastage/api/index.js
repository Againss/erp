import request from '@/utils/request'

// 分页查询列表
export function list(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/baseData/lossSetting/baseWeaveWastage/list',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 添加
export function add(data) {
  return request({
    url: '/baseData/lossSetting/baseWeaveWastage/add',
    method: 'post',
    data
  })
}

// 修改
export function modify(data) {
  return request({
    url: '/baseData/lossSetting/baseWeaveWastage/modify',
    method: 'post',
    data
  })
}

// 删除
export function del(data) {
  return request({
    url: '/baseData/lossSetting/baseWeaveWastage/delete',
    method: 'post',
    data
  })
}

// 查询详情
export function detail(data) {
  return request({
    url: '/baseData/lossSetting/baseWeaveWastage/info',
    method: 'post',
    data
  })
}

// 启动禁用
export function isEnable(data) {
  return request({
    url: '/baseData/lossSetting/baseWeaveWastage/status',
    method: 'post',
    data
  })
}

