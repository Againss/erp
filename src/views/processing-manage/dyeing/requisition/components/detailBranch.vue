<template>
  <div
    id="DyeRequisition-DetailBranch"
    class="DyeRequisition-DetailBranch el-form-item el-form-item--medium"
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
        label: '坯布编码',
        minWidth: '170',
        showOverflowTooltip: true,
        handle: (scope) => {}
      },
      _cloth: {
        prop: 'cloth',
        label: '布类',
        minWidth: '170',
        showOverflowTooltip: true,
        handle: (scope) => {},
        formater: (scope) => {
          return scope.row.cloth.label || ''
        }
      },
      _suggest: {
        prop: 'suggest',
        label: '成品规格',
        minWidth: '170',
        showOverflowTooltip: true,
        handle: (scope) => {}
      },
      _qty: {
        prop: 'qty',
        label: '坯布数量(KG)',
        minWidth: '160',
        align: 'right',
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
        label: '计划送坯期',
        align: 'right',
        minWidth: '155',
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
        cellClassName: 'dye-edit-table-item',
        dataSource: [],
        columns,
        formDatas: {}
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
.DyeRequisition-DetailBranch.el-form-item {
  margin-right: 0;
  margin-bottom: 0;
}
#DyeRequisition-DetailBranch.DyeRequisition-DetailBranch {
  display: block;
  margin-top:20px;
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
    padding: 0 10px;
    > div {
      width: 100%;
      .el-form-item__content {
        line-height: 36px;
      }
    }
    > div:not(.table-row) {
      padding-left: 20px;
    }
  }
  .table-row {
    //表格
    background: #fff;
    padding-right: 0;
    margin-top: 0;
    >.el-form-item__content{
      margin-top:10px
    }
    .table {
      width: 100%;
    }
    .dye-edit-table-item{
       .el-form-item {
        margin-bottom:0;
      }
    }
    .el-form-item__label-wrap {
      display: none;
    }
    .el-form-item__content {
      width: 100%;
      // padding: 0 10px;
      padding-right: 0;
      .table tr:nth-child(even) {
        background: #fff;
      }
      .el-table th.is-leaf {
        background: #f5f7fa;
        padding: 3px 0;
      }
      .table-row .cell {
        padding-right: 0;
      }
    }
  }
}
</style>
