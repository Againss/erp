<template>
  <div class="info-box">
    <cs-custom-form
      :data-source="applyInfoData"
      :options="formOtions"
      :form-datas="formDatas"
    />
  </div>
</template>

<script>
import uploadFile from './upload-file'
export default {
  name: 'AInfo',
  data() {
    // 公用验证正则
    // const commonChangeReg = this.$getRules({})
    // 公用组件样式
    const style = {
      'width': '100%',
      'font-size': '16px',
      'color': '#151222',
      'border-bottom': '1px #EEEFF0 solid',
      'padding': '20px 0 16px 20px',
      'margin-bottom': '16px'
    }
    const style1 = {
      'display': 'inline-block',
      'width': '96px',
      'fontSize': '14px',
      'marginTop': '10px',
      'textAlign': 'right',
      'padding-right': '10px',
      'color': '#888E9E'
    }
    const applyInfoData = [
      {
        itemType: 'view',
        text: '申请信息',
        style
      },
      {
        prop: 'id',
        itemType: 'input',
        itemStyle: { 'width': '22%', 'marginLeft': '2%' },
        label: '申请编号',
        title: true,
        showOverflowTooltip: true,
        readonly: true
      },
      {
        prop: 'brandName',
        itemType: 'input',
        itemStyle: { 'width': '25%', 'marginRight': 0 },
        label: '品牌商',
        title: true,
        showOverflowTooltip: true,
        readonly: true
      },
      {
        prop: 'sellerName',
        itemType: 'input',
        itemStyle: { 'width': '25%', 'marginRight': 0 },
        label: '销售员',
        readonly: true
      },
      {
        prop: 'sellerTeamName',
        itemType: 'input',
        itemStyle: { 'width': '25%', 'marginRight': 0 },
        label: '销售团队',
        title: true,
        showOverflowTooltip: true,
        readonly: true
      },
      {
        prop: 'sampleId',
        itemType: 'input',
        itemStyle: { 'width': '22%', 'marginLeft': '2%' },
        label: '客来板编号',
        title: true,
        showOverflowTooltip: true,
        readonly: true
      },
      {
        prop: 'analysisTarget',
        itemType: 'input',
        itemStyle: { 'width': '25%', 'marginRight': 0 },
        label: '分析目的',
        title: true,
        showOverflowTooltip: true,
        readonly: true
      },
      {
        prop: 'targetCompletedTime',
        itemType: 'input',
        itemStyle: { 'width': '25%', 'marginRight': 0 },
        label: '要求完成时间',
        readonly: true
      },
      {
        prop: 'isExistSample',
        itemType: 'input',
        itemStyle: { 'width': '25%', 'marginRight': 0 },
        label: '是否有客样',
        readonly: true
      },
      {
        prop: 'requirement',
        itemType: 'input',
        itemStyle: { 'width': '47%', 'marginLeft': '2%' },
        label: '客户要求',
        title: true,
        showOverflowTooltip: true,
        readonly: true
      },
      {
        itemType: 'view',
        text: '附件',
        style: style1
      },
      {
        prop: 'attachmentName',
        itemType: 'input',
        itemStyle: { 'width': '50%', 'marginRight': 0, 'display': 'inline-block' },
        label: '附件：',
        className: 'infoFile',
        title: true,
        showOverflowTooltip: true,
        readonly: true,
        components: {
          uploadFile
        },
        componentsOptions: {
          url: 'attachment',
          prop: 'attachmentName'
        }
        // focus: val => {
        //   window.open(this.formDatas.attachment)
        // }
      }
    ]
    return {
      formOtions: {
        inline: true
      },
      applyInfoData,
      formDatas: {}
    }
  },
  computed: {
    form() {
      return this.$refs.pop
    }
  },
  methods: {

  }
}
</script>

<style lang="scss">
  .info-box {
    background: #ffffff;
    margin: 0 20px 15px;
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
  .info-box .el-form-item__content>.el-input [readonly=readonly] {
    padding: 0;
    border: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    background: #ffffff;
  }
</style>
