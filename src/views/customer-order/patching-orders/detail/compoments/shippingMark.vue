<!--
 * @Author: xj
 * @Description: 船唛信息
 * @Date: 2021-04-18 09:48:43
 * @LastEditors: Againss
 * @LastEditTime: 2021-07-07 10:06:57
-->
<template>
  <!-- 参板信息 -->
  <div class="order-item order_shippingMarkDom">
    <div class="product-header">
      <span style="border-bottom: 1px solid #EEEFF0;display: block;padding-bottom: 15px;width: 100%;font-weight: 400;">船唛信息</span>
    </div>
    <div class="page-table page-table-border" style="padding: 0 10px;">
      <cs-custom-form ref="basicData" :data-source="addData" :options="formOptions" :form-datas="baseFormDatas" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'ShippingMarkDom',
  components: {},
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
    // 公用验证正则
    const itemStyle = { 'width': '33%', 'margin-bottom': 0 }
    const addData = {
      _clothNameZn: {
        prop: 'clothNameZn',
        itemType: this.inputTypeChange,
        className: 'inputWidth',
        itemStyle,
        label: '布类名称(中):',
        maxlength: '20',
        itemProp: 'clothNameZn',
        clearable: true,
        disabled: false
        // rules: [commonBlurReg]
      },
      _clothNameEn: {
        prop: 'clothNameEn',
        itemType: this.inputTypeChange,
        className: 'inputWidth',
        itemStyle,
        itemProp: 'clothNameEn',
        label: '布类名称(英):',
        maxlength: '20',
        clearable: true,
        disabled: false
        // rules: [commonBlurReg]
      }
    }
    return {
      formOptions: {
        size: 'small',
        popError: true,
        hideRequiredAsterisk: false,
        labelWidth: '106px',
        headerCellClassName: this.isSing,
        inline: true,
        syncDataHandle: (syncData) => {
          console.log(syncData)
          this.syncMoudleDataHandle('shippingMarkDom', syncData)
        }
      },
      baseFormDatas: {
        clothNameZn: '',
        clothNameEn: ''
      },
      addData
    }
  },
  watch: {
    isEdit: {
      handler(val) {
        if (val) {
          this.editChange()
        }
        this.formOptions.hideRequiredAsterisk = !val
      },
      deep: true,
      immediate: true
    },
    data: {
      handler(v) {
        if (v) {
          this.baseFormDatas = v
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
    isSing(scope) {
      if (['clothNameZn', 'clothNameEn'].includes(scope.column.property) && this.isEdit) {
        return 'isSing'
      }
    },

    // 编辑状态
    editChange(data) {
      for (const key in this.addData) {
        this.addData[key].disabled = false
      }
    },
    inputTypeChange() {
      return 'itemview'
    }
  }
}
</script>

<style lang="scss">
  .order_shippingMarkDom{
    background: #ffffff;
    .product-header {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      span {
        font-size: 16px;
      }
    }
    table th.isSing div:before {
      content: '*';
      color: red;
    }
  }
</style>
<style lang="scss" scoped>
</style>
