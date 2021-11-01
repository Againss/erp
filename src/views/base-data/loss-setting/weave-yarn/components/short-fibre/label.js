
// 印花列表查询
export default {
  code: '序号',
  elementInfo: '成份',
  wastage: '损耗',
  weightRange: '数量范围',
  weightIni: '重量开始',
  weightEnd: '重量结束',
  isPreciseFlow: '是否精梳', // 是否精梳(0-非精流,1-精流)
  type: '纤维类型', // 纤维类型(0-短纤,1-长丝)
  status: '状态', // 状态(Ｎ-禁用,Ｙ-启用)
  validator: {
    name: '长度在 20 个字符以内',
    shortName: '简称必须为2个字母'
  }
}

