// 选项配置-染纱/损耗颜色页面API
import request from '@/utils/request'

// 分页查询染纱/损耗颜色列表
export function componentRatePage(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/priceCenter/componentRate/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 新增
export function componentRateAdd(data) {
  return request({
    url: '/priceCenter/componentRate/add',
    method: 'post',
    data
  })
}

// 编辑--详情
export function componentRateDetail(data) {
  return request({
    url: '/priceCenter/componentRate/info',
    method: 'post',
    data
  })
}

// 修改
export function componentRateModify(data) {
  return request({
    url: '/priceCenter/componentRate/modify',
    method: 'post',
    data
  })
}

// 删除
export function componentRateDelete(data) {
  return request({
    url: '/priceCenter/componentRate/delete',
    method: 'post',
    data
  })
}

// 启用禁用
export function componentRateEnabled(data) {
  return request({
    url: '/priceCenter/componentRate/status',
    method: 'post',
    data
  })
}
