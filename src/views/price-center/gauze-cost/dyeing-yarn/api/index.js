import request from '@/utils/request'

// 搜索下拉数据短纤
export function getSearchSelect(data = {}) {
  return request({
    url: '/priceCenter/dyedYarnInfo/optionsFilled',
    method: 'post',
    data
  })
}

// 分页长丝查询数据
export function getLongPage(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/priceCenter/dyedYarnInfo/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 长丝删除
export function deleteLong(data = {}) {
  return request({
    url: '/priceCenter/dyedYarnInfo/delete',
    method: 'post',
    data
  })
}

// 长丝编辑
export function editLong(data = {}) {
  return request({
    url: '/priceCenter/dyedYarnInfo/modify',
    method: 'post',
    data
  })
}

// 长丝新增
export function addLong(data = {}) {
  return request({
    url: '/priceCenter/dyedYarnInfo/add',
    method: 'post',
    data
  })
}

// 长丝启用禁用
export function enabledLong(data = {}) {
  return request({
    url: '/priceCenter/dyedYarnInfo/status',
    method: 'post',
    data
  })
}

// 长丝详情
export function getLongDetail(data = {}) {
  return request({
    url: '/priceCenter/dyedYarnInfo/info',
    method: 'post',
    data
  })
}

