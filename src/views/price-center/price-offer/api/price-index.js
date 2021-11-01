import request from '@/utils/request'
import { getEnvInfo } from '@/utils/index'
const apiName = /crm/.test(getEnvInfo().branch) ? 'crm/price' : 'priceCenter'

// 短纤分页查询
export function spunyarnInfoPage(data) {
  const defaultParams = { pageNum: 1, pageSize: 5 }
  return request({
    url: `/${apiName}/spunyarnInfo/page`,
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}
// 短纤下拉框数据
export function spunyarnInfoOptionsFilled(data) {
  return request({
    url: `/${apiName}/spunyarnInfo/optionsFilled`,
    method: 'post',
    data
  })
}

// 长丝分页查询
export function filamentInfoPage(data) {
  const defaultParams = { pageNum: 1, pageSize: 5 }
  return request({
    url: `/${apiName}/filamentInfo/page`,
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}
// 长丝下拉框数据
export function filamentInfoOptionsFilled(data) {
  return request({
    url: `/${apiName}/filamentInfo/optionsFilled`,
    method: 'post',
    data
  })
}

// 纱线证书分页数据
export function yarnCertInfoPage(data) {
  const defaultParams = { pageNum: 1, pageSize: 5 }
  return request({
    url: `/${apiName}/yarnCertInfo/page`,
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 染纱短纤/长丝分页数据
export function dyedYarnInfoPage(data) {
  const defaultParams = { pageNum: 1, pageSize: 5 }
  return request({
    url: `/${apiName}/dyedYarnInfo/page`,
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}
// 染纱短纤/长丝下拉框数据
export function dyedYarnInfoOptionsFilled(data) {
  return request({
    url: `/${apiName}/dyedYarnInfo/optionsFilled`,
    method: 'post',
    data
  })
}

// 染纱损耗短纤/长丝分页数据
export function dyedYarnLossInfoPage(data) {
  const defaultParams = { pageNum: 1, pageSize: 5 }
  return request({
    url: `/${apiName}/dyedYarnLossInfo/page`,
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}
// 染纱损耗短纤/长丝下拉框数据
export function dyedYarnLossInfoOptionsFilled(data) {
  return request({
    url: `/${apiName}/dyedYarnLossInfo/optionsFilled`,
    method: 'post',
    data
  })
}

// 织损耗分页数据
export function wavenLossInfoPage(data) {
  const defaultParams = { pageNum: 1, pageSize: 5 }
  return request({
    url: `/${apiName}/wavenLossInfo/page`,
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}
// 织损耗下拉框数据
export function wavenLossInfoOptionsFilled(data) {
  return request({
    url: `/${apiName}/wavenLossInfo/optionsFilled`,
    method: 'post',
    data
  })
}

// 织加工分页数据
export function wovenTechInfoPage(data) {
  const defaultParams = { pageNum: 1, pageSize: 5 }
  return request({
    url: `/${apiName}/wovenTechInfo/page`,
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}
// 织加工下拉框数据
export function wovenTechInfoOptionsFilled(data) {
  return request({
    url: `/${apiName}/wovenTechInfo/optionsFilled`,
    method: 'post',
    data
  })
}

// 染色工艺分页数据
export function dyeingInfoPage(data) {
  const defaultParams = { pageNum: 1, pageSize: 5 }
  return request({
    url: `/${apiName}/dyeingInfo/page`,
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}
// 染色工艺下拉框数据
export function dyeingInfoOptionsFilled(data) {
  return request({
    url: `/${apiName}/dyeingInfo/optionsFilled`,
    method: 'post',
    data
  })
}

// 染色附加分页数据
export function dyeingAdditionalInfoPage(data) {
  const defaultParams = { pageNum: 1, pageSize: 5 }
  return request({
    url: `/${apiName}/dyeingAdditionalInfo/page`,
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 染色损耗分页数据
export function dyeingLossInfoPage(data) {
  const defaultParams = { pageNum: 1, pageSize: 5 }
  return request({
    url: `/${apiName}/dyeingLossInfo/page`,
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}
// 染色损耗下拉框数据
export function dyeingLossInfoOptionsFilled(data) {
  return request({
    url: `/${apiName}/dyeingLossInfo/optionsFilled`,
    method: 'post',
    data
  })
}

// 后整/后整损耗分页数据
export function afterfinishLossPage(data) {
  const defaultParams = { pageNum: 1, pageSize: 5 }
  return request({
    url: `/${apiName}/afterfinishLoss/page`,
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}
// 后整/后整损耗下拉框数据
export function afterfinishLossOptionsFilled(data) {
  return request({
    url: `/${apiName}/afterfinishLoss/optionsFilled`,
    method: 'post',
    data
  })
}

// 功能/功能损耗分页数据
export function functionLossInfoPage(data) {
  const defaultParams = { pageNum: 1, pageSize: 5 }
  return request({
    url: `/${apiName}/functionLossInfo/page`,
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}
// 功能/功能损耗下拉框数据
export function functionLossInfoOptionsFilled(data) {
  return request({
    url: `/${apiName}/functionLossInfo/optionsFilled`,
    method: 'post',
    data
  })
}

// 印花工艺主要/次要分页数据
export function printingTechInfoInfoPage(data) {
  const defaultParams = { pageNum: 1, pageSize: 5 }
  return request({
    url: `/${apiName}/printingTechInfo/page`,
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}
// 印花工艺主要/次要下拉框数据
export function printingTechInfoOptionsFilled(data) {
  return request({
    url: `/${apiName}/printingTechInfo/optionsFilled`,
    method: 'post',
    data
  })
}

// 印花证书分页数据
export function printingCertInfoPage(data) {
  const defaultParams = { pageNum: 1, pageSize: 5 }
  return request({
    url: `/${apiName}/printingCertInfo/page`,
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 印花附加分页数据
export function printingAdditionalInfoPage(data) {
  const defaultParams = { pageNum: 1, pageSize: 5 }
  return request({
    url: `/${apiName}/printingAdditionalInfo/page`,
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 印花损耗分页数据
export function printingLossInfoPage(data) {
  const defaultParams = { pageNum: 1, pageSize: 5 }
  return request({
    url: `/${apiName}/printingLossInfo/page`,
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}
// 印花损耗下拉框数据
export function printingLossInfoOptionsFilled(data) {
  return request({
    url: `/${apiName}/printingLossInfo/optionsFilled`,
    method: 'post',
    data
  })
}

// 付款条件分页数据
export function paymentMethodPage(data) {
  const defaultParams = { pageNum: 1, pageSize: 5 }
  return request({
    url: `/${apiName}/paymentMethod/page`,
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}
// 付款条件下拉数据
export function paymentMethodOptionsFilled(data) {
  return request({
    url: `/${apiName}/paymentMethod/optionsFilled`,
    method: 'post',
    data
  })
}
// 运输成本分页数据
export function freightPage(data) {
  const defaultParams = { pageNum: 1, pageSize: 5 }
  return request({
    url: `/${apiName}/freight/page`,
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}
// 运输成本下拉框数据
export function freightOptionsFilled(data) {
  return request({
    url: `/${apiName}/freight/optionsFilled`,
    method: 'post',
    data
  })
}

// 测试成本分页数据
export function testCostPage(data) {
  const defaultParams = { pageNum: 1, pageSize: 5 }
  return request({
    url: `/${apiName}/testCost/page`,
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}
// 测试成本下拉框数据
export function testCostOptionsFilled(data) {
  return request({
    url: `/${apiName}/testCost/optionsFilled`,
    method: 'post',
    data
  })
}

// 汇率配置全量列表
export function exchangeRateList(data) {
  return request({
    url: `/${apiName}/exchangeRate/list`,
    method: 'post',
    data
  })
}

// 获取客户列表
export function getCustomerList(data) {
  return request({
    url: `/${apiName === 'priceCenter' ? 'customerCenter' : apiName}/customer/list`,
    method: 'post',
    data
  })
}

// 新建客户
export function addCustomer(data) {
  return request({
    url: `/${apiName === 'priceCenter' ? 'customerCenter' : apiName}/customer/add`,
    method: 'post',
    data
  })
}
// 获取品牌列表
export function getBrandList(data) {
  return request({
    url: `/${apiName === 'priceCenter' ? 'customerCenter' : apiName}/brand/list`,
    method: 'post',
    data
  })
}

// 新建客户
export function addBrand(data) {
  return request({
    url: `/${apiName === 'priceCenter' ? 'customerCenter' : apiName}/brand/add`,
    method: 'post',
    data
  })
}
