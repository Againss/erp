import request from '@/utils/request'

// 计算常数设置列表
export function apsConstantSetPage(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/bmpAps/ltset/apsConstantSet/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 计算常数设置列表
export function apsConstantSetList(data = {}) {
  return request({
    url: '/bmpAps/ltset/apsConstantSet/list',
    method: 'post',
    data
  })
}

// 计算常数设置修改
export function apsConstantSetModify(data = {}) {
  return request({
    url: '/bmpAps/ltset/apsConstantSet/modify',
    method: 'post',
    data
  })
}

// 计算常数设置详情
export function apsConstantSetInfo(data = {}) {
  return request({
    url: '/bmpAps/ltset/apsConstantSet/info',
    method: 'post',
    data
  })
}
