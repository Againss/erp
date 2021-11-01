<!--
 * @Author: xj
 * @Description: 参板信息数据
 * @Date: 2021-04-18 09:48:43
 * @LastEditors: OBKoro1
 * @LastEditTime: 2021-07-27 17:27:45
-->
<template>
  <!-- 参板信息 -->
  <div class="order-item">
    <div class="header-top">
      <span>参板信息</span>
      <el-button
        v-if="isEdit"
        type="primary"
        size="mini"
        @click="addReferenceVersionInfo"
      >新增</el-button>
    </div>
    <div class="page-table page-table-border" style="padding: 0 10px;">
      <cs-custom-table
        ref="versionData"
        tooltip-effect="light"
        :header-cell-style="headerCellStyle"
        :columns="versionColumns"
        :data-source="versionData"
        :operates="versionOperates"
        :pagination="pagination"
        edit-type="pop"
      />
      <div v-if="versionData&&versionData.length===0" style="border-bottom: 1px solid #eeeff0;margin: 10px;" />
    </div>
    <!-- 参板信息弹窗 -->
    <div class="pop">
      <cs-custom-pop ref="versionPop" :options="versionPopOptions" />
    </div>
  </div>
</template>

<script>
import { PublicCustomer } from '@/views/customer-order/public/index'
export default {
  name: 'References',
  components: {},
  mixins: [PublicCustomer],
  props: {
    isEdit: {
      type: Boolean
    },
    data: {
      type: [Object, Array]
    },
    syncMoudleDataHandle: {
      type: Function
    },
    rule: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    // table表头颜色
    const headerCellStyle = {
      'background': '#F5F7FA'
    }
    // 公用验证正则
    const commonChangeReg = this.$getRules({})
    // 公用验证正则
    // const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    // 参板信息表格函数
    const versionColumns = {
      _referenceOrder: {
        prop: 'referenceOrder',
        label: '订单号',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.referenceOrder && scope.row.referenceOrder.label ? scope.row.referenceOrder.label : ''
        }
      },
      _greyClothCode: {
        prop: 'greyClothCode',
        label: '坯布/色布/印花布编码',
        minWidth: '160',
        showOverflowTooltip: true
      },
      _referenceContent: {
        prop: 'referenceContent',
        label: '参考内容',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.referenceContent && scope.row.referenceContent.label ? scope.row.referenceContent.label : ''
        }
      },
      _remark: {
        prop: 'remark',
        label: '备注',
        showOverflowTooltip: true
      }
    }
    const versionOperatesData = [
      {
        label: '编辑',
        isShow: true,
        handle: scope => {
          const that = this
          this.$set(this.versionContent._referenceOrder, 'dataSource', that.funscope(scope.row.referenceOrder))
          this.$set(this.versionContent._greyClothCode, 'dataSource', that.funscope(scope.row.greyClothCode))
          this.$set(this.versionContent._referenceContent, 'dataSource', that.funscope(scope.row.referenceContent))
          // this.encryptFn(this.versionContent, this.orderData['_rule'], 'edit')
          this.encryptFn(this.versionPopOptions.content, this.rule, 'edit')
          this.versionPopHandle('编辑参板信息')
          this.setFormDatas({ ...scope.row, code: scope.$index }, 'version')
        }
      },
      {
        label: '删除',
        isShow: true,
        style: { 'color': '#FE4949' },
        handle: scope => {
          this.$confirm('确认删除该条参板信息数据？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            cancelButtonClass: 'btn-cancel'
          })
            .then(() => {
              this.versionData.splice(scope.$index, 1)
            })
            .catch(() => {
              this.$message({ type: 'info', message: '已取消删除' })
            })
        }
      }
    ]
    const versionOperates = {
      label: '操作',
      width: '120',
      fixed: 'right',
      dataSource: versionOperatesData
    }
    // 参板信息弹框内容
    const versionContent = {
      _referenceOrder: {
        prop: 'referenceOrder',
        itemType: 'select',
        className: 'commonRemoteSearch',
        placeholder: '输入文字模糊查询',
        label: '订单号',
        valueType: 'object',
        clearable: true,
        filterable: true,
        rules: [commonChangeReg],
        change: (value, form, formDatas, setFormDatas) => {
          if (value && value.value) {
            setFormDatas({ greyClothCode: '' })
            this.getGreyClothCodesSelect({ orderId: value.value })
          }
        },
        visibleChange: value => {
          this.getOrderNoSelect()
        },
        dataSource: []
      },
      _greyClothCode: {
        prop: 'greyClothCode',
        itemType: 'select',
        label: '坯布/成品编码',
        clearable: true,
        filterable: true,
        placeholder: '请先输入坯布/成品编码',
        visibleChange: value => {
          // console.log(value)
        },
        focus: (e, scope, form, formDatas, setFormDatas) => {
          if (!formDatas.referenceOrder || formDatas.referenceOrder.label === null || formDatas.referenceOrder.label === '') {
            this.$message({ type: 'warning', message: '请先选择订单号' })
            return
          } else {
            this.getGreyClothCodesSelect({ orderId: formDatas.referenceOrder.value })
          }
        },
        dataSource: []
      },
      _referenceContent: {
        prop: 'referenceContent',
        itemType: 'select',
        label: '参考内容',
        clearable: true,
        filterable: true,
        rules: [commonChangeReg],
        valueType: 'object',
        visibleChange: value => {
          this.getOptionConfigSelect({ pageName: '样板开发单', fieldName: '参考内容' }, 'referenceContent')
        },
        dataSource: []
      },
      _remark: {
        prop: 'remark',
        itemType: 'input',
        type: 'textarea',
        label: '备注',
        clearable: true,
        maxlength: 50,
        trim: (value) => {
          return value
        }
      }
    }
    // 参板信息弹框配置
    const versionPopOptions = {
      itemType: 'drawer',
      visible: false,
      title: '新增参板信息',
      okText: '保存',
      ok: params => {
        const that = this
        const data = {
          referenceOrder: that.funscope(params.referenceOrder, 2),
          greyClothCode: params.greyClothCode || '',
          referenceContent: that.funscope(params.referenceContent, 2),
          remark: params.remark || '',
          code: params.code || ''
        }
        if (this.versionPopOptions.title === '新增参板信息') {
          this.versionData.push({ ...data, code: this.versionData.length + 1 })
        } else {
          this.versionData.splice(params.code, 1, data)
        }
        this.versionPopHandle()
      },
      cancel: params => {
        this.versionPopHandle()
      },
      formDatas: {},
      formOptions: {},
      content: versionContent
    }
    // 分页配置信息
    const pagination = {
      currentChange: val => {
        this.getListData({ pageSize: this.pagination.pageSize || 20, page: val })
      },
      sizeChange: val => {
        this.getListData({ page: this.pagination.page || 1, pageSize: val })
      }
    }
    return {
      versionData: [],
      versionColumns,
      versionOperatesData,
      versionOperates,
      versionPopOptions,
      versionContent,
      formDatas: {},
      formOptions: {
        size: 'small',
        inline: true
        // disabled: true
      },
      headerCellStyle,
      pagination
    }
  },
  watch: {
    isEdit: {
      handler(val) {
        if (val) {
          this.editChange()
        } else {
          this.changeOptionStatus()
        }
      },
      deep: true,
      immediate: true
    },
    versionData: {
      handler(val) {
        if (val) {
          this.syncMoudleDataHandle('referenceData', val)
        }
      },
      deep: true,
      immediate: true
    },
    data: {
      handler(v) {
        if (v) {
          this.versionData = this.$utils.deepClone(v)
        }
      },
      deep: true
    },
    rule: {
      handler(v) {

      },
      deep: true
    }
  },
  mounted() { },
  methods: {
    addReferenceVersionInfo() {
      this.versionPopHandle('新增参板信息')
      // this.encryptFn(this.versionContent, this.orderData['_rule'], 'add')
      this.encryptFn(this.versionPopOptions.content, this.rule, 'add')
      this.$set(this.versionPopOptions, 'content', this.versionContent)
      this.$set(this.versionPopOptions, 'formDatas', {})
    },
    editChange() {
      this.versionOperates = {
        label: '操作',
        width: '120',
        fixed: 'right',
        dataSource: this.versionOperatesData
      }
    },
    changeOptionStatus() {
      this.versionOperates = null
    },
    // 数组格式
    funscope(data, type = '1') {
      if (data && data.value) {
        return type === '1' ? [data] : data
      } else {
        return type === '1' ? [] : ''
      }
    },
    // 参板信息弹窗显隐
    versionPopHandle(val) {
      this.$set(this.versionPopOptions, 'visible', !this.versionPopOptions.visible)
      if (val) {
        this.$set(this.versionPopOptions, 'title', val)
      }
    },
    // 坯布编码下拉
    getGreyClothCodesSelect(data) {
      this.getGreyClothCodes(data).then(res => {
        this.$set(this.versionContent._greyClothCode, 'dataSource', res)
      })
    },
    // 点击编辑时处理数据
    setFormDatas(params, type) {
      setTimeout(() => {
        if (type === 'version') {
          this.$set(this.versionPopOptions, 'formDatas', params)
        }
      }, 0)
    },
    // 订单号下拉
    getOrderNoSelect() {
      this.getOrderNo().then(res => {
        this.$set(this.versionContent._referenceOrder, 'dataSource', res)
      })
    },
    getOptionConfigSelect(data, type) {
      this.getOptionConfig(data).then(res => {
        if (type === 'referenceContent') { // 参考内容
          this.$set(this.versionContent._referenceContent, 'dataSource', res)
        }
      })
    }

  }
}
</script>

<style lang="scss" scoped>
.order-item {
  padding: 0 10px;
  background: #ffffff;
  .header-top {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 15px 10px;
    span {
      font-size: 16px;
      display: flex;
      font-weight: 400;
    }
    .el-button {
      display: flex;
      span {
        font-size: 14px;
      }
    }
    .left {
      display: flex;
      align-items: center;
      .title {
        margin-right: 40px;
      }
      .date-title {
        position: relative;
        .item-title::before {
          display: block;
          content: '*';
          position: absolute;
          left: -8px;
          color: #ff4444;
        }
      }
    }
    .right {
      display: flex;
      align-items: center;
      .total {
        margin: 0 80px;
      }
    }
  }
  .page-table {
    height: auto;
    border-bottom-width: 1px;
  }
  .page-table-border{
    /deep/tbody .el-table__row td{
      border-bottom-width: 1px!important;
    }
  }
}
</style>
