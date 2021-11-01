import request from '@/utils/request'

// 销售目标设置分页查询
export function salestargetPage(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/crm/salestarget/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 销售目标设置详情
export function salestargetInfo(data) {
  return request({
    url: '/crm/salestarget/info',
    method: 'post',
    data
  })
}

// 销售目标设置修改
export function salestargetModify(data) {
  return request({
    url: '/crm/salestarget/modify',
    method: 'post',
    data
  })
}

// 销售目标设置全量列表
export function salestargetList(data) {
  return request({
    url: '/crm/salestarget/list',
    method: 'post',
    data
  })
}

// 销售目标设置新增
export function salestargetAdd(data) {
  return request({
    url: '/crm/salestarget/add',
    method: 'post',
    data
  })
}

// 销售目标设置删除
export function salestargetDelete(data) {
  return request({
    url: '/crm/salestarget/delete',
    method: 'post',
    data
  })
}

