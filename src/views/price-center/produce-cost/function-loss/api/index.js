// 印花证书页面API
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
// 分页查询印花证书列表
export function functionLossInfoPage(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/priceCenter/functionLossInfo/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 新增
export function functionLossInfoAdd(data) {
  return request({
    url: '/priceCenter/functionLossInfo/add',
    method: 'post',
    data
  })
}

// 编辑--详情
export function functionLossInfoDetail(data) {
  return request({
    url: '/priceCenter/functionLossInfo/info',
    method: 'post',
    data
  })
}

// 修改
export function functionLossInfoModify(data) {
  return request({
    url: '/priceCenter/functionLossInfo/modify',
    method: 'post',
    data
  })
}

// 删除
export function functionLossInfoDelete(data) {
  return request({
    url: '/priceCenter/functionLossInfo/delete',
    method: 'post',
    data
  })
}

// 启用禁用
export function functionLossInfoEnabled(data) {
  return request({
    url: '/priceCenter/functionLossInfo/status',
    method: 'post',
    data
  })
}
// 全量查询下拉选项
export function getSearchSelect(data = {}) {
  return request({
    url: '/priceCenter/functionLossInfo/optionsFilled',
    method: 'post',
    data
  })
}
// 配置选项-测试标准列表
export async function testStandardList(data = {}, parmas) {
  const res = (await request({
    url: '/priceCenter/testStandard/list',
    method: 'post',
    data
  })).data || []
  parmas.data = res.map(e => ({
    value: String(e.id),
    label: e.testStandardName,
    disabled: e.status === 0
  }))
  return filterOptions({ ...parmas, props })
}
