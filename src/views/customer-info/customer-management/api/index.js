/*
 * @Descripttion:
 * @Author: admin
 * @Date: 2021-03-04 14:03:07
 * @LastEditors: zhengjin
 * @LastEditTime: 2021-08-05 19:21:10
 */
import request from '@/utils/request'
import { createUniqueString } from '@/utils/index'

// 客户列表分页查询列表
export function list(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/customerCenter/customer/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}
// 客户类型
export function customerType(data = {}) {
  return request({
    url: '/customerCenter/customer/type/list',
    method: 'post',
    data: { ...data }
  })
}
// 客户级别
export function levelType(data = {}) {
  return request({
    url: '/customerCenter/customer/level/list',
    method: 'post',
    data
  })
}
// 所有人
export function followerType(data = {}) {
  return request({
    // url: '/userCenter/sysUser/page',
    url: '/userCenter/sysUser/list',
    method: 'post',
    data
  })
}
// 企业基本信息
export function enterpriseInfo(data = {}) {
  return request({
    url: '/customerCenter/customer/info',
    method: 'post',
    data: { ...data }
  })
}
// 新增企业基本信息
export function addEnterpriseInfo(data = {}) {
  return request({
    url: '/customerCenter/customerDetail/add',
    method: 'post',
    data: { ...data }
  })
}
// 更新企业基本信息
export function updateEnterpriseInfo(data = {}) {
  return request({
    url: '/customerCenter/customerDetail/modify',
    method: 'post',
    data: { ...data }
  })
}
// 省市区查询
export function addressInfo(data = {}) {
  return request({
    url: '/basis/api/areas/index',
    method: 'post',
    data: { ...data }
  })
}
// 经营状态下拉
export function getOperaStatus(data = {}) {
  return request({
    url: '/basis/api/optionConfig/index',
    method: 'post',
    data: { ...data }
  })
}
// 币别
export function currencySearch(data = {}) {
  return request({
    url: '/basis/api/currencies/index',
    method: 'post',
    data: { ...data }
  })
}
// 地址列表
export function receiptList(data = {}) {
  return request({
    url: '/customerCenter/customer/address/page',
    method: 'post',
    data: { ...data }
  })
}
// 地址新增
export function receiptAdd(data = {}) {
  return request({
    url: '/customerCenter/customer/address/add',
    method: 'post',
    data: { ...data }
  })
}
// 地址详情
export function receiptShow(data = {}) {
  return request({
    url: '/customerCenter/customer/address/info',
    method: 'post',
    data: { ...data }
  })
}
// 地址更新
export function receiptUpdate(data = {}) {
  return request({
    url: '/customerCenter/customer/address/modify',
    method: 'post',
    data: { ...data }
  })
}
// 地址删除
export function receiptDelete(data = {}) {
  return request({
    url: '/customerCenter/customer/address/delete',
    method: 'post',
    data: { ...data }
  })
}
// 规则详情
export function ruleInfo(data = {}) {
  return request({
    url: '/customerCenter/customer/rule/setting/info',
    method: 'post',
    data: { ...data }
  })
}
// 规则新增
export function ruleAdd(data = {}) {
  return request({
    url: '/customerCenter/customer/rule/setting/add',
    method: 'post',
    data: { ...data }
  })
}
// 规则编辑
export function ruleUpdate(data = {}) {
  return request({
    url: '/customerCenter/customer/rule/setting/modify',
    method: 'post',
    data: { ...data }
  })
}
// 头像上传
export function uploadImg(data) {
  const unique = createUniqueString()
  return request({
    url: `/common/file/upload?${unique}`,
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    data: data
  })
}

