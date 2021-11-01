<template>
  <div
    id="PrintRequisition-DetailBranch"
    class="PrintRequisition-DetailBranch el-form-item el-form-item--medium"
    :style="componentsOptions.style || {}"
  >
    <cs-custom-form
      ref="detailData"
      :data-source="detailData"
      :options="detailFormOptions"
    />
  </div>
</template>

<script>
import { inputFilter } from '@/views/processing-manage/public/index.js'
import { deepClone } from '@/utils'
export default {
  name: 'DetailBranch',
  props: {
    componentsOptions: {
      type: Object
    }
  },
  data() {
    const columns = {
      _index: {
        minWidth: '50',
        label: '序号',
        formater: (scope) => {
          return scope.$index + 1
        }
      },
      _skuId: {
        prop: 'skuId',
        label: '色布编码',
        minWidth: '160',
        showOverflowTooltip: true,
        handle: (scope) => {}
      },
      _cloth: {
        prop: 'cloth',
        label: '布类',
        minWidth: '160',
        showOverflowTooltip: true,
        handle: (scope) => {},
        formater: (scope) => {
          return scope.row.cloth.label || ''
        }
      },
      _suggest: {
        prop: 'suggest',
        label: '成品规格',
        minWidth: '160',
        showOverflowTooltip: true,
        handle: (scope) => {}
      },
      _qty: {
        prop: 'qty',
        label: '色布数量(KG)',
        minWidth: '120',
        showOverflowTooltip: true,
        handle: (scope) => {}
      },
      _allotQty: {
        prop: 'allotQty',
        label: '调拨数量(KG)',
        minWidth: '120',
        align: 'right',
        showOverflowTooltip: true,
        handle: (scope) => {},
        editOptions: {
          itemType: 'input',
          size: 'mini',
          placeholder: '请输入调拨量',
          labelWidth: '0',
          itemProp: 'allotQty',
          trim: (val) => {
            return inputFilter(val)
          },
          rules: [
            {
              required: true,
              message: '请输入调拨量',
              trigger: ['change']
            }
          ]
        }
      },
      _planDelivery: {
        prop: 'planDelivery',
        label: '计划送布期',
        minWidth: '155',
        align: 'right',
        showOverflowTooltip: true,
        editOptions: {
          itemType: 'date',
          size: 'mini',
          valueFormat: 'timestamp',
          labelWidth: '0',
          clearable: true,
          itemProp: 'planDelivery',
          placeholder: '请选择',
          // change: (value, form, formDatas, setFormDatas) => {
          //   this.syncMoudleDataHandle(
          //     'materialData',
          //     formDatas.tableForm || []
          //   )
          // },
          rules: [
            { required: true, message: '请选择印花交期', trigger: 'change' }
          ]
        },
        handle: (scope) => {},
        formater: (scope) => {
          return scope.row.planDelivery ? this.$filters.parseTime(scope.row.planDelivery + '', '{y}-{m}-{d}') : '-'
        }
      },
      _sourceNo: {
        prop: 'sourceNo',
        label: '来源单据',
        minWidth: '140',
        showOverflowTooltip: true,
        handle: (scope) => {}
      }
    }
    const detailData = {
      _details: {
        prop: 'details',
        itemType: 'table-form',
        label: ' ',
        rowClassName: 'table-row',
        dataSource: [],
        columns,
        formDatas: {},
        cellClassName: 'edit-table-item'
      }
    }

    return {
      result: [],
      list: [],
      columns,
      formDatas: {},
      detailData,
      detailFormOptions: {
        popError: true,
        inline: true,
        className: 'detail-branch-detail-form',
        syncDataHandle: (val) => {
          this.result = val.details
          this.componentsOptions.syncDataHandle(this.result)
        }
      }
    }
  },
  computed: {
  },
  watch: {
    componentsOptions: {
      handler(val) {
        const arr = deepClone(val.details) || []
        arr && arr.forEach((item) => {
          item.edit = val.isEdit
        })
        this.detailData._details.dataSource = arr
        this.result = []
        arr.forEach((j) => {
          this.result.push(j.details)
        })
        this.formDatas = val
      },
      deep: true,
      immediate: true
    }
  },
  created() {},
  methods: {
  }
}
</script>

<style  lang="scss">
.PrintRequisition-DetailBranch.el-form-item {
  margin-top:20px;
  margin-right: 0;
  margin-bottom: 0;
}
#PrintRequisition-DetailBranch.PrintRequisition-DetailBranch {
  padding-top: 16px;
  // padding-left: 14px;
  background: #eef5f9;
  width: 100%;
  height: 100%;
  > div {
    width: 100%;
  }
  .detail-branch-detail-form {
    margin-bottom: 10px;
    background: #fff;
    width: 100%;
    > div {
      width: 100%;
      .el-form-item__content {
        // line-height: 28px;
      }
    }
    > div:not(.table-row) {
      padding-left: 20px;
    }
  }
  .table-row {
    //表格
    background: #fff;
    padding-right: 10px;
    .table {
      width: 100%;
    }
    .edit-table-item{
       .el-form-item {
        margin-bottom:0
      }
    }
    margin-top: 10px;
    .el-form-item__label-wrap {
      display: none;
    }
    .el-form-item__content {
      padding: 0 0 0 10px;
      width: 100%;
        // .table tr:nth-child(even) {
        //   background: #fff;
        // }
      .el-table th.is-leaf {
        background: #f5f7fa;
        padding: 0;
        height: 44px;
      }
    }
  }

}
</style>
<style lang="scss" scoped>
  /deep/.el-form--inline .el-form-item {
    margin-right: 0;
  }
</style>
