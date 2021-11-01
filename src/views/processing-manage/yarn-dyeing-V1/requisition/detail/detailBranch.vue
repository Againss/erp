<!--
 * @Author: xj
 * @Description: 原纱调拨通知单
 * @Date: 2021-05-28 14:59:56
 * @LastEditors: anthony
 * @LastEditTime: 2021-07-16 17:33:38
 * @FilePath: e:\erpmu\erp2-processing-v2.0.0\src\views\processing-manage\yarn-dyeing\requisition\detail\detailBranch.vue
-->
<template>
  <div id="DetailBranch_requisitio2" class="DetailBranch_requisitio2" :class="isEdit ? '' : 'DetailBranch_del_disable1x'">
    <div v-for="(i, index) in ListArray" :key="index" class="DetailBranch_order_div">
      <div class="DetailBranch_order_10px">
        <cs-custom-form
          :data-source="detailData"
          :options="detailFormOptions"
          :form-datas="i"
        />
      </div>
      <div class="detail">
        <cs-custom-form
          ref="materialData11"
          class="page-table-border"
          :reset-errors="isEdit"
          :options="formOptions"
          :data-source="formDataSource2[index]"
          :form-datas="{ idindex: index }"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { inputFilter } from '@/views/processing-manage/public/index.js'
export default {
  props: {
    isEdit: {
      type: Boolean
    },
    activeIndex: {
      type: String
    },
    dataBranch: {
      type: Array
    },
    data: {
      type: Object
    },
    syncMoudleDataHandle: {
      type: Function
    }
  },
  data() {
    const ismax999Reg = this.$getRules({ type: 'number', pattern: /^(([1-9]{1}\d{0,7})|(0{1}))(\.\d{1,2})?$/, message: '0~99999999.99', trigger: ['blur'] })
    const detailStyle = { width: '32%', 'line-height': '20px', 'margin-bottom': '0' }
    const commonBlurReg = this.$getRules({ trigger: ['change'] })
    const columns = {
      _index: {
        label: '序号',
        formater: (scope) => {
          return scope.$index + 1
        }
      },
      _yarnId: {
        label: '色纱编码',
        minWidth: '120'
      },
      _sourceCode: {
        prop: 'sourceCode',
        label: '来源单号',
        showOverflowTooltip: true
      },
      _yarnCode: {// pm
        prop: 'yarnCode',
        label: '坯纱编码',
        minWidth: '150',
        showOverflowTooltip: true
      },
      _yarnCard: {// pm
        prop: 'yarnCard',
        label: '纱牌/纱批',
        minWidth: '120',
        showOverflowTooltip: true
      },
      _yarnType: {// pm
        prop: 'yarnType',
        label: '纱名',
        showOverflowTooltip: true
      },
      _yarnAttributes: {
        prop: 'yarnAttributes',
        label: '纱属性',
        className: 'ruleTip',
        showOverflowTooltip: true
      },
      _dyeingColor: {
        prop: 'dyeingColor',
        label: '染纱颜色',
        showOverflowTooltip: true
      },
      _factoryNo: {
        prop: 'factoryNo',
        label: '工厂色号',
        showOverflowTooltip: true
      },
      _allotSum: {
        prop: 'allotSum',
        label: '调拨量(KG)',
        minWidth: '100',
        align: 'right',
        // className: 'ruleTip',
        editOptions: {
          placeholder: '请输入',
          itemType: 'input',
          size: 'mini',
          itemClassName: 'DetailBranchLeft',
          labelWidth: '0',
          clearable: true,
          itemProp: 'allotSum',
          rules: [commonBlurReg, ismax999Reg],
          trim: (val) => { return inputFilter(val) }
        },
        formater: (scope) => {
          return scope.row.allotSum
        }
      },
      _planDelivery: {
        prop: 'planDelivery',
        label: '计划送纱期',
        minWidth: '155',
        className: 'ruleTip',
        showOverflowTooltip: true,
        editOptions: {
          itemType: 'date',
          valueFormat: 'timestamp',
          labelWidth: '0',
          size: 'mini',
          clearable: false,
          itemProp: 'planDelivery',
          placeholder: '请选择',
          rules: [
            { required: true, message: '请选择计划送纱期', trigger: 'change' }
          ]
        },
        formater: (scope) => {
          return scope.row.planDelivery ? this.$filters.parseTime(scope.row.planDelivery + '', '{y}-{m}-{d}') : '-'
        }

      }
    }
    const detailData = {
      _skuId: {
        prop: 'skuId',
        itemType: 'itemview',
        itemClassName: 'DetailBranch_tionsco',
        label: '成品编码:',
        itemStyle: detailStyle
      },
      _clothName: {
        prop: 'clothName',
        itemType: 'itemview',
        itemClassName: 'DetailBranch_tionsco',
        label: '布类:',
        itemStyle: detailStyle
      },
      _suggest: {
        prop: 'suggest',
        itemType: 'itemview',
        itemClassName: 'DetailBranch_tionsco',
        label: '成品规格:',
        itemStyle: detailStyle
      }
    }
    return {
      formOptions: {
        popError: true,
        syncDataHandle: (val) => {
          this.EntryData(val)
        }
      },
      detailYU: {},
      ListArray: [],
      formDataSource2: [],
      columns,
      detailData,
      ListCopy: [],
      detailFormOptions: {
        inline: true,
        className: 'detail-branch-detail-form'
      },
      detailFormDatas: {

      }
    }
  },
  watch: {
    dataBranch: {
      handler(v) {
        const ListArray = this.$utils.deepClone(v || [])
        this.ListCopy = this.$utils.deepClone(v || [])
        ListArray.forEach((item, im) => {
          item.allotNotifyDetails && item.allotNotifyDetails.forEach((it, ix) => { it.idindex = im; it.edit = this.isEdit })
        })
        this.ListArray = ListArray
        this.formDataSource2 = ListArray.map((v, i) => {
          v.allotNotifyDetails.forEach((it) => { it.idindex = i; it.edit = this.isEdit })
          return {
            '_tableForm': {
              'prop': 'tableForm',
              'itemType': 'table-form',
              'syncFormDatasToDataSource': false,
              'headerCellClassName': this.isSing,
              'dataSource': v.allotNotifyDetails,
              'rowKey': 'id',
              'headerCellStyle': {
                'background': '#F5F7FA!important'
              },
              'size': 'mini',
              'columns': this.columns,
              'operates': null
            }
          }
        })
      },
      deep: true,
      immediate: true
    },
    isEdit: {
      handler(v) {
        if (v) {
          const ListArray = this.$utils.deepClone(this.ListArray || [])
          ListArray.forEach((item, im) => {
            item.allotNotifyDetails && item.allotNotifyDetails.forEach((it, ix) => { it.idindex = im; it.edit = v })
          })
          this.formDataSource2.forEach((item, im) => {
            item._tableForm.dataSource.forEach((it, ix) => { it.edit = v })
          })
          this.ListArray = ListArray
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    isSing(scope) {
      if (['allotSum'].includes(scope.column.property) && this.isEdit) {
        return 'isSing'
      }
    },
    getdata(data) {
      return this.ListArray[data].allotNotifyDetails || []
    },
    EntryData(data) { // 分录传递数据
      const { idindex, tableForm } = data
      this.ListCopy[idindex].allotNotifyDetails = tableForm
      this.syncMoudleDataHandle('materialData', this.ListCopy || [])
    }

  }
}
</script>

<style lang="scss">
.DetailBranch_requisitio2 {
  .DetailBranch_order_10px{
    .custom-form{
      box-shadow:  10px 12px 10px 0 rgba(161,177,192,0.2);
      z-index: 2;
    }
  }
  .detail-branch-detail-form {
    background: #fff;
    .el-form-item{
      margin-bottom: 0 !important;
    }
    padding: 12px 10px;
    margin-top: 16px;
  }
  .yarn-style3{
    text-overflow: ellipsis;
    overflow: hidden;
    max-width: 300px;
    white-space: nowrap;
    color: #666666;
    display: flex;
    align-items: center;
  }
  table th.isSing div:before {
    content: '*';
    color: red;
  }
  .DetailBranch_tionsco{
    .el-form-item__content{
      div {
        span{
           color: #151222  !important;
        }
      }
    }
  }
  .detail{
    .el-table__header-wrapper .has-gutter tr th{ height: 44px!important;}
  }

}
.DetailBranch_del_disable1x{
  .el-table__header-wrapper .ruleTip .cell::before {
    content: ''!important;
  }
}

</style>

<style scoped lang="scss">
#DetailBranch_requisitio2  {
  background: #eef5f9;
  padding-left: 14px;
  width: 100%;
  .detail {
    background: #fff;
    padding: 0 10px;
     /deep/ .el-table td {
      height: 50px;
      line-height: 50px;
      padding: 0;
     }
     /deep/ .el-form-item--mini.el-form-item {
        margin-bottom: 0
     }
  }
}
  .page-table-border {
    /deep/ .el-table--mini{
      font-size: 14px !important;
    }
    /deep/tbody .el-table__row td {
      padding: 12px 0;
      .el-form-item.el-form-item{
        margin-bottom: 0 !important;
      }
    }
  }
</style>
