// 选项配置-染纱/损耗颜色页面API
import request from '@/utils/request'

// 分页查询染纱/损耗颜色列表
export function dyeFinishLossColorShadePage(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/priceCenter/dyeFinishLossColorShade/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 新增
export function dyeFinishLossColorShadeAdd(data) {
  return request({
    url: '/priceCenter/dyeFinishLossColorShade/add',
    method: 'post',
    data
  })
}

// 编辑--详情
export function dyeFinishLossColorShadeDetail(data) {
  return request({
    url: '/priceCenter/dyeFinishLossColorShade/info',
    method: 'post',
    data
  })
}

// 修改
export function dyeFinishLossColorShadeModify(data) {
  return request({
    url: '/priceCenter/dyeFinishLossColorShade/modify',
    method: 'post',
    data
  })
}

// 删除
export function dyeFinishLossColorShadeDelete(data) {
  return request({
    url: '/priceCenter/dyeFinishLossColorShade/delete',
    method: 'post',
    data
  })
}

// 启用禁用
export function dyeFinishLossColorShadeEnabled(data) {
  return request({
    url: '/priceCenter/dyeFinishLossColorShade/status',
    method: 'post',
    data
  })
}
