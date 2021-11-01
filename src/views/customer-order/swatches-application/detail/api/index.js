/*
 * @Author: xj
 * @Date: 2021-01-12 11:17:45
 * @LastEditTime: 2021-01-21 14:40:06
 * @LastEditors: OBKoro1
 * @Description: 色板申请详情api
 */
import request from '@/utils/request'

// 保存详情
export function getAdd(data = {}) {
  return request({
    url: '/customerOrder/colorModel/colorModelApply/add',
    method: 'post',
    data: { ...data }
  })
}

// 详情信息
export function getDetail(data = {}) {
  return request({
    url: '/customerOrder/colorModel/colorModelApply/info',
    method: 'post',
    data: { ...data }
  })
}
// 修改
export function getModify(data = {}) {
  return request({
    url: '/customerOrder/colorModel/colorModelApply/modify',
    method: 'post',
    data: { ...data }
  })
}
// 删除
export function getDelete(data = {}) {
  return request({
    url: '/customerOrder/colorModel/colorModelApply/delete',
    method: 'post',
    data: { ...data }
  })
}

// 完结
export function getFinish(data = {}) {
  return request({
    url: '/customerOrder/colorModel/colorModelApply/finish',
    method: 'post',
    data: { ...data }
  })
}
// 取消生产
export function getCancel(data = {}) {
  return request({
    url: '/customerOrder/colorModel/colorModelApply/cancel',
    method: 'post',
    data: { ...data }
  })
}

// 提交
export function getSubmit(data = {}) {
  return request({
    url: '/customerOrder/colorModel/colorModelApply/submit',
    method: 'post',
    data: { ...data }
  })
}
// 色板类型下拉
export function colorType(data = {}) {
  return request({
    url: '/customerOrder/colorManage/openapi/colorBd/colorPlateType/search',
    method: 'post',
    data: { ...data }
  })
}
// 对色光源下拉
export function firstLightSelect(data = {}) {
  return request({
    url: '/basis/api/lightSources/index',
    method: 'post',
    data: { ...data }
  })
}

// 销售年份下拉
export function yearSelet(data = {}) {
  return request({
    url: '/customerOrder/sampleAnalysisApply/year',
    method: 'post',
    data: { ...data }
  })
}

// 下载文件
export function downFile(data = {}) {
  return request({
    url: '/customerOrder/download',
    method: 'get',
    responseType: 'arraybuffer',
    params: data
  })
}

// 纱支
export function yarnSelect(data = {}) {
  return request({
    url: '/basis/openapi/yarnType/search',
    method: 'post',
    data: { ...data }
  })
}
// 成份下拉
export function compositionSelect(data = {}) {
  return request({
    url: '/basis/api/ingredients/index',
    method: 'post',
    data: { ...data }
  })
}
// 组合成份下拉
export function zhCompositionSelect(data = {}) {
  return request({
    url: '/basis/openapi/assemblyIngredient/search',
    method: 'post',
    data: { ...data }
  })
}

// 纺纱方法下拉
export function clothSelect(data = {}) {
  return request({
    url: 'basis/openapi/yarnType/search',
    method: 'post',
    data
  })
}
// 单双染下拉
export function singleDoubleDye(data = {}) {
  return request({
    url: 'basis/openapi/singleDoubleDye/search',
    method: 'post',
    data
  })
}
// 对色标准下拉
export function clothStandardConf(data = {}) {
  return request({
    url: '/baseData/colorModel/colorModelStandardConf/list',
    method: 'post',
    data
  })
}

// 销售员改变销售团队
export function setsellerTeamPost(data = {}) {
  return request({
    url: 'basis/openapi/yarnType/search',
    method: 'post',
    data
  })
}

// 销售团队 新
export function saleDepartmentPost(data = {}) {
  return request({
    url: '/customerOrder/colorModel/colorModelApply/saleDepartmentList',
    method: 'post',
    data
  })
}

// 销售员 新
export function salerListPost(data = {}) {
  return request({
    url: '/customerOrder/colorModel/colorModelApply/salerList',
    method: 'post',
    data
  })
}

