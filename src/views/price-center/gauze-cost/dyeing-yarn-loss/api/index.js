import request from '@/utils/request'

// 搜索下拉数据
export function getSearchSelect(data = {}) {
  return request({
    url: '/priceCenter/dyedYarnLossInfo/optionsFilled',
    method: 'post',
    data
  })
}

// 染纱损耗分页查询数据
export function getLongPage(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/priceCenter/dyedYarnLossInfo/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 染纱损耗删除
export function deleteLong(data = {}) {
  return request({
    url: '/priceCenter/dyedYarnLossInfo/delete',
    method: 'post',
    data
  })
}

// 染纱损耗编辑
export function editLong(data = {}) {
  return request({
    url: '/priceCenter/dyedYarnLossInfo/modify',
    method: 'post',
    data
  })
}

// 染纱损耗新增
export function addLong(data = {}) {
  return request({
    url: '/priceCenter/dyedYarnLossInfo/add',
    method: 'post',
    data
  })
}

// 染纱损耗启用禁用
export function enabledLong(data = {}) {
  return request({
    url: '/priceCenter/dyedYarnLossInfo/status',
    method: 'post',
    data
  })
}

// 染纱损耗详情
export function getLongDetail(data = {}) {
  return request({
    url: '/priceCenter/dyedYarnLossInfo/info',
    method: 'post',
    data
  })
}

