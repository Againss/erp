import request from '@/utils/request'

// 可用邮箱列表查询
export function sysOrgTypeList(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/userCenter/sysOrgType/page',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}
// 新增
export function sysOrgTypeAdd(data) {
  return request({
    url: '/userCenter/sysOrgType/add',
    method: 'post',
    data
  })
}

// 删除邮箱
export function sysOrgTypeDelete(data = {}) {
  return request({
    url: '/userCenter/sysOrgType/delete',
    method: 'post',
    data
  })
}
