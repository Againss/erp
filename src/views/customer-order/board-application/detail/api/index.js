import request from '@/utils/request'

// 新增
export function orderAdd(data = {}) {
  return request({
    url: '/customerOrder/spCutSampleApply/add',
    method: 'post',
    data: { ...data }
  })
}

// 修改
export function orderModify(data = {}) {
  return request({
    url: '/customerOrder/spCutSampleApply/modify',
    method: 'post',
    data: { ...data }
  })
}

// 变更
export function orderChange(data = {}) {
  return request({
    url: '/customerOrder/spCutSampleApply/change',
    method: 'post',
    data: { ...data }
  })
}

// 删除
export function orderDelete(data = {}) {
  return request({
    url: '/customerOrder/spCutSampleApply/delete',
    method: 'post',
    data: { ...data }
  })
}

// 提交
export function orderSubmit(data = {}) {
  return request({
    url: '/customerOrder/spCutSampleApply/submit',
    method: 'post',
    data: { ...data }
  })
}

// 撤回
export function orderWithdrawt(data = {}) {
  return request({
    url: '/customerOrder/spCutSampleApply/withdraw',
    method: 'post',
    data: { ...data }
  })
}

// 取消
export function orderCancel(data = {}) {
  return request({
    url: '/customerOrder/spCutSampleApply/cancel',
    method: 'post',
    data: { ...data }
  })
}

// 待审回调
export function orderAuditFallBack(data = {}) {
  return request({
    url: '/customerOrder/spCutSampleApply/fallback/auditFallBack',
    method: 'post',
    data: { ...data }
  })
}

// hold单
export function orderHold(data = {}) {
  return request({
    url: '/customerOrder/spCutSampleApply/hold',
    method: 'post',
    data: { ...data }
  })
}

// 解hold
export function orderRemoveHold(data = {}) {
  return request({
    url: '/customerOrder/spCutSampleApply/removeHold',
    method: 'post',
    data: { ...data }
  })
}

// 完结
export function orderFinish(data = {}) {
  return request({
    url: '/customerOrder/spCutSampleApply/finish',
    method: 'post',
    data: { ...data }
  })
}

// 详情信息
export function getDetail(data = {}) {
  return request({
    url: '/customerOrder/spCutSampleApply/info',
    method: 'post',
    data: { ...data }
  })
}

// 需求列表详情
export function guestneedDetail(data = {}) {
  return request({
    url: '/customerOrder/spCutSampleApply/detail',
    method: 'post',
    data: { ...data }
  })
}

// 剪样要求分页对接接口
export function pageRequirements(data = {}) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  // const params = Object.assign({}, defaultParams, data)
  // return new Promise(function(resolve, reject) {
  //   const list = []
  //   const total = 145
  //   const ii = (params.pageNum - 1) * (params.pageSize || 20) || 0
  //   for (let i = 0; i < total; i++) {
  //     list.push({
  //       productCode: `JSPCOE001F01-0${i + 1}`, // string
  //       yarnInfo: '32s/1 棉 100, 75D/36F 氨纶', // string
  //       productInfo: '色布，净色弹力平纹, CVC 60/40，68CM-220g/㎡, 宝蓝色', // string
  //       productInfoJson: '{}',
  //       sourceNumber: `QS20080001-V${i + 1}`, // string
  //       cylinderNumber: `WS21012900${i + 1}`, // string
  //       barcode: `2103180004_000${i + 1}`, // string
  //       storageLocation: 'B-33-12-22', // string
  //       availableQuantity: 50 + i * 5, // number
  //       sellerTeam: { value: `T${i + 1}`, label: `T${i + 1}` }, // object
  //       // cutClothQuantity: 10 + i * 10, // number
  //       // auxiliaryQuantity: 100 + i * 10, // number
  //       // unit: { value: '91d3ff8e715fa016d6fed48774b53059', label: '千克' },
  //       // cutSampleRequirements: '剪板要求', // string
  //       // 产品编码
  //       cloth: {
  //         label: '布类1',
  //         value: '1'
  //       },
  //       clothNameEn: '布类名称-英文',
  //       element: {
  //         label: '成份名称',
  //         value: '1'
  //       },
  //       suggestWidth: '100',
  //       suggestWidthUnit: 'CM', // 成品幅宽单位{固定选项："CM}
  //       suggestWeight: '121', // 成品克重
  //       suggestWeightUnit: 'g/㎡', // 成品克重单位{固定选项："g/㎡}
  //       customerColor: '客户颜色',
  //       yarnInfoInfos: [
  //         {
  //           type: '0', // 类型{0=天然纤维,1=化学纤维,2=组合纱线}
  //           naturalFiber: [
  //             {
  //               yarn: {
  //                 label: '纱支名称',
  //                 value: '1'
  //               },
  //               element: {
  //                 label: '成份名称',
  //                 value: '1'
  //               },
  //               elementNameEn: '成分名称-英文',
  //               elementType: '1', // 类型1普通２组合
  //               elementRatio: '比例'
  //             }
  //           ],
  //           chemicalFiber: []
  //         }
  //       ],
  //       productInfoInfo: {
  //         materialType: '0101', // 物料类型,0101:天然纤维0102:化学纤维0103:组合纱线,0201:坯布0202:色布0203:组合布0204:花布
  //         cloth: {
  //           label: '布类1',
  //           value: '1'
  //         },
  //         clothNameEn: '布类名称-英文',
  //         element: {
  //           label: '成份名称',
  //           value: '1'
  //         },
  //         elementNameEn: '成份名称-英文',
  //         suggestWidth: `10${i}`,
  //         suggestWidthUnit: 'CM', // 成品幅宽单位{固定选项："CM}
  //         suggestWeight: `12${i}`, // 成品克重
  //         suggestWeightUnit: 'g/㎡' // 成品克重单位{固定选项："g/㎡}
  //       },
  //       expressNumber: '',
  //       comment: '',
  //       status: 0, // 待剪布
  //       yarnInfoJson: '{}',
  //       materialType: '0101' // 0101:天然纤维 0102:化学纤维 0103:组合纱线  0201:坯布 0202:色布 0203:组合布 0204:花布
  //     })
  //   }
  //   resolve({
  //     code: 200,
  //     message: '成功',
  //     data: {
  //       list: list.slice(ii, params.pageNum * params.pageSize),
  //       total: total,
  //       pageSize: params.pageSize || 20,
  //       pageNum: params.pageNum || 1
  //     }
  //   })
  // })
  return request({
    url: '/customerOrder/spCutSampleApply/pageRequirements',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 添加/修改快递单号
export function modifyExpressNumber(data = {}) {
  return request({
    url: '/customerOrder/spCutSampleApply/modifyExpressNumber',
    method: 'post',
    data: data
  })
}

// 添加/修改评语
export function modifyComment(data = {}) {
  return request({
    url: '/customerOrder/spCutSampleApply/modifyComment',
    method: 'post',
    data: data
  })
}

// 随机生成指定范围内的数
// function getRandom(min, max) { // 5 11
//   return Math.floor(Math.random() * (max - min + 1)) + min
// }

// 快递流程
export function expressProgress(data = {}) {
  // const states = [0, 1, 2, 3, 4, 5, 6, 7, 10, 11, 12, 13, 14]
  // return new Promise(function(resolve, reject) {
  //   resolve({
  //     code: 200,
  //     message: '成功',
  //     data: {
  //       state: states[getRandom(0, 12)],
  //       expressProgressResps: [
  //         {
  //           ftime: '2020-05-20',
  //           context: '内容',
  //           time: '时间，原始格式'
  //         },
  //         {
  //           ftime: '2020-05-21',
  //           context: '内容2',
  //           time: '时间，原始格式2'
  //         },
  //         {
  //           ftime: '2020-05-22',
  //           context: '内容3',
  //           time: '时间，原始格式3'
  //         },
  //         {
  //           ftime: '2020-05-23',
  //           context: '内容4',
  //           time: '时间，原始格式4'
  //         }
  //       ]
  //     }
  //   })
  // })
  return request({
    url: '/customerOrder/spCutSampleApply/expressProgress',
    method: 'post',
    data: data
  })
}

/* 选项配置下拉 */
export function optionConfigSelect(data) {
  return request({
    // url: '/baseData/optionConfig/list',
    url: '/basis/api/optionConfig/option',
    method: 'post',
    data: data
  })
}

/* 收件公司下拉 */
export function receiverCompanySelect(data) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/crm/customer/list',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

/* 省市区-详情 */
export function areaInfo(data) {
  return request({
    url: '/basis/openapi/area/detail',
    method: 'post',
    data: data
  })
}

/* 接收人下拉 */
export function sysUserSelect(data) {
  const defaultParams = { pageNum: 1, pageSize: 20 }
  return request({
    url: '/userCenter/sysUser/list',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

/* 单位下拉 */
export function unitSelect(data) {
  const defaultParams = { enabled: 'Y', typical: '长度,重量' } // 类型为重量和长度的单位类型
  return request({
    url: 'basis/api/units/option',
    // url: '/units/option',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

/* 布类下拉 */
export function clothSelect(data) {
  const defaultParams = { categoryId: 2, enabled: 'Y' }
  return request({
    url: 'basis/api/cloths/index',
    method: 'post',
    data: { ...defaultParams, ...data }
  })
}

// 组合成分下拉--中文组合下拉
export function combinedSelect(data) {
  return request({
    url: '/basis/api/ingredients/index',
    method: 'post',
    data
  })
}

// 组合成分-下拉
export function assemblyIngredientSelect(data = {}) {
  return request({
    url: '/basis/api/assemblyIngredients/index',
    method: 'post',
    data: data
  })
}

