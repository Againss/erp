// 选项配置-纱线品牌页面API
import request from '@/utils/request'

// 分页查询供纱线品牌列表
export function yarnBrandPage(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/priceCenter/yarnBrand/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 新增
export function yarnBrandAdd(data) {
  return request({
    url: '/priceCenter/yarnBrand/add',
    method: 'post',
    data
  })
}

// 编辑--详情
export function yarnBrandDetail(data) {
  return request({
    url: '/priceCenter/yarnBrand/info',
    method: 'post',
    data
  })
}

// 修改
export function yarnBrandModify(data) {
  return request({
    url: '/priceCenter/yarnBrand/modify',
    method: 'post',
    data
  })
}

// 删除
export function yarnBrandDelete(data) {
  return request({
    url: '/priceCenter/yarnBrand/delete',
    method: 'post',
    data
  })
}

// 启用禁用
export function yarnBrandEnabled(data) {
  return request({
    url: '/priceCenter/yarnBrand/status',
    method: 'post',
    data
  })
}
