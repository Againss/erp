/*
 * @Descripttion: 工艺要求
 * @version:
 * @Author: shujing
 * @Date: 2020-09-24 15:06:28
 * @LastEditors: Sanmao
 * @LastEditTime: 2021-05-21 17:10:45
 */

import request from '@/utils/request'

// 分页查询数据范围
// export function sysDataGroupPage(data = {}) {
//   const defaultParams = { pageNum: 1, pageSize: 20 }
//   return request({
//     url: '/userCenter/sysDataGroup/page',
//     method: 'post',
//     data: { ...defaultParams, ...data }
//   })
// }

// 工艺要求分类列表数据
export function sysDataGroupIndex(data = {}) {
  const defaultParams = { page: 1, pageSize: 20 }
  return request({
    url: '/basis/api/requiredClassifications/index',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 工艺要求分类启用/禁用
export function sysDataGroupEnable(data) {
  return request({
    url: '/basis/api/requiredClassifications/enabled',
    method: 'post',
    data
  })
}

// 工艺要求分类新增保存
export function sysDataGroupAdd(data) {
  return request({
    url: '/basis/api/requiredClassifications/store',
    method: 'post',
    data
  })
}

// 工艺要求分类编辑保存
export function sysDataGroupModify(data) {
  return request({
    url: '/basis/api/requiredClassifications/update',
    method: 'post',
    data
  })
}

// 工艺要求分类删除
export function sysDataGroupDelete(data) {
  return request({
    url: '/basis/api/requiredClassifications/destroy',
    method: 'post',
    data
  })
}

// 工艺要求分类审核
export function sysDataGroupExam(data) {
  return request({
    url: '/basis/api/requiredClassifications/approve',
    method: 'post',
    data
  })
}

// 工艺要求分类编辑详情
export function sysDataGroupInfo(data) {
  return request({
    url: '/basis/api/requiredClassifications/show',
    method: 'post',
    data
  })
}

// 染整列表数据
export function sysDataGroupIndexdye(data = {}) {
  const defaultParams = { page: 1, pageSize: 20 }
  return request({
    url: '/basis/api/requirementsDye/index',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 染整启用/禁用
export function sysDataGroupEnabledye(data) {
  return request({
    url: '/basis/api/requirementsDye/enabled',
    method: 'post',
    data
  })
}

// 染整新增保存
export function sysDataGroupAdddye(data) {
  return request({
    url: '/basis/api/requirementsDye/store',
    method: 'post',
    data
  })
}

// 染整编辑保存
export function sysDataGroupModifydye(data) {
  return request({
    url: '/basis/api/requirementsDye/update',
    method: 'post',
    data
  })
}

// 染整删除
export function sysDataGroupDeletedye(data) {
  return request({
    url: '/basis/api/requirementsDye/destroy',
    method: 'post',
    data
  })
}

// 染整审核
export function sysDataGroupExamdye(data) {
  return request({
    url: '/basis/api/requirementsDye/approve',
    method: 'post',
    data
  })
}

// 染整编辑详情
export function sysDataGroupInfodye(data) {
  return request({
    url: '/basis/api/requirementsDye/show',
    method: 'post',
    data
  })
}
// 染整弹框工艺要求分类下拉
export function sysSelectdye(data) {
  return request({
    url: '/basis/api/requiredClassifications/option',
    method: 'post',
    data
  })
}

// 染整弹框所属上级下拉
export function sysSelectlevel(data) {
  return request({
    url: '/basis/api/requirementsDye/option',
    method: 'post',
    data
  })
}

// 印花列表数据
export function sysDataGroupIndexprint(data = {}) {
  const defaultParams = { page: 1, pageSize: 20 }
  return request({
    url: '/basis/api/requirementsPrinting/index',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 印花启用/禁用
export function sysDataGroupEnableprint(data) {
  return request({
    url: '/basis/api/requirementsPrinting/enabled',
    method: 'post',
    data
  })
}

// 印花新增保存
export function sysDataGroupAddprint(data) {
  return request({
    url: '/basis/api/requirementsPrinting/store',
    method: 'post',
    data
  })
}

// 印花编辑保存
export function sysDataGroupModifyprint(data) {
  return request({
    url: '/basis/api/requirementsPrinting/update',
    method: 'post',
    data
  })
}

// 印花删除
export function sysDataGroupDeleteprint(data) {
  return request({
    url: '/basis/api/requirementsPrinting/destroy',
    method: 'post',
    data
  })
}

// 印花审核
export function sysDataGroupExamprint(data) {
  return request({
    url: '/basis/api/requirementsPrinting/approve',
    method: 'post',
    data
  })
}

// 印花编辑详情
export function sysDataGroupInfodprint(data) {
  return request({
    url: '/basis/api/requirementsPrinting/show',
    method: 'post',
    data
  })
}

// 染整工艺组合数据
export function sysDataGroupIndexDyeingFinishingProcesses(data = {}) {
  const defaultParams = { page: 1, pageSize: 20 }
  return request({
    url: '/basis/api/requirementsCombination/index',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 染整工艺组合启用/禁用
export function sysDataGroupEnableDyeingFinishingProcesses(data) {
  return request({
    url: '/basis/api/requirementsCombination/enabled',
    method: 'post',
    data
  })
}

// 染整工艺组合新增保存
export function sysDataGroupAddDyeingFinishingProcesses(data) {
  return request({
    url: '/basis/api/requirementsCombination/store',
    method: 'post',
    data
  })
}

// 染整工艺组合编辑保存
export function sysDataGroupModifyDyeingFinishingProcesses(data) {
  return request({
    url: '/basis/api/requirementsCombination/update',
    method: 'post',
    data
  })
}

// 染整工艺组合删除
export function sysDataGroupDeleteDyeingFinishingProcesses(data) {
  return request({
    url: '/basis/api/requirementsCombination/destroy',
    method: 'post',
    data
  })
}

// 染整工艺组合审核
export function sysDataGroupExamDyeingFinishingProcesses(data) {
  return request({
    url: '/basis/api/requirementsCombination/approve',
    method: 'post',
    data
  })
}

// 染整工艺组合编辑详情
export function sysDataGroupDyeingFinishingProcesses(data) {
  return request({
    url: '/basis/api/requirementsCombination/show',
    method: 'post',
    data
  })
}

