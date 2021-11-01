
import request from '@/utils/request'
import { getEnvInfo } from '@/utils/index'
const apiName = /crm/.test(getEnvInfo().branch) ? 'crm' : 'priceCenter'

// 保存为草稿
export function quotationSheetDraft(data) {
  return request({
    url: `/${apiName}/quotationSheet/draft`,
    method: 'post',
    data
  })
}

// 删除
export function quotationSheetDelete(data) {
  return request({
    url: `/${apiName}/quotationSheet/delete`,
    method: 'post',
    data
  })
}

// 详情
export function quotationSheetInfo(data) {
  return request({
    url: `/${apiName}/quotationSheet/info`,
    method: 'post',
    data
  })
}

// 简要信息
export function quotationSheetBriefInfo(data) {
  return request({
    url: `/${apiName}/quotationSheet/briefInfo`,
    method: 'post',
    data
  })
}

// 简要信息全量列表
export function quotationSheetBriefList(data) {
  return request({
    url: `/${apiName}/quotationSheet/briefList`,
    method: 'post',
    data
  })
}

// 简要信息分页列表
export function quotationSheetBriefPage(data) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: `/${apiName}/quotationSheet/briefPage`,
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 提交报价
export function quotationSheetAdd(data) {
  return request({
    url: `/${apiName}/quotationSheet/add`,
    method: 'post',
    data
  })
}

// 发起审批
export function quotationSheetSubmit(data) {
  return request({
    url: `/${apiName}/quotationSheet/submit`,
    method: 'post',
    data
  })
}

// 撤回发起的审批
export function quotationSheetWithdrawSubmit(data) {
  return request({
    url: `/${apiName}/quotationSheet/withdraw/submit`,
    method: 'post',
    data
  })
}

// 审批报价单
export function quotationSheetApprove(data) {
  return request({
    url: `/${apiName}/quotationSheet/approve`,
    method: 'post',
    data
  })
}

// 使用报价
export function quotationSheetUse(data) {
  return request({
    url: `/${apiName}/quotationSheet/use`,
    method: 'post',
    data
  })
}

// 接收报价
export function quotationSheetAccept(data) {
  return request({
    url: `/${apiName}/quotationSheet/accept`,
    method: 'post',
    data
  })
}

// 撤回接受
export function quotationSheetWithdrawAcceptance(data) {
  return request({
    url: `/${apiName}/quotationSheet/withdraw/acceptance`,
    method: 'post',
    data
  })
}

// 否决报价
export function quotationSheetVeto(data) {
  return request({
    url: `/${apiName}/quotationSheet/veto`,
    method: 'post',
    data
  })
}

// 撤回否决
export function quotationSheetWithdrawVeto(data) {
  return request({
    url: `/${apiName}/quotationSheet/withdraw/veto`,
    method: 'post',
    data
  })
}

// 复制为草稿
export function quotationSheetCopy(data) {
  return request({
    url: `/${apiName}/quotationSheet/copy`,
    method: 'post',
    data
  })
}

// 更改所有人
export function quotationSheetModifyFollower(data) {
  return request({
    url: `/${apiName}/quotationSheet/modify/follower`,
    method: 'post',
    data
  })
}

// 客户相关品牌分页
export function customerBrandBrandPage(data) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: `/${apiName}/customer/brand/brandPage`,
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 商机分页查询
export function businessOpportunityPage(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: `/${apiName}/business/opportunity/page`,
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 区域与销售国家/地区
export function regionSalesRelate(data) {
  return request({
    url: `/${apiName}/profit/list`,
    method: 'post',
    data
  })
}

// crm区域与销售国家/地区
export function crmRegionSalesRelate(data) {
  return request({
    url: '/crm/region/sales/relate',
    method: 'post',
    data
  })
}

// 区域与销售分页查询
export function regionSalesPage(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: `/${apiName}/region/sales/page`,
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 品牌分页查询
export function brandPage(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: `/${apiName}/brand/page`,
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 客户分页查询
export function customerPage(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: `/${apiName}/customer/page`,
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 报价单详情
export function billInfo(data) {
  return request({
    url: `/crm/quotationSheet/billInfo`,
    method: 'post',
    data
  })
}
// 修改报价单提交
export function billUpdate(data) {
  return request({
    url: `/crm/quotationSheet/billUpdate`,
    method: 'post',
    data
  })
}

// 报价单详情 EXCEL导出
export function billInfoExport(data) {
  return request({
    url: `/crm/quotationSheet/billInfoExport?${data}`,
    method: 'get',
    responseType: 'arraybuffer'
    // params: data
    // data
  })
}

// 商机详情
export function businessOpportunityInfo(data) {
  return request({
    url: '/crm/business/opportunity/info',
    method: 'post',
    data
  })
}

// 客户分页
export function getCustomerPage(data) {
  const defaultParams = { pageNum: 1, pageSize: 50, dataTag: 'ALL' }
  return request({
    url: `/${apiName}/customer/page`,
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}
