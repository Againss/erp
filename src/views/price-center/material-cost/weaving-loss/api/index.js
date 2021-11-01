import request from '@/utils/request'

// 搜索下拉数据
export function getSearchSelect(data = {}) {
  return request({
    url: '/priceCenter/wavenLossInfo/optionsFilled',
    method: 'post',
    data
  })
}

// 织损耗分页查询数据
export function getWavenLossPage(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/priceCenter/wavenLossInfo/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 织损耗删除
export function deleteWavenLoss(data = {}) {
  return request({
    url: '/priceCenter/wavenLossInfo/delete',
    method: 'post',
    data
  })
}

// 织损耗编辑
export function editWavenLoss(data = {}) {
  return request({
    url: '/priceCenter/wavenLossInfo/modify',
    method: 'post',
    data
  })
}

// 织损耗新增
export function addWavenLoss(data = {}) {
  return request({
    url: '/priceCenter/wavenLossInfo/add',
    method: 'post',
    data
  })
}

// 织损耗启用禁用
export function enabledWavenLoss(data = {}) {
  return request({
    url: '/priceCenter/wavenLossInfo/status',
    method: 'post',
    data
  })
}

// 织损耗详情
export function getWavenLossDetail(data = {}) {
  return request({
    url: '/priceCenter/wavenLossInfo/info',
    method: 'post',
    data
  })
}
