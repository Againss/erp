<template>
  <div id="DetailBranch" class="WeavingOrder-DetailBranch">
    <div v-for="(i, index) in list" :key="index">
      <cs-custom-form
        :data-source="detailData"
        :options="detailFormOptions"
        :form-datas="i"
      />
      <div class="detail-branch-detail">
        <!-- :data-source="i.details"  -->
        <cs-custom-table :columns="i.columns" :data-source="i.details" />
      </div>
    </div>
    <!-- 工艺 -->
    <cs-custom-pop
      v-if="technologyOptions.visible"
      ref="pop"
      :options="technologyOptions"
    />
  </div>
</template>

<script>
import technology from '@/views/processing-manage/weaving/demand/components/technology.vue'

export default {
  name: 'DetailBranch',
  components: {},
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
      // 'line-height': '20px',
      'margin-bottom': '0'
    }
    const detailData = {
      _skuId: {
        prop: 'skuId',
        itemType: 'itemview',
        label: '产品编码:',
        itemStyle: detailStyle
      },
      _clothType: {
        prop: 'clothType',
        itemType: 'itemview',
        label: '布类:',
        itemStyle: detailStyle
      },
      //  成品规格=布封+克重
      _widthName: {
        prop: 'widthName',
        itemType: 'itemview',
        label: '成品规格:',
        itemStyle: detailStyle,
        renderContent: (value, options, form, formDatas, setFormDatas) => {
          if (form && form.model) {
            return `${form.model.widthName} - ${form.model.weightName}`
          }
        }
      },
      _planDelivery: {
        prop: 'planDelivery',
        itemType: 'itemview',
        label: '计划交期:',
        itemStyle: detailStyle,
        renderContent: (val) => {
          return this.$filters.parseTime(val, '{y}-{m}-{d}')
        }
      },
      _knitDelivery: {
        prop: 'knitDelivery',
        itemType: 'itemview',
        label: '织单交期:',
        itemStyle: detailStyle,
        renderContent: (val) => {
          return this.$filters.parseTime(val, '{y}-{m}-{d}')
        }
      },
      _qty: {
        prop: 'qty',
        itemType: 'itemview',
        label: '坯布数量:',
        itemStyle: detailStyle,
        renderContent: (val) => {
          return `${val}KG`
        }
      },
      _procedureId: {
        prop: 'procedureId',
        itemType: 'itemview',
        label: '工艺:',
        itemStyle: detailStyle,
        renderContent: (val) => {
          return val
            ? `<span style="color:#0986FF;cursor: pointer">${val}</span> `
            : ''
        },
        handle: (val) => {
          this.technologyOptions.componentsOptions.id = val
          this.technologyOptions.visible = true
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
      _yarnCode: {
        prop: 'yarnCode',
        label: '纱线编码',
        minWidth: 160,
        showOverflowTooltip: true
      },
      _yarnName: {
        prop: 'yarnName',
        label: '纱名',
        minWidth: 160,
        showOverflowTooltip: true
      },
      _yarnAttr: {
        prop: 'yarnAttr',
        label: '纱属性',
        minWidth: 160,
        showOverflowTooltip: true
      },
      _yarnPercent: {
        prop: 'yarnPercent',
        label: '纱比',
        minWidth: 160,
        showOverflowTooltip: true,
        yarnType: '',
        // isShow: (column) => {
        //   return column.yarnType === 'Y'
        // },
        formater: (scope) => {
          return scope.row.yarnType === 'Y' ? (scope.row.yarnPercent ? scope.row.yarnPercent + '%' : '-') : '-'
        }
      },
      _yarnColor: {
        prop: 'yarnColor',
        label: '染纱颜色',
        minWidth: 120,
        showOverflowTooltip: true
      },
      _factoryColorCode: {
        prop: 'factoryColorCode',
        label: '工厂色号',
        minWidth: 120,
        showOverflowTooltip: true
      },
      _colorPercent: {
        prop: 'colorPercent',
        label: '颜色占比',
        minWidth: 120,
        showOverflowTooltip: true
      },
      _knitWastage: {
        prop: 'knitWastage',
        label: '织损',
        minWidth: 120,
        showOverflowTooltip: true
      },
      _yarnNeedQty: {
        prop: 'yarnNeedQty',
        label: '纱需求量(KG)',
        minWidth: 140,
        align: 'right',
        showOverflowTooltip: true
      },
      _yarnDelivery: {
        prop: 'yarnDelivery',
        label: '计划到纱期',
        minWidth: 160,
        showOverflowTooltip: true,
        align: 'center',
        formater: (scope) => {
          return this.$filters.parseTime(scope.row.yarnDelivery, '{y}-{m}-{d}')
        }
      }
    }
    const technologyOptions = {
      itemType: 'dialog',
      visible: false,
      title: '工艺',
      width: '1300px',
      okHidden: true,
      cancelHidden: true,
      close: () => {
        this.$set(this.technologyOptions, 'visible', false)
      },
      components: { technology },
      componentsOptions: {
        id: ''
      }
    }
    return {
      technologyOptions,
      isMore: false,
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
  computed: {
    list() {
      var o = this.$utils.deepClone(this.componentsOptions.productDetails)
      o.forEach((i) => {
        i.columns = this.columns
        if (i.details && i.details.length) {
          i.columns._yarnPercent.yarnType = i.details[0].yarnType
        }
      })
      return o
    }
  },
  created() {}
}
</script>

<style  lang="scss" >
.WeavingOrder-DetailBranch {
  margin-top: 20px;
  padding-top: 16px;
  padding-left: 14px;
  background: #eef5f9;
  width: 100%;
  height: 100%;
  .custom-form {
    box-shadow: 10px 12px 10px 0 rgba(161, 177, 192, 0.2);
    z-index: 2;
  }
  .detail-branch-detail-form {
    padding-top: 12px;
    padding-bottom: 16px;
    background: #fff;
    .el-form-item__content {
      line-height: 28px;
    }
    .el-form-item__label {
      height: 28px;
      line-height: 28px;
    }
    > div {
      padding-left: 10px;
    }
  }
  .detail-branch-detail {
    //表格
    margin-bottom: 10px;
    background: #fff;
    padding: 0 10px;
    padding-bottom: 10px;
    .table tr:nth-child(even) {
      background: #fff;
    }
    .el-table th.is-leaf {
      background: #f5f7fa;
    }
  }
}
</style>
