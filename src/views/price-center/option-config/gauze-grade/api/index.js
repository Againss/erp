// 选项配置-布类等级页面API
import request from '@/utils/request'

// 分页查询布类等级列表
export function fabricGradePage(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/priceCenter/fabricGrade/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 新增
export function fabricGradeAdd(data) {
  return request({
    url: '/priceCenter/fabricGrade/add',
    method: 'post',
    data
  })
}

// 编辑--详情
export function fabricGradeDetail(data) {
  return request({
    url: '/priceCenter/fabricGrade/info',
    method: 'post',
    data
  })
}

// 修改
export function fabricGradeModify(data) {
  return request({
    url: '/priceCenter/fabricGrade/modify',
    method: 'post',
    data
  })
}

// 删除
export function fabricGradeDelete(data) {
  return request({
    url: '/priceCenter/fabricGrade/delete',
    method: 'post',
    data
  })
}

// 启用禁用
export function fabricGradeEnabled(data) {
  return request({
    url: '/priceCenter/fabricGrade/status',
    method: 'post',
    data
  })
}
