<template>
  <div id="printDetailBranch" class="printDetailBranch">
    <div v-for="(item, index) in componentsOptions.data" :key="index">
      <cs-custom-form
        :data-source="detailData"
        :options="detailFormOptions"
        :form-datas="item"
      />
      <div class="print-branch-detail">
        <cs-custom-table :columns="columns" :data-source="item.orderDetailMaterialInfoRespList" />
      </div>
    </div>
  </div>
</template>

<script>
import printImgItem from './printImg'
export default {
  props: {
    componentsOptions: {
      type: Object
    }
  },
  data() {
    const detailStyle = {
      width: '32%',
      'line-height': '20px',
      'margin-bottom': '0'
    }
    const detailData = {
      _skuId: {
        prop: 'skuId',
        itemType: 'itemview',
        label: '印花布编码:',
        itemStyle: detailStyle
      },
      _suggest: {
        prop: 'suggest',
        itemType: 'itemview',
        label: '成品规格:',
        itemStyle: detailStyle
      },
      //  成品规格=布封+克重
      _customerClothNumber: {
        prop: 'customerColor',
        itemType: 'itemview',
        label: '客户花号:',
        itemStyle: detailStyle
      },
      _printDelivery: {
        prop: 'printDelivery',
        itemType: 'itemview',
        label: '印花交期:',
        itemStyle: detailStyle,
        renderContent: (val) => {
          return this.$filters.parseTime(val, '{y}-{m}-{d}')
        }
      },
      _planQty: {
        prop: 'planQty',
        itemType: 'itemview',
        label: '印花布数量:',
        align: 'right',
        itemStyle: detailStyle
      },
      _tech: {
        prop: 'tech',
        itemType: 'itemview',
        label: '印花工艺:',
        itemStyle: detailStyle
      },
      _printLoss: {
        prop: 'printLoss',
        itemType: 'itemview',
        label: '印花损:',
        itemStyle: detailStyle
      },
      _colorPath: {
        prop: 'colorPath',
        // itemType: 'itemview',
        label: '印花图案:',
        itemStyle: {
          'line-height': '20px',
          'margin-bottom': '0'
        },
        components: {
          printImgItem
        }
      }
    }
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
        // minWidth: '150',
        showOverflowTooltip: true,
        handle: (scope) => {}
      },
      _cloth: {
        prop: 'cloth',
        label: '布类',
        // minWidth: '150',
        showOverflowTooltip: true,
        handle: (scope) => {},
        formater: (scope) => {
          return scope.row.cloth ? scope.row.cloth.label : ''
        }
      },
      _yarnType: {
        prop: 'yarnType',
        label: '纱名',
        // minWidth: '150',
        showOverflowTooltip: true,
        handle: (scope) => {}
      },
      _yarnAttr: {
        prop: 'yarnAttr',
        label: '纱属性',
        // minWidth: '150',
        showOverflowTooltip: true,
        handle: (scope) => {}
      },
      _elementName: {
        prop: 'elementName',
        label: '成份',
        // minWidth: '150',
        showOverflowTooltip: true,
        handle: (scope) => {}
      },
      _planQty: {
        prop: 'planQty',
        label: '色布数量(KG)',
        align: 'right',
        // minWidth: '150',
        showOverflowTooltip: true,
        handle: (scope) => {}
      }
    }
    return {
      dataSource: [],
      columns,
      detailData,
      detailFormOptions: {
        inline: true,
        className: 'detail-branch-detail-form'
      },
      detailFormDatas: {}
    }
  },
  watch: {
    'componentsOptions.data': {
      handler(v) {
        // this.ListArray = this.$utils.deepClone(v || [])
        // this.materialData._tableForm.dataSource = this.ListArray
      }
    }
  },
  created() {
  },
  methods: {
  }
}
</script>

<style  lang="scss">
#printDetailBranch {
  margin-top:20px;
   .custom-form{
    box-shadow:  10px 12px 10px 0 rgba(161,177,192,0.2);
    z-index: 2;
  }
  .detail-branch-detail-form {
    background: #fff;
    .el-form-item__label {
      color: #888e9e;
      line-height: 28px
    }
    .el-form-item__content {
      color: #474747;
      line-height: 28px !important;
    }
    padding: 16px 0;
    margin-top: 16px;
    box-shadow: 0 7px 10px 0 rgba(161, 177, 192, 0.2);
    z-index: 4;
  }
    .print-branch-detail {
        .el-table th.is-leaf {
          background: #f5f7fa;
          height: 44px;
        }
        .table tr:nth-child(even) {
          background: #fff;
        }
    }
}
</style>
<style scoped lang="scss">
#printDetailBranch {
  background: #eef5f9;
  padding-left: 14px;
  width: 100%;
  .detailData-detail {
    background: #fff;
    padding: 0 10px;
  }
  .print-branch-detail {
    //表格
    margin-bottom: 10px;
    background: #fff;
    padding: 0 10px;
  }
}
</style>
