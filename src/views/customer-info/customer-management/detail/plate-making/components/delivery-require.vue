<template>
  <div :class="{'plate-making-form--preview': !isEdit}">
    <div class="top-box">
      <div class="tag-box" :class="{'tag-box--view': !isEdit}">
        <el-tabs v-model="tabName" type="card" editable @edit="handleTabsEdit" @tab-click="handleTabClick">
          <el-tab-pane
            v-for="(item, index) in rawData"
            :key="tabKeyMap[index]"
            :label="getReceiveCompany(item)"
            :name="tabKeyMap[index]"
          />
        </el-tabs>
      </div>
    </div>

    <div class="plate-making__header">寄送信息</div>

    <cs-custom-form
      ref="baseForm"
      style="margin-top: 18px;"
      :data-source="baseData"
      :options="formOptions"
      :form-datas="baseFormData"
    />

    <div class="plate-making__header" style="padding-bottom: 8px;">
      <span style="line-height: 30px;">寄送板型</span>

      <div v-show="isEdit && rawData.length" class="plate-making-button plate-making-pointer" @click="handleSelectReq">
        <span style="margin-left: 14px;font-size: 14px;">添加</span>
      </div>
    </div>

    <cs-custom-table
      class="plate-making-table--no-stripe"
      header-cell-class-name="plate-making-table-header-cell"
      tooltip-effect="dark"
      :columns="columns"
      :operates="operates"
      :data-source="tableDataSource"
    />

    <!-- 添加地址弹窗 -->
    <cs-custom-popsearch
      ref="addrPop"
      :options="addrPopOptions"
      @close="addrPopClose"
    />

    <cs-custom-pop :options="addAddrPopOptions" />

    <!-- 选择制板要求弹窗 -->
    <cs-custom-popsearch
      ref="reqPop"
      :options="reqPopOptions"
      @close="reqPopClose"
    />
  </div>
</template>

<script>
import { getAddressList } from '../api'
import { receiptAdd } from '@/views/customer-info/customer-management/api'
import { numberBlurReg, phoneBlurReg } from '@/views/customer-info/customer-management/common'
import { commonItemViewRender, sameSpan, selectObjFormatter, updateSelectDataSource } from '../common'
import { PublicCustomer } from '@/views/customer-info/public'

const itemStyle = { 'width': '30%', 'margin': '0 10px 18px 0' }

export default {
  name: 'DeliveryRequire',

  mixins: [PublicCustomer],

  props: {
    dataSource: {
      type: Array,
      default: () => []
    },
    sendRequirementList: {
      type: Array,
      default: () => []
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      tabName: '',
      tabKeyMap: [],

      rawData: [],

      defHandoverType: {},
      baseData: {
        _handoverTypeName: {
          prop: 'handoverTypeName',
          itemType: this.inputTypeChange,
          readonly: true,
          disabled: true,
          label: '交接类型:',
          itemStyle,
          renderContent: commonItemViewRender()
        },
        _receiveCompany: {
          prop: 'receiveCompany',
          itemType: this.inputTypeChange,
          readonly: true,
          disabled: true,
          label: '收件人公司:',
          itemStyle,
          renderContent: commonItemViewRender()
        },
        _recipient: {
          prop: 'recipient',
          itemType: this.inputTypeChange,
          readonly: true,
          disabled: true,
          label: '收件人:',
          itemStyle,
          renderContent: commonItemViewRender()
        },
        _mobile: {
          prop: 'mobile',
          itemType: this.inputTypeChange,
          readonly: true,
          disabled: true,
          label: '联系电话:',
          itemStyle,
          renderContent: commonItemViewRender()
        },
        _address: {
          prop: 'address',
          itemType: this.inputTypeChange,
          readonly: true,
          disabled: true,
          label: '详细地址:',
          itemStyle,
          renderContent: commonItemViewRender()
        },
        _paymentMethod: {
          prop: 'paymentMethod',
          itemType: this.selectTypeChange,
          label: '付费方式:',
          itemStyle,
          clearable: true,
          valueType: 'object',
          valueKey: 'value',
          dataSource: [],
          rules: [{ required: true, message: '付费方式不能为空', trigger: 'change' }],
          renderContent: commonItemViewRender(),
          visibleChange: visible => {
            if (visible) {
              this.getOptionConfig({ fieldName: '付费类型' })
                .then(res => { this.baseData._paymentMethod.dataSource = res })
            }
          }
        },
        _labelLanguage: {
          prop: 'labelLanguage',
          itemType: this.selectTypeChange,
          label: '标签语言:',
          itemStyle,
          clearable: true,
          valueType: 'object',
          valueKey: 'value',
          dataSource: [],
          rules: [{ required: true, message: '标签语言不能为空', trigger: 'change' }],
          renderContent: commonItemViewRender(),
          visibleChange: visible => {
            if (visible) {
              this.getOptionConfig({ fieldName: '标签语言' })
                .then(res => { this.baseData._labelLanguage.dataSource = res })
            }
          }
        },
        /* _c8: {
          prop: 'c8',
          itemType: this.selectTypeChange,
          className: 'inputWidth',
          label: '是否指定物流:',
          dataSource: [
            { value: 1, label: '是' },
            { value: 0, label: '否' }
          ],
          itemStyle
        },*/
        _logisticsCompany: {
          prop: 'logisticsCompany',
          itemType: this.selectTypeChange,
          className: 'inputWidth',
          label: '物流公司:',
          itemStyle,
          clearable: true,
          valueType: 'object',
          valueKey: 'value',
          dataSource: [],
          renderContent: commonItemViewRender(),
          visibleChange: visible => {
            if (visible) {
              this.getOptionConfig({ fieldName: '物流公司' })
                .then(res => { this.baseData._logisticsCompany.dataSource = res })
            }
          }
        }
      },
      formOptions: {
        labelWidth: '104px',
        inline: true,
        syncDataHandle: formData => {
          const addrObj = this.rawData[this.currentIndex]

          if (addrObj) {
            addrObj.paymentMethod = formData.paymentMethod
            addrObj.labelLanguage = formData.labelLanguage
            addrObj.logisticsCompany = formData.logisticsCompany
          }
        },
        getForm: (form) => {
          this.baseForm = form
        }
      },
      baseFormData: {
        paymentMethod: null,
        labelLanguage: null,
        logisticsCompany: null
      },
      baseForm: null,

      columns: {
        _batchRequire: {
          prop: 'batchRequire',
          label: '批次要求',
          formater: selectObjFormatter('batchRequire')
        },
        _templateType: {
          prop: 'templateType',
          label: '制板类型',
          formater: selectObjFormatter('templateType')
        },
        _standard: {
          prop: 'standard',
          label: '规格',
          formater: selectObjFormatter('standard')
        }
      },
      operates: {
        label: '操作',
        width: '120',
        isShow: () => {
          return this.isEdit
        },
        dataSource: [
          {
            label: '删除',
            isShow: true,
            style: { 'color': '#FE4949' },
            handle: scope => {
              this.$confirm('确认删除该条数据？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                cancelButtonClass: 'btn-cancel'
              })
                .then(() => {
                  this.handleDeleteReq(scope)
                  this.$message.success('删除成功')
                })
                .catch(() => {
                  this.$message({ type: 'info', message: '已取消删除' })
                })
            }
          }
        ]
      },
      tableDataSource: [],

      currentAddrRow: null,
      addrPopOptions: {
        className: 'plate-making-table--no-stripe',
        visible: false,
        title: '添加寄送地址',
        width: '800px',
        footerOptions: {
          content: [
            {
              name: '确认',
              type: 'primary',
              handle: (/* formDatas, form, table */) => {
                const curRow = this.currentAddrRow

                if (!curRow) {
                  this.$message.warning('请选择一条记录')
                  return
                }

                if (this.rawData && this.rawData.length === 10) {
                  this.$message.warning('最多添加10个寄送地址')
                  return
                }

                const newRow = {
                  ...this.getDefaultData(),
                  ...curRow
                }

                // 删除无用数据
                delete newRow.createdTime
                delete newRow.createdBy
                delete newRow.updatedTime
                delete newRow.updatedBy
                delete newRow.revision
                delete newRow.id
                delete newRow.isDeleted

                this.rawData.push(newRow)
                this.setActiveTab(this.getAddrId(curRow))
                this.updateData()
                this.addrPopOptions.visible = false
              }
            },
            {
              name: '新增地址',
              className: 'plate-making-button--primary',
              handle: (/* formDatas, form, table*/) => {
                this.addrPopCancel()
                this.handleAddAddr()
              }
            },
            {
              name: '取消',
              handle: (/* formDatas, form, table*/) => {
                this.addrPopCancel()
              }
            }
          ]
        },
        popTableOptions: {
          columns: {
            _receiveCompany: {
              prop: 'receiveCompany',
              label: '收件人公司',
              showOverflowTooltip: true
            },
            _recipient: {
              prop: 'recipient',
              label: '收件人',
              showOverflowTooltip: true
            },
            _mobile: {
              prop: 'mobile',
              label: '收件电话',
              showOverflowTooltip: true
            },
            _address: {
              prop: 'address',
              label: '详细地址',
              showOverflowTooltip: true,
              minWidth: '180'
            }
          },
          staticPage: true, // 本地分页
          highlightCurrentRow: true,
          headerCellClassName: 'plate-making-table-header-cell',
          currentRowKey: 'id',
          rowClick: (row, column, event) => {
            this.currentAddrRow = row
          },
          dataSource: [],
          pagination: {
            pageSizes: [10, 20, 50, 100],
            pageSize: 10
          }
        }
      },

      addAddrPopForm: null,
      addAddrPopOptions: {
        itemType: 'drawer',
        visible: false,
        title: '新增收件地址',
        saveAndaddText: '继续添加',
        saveAndadd: this.handleAddrSaveAndAdd,
        formOptions: {
          getForm: (form) => {
            this.addAddrPopForm = form
          }
        },
        formDatas: {}, // pop数据来源
        content: {
          _receiveCompany: {
            prop: 'receiveCompany',
            itemType: 'input',
            label: '收件公司',
            placeholder: '请输入',
            rules: [
              { required: true, message: '收件公司不能为空', trigger: ['blur'] },
              { min: 1, max: 20, message: '收件公司不能超过20个字符', trigger: 'blur' }
            ]
          },
          _recipient: {
            prop: 'recipient',
            itemType: 'input',
            label: '收件人',
            placeholder: '请输入',
            rules: [
              { required: true, message: '收件人不能为空', trigger: ['blur'] },
              { min: 1, max: 10, message: '收件人不能超过 10个字符', trigger: 'blur' }
            ]
          },
          _mobile: {
            prop: 'mobile',
            itemType: 'input',
            label: '电话',
            placeholder: '请输入',
            maxlength: 11,
            rules: [
              { required: true, message: '电话不能为空', trigger: ['blur'] },
              { validator: numberBlurReg, trigger: 'blur' },
              { validator: phoneBlurReg, trigger: 'blur' }
            ]
          },
          _address: {
            prop: 'address',
            itemType: 'input',
            label: '收件地址',
            placeholder: '请输入',
            maxlength: 50,
            rows: 1,
            rules: [
              { required: true, message: '收件地址不能为空', trigger: ['blur'] }
            ],
            trim: (value) => {
              return value
            }
          },
          _remark: {
            prop: 'remark',
            itemType: 'input',
            type: 'textarea',
            label: '备注',
            placeholder: '请输入',
            maxlength: 50,
            showWordLimit: true,
            rows: 3,
            trim: (value) => {
              return value
            }
          }
        },
        ok: (params) => {
          this.addAddrReq(params).then(() => {
            this.$message.success('新增成功')
            this.addAddrPopOptions.visible = false
          })
        },
        cancel: (params) => {
          this.addAddrPopOptions.visible = false
        },
        closed: this.handleSelectAddr
      },

      currentReqRow: null,
      reqPopOptions: {
        className: 'plate-making-table--no-stripe',
        visible: false,
        title: '选择制板要求',
        width: '800px',
        footerOptions: {
          content: [
            {
              name: '确认',
              type: 'primary',
              handle: (formDatas, form, table) => {
                const curRow = this.$utils.deepClone(this.currentReqRow)

                if (!curRow) {
                  this.$message.warning('请选择一条记录')
                  return
                }

                const idx = this.currentIndex

                if (idx !== -1) {
                  if (this.rawData[idx].sendTemplateList.some(cmpRow => sameSpan(curRow, cmpRow))) {
                    this.$message.error('存在相同类型的数据')
                    return
                  }
                  this.rawData[idx].sendTemplateList.push(curRow)
                }

                this.reqPopOptions.visible = false
              }
            },
            {
              name: '取消',
              handle: (formDatas, form, table) => {
                this.reqPopCancel()
              }
            }

          ]
        },
        popTableOptions: {
          columns: {
            _batchRequire: {
              prop: 'batchRequire',
              label: '批次要求',
              formater: selectObjFormatter('batchRequire')
            },
            _templateType: {
              prop: 'templateType',
              label: '制板类型',
              formater: selectObjFormatter('templateType')
            },
            _standard: {
              prop: 'standard',
              label: '规格',
              formater: selectObjFormatter('standard')
            }
          },
          dataSource: [],
          highlightCurrentRow: true,
          headerCellClassName: 'plate-making-table-header-cell',
          currentRowKey: 'id',
          rowClick: (row, column, event) => {
            this.currentReqRow = row
          }
        }
      }
    }
  },

  computed: {
    customerId() {
      return this.$route.params.id
    },
    currentIndex() {
      return this.rawData.findIndex(item => this.getAddrId(item) === this.tabName)
    }
  },

  watch: {
    dataSource: {
      deep: true,
      handler(val) {
        this.rawData = val
      }
    },
    rawData: {
      handler(val) {
        this.tabKeyMap = val.map(item => this.getAddrId(item))
        if (!val || !val.length) {
          this.baseForm && this.baseForm.clearValidate()
        }
      }
    },
    sendRequirementList: {
      deep: true,
      handler(val) {
        this.updateTableDataSource(val)
      }
    },
    baseFormData(val) {
      updateSelectDataSource(this.baseData, this.baseFormData, true)
    },
    isEdit(val) {
      if (val) {
        updateSelectDataSource(this.baseData, this.baseFormData, true)
      }
    }
  },

  created() {
    this.getHandoverType()
  },

  methods: {
    inputTypeChange() {
      return (this.isEdit && this.rawData.length) ? 'input' : 'itemview'
    },

    selectTypeChange() {
      return (this.isEdit && this.rawData.length) ? 'select' : 'itemview'
    },

    getHandoverType() {
      this.getOptionConfig({ fieldName: '寄送类型' })
        .then(res => {
          this.defHandoverType = Array.isArray(res) && res.find(item => item.label === '客户') || {}
        })
    },

    updateData(data) {
      data = data || this.rawData[this.currentIndex] || this.getDefaultData()

      this.tableDataSource = data.sendTemplateList || []
      this.baseFormData = data
    },

    async handleTabsEdit(tabName, action) {
      if (action === 'add') {
        this.handleSelectAddr()
      } else if (action === 'remove') {
        const res = await this.$uiUtils.confirmMsg({ message: '确认删除这条地址吗？' })
        if (res) {
          this.handleDeleteAddr(tabName)
          this.$message.success('删除成功')
        }
      }
    },

    handleTabClick() {
      this.updateData(this.rawData.find(item => this.getAddrId(item) === this.tabName))
    },

    handleAddAddr() {
      this.addAddrPopOptions.visible = true
    },

    handleAddrSaveAndAdd(newRow) {
      this.addAddrPopForm && this.addAddrPopForm.validate(async valid => {
        if (valid) {
          this.addAddrReq(newRow).then(() => {
            this.$message.success('新增成功')
            this.addAddrPopOptions.formDatas = {}
            this.$nextTick(() => {
              this.addAddrPopForm.clearValidate()
            })
          })
        }
      })
    },

    addAddrReq(params) {
      return receiptAdd({
        customerId: this.customerId,
        ...params
      })
    },

    handleSelectAddr() {
      this.getAddrListData()
      this.addrPopOptions.visible = true
    },

    handleDeleteAddr(tabName) {
      const idx = this.rawData.findIndex(item => this.getAddrId(item) === tabName)

      if (idx === -1) {
        return
      }

      // 如果删除的是当前地址，切到后一个地址或者末位
      if (idx === this.currentIndex) {
        let newIdx = idx
        const newLen = this.rawData.length - 1 // 删除后的数据数

        if (newLen >= 1) {
          newIdx = (newIdx > newLen - 1) ? newLen - 1 : newIdx + 1
          this.setActiveTab(this.tabKeyMap[newIdx])
          this.updateData()
        } else {
          // 删除最后一条数据后应该清空页面内容
          this.setActiveTab('')
          this.updateData({})
        }
      }

      this.rawData.splice(idx, 1)
    },

    getAddrListData(params) {
      getAddressList({ customerId: this.customerId, ...params }).then(res => {
        const list = res.data || []
        const tableOptions = this.addrPopOptions.popTableOptions

        tableOptions.dataSource = this.addrListFilter(list) || []
      })
    },

    addrListFilter(data) {
      if (!data || !data.length) {
        return []
      }

      return data.filter(item => !this.rawData.some(curRow =>
        curRow.customerAddressId === item.customerAddressId
      ))
    },

    handleSelectReq() {
      this.reqPopOptions.popTableOptions.dataSource = this.sendRequirementListFilter(this.$utils.deepClone(this.sendRequirementList))
      this.reqPopOptions.visible = true
    },

    handleDeleteReq(scope) {
      const idx = this.currentIndex

      if (idx !== -1) {
        const { sendTemplateList = [] } = this.rawData[idx]
        sendTemplateList.splice(scope.$index, 1)
      }
    },

    addrPopCancel() {
      this.addrPopOptions.visible = false
    },

    addrPopClose() {
      const table = this.$refs.addrPop && this.$refs.addrPop.gettable()
      table && table.setCurrentRow() // 清除当前行的选中状态

      this.addrPopOptions.popTableOptions.dataSource = []
      this.currentAddrRow = null
    },

    reqPopCancel() {
      this.reqPopOptions.visible = false
    },

    reqPopClose() {
      const table = this.$refs.reqPop && this.$refs.reqPop.gettable()
      table && table.setCurrentRow() // 清除当前行的选中状态

      this.currentReqRow = null
    },

    getReceiveCompany(item) {
      return item && item.receiveCompany || ''
    },

    getAddrId(item) {
      return item && item.customerAddressId || ''
    },

    setActiveTab(tabName) {
      this.tabName = tabName
    },

    updateTableDataSource(val = []) {
      console.log('制板要求->寄送要求->寄送板型可选数据列表:', val)

      // 过滤掉不存在的制板类型
      this.rawData.forEach((item, idx) => {
        const curList = this.rawData[idx] && this.rawData[idx].sendTemplateList || []

        this.rawData[idx].sendTemplateList = curList.filter(curRow =>
          val.some(cmpRow => sameSpan(curRow, cmpRow))
        )
      })

      this.tableDataSource = this.rawData[this.currentIndex] && this.rawData[this.currentIndex].sendTemplateList || []
    },

    sendRequirementListFilter(data) {
      if (!data || !data.length) {
        return []
      }

      return data.filter(curRow => !this.tableDataSource.some(cmpRow =>
        sameSpan(curRow, cmpRow)
      ))
    },

    getDefaultData() {
      return {
        handoverTypeName: '客户',
        handoverTypeId: this.defHandoverType && this.defHandoverType.value,
        logisticsCompany: null,
        paymentMethod: null,
        labelLanguage: null,
        sendTemplateList: []
      }
    },

    beforeSave() {
      if (!this.rawData || !this.rawData.length) {
        return
      }

      this.baseForm && this.baseForm.validate()
    },

    handleCancel() {
      this.baseForm && this.baseForm.clearValidate()
    }
  }
}
</script>

<style scoped lang="scss">
.top-box {
  position: relative;
  margin-top: 20px;

  .btn-wrap {
    position: absolute;
    right: 0;
    top: 0;
  }
}

.tag-box {
  display: flex;
  align-items: center;
  width: 100%;
  flex-wrap: wrap;
  border-bottom: 1px solid #eeeff0;

  /deep/ .el-tabs {
    width: 100%;
    min-height: 27px;

    .el-tabs__nav-scroll {
      margin: 0 10px 0 30px;
    }

    .el-tabs__header {
      border: none;
      margin: 0;
    }

    .el-tabs__nav {
      border: none;
    }

    .el-tabs__item {
      padding: 0 20px !important;
      height: 28px !important;
      line-height: 28px !important;
      font-size: 12px !important;
      color: #3C4043;
      font-weight: 400;
      margin-right: 5px;
      border: 1px solid #dfe4ed;
      border-top-right-radius: 4px;
      border-top-left-radius: 4px;

      &.is-active {
        border-bottom-color: #FFFFFF;
      }
    }

    .el-tabs__new-tab {
      margin: 0;
      position: relative;

      &::before {
        content: '添加';
        position: absolute;
        top: -2px;
        left: 14px;
        font-size: 14px;
      }
    }

    .el-icon-plus {
      display: none;
    }

    .el-tabs__new-tab {
      width: 58px;
      height: 28px;
      line-height: 30px;
      border: 1px solid #1890ff;
      color: #1890ff;
      margin-top: -9px;
    }
  }

  &.tag-box-customer {
    /deep/ .el-tabs {
      .el-tabs__item {
        &:nth-child(1) span {
          display: none;
        }
      }
    }
  }

  &--view {
    /deep/ .el-tabs {
      .el-tabs__new-tab {
        display: none;
      }

      .el-tabs__item {
        span {
          display: none;
        }
      }
    }
  }

}
</style>
