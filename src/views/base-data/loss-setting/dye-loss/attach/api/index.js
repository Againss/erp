
import request from '@/utils/request'
// 列表查询
export function list(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/baseData/lossSetting/baseDyeAttach/list',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}
// 按钮新增
export function add(data) {
  return request({
    url: '/baseData/lossSetting/baseDyeAttach/add',
    method: 'post',
    data
  })
}
// 列表 编辑
export function modify(data) {
  return request({
    url: '/baseData/lossSetting/baseDyeAttach/modify',
    method: 'post',
    data
  })
}

// 启用禁用
export function isEnable(data) {
  return request({
    url: '/baseData/lossSetting/baseDyeAttach/status',
    method: 'post',
    data
  })
}
// 删除
export function del(data) {
  return request({
    url: '/baseData/lossSetting/baseDyeAttach/delete',
    method: 'post',
    data
  })
}
// 编辑--查看
export function detail(data) {
  return request({
    url: '/baseData/lossSetting/baseDyeAttach/info',
    method: 'post',
    data
  })
}

// 染整工艺下拉
export function sysSelectlevel(data) {
  return request({
    url: '/basis/api/requirementsDye/option',
    method: 'post',
    data
  })
}

