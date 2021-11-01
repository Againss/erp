<template>
  <div class="detail-wrpa" :class="isEdit?'':'finished-fabric-disable'">
    <div class="statu-bar">
      <div class="order-num">物测编号：{{ detailData.physicalTaskNo ||'' }}</div>
      <div class="statu-box" style="margin-left: auto;">
        <span>创建人：{{ basicData.createdByName||'' }}  {{ basicData.createdTime ? this.$filters.parseTime(basicData.createdTime) : '' }}</span>
        <span>测试员：{{ basicData.tester }} {{ basicData.dealTime ? this.$filters.parseTime(basicData.dealTime) : '-' }}</span>
        <span v-if="!isCopy && basicData.reviewUserName">审核人：{{ basicData.reviewUserName }} {{ basicData.reviewTime ? this.$filters.parseTime(basicData.reviewTime) : '-' }}</span>
        <span :style="{color: statusList[status].color}">{{ statusList[status] && statusList[status].label }}</span>
      </div>
    </div>
    <!-- 基本信息&产品信息 -->
    <div>
      <productInfo :data="productInfoData" :is-edit="isEdit" :get-detail-data="getDetailData" :is-copy="isCopy" @syncDataHandle="syncDataHandle" />
    </div>
    <div class="tab-wrap">
      <div class="title-max" style="margin-bottom: 0;border: none;">检测信息</div>
      <div class="form-box" style="padding-top: 0;">
        <cs-custom-form
          ref="tableForm"
          :data-source="tableCommon"
          :options="formOptions"
          :reset-errors="isEdit"
          :operates="showPopOperates"
        />
        <div class="wc-result">
          <cs-custom-form
            ref="infoDataRef"
            :data-source="formDataSourse"
            :options="formOtions"
            :form-datas="detailData"
          />
        </div>

      </div>
    </div>
    <div class="button-group" :class="{ 'fixed-footer': !sidebar }">
      <status-button
        :get-detail-data="getDetailData"
        :clothing-form="clothingForm"
        :is-edit="getEditabled"
        :is-copy="isCopy"
        :detail-data="detailData"
        :status="status"
        :is-max-version="isMaxVersion"
        @changeBtn="changeBtn"
      />
    </div>
  </div>
</template>
<script>
import uploadSlotTrigger from './components/upload-slot-trigger.vue'
import statusButton from './components/status-button.vue'
import * as api from './api/index.js'
import productInfo from './components/productInfo.vue'
import uploadFile from './components/uploa-file.vue'
import selectioncItem from './components/selectionc-item.vue'
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
        syncFormDatasToDataSource: false,
        getTable: (val) => {
          this.table = val
        },
        rowClick: (...rest) => {
          // console.log(...rest)
        },
        headerCellClassName: this.cellClass,
        columns: {
          _selectionc: {
            prop: 'iscodeIndex',
            type: 'view',
            className: 'precautionscolor',
            // label: '送检',
            width: '50',
            components: {
              selectioncItem
            },
            componentsOptions: {
              changeSelectionc: (scope) => {
                if (this.isCopy) {
                  // 重检可编辑构选

                  scope.row.isCheck = scope.row.isCheck === 1 ? 0 : 1
                  scope.row.edit = false
                  scope.row.checked = scope.row.checked === 'checked' ? 'checkedBox' : 'checked'

                  // 判断物测结果以勾选为准
                  const datas = this.$refs.tableForm.form.model.tableForm
                  if (datas) {
                    const fail = datas.filter(v => v.singleJudgment === 1 && v.isCheck === 1)
                    const pass = datas.filter(v => v.singleJudgment === 2 && v.isCheck === 1)
                    if (fail && fail.length) {
                      this.detailData.physicalInformation.result = 1
                    } else {
                      if (pass && pass.length) {
                        this.detailData.physicalInformation.result = 2
                      } else {
                        this.detailData.physicalInformation.result = ''
                      }
                    }
                  }
                }
              }
            }
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
          },
          _claim: {
            prop: 'claim',
            label: '要求',
            itemType: 'itemview',
            minWidth: 100,
            labelWidth: '0'
          },
          _remarks: {
            prop: 'remarks',
            label: '备注',
            showOverflowTooltip: true,
            minWidth: 100,
            itemType: 'itemview'
          },
          _result: {
            prop: 'result',
            label: '结果',
            minWidth: 100,
            maxlength: 50,
            editOptions: {
              maxlength: 50,
              labelWidth: '0',
              itemType: 'input'
              // rules: [commonBlurReg]
            },
            renderContent(value, options, form, formDatas, setFormDatas, scope) {
              return value ? `<div class="render-content" title='${value}' >${value}</div>` : ''
            }
          },
          _singleJudgment: {
            prop: 'singleJudgment',
            label: '单项判定',
            minWidth: 100,
            editOptions: {
              labelWidth: '0',
              itemType: 'select',
              dataSource: [
                { label: 'Fail', value: 1 },
                { label: 'Pass', value: 2 },
                { label: '/', value: 3 }
              ],
              change: (value, form, formDatas, setFormDatas) => {
                const datas = this.$refs.tableForm.form.model.tableForm
                if (datas && datas.length) {
                  const fail = datas.filter(v => v.singleJudgment === 1 && v.isCheck === 1)
                  const pass = datas.filter(v => v.singleJudgment === 2 && v.isCheck === 1)
                  if (fail && fail.length) {
                    this.detailData.physicalInformation.result = 1
                  } else {
                    if (pass && pass.length) {
                      this.detailData.physicalInformation.result = 2
                    } else {
                      this.detailData.physicalInformation.result = 3
                    }
                  }
                } else {
                  this.detailData.physicalInformation.result = 3
                }
              }
            },
            formater(scope) {
              const s = scope.row.singleJudgment
              if (s === 1) {
                return `<span style="color:#FF9214 " >Fail</span>`
              } else if (s === 2) {
                return `<span style="color:#0986FF " >Pass</span>`
              } else if (s === 3) {
                return `/`
              }
            }
          }
        },
        dataSource: []
      }

    }
    const formDataSourse = {
      _produceOrderCode: {
        prop: 'produceOrderCode',
        itemType: 'view',
        text: '检测结论',
        style: {
          'width': '100%',
          'display': 'flex',
          'align-items': 'center',
          'justify-content': 'center',
          'font-size': '14px',
          'color': '#3C4043',
          'height': '42px',
          'padding-left': '20px',
          'padding-right': '20px',
          'border': '1px solid  #D0D8E0',
          'margin-top': '-1px',
          'font-weight': '500',
          'background': '#f5f7fa',
          'z-index': '1'
        }
      },
      _result: {
        prop: 'result',
        itemType: 'itemview',
        label: '物测结果',
        className: 'product-border',
        itemStyle: { 'width': '238px' },
        style: {
          'width': '20%',
          'display': 'flex',
          'align-items': 'center',
          'justify-content': 'center',
          'font-size': '14px',
          'color': '#3C4043',
          'height': '42px',
          'padding-left': '20px',
          'padding-right': '20px',
          'border': '1px solid  #D0D8E0',
          'margin-top': '-1px',
          'background': '#f5f7fa'

        },
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          const result = formDatas.physicalInformation && formDatas.physicalInformation.result
          result ? result + '' : ''
          const obj = {
            '1': { text: 'Fail', color: '#0986FF' },
            '2': { text: 'Pass', color: '#FF9214' },
            '3': { text: '/', color: '#474747' }
          }
          return result ? `<div class="render-content" style="color:#FF9214;font-size: 18px;font-weight: 500;">${obj[result].text}</div>` : ''
        }
      },
      _reviewComments: {
        prop: 'reviewComments',
        itemType: 'itemview',
        label: '审批意见',
        className: 'product-border',
        itemStyle: { 'width': 'calc(100% - 237px)' },
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return formDatas.physicalInformation && formDatas.physicalInformation.reviewComments ? `<div class="render-content render-review-comments" style="border-left: 1px solid #D0D8E0;color: #606266;" title='${formDatas.physicalInformation.reviewComments}' >${formDatas.physicalInformation.reviewComments}</div>` : '<div style="border-left: 1px solid #EEEFF0"></div>'
        }
      },
      _attachmentList: {
        prop: 'attachmentList',
        itemType: 'upload',
        label: '上传附件:',
        className: 'upload-attachment',
        itemStyle: { 'width': '100%', 'margin-top': '20px !important', 'border': 'none', 'height': 'auto', 'padding': '0', 'background': '#fff' },
        isShow: () => {
          return this.isEdit
        },
        onSuccess: (res, file, fileList) => {
          let datas = { ...this.$refs.infoDataRef.formDatas }
          datas = {
            ...datas,
            attachmentList: [...fileList]

          }
          this.detailData = datas
          this.$message.success('导入成功')
        },
        onExceed: (files, fileList) => {
          this.$message.warning(`当前限制选择 10 个文件`)
        },
        beforeRemove: (file, fileList) => {
          this.detailData.attachmentList && this.detailData.attachmentList.forEach((item, index) => {
            if (item.uid === file.uid) {
              this.detailData.attachmentList.splice(index, 1)
            }
          })
        },
        action: `/common/file/upload`,
        data: {
          bizId: this.id || '',
          bizType: 'QAPUBLIC'
          // bizType: 'QA'
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
      _attachmentProp: {
        isShow: () => { return !this.isEdit },
        components: {
          uploadFile
        },
        componentsOptions: {
          prop: 'attachmentList',
          label: '附件:',
          url: 'attachmentList'
        }
      }
    }
    return {
      commonBlurReg,
      tableCommon,
      selection,
      spanMethod,
      formDataSourse,
      formOtions: {
        inline: true,
        syncDataHandle: (formDatas) => {
          // console.log(formDatas)
        },
        validate: (flag, res, err) => {
          console.log(flag)
        }
      },

      formOptions: {
        inline: true,
        // popError: true,
        size: 'small',
        validate: (flag, res, err) => {
          console.log(flag, res, err)
        },
        getForm: (form) => {
          this.getClothingForm(form)
        },
        syncDataHandle: (formDatas) => {
          this.tableCommon._tableForm.dataSource = formDatas.tableForm
        }
      },

      allData: {}, // 拷贝详情数据
      detailData: {}, // 详情数据
      productInfoData: {}, // 基本信息和产品信息
      basicData: {}, // 状态栏信息
      tabList: [], // 检测信息表格数据
      isEdit: false,
      isCopy: false,
      isEditTextType: '',
      status: '0', // 状态 0：待处理 ,1：处理中，2：审核中,3：已处理
      fileList: [],
      showPopOperates: null,
      clothingForm: null,
      result: '',
      selectionAll: [], // 选择的数据
      table: null,
      id: '',
      statusList: {
        '0': { color: '#FF9214', label: '待处理' },
        '1': { color: '#FF9214', label: '处理中' },
        '2': { color: '#FF9214', label: '审核中' },
        '3': { color: '#00BCC5', label: '已处理' }
      },
      versionInfoList: [],
      isMaxVersion: true
    }
  },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar.opened
    },
    getEditabled() {
      return this.isEdit
    }
  },
  watch: {
    isEdit: {
      handler(val, oldVal) {
        // this.setTableEdit(val)
      },
      deep: true,
      immediate: true
    }

  },
  mounted() {
    this.id = this.$route.params.id || this.$route.query.id
    this.getDetailData()
  },
  methods: {
    syncDataHandle(formDatas) {
      this.detailData = { ...this.detailData, remarks: formDatas.remarks }
    },
    // 点击按钮回调
    changeBtn(type, text) {
      this.isEditTextType = text
      if (text === 'copy') {
        const arr = this.$utils.deepClone(this.versionInfoList || [])
        arr.sort((a, b) => {
          return b.version - a.version
        })
        if (arr[0].version === this.productInfoData.version) {
          this.isCopy = true
          this.isEdit = true
          this.productInfoData.remarks = '' // 重检把备注清空
          this.detailData.physicalInformation.reviewComments = ''
          this.setTableEdit('copy')
        } else {
          // 只有最大版本可以重检
          this.isCopy = false
          this.isEdit = false
          this.$message.warning('请选择最大版本重检')
        }
      } else {
        this.isCopy = false
        this.isEdit = type
      }
      if (text === 'edit') {
        this.setTableEdit('edit')
      }
    },

    // 获取form列实
    getClothingForm(form) {
      this.clothingForm = form
    },
    cellClass(row) {
      if (row.columnIndex === 0) {
        return 'disabledCheck'
      }
    },
    // 点击编辑设置表格编辑状态
    setTableEdit(type) {
      const datas = this.tableCommon._tableForm.dataSource
      if (datas && datas.length) {
        const dataEedit = this.$utils.deepClone(this.tableCommon._tableForm.dataSource || [])
        dataEedit.forEach(v => {
          // 禁用选中状态:'disabledChecked' // 禁用未选中状态:'disabledNoChecked' // 选中可编辑状态:'checked' // 未选中可编辑状态:'checkedBox'
          if (type === 'copy') {
            v.checked = 'checkedBox'
            v.isCheck = 0
          } else if (type === 'edit' && this.versionInfoList.length === 1) {
            v.edit = v.isCheck === 1
            v.checked = 'disabledChecked'
          } else {
            v.edit = v.isCheck === 1
            v.checked = v.isCheck === 1 ? 'disabledChecked' : 'disabledNoChecked'
          }
        })
        this.$set(this.tableCommon._tableForm, 'dataSource', dataEedit)
      }
    },
    // 获取详情
    async getDetailData(version = '', isMaxVersion = true) {
      this.isMaxVersion = isMaxVersion
      this.isEdit = false
      const res = await api.getPhysicalInfo({ physicalTaskNo: this.id, version: version })
      this.allData = this.$utils.deepClone(res.data || {})
      this.detailData = res.data || {}
      // 状态栏数据（创建人等数据）
      this.basicData = {
        createdByName: this.allData.qaGreigeInspectionInfoResponse && this.allData.qaGreigeInspectionInfoResponse.createdByName || '', // 创建人
        createdTime: this.allData.qaGreigeInspectionInfoResponse && this.allData.qaGreigeInspectionInfoResponse.createdTime || '', // 创建时间
        tester: this.allData.physicalInformation && this.allData.physicalInformation.tester || '', // 测试员
        dealTime: this.allData.physicalInformation && this.allData.physicalInformation.dealTime || '', // 测试时间
        reviewUserName: this.allData.physicalInformation && this.allData.physicalInformation.reviewUserName || '', // 测试时间
        reviewTime: this.allData.physicalInformation && this.allData.physicalInformation.reviewTime || ''
      }
      // 版本号下拉框数据
      this.versionInfoList = this.detailData.physicalInformation && this.detailData.physicalInformation.versionInfoList || []
      // 基本信息和产品信息数据
      this.productInfoData = {
        ...this.allData.qaCustomerOrderInfoResponse,
        ...this.allData.qaGreigeInspectionInfoResponse,
        ...this.allData.physicalInformation,
        id: this.detailData.id
      }
      // 检测信息-表格数据 // 禁用选中状态:'disabledChecked' // 禁用未选中状态:'disabledNoChecked' // 选中可编辑状态:'checked' // 未选中可编辑状态:'checkedBox'
      const items = this.detailData.physicalInformation && this.detailData.physicalInformation.items || []
      if (items.length) {
        items.forEach((v, i) => {
          if (this.versionInfoList.length === 1) {
            v.isCheck = 1
            v.checked = 'disabledChecked'
          } else {
            v.checked = v.isCheck === 1 ? 'disabledChecked' : 'disabledNoChecked'
          }
        })
      }
      this.tabList = items
      this.tableCommon._tableForm.dataSource = this.tabList

      // 附件回显数据重组
      let fileList = []
      if (this.detailData && this.detailData.physicalInformation) {
        if (this.detailData.physicalInformation.attachmentList) {
          fileList = this.detailData.physicalInformation.attachmentList.map(v => {
            return {
              name: v.originalName,
              url: v.viewUrl,
              id: v.id
            }
          })
        }
      }
      this.detailData.attachmentList = fileList
      // 判断物测结果是否有值（如果没有，从items取）
      if (!this.allData.physicalInformation.result) {
        const fail = items.filter(v => v.singleJudgment === 1)
        const pass = items.filter(v => v.singleJudgment === 2)
        if (fail && fail.length) {
          this.detailData.physicalInformation.result = 1
        } else {
          if (pass && pass.length) {
            this.detailData.physicalInformation.result = 2
          } else {
            this.detailData.physicalInformation.result = ''
          }
        }
      }
      this.status = this.detailData.physicalInformation && this.detailData.physicalInformation.status + '' || ''
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
    width: 100%;
    padding: 20px;
    padding-top: 0;
    box-sizing: border-box;
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
        /deep/ .el-form-item__content{
          width: 100%;
        }
        /deep/ .el-table{
          color: #606266;
        }
        /deep/ .el-form-item--small.el-form-item{
          margin: 0 !important;
          background: #fff;
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
          border-color: #D0D8E0;
        }
        /deep/ .el-input__inner{
          height: 40px;
          line-height: 40px;
          border-radius: inherit;
          background: transparent;
          border: 1px solid transparent;
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

        /deep/ .render-review-comments{
          height: 40px;
          line-height: 40px;
          border-left: 1px solid #D0D8E0;
          padding: 0 10px;
        }
        /deep/ .el-table--enable-row-hover .el-table__body tr:hover > td{
          background-color: #f5f7fa;
        }
        /deep/ .el-table tr{
          background-color: #f5f7fa;
        }
        /deep/ .el-table .cell > span{
          padding: 0 15px;
        }
        /deep/ .el-input__inner:hover{
          border-color:transparent
        }
        /deep/ .el-upload-list{
          display: flex;
          align-items: center;
          width: 700px;
          flex-wrap: wrap;
          .el-upload-list__item{
            width: 210px;
            margin-right: 20px;
          }
        }

      }

      .wc-result{
        /deep/ .el-form-item{
          margin-bottom: 0;
          border: 1px solid #D0D8E0;
          height: 42px;
          margin-top: -1px;
          padding: 0 10px;
          box-sizing: border-box;
          margin-right: -1px;
          background-color: #f5f7fa;
        }
        /deep/ .el-form-item__label{
          width: 80px !important;
          flex-shrink: 0;
        }

        /deep/ .el-form-item__content{
          span{
            width: calc(100% - 80px);
            display: block;
          }

        }
        .render-content{
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
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
  /deep/ .render-content{
     overflow: hidden;
     text-overflow: ellipsis;
     white-space: nowrap;
   }
</style>
<style lang="scss">
  .el-table .disabledCheck .cell .el-checkbox__inner{
    display: none !important;
  }
  /* 去掉全选按钮 */
  .el-table .disabledCheck .cell::before{
    content: '送检';
    text-align: center;
  }
  // .finished-fabric-disable{
  //   /* 去掉全选按钮 */
  //   .el-table .disabledCheck .cell::before{
  //     content: '送检';
  //     text-align: center;
  //   }
  // }
</style>
