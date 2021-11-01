import request from '@/utils/request'

export function list(data = {}) {
  return request({
    url: '/wms/cutCloth/pageList',
    method: 'post',
    data: data
  })
}

export function count(data = {}) {
  return request({
    url: '/wms/cutCloth/statusCount',
    method: 'post',
    data: data
  })
}

export function info(data = {}) {
  return request({
    url: '/wms/cutCloth/info',
    method: 'post',
    data: data
  })
}

export function infoList(data = {}) {
  return request({
    url: '/wms/cutCloth/order/list',
    method: 'post',
    data: data
  })
}

export function changeOrderStatus(data = {}) {
  return request({
    url: '/wms/cutCloth/order/changeOrderStatus',
    method: 'post',
    data: data
  })
}

export function finish(data = {}) {
  return request({
    url: '/wms/cutCloth/finishAllOrders',
    method: 'post',
    data: data
  })
}

export function finishOrder(data = {}) {
  return request({
    url: '/wms/cutCloth/order/finishOrder',
    method: 'post',
    data: data
  })
}

export function printChangeStatus(data = {}) {
  return request({
    url: '/wms/cutCloth/printChangeStatus',
    method: 'post',
    data: data
  })
}

