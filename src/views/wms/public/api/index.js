import request from '@/utils/request'
// 货主
export const shipperList = () => {
  return request({
    method: 'post',
    url: '/wms/out/reservation/shipper'
  })
}
//仓库
export const warehouseList = (params = {}) => {
  return request({
    method: 'post',
    url: '/wms/warehouse/list',
    data: params
  })
}

/* 新增页面--库位的搜索 */
export function getWarehouseLocationData (params = {}) {
  return request({
    url: '/wms/warehouseLocation/list',
    method: 'post',
    data: params
  })
}

/* 用户列表查询 */
export const getSysUserListData = (params = {}) => {
  return request({
    url: '/userCenter/sysUser/list',
    method: 'post',
    data: params
  })
}
// 明细查询
export const goodsDetail = (params = {}) => {
  return request({
    method: 'post',
    url: '/wms/out/pick/product/detail/detail',
    data: params
  })
}

/* 仓库调用的下拉*/
export const locationWarehouseData = (data) => {
  return request({
    url: '/wms/warehouse/list',
    method: 'post',
    data
  })
}
// 销售组织
export function sellTeamselet(data = {}) {
  return request({
    url: '/crm/sysOrg/list',
    method: 'post',
    data: { ...data }
  })
}
