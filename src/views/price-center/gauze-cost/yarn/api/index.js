import request from '@/utils/request'

// 搜索下拉数据短纤
export function getSearchSelect(data = {}) {
  return request({
    url: '/priceCenter/spunyarnInfo/optionsFilled',
    method: 'post',
    data
  })
}

// 搜索下拉数据长丝
export function getSearchSelectLong(data = {}) {
  return request({
    url: '/priceCenter/filamentInfo/optionsFilled',
    method: 'post',
    data
  })
}

// 分页短纤查询数据
export function getShortPage(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/priceCenter/spunyarnInfo/page',
    // url: '/priceCenter/wavenLossInfo/add',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 短纤删除
export function deleteShort(data = {}) {
  return request({
    url: '/priceCenter/spunyarnInfo/delete',
    method: 'post',
    data
  })
}

// 短纤编辑
export function editShort(data = {}) {
  return request({
    url: '/priceCenter/spunyarnInfo/modify',
    method: 'post',
    data
  })
}

// 短纤新增
export function addShort(data = {}) {
  return request({
    url: '/priceCenter/spunyarnInfo/add',
    method: 'post',
    data
  })
}

// 短纤启用禁用
export function enabledShort(data = {}) {
  return request({
    url: '/priceCenter/spunyarnInfo/status',
    method: 'post',
    data
  })
}

// 短纤详情
export function getShortDetail(data = {}) {
  return request({
    url: '/priceCenter/spunyarnInfo/info',
    method: 'post',
    data
  })
}

// 分页长丝查询数据
export function getLongPage(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/priceCenter/filamentInfo/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 长丝删除
export function deleteLong(data = {}) {
  return request({
    url: '/priceCenter/filamentInfo/delete',
    method: 'post',
    data
  })
}

// 长丝编辑
export function editLong(data = {}) {
  return request({
    url: '/priceCenter/filamentInfo/modify',
    method: 'post',
    data
  })
}

// 长丝新增
export function addLong(data = {}) {
  return request({
    url: '/priceCenter/filamentInfo/add',
    method: 'post',
    data
  })
}

// 长丝启用禁用
export function enabledLong(data = {}) {
  return request({
    url: '/priceCenter/filamentInfo/status',
    method: 'post',
    data
  })
}

// 长丝详情
export function getLongDetail(data = {}) {
  return request({
    url: '/priceCenter/filamentInfo/info',
    method: 'post',
    data
  })
}
