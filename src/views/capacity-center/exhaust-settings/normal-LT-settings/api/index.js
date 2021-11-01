import request from '@/utils/request'
// 查询衫身列表
export function shirtbodyList(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/bmpAps/ltset/apsNormalLtSetShirtbody/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}
// 查询下栏列表
export function setLowList(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/bmpAps/ltset/apsNormalLtSetLowbar/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}
// 衫身-详情查询
export function setShirtDetail(data) {
  return request({
    url: '/bmpAps/ltset/apsNormalLtSetShirtbody/info',
    method: 'post',
    data
  })
}
// 衫身-新增
export function setShirtAdd(data) {
  return request({
    url: '/bmpAps/ltset/apsNormalLtSetShirtbody/add',
    method: 'post',
    data
  })
}
// 衫身-更新
export function setShirtUpdate(data) {
  return request({
    url: '/bmpAps/ltset/apsNormalLtSetShirtbody/modify',
    method: 'post',
    data
  })
}
// 衫身-删除
export function setShirtDelete(data) {
  return request({
    url: '/bmpAps/ltset/apsNormalLtSetShirtbody/delete',
    method: 'post',
    data
  })
}
// 衫身-启用、禁用
export function setShirtEnabled(data) {
  return request({
    url: '/bmpAps/ltset/apsNormalLtSetShirtbody/updateStatus',
    method: 'post',
    data
  })
}
// 下栏-详情查询
export function setLowDetail(data) {
  return request({
    url: '/bmpAps/ltset/apsNormalLtSetLowbar/info',
    method: 'post',
    data
  })
}
// 下栏-新增
export function setLowAdd(data) {
  return request({
    url: '/bmpAps/ltset/apsNormalLtSetLowbar/add',
    method: 'post',
    data
  })
}
// 下栏-更新
export function setLowUpdate(data) {
  return request({
    url: '/bmpAps/ltset/apsNormalLtSetLowbar/modify',
    method: 'post',
    data
  })
}
// 下栏-删除
export function setLowDelete(data) {
  return request({
    url: '/bmpAps/ltset/apsNormalLtSetLowbar/delete',
    method: 'post',
    data
  })
}
// 下栏-启用、禁用
export function setLowEnabled(data) {
  return request({
    url: '/bmpAps/ltset/apsNormalLtSetLowbar/updateStatus',
    method: 'post',
    data
  })
}
// 部位身染方式-衫身、部位染方式-下栏下拉框
export function fabricationProduceModes(data) {
  const defaultParams = { page: 1, pageSize: 100 }
  return request({
    url: 'basis/api/fabricationProduceModes/index',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}
