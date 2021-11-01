<template>
  <div class="details-main">
    <el-tabs v-model="activeName">
      <!-- 主要产品列表 -->
      <el-tab-pane name="productMain">
        <span slot="label" class="label">主要产品</span>
        <!-- 列表 -->
        <div class="table-details detail">
          <cs-custom-table
            :key="activeName"
            :columns="mainProductColumns"
            :data-source="info.productMain"
            :operates="mainProductPopOperates"
          />
        </div>
      </el-tab-pane>
      <!-- 新产品开发列表 -->
      <el-tab-pane name="productNew">
        <span slot="label" class="label">新产品开发能力</span>
        <div class="panel-content">
          <!-- 列表 -->
          <div class="table-details detail">
            <cs-custom-table
              :key="activeName"
              :columns="newProductColumns"
              :data-source="info.productNew"
              :operates="newProductPopOperates"
            />
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <!-- 主要产品弹框 -->
    <div class="pop-box">
      <cs-custom-pop :options="mainProductPopBox" />
    </div>
    <!-- 新产品开发弹框 -->
    <div class="pop-box">
      <cs-custom-pop :options="newProductPopBox" />
    </div>
  </div>
</template>

<script>
import * as api from '../api/index'
export default {
  name: 'ProductInfo',
  props: {
    info: {
      type: Object,
      default: () => ({})
    },
    setData: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    /* 通用验证 */
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    const floatBlurReg = this.$getRules({ trigger: ['blur'], type: 'float' })
    const numberBlurReg = this.$getRules({ trigger: ['blur'], type: 'number' })
    /* 主要产品添加弹框 */
    const mainProductPopBox = {
      itemType: 'drawer',
      visible: false,
      title: '添加',
      okText: '确定',
      ok: (params) => {
        this.saveData({ ...params }, 'mainProductPopBox')
      },
      cancel: params => {
        this.$set(this.mainProductPopBox, 'visible', false)
      },
      content: [
        {
          prop: 'name',
          labelWidth: '100px',
          itemType: 'input',
          label: '产品名称',
          maxlength: '50',
          rules: [{ ...commonBlurReg, message: '产品名称不能为空！' }]
        },
        {
          prop: 'spec',
          labelWidth: '100px',
          itemType: 'input',
          label: '产品规格',
          maxlength: '50'
        },
        {
          prop: 'productionLineOther',
          itemType: 'input',
          labelWidth: '100px',
          label: '生产线或其它',
          maxlength: '50'
        },
        {
          prop: 'output',
          itemType: 'input',
          labelWidth: '100px',
          label: '产量',
          maxlength: '50'
        },
        {
          prop: 'price',
          itemType: 'input',
          labelWidth: '100px',
          label: '价格',
          maxlength: '10',
          rules: [{ ...floatBlurReg, message: '只能输入数字！' }]
        },
        {
          prop: 'payMode',
          itemType: 'select',
          labelWidth: '100px',
          label: '付款方式',
          rules: [{ ...commonBlurReg, message: '付款方式不能为空！' }],
          dataSource: []
        },
        {
          prop: 'customerSegments',
          itemType: 'input',
          label: '主要销售群体',
          labelWidth: '100px',
          maxlength: '50'
        },
        {
          prop: 'remark',
          labelWidth: '100px',
          itemType: 'input',
          type: 'textarea',
          label: '备注',
          maxlength: '50'
        }
      ]
    }
    /* 主要产品表头参数信息 */
    const mainProductColumns = [
      {
        prop: 'name',
        label: '产品名称',
        minWidth: '105',
        showOverflowTooltip: true
      },
      {
        prop: 'spec',
        label: '产品规格',
        minWidth: '105',
        showOverflowTooltip: true
      },
      {
        prop: 'productionLineOther',
        label: '生产线或其它',
        minWidth: '105',
        showOverflowTooltip: true
      },
      {
        prop: 'output',
        label: '产量（月/年）',
        minWidth: '105',
        showOverflowTooltip: true
      },
      {
        prop: 'price',
        label: '价格',
        minWidth: '105',
        showOverflowTooltip: true
      },
      {
        prop: 'payMode',
        label: '付款方式',
        minWidth: '105',
        showOverflowTooltip: true,
        formater: (scope) => {
          const obj = this.mainProductPopBox.content[5].dataSource.find(e => String(scope.row.payMode) === String(e.id))
          return scope.row.payMode && obj && obj.payWay || ''
        }
      },
      {
        prop: 'customerSegments',
        label: '主要销售群体',
        minWidth: '105',
        showOverflowTooltip: true
      },
      {
        prop: 'remark',
        label: '备注',
        minWidth: '110',
        showOverflowTooltip: true
      }
    ]
    /* 主要产品操作栏 */
    const mainProductPopOperates = {
      label: '操作',
      width: '120',
      dataSource: [
        {
          label: '删除',
          style: { 'color': '#FE4949' },
          isShow: scope => this.type !== 'detail',
          handle: (params) => {
            this.deleteData(params.$index)
          }
        },
        {
          label: '修改',
          isShow: scope => this.type !== 'detail',
          handle: (params) => {
            this.addOrEdit({ ...params.row }, 'mainProductPopBox', params.$index)
          }
        }
      ]
    }

    /* 新产品添加弹框 */
    const newProductPopBox = {
      itemType: 'drawer',
      visible: false,
      title: '添加',
      okText: '确定',
      ok: (params) => {
        this.saveData({ ...params }, 'newProductPopBox')
      },
      cancel: params => {
        this.$set(this.newProductPopBox, 'visible', false)
      },
      content: [
        {
          prop: 'developmentProcess',
          itemType: 'input',
          label: '开发管理流程:',
          maxlength: '50',
          rules: commonBlurReg
        },
        {
          prop: 'hasGroup',
          itemType: 'select',
          label: '开发团队',
          rules: commonBlurReg,
          dataSource: [{
            label: '是',
            value: 1
          }, {
            label: '否',
            value: 0
          }]
        },
        {
          prop: 'hasTech',
          itemType: 'select',
          label: '有无行业领先的技术',
          /*         rules: commonBlurReg, */
          dataSource: [{
            label: '是',
            value: 1
          }, {
            label: '否',
            value: 0
          }]
        },
        {
          prop: 'newProductCycle',
          itemType: 'input',
          label: '新产品的开发周期/天',
          maxlength: '3',
          rules: [commonBlurReg, numberBlurReg]
        },
        {
          prop: 'sampleCycle',
          itemType: 'input',
          label: '样品提供的周期/天',
          maxlength: '3',
          rules: [commonBlurReg, numberBlurReg]
        },
        {
          prop: 'bulkProductCycle',
          itemType: 'input',
          label: '大货的生产周期/天',
          maxlength: '3',
          rules: [commonBlurReg, numberBlurReg]
        }
      ]
    }
    /* 新产品表头参数信息 */
    const newProductColumns = [
      {
        prop: 'developmentProcess',
        label: '开发管理流程',
        minWidth: '100',
        showOverflowTooltip: true
      },
      {
        prop: 'hasGroup',
        label: '开发团队',
        minWidth: '90',
        formater: (scope) => {
          return scope.row[scope.column.property] === 1
            ? '是' : '否'
        }
      },
      {
        prop: 'hasTech',
        label: '有无行业领先的技术',
        minWidth: '110',
        formater: (scope) => {
          return scope.row[scope.column.property] === 1
            ? '是' : '否'
        }
      },
      {
        prop: 'newProductCycle',
        label: '新产品的开发周期/天',
        minWidth: '110',
        showOverflowTooltip: true
      },
      {
        prop: 'sampleCycle',
        label: '样品提供的周期/天',
        minWidth: '110',
        showOverflowTooltip: true
      },
      {
        prop: 'bulkProductCycle',
        label: '大货的生产周期/天',
        minWidth: '110',
        showOverflowTooltip: true
      }
    ]
    /* 新产品操作栏 */
    const newProductPopOperates = {
      label: '操作',
      width: '120',
      dataSource: [
        {
          label: '删除',
          style: { 'color': '#FE4949' },
          isShow: scope => this.type !== 'detail',
          handle: (params) => {
            this.deleteData(params.$index)
          }
        },
        {
          label: '修改',
          isShow: scope => this.type !== 'detail',
          handle: (params) => {
            this.addOrEdit({ ...params.row }, 'newProductPopBox', params.$index)
          }
        }
      ]
    }

    return {
      activeName: 'productMain',
      /* 主要产品 */
      mainProductPopBox,
      mainProductColumns,
      mainProductPopOperates,
      /* 新产品 */
      newProductPopBox,
      newProductColumns,
      newProductPopOperates
    }
  },
  computed: {
    type() {
      return this.$route.params.type
    }
  },
  created() {
    this.payWaySource()
  },
  methods: {
    bindAdd() {
      if (this.activeName === 'productNew') {
        this.addOrEdit({
          developmentProcess: '',
          hasGroup: '',
          hasTech: '',
          newProductCycle: '',
          sampleCycle: '',
          bulkProductCycle: ''
        }, 'newProductPopBox')
      } else {
        this.addOrEdit({
          name: '',
          spec: '',
          productionLineOther: '',
          output: '',
          price: '',
          payMode: '',
          customerSegments: '',
          remark: ''
        }, 'mainProductPopBox')
      }
    },
    addOrEdit(data, item, index) {
      this.$set(this[item], 'formDatas', { ...data, popIndex: index })
      this.$set(this[item], 'title', index === undefined ? '新增' : '修改')
      this.$set(this[item], 'visible', true)
    },
    deleteData(index) {
      const arr = this.info[this.activeName] && [...this.info[this.activeName]] || []
      arr.splice(index, 1)
      this.setData('supplierProduct', { ...this.info, [this.activeName]: arr })
    },
    saveData(rows, item) {
      const arr = this.info[this.activeName] && [...this.info[this.activeName]] || []
      if (rows.popIndex === undefined) {
        arr.push({ ...rows, id: null })
      } else {
        arr[rows.popIndex] = rows
      }
      this.$set(this[item], 'visible', false)
      this.setData('supplierProduct', { ...this.info, [this.activeName]: arr })
    },
    async payWaySource() {
      const res = await api.getPaymentData()
      const arr = (res.data && res.data.list || []).map(e => ({
        ...e,
        label: e.payWay,
        value: String(e.id),
        disabled: !e.status
      }))
      this.mainProductPopBox.content[5].dataSource = arr
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
