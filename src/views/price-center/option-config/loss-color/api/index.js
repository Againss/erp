// 选项配置-染纱/损耗颜色页面API
import request from '@/utils/request'

// 分页查询染纱/损耗颜色列表
export function dyeYarnLossColorPage(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/priceCenter/dyeYarnLossColor/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 新增
export function dyeYarnLossColorAdd(data) {
  return request({
    url: '/priceCenter/dyeYarnLossColor/add',
    method: 'post',
    data
  })
}

// 编辑--详情
export function dyeYarnLossColorDetail(data) {
  return request({
    url: '/priceCenter/dyeYarnLossColor/info',
    method: 'post',
    data
  })
}

// 修改
export function dyeYarnLossColorModify(data) {
  return request({
    url: '/priceCenter/dyeYarnLossColor/modify',
    method: 'post',
    data
  })
}

// 删除
export function dyeYarnLossColorDelete(data) {
  return request({
    url: '/priceCenter/dyeYarnLossColor/delete',
    method: 'post',
    data
  })
}

// 启用禁用
export function dyeYarnLossColorEnabled(data) {
  return request({
    url: '/priceCenter/dyeYarnLossColor/status',
    method: 'post',
    data
  })
}
