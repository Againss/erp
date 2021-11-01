// 计量单位的接口
import request from '@/utils/request'

// 计量单位列表
export function measureList(data) {
  const defaultParams = { page: 1, pageSize: 20 }
  return request({
    url: '/basis/api/units/index',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 新增
export function measureAdd(data) {
  return request({
    url: '/basis/api/units/store',
    method: 'post',
    data
  })
}

// 编辑--详情
export function measureDetail(data) {
  return request({
    url: '/basis/api/units/show',
    method: 'post',
    data
  })
}

// 删除
export function measureDelete(data) {
  return request({
    url: '/basis/api/units/destroy',
    method: 'post',
    data
  })
}

// 修改(更新)
export function measureUpdate(data) {
  return request({
    url: '/basis/api/units/update',
    method: 'post',
    data
  })
}

// 审核
export function measureApprove(data) {
  return request({
    url: '/basis/api/units/approve',
    method: 'post',
    data
  })
}

// 启用禁用
export function measureEnable(data) {
  return request({
    url: '/basis/api/units/enabled',
    method: 'post',
    data
  })
}

// 计量单位通用下拉
export function measureSelect(data) {
  return request({
    url: '/basis/api/dictionary/option',
    method: 'post',
    data
  })
}
