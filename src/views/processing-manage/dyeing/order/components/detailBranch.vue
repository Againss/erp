<template>
  <div id="dyeOrderDetailBranch" class="dyeOrderDetailBranch">
    <div v-for="(item, index) in componentsOptions.data" :key="index">
      <cs-custom-form
        :data-source="detailData"
        :options="detailFormOptions"
        :form-datas="item"
      />
      <div class="print-branch-detail">
        <cs-custom-table
          :columns="columns"
          :data-source="item.orderDetailMaterialInfoRespList"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    componentsOptions: {
      type: Object
    }
  },
  data() {
    const detailStyle = {
      width: '32%',
      height: '28px',
      'line-height': '28px',
      'margin-bottom': '0'
    }
    const detailData = {
      _skuId: {
        prop: 'skuId',
        itemType: 'itemview',
        label: '色布编码：',
        itemStyle: detailStyle
      },
      _suggest: {
        prop: 'suggest',
        itemType: 'itemview',
        label: '成品规格：',
        itemStyle: detailStyle
      },
      _customerColor: {
        prop: 'customerColor',
        itemType: 'itemview',
        label: '客户颜色：',
        itemStyle: detailStyle
      },
      _dyeDelivery: {
        prop: 'dyeDelivery',
        itemType: 'itemview',
        label: '染交期：',
        itemStyle: detailStyle,
        renderContent: (
          value,
          options,
          form,
          formDatas,
          setFormDatas,
          scope
        ) => {
          if (value) {
            return `<div class='yarn-style'>${
              value
                ? this.$filters.parseTime(value + '', '{y}-{m}-{d} {h}:{i}')
                : '-'
            }</div>`
          } else {
            return ''
          }
        }
      },
      _planQty: {
        prop: 'planQty',
        itemType: 'itemview',
        label: '色布数量：',
        itemStyle: detailStyle
      },
      _tech: {
        prop: 'tech',
        itemType: 'itemview',
        label: '染整工艺：',
        itemStyle: detailStyle
      },
      _factoryColor: {
        prop: 'factoryColor',
        itemType: 'itemview',
        label: '工厂颜色：',
        itemStyle: detailStyle
      },
      _factoryColorNo: {
        prop: 'factoryColorNo',
        itemType: 'itemview',
        label: '工厂色号：',
        itemStyle: detailStyle
      },
      _dyeLoss: {
        prop: 'dyeLoss',
        itemType: 'itemview',
        label: '染损：',
        itemStyle: detailStyle
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
        label: '坯布编码',
        showOverflowTooltip: true,
        handle: (scope) => {}
      },
      _clothName: {
        prop: 'clothName',
        label: '布类',
        showOverflowTooltip: true,
        handle: (scope) => {}
      },
      _yarnType: {
        prop: 'yarnType',
        label: '纱名',
        showOverflowTooltip: true,
        handle: (scope) => {}
      },
      _yarnAttr: {
        prop: 'yarnAttr',
        label: '纱属性',
        showOverflowTooltip: true,
        handle: (scope) => {}
      },
      _elementName: {
        prop: 'elementName',
        label: '成份',
        showOverflowTooltip: true,
        handle: (scope) => {}
      },
      _planQty: {
        prop: 'planQty',
        label: '坯布数量(KG)',
        align: 'right',
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
  }
}
</script>

<style lang="scss">
#dyeOrderDetailBranch.dyeOrderDetailBranch {
  .custom-form{
    box-shadow:  10px 12px 10px 0 rgba(161,177,192,0.2);
    z-index: 2;
  }
  .detail-branch-detail-form {
    background: #fff;
    .el-form-item__label {
      height: 28px;
      line-height: 28px;
      color: #888e9e;
    }
    .el-form-item__content {
      line-height: 28px;
      color: #474747;
    }
    padding: 16px 10px;
    margin-top: 16px;
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
#dyeOrderDetailBranch {
  margin-top: 20px;
  background: #eef5f9;
  padding: 0 0 15px 14px;
  width: 100%;
  height: 100%;
  .print-branch-detail {
    //表格
    margin-bottom: 10px;
    background: #fff;
    padding: 0 10px;
  }
}
/deep/.el-table--medium th, .el-table--medium td {
    padding: 0
  }
</style>
