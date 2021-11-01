import request from '@/utils/request'
// 抽坯查询列表
export function generalYarnPage(data = {}) {
  return request({
    url: '/aps/generalYarn/list',
    method: 'post',
    data: { ...data }
  })
}
// 查看库存
export function generalYarnStore(data = {}) {
  return request({
    url: '/aps/generalYarn/check/store',
    method: 'post',
    data: { ...data }
  })
}
// 新建
export function generalYarnAdd(data = {}) {
  return request({
    url: '/aps/generalYarn/batch/add',
    method: 'post',
    data: { ...data }
  })
}
// 取消常规
export function deregulation(data = {}) {
  return request({
    url: '/aps/generalYarn/batch/delete',
    method: 'post',
    data: { ...data }
  })
}
// 编辑
export function generalYarnModify(data = {}) {
  return request({
    url: '/aps/generalYarn/modify',
    method: 'post',
    data: { ...data }
  })
}
// 生成采购
export function purchase(data = {}) {
  return request({
    url: '/aps/generalYarn/generate/purchase',
    method: 'post',
    data: { ...data }
  })
}
// 获取原料信息(通过纱线类型)
export function materialInfoPage(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/aps/generalYarn/materialInfoPage',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 获取成份下拉框
export function ingredients(data = {}) {
  return request({
    url: 'basis/api/ingredients/index',
    method: 'post',
    data: { ...data }
  })
}

// 获取梳棉方法/纺纱方法/染色适应性/纱类下拉框
export function yarnTypes(data = {}) {
  const defaultParams = { }
  return request({
    url: 'basis/api/yarnTypes/index',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

