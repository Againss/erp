，<template>
  <div class="detail-wrpa " :class="isEdit?'':'finished-fabric-disable'">
    <div class="statu-bar">
      <div class="order-num">物测编号：FTR210419001</div>
      <div class="statu-box" style="margin-left: auto;">
        <span>创建人：小李  2020-08-27 17:27</span>
        <span>验布员：小李  2020-08-27 17:27</span>
        <span>审核人：某领导</span>
        <span style="color: #FF9214;">审核中</span>
      </div>
    </div>
    <!-- 基本信息&产品信息 -->
    <div>
      <productInfo :data="formDatas" :is-edit="isEdit" />
    </div>
    <div class="tab-wrap">
      <div class="title-max" style="margin-bottom: 0;">送检</div>
      <div class="form-box">
        <cs-custom-form
          ref="tableForm"
          :data-source="tableCommon"
          :options="formOptions"
          :form-datas="tableData"
          :reset-errors="isEdit"
          :operates="showPopOperates"
          @selection-change="handleSelectionChange"
        />
      </div>
    </div>
    <div class="button-group" :class="{ 'fixed-footer': !sidebar }">
      <status-button
        :get-detail-data="getDetailData"
        :is-edit="getEditabled"
        :data="allData"
        :status="status"
        @btnHandleClick="btnHandleClick"
      />
    </div>
  </div>
</template>
<script>
import uploadSlotTrigger from './components/upload-slot-trigger.vue'
import statusButton from './components/status-button.vue'
// import * as api from './api/index.js'
import productInfo from './components/productInfo.vue'
export default {
  components: { statusButton, productInfo },
  data() {
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    const selection = {
      selection: true,
      selectionLabel: '全部'
    }
    // 单元格合并
    const spanMethod = ({ row, column, rowIndex, columnIndex }) => {
      const dataList = this.tableCommon._tableForm.dataSource
      const mergingRows = this.getSpanArr(dataList)
      if (columnIndex === 1 || columnIndex === 2) {
        const _row = mergingRows[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
        }
      }
    }
    const tableCommon = {
      _tableForm: {
        prop: 'tableForm',
        props: { edit: 'edit' },
        headerCellStyle: { 'background-color': '#F5F7FA' },
        className: 'pop-table',
        itemType: 'table-form',
        itemStyle: { 'width': '100%', 'margin-bottom': '-1px', 'margin-right': '0' },
        border: true,
        spanMethod: spanMethod,
        selectionChange: scope => {
          // console.log(scope)
        },
        rowClick: (...rest) => {
          // console.log(...rest)
        },
        columns: {
          _selectionc: {
            prop: 'iscodeIndex',
            type: 'selection',
            className: 'precautionscolor',
            isShow: (scope) => {
              return this.isEdit
            },
            label: '送检',
            width: 40
          },
          _firstItem: {
            prop: 'firstItem',
            label: '一级项目',
            itemType: 'itemview',
            minWidth: 100,
            labelWidth: '0',
            showOverflowTooltip: true
          },
          _testMethod: {
            prop: 'testMethod',
            label: '测试方法',
            className: 'redStar',
            itemType: 'itemview',
            minWidth: 100,
            labelWidth: '0',
            showOverflowTooltip: true
          },
          _secondItem: {
            prop: 'secondItem',
            label: '二级项目',
            itemType: 'itemview',
            minWidth: 100,
            labelWidth: '0'
            // editOptions: {
            //   labelWidth: '0',
            //   itemType: 'input',
            //   rules: [commonBlurReg]
            // }
          },
          _claim: {
            prop: 'claim',
            label: '要求',
            itemType: 'itemview',
            minWidth: 100,
            labelWidth: '0'
            // editOptions: {
            //   labelWidth: '0',
            //   itemType: 'input',
            //   rules: [commonBlurReg]
            // }
          },
          _remarks: {
            prop: 'remarks',
            label: '备注',
            showOverflowTooltip: true,
            minWidth: 100,
            editOptions: {
              labelWidth: '0',
              itemType: 'input',
              rules: [commonBlurReg]
            }
          },
          _result: {
            prop: 'result',
            label: '结果',
            showOverflowTooltip: true,
            minWidth: 100,
            editOptions: {
              labelWidth: '0',
              itemType: 'input',
              rules: [commonBlurReg]
            }
          },
          _singleJudgment: {
            prop: 'singleJudgment',
            label: '单项判定',
            showOverflowTooltip: true,
            minWidth: 100,
            editOptions: {
              labelWidth: '0',
              itemType: 'input',
              rules: [commonBlurReg]
            }
          }
        },
        dataSource: []
      },
      _productSize: {
        prop: 'productSize',
        itemType: this.selectTypeChange,
        valueType: 'object',
        label: '成品规格:',
        className: 'productSize',
        itemStyle: { 'width': '290px', 'margin-top': '20px !important', 'margin-right': '20px !important' },
        dataSource: [
          { value: '1', label: 'Fail' },
          { value: '2', label: 'Pass' }
        ],
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return value ? `<div class="render-content" title='${value.label}' >${value.label}</div>` : ''
        }
      },
      _attachmentUpload: {
        prop: 'attachmentUpload',
        itemType: 'upload',
        label: '上传附件:',
        className: 'upload-attachment',
        itemStyle: { 'width': '290px', 'margin-top': '20px !important' },
        isShow: () => {
          return this.isEdit
        },
        onSuccess: (res, file) => {
          console.log(res, file)
          this.$message.success('导入成功')
        },
        onExceed: (files, fileList) => {
          this.$message.warning(`当前限制选择 10 个文件`)
        },
        beforeRemove: (file, fileList) => {
          console.log('beforeRemove', file, fileList)
          return this.accept.indexOf(file.name.split('.')[file.name.split('.').length - 1]) !== -1 ? this.$confirm(`确定移除 ${file.name}？`).then(() => {
            this.infoData = {
              attachment: [],
              attachmentName: '',
              attachmentPath: ''
            }
          }) : true
        },
        action: `/common/file/upload`,
        data: {
          bizId: this.id || '',
          bizType: 'QA'
        },
        accept: '',
        showFileList: true,
        fileList: this.fileList,
        limit: 10,
        timeout: 30000,
        content: [
          {
            slot: 'trigger',
            component: uploadSlotTrigger
          }
        ]
      },
      _attachmentName: {
        prop: 'attachmentName',
        itemType: 'itemview',
        label: '附件:',
        itemStyle: { 'width': '290px', 'margin-top': '20px !important' },
        isShow: () => {
          return !this.isEdit
        },
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return formDatas.attachmentName ? `<span style="color: #0f89f3;cursor: pointer;"><i class="el-icon-paperclip"></i> ${formDatas.attachmentName}</span>` : ''
        },
        handle: () => {
          this.showFile()
        }

      }
    }
    return {
      commonBlurReg,
      tableCommon,
      selection,
      spanMethod,
      formOptions: {
        inline: true,
        // labelWidth: '100px',
        popError: true,
        size: 'small',
        validate: (flag, res, err) => {
          // console.log(flag, res, err)
        }
      },
      formDatas: {
        physicalId: 'POD0BU20072300007-6T',
        dyelotNo: 'D0BU200723000',
        produceOrderCode: 'L019782',
        isHeadBatch: 'POD0BU20072300007-6T',
        currentProgress: '隆丰',
        factoryName: '净色左斜双位衣',
        customerName: 'calla lily 451漂白色',
        brandName: '68" /±2.5 - 270g/㎡ /±2.5',
        customerServiceName: '5 - 6',
        billMan: '45/123',
        clothingStyleName: '45/123',
        clothingTypeName: '净色左斜双位衣|净色左斜双位衣|净色左斜双位衣净色左斜双位衣净色左斜双位衣净色左斜双位衣净色左斜双位衣净色左斜双位衣',
        techRequire: '净色左斜双位衣|净色左斜双位衣|净色左斜双位衣净色左斜双位衣净色左斜双位衣净色左斜双位衣净色左斜双位衣净色左斜双位衣',
        productNo: 'L019782',
        fabricType: 'POD0BU20072300007-6T',
        yarnCountName: '32S/2 棉100 点子纱 精梳 环锭纺 32S/2 棉100 点子纱 精梳 环锭纺 32S/2 棉100 点子纱 精梳 环锭纺',
        ingredientsName: '58% BCI 棉 | 38% 涤纶短纤 | 4% 氨纶',
        proportion: '48"-300g/㎡',
        productSize: '68" /±2.5 - 270g/㎡ /±2.5',
        customerColor: '5 - 6'
      },
      tableData: {},
      allData: {},
      isEdit: false,
      status: '0', // 状态 0：待处理 ,1：处理中，2：审核中,3：已处理
      fileList: [],
      showPopOperates: null,
      tabledataSource: [
        {
          firstItemId: '1',
          firstItem: '幅宽',
          testMethod: 'GB/T 8629',
          secondItem: '洗后',
          claim: '+-5%',
          remarks: '随便',
          result: '48.6',
          singleJudgment: 'Fail',
          edit: true
        },
        {
          firstItemId: '1',
          firstItem: '幅宽',
          testMethod: 'GB/T 8629',
          secondItem: '洗前',
          claim: '-5.0～+2.0',
          remarks: '随便',
          result: '48.6',
          singleJudgment: 'Fail',
          edit: false
        },
        {
          firstItemId: '1',
          firstItem: '幅宽',
          testMethod: 'GB/T 8629',
          secondItem: '洗前',
          claim: '+-5%',
          remarks: '随便',
          result: '48.6',
          singleJudgment: 'Fail',
          edit: true
        },

        {
          firstItemId: '2',
          firstItem: '克重',
          testMethod: 'GB/T 8629',
          secondItem: '原样',
          claim: '+-5%',
          remarks: '随便',
          result: '48.6',
          singleJudgment: 'Pass'
        },
        {
          firstItemId: '2',
          firstItem: '克重',
          testMethod: 'GB/T 8629',
          secondItem: '洗后',
          claim: '+-5%',
          remarks: '随便',
          result: '48.6',
          singleJudgment: 'Fail'
        }
      ]
    }
  },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar.opened
    },
    getEditabled() {
      return this.isEdit && ['0', '2', '4'].includes(this.status)
    }
  },
  mounted() {
    this.tableCommon._tableForm.dataSource = this.tabledataSource
    // this.getSpanArr(this.tabledataSource)
  },
  methods: {
    showFile() {
      window.open(this.infoData.attachmentPath)
    },
    // 提交
    btnHandleClick(type) {
      if (type === '编辑') {
        this.isEdit = true
      } else if (type === '保存' || type === '提交') {
        this.$refs.tableForm.form.validate((valid, obj) => {
          console.log(valid)
          if (valid) {
            this.$message({ type: 'success', message: '保存成功!' })
            this.isEdit = false
          }
        })
      } else if (type === '返回') {
        this.$router.push({ path: `/quality-manage/finished-product-testing/finished-cloth` })
      } else if (type === '取消') {
        this.isEdit = false
      }
    },
    // 获取详情
    getDetailData() {
      console.log(1)
    },
    handleSelectionChange(e) {
      console.log(e)
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
    },
    renderContent(value, options, form, formDatas, setFormDatas, scope) {
      return value ? `<div class="render-content" title='${value}' >${value}</div>` : ''
    },
    inputTypeChange() {
      return this.isEdit ? 'input' : 'itemview'
    },
    selectTypeChange() {
      return this.isEdit ? 'select' : 'itemview'
    }
  }
}
</script>
<style lang="scss" scoped>
  .detail-wrpa{
    padding: 20px;
    padding-top: 0;
    .title-max{
      font-size: 16px;
      color: #151222;
      height: 57px;
      line-height: 57px;
      border-bottom: 1px solid #EEEFF0;
      padding: 0 20px;
      margin-bottom: 20px;
    }
    .statu-bar{
      height: 65px;
      display: flex;
      align-items: center;
      font-size: 12px;
      color: #666666;
      font-weight: 400;
      box-sizing: border-box;
      .order-num{
        font-size: 18px;
        color: #151222;
        font-weight: 500;
      }
      span{
        margin-left: 10px;
      }
    }

    .tab-wrap{
      background-color: #FFFFFF;
      margin-top: 15px;
      margin-bottom: 57px;
      .form-box{
        width: 100%;
        height: 100%;
        padding: 15px;
        box-sizing: border-box;
        /deep/ .el-form-item--small.el-form-item{
          margin: 0 !important;
        }
        /deep/ .el-table .cell{
          line-height: 40px;
        }
        /deep/ .el-table__row{
          .cell{
            padding: 0 !important;
          }
        }
        /deep/ .el-table--medium th, /deep/ .el-table--medium td{
          padding: 0;
        }
        /deep/ .el-input__inner{
          height: 40px;
          line-height: 40px;
          border-radius: inherit;
          background: transparent;
          border: 1px solid transparent;
        }
      }
      /deep/ .precautionscolor{
        .cell{
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
      /deep/ .productSize{
        .el-input__inner{
          height: 32px;
          line-height: 32px;
          border-radius: 4px;
          background: transparent;
          border: 1px solid #e6ebf5;
        }
      }
    }
    /deep/ .is-error{
      .el-input__inner{
        border-color: #FF0000 !important;
      }
    }
     /deep/ .render-content{
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    /deep/ .el-table--enable-row-hover .el-table__body tr:hover > td{
      background-color: #FFFFFF;
    }
    /deep/ .el-table .cell > span{
      padding: 0 15px;
    }
    /deep/ .el-input__inner:hover{
      border-color:transparent
    }
  }

  .button-group {
    width: calc(100% - 210px);
    transition: width 0.28s;
    position: fixed;
    text-align: center;
    bottom: 0;
    padding: 10px;
    background: #ffffff;
    border-top: 1px solid #ecf0f3;
    z-index: 999;
    right: 0;
    .button {
      margin-right: 12px;
    }
  }
  .fixed-footer {
    width: calc(100% - 54px) !important;
  }
  //查看状态
  .finished-fabric-disable{
    .data-info{
      background-color: #FFFFFF;
       /deep/ .el-form-item__label{
         color: #888E9E;
      }
    }
  }
</style>
<style lang="scss">

</style>
