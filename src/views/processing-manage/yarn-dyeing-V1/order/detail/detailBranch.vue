<template>
  <div id="DetailBranch_order" class="DetailBranch_order 858">
    <div
      v-for="(i, index) in ListArray"
      :key="i.id"
      class="DetailBranch_order_div"
      :class="[index ? '' : 'DetailBranch_css']"
    >
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
          :options="formOptions"
          :data-source="formDataSource2[index]"
          :form-datas="{ idindex: index }"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isEdit: {
      type: Boolean
    },
    activeIndex: {
      type: String
    },
    data: {
      type: Object
    },
    dataBranch: {
      type: Array
    },
    syncMoudleDataHandle: {
      type: Function
    },
    setParentDataHandle: {
      type: Function
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
        label: '成品编码:',
        itemStyle: detailStyle,
        renderContent: this.renderContent
      },
      _clothName: {
        prop: 'clothName',
        itemType: 'itemview',
        label: '布类:',
        itemStyle: detailStyle,
        renderContent: this.renderContent
      },
      _suggest: {
        prop: 'suggest',
        itemType: 'itemview',
        label: '成品规格:',
        itemStyle: detailStyle,
        renderContent: this.renderContent
      },
      _planDelivery: {
        prop: 'planDelivery',
        itemType: 'itemview',
        label: '计划交期:',
        itemStyle: detailStyle,
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return `<div title='${value ? this.$filters.parseTime(value + '', '{y}-{m}-{d}') : '-'}' class='yarn-style'>${value ? this.$filters.parseTime(value + '', '{y}-{m}-{d}') : '-'}</div>`
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
      _yarnId: {
        prop: 'yarnId',
        label: '色纱编码',
        minWidth: '120',
        showOverflowTooltip: true,
        handle: (scope) => { }
      },
      _yarnType: {
        prop: 'yarnType',
        label: '纱名',
        showOverflowTooltip: true,
        handle: (scope) => { }
      },
      _yarnAttributes: {
        prop: 'yarnAttributes',
        label: '纱属性',
        showOverflowTooltip: true,
        handle: (scope) => { }
      },
      _dyeingColor: {
        prop: 'dyeingColor',
        label: '染纱颜色',
        showOverflowTooltip: true,
        handle: (scope) => { }
      },
      _factoryNo: {
        prop: 'factoryNo',
        label: '工厂色号',
        className: 'ruleTip',
        showOverflowTooltip: true,
        minWidth: '120',
        editOptions: {
          itemType: 'input',
          placeholder: '请输入',
          showOverflowTooltip: true,
          labelWidth: '0',
          size: 'mini',
          clearable: true,
          temProp: 'factoryNo',
          maxlength: 20
        },
        formater: (scope) => {
          return scope.row.factoryNo ? scope.row.factoryNo : '-'
        }
      },
      _colorRatio: {
        prop: 'colorRatio',
        label: '颜色占比',
        showOverflowTooltip: true,
        handle: (scope) => { }
      },
      _dyeingLoss: {
        prop: 'dyeingLoss',
        label: '染纱损(%)',
        align: 'right',
        minWidth: 100,
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.dyeingLoss ? parseFloat(scope.row.dyeingLoss) : '-'
        //  return  (scope.row.dyeingLoss===null|| scope.row.dyeingLoss===undefined||scope.row.dyeingLoss==='')?parseFloat(scope.row.dyeingLoss):"-"
        }
      },
      _planQty: {
        prop: 'planQty',
        label: '排产数量(KG)',
        minWidth: '120',
        align: 'right',
        showOverflowTooltip: true,
        handle: (scope) => { }
      },
      _dyeingDelivery: {
        prop: 'dyeingDelivery',
        itemType: 'itemview',
        label: '染纱交期',
        width: 100,
        itemStyle: detailStyle,
        formater: (scope) => {
          return scope.row.dyeingDelivery ? this.$filters.parseTime(scope.row.dyeingDelivery + '', '{y}-{m}-{d}') : '-'
        }
      },
      _factoryNum: {
        prop: 'factoryNum',
        label: '排厂量(KG)',
        minWidth: '120',
        align: 'right',
        showOverflowTooltip: true,
        handle: (scope) => { }
      },
      _yarnNum: {
        prop: 'yarnNum',
        label: '坯纱数量(KG)',
        minWidth: '120',
        align: 'right',
        showOverflowTooltip: true,
        handle: (scope) => { }
      }
    }
    const materialData = {
      _tableForm: {
        prop: 'tableForm',
        itemType: 'table-form',
        syncFormDatasToDataSource: false,
        dataSource: [],
        rowKey: 'id',
        headerCellStyle: {
          background: '#F5F7FA!important'
        },
        size: 'mini',
        columns: columns,
        operates: null
      }
    }
    return {
      formOptions: {
        syncDataHandle: (val) => {
          this.EntryData(val)
          console.log(val, 'cccccccccccccccc8585')
        }
      },
      isMore: false,
      materialData,
      formDataSource2: [],
      columns,
      ListArray: [],
      ListCopy: [],
      ListArrayCopy: [],
      detailData,
      detailFormOptions: {
        inline: true,
        labelWidth: '80px',
        className: 'detail-branch-detail-form'
      }
    }
  },
  watch: {
    dataBranch: {
      handler(v) {
        console.log('Sssssom')
        const ListArray = this.$utils.deepClone(v || [])
        this.ListCopy = this.$utils.deepClone(v || [])
        ListArray.forEach((item, im) => {
          item.orderDetails.forEach((it, ix) => { it.idindex = im; it.edit = this.isEdit })
        })
        this.ListArray = ListArray
        this.formDataSource2 = ListArray.map((v, i) => {
          v.orderDetails.forEach((it) => { it.idindex = i; it.edit = this.isEdit })
          return {
            '_tableForm': {
              'prop': 'tableForm',
              'itemType': 'table-form',
              'syncFormDatasToDataSource': false,
              'dataSource': v.orderDetails,
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
    ListArray: {
      handler(v) {
        console.log('Sssssom222', v)
      },
      deep: true,
      immediate: true
    },
    isEdit: {
      handler(v) {
        if (v) {
          const ListArray = this.$utils.deepClone(this.ListArray || [])
          ListArray.forEach((item, im) => {
            item.orderDetails.forEach((it, ix) => { it.idindex = im; it.edit = v })
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
    ClickCopy(index) {
      this.isMore = !this.isMore
    },
    EntryData(data) { // 分录传递数据
      const { idindex, tableForm } = data
      this.ListCopy[idindex].orderDetails = tableForm
      this.syncMoudleDataHandle('materialData', this.ListCopy || [])
      // 最终版本
      // this.syncMoudleDataHandle('materialData', data)
    },
    renderObj(value, options, form, formDatas, setFormDatas, scope) {
      return `<div title='${value ? value.label : '-'}' class='yarn-style'>${value ? value.label : '-'}</div>`
    },
    renderContent(value, options, form, formDatas, setFormDatas, scope) {
      return `<div title='${value || '-'}' class='yarn-style'>${value || '-'}</div>`
    }
  }
}
</script>

<style  lang="scss">
#DetailBranch_order {
  .yarn-style{
    text-overflow: ellipsis;
    overflow: hidden;
    max-width: 300px;
    white-space: nowrap;
    // color: #151222;
    color:#474747
  }

  .DetailBranch_order_10px{
    .custom-form{
      box-shadow:  10px 12px 10px 0 rgba(161,177,192,0.2);
        z-index: 2;
    }
  }
  .detail-branch-detail-form {
    background: #fff;
    padding: 12px 10px !important;
    margin-top: 16px;
  }
  .page-table-border {
    // padding: 12px 0;
    .el-form-item.el-form-item{
      margin-bottom: 0 !important;
    }
  }

}
</style>

<style scoped lang="scss">
#DetailBranch_order {
  background: #eef5f9;
  padding-left: 14px;
  width: 100%;
  .detail {
    background: #fff;
    padding: 0 10px;
    /deep/ .el-table--mini {
      font-size: 14px !important;
    }
    /deep/ .el-table td {
      height: 50px;
      line-height: 50px;
      padding: 0;
    }
    /deep/ .el-form-item--mini.el-form-item {
      margin-bottom: 0;
    }
  }
}
</style>
