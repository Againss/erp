// 选项配置-公证行页面API
import request from '@/utils/request'

// 分页查询公证行列表
export function notaryIndustryPage(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/priceCenter/notaryIndustry/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 新增
export function notaryIndustryAdd(data) {
  return request({
    url: '/priceCenter/notaryIndustry/add',
    method: 'post',
    data
  })
}

// 编辑--详情
export function notaryIndustryDetail(data) {
  return request({
    url: '/priceCenter/notaryIndustry/info',
    method: 'post',
    data
  })
}

// 修改
export function notaryIndustryModify(data) {
  return request({
    url: '/priceCenter/notaryIndustry/modify',
    method: 'post',
    data
  })
}

// 删除
export function notaryIndustryDelete(data) {
  return request({
    url: '/priceCenter/notaryIndustry/delete',
    method: 'post',
    data
  })
}

// 启用禁用
export function notaryIndustryEnabled(data) {
  return request({
    url: '/priceCenter/notaryIndustry/status',
    method: 'post',
    data
  })
}
