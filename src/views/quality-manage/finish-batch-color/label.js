
// 印花列表查询
export default {
  code: '序号',
  pisebianhao: '批色编号',
  dyelotNo: '缸号',
  currentProgress: '当前进度',
  produceOrder: '生产订单',
  orderType: '订单类型',
  isHeadBatch: '是否头缸',
  productNo: '产品编码',
  fabricType: '布类',
  chengpinguige: '成品规格',
  customerColor: '客户颜色',
  factoryName: '染印厂',
  customerName: '客户',
  brandName: '品牌商',
  schedulingVolumes: '投坯卷数',
  schedulingQty: '投坯数量',
  colorMatchingName: '对色方式',
  colorData: '对色资料',
  bodyAndBottom: '衫身和下栏',
  rangeName: '公差',
  bdFirstLightName: '1st对色光源',
  twondLightSourceName: '2nd对色光源',
  threerdLightSourceName: '3rd对色光源',
  headCylinder: '衫身头缸',
  bottomCulinder: '下栏头缸',
  cylinderDifference: '缸差',
  pitch: '匹差',
  createTime: '创建时间',
  batchColor: '批色员',
  gendanyuan: '跟单员',
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
    IS_HEAD_BATCH: [
      { value: 0, label: '否' },
      { value: 1, label: '是' }
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
      if ((arr[i].value + '') === (key + '')) {
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
      if ((arr[i].value + '') === (key + '')) {
        return arr[i].color
      }
    }
  }
}

