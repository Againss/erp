
// 印花列表查询
export default {
  code: '序号',
  weightRange: '重量范围',
  part: '部位',
  color: '颜色',
  fixWastage: '固定损耗',
  subWastage: '附加损耗',
  status: '状态',
  weightIni: '重量开始',
  weightEnd: '重量结束',
  createdBy: '操作人',
  updatedTime: '操作时间',
  validator: {
    name: '长度在 20 个字符以内',
    shortName: '简称必须为2个字母'
  },
  dict: {
    PORTS: [{ value: '衫身', label: '衫身' }, { value: '下栏', label: '下栏' }, { value: '领', label: '领' }],
    COLORS: [{ value: '深', label: '深' }, { value: '中', label: '中' }, { value: '浅', label: '浅' }, { value: '白', label: '白' }]
  }
}

