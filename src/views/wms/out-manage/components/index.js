import { parseTime } from '@/utils/index'
// 1--布  2--纱
export const detail_1 = [
  {
    prop: 'locationName',
    label: '拣货库位号',
    width: 140,
    showOverflowTooltip: true
  },
  {
    prop: 'serialSubNo',
    label: '条形码',
    width: 160,
    showOverflowTooltip: true
  },
  {
    prop: 'batchNo',
    label: '批次号',
    showOverflowTooltip: true
  },
  {
    prop: 'materiel',
    label: '产品编码',
    showOverflowTooltip: true
  },
  {
    prop: 'dyelot',
    label: '缸号',
    showOverflowTooltip: true
  },
  {
    prop: 'sellerTeamName',
    label: '销售组织',
    showOverflowTooltip: true
  },
  {
    prop: 'pickCompleteTime',
    label: '拣货时间',
    formater: (scope) => {
      if (scope.row.pickCompleteTime) {
        return parseTime(scope.row.pickCompleteTime)
      }
    },
    showOverflowTooltip: true,
    width: 180
  },
  {
    prop: 'weightOutFact',
    label: '重量(KG)',
    showOverflowTooltip: true
  }
]
export const detail_2 = [
  {
    prop: 'locationName',
    label: '拣货库位号',
    width: 140,
    showOverflowTooltip: true
  },
  {
    prop: 'serialSubNo',
    label: '条形码',
    width: 160,
    showOverflowTooltip: true
  },
  {
    prop: 'batchNo',
    label: '批次号',
    showOverflowTooltip: true
  },
  {
    prop: 'materiel',
    label: '产品编码',
    showOverflowTooltip: true
  },
  {
    prop: 'dyelot',
    label: '纱牌/纱批',
    showOverflowTooltip: true
  },
  {
    prop: 'dyelot',
    label: '缸号',
    showOverflowTooltip: true
  },
  {
    prop: 'sellerTeamName',
    label: '销售组织',
    showOverflowTooltip: true
  },
  {
    prop: 'pickCompleteTime',
    label: '拣货时间',
    formater: (scope) => {
      if (scope.row.pickCompleteTime) {
        return parseTime(scope.row.pickCompleteTime)
      }
    },
    showOverflowTooltip: true,
    width: 180
  },
  {
    prop: 'weightOutFact',
    label: '重量(KG)',
    showOverflowTooltip: true
  },
  {
    prop: 'ballCountFact',
    label: '球数',
    showOverflowTooltip: true
  }
]
