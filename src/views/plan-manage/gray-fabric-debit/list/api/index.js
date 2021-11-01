import request from '@/utils/request'

// 坯布借调分页查询
export function grayClothLoanPage(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/aps/grayClothLoan/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 坯布借调-借调单号-点击查看
export function loanInfo(data = {}) {
  return request({
    url: '/aps/grayClothLoan/loan/info',
    method: 'post',
    data
  })
}

// 坯布借调-查看、编辑按钮-查询
export function loanDetail(data = {}) {
  return request({
    url: '/aps/grayClothLoan/loan/detail',
    method: 'post',
    data
  })
}

// 坯布借调-归还-点击查看
export function backInfo(data = {}) {
  return request({
    url: '/aps/grayClothLoan/back/info',
    method: 'post',
    data
  })
}

// 坯布借调-借调编辑
export function grayClothLoanUpdate(data = {}) {
  return request({
    url: '/aps/grayClothLoan/update',
    method: 'post',
    data
  })
}

// 坯布借调-归还
export function sendBack(data = {}) {
  return request({
    url: '/aps/grayClothLoan/send/back',
    method: 'post',
    data
  })
}
