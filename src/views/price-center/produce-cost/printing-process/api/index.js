// 选项配置-公证行页面API
import request from '@/utils/request'

// 分页查询公证行列表
export function printingProcessInfoPage(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/priceCenter/printingTechInfo/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}
// 下拉选项
export function getSearchSelect(data = {}) {
  return request({
    url: '/priceCenter/printingTechInfo/optionsFilled',
    method: 'post',
    data
  })
}
// 新增
export function printingProcessInfoAdd(data) {
  return request({
    url: '/priceCenter/printingTechInfo/add',
    method: 'post',
    data
  })
}

// 编辑--详情
export function printingProcessInfoDetail(data) {
  return request({
    url: '/priceCenter/printingTechInfo/info',
    method: 'post',
    data
  })
}

// 修改
export function printingProcessInfoModify(data) {
  return request({
    url: '/priceCenter/printingTechInfo/modify',
    method: 'post',
    data
  })
}

// 删除
export function printingProcessInfoDelete(data) {
  return request({
    url: '/priceCenter/printingTechInfo/delete',
    method: 'post',
    data
  })
}

// 启用禁用
export function printingProcessInfoEnabled(data) {
  return request({
    url: '/priceCenter/printingTechInfo/status',
    method: 'post',
    data
  })
}

