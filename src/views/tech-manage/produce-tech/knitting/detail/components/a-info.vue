<template>
  <div class="info-box" :class="isEdit==='detail'?'info-detail':''" style="padding-bottom: 0;">
    <!-- <div class="title-text">{{ isEdit==='detail'?'查看针织工艺':'编辑针织工艺' }}</div> -->
    <div class="quote-wrap">
      <span style="margin-right: 10px;">引用工艺</span>
      <span v-if="isEdit==='edit'" class="quote-text" @click="quoteData">选择引用工艺</span>
      <span v-else class="quote-text detail">选择引用工艺</span>
      <span v-if="showProp" style="font-size: 14px;margin-left: 30px;">客样分析单：{{ data.sampleAnalysisResultId||'' }}</span>
    </div>

    <!-- 列表 -->
    <div class="page-table" style="padding: 0 10px  15px 15px;">
      <div class="title" style="padding: 0 0;">参板信息 </div>
      <cs-custom-table
        :header-cell-style="headerCellStyle"
        tooltip-effect="dark"
        :columns="applyInfoData"
        :data-source="getListData"
        edit-type="pop"
      />
    </div>

    <!-- 导入pop弹出层 -->
    <div class="pop">
      <cs-custom-pop ref="technology" :options="technologyPopOptions" />
    </div>
  </div>
</template>

<script>
import { referenceCount, referencePage } from '../api/index.js'
import radioButton from './common/radio-button.vue'
import aInfoTab from './common/a-info-tab.vue'
export default {
  name: 'AInfo',
  props: {
    isEdit: {
      type: String
    },
    data: {
      type: Object
    },
    listData: {
      type: Array
    },
    orderDetailId: {
      type: [String, Number],
      default: ''
    },
    orderType: {
      type: String
    }
  },
  data() {
    const headerCellStyle = {
      'background': '#F5F7FA'
    }

    const applyInfoData = {
      _referenceOrderCode: {
        prop: 'referenceOrderCode',
        label: '订单号',
        showOverflowTooltip: true

      },
      _productNo: {
        prop: 'productNo',
        label: '坯布/成品编码',
        showOverflowTooltip: true
      },
      _referenceContent: {
        prop: 'referenceContent',
        label: '参考内容',
        showOverflowTooltip: true

      },
      _remark: {
        prop: 'remark',
        label: '备注',
        showOverflowTooltip: true
      }

    }
    // 引用工艺基础表头
    const technologyBaseColumns = [
      {
        prop: 'orderNo',
        label: '订单号',
        minWidth: '120',
        showOverflowTooltip: true
      },
      {
        prop: 'knitNo',
        label: '坯布编码',
        minWidth: '120',
        showOverflowTooltip: true
      },
      {
        prop: 'clothName',
        label: '布类',
        minWidth: '120',
        showOverflowTooltip: true
      },
      {
        prop: 'yarnFineness',
        label: '纱支/细度',
        minWidth: '120',
        showOverflowTooltip: true,
        formater: scope => {
          const data = scope.row.yarnFineness
          let str = ''
          if (data && data.length > 0) {
            for (let i = 0; i < data.length; i++) {
              str += `<span>${data[i]};</span>`
            }
          }
          return str
        }
      },
      {
        prop: 'elementRatio',
        label: '成份/比例',
        minWidth: '120',
        showOverflowTooltip: true,
        formater: scope => {
          const data = scope.row.elementRatio
          let str = ''
          if (data && data.length > 0) {
            for (let i = 0; i < data.length; i++) {
              str += `<span>${data[i]};</span>`
            }
          }
          return str
        }
      },
      {
        prop: 'suggestWidth',
        label: '布封',
        minWidth: '120',
        showOverflowTooltip: true,
        formater: scope => scope.row.suggestWidth
      },
      {
        prop: 'suggestWeight',
        label: '克重',
        minWidth: '120',
        showOverflowTooltip: true
      },
      {
        prop: 'customerColor',
        label: '客户颜色',
        minWidth: '120',
        showOverflowTooltip: true
      },
      {
        prop: 'colorLevel',
        label: '色级',
        minWidth: '120',
        showOverflowTooltip: true,
        formater: scope => {
          const color = {
            '1': '深',
            '2': '中',
            '3': '浅',
            '4': '白'
          }
          return color[scope.row.colorLevel]
        }
      }
    ]
    // 表格表头
    const technologyColumns = [
      {
        prop: 'id',
        label: '选择',
        width: '50',
        components: {
          radioButton
        },
        componentsOptions: {
          changeMethods: (value) => {
            console.log('组件', value)
          }
        }
      },
      {
        prop: 'seq',
        label: '序号',
        width: '60',
        showOverflowTooltip: true
      },
      ...technologyBaseColumns
    ]
    // 弹出框分页
    const technologyPagination = {
      pageSizes: [10],
      layout: 'total, prev, pager, next',
      // dataTotal: dataSource.length,
      currentChange: val => {
        this.getReferencePage({ ...this.formObj, pageSize: this.technologyPagination.pageSize || 10, pageNum: val })
      },
      sizeChange: val => {
        // console.log('sizeChange', this.pagination)
        this.$set(this.spunPagination, 'currentPage', 1)
        this.getReferencePage({ pageNum: 1, pageSize: val })
      }
    }
    // 弹出框
    const technologyPopOptions = {
      itemType: 'dialog',
      visible: false,
      title: '选择针织工艺',
      width: '1240px',
      ok: params => {
        this.$emit('radioClick', this.technologyColumns[0].componentsOptions.radioData ? this.technologyColumns[0].componentsOptions.radioData.techDetailId : '')
        this.$set(this.technologyPopOptions, 'visible', false)
      },
      cancel: params => {
        this.$set(this.technologyPopOptions, 'visible', false)
      },
      close: () => {
        this.$set(this.technologyPopOptions, 'visible', false)
      },
      formDatas: {
        tabs: 'B',
        radio: null
      },
      formOptions: {
        labelWidth: '100px',
        inline: true
      },
      content: [
        {
          prop: 'id',
          label: '选择',
          width: '50',
          components: {
            aInfoTab
          },
          componentsOptions: {
            searchClick: (value) => {
              // 列表数据参数
              this.formObj = {
                matchCloth: true,
                matchYarnFineness: true,
                matchElementRatio: false,
                matchSuggestWidth: false,
                matchSuggestWeight: false,
                matchCustomerColor: false,
                matchColorLevel: false,
                orderType: this.technologyPopOptions.formDatas.tabs,
                orderNo: value.orderNo,
                techDetailId: this.techDetailId
              }
              value.checkedCities.forEach(v => {
                this.formObj[v] = true
              })
              // 列表数据
              this.getReferencePage({ pageNum: 1, pageSize: 10 })
              console.log('组888件', this.formObj)
            }
          }
        },
        {
          itemType: 'view',
          text: ``,
          itemStyle: { width: '100%' }
        },
        {
          prop: 'tabs',
          itemType: 'tabs',
          label: '',
          itemStyle: { 'width': '100%', 'marginRight': 0, 'marginBottom': 0 },
          change: (value, form, formDatas, setFormDatas) => {
            // 请求数据
            this.technologyPopOptions.formDatas.tabs = value
            this.formObj.orderType = value
            this.getReferencePage({ pageNum: 1, pageSize: 10 })
          },
          dataSource: [
            {
              label: '大货（0）',
              value: 'B'
            }, {
              label: '样板（0）',
              value: 'S'
            },
            {
              label: '备坯（0）',
              value: 'R'
            },
            {
              label: '补布（0）',
              value: 'C'
            }
          ]
        },
        {
          prop: 'tableForm',
          headerCellStyle: { 'background-color': '#F5F7FA' },
          className: 'pop-table',
          itemType: 'table-form',
          label: '',
          labelWidth: '0',
          itemStyle: { width: '100%', 'marginRight': 0 },
          dataSource: [],
          tooltipEffect: 'dark',
          columns: technologyColumns,
          pagination: technologyPagination
        }
      ]
    }
    return {
      formOtions: {
        inline: true,
        labelWidth: '120px'

      },
      formObj: {
        matchCloth: true,
        matchYarnFineness: true,
        matchElementRatio: false,
        matchSuggestWidth: false,
        matchSuggestWeight: false,
        matchCustomerColor: false,
        matchColorLevel: false,
        orderType: 'B',
        orderNo: ''
      },
      applyInfoData,
      technologyPopOptions,
      technologyPagination,
      technologyBaseColumns,
      technologyColumns,
      headerCellStyle

    }
  },
  computed: {
    form() {
      return this.$refs.pop
    },
    getListData() {
      if (this.listData && this.listData.length > 0) {
        this.listData.forEach((v, i) => {
          if (v.referenceContent && v.referenceContent.label) {
            v.referenceContent = v.referenceContent.label
          }
        })
      }
      return this.listData && this.listData.length > 0 ? this.listData : []
    },
    techDetailId() {
      return this.orderDetailId || ''
    },
    showProp() {
      return this.orderType === 'S'
    }
  },
  mounted() {

  },
  methods: {
    quoteData() {
      this.formObj.orderType = 'B'
      this.$set(this.technologyPopOptions, 'visible', true)
      this.getReferencePage({ pageNum: 1, pageSize: 10 })
    },
    // 分页
    async getReferencePage(obj) {
      const res = (await referencePage({ ...this.formObj, ...obj, techDetailId: this.techDetailId })).data || {}
      this.technologyPagination = {
        ...this.technologyPagination,
        dataTotal: res ? res.total : 0,
        // ...data,
        currentPage: res.pageNum,
        pageSize: res.pageSize
      }
      this.$set(this.technologyPopOptions.content[3], 'pagination', this.technologyPagination)
      this.$set(this.technologyPopOptions.content[3], 'dataSource', res.list)
      this.getReferenceCount({ pageNum: 1, pageSize: 10 })
    },
    // 获取引用工艺分页查询数量统计获取
    async getReferenceCount(obj) {
      const count = (await referenceCount({ ...this.formObj, ...obj, techDetailId: this.techDetailId })).data || {}
      this.$set(this.technologyPopOptions.content[2].dataSource[0], 'label', `大货（${count.big || 0}）`)
      this.$set(this.technologyPopOptions.content[2].dataSource[1], 'label', `样板（${count.sample || 0}）`)
      this.$set(this.technologyPopOptions.content[2].dataSource[2], 'label', `备坯（${count.greige || 0}）`)
      this.$set(this.technologyPopOptions.content[2].dataSource[3], 'label', `补布（${count.compensate || 0}）`)
    }
  }
}
</script>

<style lang="scss" scoped>
  .quote-wrap{
    display: flex;
    align-items: center;
    font-size: 16px;
    color: rgb(21, 18, 34);
    border-bottom: 1px solid rgb(238, 239, 240);
    padding: 0 20px;
    height: 60px;
    .quote-text{
      border: 1px solid #0986FF;
      border-radius: 4px;
      font-size: 14px;
      margin-left: 15px;
      height: 28px;
      line-height: 28px;
      padding: 0 15px;
      color: #0986ff;
      &.detail{
        background-color: #F5F7FA;
        border: 1px solid #E3E8EE;
        color: #BBC2D0;

      }
    }
  }
  .info-box {
    background: #ffffff;
    padding-bottom: 20px;
    margin: 0;
  }
  .title-text{
    padding: 0 20px;
    height: 65px;
    line-height: 65px;
    font-size: 18px;
    // font-weight: 600;
    color: #151226;
    box-sizing: border-box;
    border-bottom: 1px solid #eee;
  }
  .title{
    height: 56px;
    display: flex;
    align-items: center;
    padding: 0 20px;
    font-size: 16px;
  }
</style>
<style lang="scss">
  .info-detail{
    .el-input.is-disabled .el-input__inner{
       background-color: transparent;
       border: none;
       color: #777;
       text-overflow: ellipsis;
       padding: 0;
    }
  }
  .info-box {
    background: #ffffff;
    padding-bottom: 20px;
    .el-form-item {
      margin-bottom: 0px;
    }
    .el-form-item__label {
      color: #888E9E;
    }
    .el-form-item__label-wrap {
      margin-left: auto;
    }
  }
  .info-box .el-tabs__header{
    margin: 0 !important;
  }
  .info-box .el-form-item__content>.el-input [readonly=readonly] {
    // padding: 0;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
