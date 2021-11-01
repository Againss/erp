
// 印花列表查询
export default {
  // 寄件要求
  expressCompany: '快递公司', // object
  payMethod: '付费方式', // integer （1=寄付，2=到付）
  addressee: '收件人', // string
  receiverTel: '收件人电话', // string
  receiverCompany: '收件公司', // object
  receiverAddress: '收件地址', // string
  tagLanguage: '标签语言', // integer （1=中文，2=英文）
  deliveryTime: '要求寄出时间', // integer
  receiver: '接收人', // object
  departmentName: '所在部门', // string
  cancelReason: '取消原因', // string
  status: '状态', // integer 状态（0=草稿，1=待审核，2=已驳回，3=进行中，4=已取消，5=已完结）
  // 剪样要求
  productCode: '产品编码', // string
  yarnInfo: '纱线信息', // string
  productInfo: '产品信息', // string
  sourceNumber: '来源单号', // string
  cylinderNumber: '缸号', // string
  barcode: '条码号', // string
  storageLocation: '库位', // string
  availableQuantity: '可用数量(KG)', // number
  sellerTeam: '销售团队', // object
  cutClothQuantity: '剪布数量/单位', // number
  auxiliaryQuantity: '辅助数量(KG)', // number
  unit: '单位', // object
  cutSampleRequirements: '剪板要求', // string
  expressNumber: '快递单号', // string
  comment: '评语', // string
  // 产品编码
  cloth: '布类',
  element: '成份',
  suggestWidth: '成品幅宽',
  suggestWeight: '成品克重',
  customerColor: '客户颜色',
  //
  code: '序号',
  placeholder: {
    cloth: '请选择',
    element: '请选择',
    suggestWidth: '请输入成品幅宽',
    suggestWeight: '请输入成品克重',
    customerColor: '请输入客户颜色',
    productCode: '请输入产品编码', // string
    yarnInfo: '请输入纱线信息', // string
    productInfo: '请输入产品信息', // string
    sourceNumber: '请输入来源单号', // string
    cylinderNumber: '请输入缸号', // string
    barcode: '请输入条码号', // string
    storageLocation: '请输入库位', // string
    availableQuantity: '请输入可用数量', // number
    sellerTeam: '销售团队', // object
    cutClothQuantity: '剪布数量', // number
    auxiliaryQuantity: '请输入辅助数量', // number
    unit: '单位', // object
    cutSampleRequirements: '请输入剪板要求' // string
  },
  validator: {
    cloth: '布类',
    element: '成份',
    suggestWidth: '成品幅宽',
    suggestWeight: '成品克重',
    customerColor: '客户颜色',
    productCode: '产品编码', // string
    yarnInfo: '纱线信息', // string
    productInfo: '产品信息', // string
    sourceNumber: '来源单号', // string
    cylinderNumber: '缸号', // string
    barcode: '条码号', // string
    storageLocation: '库位', // string
    availableQuantity: '可用数量(KG)', // number
    sellerTeam: '销售团队', // object
    cutClothQuantity: '剪布数量', // number
    auxiliaryQuantity: '辅助数量(KG)', // number
    unit: '单位', // object
    cutSampleRequirements: '剪板要求' // string
  },
  dict: {
    UNITS: [{ value: '91d3ff8e715fa016d6fed48774b53059', label: '千克' }, { value: 'a83b0f4c085686cde78188aede846441', label: '磅' }],
    PAY_METHODS: [{ value: 1, label: '寄付' }, { value: 2, label: '到付' }]
  }
}

