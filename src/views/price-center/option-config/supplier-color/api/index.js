// 选项配置-供应商色号页面API
import request from '@/utils/request'

// 分页查询供应商色号列表
export function supplierColorPage(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/priceCenter/supplierColor/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 新增
export function supplierColorAdd(data) {
  return request({
    url: '/priceCenter/supplierColor/add',
    method: 'post',
    data
  })
}

// 编辑--详情
export function supplierColorDetail(data) {
  return request({
    url: '/priceCenter/supplierColor/info',
    method: 'post',
    data
  })
}

// 修改
export function supplierColorModify(data) {
  return request({
    url: '/priceCenter/supplierColor/modify',
    method: 'post',
    data
  })
}

// 删除
export function supplierColorDelete(data) {
  return request({
    url: '/priceCenter/supplierColor/delete',
    method: 'post',
    data
  })
}

// 启用禁用
export function supplierColorEnabled(data) {
  return request({
    url: '/priceCenter/supplierColor/status',
    method: 'post',
    data
  })
}
