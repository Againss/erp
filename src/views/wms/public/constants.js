/* 系统级常量 */
// 货物类型(1-布，2-纱)
export const PRODUCT_TYPE = [
  { label: '全部', value: '' },
  { label: '布', value: 1 },
  { label: '纱', value: 2 },
]
// 出库类型(1-销售，2-领料，3-调拨，4-盘亏，5-其他)
export const STOCK_TYPE = [
  { label: '销售出库', value: 1 },
  { label: '领料出库', value: 2 },
  { label: '调拨出库', value: 3 },
  { label: '盘亏出库', value: 4 },
  { label: '其他出库', value: 5 },
  { label: '剪版出库', value: 6 },
]

/* 入库类型(全部-'', 1-采购，2-生产，3-调拨，4-退货，5-盘盈，6-其他) */
export const BOOKING_STORAGE_TYPE_LIST = [
    {
        label: '全部',
        value: ''
    },
    {
        label: '采购入库',
        value: 1
    },
    {
        label: '生产入库',
        value: 2
    },
    {
        label: '调拨入库',
        value: 3
    },
    {
        label: '退货入库',
        value: 4
    },
    {
        label: '盘盈入库',
        value: 5
    },
    {
        label: '其他入库',
        value: 6
    }
]
/* 货物类型 */
export const BOOKING_TYPE_OF_GOODS = [
    {
        label: '全部',
        value: ''
    },
    {
        label: '布',
        value: 1
    },
    {
        label: '纱',
        value: 2
    }
]

/* 整/散件 */
export const BOOKING_BULK_FULL_LIST = [
  {
    label: "散件",
    value: 0
  },
  {
    label: '整件',
    value: 1
  }
]

// 出库管理状态
// 0:已出库,1:待拣货,2:已拣货
export const OUT_STATUS = ['已出库', '待拣货', '已拣货']
//库存-锁定方式
// 1.锁货物,ids不能为空;2.锁货架,shelfCodes不能为空;3.锁库位
export const LOCK_TYPE = [
  {
    label: "按货物锁定",
    value: 1
  },
  {
    label: '按货架锁定',
    value: 2
  },
  {
    label: '按库位锁定',
    value: 3
  }
]
//库存-解锁方式
// 1.锁货物,ids不能为空;2.锁货架,shelfCodes不能为空;3.锁库位
export const UNLOCK_TYPE = [
  {
    label: "按货物解锁",
    value: 1
  },
  {
    label: '按货架解锁',
    value: 2
  },
  {
    label: '按库位解锁',
    value: 3
  }
]
//产品分类 0101:天然纤维 0102:化学纤维 0103:组合纱线   0201:坯布 0202:色布 0203:组合布 0204:花布
export const MATERIEL_TYPE = [
  {
    label: '天然纤维',
    value: '0101'
  },
  {
    label: '化学纤维',
    value: '0102'
  },
  {
    label: '组合纱线',
    value: '0103'
  },
  {
    label: '坯布',
    value: '0201'
  },
  {
    label: '色布',
    value: '0202'
  },
  {
    label: '组合布',
    value: '0203'
  },
  {
    label: '花布',
    value: '0204'
  }
]
