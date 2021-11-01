<template>
  <div class="collect page-table table-detail detail">
    <cs-custom-table
      :columns="column"
      :data-source="list.bomDetailList"
      edit-type="pop"
      @header-click="headerClick"
    />
  </div>
</template>

<script>
import colHeader from './header.vue'
import { deepClone } from '@/utils'
export default {
  name: 'CollectList',
  // components: { colHeader },
  props: {
    parmas: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      columns: {
        _materiel: {
          prop: 'materiel',
          label: '纱线编码',
          // className: 'coloum-title-l',
          header: colHeader,
          headerOptions: {
            label: '纱线编码'
          },
          child: {
            _materiel: {
              width: '130',
              prop: 'materiel',
              showOverflowTooltip: true,
              label: ''
            }
          }
        },
        _materielName: {
          prop: 'materielName',
          label: '纱名',
          isShow: false,
          child: {
            _materielName: {
              prop: 'materielName',
              minWidth: '190',
              showOverflowTooltip: true,
              formater: scope => scope.row.materielInfo && scope.row.materielInfo.materielName || ''
            }
          }
        },
        _materielProperty: {
          prop: 'materielProperty',
          label: '纱属性',
          isShow: false,
          child: {
            _rmbUnitPrice: {
              prop: 'materielProperty',
              minWidth: '160',
              showOverflowTooltip: true,
              formater: scope => scope.row.materielInfo && scope.row.materielInfo.materielProperty || ''
            }
          }
        },
        _demandWeight: {
          prop: 'demandWeight',
          label: '需求数量（KG）',
          isShow: false,
          child: {
            _demandWeight: {
              prop: 'demandWeight',
              minWidth: '130'
            }
          }
        },
        _expectedDate: {
          prop: 'expectedDate',
          label: '期望交期',
          isShow: false,
          child: {
            _expectedDate: {
              prop: 'expectedDate',
              minWidth: '110',
              formater: scope => scope.row.expectedDate && this.$utils.parseTime(scope.row.expectedDate, '{y}-{m}-{d}') || ''
            }
          }
        }
      },
      columnsGys: {
        _children: {
          // label: '供应商',
          // prop: 'children',
          // className: 'coloum-title-l',
          // width: '600px',
          header: colHeader,
          headerOptions: {
            label: ''
          },
          showOverflowTooltip: true,
          child: {
            _rmbUnitPrice: {
              prop: 'rmbUnitPrice',
              label: '单价',
              minWidth: '130',
              formater: scope => this.formate(scope)
            },
            _estimatedDate: {
              prop: 'estimatedDate',
              label: '预计交期',
              minWidth: '160',
              formater: scope => this.formate(scope, true)
            },
            _rmbTotalPrice: {
              prop: 'rmbTotalPrice',
              label: '含税总价（元）',
              minWidth: '120',
              isShow: false,
              formater: scope => this.formate(scope)
            },
            _remark: {
              prop: 'remark',
              label: '备注',
              minWidth: '180',
              isShow: false,
              showOverflowTooltip: true,
              formater: scope => this.formate(scope)
            }
          }
        }
      },
      isShow: ''
    }
  },
  computed: {
    list() {
      const dataArr = this.parmas && this.parmas.bomDetailList && this.parmas.bomDetailList.map((e, i) => {
        const arr = this.parmas.quotationList.filter(ele => e.id === ele.inquiryBomId)
        arr.forEach(ele => {
          e['supplier' + ele.supplierId] = ele
        })
        return e
      })
      return { ...this.parmas, bomDetailList: dataArr }
    },
    column() {
      const col = deepClone(this.columns)
      const par = this.parmas && this.parmas.suppliers && this.parmas.suppliers.reduce((a, n, i) => {
        const obj = deepClone(this.columnsGys['_children'])
        obj.label = n.supplierName
        obj.headerOptions.label = n.supplierName
        Object.values(obj.child).forEach(e => {
          e.prop = 'supplier' + n.supplierId + '.' + e.prop
          if (obj.label === this.isShow) {
            e.isShow = true
            obj.headerOptions.show = true
          }
        })
        a['_supplier' + n.supplierId] = obj
        return a
      }, {})
      if (this.isShow === '纱线编码') {
        col._materiel.headerOptions.show = true
        Object.values(col).forEach(e => {
          e.isShow = true
        })
      }
      return { ...col, ...par }
    }
  },
  methods: {
    headerClick(column, event) {
      if (column.children && column.children.length > 1 || column.label === '纱线编码') {
        if (this.isShow === column.label) {
          this.isShow = ''
        } else {
          this.isShow = column.label
        }
      }
    },
    formate(scope, isDate) {
      const arr = scope.column.property.split('.')
      const obj = scope.row[arr[0]]
      return obj && obj[arr[1]] && (isDate ? this.$utils.parseTime(obj[arr[1]], '{y}-{m}-{d}') : obj[arr[1]]) || '-'
    }
  }
}
</script>
<style lang="scss" scoped>
  /deep/ thead .is-leaf {
    background: #fff !important;
  }
  /deep/ .el-table--enable-row-transition .el-table__body td {
    border-right: 0;
    border-bottom-width: 1px;
    border-bottom: 1rpx solid #E5E6EB;
  }
  /deep/ .el-table--group, .el-table--border, /deep/ .el-table--border th, /deep/ .el-table--border td {
    border-right: 0;
    border-left: 0;
  }
</style>
