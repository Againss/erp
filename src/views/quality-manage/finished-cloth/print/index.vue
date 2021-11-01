<template>
  <div class="yarn-dyeing-print-tableouts wrap-print">
    <cs-print :print.sync="qrPrint" :interval="50" :format="'a4'" :pop-options="{ drag: true }">
      <div slot="header" class="print-top-box yarn-dyeing-print" style="width: 210mm">
        <img src="@/assets/images/logo.png" class="img-logo">
        <div class="wrap-title"><span class="title1">佛山市智布互联纺织有限公司</span></div>
      </div>
      <div class="print-main print-main-border" style="width: 210mm">
        <div class="title3">成品物测报告</div>
        <div class="title4">
          <span>物测编码：{{ formDatas.physicalTaskNo }}</span>
          <span>创建人：{{ formDatas.createdByName || '' }}</span>
          <span>测试员：{{ formDatas.tester || '' }}</span>
        </div>
        <div class="title5">产品信息</div>
        <cs-custom-form :data-source="formDataSourse" :options="formOtions" :form-datas="formDatas" />
        <div class="title5" style="margin-top:-1px;">检测信息</div>
        <cs-custom-table
          tooltip-effect="light"
          :columns="columns"
          :header-cell-style="{ textAlign: 'center' }"
          :cell-style="{ textAlign: 'center', background: '#fff' }"
          :data-source="dataSource"
          :border="true"
          :span-method="spanMethod"
        />

        <div class="remarks">
          <div class="title5" style="margin-top:-1px;">检测结论</div>
          <cs-custom-form :data-source="formDataSourse1" :options="formOtions" :form-datas="basicData" />
        </div>
      </div>
      <div slot="footer" class="print-footer yarn-dyeing-print" style="width: 210mm">
        <div style="padding-left: 17px">公司地址：塱宝西路26号 同向新力国际企业园 4座北门6层</div>
        <div>公司电话：(+86)755-2660 0227</div>
        <div>公司网址：www.sfabric.com</div>
      </div>
    </cs-print>
    <div class="print-foots yarn-dyeing-print">
      <el-button @click="qrPrintHandle">打印</el-button>
      <el-button @click="pintBack">关闭</el-button>
    </div>
  </div>
</template>

<script>
import { getPhysicalInfo } from '../detail/api/index.js'
export default {
  data() {
    // 单元格合并
    const spanMethod = ({ row, column, rowIndex, columnIndex }) => {
      const dataList = this.dataSource
      const mergingRows = this.getSpanArr(dataList)
      if (columnIndex === 0 || columnIndex === 1) {
        const _row = mergingRows[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
        }
      }
    }
    const formDataSourse = [
      {
        prop: 'produceOrderCode',
        itemType: 'itemview',
        label: '生产订单',
        className: 'text-center',
        readonly: true,
        renderContent(value, options, form, formDatas, setFormDatas, scope) {
          return value ? `<div class="render-content" title='${value}' >${value}</div>` : ''
        }
      },
      {
        prop: 'dyelotNo',
        itemType: 'itemview',
        label: '缸号',
        readonly: true,
        renderContent(value, options, form, formDatas, setFormDatas, scope) {
          return value ? `<div class="render-content" title='${value}' >${value}</div>` : ''
        }
      },
      {
        prop: 'fabricType',
        itemType: 'itemview',
        label: '布类',
        readonly: true,
        renderContent(value, options, form, formDatas, setFormDatas, scope) {
          return value ? `<div class="render-content" title='${value}' >${value}</div>` : ''
        }
      },
      {
        prop: 'productSize',
        itemType: 'itemview',
        label: '成品规格',
        readonly: true,
        renderContent(value, options, form, formDatas, setFormDatas, scope) {
          if (formDatas.realWidth) {
            return formDatas.realWidth + (formDatas.unit === 2 ? 'cm' : '"') + '-' + formDatas.realWeight + 'g/m²'
          }
        }
      },
      {
        prop: 'composition',
        itemType: 'itemview',
        label: '成份比例',
        readonly: true,
        renderContent(value, options, form, formDatas, setFormDatas, scope) {
          return value ? `<div class="render-content" title='${value}' >${value}</div>` : ''
        }
      },
      {
        prop: 'customerColor',
        itemType: 'itemview',
        label: '客户颜色',
        readonly: true,
        renderContent(value, options, form, formDatas, setFormDatas, scope) {
          return value ? `<div class="render-content" title='${value}' >${value}</div>` : ''
        }
      },
      {
        prop: 'isHeadBatch',
        itemType: 'itemview',
        label: '是否头缸',
        readonly: true,
        renderContent(value, options, form, formDatas, setFormDatas, scope) {
          return value ? `<div class="render-content" title='${value === 1 ? '是' : '否'}' >${value === 1 ? '是' : '否'}</div>` : ''
        }
      },
      {
        prop: 'brandName',
        itemType: 'itemview',
        label: '品牌商',
        readonly: true,
        renderContent(value, options, form, formDatas, setFormDatas, scope) {
          return value ? `<div class="render-content" title='${value}' >${value}</div>` : ''
        }
      },
      {
        prop: 'sku',
        itemType: 'itemview',
        label: ' ',
        readonly: true
      }
    ]
    // 表格表头的配置信息
    const columns = [
      {
        prop: 'firstItem',
        label: '一级项目'
      },
      {
        prop: 'testMethod',
        label: '测试方法'
      },
      {
        prop: 'secondItem',
        label: '二给项目'
      },
      {
        prop: 'claim',
        label: '要求'
      },
      {
        prop: 'remarks',
        label: '备注'
      },
      {
        prop: 'result',
        label: '结果'
      },
      {
        prop: 'singleJudgment',
        label: '单项判定',
        formater: (value, options, form, formDatas, setFormDatas, scope) => {
          const str = value.row.singleJudgment ? value.row.singleJudgment + '' : ''
          const obj = {
            '1': { text: 'Fail', color: '#0986FF' },
            '2': { text: 'Pass', color: '#FF9214' },
            '3': { text: '/', color: '#474747' }
          }
          return str ? `<div class="render-content">${obj[str].text}</div>` : ''
        }
      }
    ]
    // 表格表头的配置信息

    const formDataSourse1 = [
      {
        prop: 'result',
        itemType: 'itemview',
        label: '物测结果',
        className: 'text-center',
        readonly: true,
        itemStyle: { width: '30%' },
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          value = value ? value + '' : ''
          const obj = {
            '1': { text: 'Fail', color: '#0986FF' },
            '2': { text: 'Pass', color: '#FF9214' },
            '3': { text: '/', color: '#474747' }
          }
          return value ? `<div class="render-content" >${obj[value].text}</div>` : ''
        }
      },
      {
        prop: 'reviewUserName',
        itemType: 'itemview',
        label: '审核人',
        readonly: true,
        itemStyle: { width: '35%' },
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return formDatas.reviewUserName ? `<div class="render-content" title='${formDatas.reviewUserName}' >${formDatas.reviewUserName}</div>` : ''
        }
      },
      {
        prop: 'reviewTime',
        itemType: 'itemview',
        label: '审核时间',
        readonly: true,
        itemStyle: { width: '35%' },
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return value ? this.$filters.parseTime(value + '', '{y}-{m}-{d} {h}:{i}') : ''
        }
      },
      {
        prop: 'reviewComments',
        itemType: 'itemview',
        label: '审批意见',
        readonly: true,
        itemStyle: { width: '100%' },
        style: { width: '100%' },
        className: 'remarks',
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return formDatas.reviewComments ? `<div class="render-content" title='${formDatas.reviewComments}' >${formDatas.reviewComments}</div>` : ''
        }
      }
    ]

    return {
      baseInfo: {},
      formOtions: {
        inline: true
      },
      formDataSourse,
      formDataSourse1,
      formDatas: {},
      basicData: {},
      columns,
      dataSource: [],
      qrPrint: false,
      spanArr: [], // 遍历数据时，根据相同的标识去存储记录
      pos: 0, // 二维数组的索引
      spanMethod
    }
  },
  computed: {},
  created() {
    this.getInfo()
    this.getSpanArr(this.dataSource)
  },
  mounted() {
    this.$nextTick(() => {
      // this.qrPrint = true
    })
  },
  methods: {
    qrPrintHandle() {
      this.qrPrint = true
    },
    pintBack() {
      this.$router.go(-1)
    },
    async getInfo() {
      const res = await getPhysicalInfo({ physicalTaskNo: this.$route.params.id })
      const datas = res.data || {}
      if (datas && datas.physicalInformation) {
        this.dataSource = datas.physicalInformation.items || []
      }
      this.formDatas = {
        ...datas,
        ...datas.qaCustomerOrderInfoResponse,
        ...datas.qaGreigeInspectionInfoResponse,
        ...datas.physicalInformation
      }
      this.basicData = {
        createdByName: (datas.qaGreigeInspectionInfoResponse && datas.qaGreigeInspectionInfoResponse.createdByName) || '', // 创建人
        createdTime: (datas.qaGreigeInspectionInfoResponse && datas.qaGreigeInspectionInfoResponse.createdTime) || '', // 创建时间
        tester: (datas.physicalInformation && datas.physicalInformation.tester) || '', // 测试员
        dealTime: (datas.physicalInformation && datas.physicalInformation.dealTime) || '', // 测试时间
        reviewUserName: (datas.physicalInformation && datas.physicalInformation.reviewUserName) || '', // 审核人
        reviewTime: (datas.physicalInformation && datas.physicalInformation.reviewTime) || '', // 审核时间
        result: (datas.physicalInformation && datas.physicalInformation.result) || '',
        remarks: (datas.physicalInformation && datas.physicalInformation.remarks) || '',
        reviewComments: (datas.physicalInformation && datas.physicalInformation.reviewComments) || ''
      }
    },
    // 处理表格的合并的数据，找到要合并的数组
    getSpanArr(data) {
      var spanArr = []
      var pos = 0
      data.forEach((item, index) => {
        if (index === 0) {
          spanArr.push(1)
          pos = 0
        } else {
          if (data[index].firstItemId === data[index - 1].firstItemId) {
            spanArr[pos] += 1
            spanArr.push(0)
          } else {
            spanArr.push(1)
            pos = index
          }
        }
      })
      return spanArr
    }
  }
}
</script>

<style lang="scss" scoped>
.yarn-dyeing-print-tableouts {
  box-sizing: border-box;
  margin: 20px;
  width: 210mm;
  background: #fff;
}
.print-main {
  padding: 8mm;
  padding-top: 0;
  /deep/ .el-form-item__content {
    font-size: 12px;
  }
  /deep/ .el-form-item__label {
    font-size: 12px;
    font-weight: 400;
  }
  /deep/ .el-table th > .cell {
    font-weight: 400;
    font-size: 12px;
  }
  /deep/ .el-table--medium td {
    padding: 4px 0;
  }
  /deep/ .el-table--medium th {
    padding: 4px 0;
  }
  /deep/ .cell {
    font-size: 12px;
  }
}
.print-top-box.yarn-dyeing-print {
  display: flex;
  align-items: center;
  height: 55px;
  padding: 0 8mm;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 2mm;
  .img-logo {
    width: 26px;
    height: 26px;
  }
  .wrap-title {
    margin-left: 15px;
    flex: 1;
    .title1 {
      color: #151222;
      font-size: 14px;
      font-weight: 400;
    }
  }
}
.title2 {
  color: #474747;
  font-size: 12px;
  line-height: 20px;
  margin-top: 4px;
}
.title3 {
  color: #151222;
  font-size: 20px;
  color: #151222;
  font-weight: 600;
  text-align: center;
  margin-bottom: 20px;
}
.title4 {
  color: #474747;
  font-size: 12px;
  display: flex;
  justify-content: space-between;
}

.title5 {
  width: 100%;
  text-align: center;
  color: #151222;
  font-size: 14px;
  font-weight: 600;
  border: 1px solid #e6ebf5;
  margin-top: 10px;
  height: 40px;
  line-height: 40px;
  padding: 0 10px;
  border-bottom: 0;
}
.print-footer.yarn-dyeing-print {
  border-top: 1px solid #f0f0f0;
  height: 56px;
  line-height: 56px;
  font-size: 12px;
  color: #474747;
  padding: 0;
  margin: 0;
  text-align: left;
  > div {
    display: inline-block;
    margin-right: 16px;
  }
}
.print-foots.yarn-dyeing-print {
  background: #eef5f9;
  height: 42px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
<style lang="scss">
.print-main-border {
  .el-form-item__content {
    span,
    div {
      overflow: inherit !important;
      text-overflow: inherit !important;
      white-space: inherit !important;
      line-height: 24px !important;
    }
  }
  .el-form-item {
    width: 33.3%;
    margin: 0;
    .el-form-item__label-wrap {
      width: 80px;
      text-align: center;
      margin-left: -1px !important;
      margin-top: -1px;
      .el-form-item__label {
        color: #151222;
        padding-right: 0;
      }
    }
    .el-form-item__content > .el-input [readonly='readonly'] {
      padding: 0;
      border: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      background: #ffffff;
      text-align: center;
      color: inherit;
    }
    .el-form-item__label-wrap,
    .el-form-item__content {
      border: 1px solid #dfe6ec;
      margin-top: -1px;
      display: flex;
      align-items: center;
      padding: 0 5px;
      box-sizing: border-box;
      margin-left: -1px !important;
      > div {
        text-align: center;
      }
    }
  }
  .custom-form {
    border-top: 1px solid #dfe6ec;
    border-left: 1px solid #dfe6ec;
  }
  .el-table tr {
    background-color: #fff !important;
  }
  .el-form-item__content {
    span {
      position: relative;
      overflow: inherit;
      text-overflow: inherit;
      white-space: inherit;
      line-height: 20px;
      display: inline-block;
      word-break: break-all;
    }
  }
  .el-form-item__content > div {
    text-align: left !important;
  }
  .render-content {
    position: relative;
    overflow: inherit;
    text-overflow: inherit;
    white-space: inherit;
    line-height: 20px;
    display: inline-block;
    word-break: break-all;
  }
  .remarks {
    .el-form-item:nth-child(3) {
      .el-form-item__label-wrap {
        // width: 25%;
      }
    }
  }
}
</style>
