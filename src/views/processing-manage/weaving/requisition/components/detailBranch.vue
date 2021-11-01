<template>
  <div
    id="WeavingRequisition-DetailBranch"
    class="WeavingRequisition-DetailBranch el-form-item el-form-item--medium"
    :style="componentsOptions.style || {}"
  >
    <div v-for="(i, index) in list" :key="index">
      <cs-custom-form
        :data-source="i.detailData"
        :options="i.detailFormOptions"
        :form-datas="getFormDatas(i, index)"
        :reset-errors="componentsOptions.isEdit"
      />
    </div>
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
    var validateQty = (rule, value, callback) => {
      if (!value || !parseFloat(value)) {
        callback(new Error('请输入大于0的调拨量'))
      } else if (value > 99999999.99) {
        callback(new Error('请输入小于于99999999.99的调拨量'))
      }
      callback()
    }
    // billType  单据类型Y 坯纱 CY 色纱
    const columns = {
      _index: {
        minWidth: '50',
        label: '序号',
        formater: (scope) => {
          return scope.$index + 1
        }
      },
      _yarnCodeCy: {
        prop: 'yarnCode',
        label: '色纱编码',
        minWidth: '160',
        showOverflowTooltip: true,
        billType: '',
        isShow: (column) => {
          return column.billType === 'CY'
        }
      },
      _yarnCode: {
        prop: 'yarnCode',
        label: '坯纱编码',
        minWidth: '160',
        showOverflowTooltip: true,
        billType: '',
        isShow: (column) => {
          return column.billType === 'Y'
        }
      },
      _yarnBatchNumber: {
        prop: 'yarnBatchNumber',
        label: '纱牌/纱批',
        minWidth: '160',
        showOverflowTooltip: true
      },
      _yarnName: {
        prop: 'yarnName',
        label: '纱名',
        minWidth: '160',
        showOverflowTooltip: true
      },
      _yarnAttr: {
        prop: 'yarnAttr',
        label: '纱属性',
        minWidth: '160',
        showOverflowTooltip: true
      },
      _yarnColor: {
        prop: 'yarnColor',
        label: '染纱颜色',
        minWidth: '140',
        showOverflowTooltip: true,
        billType: '',
        isShow: (column) => {
          return column.billType === 'CY'
        }
      },
      _factoryColorCode: {
        prop: 'factoryColorCode',
        label: '工厂色号',
        minWidth: '140',
        showOverflowTooltip: true,
        billType: '',
        isShow: (column) => {
          return column.billType === 'CY'
        }
      },
      _qty: {
        prop: 'qty',
        label: '调拨量(KG)',
        minWidth: '120',
        align: 'right',
        handle: (scope) => {},
        editOptions: {
          itemType: 'input',
          size: 'mini',
          placeholder: '请输入调拨量',
          labelWidth: '0',
          itemProp: 'qty',
          trim: (val) => {
            return inputFilter(val)
          },
          rules: [
            {
              required: true,
              trigger: ['change'],
              validator: validateQty
            }
          ]
        }
      },
      _planDelivery: {
        prop: 'planDelivery',
        label: '计划送纱期',
        minWidth: '155',
        formater: (scope) => {
          return this.$filters.parseTime(scope.row.planDelivery, '{y}-{m}-{d}')
        },
        editOptions: {
          itemType: 'date',
          size: 'mini',
          placeholder: '请选择计划送纱期',
          labelWidth: '0',
          itemProp: 'planDelivery',
          valueFormat: 'timestamp',
          rules: [
            {
              required: true,
              message: '请选择计划送纱期',
              trigger: ['change']
            }
          ]
        }
      }
    }
    const detailData = {
      _skuId: {
        prop: 'skuId',
        itemType: 'itemview',
        label: '产品编码:',
        renderContent: (val) => {
          return val
        },
        title: true
      },
      _clothType: {
        prop: 'clothType',
        itemType: 'itemview',
        label: '布类:',
        renderContent: (val) => {
          return val
        },
        title: true
      },
      //  成品规格=布封+克重
      _widthName: {
        prop: 'widthName',
        itemType: 'itemview',
        label: '成品规格:',
        renderContent: (val) => {
          return val
        },
        title: true
      },
      _details: {
        prop: 'details',
        itemType: 'table-form',
        label: ' ',
        rowClassName: 'table-row',
        cellClassName: 'edit-table-item',
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
          this.result[val.index] = val.details
          this.componentsOptions.syncDataHandle(this.result)
        }
      }
    }
  },
  computed: {},
  watch: {
    componentsOptions: {
      handler(val) {
        const arr = deepClone(val.details) || []
        if (arr.length) {
          for (var i = 0; i < arr.length; i++) {
            var k = arr[i].details || []
            if (k.length) {
              for (var p = 0; p < k.length; p++) {
                k[p].edit = val.isEdit
              }
            }
          }
        }
        arr.map((i, index) => {
          i.index = index
          this.detailData._details.dataSource = deepClone(i.details) || []
          i.detailData = deepClone(this.detailData)
          i.detailFormOptions = this.detailFormOptions
        })
        this.list = arr
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
    getFormDatas(i, index) {
      i.detailData._details.columns._yarnColor.billType = i.billType
      i.detailData._details.columns._yarnCode.billType = i.billType
      i.detailData._details.columns._yarnCodeCy.billType = i.billType
      i.detailData._details.columns._factoryColorCode.billType = i.billType
      return {
        clothType: i.clothType,
        skuId: i.skuId,
        index: i.index,
        widthName: `${i.widthName} - ${i.weightName}`
      }
    }
  }
}
</script>

<style  lang="scss">
.WeavingRequisition-DetailBranch.el-form-item {
  margin-right: 0;
  margin-bottom: 0;
}
#WeavingRequisition-DetailBranch.WeavingRequisition-DetailBranch {
  display: block;
  margin-top: 20px;
  padding-top: 16px;
  padding-left: 14px;
  background: #eef5f9;
  width: 100%;
  height: 100%;
  > div {
    width: 100%;
  }
  .detail-branch-detail-form {
    padding-top: 12px;
    margin-bottom: 10px;
    background: #fff;
    width: 100%;
    > div {
      width: 100%;
      .el-form-item__content {
        line-height: 36px;
      }
      .el-form-item__content {
        line-height: 28px;
      }
      .el-form-item__label {
        height: 28px;
        line-height: 28px;
      }
    }

    > div:not(.table-row) {
      box-shadow: 10px 12px 10px 0 rgba(161, 177, 192, 0.2);
      margin: 0;
      padding: 0;
      flex: 1;
      line-height: 28px;
      box-shadow: 10px 12px 1 0px 0 rg ba(161, 177, 192, 0.2);
      background: #fff;
      z-index: 2;
      .el-form-item__label-wrap {
        width: 95px;
      }
      padding-bottom: 16px;
    }
  }
  .table-row {
    //表格
    background: #fff;
    .table {
      width: 100%;
    }
    .edit-table-item{
       .el-form-item {
        margin-bottom:0
      }
    }
    .el-form-item__label-wrap {
      display: none;
    }
    > .el-form-item__content {
      padding: 0 10px;
      padding-bottom: 10px;
      width: 100%;
      .table tr:nth-child(even) {
        background: #fff;
      }
      .el-table th.is-leaf {
        background: #f5f7fa;
        height: 44px;
        padding: 0;
      }
    }
  }
}
</style>
