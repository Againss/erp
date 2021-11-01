
// 印花列表查询
export default {
  code: '序号',
  reqPrintInfo: '印花工艺', // object
  weightRange: '数量',
  weightIni: '重量开始', // integer
  weightEnd: '重量结束', // integer
  wastage: '损耗', // number
  shearWastage: '附加损耗', // number
  createdBy: '操作人',
  updatedTime: '操作时间',
  status: '状态',
  validator: {
    name: '长度在 20 个字符以内',
    shortName: '简称必须为2个字母'
  }
}

