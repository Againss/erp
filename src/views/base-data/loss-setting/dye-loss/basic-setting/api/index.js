
import request from '@/utils/request'
// 列表查询
export function list(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/baseData/lossSetting/baseDyeBasic/list',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}
// 按钮新增
export function add(data) {
  return request({
    url: '/baseData/lossSetting/baseDyeBasic/add',
    method: 'post',
    data
  })
}
// 列表 编辑
export function modify(data) {
  return request({
    url: '/baseData/lossSetting/baseDyeBasic/modify',
    method: 'post',
    data
  })
}

// 启用禁用
export function isEnable(data) {
  return request({
    url: '/baseData/lossSetting/baseDyeBasic/status',
    method: 'post',
    data
  })
}
// 删除
export function del(data) {
  return request({
    url: '/baseData/lossSetting/baseDyeBasic/delete',
    method: 'post',
    data
  })
}
// 编辑--查看
export function detail(data) {
  return request({
    url: '/baseData/lossSetting/baseDyeBasic/info',
    method: 'post',
    data
  })
}

// 列表数据
export function sysDataGroupSelect(data = {}) {
  return request({
    url: '/basis/api/printingDyeingType/index',
    method: 'post',
    data: data
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
