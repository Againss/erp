<template>
  <div style="width: 210mm;margin: 20px">
    <cs-print :print.sync="qrPrint" :interval="50" :format="'a4'">
      <div id="wrap-print" class="wrap-print">
        <img
          src="@/assets/images/logo.png"
          class="img-logo"
        >
        <div class="wrap-title">
          <span class="title1">佛山市智布互联纺织有限公司</span>
          <span class="title2">塱宝西路26号 同向新力国际企业园 4座北门6层<br>Tel:(+86)755-2660 0227<br>www.sfabric.com</span>
          <span class="title3">纱检测报告</span>
          <span class="title4">
            <span>检测编码：{{ $route.params.id }}</span>
            <span>申请人：{{ baseInfo.applyByName }}</span>
            <span>申请时间：{{ baseInfo.applyTime ? $filters.parseTime(baseInfo.applyTime, '{y}-{m}-{d} {h}:{i}') : '' }}</span>
          </span>
        </div>
        <cs-custom-form
          :data-source="formDataSourse"
          :options="formOtions"
          :form-datas="formDatas"
        />
        <div class="title5">检测项目/结果</div>
        <cs-custom-table
          tooltip-effect="light"
          :columns="columns"
          :header-cell-style="{textAlign: 'center'}"
          :cell-style="{textAlign: 'center'}"
          :data-source="dataSource"
          :border="true"
        />
        <div class="title5">评价信息</div>
        <cs-custom-table
          tooltip-effect="light"
          :columns="columns2"
          :header-cell-style="{textAlign: 'center'}"
          :cell-style="{textAlign: 'center'}"
          :data-source="dataSource2"
          :border="true"
        />
      </div>
    </cs-print>
  </div>
</template>

<script>
import { getSelectData, qaYarnInspectionPhysicalInfo } from '../detail/api/index.js'
export default {
  data() {
    const formDataSourse = [
      {
        prop: 'yarnBatch',
        itemType: 'itemview',
        label: '纱牌/纱批',
        showOverflowTooltip: true,
        className: 'text-center',
        readonly: true
      },
      {
        prop: 'yarnName',
        itemType: 'itemview',
        label: '纱名',
        showOverflowTooltip: true,
        readonly: true
      },
      {
        prop: 'spinningMethod',
        itemType: 'itemview',
        label: '纺纱方法',
        // showOverflowTooltip: true,
        readonly: true,
        renderContent: (value) => {
          return value && value.label
        }
      },
      {
        prop: 'cardingMethod',
        itemType: 'itemview',
        label: '梳棉方法',
        // showOverflowTooltip: true,
        readonly: true,
        renderContent: (value) => {
          return value && value.label
        }
      },
      {
        prop: 'yarnType',
        itemType: 'itemview',
        label: '纱类',
        // showOverflowTooltip: true,
        readonly: true,
        renderContent: (value) => {
          return value && value.label
        }
      },
      {
        prop: 'supplier',
        itemType: 'itemview',
        label: '供应商',
        // showOverflowTooltip: true,
        readonly: true,
        renderContent: (value) => {
          return value && value.label
        }
      },
      {
        prop: 'actualStorageWeight',
        itemType: 'itemview',
        label: '实际入库重量(KG)',
        // itemClassName: 'ooouioh',
        // showOverflowTooltip: true,
        readonly: true
      },
      {
        prop: 'stockInNo',
        itemType: 'itemview',
        label: '入库单号',
        // showOverflowTooltip: true,
        readonly: true,
        renderContent: (value) => {
          return value && value.label
        }
      },
      {
        prop: 'sku',
        itemType: 'itemview',
        label: '关联单号',
        // showOverflowTooltip: true,
        readonly: true,
        renderContent: (value) => {
          return value && value.label
        }
      },
      {
        prop: 'executiveStandard',
        itemType: 'itemview',
        label: '执行标准',
        // showOverflowTooltip: true,
        readonly: true,
        renderContent: (value) => {
          return value && value.label
        }
      },
      {
        prop: 'reportTypeId',
        itemType: 'itemview',
        label: '报告类型',
        // showOverflowTooltip: true,
        readonly: true,
        renderContent: (value) => {
          return value === '1' ? '内部报告' : '供应商报告'
        }
      },
      {
        prop: 'grade',
        itemType: 'itemview',
        label: '综合等级',
        // showOverflowTooltip: true,
        className: 'red',
        readonly: true
      }
    ]
    // 表格表头的配置信息
    const columns = [
      {
        prop: 'index',
        label: '序号',
        width: '70'
      },
      {
        prop: 'testItemsName',
        label: '检测项目',
        minWidth: '150'
        // showOverflowTooltip: true
      },
      {
        prop: 'result',
        label: '检测结果',
        minWidth: '150'
        // showOverflowTooltip: true
      },
      {
        prop: 'grade',
        label: '等级',
        minWidth: '150'
        // showOverflowTooltip: true
      },
      {
        prop: 'standardRangeReference',
        label: '标准范围参考',
        minWidth: '150'
        // showOverflowTooltip: true
      }
    ]
    // 表格表头的配置信息
    const columns2 = [
      {
        prop: 'createdByName',
        label: '评论人',
        width: '100'
      },
      {
        prop: 'createdTime',
        label: '时间',
        width: '200',
        // showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row[scope.column.property] ? this.$filters.parseTime(
            scope.row[scope.column.property], '{y}-{m}-{d} {h}:{i}') : ''
        }
      },
      {
        prop: 'commentsContent',
        label: '评论意见',
        minWidth: '150'
        // showOverflowTooltip: true
      }
    ]
    return {
      baseInfo: {},
      formOtions: {
        inline: true
      },
      formDataSourse,
      formDatas: {},
      columns,
      dataSource: [],
      columns2,
      dataSource2: [],
      qrPrint: false
    }
  },
  computed: {
  },
  created() {
    this.getInfo()
    // setTimeout(() => {
    // window.document.body.innerHTML = document.getElementById('wrap-print').innerHTML
    // window.print()

    // var pwin = window.open('Print.html', '_self', 'print')
    // pwin.document.write(document.getElementById('wrap-print').innerHTML)
    // this.qrPrint = true
    // }, 1000)
  },
  methods: {
    async getInfo() {
      const selectData = await getSelectData({ categoryId: 10 }) // 捻向
      const params = {
        yarnUuid: this.$route.params.id,
        version: this.$route.params.version || '1'
      }
      const res = await qaYarnInspectionPhysicalInfo(params)
      // console.log(res)
      this.baseInfo = res.data || {}
      this.formDatas = this.baseInfo.inspection
      this.formDatas.grade = this.baseInfo.internalGrade || this.baseInfo.supplierGrade
      this.formDatas.executiveStandard = this.baseInfo.executiveStandard
      this.formDatas.reportTypeId = this.baseInfo.reportTypeId
      const reportTypeId = this.baseInfo.reportTypeId || ''
      // 纱名
      this.formDatas.yarnName = ''
      if (this.formDatas.yarnCount && this.formDatas.yarnCount.label) this.formDatas.yarnName += this.formDatas.yarnCount.label
      if (this.formDatas.ingredients && this.formDatas.ingredients.label) this.formDatas.yarnName += ' ' + this.formDatas.ingredients.label
      if (this.formDatas.proportion) this.formDatas.yarnName += ' ' + this.formDatas.proportion
      this.dataSource = this.baseInfo.inspectionPhysicalInformations || []

      // result
      // grade
      // standardRangeReference

      for (let i = 0; i < this.dataSource.length; i++) {
        this.dataSource[i].index = i + 1
        this.dataSource[i].result = this.dataSource[i].internalDetectionResult || this.dataSource[i].supplierDetectionResult
        this.dataSource[i].grade = reportTypeId === '1' ? this.dataSource[i].internalGrade : this.dataSource[i].supplierGrade
        if (reportTypeId === '1') {
          this.dataSource[i].result = this.dataSource[i].internalDetectionResult
        } else {
          this.dataSource[i].result = this.dataSource[i].supplierDetectionResult
        }

        // 捻向
        if (this.dataSource[i].testItemsId === 'wistDirection') {
          for (let j = 0; j < selectData.length; j++) {
            if (selectData[j].value === this.dataSource[i].result) {
              this.dataSource[i].result = selectData[j].label
              break
            }
          }
        }
      }
      console.log(this.dataSource)
      this.dataSource2 = this.baseInfo.inspectionComments || []
      this.$nextTick(() => {
        this.qrPrint = true
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.wrap-print {
  width: 210mm;
  position: relative;
  box-sizing: border-box;
  background-color: #fff;
  padding: 20px;
  .img-logo {
    position: absolute;
    top: 20px;
    left: 20px;
    width: 39px;
    height: 39px;
  }
  .wrap-title {
    display: flex;
    flex-direction: column;
    text-align: center;
    .title1 {
      color: #151222;
      font-size: 21px;
      font-weight: bold;
      margin-bottom: 7px;
    }
    .title2 {
      color: #474747;
      font-size: 12px;
      line-height: 20px;
    }
    .title3 {
      color: #151222;
      font-size: 16px;
      font-weight: bold;
      margin: 20px 0 15px;
    }
    .title4 {
      color: #474747;
      font-size: 12px;
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
    }
  }
  .title5 {
    width: 100%;
    text-align: center;
    color: #151222;
    font-size: 14px;
    font-weight: bold;
    margin: 8px 0;
  }
}
</style>
<style lang="scss">
.wrap-print {
  .el-form-item__content{
    span,div{
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
      width: 50%;
      text-align: center;
      margin-left: 0 !important;
      .el-form-item__label {
        color: #151222;
        font-weight: bold;
        padding-right: 0;
      }
    }
    .el-form-item__content > .el-input [readonly="readonly"] {
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
      border-right: 1px solid #dfe6ec;
      border-bottom: 1px solid #dfe6ec;
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
  .el-form-item__content{
    span{
      position: relative;
      overflow: inherit;
      text-overflow: inherit;
      white-space: inherit;
      line-height: 24px;
      display: inline-block;
    }
  }
}

</style>
