
// 印花列表查询
export default {
  code: '序号',
  printDyeTypeInfo: '印染类型',
  techInfo: '染整工艺',
  color: '颜色',
  isBlack: '是否黑色',
  tc: 'T/C',
  cvc: 'CVC',
  cotton: '棉',
  cottonViscose: '人棉/黏胶',
  pureChemical: '纯化纤长丝',
  subWastage: '附加损耗',
  createdBy: '操作人',
  updatedTime: '操作时间',
  status: '状态',
  validator: {
    name: '长度在 20 个字符以内',
    shortName: '简称必须为2个字母'
  },
  dict: {
    COLORS: [{ value: '深', label: '深' }, { value: '中', label: '中' }, { value: '浅', label: '浅' }, { value: '白', label: '白' }, { value: '无', label: '无' }],
    IS_BLACKS: [{ value: '1', label: '是' }, { value: '0', label: '否' }]
  }
}

