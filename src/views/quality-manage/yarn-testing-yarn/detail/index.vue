<template>
  <div class="yarn-testing-yarn-detail">
    <div class="card">
      <div class="card-title">基本信息</div>
      <cs-custom-form
        :data-source="baseDataSource"
        :options="baseOptions"
        :form-datas="baseDatas"
      />
    </div>
    <div class="edit-table card ">
      <div class="card-title">试纱信息</div>

      <cs-custom-form
        :data-source="yarnTestSource"
        :options="yarnTestOptions"
        :form-datas="yarnTests"
      />
      <div class="yarn-info yarn-disable">
        <div class="quality-table">
          <cs-custom-form
            ref="yarnForm"
            :data-source="yarnCommon"
            :options="formOptions"
            :form-datas="yarnData"
          />
        </div>
      </div>
    </div>
    <div class="edit-table card">
      <div class="card-title">物测信息</div>
      <cs-custom-form
        :data-source="physicalSource"
        :options="baseOptions"
        :form-datas="physicalDatas"
      />
      <div class="yarn-info yarn-disable">
        <div class="quality-table">
          <cs-custom-form
            ref="detailTable"
            :data-source="resContent"
            :form-datas="resFormDatas"
            :options="resFormOptions"
          />
        </div>
      </div>
      <div class="card-bottom">
        <div class="row">
          <label>内测综合等级：</label><span>{{ internalGrade || '' }}</span>
        </div>
        <div class="row">
          <label>供应商综合等级： </label><span>{{ supplierGrade }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { checkDetail, getSelectData } from './api/index.js'
import { yarnInfo } from './component/yarn-info.js'
export default {
  mixins: [yarnInfo],
  data() {
    // 基本信息
    const baseDataSource = {
      _yarnUuid: {
        prop: 'skuId', //
        itemType: 'itemview',
        label: '纱线编号：',
        itemStyle: { width: '24%' }
      },
      _yarnCountName: {
        prop: 'yarnCountName',
        itemType: 'itemview',
        label: '纱支：',
        itemStyle: { width: '24%' }
      },
      _ingredientsName: {
        prop: 'ingredientsName',
        itemType: 'itemview',
        label: '成份：',
        itemStyle: { width: '24%' }
      },
      _proportion: {
        prop: 'proportion',
        itemType: 'itemview',
        label: '比例：',
        itemStyle: { width: '24%' }
      },
      _spinningMethodName: {
        prop: 'spinningMethodName',
        itemType: 'itemview',
        label: '纺纱方法：',
        itemStyle: { width: '24%' }
      },
      _cardingMethodName: {
        prop: 'cardingMethodName',
        itemType: 'itemview',
        label: '梳棉方法：',
        itemStyle: { width: '24%' }
      },
      _yarnTypeName: {
        prop: 'yarnTypeName',
        itemType: 'itemview',
        label: '纱类：',
        itemStyle: { width: '24%' }
      },
      _supplierName: {
        prop: 'supplierName',
        itemType: 'itemview',
        label: '供应商：',
        itemStyle: { width: '24%' }
      },
      _yarnBatch: {
        prop: 'yarnBatch',
        itemType: 'itemview',
        label: '纱牌、纱批：',
        itemStyle: { width: '24%' }
      },
      _batchNo: {
        prop: 'batchNo',
        itemType: 'itemview',
        label: '批次号：',
        itemStyle: { width: '24%' }
      },
      _stockInNo: {
        prop: 'stockInNo',
        itemType: 'itemview',
        label: '入库单号：',
        itemStyle: { width: '24%' }
      },
      _stockOutNo: {
        prop: 'stockOutNo',
        itemType: 'itemview',
        label: '出库单号：',
        itemStyle: { width: '24%' }
      },
      _relationNo: {
        prop: 'relationNo',
        itemType: 'itemview',
        label: '关联单号：',
        itemStyle: { width: '24%' }
      },
      _actualStorageWeight: {
        prop: 'actualStorageWeight',
        itemType: 'itemview',
        label: '实际入库重量（KG）：',
        itemStyle: { width: '24%' }
      },
      _physicalApplyTime: {
        prop: 'physicalApplyTime',
        itemType: 'itemview',
        label: '物测时间：',
        itemStyle: { width: '24%' }
      },
      _testingApplyTime: {
        prop: 'testingApplyTime',
        itemType: 'itemview',
        label: '试纱时间：',
        itemStyle: { width: '24%' }
      }
    }

    // 试纱信息
    const yarnTestSource = {
      _yarnUuid: {
        prop: 'yarnUuid', //
        itemType: 'itemview',
        label: '试纱编号：',
        readonly: true,
        itemStyle: { width: '24%', color: '#1890ff !important', cursor: 'pointer' },
        handle: scope => {
          this.$router.push(`../detail?id=${scope}&show=detail`)
        }
      },
      _dyeingFactoryName: {
        prop: 'dyeingFactoryName', //
        itemType: 'itemview',
        label: '染厂：',
        readonly: true,
        itemStyle: { width: '24%' }
      },
      _colorName: {
        prop: 'colorName', //
        itemType: 'itemview',
        label: '搭染颜色：',
        readonly: true,
        itemStyle: { width: '24%' }
      },
      _status: {
        prop: 'status', //
        itemType: 'itemview',
        label: '状态：',
        readonly: true,
        itemStyle: { width: '24%' }
      }
    }

    // 物测信息
    const physicalSource = {
      _yarnUuid: {
        prop: 'yarnUuid', //
        itemType: 'itemview',
        label: '物测编号：',
        readonly: true,
        itemStyle: { width: '24%', color: '#1890ff', cursor: 'pointer' },
        handle: scope => {
          this.$router.push(`../quality-yarn-edit/${scope}`)
        }
      },
      _executiveStandardName: {
        prop: 'executiveStandardName', //
        itemType: 'itemview',
        label: '执行标准：',
        readonly: true,
        itemStyle: { width: '24%' }
      },
      _reportTypeName: {
        prop: 'reportTypeName', //
        itemType: 'itemview',
        label: '报告类型：',
        readonly: true,
        itemStyle: { width: '24%' }
      },
      _status: {
        prop: 'status', //
        itemType: 'itemview',
        label: '状态：',
        readonly: true,
        itemStyle: { width: '24%' }
      }
    }
    // const physicalDatas = {
    //   yarnUuid: 'CSAA80A02',
    //   executiveStandardName: '隆丰',
    //   reportTypeName: '单染棉；深',
    //   status: '进行中'
    // }

    const columns = {
      _testItemsName: {
        prop: 'testItemsName',
        label: '检测项目'
      },
      _standardRangeReference: {
        prop: 'standardRangeReference',
        label: '标准范围参考'
      },
      _supplierDetectionResult: {
        prop: 'supplierDetectionResult',
        label: '检测结果（供应商）'
      },
      _supplierGrade: {
        prop: 'supplierGrade',
        label: '供应商等级'
      },
      _internalDetectionResult: {
        prop: 'internalDetectionResult',
        label: '检测结果（内测）'
      },
      _internalGrade: {
        prop: 'internalGrade',
        label: '内测等级'
      }
    }
    const resContent = {
      _tableFormV: {
        prop: 'tableFormV',
        border: true,
        itemStyle: { marginBottom: 0 },
        itemType: 'table-form',

        headerCellStyle: { 'background-color': '#F5F7FA' },
        className: 'pop-table',
        dataSource: [],
        columns: columns
      }
    }
    return {
      baseOptions: {
        inline: true,
        className: 'msg-content'
      },
      formOptions: {
        inline: true,
        labelWidth: '150px'
      },
      resContent,
      resFormDatas: {},
      resFormOptions: {},
      baseDataSource,
      baseDatas: {},
      yarnTestSource,
      yarnTests: {},
      yarnTestOptions: {
        inline: true,
        className: 'msg-content'
      },
      physicalSource,
      physicalDatas: {},
      columns,
      dataSource: [],
      yarnDataSource: [],
      yarnData: {},
      supplierGrade: '',
      internalGrade: ''
    }
  },
  created() {
    this.getInfo()
  },
  mounted() {},
  methods: {
    async getInfo() {
      const params = {
        id: this.$route.query.id
      }
      const res = await checkDetail(params)

      this.detailInfo = res.data
      const inspectionPhysicalInformations =
        res.data.physicalInspection.inspectionPhysicalInformations // 物测信息
      this.supplierGrade = this.detailInfo.physicalInspection.supplierGrade
      this.internalGrade = this.detailInfo.physicalInspection.internalGrade
      this.baseDatas = res.data.inspection

      this.baseDatas.physicalApplyTime = res.data.physicalInspection.applyTime
        ? this.$filters.parseTime(
          res.data.physicalInspection.processedTime,
          '{y}-{m}-{d} {h}:{i}'
        )
        : ''
      this.baseDatas.testingApplyTime = res.data.testingInspection.processedTime
        ? this.$filters.parseTime(
          res.data.testingInspection.processedTime,
          '{y}-{m}-{d} {h}:{i}'
        )
        : ''
      const colorName = res.data.testingInspection.colorName
        ? JSON.parse(res.data.testingInspection.colorName)
        : []
      let colorNameStr = ''
      for (let i = 0; i < colorName.length; i++) {
        if (colorNameStr === '') {
          colorNameStr = colorName[i].label
        } else {
          colorNameStr = colorNameStr + '/' + colorName[i].label
        }
      }
      this.yarnTests = {
        yarnUuid: res.data.testingInspection.yarnUuid,
        dyeingFactoryName: res.data.testingInspection.dyeingFactoryName,
        colorName: colorNameStr,
        status: this.getStatus(res.data.testingInspection.status)
      }
      const reportTypeName =
        res.data.physicalInspection.status === 3
          ? '供应商报告'
          : res.data.physicalInspection.status === 1
            ? '内部报告'
            : ''
      this.physicalDatas = {
        yarnUuid: res.data.physicalInspection.yarnUuid,
        executiveStandardName:
          res.data.physicalInspection.executiveStandardName,
        reportTypeName: res.data.physicalInspection.reportTypeName
          ? res.data.physicalInspection.reportTypeName
          : reportTypeName,
        status: this.getStatus(res.data.physicalInspection.status)
      }

      const tempData = res.data.testingInspection.inspectionTestingInformations

      const columns = ['name', 'grey']
      this.$set(this.yarnCommon._tableForm, 'columns', [
        {
          prop: 'name',
          label: '疵点项目/流程',
          showOverflowTooltip: true,
          className: '',
          minWidth: 100
        },
        {
          prop: 'grey',
          label: '坯布',
          showOverflowTooltip: true,
          minWidth: 100,
          editOptions: {
            disabled: true,
            readonly: true
          }
        }
      ])
      const nonPermutableColorName = res.data.testingInspection
        .nonPermutableColorName
        ? JSON.parse(res.data.testingInspection.nonPermutableColorName)
        : []
      const noPermutableClothName = res.data.testingInspection
        .noPermutableClothName
        ? JSON.parse(res.data.testingInspection.noPermutableClothName)
        : []
      this.yarnData = {
        // ...res.inspectionTestingInformations,
        nonPermutableColor: this.formatArr(nonPermutableColorName),
        noPermutableCloth: this.formatArr(noPermutableClothName),
        dyeingAdaptabiy: res.data.testingInspection.dyeingAdaptabiyName,
        productStatus: res.data.testingInspection.productStatusName,
        reviewTime: res.data.testingInspection.reviewTime,
        reviewUser: res.data.testingInspection.reviewUserName,
        reviewComments: res.data.testingInspection.reviewComments,
        reviewUserId: res.data.testingInspection.reviewUserId,
        status: res.data.testingInspection.status
      }
      let tempItem
      this.testIdList = []
      for (let i = 0; i < tempData.length; i++) {
        this.testIdList.push(tempData[i].id)
        if (!columns.includes(tempData[i].attrId)) {
          columns.push(tempData[i].attrId)
          tempItem = {
            prop: tempData[i].attrId,
            label: tempData[i].attrName,
            showOverflowTooltip: true,
            id: tempData[i].id || '',
            editOptions: {
              itemType: 'itemView',
              readonly: true,
              disabled: true,
              dataSource: [
                { value: 'A', label: 'A' },
                { value: 'B', label: 'B' },
                { value: 'C', label: 'C' }
              ]
            }
          }
          this.yarnCommon._tableForm.columns.push(tempItem)
        }
      }
      console.log(this.testIdList)
      const dataSource = []
      const yarnTestIdList = [] // yarnTestId相同的为同一个检测项目，将其分组 为了顺序不乱，用数组
      const idList = []
      this.yarnList = []
      for (let i = 0; i < tempData.length; i++) {
        if (!idList.includes(tempData[i].yarnTestId)) {
          idList.push(tempData[i].yarnTestId)
          yarnTestIdList.push({
            key: tempData[i].yarnTestId,
            dataList: [],
            id: tempData[i].id
          })
        }
        yarnTestIdList[idList.indexOf(tempData[i].yarnTestId)].dataList.push(
          tempData[i]
        )
      }
      yarnTestIdList.forEach(item => {
        const tList = item.dataList
        const tempItem = { name: tList[0].yarnTestName } // 第一列 测试项目
        for (let i = 1; i < this.yarnCommon._tableForm.columns.length; i++) {
          for (let j = 0; j < tList.length; j++) {
            if (
              tList[j].attrId === this.yarnCommon._tableForm.columns[i].prop
            ) {
              tempItem[tList[j].attrId] = tList[j].attrValue

              if (tList[j].attrId === 'grey') {
                // 坯布 的单位（下拉列表 个 次）
                tempItem.greyDatasoure = tList[j].grey
              }
              break
            }
          }
        }
        dataSource.push(tempItem)
        this.yarnList.push({
          // 数据重组只需要 name 和 uuid
          name: tempItem.name,
          uuid: item.key
        })
      })
      const tempInformations = inspectionPhysicalInformations
      for (let i = 0; i < tempInformations.length; i++) {
        if (tempInformations[i].testItemsId === 'wistDirection') {
          const resC = await getSelectData({ categoryId: 10, enabled: 'Y' })
          for (let j = 0; j < resC.data.length; j++) {
            if (
              tempInformations[i].supplierDetectionResult === resC.data[j].uuid
            ) {
              tempInformations[i].supplierDetectionResult = resC.data[j].name
            }
          }
        }
      }
      this.$set(this.yarnCommon._tableForm, 'dataSource', dataSource)
      this.$set(this.resContent._tableFormV, 'dataSource', tempInformations)
    },
    getStatus(code) {
      let str = ''
      str =
        code === 0
          ? '待提交'
          : code === 1
            ? '待处理'
            : code === 2
              ? '处理中'
              : code === 3
                ? '已处理'
                : ''
      return str
    },
    //
    formatArr(arr) {
      const temp = []
      for (let i = 0; i < arr.length; i++) {
        temp.push(arr[i].label)
      }
      return temp
    }
  }
}
</script>
<style lang="scss">
.yarn-testing-yarn-detail {
  .card {
    .msg-content {
      background: #fff;
      // padding: 0 20px 0;
      margin: 20px 16px 0 20px;
      .el-form-item {
        margin-bottom: 0px;
      }
      .el-input__inner {
        border: none;
      }
      .el-form-item__label {
        color: #888e9e;
        padding: 0;
      }
      span{
        color: #474747;
      }
    }
  }
  .edit-table{
    .msg-content {
        margin: 10px 16px 0 20px;
        .el-form-item {
        margin-bottom: 10px;
      }
    }
  }
}
</style>
<style lang="scss" scoped>
.yarn-testing-yarn-detail {
  .card {
    margin: 15px;
    padding-bottom: 20px;
    background-color: #fff;
    .table-detail {
      padding: 0 10px;
    }
    .card-title {
      border-bottom: 1px solid #e9eff2;
      font-size: 16px;
      color: #151222;
      line-height: 22px;
      padding: 20px 0 20px 20px;
    }
    .card-bottom {
      display: flex;
      .row {
        width: 20%;
        font-size: 14px;
        padding: 20px;
        font-size: 14px;
        color: #151222;

        label {
          color: #888e9e;
          font-weight: normal !important;
        }
        span{
            font-size: 18px;
            vertical-align: middle;
        }
        &:nth-of-type(1) {
          span {
            color: #ff9214;
          }
        }
        &:nth-of-type(2) {
          span {
            color: rgb(9, 134, 255);
          }
        }
      }
    }
  }
  .yarn-info .page-table .el-table .cell > span {
    padding: 0 10px;
  }

  .quality-table {
    padding: 0 20px;
    .el-form-item__content {
      width: 100%;
    }
    /deep/ .el-form-item__label {
      height: 100%;
      min-height: 39px;
      line-height: 39px;
      border-right: 1px solid #e6ebf5;
      background-color: #f5f7fa;
    }
    /deep/.el-input.is-disabled .el-input__inner {
      background-color: transparent;
      border-color: #ffffff;
      color: #474747;
      border: none;
    }
    /deep/ .el-input__suffix {
      display: none;
    }
  }
  // 默认样式
  .yarn-info {
    margin-top: 0;
    .el-table--medium th,
    .el-table--medium td {
      padding: 0;
      margin: 0;
    }
    .el-form-item {
      margin: 0;
      padding: 0;
    }
    .cell {
      padding: 0;
      margin: 0;
      background-color: #f5f7fa;
      height: 39px;
      line-height: 39px;
      overflow: inherit;
    }
    .el-input__inner {
      border: none;
      border-radius: 0;
    }
    .input-item .el-input--medium .el-input__inner {
      line-height: 38px;
      height: 38px;
    }
    .el-input__inner {
      line-height: 38px;
      height: 38px;
    }
    .el-form-item__label {
      height: 100%;
      min-height: 39px;
      line-height: 39px;
      border-right: 1px solid #e6ebf5;
      background-color: #f5f7fa;
    }
  }
}
</style>
