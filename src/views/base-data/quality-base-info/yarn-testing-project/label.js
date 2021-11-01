
export default {
  code: '序号',
  name: '中文名',
  nameEn: '英文名',
  unit: '单位',
  orders: '顺序',
  isEnabled: '启用/禁用',
  revision: '版本号乐观锁',
  // common
  remarks: '备注',
  createdBy: '创建人',
  createdTime: '创建时间',
  updatedBy: '操作人',
  updatedTime: '操作时间',
  status: '状态', // N未审核Y已审核
  placeholder: {
    name: '中文名/英文名',
    isEnabled: '请选择',
    remark: '请输入'
  },
  validator: {
    name: '长度在 20 个字符以内',
    shortName: '简称必须为2个字母'
  },
  dict: {
    UNITS: [{ value: '1', label: '轻微/明显/严重' }, { value: '2', label: '次' }, { value: '3', label: '个' }]
  }
}

