
// 印花列表查询
export default {
  code: '序号',
  taskNo: '任务编号',
  orderType: '订单类型',
  productOrderNo: '生产单号',
  dyelotNo: '缸号',
  factoryName: '印染厂',
  fabricType: '布类',
  customerColor: '客户颜色',
  yaoqiuguige: '要求规格',
  standardMoisture: '标准含潮率',
  totalWeight: '总疋/总重（投坯',
  totalWidth: '总疋/总重（成品）',
  placeholder: {
  },
  validator: {
  },
  dict: {
    STATUS: [ // 0：待处理，1：处理中，2：待审核，3：已处理，4：已取消
      { value: -1, label: '全部', color: '#00BCC5', count: 0 },
      { value: 0, label: '待处理', color: '#FF9214', count: 0 },
      { value: 1, label: '处理中', color: '#FF9214', count: 0 },
      { value: 2, label: '审核中', color: '#FF9214', count: 0 },
      { value: 3, label: '已处理', color: '#00BCC5', count: 0 }
    ],
    UNITS: [
      { value: 1, label: '"' },
      { value: 2, label: 'CM' }
    ],
    ORDER_TYPES: [
      { value: 1, label: '大货' },
      { value: 2, label: '样板' }
    ]
  },
  /**
   * 通过key获取label名称
   * @param arr 列表数据源
   * @param key key值
   * @returns {*}
   */
  getLabelByKey(arr = [], key = '') {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].value === key) {
        return arr[i].label
      }
    }
  },
  /**
   * 通过key获取color
   * @param arr 列表数据源
   * @param key key值
   * @returns {*}
   */
  getColorByKey(arr = [], key = '') {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].value === key) {
        return arr[i].color
      }
    }
  }
}

