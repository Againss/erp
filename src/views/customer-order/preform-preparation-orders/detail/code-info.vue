/**
 * @Description: 编码提示文字
 * @author Roman
 * @date 2021-05-06 15:18:38
 * @edit 2021-05-06 15:18:38
*/
<template>
  <!-- 原料信息 -->
  <div class="codeInfoOut">
    <cs-custom-form ref="codeInfo" :data-source="codeInfoDataSource" :options="formOptions" :form-datas="formDatas" />
  </div>
</template>

<script>
export default {
  name: 'CodeInfo',
  props: {
    isEdit: {
      type: Boolean
    },
    hasDetail: {
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
    const codeInfoDataSource = {
      _colorFabricCode: {
        prop: 'colorClothCode',
        itemType: 'itemview',
        // className: 'viewStyle',
        itemStyle: { 'width': '40%' },
        label: '参考色布/印花布编码:',
        labelWidth: '150px',
        // valueType: 'object',
        clearable: true,
        disabled: true,
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return value
        }
      },
      _greyClothCode: {
        prop: 'greyClothCode',
        itemType: 'itemview',
        // className: 'viewStyle',
        // itemStyle: { 'width': '30%' },
        label: '坯布编码:',
        // valueType: 'object',
        clearable: true,
        disabled: true,
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return value
        }
      }
    }
    return {
      formDatas: {},
      codeInfoDataSource,
      formOptions: {
        size: 'small',
        showMessage: false,
        inline: true,
        className: 'codeInfo',
        syncDataHandle: (syncData) => {
          // console.log(syncData)
          // this.syncMoudleDataHandle('productData', syncData)
        }
      }
    }
  },
  computed: {},
  watch: {
    isEdit: {
      handler(val, oldVal) {

      },
      deep: true,
      immediate: true
    },
    data: {
      handler(v) {
        if (v) {
          // console.log(v)
          const { colorClothCode, greyClothCode, dyeTech, printTech } = v
          this.formDatas = { colorClothCode, greyClothCode, dyeCraft: dyeTech, printCraft: printTech }
          // console.log(this.formDatas)
        }
      },
      deep: true,
      immediate: true
    },
    rule: {
      handler(v) { },
      deep: true
    }
  },
  created() {

  },
  mounted() { },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
.codeInfoOut{
    padding: 10px 0px;
}
.custom-form /deep/ .codeInfo.el-form.el-form--inline .el-form-item{
    margin-bottom:0px
}

.custom-form /deep/ .codeInfo.el-form.el-form--inline{
  // justify-content: space-between;
}
</style>
