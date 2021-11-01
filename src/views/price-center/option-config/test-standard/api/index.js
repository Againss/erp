// 选项配置-染纱/损耗颜色页面API
import request from '@/utils/request'

// 分页查询染纱/损耗颜色列表
export function testStandardPage(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/priceCenter/testStandard/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 新增
export function testStandardAdd(data) {
  return request({
    url: '/priceCenter/testStandard/add',
    method: 'post',
    data
  })
}

// 编辑--详情
export function testStandardDetail(data) {
  return request({
    url: '/priceCenter/testStandard/info',
    method: 'post',
    data
  })
}

// 修改
export function testStandardModify(data) {
  return request({
    url: '/priceCenter/testStandard/modify',
    method: 'post',
    data
  })
}

// 删除
export function testStandardDelete(data) {
  return request({
    url: '/priceCenter/testStandard/delete',
    method: 'post',
    data
  })
}

// 启用禁用
export function testStandardEnabled(data) {
  return request({
    url: '/priceCenter/testStandard/status',
    method: 'post',
    data
  })
}
