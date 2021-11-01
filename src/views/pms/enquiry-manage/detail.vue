<template>
  <div class="OrderDetail details" style="margin-top: 0">
    <div class="head-base">
      <div class="msg-lf">
        询价订单号：
        {{ msg && msg.inquiryNo || "" }}
      </div>
      <div v-if="id" class="msg-lr">
        <div v-if="msg && msg.createdName">
          {{ `询价：${msg.createdName}` }}
          <template v-if="msg && msg.createdTime">{{
            `${parseTime(msg.createdTime)}`
          }}</template>
        </div>
        <div v-if="msg && msg.completeName">
          {{ `完成：${msg.completeName}` }}
          <template v-if="msg && msg.completeDate">{{
            `${parseTime(msg.completeDate)}`
          }}</template>
        </div>
        <div v-if="msg && msg.cancellerName">
          {{ `取消：${msg.cancellerName}` }}
          <template v-if="msg && msg.cancelDate">
            {{ `${parseTime(msg.cancelDate)}` }}</template>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-title card-title-flex">
        <div>基本信息</div>
        <div class="type">
          类型：
          <span>纱</span>
        </div>
      </div>
      <cs-custom-form
        ref="baseForm"
        :data-source="baseDataSource"
        :options="baseOptions"
        :form-datas="baseDatas"
      />
    </div>
    <div class="edit-table card">
      <div
        class="card-title"
        :style="{
          'border-bottom':
            type === 'detail' && status !== 1 ? '1px solid #e9eff2' : 'none',
        }"
      >
        询价清单
        <div v-if="type !== 'detail'" class="fr btnGroup">
          <el-button size="small" @click="del">删除</el-button>
          <el-button type="primary" size="small" @click="add">新增</el-button>
        </div>
      </div>

      <el-button-group
        v-if="type === 'detail'"
        class="sumBtnGroup"
      >
        <el-button
          size="small"
          :class="{ activeBtn: activeName === '0' }"
          @click="handleClick('0')"
        >汇总</el-button>
        <el-button
          size="small"
          :class="{ activeBtn: activeName === '1' }"
          @click="handleClick('1')"
        >明细</el-button>
      </el-button-group>
      <div
        v-show="activeName === '1'"
        class="table-detail"
        :class="{ edit: type !== 'detail' }"
      >
        <cs-custom-form
          ref="table"
          :data-source="tableDataSource"
          :form-datas="tableFormDatas"
          style="margin: 0 20px"
          edit-type="pop"
          :options="tableOptions"
        />
      </div>
      <div v-show="type === 'detail' && activeName === '0'">
        <collect-list :parmas="collectList" />
      </div>
    </div>
    <cs-custom-pop
      v-if="popOptions.visible"
      :options="popOptions"
      @close="popOptions.visible = false"
    />
    <div class="detail">
      <cs-custom-pop
        ref="enterPop"
        :options="enterPopOptions"
      />
    </div>
    <bottomBar :config="barConfig" />
  </div>
</template>

<script>
import bottomBar from '@/components/button-bar/index.vue'
import * as api from './api/index.js'
import { deepClone, parseTime } from '@/utils'
import * as apiPub from '@/views/pms/public/api/index.js'
import * as demandList from '@/views/pms/demand-management/api/index.js'
import { fetchLog } from '@/views/pms/public/fetchLog.js'
import collectList from './components/collect-list'
export default {
  name: 'OrderDetail',
  components: { bottomBar, collectList },
  mixins: [fetchLog],
  data() {
    const validRule = (rule, value, callback) => {
      const reg = /^\d+\.?\d{0,2}$/
      if (parseFloat(value) === 0) {
        return callback(new Error('请输入大于0的数值'))
      } else if (value && !reg.test(value)) {
        return callback(new Error('请输入大于0的两位数值'))
      } else if (value > 99999999.99) {
        return callback(new Error('请输入小于99999999.99的两位数值'))
      }
      return callback()
    }
    const itemStyle = { width: '25%' }
    // 清单以及弹框中公共字段
    const publicColumns = {
      _index: {
        type: 'index',
        label: '序号',
        width: '70',
        formater: (scope) => {
          if (this.popOptions.visible) {
            const pages = this.popOptions.content._demandTable.pagination
            if (pages) {
              return (
                (pages.currentPage - 1) * pages.pageSize + (scope.$index + 1)
              )
            }
          } else {
            const pages = this.tableDataSource._tableForm.pagination
            if (pages) {
              return (
                (pages.currentPage - 1) * pages.pageSize + (scope.$index + 1)
              )
            }
          }
          return scope.$index + 1
        }
      },
      _demandNumber: {
        prop: 'demandNumber',
        label: '采购需求号',
        minWidth: '150',
        isShow: () => {
          return this.activeName !== '0'
        }
      },
      _materiel: {
        prop: 'materiel',
        label: '纱线编码',
        minWidth: '100',
        showOverflowTooltip: true,
        formater: scope => scope.row.materielInfo && scope.row.materielInfo.materiel || ''
      },
      _materielName: {
        prop: 'materielName',
        label: '纱名',
        minWidth: '160',
        showOverflowTooltip: true,
        formater: scope => scope.row.materielInfo && scope.row.materielInfo.materielName || ''
      },
      _materielProperty: {
        prop: 'materielProperty',
        label: '纱属性',
        minWidth: '160',
        showOverflowTooltip: true,
        formater: scope => scope.row.materielInfo && scope.row.materielInfo.materielProperty || ''
      },
      _demandDate: {
        prop: 'demandDate',
        label: '需求交期',
        minWidth: '100',
        formater: (scope) => scope.row.demandDate && parseTime(scope.row.demandDate, '{y}-{m}-{d}') || ''
      },
      _demandWeight: {
        prop: 'demandWeight',
        label: '需求重量(KG)',
        minWidth: '110',
        showOverflowTooltip: true,
        align: 'right'
      }
    }
    // 基本信息
    const baseDataSource = {
      _expirationDate: {
        prop: 'expirationDate',
        itemType: 'date',
        label: '报价截止日期：',
        format: 'yyyy-MM-dd',
        style: {
          width: '80%'
        },
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 1 * 24 * 60 * 60 * 1000
          }
        },
        valueFormat: 'timestamp',
        rules: [{ required: true, message: '请选择截止日期' }]
      },
      _suppliers: {
        prop: 'suppliers',
        itemType: 'select',
        labelWidth: '80',
        label: '供应商：',
        placeholder: '请选择供应商',
        valueType: 'object',
        dataSource: [],
        multiple: true,
        filterable: true,
        clearable: true,
        style: {
          width: '700px'
        },
        rules: [{ required: true, message: '请选择供应商' }],
        change: (val, form, formDatas, setFormDatas) => {
          if (val.length > 5) {
            this.$message.warning('最多五个')
            setFormDatas({ suppliers: val && val.slice(0, 5) || null })
          } else {
            this.baseDatas.suppliers = val
          }
        }
      }
    }
    // 询价清单
    const columns = {
      _selection: {
        type: 'selection',
        prop: 'selection',
        // fixed: "left",
        isShow: () => {
          return this.type !== 'detail'
        }
      },
      ...publicColumns,
      ...{
        _expectedDate: {
          prop: 'expectedDate',
          labelClassName: 'product-is-request',
          className: 'product-no-request',
          label: '期望交期',
          width: '180px',
          editOptions: {
            type: 'date',
            itemType: 'date',
            format: 'yyyy-MM-dd',
            valueFormat: 'timestamp',
            placeholder: '请选择交期',
            labelWidth: '0',
            pickerOptions: {
              disabledDate(time) {
                return time.getTime() < Date.now() - 1 * 24 * 60 * 60 * 1000
              }
            },
            rules: [
              {
                required: true,
                message: '请选择交期',
                trigger: ['change']
              }
            ],
            change: (val, v1, v2, v3, scope) => {
              this.$set(
                this.tableDataSource._tableForm.dataSource[scope.$index],
                'expectedDate',
                val
              )
            }
          },
          formater: (scope) => {
            this.$set(scope.row, 'edit', this.type !== 'detail')
            return scope.row.expectedDate
              ? parseTime(scope.row.expectedDate, '{y}-{m}-{d}')
              : ''
          }
        }
      }
    }
    // 新增弹框操作按钮
    const popOptions = {
      itemType: 'dialog',
      visible: false,
      title: '采购需求',
      width: '1160px',
      okText: '添加至询价清单',
      ok: () => {
        if (!this.addList.length) {
          this.$message({
            message: '请选择询价需求数据',
            type: 'warning'
          })
          return
        }
        const addArr = deepClone(this.addList)
        addArr.forEach((k) => {
          k.purchaseWeight = k.stayPurchaseWeight
        })
        const list = addArr.filter(e => !this.tableDataSource._tableForm.dataSource.find(ele => ele.id === e.id))
        const arr = deepClone([
          ...this.tableDataSource._tableForm.dataSource,
          ...list
        ])
        this.tableDataSource._tableForm.dataSource = arr
        this.popOptions.visible = false
      },
      close: () => {
        this.popOptions.visible = false
      },
      cancel: (params) => {
        this.popOptions.visible = false
      },
      formDatas: {},
      formOptions: {
        inline: true,
        className: 'detail'
      },
      content: {
        _materiel: {
          prop: 'materiel',
          itemType: 'input',
          label: '纱线编码',
          clearable: true,
          placeholder: '请输入纱线编码',
          itemStyle
        },
        _materielName: {
          prop: 'materielName',
          itemType: 'input',
          label: '纱名',
          clearable: true,
          placeholder: '请输入纱名',
          itemStyle,
          formater: (scope) => {
            return scope.row.materielInfo && scope.row.materielInfo.materielName
              ? scope.row.materielInfo.materielName
              : '-'
          }
        },
        _materielProperty: {
          prop: 'materielProperty',
          itemType: 'input',
          label: '纱属性',
          clearable: true,
          placeholder: '请输入纱属性',
          itemStyle,
          formater: (scope) => {
            return scope.row.materielInfo &&
              scope.row.materielInfo.materielProperty
              ? scope.row.materielInfo.materielProperty
              : ''
          }
        },
        _operate: {
          itemType: 'operate',
          submitText: '查询',
          submitHandle: (params) => {
            let purchaseBeginDate = ''
            let purchaseEndDate = ''
            if (params.hasOwnProperty('purchaseDate') && params.purchaseDate) {
              purchaseBeginDate = params.purchaseDate[0]
              purchaseEndDate = params.purchaseDate[1]
            }
            const result = purchaseBeginDate
              ? { ...params, purchaseBeginDate, purchaseEndDate }
              : params
            delete result.purchaseDate
            this.addSearch = result
            const pages = this.popOptions.content._demandTable.pagination
            pages.pageSize = 20
            pages.pageNum = 1
            this.getAddList()
          },
          resetHandle: () => {
            this.addSearch = {}
          }
        },
        _purchaseDate: {
          prop: 'purchaseDate',
          itemType: 'date',
          type: 'daterange',
          label: '需求交期',
          startPlaceholder: '开始日期',
          endPlaceholder: '结束日期',
          format: 'yyyy-MM-dd',
          valueFormat: 'timestamp',
          itemStyle,
          formater: (scope) => scope.row.purchaseDate && parseTime(scope.row.purchaseDate, '{y}-{m}-{d}') || ''
        },
        _demandTable: {
          width: '1200px',
          height: '300px',
          layout: true,
          prop: 'demandTable',
          itemType: 'table',
          pagination: {
            currentChange: (val) => {
              const pages = this.popOptions.content._demandTable.pagination
              pages.pageNum = val
              this.getAddList()
            },
            sizeChange: (val) => {
              const pages = this.popOptions.content._demandTable.pagination
              pages.pageSize = val
              pages.pageNum = 1
              this.getAddList()
            }
          },
          selectionChange: (val) => {
            this.addList = val
          },
          columns: {
            _selection: {
              type: 'selection'
            },
            ...publicColumns
          },
          dataSource: [],
          itemStyle: {
            width: '100%',
            'margin-bottom': 0
          }
        }
      }
    }
    // 填写报价
    const enterPopOptions = {
      itemType: 'dialog',
      visible: false,
      title: '填写报价',
      width: '1360px',
      okText: '提交报价',
      ok: async(val) => {
        const list = this.quotationPopList.filter(e => e.supplierId * 1 !== this.enterPopOptions.formDatas['tabs'] * 1)
        list.push(...val.tableForm)
        this.quotationPopList = list
        await api.submitQuote({
          code: this.purchaseOrderNumber,
          data: {
            quotations: this.quotationPopList.map(e => ({
              id: e.id,
              estimatedDate: e.estimatedDate,
              remark: e.remark,
              rmbTotalPrice: e.rmbTotalPrice,
              rmbUnitPrice: e.rmbUnitPrice
            }))
          }
        })
        this.$message.success('提交成功')
        this.enterPopOptions.visible = false
        this.getList()
      },
      close: () => {
        this.enterPopOptions.visible = false
      },
      cancel: (params) => {
        this.enterPopOptions.visible = false
      },
      formOptions: {
        popError: true
      },
      formDatas: {},
      content: {
        _tabs: {
          prop: 'tabs',
          itemType: 'tabs',
          type: 'card',
          labelWidth: '0',
          dataSource: [],
          change: val => {
            const list = this.quotationPopList.filter(e => e.supplierId * 1 !== this.enterPopOptions.formDatas['tabs'] * 1)
            list.push(...this.$refs.enterPop.$refs.popComponents.$refs.customform.dynamicValidateFormRuleForm.tableForm)
            this.quotationPopList = list
            this.enterPopOptions.formDatas['tabs'] = val
            this.changeSuppliers(val)
          }
        },
        _tableForm: {
          prop: 'tableForm',
          itemType: 'table-form',
          // label: '表格表单',
          props: { edit: 'edit' },
          rowClick: (...rest) => {},
          dataSource: [],
          columns: {
            _index: { ...publicColumns._index },
            _materiel: { ...publicColumns._materiel },
            _materielName: { ...publicColumns._materielName },
            _materielProperty: { ...publicColumns._materielProperty },
            _expectedDate: {
              prop: 'expectedDate',
              label: '期望交期',
              minWidth: '110',
              formater: scope => scope.row.expectedDate && this.$utils.parseTime(scope.row.expectedDate, '{y}-{m}-{d}') || ''
            },
            _demandWeight: { ...publicColumns._demandWeight },
            _rmbUnitPrice: {
              label: '含税单价',
              width: '110px',
              labelClassName: 'product-is-request',
              className: 'product-no-request',
              prop: 'rmbUnitPrice',
              editOptions: {
                itemType: 'input',
                labelWidth: '0',
                itemProp: 'rmbUnitPrice',
                itemStyle: {
                  padding: '6.5px 0'
                },
                rules: [
                  {
                    required: true,
                    trigger: ['change'],
                    validator: validRule
                  }
                ],
                change: (value, v1, v2, v3, scope, index) => {
                  scope.row.rmbUnitPrice = value
                  scope.row.rmbTotalPrice = this.$utils.getFloat(value * scope.row.demandWeight, 2) || ''
                }
              }
            },
            _estimatedDate: {
              prop: 'estimatedDate',
              labelClassName: 'product-is-request',
              className: 'product-no-request',
              label: '预计交期',
              width: '170px',
              editOptions: {
                type: 'date',
                itemType: 'date',
                format: 'yyyy-MM-dd',
                valueFormat: 'timestamp',
                placeholder: '请选择交期',
                labelWidth: '0',
                pickerOptions: {
                  disabledDate(time) {
                    return time.getTime() < Date.now() - 1 * 24 * 60 * 60 * 1000
                  }
                },
                change: (val, v1, v2, v3, scope) => {
                  this.$set(
                    this.tableDataSource._tableForm.dataSource[scope.$index],
                    'estimatedDate',
                    val
                  )
                }
              },
              formater: (scope) => {
                this.$set(scope.row, 'edit', this.type !== 'detail')
                return scope.row.estimatedDate
                  ? parseTime(scope.row.estimatedDate, '{y}-{m}-{d}')
                  : ''
              }
            },
            _rmbTotalPrice: {
              label: '含税总价',
              width: '150px',
              prop: 'rmbTotalPrice',
              editOptions: {
                itemType: 'input',
                labelWidth: '0',
                itemProp: 'rmbTotalPrice',
                disabled: true
              }
            },
            _remark: {
              label: '备注',
              minWidth: '200',
              prop: 'remark',
              editOptions: {
                itemType: 'input',
                labelWidth: '0',
                itemProp: 'remark',
                maxlength: 100
              }
            }
          }
        }
      }
    }
    const barConfig = {
      _update: {
        type: 'primary',
        text: '填写报价',
        submit: async() => {
          this.enterPopOptions.visible = true
          this.enterPopOptions.formDatas['tabs'] = this.baseDatas.suppliers[0].value
          this.enterPopOptions.content['_tabs'].dataSource = this.baseDatas.suppliers
          this.quotationPopList = [...this.collectList.quotationList]
          this.changeSuppliers(this.baseDatas.suppliers[0].value)
        },
        isShow: () => this.status === 0 && this.type === 'detail' && this.$permission(['pms:inquiry:quote'])
      },
      _submit: {
        type: '',
        text: '完成报价',
        submit: async() => {
          await api.complete(this.purchaseOrderNumber)
          this.outFun({
            type: 'IMPORT',
            url: '/pms/inquiry/complete/',
            pro: 'id',
            beforeText: `在'询价管理-询价订单' 完成${this.purchaseOrderNumber}报价`
          })
          this.$message.success('操作成功')
          this.$router.push('/pms/enquiry-management/list')
        },
        isShow: () => this.status === 0 && this.type === 'detail' && this.$permission(['pms:inquiry:complete']),
        disabled: () => !this.isOver
      },
      _edit: {
        type: '',
        text: '编辑',
        submit: () => {
          this.$router.push({
            path: '/pms/enquiry-manage/edit',
            query: { id: this.purchaseOrderNumber }
          })
        },
        isShow: () => this.status === 0 && this.type === 'detail' && this.$permission(['pms:inquiry:modify'])
      },
      _download: {
        type: '',
        text: '下载报价单',
        submit: () => {
          api.download(this.purchaseOrderNumber).then(res => {
            this.outFun({
              type: 'IMPORT',
              url: '/pms/inquiry/download/',
              pro: 'id',
              beforeText: `在'询价管理-询价单下载了${this.purchaseOrderNumber}`
            })
            this.$utils.downloadStream(res)
          })
        },
        isShow: () => this.status === 0 && this.type === 'detail' && this.$permission(['pms:inquiry:download'])
      },
      _creat: {
        type: 'primary',
        text: '生成询价单',
        submit: () => {
          this.submit('creat')
        },
        isShow: () => this.type === 'new'
      },
      _save: {
        type: 'primary',
        text: '保存',
        submit: () => {
          this.$confirm('保存会清空之前报价，是否继续保存？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            customClass: 'OrderDetail'
          }).then(() => {
            this.submit('submit')
          })
        },
        isShow: () => this.type === 'edit' && this.$permission(['pms:inquiry:modify'])
      },
      _cancel: {
        type: '',
        text: '取消询价单',
        submit: () => {
          this.$confirm('确认取消该询价订单？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            customClass: 'OrderDetail'
          }).then(() => {
            this.cancelHandle()
          })
        },
        isShow: () => this.status === 0 && this.type === 'detail' && this.$permission(['pms:inquiry:cancel'])
      },
      _cancelform: {
        type: '',
        text: '取消',
        isShow: () => this.status !== 2 && this.type !== 'detail',
        submit: () => {
          this.$router.go(-1)
          // this.onload()
        }
      },
      _back: {
        type: '',
        text: '返回',
        isShow: () => {
          return this.type === 'detail'
        },
        submit: () => {
          this.$router.push('/pms/enquiry-management/list')
        }
      }
    }
    const pagination = {
      currentChange: (val) => {
        const pages = this.tableDataSource._tableForm.pagination
        pages.pageNum = val
        this.getList(this.activeName === '1' ? 'detailPage' : 'billPage')
      },
      sizeChange: (val) => {
        const pages = this.tableDataSource._tableForm.pagination
        pages.pageSize = val
        pages.pageNum = 1
        this.getList(this.activeName === '1' ? 'detailPage' : 'billPage')
      }
    }
    return {
      barConfig,
      popOptions,
      enterPopOptions,
      columns,
      activeName: '1',
      tableOptions: {
        popError: true
      },
      tableDataSource: {
        _tableForm: {
          className: 'detail',
          prop: '_privateTableForm',
          itemType: 'table-form',
          dataSource: [],
          selectionChange: (val) => {
            this.listDel = val
          },
          columns,
          pagination: null
        }
      },
      tableFormDatas: {},
      baseDataSource,
      baseDatas: {},
      baseOptions: {
        inline: true,
        className: 'msg-conten'
      },
      dialogType: 'new',
      listDel: [],
      msg: {},
      addList: [],
      parseTime,
      pagination,
      addSearch: {},
      id: '',
      form: {},
      collectList: {},
      quotationPopList: []
    }
  },
  computed: {
    pages() {
      return this.tableDataSource._tableForm.pagination
    },
    status() {
      return this.msg && this.msg.status
    },
    list() {
      return this.tableDataSource._tableForm.dataSource || []
    },
    type() {
      return this.$route.params.type
    },
    purchaseOrderNumber() {
      return this.$route.query.id
    },
    isOver() {
      const arr = this.collectList.bomDetailList || []
      return arr.every(e => e.quoted)
    }
  },
  watch: {
    type: {
      handler(v) {
        if (v === 'detail') {
          this.baseDataSource['_expirationDate'].disabled = true
          this.baseDataSource['_suppliers'].disabled = true
        }
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    this.getConstant()
  },
  methods: {
    isShowCode() {
      if (this.form && this.form.payCurrency && this.form.payCurrency.code) {
        // 选择汇率后表头单位
        const columns = this.tableDataSource._tableForm.columns
        this.$set(
          columns['_unitPrice'],
          'label',
          `含税单价(${this.form.payCurrency.code})`
        )
        this.$set(
          columns['_totalPrice'],
          'label',
          `总价(${this.form.payCurrency.code})`
        )
      }
    },
    add() {
      const fun = () => {
        this.dialogType = 'new'
        this.popOptions.visible = true
        this.addList = []
      }
      const pages = this.popOptions.content._demandTable.pagination
      pages.pageSize = 20
      pages.pageNum = 1
      this.getAddList(fun)
    },
    onload(id) {
      this.$router.push({
        path: '/pms/enquiry-manage/detail',
        query: {
          id: id || this.purchaseOrderNumber,
          timestamp: new Date().getTime()
        }
      })
    },
    resetBill() {
      this.list.forEach((i, index) => {
        const j =
          this.$utils.getFloat(i.unitPrice, 2) *
            this.$utils.getFloat(this.form.exchangeRate, 2) || 0
        this.$set(i, 'rmbUnitPrice', this.$utils.getFloat(j, 2))
        this.getSum({
          obj: i,
          property: 'unitPrice',
          val: i.unitPrice,
          index: index
        })
      })
    },
    getParams() {
      const res = {
        id: this.id || undefined,
        supplier: this.supplier, // 供应商
        classification: 1
      }
      return res
    },
    async submit(type) {
      const arr = this.$refs.table.dynamicValidateFormRuleForm['_privateTableForm']
      if (!arr.length) {
        this.$message.error('请添加询价清单')
        return
      }
      Promise.all([
        new Promise((resolve, reject) => {
          this.$refs.baseForm.form.validate(valid => {
            if (valid) resolve(valid)
          })
        }),
        new Promise((resolve, reject) => {
          this.$refs.table.form.validate(valid => {
            if (valid) resolve(valid)
          })
        })
      ]).then(async() => {
        const bomDetails = arr.map(e => ({
          demandNumber: e.demandNumber,
          expectedDate: e.expectedDate
        }))
        const suppliers = (this.$refs.baseForm.dynamicValidateFormRuleForm.suppliers || []).map(e => ({
          supplierName: e.label,
          supplierId: e.value
        }))
        const data = {
          classification: 1,
          expirationDate: this.$refs.baseForm.dynamicValidateFormRuleForm.expirationDate,
          suppliers,
          bomDetails
        }
        const res = await api[type](data, this.purchaseOrderNumber)
        this.$message.success('操作成功')
        if (this.type === 'new') {
          this.$router.push({
            path: '/pms/enquiry-manage/detail',
            query: { id: res.data }
          })
          this.outFun({
            type: 'INSERT',
            url: '/pms/inquiry/add',
            pro: 'id',
            remark: data,
            beforeText: `在'询价管理-询价订单'新增一条记录`,
            beforeCode: `: 成功新增${data}`
          })
        } else {
          this.outFun({
            oldData: this.msg,
            newData: data,
            type: 'UPDATE',
            url: '/pms/inquiry/modify/',
            pro: 'id',
            remark: data,
            beforeText: `在'询价管理-询价订单编辑了${this.purchaseOrderNumber}`,
            beforeCode: `: 保存询价单${data}}`
          })
          this.type === 'edit'
            ? this.$router.push({
              path: '/pms/enquiry-manage/detail',
              query: { id: this.purchaseOrderNumber }
            }) : ''
        }
      })
    },
    async getConstant() {
      // 供应商
      const res = await apiPub.getSupplier({ supplierCategory: 0 })
      this.baseDataSource['_suppliers'].dataSource = res.data && res.data.map(e => ({
        label: e.supplierName,
        value: String(e.id)
      }))
      // if (this.purchaseOrderNumber) {
      //   const res = await api.info(this.purchaseOrderNumber)
      //   this.getInfo(res)
      // }
      if (this.purchaseOrderNumber) {
        const res = await api.info(this.purchaseOrderNumber)
        this.getInfo(res)
      } else {
        const a = localStorage.getItem('pmsDemanEnuiry')
        if (a) {
          const arr =
            JSON.parse(a) && JSON.parse(a).result.length
              ? JSON.parse(a).result
              : []
          arr.length &&
            arr.forEach((k) => {
              k.purchaseWeight = k.stayPurchaseWeight
              k.demandDate = k.purchaseDate
            })
          this.tableDataSource._tableForm.dataSource = arr
        }
      }
      localStorage.removeItem('pmsDemanEnuiry')
    },
    async getAddList(callback) {
      const pages = this.popOptions.content._demandTable.pagination
      const res = await demandList.list(this.addSearch, {
        pageSize: pages.pageSize || 20,
        pageNum: pages.pageNum || 1,
        status: 1
      })
      const list = (res.data.list || []).map(e => ({
        ...e,
        demandDate: e.purchaseDate
      }))
      this.$set(
        this.popOptions.content._demandTable,
        'dataSource',
        list
      )
      this.popOptions.content._demandTable.pagination = {
        ...this.popOptions.content._demandTable.pagination,
        dataTotal: res.data.total || 0,
        currentPage: res.data.pageNum,
        pageNum: res.data.pageNum,
        pageSize: res.data.pageSize
      }
      callback && callback()
    },
    async getList(property) {
      const res = await api.detailPage({ code: this.purchaseOrderNumber })
      this.tableDataSource._tableForm.dataSource = res.data.list || []
      const bomDetailList = (await api.billPagexq({ code: this.purchaseOrderNumber })).data.list || []
      const quotationList = (await api.billPagegys({ code: this.purchaseOrderNumber })).data.list || []
      this.collectList = {
        suppliers: this.baseDatas.suppliers,
        quotationList,
        bomDetailList
      }
    },
    // 切换供应商
    changeSuppliers(id) {
      const arr = JSON.parse(JSON.stringify(this.collectList.bomDetailList || []))
      const data = [...this.quotationPopList]
      const list = arr.reduce((a, n) => {
        const obj = data.find(ele => ele.supplierId === id && ele.inquiryBomId === n.id && !a.find(e => e.id === ele.id))
        if (obj) {
          a.push({ ...n, ...obj, id: obj.id, edit: true })
        }
        return a
      }, [])
      this.enterPopOptions.content['_tableForm'].dataSource = list
    },
    handleClick(val) {
      this.activeName = val
    },
    del() {
      if (this.listDel.length) {
        this.listDel.forEach((i) => {
          const k = this.tableDataSource._tableForm.dataSource.findIndex(
            (j) => j.id === i.id
          )
          if (k !== -1) {
            this.tableDataSource._tableForm.dataSource[k]['del'] = true
          }
        })
        this.tableDataSource._tableForm.dataSource = this.tableDataSource._tableForm.dataSource.filter(
          (i) => !i.del
        )
      } else {
        this.$message({
          type: 'info',
          message: '请选择数据'
        })
      }
    },
    getInfo(res) {
      this.id = res.data.id
      this.msg = res.data || {}
      res.data.classification = '纱'
      this.baseDatas = {
        expirationDate: res.data.expirationDate,
        suppliers: (res.data.suppliers || []).map(e => ({
          ...e,
          label: e.supplierName,
          value: e.supplierId
        }))
      }
      if (this.pages) {
        // 详情显示页码，编辑页全量显示
        this.tableDataSource._tableForm.pagination.pageNum = 1
        this.tableDataSource._tableForm.pagination.pageSize = 20
      }
      this.getList('detailPage')
    },
    async cancelHandle() {
      await api.cancel(this.purchaseOrderNumber)
      this.outFun({
        oldData: this.msg,
        newData: {
          ...this.msg,
          status: 2
        },
        type: 'UPDATE',
        url: '/pms/inquiry/cancel/',
        pro: 'id',
        remark: {
          ...this.msg
        },
        beforeText: `在'询价管理-询价订单' 取消了询价订单${JSON.stringify({
          id: this.purchaseOrderNumber
        })}}`
      })
      this.$message({
        type: 'success',
        message: '取消成功'
      })
      this.onload()
    }
  }
}
</script>

<style scoped lang="scss">
/deep/ .el-tabs__nav-wrap .el-tabs__nav .el-tabs__item.is-active {
  border-bottom: 2px solid #1890ff;
}
/deep/ .el-tabs__nav .el-tabs__item {
  border: 0;
  padding: 0 !important;
  margin: 0 20px;
}
/deep/ .el-tabs__nav-wrap .el-tabs__nav {
  border: 0;
}
/deep/ .el-tabs--card > .el-tabs__header {
  border-bottom: 0;
}
/deep/ .el-form .el-form-item {
  margin-bottom: 0;
}
.OrderDetail {
  padding: 0 20px;
  .activeBtn {
    border: 1px solid #0986ff;
    color: #0986ff;
    z-index: 2;
  }
  .head-base {
    display: flex;
    line-height: 65px;
    justify-content: space-between;
    .msg-lf {
      font-size: 18px;
      color: #151222;
    }
    .msg-lr {
      display: flex;
      font-size: 12px;
      color: #666666;
      > div {
        margin-left: 20px;
      }
    }
  }
  .card {
    .btnGroup {
      margin-right: 20px;
      /deep/.el-button {
        margin-top: -12px;
      }
    }
  }
  .edit-table {
    .sumBtnGroup {
      padding: 16px 0 16px 20px;
    }
  }
}
</style>
<style lang='scss'>
@import "@/styles/base.scss";
.OrderDetail {
  .el-message-box__status {
    top: 0;
  }
  .detail {
    width: 100%;
    .el-table th {
      background-color: #f5f7fa;
      padding: 0;
      .cell {
        height: 40px;
        line-height: 40px;
      }
    }
    .el-table td {
      height: 40px;
      line-height: 40px;
      padding: 0;
    }
  }
  .card {
    .msg-conten {
      width: 100%;
      background: #fff;
      padding: 0 20px 0;
      margin: 16px 0;
      .el-form-item {
        margin-bottom: 18px;
      }
    }
  }
  .card-title-flex {
    display: flex;
    justify-content: space-between;
    .type {
      margin-right: 30px;
      font-size: 14px;
      color: #888e9e;
      span {
        color: #474747;
      }
    }
  }
  .edit-base {
    .edit-base-form {
      background: #fff;
      padding: 20px 20px 0 10px;
      margin: 16px 0;
    }
  }
}
</style>
