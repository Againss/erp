// 选项配置-公证行页面API
import request from '@/utils/request'

// 分页查询公证行列表
export function printingAdditionalInfoPage(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/priceCenter/printingAdditionalInfo/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 新增
export function printingAdditionalInfoAdd(data) {
  return request({
    url: '/priceCenter/printingAdditionalInfo/add',
    method: 'post',
    data
  })
}

// 编辑--详情
export function printingAdditionalInfoDetail(data) {
  return request({
    url: '/priceCenter/printingAdditionalInfo/info',
    method: 'post',
    data
  })
}

// 修改
export function printingAdditionalInfoModify(data) {
  return request({
    url: '/priceCenter/printingAdditionalInfo/modify',
    method: 'post',
    data
  })
}

// 删除
export function printingAdditionalInfoDelete(data) {
  return request({
    url: '/priceCenter/printingAdditionalInfo/delete',
    method: 'post',
    data
  })
}

// 启用禁用
export function printingAdditionalInfoEnabled(data) {
  return request({
    url: '/priceCenter/printingAdditionalInfo/status',
    method: 'post',
    data
  })
}

