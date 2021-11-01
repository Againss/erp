import request from '@/utils/request'
// import { pagingConfig } from '@/utils/public'
/* 列表 */
export const getApplicationSupplierData = (params = {}) => {
  let pageNum = 1; let pageSize = 20
  if (params.hasOwnProperty('pageNum')) {
    pageNum = params.pageNum
  }
  if (params.hasOwnProperty('pageSize')) {
    pageSize = params.pageSize
  }
  return request({
    method: 'post',
    url: '/srm/supplier/page',
    data: {
      ...params,
      pageNum,
      pageSize
    }
  })
}

/* 导出供应商列表 */
export const exportSupplierData = (params) => {
  return request({
    method: 'post',
    url: '/srm/supplier/export',
    data: params,
    responseType: 'arraybuffer'
  })
}
/* 导出供应商-印花列表 */
export const exportSupplierPrinting = (params) => {
  return request({
    method: 'post',
    url: '/srm/supplierPrinting/export',
    data: params,
    responseType: 'arraybuffer'
  })
}
/* 导出供应商-染整-列表 */
export const exportDyeing = (params = {}, url) => {
  return request({
    method: 'post',
    url: `/srm/${url}/export`,
    data: params,
    responseType: 'arraybuffer'
  })
}

/* 供应商-针织类型 导入模版 */
export const supplierKnitImportExcel = (params) => {
  return request({
    method: 'post',
    url: '/supplierKnit/import/excel',
    data: params,
    responseType: 'arraybuffer'
  })
}

/* 新增供应商 */
export const insertSupplierData = (params) => {
  return request({
    method: 'post',
    url: '/srm/supplier/add',
    data: params
  })
}

/* 修改供应商 */
export const updateSupplierData = (params) => {
  return request({
    method: 'post',
    url: '/srm/supplier/modify',
    data: params
  })
}
/* 禁用/启用供应商 */
export const enabledSupplierData = (params) => {
  return request({
    method: 'post',
    url: '/srm/supplier/enabled',
    data: params
  })
}
/* 查询供应商详情 */
export const getSupplierInfoByIdData = id => {
  return request({
    method: 'post',
    url: '/srm/supplier/info',
    data: { id }
  })
}
/* 上传考核 */
export const uploadSupplierData = (params) => {
  return request({
    method: 'post',
    url: '/srm/supplier/upload/audit',
    data: params
  })
}

/* 根据分数算出考核等级和结果 */
export const getRankByScoreData = (params) => {
  return request({
    method: 'post',
    url: '/srm/supplier/score/rank',
    data: params
  })
}

/* 删除供应商 */
export const deleteSupplierData = (params) => {
  return request({
    method: 'post',
    url: '/srm/supplier/delete',
    data: params
  })
}

/* 评估保存供应商 */
export const judgmentSupplierData = (params) => {
  return request({
    method: 'post',
    url: '/srm/supplier/judgment',
    data: params
  })
}

/* 提交评估表 */
export const submitSupplierData = (params) => {
  return request({
    method: 'post',
    url: '/srm/supplier/judgment/submit',
    data: params
  })
}

/* 查询供应商评估内容 */
export const judgmentSupplierInfoData = (params) => {
  return request({
    method: 'post',
    url: '/srm/supplier/judgment/info',
    data: params
  })
}

/* 审核供应商 */
export const judgmentAuditSupplierData = (params) => {
  return request({
    method: 'post',
    url: '/srm/supplier/audit',
    data: params
  })
}

/* 启用 */
export const startApplicationSupplierData = (params) => {
  return request({
    method: 'post',
    url: '/srm/supplier/enabled',
    data: params
  })
}

/* 查看考核表详细信息 */
export const getUploadAssessmentInfoData = (params) => {
  return request({
    method: 'post',
    url: '/srm/supplier/upload/audit/info?=' + Math.random(),
    data: params
  })
}

// 获取综合评估评分
export const srmRankAssessList = (params = {}) => {
  return request({
    method: 'post',
    url: '/srm/rankAssess/list',
    data: params
  })
}

// 评估保存供应商
export const srmSupplierJudgment = (params) => {
  return request({
    method: 'post',
    url: '/srm/supplier/judgment',
    data: params
  })
}

// 提交评估表
export const srmSupplierJudgmentSubmit = (params) => {
  return request({
    method: 'post',
    url: '/srm/supplier/judgment/submit',
    data: params
  })
}

// 根据分数算出考核等级和结果
export const srmSupplierScoreRank = (params) => {
  return request({
    method: 'post',
    url: '/srm/supplier/score/rank',
    data: params
  })
}

// 上传考核
export const srmSupplierUploadAudit = (params) => {
  return request({
    method: 'post',
    url: '/srm/supplier/upload/audit',
    data: params
  })
}

// 导出供应商
export const srmSupplierExport = (params) => {
  return request({
    method: 'post',
    url: '/srm/supplier/export',
    data: params,
    responseType: 'arraybuffer'
  })
}

// 导出模板
export function fileDownload(url, data) {
  return request({
    url,
    method: 'get',
    responseType: 'arraybuffer',
    params: data
  })
}

// 获取下拉数据
// 工艺要求》印花
export async function getYinHua(data = {}) {
  const res = (await request({
    url: 'basis/api/requirementsPrinting/index',
    method: 'post',
    data
  })).data || []
  return res.map(e => ({
    value: e.id,
    label: e.name
  }))
}

// 品牌 SRM基础数据》设备品牌》设备类型为印花且启用状态的品牌名称
export async function getPinPai(data = {}) {
  const res = (await request({
    url: '/srm/equipmentBrand/list',
    method: 'post',
    data
  })).data || []
  return res.filter(item => item.status || item).map(e => ({
    value: e.id,
    equipmentType: e.equipmentType,
    label: e.brandName
  }))
}

// 证件 SRM基础数据》证件
export async function getCard(data = {}) {
  const res = (await request({
    url: '/srm/supplierCertdential/list',
    method: 'post',
    data
  })).data || []
  return res.map(e => ({
    value: e.certdentialName,
    label: e.certdentialName,
    documentId: e.id
  }))
}

// 织机种类 基础数据》生产工艺》织机
export async function getZhiJi(data = {}) {
  const res = (await request({
    url: 'basis/openapi/loomCircular/search',
    method: 'post',
    data
  })).data || []
  return res.map(e => ({
    value: e.id,
    label: e.name
  }))
}

// 根据设备id查针织分页列表（织加工，增删改单独处理）
export const supplierKnitList = (params = {}) => {
  const pageNum = params.pageNum || 1; const pageSize = params.pageSize || 20
  return request({
    method: 'post',
    url: '/srm/supplierKnit/page',
    data: {
      ...params,
      pageNum,
      pageSize
    }
  })
}

// 供应商-新增织加工
export const supplierKnitAdd = (params) => {
  return request({
    method: 'post',
    url: '/srm/supplierKnit/add',
    data: params
  })
}
/* 获取供应商-根据id织加工详情 */
export const supplierKnitInfo = (params) => {
  return request({
    method: 'post',
    url: '/srm/supplierKnit/info',
    data: params
  })
}
/* 修改供应商-织加工 */
export const supplierKnitUpdate = (params) => {
  return request({
    method: 'post',
    url: '/srm/supplierKnit/modify',
    data: params
  })
}
/* 删除供应商-织加工 */
export const supplierKnitDelete = (params) => {
  return request({
    method: 'post',
    url: '/srm/supplierKnit/delete',
    data: params
  })
}

export const suppliersInfoSubmit = (url, params) => {
  return request({
    method: 'post',
    url: '/srm' + url,
    data: params
  })
}

// 设备信息列表
export const suppliersSetting = (url, params) => {
  return request({
    method: 'post',
    url: '/srm' + url,
    data: params
  })
}

// 往来记录
export const comeAndGoPage = (params = {}) => {
  return request({
    method: 'post',
    url: '/srm',
    data: params
  })
}

// 往来记录详情
export const comeAndGoInfo = (params = {}) => {
  return request({
    method: 'post',
    url: '/srm/supplier/supplierCommunicationRecord/info',
    data: params
  })
}

// 往来记录新增
export const comeAndGoAdd = (params = {}) => {
  return request({
    method: 'post',
    url: '/srm/supplier/supplierCommunicationRecord/add',
    data: params
  })
}

// 往来记录编辑
export const comeAndGoEdit = (params = {}) => {
  return request({
    method: 'post',
    url: '/srm/supplier/supplierCommunicationRecord/modify',
    data: params
  })
}

// 往来记录附件下载
export const dewnLoadFile = id => {
  return request({
    method: 'get',
    url: '/common/file/download/' + id,
    responseType: 'arraybuffer'
  })
}

// 账号管理
export const accountPage = supplierId => {
  return request({
    method: 'post',
    url: '/srm/user/supplierUserlist',
    data: { supplierId }
  })
}

// 账号管理 重置密码
export const accountReset = id => {
  return request({
    method: 'post',
    url: '/srm/user/resetPassword',
    data: { id }
  })
}

// 账号管理 账号新增
export const addUser = (data = {}) => {
  return request({
    method: 'post',
    url: '/srm/user/supplierUser/add',
    data
  })
}

// 账号管理禁用/启用
export const accountDisable = data => {
  return request({
    method: 'post',
    url: '/srm/user/updateUserState',
    data
  })
}

// 基础数据接口
/* 付款方式列表 */
export const getPaymentData = (params = {}) => {
  return request({
    method: 'post',
    url: '/srm/payMode/list',
    data: params
  })
}

// 获取省市区信息
export function openapiAreaSearch(data = {}) {
  return request({
    url: '/basis/openapi/area/search',
    method: 'post',
    data
  })
}

/* 考核周期列表 */
export const getPublicCycleData = (params = {}) => {
  return request({
    method: 'post',
    url: '/srm/assessmentPeriod/list',
    data: params
  })
}

/* 获取供应商类型列表 */
export const getSupplierTypeListData = (params = {}) => {
  return request({
    method: 'post',
    url: '/srm/supplierType/list',
    data: params
  })
}
/* 获取证件名称 */
export const getSupplierCertdential = (params = {}) => {
  return request({
    method: 'post',
    url: '/srm/supplierCertdential/name',
    data: params
  })
}
/* 设备类型，设备名称 */
export const getDeviceTypeList = (params = {}) => {
  return request({
    method: 'post',
    url: '/srm/supplier/deviceTypeList',
    data: params
  })
}

// 审批流程
// 撤回
export function revoke(params) {
  return request({
    url: '/srm/supplier/revoke/' + params,
    method: 'post'
  })
}
