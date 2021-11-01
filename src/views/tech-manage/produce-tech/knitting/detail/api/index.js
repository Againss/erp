import request from '@/utils/request'
// import { filterOptions } from '@/utils/index'
// // 获取基础数据的下拉选数据
// const props = {
//   id: 'value',
//   name: 'label',
//   enabled: 'disabled',
//   enabledValue: false,
//   disabledValue: true,
//   disabledName: v => v + '(禁用)'
// }
// 获取针织工艺分页查询
export async function tmKnitTechPage(data) {
  return request({
    url: '/techManage/tmKnitTechDetail/list',
    method: 'post',
    data
  })
}
// 获取染整分录 列表查询
export async function tmDyeTechDetail(data) {
  return request({
    url: '/techManage/tmDyeTechDetail/list',
    method: 'post',
    data
  })
}
// 获取分析单详情（织造工艺）
export async function getDetail(data) {
  return request({
    url: '/techManage/tmKnitTechDetail/info',
    method: 'post',
    data
  })
}
// 获取分析单详情 （染整工艺）
export async function getRanDetail(data) {
  return request({
    url: '/techManage/tmDyeTechDetail/info',
    method: 'post',
    data
  })
}
// 提交分析状态
export function statusSubmit(data) {
  return request({
    url: '/techManage/tmKnitTech/commit',
    method: 'post',
    data: { ...data }
  })
}
// 撤回分析状态
export function statusWithdraw(data) {
  return request({
    url: '/techManage/tmKnitTech/withdraw',
    method: 'post',
    data: { ...data }
  })
}

// 获取分析单详情修改(织造工艺)
export async function detailModify(data) {
  return request({
    url: '/techManage/tmKnitTechDetail/modify',
    method: 'post',
    data
  })
}
// 获取分析单详情修改(染整工艺)
export async function detailRanModify(data) {
  return request({
    url: '/techManage/tmDyeTechDetail/modify',
    method: 'post',
    data
  })
}

// 获取批量修改 提交（织造工艺）
export async function atchBatchModify(data) {
  return request({
    url: '/techManage/tmKnitTechDetail/batchModify',
    method: 'post',
    data
  })
}
// 获取批量修改 提交(染整工艺)
export async function ranBatchModify(data) {
  return request({
    url: '/techManage/tmDyeTechDetail/batchModify',
    method: 'post',
    data
  })
}

// 获取分析单详情 提交
export async function detailSubmit(data, id) {
  return request({
    url: 'techManage/sampleAnalysisResult/submit/' + id,
    method: 'post',
    data
  })
}
// 审核回调
export async function fallbackDyeAuditFallBack(data) {
  return request({
    url: '/techManage/tmKnitTech/fallback/DyeAuditFallBack',
    method: 'post',
    data
  })
}

// 保存提交分析单详情
export async function saveSubmit(data) {
  return request({
    url: 'techManage/sampleAnalysisResult/modifyAndSubmit',
    method: 'post',
    data
  })
}

// 查询工艺状态
export async function tmKnitTechTatus(data) {
  return request({
    url: '/techManage/tmKnitTech/status',
    method: 'post',
    data
  })
}

// 获取下拉选数据
export async function getSelectData(data) {
  return request({
    url: 'basis/openapi/yarnType/search',
    method: 'post',
    data
  })
}

// 获取下拉选数据- 纱支
export async function getShazhi(data) {
  return request({
    url: 'basis/openapi/yarnType/search',
    method: 'post',
    data
  })
}

// 获取下拉选数据- 成份
export async function getIngredient(data) {
  return request({
    url: 'basis/openapi/ingredient/search',
    method: 'post',
    data
  })
}

// 获取下拉选数据- 组合成份
export async function getIngredientZh(data) {
  return request({
    url: 'basis/openapi/assemblyIngredient/search',
    method: 'post',
    data
  })
}

// 获取下拉选数据- 纱长描述
export async function getMiaoshu(data) {
  return request({
    url: 'basis/openapi/YarnLengthDescription/search',
    // url: 'basis/api/YarnLengthDescription/index',
    method: 'post',
    data
  })
}

// 获取下拉选数据- 面料大类
export async function getMianClass(data) {
  return request({
    url: 'basis/openapi/fabricCategory/search',
    method: 'post',
    data
  })
}

// 获取下拉选数据- 毛圈、毛羽
export async function getMaoMao(data) {
  return request({
    url: 'basis/openapi/finishedFabric/search',
    method: 'post',
    data
  })
}

// 获取下拉选数据- 工艺要求染整
export async function getRanZheng(data) {
  return request({
    url: 'basis/openapi/requirementDye/search',
    method: 'post',
    data
  })
}

// 获取下拉选数据- 印染类型
export async function getDeingType(data) {
  return request({
    url: 'basis/openapi/printingDyeingType/search',
    method: 'post',
    data
  })
}

// 获取下拉选数据- 布种
export async function getBuZhong(data) {
  return request({
    url: 'basis/openapi/fabrication/search',
    method: 'post',
    data
  })
}

// 获取下拉选数据- 布类
export async function getClothClass(data) {
  return request({
    url: 'basis/openapi/cloth/search',
    method: 'post',
    data
  })
}

// 获取布类详情
export async function getClothClassDetail(data) {
  return request({
    url: 'basis/openapi/cloth/detail',
    method: 'post',
    data
  })
}
// 获取织染方式-详情
export async function getKnitDyeDetail(data) {
  return request({
    url: 'basis/openapi/knitDye/detail',
    method: 'post',
    data
  })
}

// 获取下拉选数据- 织造花型、染方式
export async function getZhiRan(data) {
  return request({
    url: 'basis/openapi/fabricationProduceMode/search',
    method: 'post',
    data
  })
}

// 获取下拉选数据- 工序流程
export async function getGongXu(data) {
  return request({
    url: 'basis/openapi/processFlow/search',
    method: 'post',
    data
  })
}

// 下载附件
export async function downLoadFile(data = {}) {
  return request({
    url: '/techManage/download',
    method: 'get',
    responseType: 'arraybuffer',
    params: data
  })
}

// 审核客样分析状态
export async function statusApprove(data = {}) {
  return request({
    url: `/techManage/sampleAnalysisResult/audit`,
    method: 'post',
    data: { ...data }
  })
}

// 驳回客样分析状态
export async function statusReject(data = {}) {
  return request({
    url: `/techManage/sampleAnalysisResult/reject`,
    method: 'post',
    data: { ...data }
  })
}

// 打印预览
export async function printPreview(data) {
  return request({
    url: `/crm/pdf/generator/sample/analysis/report?sampleAnalysisApplyId=${data}`,
    method: 'get',
    responseType: 'arraybuffer'
  })
}

// 分析引用下拉
// export async function getAnalysisData(data) {
//   return request({
//     url: `/techManage/sampleAnalysisResult/idSearch`,
//     method: 'post',
//     data: { ...data }
//   })
// }

// 基础数据
// 获取下拉选数据- 干燥方式
export async function getDryingMethod(data = {}) {
  return request({
    url: 'basis/api/dryingMethod/option',
    method: 'post',
    data
  })
}

// export async function getDryingMethod(data = {}, parmas) {
//   const res = (await request({
//     url: 'basis/api/dryingMethod/option',
//     method: 'post',
//     data
//   })).data || []
//   parmas.data = res.map(e => ({
//     value: String(e.id),
//     label: e.name,
//     disabled: e.enabled === 'N'
//   }))
//   return filterOptions({ ...parmas, props })
// }

// 获取下拉选数据- 织染方式添加制造花型
export async function getDknitDye(data = {}) {
  return request({
    url: '/openapi/knitDye/search',
    method: 'post',
    data
  })
}
export async function yarnTypeSearch(data = {}) {
  return request({
    url: 'basis/api/openapi/yarnType/search',
    method: 'post',
    data
  })
}

// 获取织造工艺列表（上机工艺模块下拉选项）
export async function tmWeavingTechList(data = {}) {
  return request({
    url: '/baseData/tmWeavingTech/list',
    method: 'post',
    data
  })
}
// 获取引用工艺分页查询数量统计
export async function referenceCount(data = {}) {
  return request({
    url: '/techManage/tmKnitTechDetail/referencePageCount',
    method: 'post',
    data
  })
}
// 引用工艺分页查询
export async function referencePage(data = {}) {
  return request({
    url: '/techManage/tmKnitTechDetail/referencePage',
    method: 'post',
    data
  })
}

// 色号花号库列表
export function colorColorManagePage(data = {}) {
  return request({
    url: '/color/api/color/colorManage',
    method: 'post',
    data: { ...{ page: 1, pageSize: 20 }, ...data }
  })
}

// 针织工艺信息
export function tmKnitTechInfo(data = {}) {
  return request({
    url: '/techManage/tmKnitTech/info',
    method: 'post',
    data
  })
}
