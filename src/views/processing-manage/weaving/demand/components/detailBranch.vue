<template>
  <div id="DetailBranch" class="WeavingOrder-DetailBranch">
    <div v-for="(i, index) in list" :key="index">
      <cs-custom-form
        :data-source="detailData"
        :options="detailFormOptions"
        :form-datas="i"
      />
      <div class="detail-branch-detail">
        <cs-custom-table :columns="columns" :data-source="getDetails(i)" />
        <div style="display:flex;justify-content: center;">
          <el-button
            size="small"
            type="text"
            style="color:#666666"
            @click="showMore(i,index)"
          >
            {{ !i.isShowMoer ? '更多':'隐藏' }}
            <i :class=" !i.isShowMoer ? 'el-icon-arrow-down' : 'el-icon-arrow-up'" />
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
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
      width: '24%',
      height: '28px',
      'line-height': '28px',
      // 'line-height': '20px',
      'margin-bottom': '0'
    }
    const detailData = {
      _skuId: {
        prop: 'skuId',
        itemType: 'itemview',
        label: '坯布编码:',
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
      _clothType: {
        prop: 'clothType',
        itemType: 'itemview',
        label: '布类:',
        itemStyle: detailStyle
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
        label: '色布数量:',
        itemStyle: detailStyle,
        renderContent: (val) => {
          return val ? `<span style="color:#FF4444">${val}KG</span> ` : ''
        }
      },
      _procedureId: {
        prop: 'procedureId',
        itemType: 'itemview',
        label: '工艺:',
        itemStyle: detailStyle,
        renderContent: (val) => {
          return val ? `<span style="color:#0986FF;cursor: pointer">${val}</span> ` : ''
        },
        handle: (val) => {
          const parent = this.$parent.$parent.$parent
          parent.technologyOptions.componentsOptions.id = val
          parent.technologyOptions.visible = true
        },
        style: {
          color: '#0986FF',
          cursor: 'pointer'
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
        label: '色纱编码',
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
    return {
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
      return this.componentsOptions.productDetails
    }
  },
  created() {},
  methods: {
    getDetails(i) {
      return !i.isShowMoer ? i.details.slice(0, 2) : i.details
    },
    showMore(item, index) {
      this.$set(this.list[index], 'isShowMoer', !item.isShowMoer)
    }
  }
}
</script>

<style  lang="scss" >
.WeavingOrder-DetailBranch {
  margin-top:20px;
  padding-top: 16px;
  // padding-left: 14px;
  background: #eef5f9;
  width: 100%;
  height: 100%;
  .custom-form{
    box-shadow:  10px 12px 10px 0 rgba(161,177,192,0.2);
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
      padding-left: 30px;
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
