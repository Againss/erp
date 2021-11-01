
// 印花列表查询
export default {
  code: '序号',
  orderNo: '订单号',
  customerName: '客户名称',
  timeRange: '下单日期',
  startTime: '开始时间',
  endTime: '结束时间',
  orderNum: '订单数量(kg)',
  greyClothNum: '坯布数量(kg)',
  orderStatus: '订单状态', // string  0:待处理 1:已处理
  createdBy: '操作人',
  updatedTime: '操作时间',
  customerServiceId: '客服ID',
  customerServiceName: '客服名称',
  salesTeamName: '销售团队名',
  type: '订单类型', // string １样板订单 ２大货订单
  apsLossDetailInfoRespList: {
    productCode: '产品编码',
    clothType: '布类',
    completedNum: '成品数量(kg)',
    apsLossDetailYarnInfoRespList: {
      yarnAllName: '纱名',
      yarnAttributes: '纱属性',
      whetherDyed: '是否染色', // string 0否 1是
      yarnColor: '染纱颜色',
      colorRato: '颜色占比',
      dyedYarnLoss: '染纱损',
      knitLoss: '织损',
      completedNum: '坯纱数量'
    },
    dyedLoss: '染损',
    printLoss: '印损',
    greyClothNum: '坯布数量',
    chengpinguige: '成品规格',
    garmentPartId: '成衣部位ID',
    garmentPartName: '成衣部位',
    elementRato: '成份比例',
    colorType: '色级',
    whetherBlack: '是否黑色',
    customerColor: '客户颜色',
    produceProcess: '生产流程',
    dyeCraft: '工艺要求',
    delivery: '订单交期'
  },
  placeholder: {
    orderNo: '请输入订单号',
    customerName: '请输入客户名称',
    timeRange: ''
  },
  validator: {
    timeRange: ''
  }
}

