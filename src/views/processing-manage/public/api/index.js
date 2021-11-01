/*
 * @Date: 2021-06-01 11:34:34
 * @Author: anthony
 * @LastEditTime: 2021-06-03 16:28:00
 * @LastEditors: anthony
 * @Descripttion:
 */
import request from '@/utils/request'
// 供应商类别为“服务”，
//供应商类型为“染纱厂”、“织厂”、“染整厂”、“印花厂”，
//供应商状态为“合格”，
//启用状态为“启用”的的所有供返回信息集
// 供应商
export function supplierList(params = {}) {
  const defaultParams = {
    supplierCategory: 1,
    supplierType: "10003",
    isEnabled: 1,
    status: 5
  }
  return request({
    url: '/srm/supplier/list',
    method: 'post',
    data: !params ? defaultParams : params
  })
}
// 查询供应商
export function supplierInfo(params) {
  return request({
    url: '/srm/supplier/info',
    method: 'post',
    data: params
  })
}
// 部门类型为“织跟单”、“染跟单”的所有输出参数
// 织跟单 WAV; 染跟单 DYE;  获取部门
export function sysOrgInfo(params) {
  return request({
    url: '/crm/sysOrg/list',
    method: 'post',
    data: params
  })
}
// 获取人员信息
export function fllowOrderList(params) {
  return request({
    url: '/userCenter/sysUser/list',
    method: 'post',
    data: params
  })
}

// 工艺
export function techController(data = {}) {
  return request({
    url: '/processingMgr/pdTechController/info',
    method: 'post',
    data: data
  })
}

// 基础数据-生产状态列表里，根据类型，状态为启用的所有生产状态中文名称
// 印花 typical: "PF"
// 染整 typical: "DC"
// 染纱 typical: 'DY'
export function produceStates(params = {}) {
  // dev:dev4
  // sit:product
  return request({
    url: '/basis/api/produceStates/option',
    method: 'post',
    data: { enabled: 'Y', ...params },
    headers: {
      'spathv': 'product'
    }
  })
}