// 库区资料页面 API
import request from '@/utils/request'

// 分页查询列表
export function areaPage(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/wms/warehouseArea/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 新增
export function areaAdd(data) {
  return request({
    url: '/wms/warehouseArea/add',
    method: 'post',
    data
  })
}

// 编辑--详情
export function areaDetail(data) {
  return request({
    url: '/wms/warehouseArea/info',
    method: 'post',
    data
  })
}

// 编辑-保存
export function areaUpdate(data) {
  return request({
    url: '/wms/warehouseArea/modify',
    method: 'post',
    data
  })
}

// 删除
export function areaDelete(data) {
  return request({
    url: '/wms/warehouseArea/delete',
    method: 'post',
    data
  })
}

// 仓库调用的下拉接口
export function locationWarehouse(data) {
  return request({
    url: '/wms/warehouse/list',
    method: 'post',
    data
  })
}
