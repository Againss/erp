import request from '@/utils/request'

// 详情
export function getDetail(data = {}) {
  return request({
    url: '/customerOrder/soPrint/printApply/info',
    method: 'post',
    data: { ...data }
  })
}

// 新增
export function printAdd(data = {}) {
  return request({
    url: '/customerOrder/soPrint/printApply/add',
    method: 'post',
    data: { ...data }
  })
}

// 修改
export function printModify(data = {}) {
  return request({
    url: '/customerOrder/soPrint/printApply/modify',
    method: 'post',
    data: { ...data }
  })
}

// 提交
export function printSubmit(data = {}) {
  return request({
    url: '/customerOrder/soPrint/printApply/submit',
    method: 'post',
    data: { ...data }
  })
}

// 完结
export function printFinish(data = {}) {
  return request({
    url: '/customerOrder/soPrint/printApply/finish',
    method: 'post',
    data: { ...data }
  })
}

// 删除
export function printDelete(data = {}) {
  return request({
    url: '/customerOrder/soPrint/printApply/delete',
    method: 'post',
    data: { ...data }
  })
}

// 取消生产
export function printCancel(data = {}) {
  return request({
    url: '/customerOrder/soPrint/printApply/cancel',
    method: 'post',
    data: { ...data }
  })
}

// 根据印花颜色名搜索颜色信息
export function getColorInfo(data = {}) {
  return request({
    url: '/customerOrder/soPrint/colorInfo/info',
    method: 'post',
    data: { ...data }
  })
}

// 客服，销售员下拉
export function userSelet(data = {}) {
  return request({
    url: '/userCenter/sysUser/list',
    method: 'post',
    data: { ...data }
  })
}

// 销售团队下拉
export function sellTeamselect(data = {}) {
  return request({
    url: '/crm/sysOrg/list',
    method: 'post',
    data: { ...data }
  })
}

// 客户下拉
export function customerSelect(data = {}) {
  return request({
    url: '/crm/customer/list',
    method: 'post',
    data: { ...data }
  })
}

// 品牌商下拉
export function brandSelect(data = {}) {
  return request({
    url: '/crm/brand/list',
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

// 库存布类下拉
export function clothSelect(data = {}) {
  return request({
    url: '/basis/api/cloths/index',
    method: 'post',
    data: { ...data }
  })
}

// 印花工艺下拉
export function printCraftSelect(data = {}) {
  return request({
    url: '/basis/openapi/requirementPrinting/search',
    method: 'post',
    data: { ...data }
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
