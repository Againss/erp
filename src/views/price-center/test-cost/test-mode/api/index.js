// 测试成本页面API
import request from '@/utils/request'
import { filterOptions } from '@/utils/index'
// 获取基础数据的下拉选数据
const props = {
  id: 'value',
  name: 'label',
  enabled: 'disabled',
  enabledValue: false,
  disabledValue: true,
  disabledName: v => v + '(禁用)'
}
// 分页查询测试成本列表
export function testCostPage(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/priceCenter/testCost/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}
// 下拉选项
export function getSearchSelect(data = {}) {
  return request({
    url: '/priceCenter/testCost/optionsFilled',
    method: 'post',
    data
  })
}
// 新增
export function testCostAdd(data) {
  return request({
    url: '/priceCenter/testCost/add',
    method: 'post',
    data
  })
}

// 编辑--详情
export function testCostDetail(data) {
  return request({
    url: '/priceCenter/testCost/info',
    method: 'post',
    data
  })
}

// 修改
export function testCostModify(data) {
  return request({
    url: '/priceCenter/testCost/modify',
    method: 'post',
    data
  })
}

// 删除
export function testCostDelete(data) {
  return request({
    url: '/priceCenter/testCost/delete',
    method: 'post',
    data
  })
}

// 启用禁用
export function testCostEnabled(data) {
  return request({
    url: '/priceCenter/testCost/status',
    method: 'post',
    data
  })
}

// 公行证下拉选项
export async function notaryIndustryList(data = {}, parmas) {
  const res = (await request({
    url: '/priceCenter/notaryIndustry/list',
    method: 'post',
    data
  })).data || []
  parmas.data = res.map(e => ({
    value: String(e.id),
    label: e.notaryIndustryName,
    disabled: e.status === 0
  }))
  return filterOptions({ ...parmas, props })
}
// crm品牌商名称下拉选项
export function brandList(data) {
  return request({
    url: '/crm/brand/list',
    method: 'post',
    data
  })
}

