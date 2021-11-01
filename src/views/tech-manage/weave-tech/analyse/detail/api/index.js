import request from '@/utils/request'

// 获取分析单详情
export async function getDetail(data) {
  return request({
    url: 'techManage/sampleAnalysisResult/info',
    method: 'post',
    data
  })
}

// 获取分析单详情修改
export async function detailModify(data) {
  return request({
    url: 'techManage/sampleAnalysisResult/modify',
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

// 保存提交分析单详情
export async function saveSubmit(data) {
  return request({
    url: 'techManage/sampleAnalysisResult/modifyAndSubmit',
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
export async function getAnalysisData(data) {
  return request({
    url: `/techManage/sampleAnalysisResult/idSearch`,
    method: 'post',
    data: { ...data }
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
