import request from '@/utils/request'

// 常规
// 采购生产天数分页查询(常规)
export function apsPurchaseDayGeneralList(data = {}) {
  return request({
    url: '/bmpAps/apsPurchaseDay/general/page',
    method: 'post',
    data: { ...{ pageNum: 1, pageSize: 20 }, ...data }
  })
}
// 新增
export function addApsPurchaseDayGeneral(data = {}) {
  return request({
    url: '/bmpAps/apsPurchaseDay/general/add',
    method: 'post',
    data: { ...data }
  })
}
// 编辑
export function modifyApsPurchaseDayGeneral(data = {}) {
  return request({
    url: '/bmpAps/apsPurchaseDay/general/modify',
    method: 'post',
    data: { ...data }
  })
}

// 花灰
// 列表
export function apsPurchaseDayHeatherList(data = {}) {
  return request({
    url: '/bmpAps/apsPurchaseDay/heather/page',
    method: 'post',
    data: { ...{ pageNum: 1, pageSize: 20 }, ...data }
  })
}
// 编辑
export function modifyApsPurchaseDayHeather(data = {}) {
  return request({
    url: '/bmpAps/apsPurchaseDay/heather/modify',
    method: 'post',
    data: { ...data }
  })
}

// 纱类
// 列表
export function apsPurchaseDayYarnList(data = {}) {
  return request({
    url: '/bmpAps/apsPurchaseDay/yarn/page',
    method: 'post',
    data: { ...{ pageNum: 1, pageSize: 20 }, ...data }
  })
}
// 新增
export function addApsPurchaseDayYarn(data = {}) {
  return request({
    url: '/bmpAps/apsPurchaseDay/yarn/add',
    method: 'post',
    data: { ...data }
  })
}
// 编辑
export function modifyApsPurchaseDayYarn(data = {}) {
  return request({
    url: '/bmpAps/apsPurchaseDay/yarn/modify',
    method: 'post',
    data: { ...data }
  })
}

// 长纤
// 列表
export function apsPurchaseDayLongFiberList(data = {}) {
  return request({
    url: '/bmpAps/apsPurchaseDay/longFiber/page',
    method: 'post',
    data: { ...{ pageNum: 1, pageSize: 20 }, ...data }
  })
}
// 新增
export function addApsPurchaseDayLongFiber(data = {}) {
  return request({
    url: '/bmpAps/apsPurchaseDay/longFiber/add',
    method: 'post',
    data: { ...data }
  })
}
// 编辑
export function modifyApsPurchaseDayLongFiber(data = {}) {
  return request({
    url: '/bmpAps/apsPurchaseDay/longFiber/modify',
    method: 'post',
    data: { ...data }
  })
}

// 启用停用
export function changeApsPurchaseDay(data = {}) {
  return request({
    url: '/bmpAps/apsPurchaseDay/status',
    method: 'post',
    data: { ...data }
  })
}
// 删除
export function deleteApsPurchaseDay(data = {}) {
  return request({
    url: '/bmpAps/apsPurchaseDay/delete',
    method: 'post',
    data: { ...data }
  })
}

