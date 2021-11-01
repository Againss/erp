<!--
 * @Author: Do not edit
 * @Date: 2021-04-08 09:13:35
 * @LastEditTime: 2021-06-02 10:09:46
 * @LastEditors: admin
 **  送货单详情页面
 -->
<template>
  <div class="deliveryAll">
    <div class="deliveryDetail">
      <div class="new-header">
        <div class="msg-lf">
          <span>送货单号：</span>
          <span v-if="create === 'create' || addPage === 'addPage'" class="new-tip">提交后生成</span>
          <span v-if="detail === 'detail'">{{ detailData.deliveryNumber }}</span>
        </div>
        <div v-if="detail === 'detail'" class="msg-lr">
          <div>{{ `开单人：${detailData.drawerName}` }}</div>
          <div style="margin-left: 5px">{{ `${parseTime(detailData.drawDate)}` }}</div>
        </div>
      </div>
      <div class="base">
        <div class="top-base">
          <div class="msg-title">基本信息</div>
        </div>
        <cs-custom-form
          :data-source="baseDataSource"
          :options="baseOptions"
          :form-datas="baseDatas"
        />
      </div>
      <!-- 中间信息内容 -->
      <div class="edit-base">
        <cs-custom-form
          ref="searchForm"
          :data-source="formDataSource"
          :options="formOptions"
          :form-datas="formDatas"
        />
      </div>
      <!-- 送货清单列表 -->
      <div class="edit-table base">
        <div class="msg-title">
          送货清单
          <div class="fr">
            <el-button size="small" :disabled="deleDisabled" @click="deleteBtn">删除</el-button>
            <el-button
              type="primary"
              size="small"
              :disabled="addDisabled"
              @click="addClick"
            >新增</el-button>
          </div>
        </div>
        <div class="table-detail detail">
          <cs-custom-form
            ref="tableForm"
            :data-source="tableDataSource"
            :form-datas="tableFormDatas"
            :options="tableformOtions"
            style="margin: 0 20px"
          />
        </div>
        <summationRow :config="sumConfig" style="margin: -30px 0px 20px 20px" />
      </div>
    </div>
    <!-- 按钮部分 -->
    <div class="delivery-button">
      <div class="btn-all">
        <el-button
          v-if="create === 'create' || addPage === 'addPage'"
          v-permission="['pms:deliveryNote:add']"
          size="small"
          type="primary"
          @click="saveList"
        >
          提交
        </el-button>
        <el-button
          v-if="detail === 'detail'"
          v-permission="['pms:deliveryNote:pdfDownload']"
          size="small"
          type="primary"
          @click="downList"
        >
          下载送货单
        </el-button>
        <el-button
          v-if="detail === 'detail'"
          size="small"
          class="btn-cancel"
          @click="comeBack"
        >
          返回
        </el-button>
        <el-button
          v-if="create === 'create' || addPage === 'addPage'"
          size="small"
          class="btn-cancel"
          @click="cancelList"
        >
          取消
        </el-button>
      </div>
    </div>
    <cs-custom-pop class="detail delivery-pop" :options="popOptions" @close="popOptions.visible = false" />
  </div>
</template>

<script>
import { deliveryNoteDetail, detailList, deliveryNoteAdd, deliveryNoteDownload, storePage } from './api/index.js'
import summationRow from '@/views/wms/public/components/summationRow.vue'
// 供应商下拉的接口
import * as apiPub from '@/views/pms/public/api/index.js'
import { parseTime } from '@/utils'
import { planPage } from '@/views/pms/delivery-plan/api/index.js'
import { fetchLog } from '@/views/wms/public/fetchLog'
import popoverColumn from '@/components/cs-custom-table/columns/popover-column'
import propertyCard from '@/components/property-card/index.vue'
export default {
  name: 'DeliveryDetail',
  components: { summationRow },
  mixins: [fetchLog],
  data() {
    const itemStyle = { width: '27%' }
    // 当前时间之前的时间不能选择
    const timeBefore = {
      disabledDate(time) {
        return time.getTime() < Date.now() - 24 * 60 * 60 * 1000
      }
    }
    var validRule = (rule, value, callback) => {
      // const reg = /^\d+\.?\d{0,2}$/
      if (!value || parseFloat(value) === 0) {
        return callback(new Error('请输入大于0的数值'))
      } else if (parseInt(value) > 99999999.99) {
        return callback(new Error('输入数值不能大于99999999.99'))
      }
      return callback()
    }
    var filterVal = (val) => {
      val = val.replace(/[^\d.]/g, '') // 清除“数字”和“.”以外的字符
      val = val.replace(/\.{2,}/g, '.') // 只保留第一个. 清除多余的
      val = val.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
      val = val.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3') // 只能输入两个小数
      return val
    }
    const changeStore = (value, form, formDatas, setFormDatas) => {
      this.$set(this.formDatas, 'warehouse', null)
      this.$set(this.formDatas, 'consigneeAddrName', null)
      this.$set(this.formDatas, 'consigneeManName', null)
      this.$set(this.formDatas, 'consigneePhone', null)

      value.id ? this.storeList(value.id) : ''
    }
    // 送货清单以及弹框中公共字段--1
    const publicOneColumns = {
      _deliveryPlanNumber: {
        prop: 'deliveryPlanNumber',
        label: '送货计划号',
        minWidth: '150'
      },
      _purchaseOrderNumber: {
        prop: 'purchaseOrderNumber',
        label: '采购订单号',
        minWidth: '150'
      },
      _materiel: {
        prop: 'materielInfo.materiel',
        label: '纱线编码',
        minWidth: '150',
        edit: () => { return false },
        components: {
          popoverColumn
        },
        componentsOptions: {
          customOptions: {
            placement: 'right',
            style: {
              color: '#0986FF',
              cursor: 'pointer'
            },
            width: '500',
            content: propertyCard,
            contentOptions: {},
            trigger: 'click',
            mouseleave: true,
            formDatas: {},
            show: (scope) => {
              return scope.row['materielInfo'].materiel
            },
            showContent: (scope) => {
              return scope.row.materielInfo && scope.row.materielInfo.materiel ? scope.row.materielInfo.materiel : ''
            }
          }
        }
      },
      _materielName: {
        prop: 'materielInfo.materielName',
        label: '纱名',
        minWidth: '130',
        showOverflowTooltip: true,
        formater: scope => {
          if (scope.row.materielInfo) {
            return scope.row.materielInfo.materielName
          } else {
            return '--'
          }
        }
      },
      _materielProperty: {
        prop: 'materielInfo.materielProperty',
        label: '纱属性',
        minWidth: '130',
        formater: scope => {
          if (scope.row.materielInfo) {
            return scope.row.materielInfo.materielProperty
          } else {
            return '--'
          }
        },
        showOverflowTooltip: true
      }
    }
    // 送货清单以及弹框中公共字段--2
    const publicTwoColumns = {
      _yarnCard: {
        prop: 'yarnCard',
        label: '纱牌/批号',
        showOverflowTooltip: true,
        minWidth: '150'
      },
      _deliveryPlanDate: {
        prop: 'deliveryPlanDate',
        label: '预计送货日期',
        minWidth: '160',
        showOverflowTooltip: true,
        formater: (scope) => {
          return this.$filters.parseTime(
            scope.row.deliveryPlanDate || 0,
            '{y}-{m}-{d}'
          )
        }
      },
      _packageWeight: {
        prop: 'packageWeight',
        label: '包装数（KG）',
        minWidth: '120',
        showOverflowTooltip: true
      },
      _deliveryPlanCount: {
        prop: 'deliveryPlanCount',
        label: '预计送货件数',
        minWidth: '120',
        showOverflowTooltip: true
      },
      _deliveryPlanWeight: {
        prop: 'deliveryPlanWeight',
        label: '预计送货重量（KG）',
        minWidth: '160',
        align: 'right'
      }
    }
    // 基本信息编辑区
    const formDataSource = {
      _supplier: {
        prop: 'supplier',
        itemType: 'select',
        label: '供应商',
        dataSource: [],
        clearable: true,
        valueType: 'object',
        valueKey: 'id',
        props: {
          label: 'supplierName',
          value: 'id'
        },
        filterable: true,
        rules: [{ required: true, message: '请选择供应商', trigger: 'change' }],
        change: (val) => {
          this.saveSupplier = ([val] || []).map(item => {
            return {
              label: item.supplierName,
              value: parseInt(item.id),
              supplierName: item.supplierName,
              id: parseInt(item.id)
            }
          })
          if (val) {
            this.addDisabled = false
            // this.$set(this.addConfig.formDatas, 'supplier', this.saveSupplier[0])
            console.log(this.addConfig.formDatas, 'this.addConfig.formDatas')
          // this.$set(this.addConfig.content._supplier, 'disabled', true)
          }
          if (this.addPage === 'addPage') {
            this.$set(this.formDatas, 'supplierMan', null)
            this.$set(this.formDatas, 'supplierPhone', '')
          }
          this.getSupplierInfoData(val.id)
        }
      },
      _supplierMan: {
        prop: 'supplierMan',
        itemType: 'select',
        dataSource: [],
        valueType: 'object',
        valueKey: 'id',
        label: '联系人',
        props: {
          label: 'name',
          value: 'id'
        },
        clearable: true,
        placeholder: '请先选择供应商',
        change: (val) => {
          this.supplierManList = ([val] || []).map(item => {
            return {
              label: item.name,
              value: parseInt(item.id),
              name: item.name,
              id: parseInt(item.id)
            }
          })
          this.$set(this.formDatas, 'supplierMan', {
            label: val.name,
            value: val.id,
            name: val.name,
            id: val.id
          })
          this.$set(this.formDatas, 'supplierPhone', val.phone)
        }
      },
      _supplierPhone: {
        prop: 'supplierPhone',
        itemType: 'input',
        disabled: true,
        label: '联系方式',
        placeholder: '联系人选择后生成'
      },
      _deliveryDate: {
        itemType: 'date',
        prop: 'deliveryDate',
        label: '送货日期',
        placeholder: '请选择日期',
        // type: 'daterange',
        format: 'yyyy-MM-dd',
        valueFormat: 'yyyy-MM-dd',
        clearable: true,
        pickerOptions: timeBefore,
        rules: [{ required: true, message: '日期不能为空', trigger: ['change'] }]
      },
      _consigneeParty: {
        prop: 'consigneeParty',
        itemType: 'select',
        label: '收货方',
        filterable: true,
        valueType: 'object',
        valueKey: 'id',
        dataSource: [],
        props: {
          label: 'supplierName',
          value: 'id'
        },
        clearable: true,
        disabled: false,
        change: changeStore,
        rules: [{ required: true, message: '请选择收货方', trigger: 'change' }]
      },
      _warehouse: {
        prop: 'warehouse',
        itemType: 'select',
        label: '收货仓库',
        filterable: true,
        valueType: 'object',
        valueKey: 'id',
        props: {
          label: 'name',
          value: 'code'
        },
        dataSource: [],
        clearable: true,
        disabled: false,
        change: (val) => {
          this.warehouse = ([val] || []).map(item => {
            return {
              label: item.name,
              value: item.code,
              name: item.name,
              code: item.code
            }
          })
          // this.formDataSource._warehouse.dataSource = this.storeData
          // 填充仓库
          this.$set(this.formDatas, 'warehouse', val.name)
          // 填充地址
          this.$set(this.formDatas, 'consigneeAddrName', val.address)
          // 填充联系人
          this.$set(this.formDatas, 'consigneeManName', val.chargeUserName)
          // 填充联系方式
          this.$set(this.formDatas, 'consigneePhone', val.chargeUserPhone)
        },
        rules: [{ required: true, message: '请选择收货仓库', trigger: 'change' }]
      },
      _consigneeAddrName: {
        prop: 'consigneeAddrName',
        itemType: 'input',
        disabled: true,
        label: '收货地址',
        placeholder: '收货方选择后生成'
      },
      _consigneeManName: {
        prop: 'consigneeManName',
        itemType: 'input',
        disabled: true,
        label: '联系人',
        placeholder: '收货方选择后生成'
      },
      _consigneePhone: {
        prop: 'consigneePhone',
        itemType: 'input',
        disabled: true,
        label: '联系方式',
        placeholder: '收货方选择后生成'
      }
    }
    // 基本信息
    const baseDataSource = {
      _classification: {
        prop: 'classification',
        itemType: 'input',
        label: '采购类型：',
        readonly: true,
        style: {
          color: 'red'
        },
        formater: (scope) => {
          return '纱'
        }
      }
    }
    // 采购清单弹框
    const columns = {
      _selection: {
        prop: 'ids',
        type: 'selection'
        // fixed: 'left'
      },
      _index: {
        prop: 'index',
        label: '序号',
        formater: (scope) => {
          return scope.$index + 1
        },
        minWidth: '50'
      },
      ...publicOneColumns,
      ...publicTwoColumns,
      ...{
        _deliveryWeight: {
          label: '本次送货重量（KG）',
          labelClassName: 'product-is-request',
          className: 'product-no-request',
          minWidth: '180',
          prop: 'deliveryWeight',
          editOptions: {
            itemType: 'input',
            labelWidth: '0',
            itemProp: 'deliveryWeight',
            trim: (val) => {
              return filterVal(val)
            },
            rules: [
              {
                required: true,
                // message: '请输入数值',
                trigger: ['blur'],
                validator: validRule
              }
            ],
            change: (value, v1, v2, v3, scope) => {
              this.getSum({
                obj: this.tableDataSource._tableForm.dataSource[scope.$index],
                property: 'deliveryWeight',
                val: value,
                index: scope.$index
              })
            }
          },
          align: 'right',
          formater: (scope) => {
            this.$set(scope.row, 'edit', this.detail !== 'detail')
            return scope.row.deliveryWeight
          }
        }
      }
    }
    // 表格下方总计区
    const sumConfig = [
      {
        title: '本次送货重量(KG)：',
        num: '',
        tipStyle: 'color:#0986FF',
        height: '32px',
        lineHeight: '32px'
      }
    ]
    // 送货清单
    const pagination = {
      currentChange: (val) => {
        const pages = this.tableDataSource._tableForm.pagination
        pages.pageNum = val
      },
      sizeChange: (val) => {
        const pages = this.tableDataSource._tableForm.pagination
        pages.pageSize = val
        pages.pageNum = 1
        // this.getList(this.activeName === "1" ? "detailPage" : "billPage");
      }
    }
    const progressConfig = {
      itemType: 'dialog',
      visible: false,
      title: '采购进度',
      width: '448px',
      cancelHidden: true,
      okHidden: true,
      saveAndaddText: '我知道了',
      saveAndadd: () => {
        this.popOptions.visible = false
      },
      close: () => {
        this.popOptions.visible = false
      }
    }
    // 新增弹框操作按钮
    const addConfig = {
      itemType: 'dialog',
      visible: false,
      title: '送货计划',
      width: '1200px',
      okText: '添加至送货单',
      ok: (params) => {
        this.addDialog()
      },
      close: () => {
        this.popOptions.visible = false
      },
      cancel: (params) => {
        this.popOptions.visible = false
      },
      formDatas: {},
      formOptions: {
        // size: 'small',
        // layout: true,
        inline: true
      },
      content: {
        _purchaseOrderNumber: {
          prop: 'purchaseOrderNumber',
          itemType: 'input',
          label: '采购订单号',
          clearable: true,
          placeholder: '请输入采购订单号',
          itemStyle
        },
        _materiel: {
          prop: 'materiel',
          itemType: 'input',
          label: '纱线编码',
          clearable: true,
          placeholder: '请输入纱线编码',
          itemStyle
        },
        _deliveryPlanNumber: {
          prop: 'deliveryPlanNumber',
          itemType: 'input',
          label: '送货计划号',
          clearable: true,
          placeholder: '请输入送货计划号',
          itemStyle
        },
        _operate: {
          itemType: 'operate',
          submitText: '查询',
          submitHandle: (params) => {
            this.deliveryPlan(params)
          },
          style: {
            display: 'inline-block'
          },
          resetHandle: () => {}
        },
        _supplier: {
          prop: 'supplier',
          itemType: 'select',
          label: '供应商',
          dataSource: [],
          clearable: true,
          valueType: 'object',
          valueKey: 'id',
          props: {
            label: 'supplierName',
            value: 'id'
          },
          filterable: true,
          placeholder: '请选择',
          itemStyle
        },
        _noteDialogTable: {
          // tooltipEffect: 'light',
          height: '300px',
          layout: true,
          prop: 'noteDialogTable',
          itemType: 'table',
          selectionChange: (val) => {
            this.selectionDialog = val
            this.selectNote(val)
          },
          columns: {
            _selection: {
              prop: 'id',
              type: 'selection',
              fixed: 'left',
              selectable: (scope) => {
                return !scope.dialogDisabled
              }
            },
            _index: {
              prop: 'index',
              label: '序号',
              formater: (scope) => {
                return scope.$index + 1
              },
              minWidth: '50'
            },
            ...publicOneColumns,
            ...{
              _supplierName: {
                prop: 'supplierName',
                label: '供应商',
                minWidth: '130',
                showOverflowTooltip: true
              }
            },
            ...publicTwoColumns
          },
          dataSource: [],
          itemStyle: {
            width: '100%'
          }
        }
      }
    }
    return {
      addConfig,
      progressConfig,
      sumConfig,
      columns,
      activeName: '1',
      tableDataSource: {
        _tableForm: {
          prop: '_privateTableForm',
          itemType: 'table-form',
          // tooltipEffect: 'light',
          dataSource: [],
          selectionChange: (val) => {
            this.deleteList = val
          },
          columns
          // pagination: null,
        }
      },
      tableFormDatas: {},
      formDataSource,
      formDatas: {},
      formOptions: {
        inline: true,
        className: 'edit-base-form',
        showMessage: true
      },
      baseDataSource,
      baseDatas: {
        classification: '纱'
      },
      baseOptions: {
        inline: true,
        className: 'msg-content'
      },
      dialogType: 'new',
      deleteList: [], // 送货清单删除的数据
      pageType: '', // 判断页面跳转过来是新增add还是detail
      create: '', // 页面跳过来的新增
      detail: '', // 查看
      addPage: '', // 新建
      selectionDialog: [], // 弹框中勾选的数据
      selectDataSource: [], // 弹框表格的数据
      getSupplierId: undefined, // 从送货订单跳转过来的供应商id
      storeData: [], // 获得仓库的数据
      warehouse: [], // 下拉仓库
      addDisabled: false,
      deleDisabled: false,
      saveSupplier: [],
      detailData: {},
      parseTime,
      supplierManList: [],
      tableformOtions: {
        validate: (prop, flag, errmsg) => {},
        popError: (prop, flag, errmsg) => {}
        // showMessage: true
      },
      pagination
    }
  },
  computed: {
    // 分页
    pages() {
      return this.tableDataSource._tableForm.pagination
    },
    list() {
      return this.tableDataSource._tableForm.dataSource
    },
    popOptions() {
      return this.dialogType === 'progress'
        ? this.progressConfig
        : this.addConfig
    }
  },
  created() {
    this.create = this.$route.query.pageType
    this.detail = this.$route.query.pageType
    this.addPage = this.$route.query.pageType
    this.supplierList()
    this.deliveryList()
    // 填充到列表中--不需要请求的数据，，而是把送货计划页面的数据带过来，，填充进去
    if (this.create === 'create') {
      this.getCreate()
    }
    if (this.addPage === 'addPage') {
      this.getAdd()
    }
    if (this.detail === 'detail') {
      this.getDetail(this.$route.query.id)
      this.pagination.pageNum = 1
      this.pagination.pageSize = 20
      this.$set(
        this.tableDataSource._tableForm,
        'pagination',
        this.pagination
      )
    } else {
      this.$set(this.tableDataSource._tableForm, 'pagination', null)
    }
  },
  methods: {
    getSum(params) {
      const { obj, property, val } = params
      this.$set(obj, property, val)
      this.getTotal()
    },
    getTotal() {
      // 合计计算
      var totalWeight = 0
      this.list.forEach((i) => {
        totalWeight =
          this.$utils.getFloat(totalWeight, 2) +
          this.$utils.getFloat(i.deliveryWeight, 2)
      })
      this.$set(this.sumConfig[0], 'num', this.$utils.getFloat(totalWeight, 2))
    },
    getCreate() {
      // 先把禁用的放开
      this.$set(this.formDataSource._supplierMan, 'disabled', false)
      this.$set(this.formDataSource._deliveryDate, 'disabled', false)
      this.$set(this.formDataSource._consigneeParty, 'disabled', false)
      this.$set(this.formDataSource._warehouse, 'disabled', false)
      // this.addDisabled = false
      this.deleDisabled = false
      const noteData = localStorage.getItem('noteDetail')

      this.tableDataSource._tableForm.dataSource = JSON.parse(noteData).createOrder

      // 获取带过来的供应商
      this.getSupplierId = [{
        label: JSON.parse(noteData).createOrder[0].supplierName,
        value: parseInt(JSON.parse(noteData).createOrder[0].supplierId),
        supplierName: JSON.parse(noteData).createOrder[0].supplierName,
        id: parseInt(JSON.parse(noteData).createOrder[0].supplierId)
      }]

      // 把带过来的供应商填充到供应商框中，，同时禁选
      this.$set(this.formDatas, 'supplier', this.getSupplierId[0])
      this.$set(this.formDataSource._supplier, 'disabled', true)
      // 同时把弹窗中的供应商填充并禁用
      this.$set(this.addConfig.formDatas, 'supplier', this.getSupplierId[0])
      // this.addConfig.formDatas.supplier = this.getSupplierId[0]
      this.$set(this.addConfig.content._supplier, 'disabled', true)
      // 然后根据供应商信息查询联系人，联系方式
      this.getSupplierInfoData(this.getSupplierId[0].id)
    },
    getAdd() {
      // 基本信息的清空
      this.formDatas = {}
      this.formDatas.openAdd = true
      // if (this.formDatas.openAdd) {
      //   this.addDisabled = true
      // }
      // 表格信息的清空
      this.tableFormDatas = {}
      // 弹框搜索中的清空
      this.addConfig.formDatas = {}
      this.sumConfig[0].num = ''
      this.$set(this.formDataSource._supplier, 'disabled', false)
      this.$set(this.formDataSource._supplierMan, 'disabled', false)
      this.$set(this.formDataSource._deliveryDate, 'disabled', false)
      this.$set(this.formDataSource._consigneeParty, 'disabled', false)
      this.$set(this.formDataSource._warehouse, 'disabled', false)
      this.deleDisabled = false
      this.$set(this.addConfig.content._supplier, 'disabled', false)
      // this.list()
      this.tableDataSource._tableForm.dataSource = []
    },
    // 供应商下拉的内容--采购
    async supplierList() {
      const res = await apiPub.getSupplier({ supplierCategory: 0 })
      if (res.code === 200) {
        // 把中间信息中的供应商填充
        // const supplierData = (res.data || []).map(item => {
        //   return { value: item.id, label: item.supplierName }
        // })
        // 直接赋值写法--第一种写法
        this.formDataSource._supplier.dataSource = res.data || []
        this.addConfig.content._supplier.dataSource = res.data || []
        // 填充弹框中的数据--第二种写法
        // this.$set(
        //   this.addConfig.content._supplier,
        //   'dataSource',
        //   supplierData
        // )
      }
    },
    // 收货方下拉内容
    async deliveryList() {
      // 获取的是服务供应商名称
      const res = await apiPub.getAllSupplier({ supplierCategory: 1 })
      if (res.code === 200) {
        // 直接赋值写法--第一种写法
        this.formDataSource._consigneeParty.dataSource = res.data || []
      }
    },
    // 根据获取的送货商，，获得仓库名称
    async storeList(val) {
      // 获取的是服务供应商名称
      const res = await storePage({ enable: 1, supplierId: val })
      if (res.code === 200) {
        this.storeData = (res.data.list || []).map(item => {
          return { value: item.code,
            label: item.name,
            name: item.name,
            code: item.code }
        })
        this.formDataSource._warehouse.dataSource = res.data.list || []
        // this.$set(this.formDataSource._warehouse, "dataSource", getStore)
      }
    },
    // 新增的按钮
    addClick() {
      if (!this.$refs.searchForm.dynamicValidateFormRuleForm.supplier) {
        this.$message({
          type: 'info',
          message: '请先选择供应商！'
        })
        return
      }
      if (this.addPage === 'addPage') {
        this.$set(this.addConfig.formDatas, 'supplier', this.saveSupplier[0])
        console.log(this.addConfig.formDatas, 'this.addConfig.formDatas')
        this.$set(this.addConfig.content._supplier, 'disabled', true)
      }
      // 从新调用一遍供应商的信息
      this.supplierList()
      // 调用送货计划--待开单的内容
      this.deliveryPlan()
      // if(this.saveSupplier.length > 0){
      //   this.addDisabled = false
      //   this.$set(this.addConfig.formDatas, 'supplier', this.saveSupplier[0])
      //   this.$set(this.addConfig.content._supplier, 'disabled', true)
      //   this.popOptions.visible = true
      // } else {
      //   this.addDisabled = true
      // }
      this.popOptions.visible = true
    },
    // 弹框中列表的数据
    async deliveryPlan(params = {}) {
      // 上一步传过来的供应商
      const supperPlan = this.getSupplierId ? this.getSupplierId[0] : this.saveSupplier[0]

      // 获取供应商值，进行查询
      if ([supperPlan].length > 0) {
        params.supplier = supperPlan
      }

      const defaultParams = { pageNum: 1, pageSize: 20000000 }
      const res = await planPage({ status: 2, ...defaultParams, ...params })
      this.selectDataSource = res.data.list
      if (res.code === 200) {
        // 填充到弹框表格中
        this.$set(
          this.addConfig.content._noteDialogTable,
          'dataSource',
          (res.data.list &&
          res.data.list.map((item, index) => {
            item.index = (res.data.pageNum - 1) * res.data.pageSize + index + 1
            return item
          })) ||
        []
        )
      }
    },
    // 弹框中的勾选
    selectNote(val) {
      this.selectionDialog = val
      if (this.selectionDialog.length > 0) {
        this.selectDataSource.forEach(item => {
          if (item.supplierId !== val[0].supplierId) {
            item.dialogDisabled = true
          } else {
            item.dialogDisabled = false
          }
        })
      } else {
        this.selectDataSource.forEach(item => {
          item.dialogDisabled = false
        })
      }
    },
    // 添加到送货单弹框按钮
    async addDialog() {
      if (!this.selectionDialog.length) {
        this.$message({
          type: 'info',
          message: '请选择送货计划单'
        })
        return
      }
      let arr = [
        ...this.tableDataSource._tableForm.dataSource,
        ...this.selectionDialog
      ]
      // 去重
      const data = {}
      arr = arr.reduce((cur, next) => {
        data[next.deliveryPlanNumber] ? '' : data[next.deliveryPlanNumber] = true && cur.push(next)
        return cur
      }, [])
      this.tableDataSource._tableForm.dataSource = arr
      if (this.tableDataSource._tableForm.dataSource.length > 0) {
        this.$set(this.formDataSource._supplier, 'disabled', true)
      } else {
        this.$set(this.formDataSource._supplier, 'disabled', false)
      }
      this.popOptions.visible = false
    },
    // 根据供应商，查出供应商信息的内容
    async getSupplierInfoData(id) {
      const res = await apiPub.supplierInfodata({ id: id })
      if (res.code === 200) {
        const supplierExtra = res.data.supplierExtra || {}
        const contact = supplierExtra.contact || []
        this.$set(this.formDataSource._supplierMan, 'dataSource', contact)
      }
    },
    // 删除按钮
    deleteBtn() {
      if (this.deleteList.length) {
        this.$confirm('确认删除送货清单？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        })
          .then(() => {
            this.deleteList.forEach((item) => {
              this.tableDataSource._tableForm.dataSource.forEach((val, index) => {
                if (item.id === val.id) {
                  this.tableDataSource._tableForm.dataSource.splice(index, this.deleteList.length)
                }
              })
            })
            if (this.tableDataSource._tableForm.dataSource.length === 0) {
              this.$set(this.formDataSource._supplier, 'disabled', false)
            }
          })
          .catch(() => {})
      } else {
        this.$message({
          type: 'info',
          message: '请选择数据'
        })
      }
    },
    // 提交按钮
    async saveList() {
      this.$refs.searchForm.$refs.dynamicValidateForm.validate(async(valid) => {
        if (valid) {
          this.$refs.tableForm.$refs.dynamicValidateForm.validate(async(valid) => {
            if (valid) {
              if (!this.list.length) {
                this.$message({
                  message: '送货清单不能为空',
                  type: 'warning'
                })
                return
              }

              // 获取列表的数据
              const listData = this.tableDataSource._tableForm.dataSource.map(item => {
                return { deliveryPlanNumber: item.deliveryPlanNumber, deliveryWeight: item.deliveryWeight }
              })
              // 获取总计的数量
              const saveData = {
                classification: 1,
                deliveryDate: this.$refs.searchForm.dynamicValidateFormRuleForm.deliveryDate, // 送货时间
                supplier: {
                  label: this.$refs.searchForm.dynamicValidateFormRuleForm.supplier.supplierName,
                  value: this.$refs.searchForm.dynamicValidateFormRuleForm.supplier.id
                },
                supplierMan: {
                  label: this.supplierManList.length > 0 ? this.supplierManList[0].name : '',
                  value: this.supplierManList.length > 0 ? this.supplierManList[0].id : ''
                },
                supplierPhone: this.$refs.searchForm.dynamicValidateFormRuleForm.supplierPhone ? this.$refs.searchForm.dynamicValidateFormRuleForm.supplierPhone : '', // 供应商电话
                consigneeParty: {
                  label: this.$refs.searchForm.dynamicValidateFormRuleForm.consigneeParty.supplierName,
                  value: this.$refs.searchForm.dynamicValidateFormRuleForm.consigneeParty.id
                }, // 收货方
                consigneeAddrName: this.$refs.searchForm.dynamicValidateFormRuleForm.consigneeAddrName, // 收货方联系地址
                consigneeManName: this.$refs.searchForm.dynamicValidateFormRuleForm.consigneeManName, // 联系人
                consigneePhone: this.$refs.searchForm.dynamicValidateFormRuleForm.consigneePhone,
                warehouse: {
                  label: this.warehouse ? this.warehouse[0].name : '',
                  value: this.warehouse ? this.warehouse[0].code : ''
                }, // 仓库
                deliveryWeight: this.sumConfig[0].num || 0,
                detailList: listData
              }

              const res = await deliveryNoteAdd({ ...saveData })
              if (res.code !== 200) {
                return false
              }

              // 返回到列表页面
              localStorage.removeItem('noteDetail')

              this.$router.push({
                path: '/pms/delivery-note/detail/',
                query: { id: res.data.id, status: res.data.status, pageType: 'detail', timestamp: new Date().getTime() }
              })
              // 调用详情的接口和内容
              // this.getDetail(this.detailData.id)
              this.fetchLog(this.getLogMessages('INSERT', '/pms/deliveryNote/add'), { ...saveData }, JSON.stringify({ beforeText: `在'采购管理-送货单详情页面,提交了一条记录`, beforeCode: { ...saveData }}))
            }
          })
        }
      })
    },
    // 点击提交之后获取详情
    async getDetail(data) {
      this.detail = 'detail'
      this.$set(this.formDataSource._supplier, 'disabled', true)
      this.$set(this.formDataSource._supplierMan, 'disabled', true)
      this.$set(this.formDataSource._deliveryDate, 'disabled', true)
      this.$set(this.formDataSource._consigneeParty, 'disabled', true)
      this.$set(this.formDataSource._warehouse, 'disabled', true)
      this.addDisabled = true
      this.deleDisabled = true
      const res = await deliveryNoteDetail(data)
      if (!res || res.code !== 200) {
        return false
      }
      // 第一版只做纱
      res.data.classification = '纱'
      this.detailData = res.data || {}
      this.formDatas = res.data || {}
      this.formDatas.deliveryDate = this.formDatas.deliveryDate ? this.$filters.parseTime(this.formDatas.deliveryDate + '', '{y}-{m}-{d}') : ''
      console.log(res)
      this.sumConfig[0].num = this.detailData.deliveryWeight
      // 把供应商填充进去
      console.log('this.detailData.supplier供应商', this.detailData)
      this.detailData.supplier = {
        supplierName: this.detailData.supplier.label,
        id: parseInt(this.detailData.supplier.value),
        label: this.detailData.supplier.label,
        value: parseInt(this.detailData.supplier.value)
      }
      console.log('this.detailData.supplier供应商', this.detailData.supplier)
      // 把联系人填充进去
      this.detailData.supplierMan = {
        name: this.detailData.supplierMan.label,
        id: parseInt(this.detailData.supplierMan.value),
        label: this.detailData.supplierMan.label,
        value: parseInt(this.detailData.supplierMan.value)
      }
      this.detailData.consigneeParty = {
        supplierName: this.detailData.consigneeParty.label,
        id: parseInt(this.detailData.consigneeParty.value),
        label: this.detailData.consigneeParty.label,
        value: parseInt(this.detailData.consigneeParty.value)
      }
      // 重新调用仓库的下拉
      this.storeList(this.detailData.consigneeParty.id)
      this.detailData.warehouse = {
        name: this.detailData.warehouse.label,
        code: this.detailData.warehouse.value,
        label: this.detailData.warehouse.label,
        value: this.detailData.warehouse.value
      }
      console.log('warehouse', this.detailData.warehouse)
      console.log('this.formDatas', this.formDatas)
      // 把供应商，联系人，送货方，送货仓库填充进去
      this.$set(this.formDatas, 'supplier', this.detailData.supplier)
      this.$set(this.formDatas, 'supplierMan', this.detailData.supplierMan.name)
      this.$set(this.formDatas, 'consigneeParty', this.detailData.consigneeParty)
      this.$set(this.formDatas, 'warehouse', this.detailData.warehouse.name)
      console.log('this.detailData.deliveryNumber', this.detailData.deliveryNumber)
      // 获取送货清单--明细分页
      this.getList(this.detailData.deliveryNumber)
      console.log('log', this.detailData.deliveryNumber)
    },
    async getList(data) {
      console.log('dayinnnn', data)
      const res = await detailList({ deliveryNumber: data })
      if (!res || res.code !== 200) {
        return false
      }
      console.log('明细分页查询', res)
      this.tableDataSource._tableForm.dataSource = (res.data.list &&
          res.data.list.map((item, index) => {
            item.index = (res.data.pageNum - 1) * res.data.pageSize + index + 1
            return item
          })) ||
        []
      this.tableDataSource._tableForm.pagination = {
        ...this.tableDataSource._tableForm.pagination,
        dataTotal: res.data.total || 0,
        currentPage: res.data.pageNum,
        pageNum: res.data.pageNum,
        pageSize: res.data.pageSize
      }
    },
    // 返回按钮
    comeBack() {
      localStorage.removeItem('noteDetail')
      // 返回到列表页面
      this.$router.push(`/pms/delivery-note/index`)
    },
    // 取消按钮--清除所有数据，不做保存
    cancelList() {
      console.log('localStorage.removeItem("noteDetail")', localStorage.getItem('noteDetail'))
      localStorage.removeItem('noteDetail')
      // 返回到列表页面
      this.$router.push(`/pms/delivery-note/index`)
    },
    // 下载按钮
    async downList() {
      const res = await deliveryNoteDownload(this.$route.query.id)
      this.$utils.downloadStream(res)
      // 日志--下载
      this.fetchLog(this.getLogMessages('EXPORT', '/pms/deliveryNote/pdfDownload'), this.$route.query.id, JSON.stringify({ beforeText: `在'采购管理-送货单, 下载一条记录`, beforeCode: { id: this.$route.query.id }}))
      this.$message({
        type: 'success',
        message: '下载成功!'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.deliveryAll{
  .deliveryDetail {
  padding: 0 20px;
  .new-header {
    // margin: 20px;
    font-family: PingFangSC-Regular;
    font-size: 18px;
    color: #151222;
    font-weight: 540;
    display: flex;
    line-height: 60px;
    justify-content: space-between;
    .new-tip{
      color: #666666;
      font-size: 16px;
    }
    .msg-lr {
      display: flex;
      font-size: 12px;
      color: #666666;
    }
  }
  .base {
    background: #fff;
    .top-base{
    border-bottom: 1px solid #e9eff2;
    }
    .msg-title {
      font-size: 16px;
      line-height: 64px;
      color: #151222;
      margin-left: 20px;
      margin-right: 20px;
    }
  }
  .edit-table {
    .el-tabs {
      margin: 0 20px;
      /deep/.el-tabs__header {
        margin: 0;
      }
    }
  }

}
// 按钮位置
  .delivery-button{
    display: flex;
  }
  .delivery-button {
    bottom: 0;
    z-index: 1000;
    padding: 10px;
    width: 100%;
    background: #fff;
    position: fixed;
    border-top: 1px solid #ECF0F3;

    .btn-all {
      position: relative;
      left: 40%;
    }
  }
  // /deep/.el-table--fit {
  //   border-top: 1px solid #dfe6ec;
  // }
  .delivery-pop{
    /deep/.el-form-item--medium .el-form-item__content{
    width: 180px;
    display: inline-block;
  }
  // /deep/.el-form-item__content {
  //   line-height: 20px;
  // }
  }
}
</style>

<style lang='scss'>
.deliveryAll{
  .deliveryDetail {
    margin-bottom: 70px;
  .base {
    .msg-content {
      background: #fff;
      padding: 0 20px 0;
      margin: 16px 0;
      > div {
        width: 30%;
      }
      .el-form-item {
        margin-bottom: 18px;
      }
      .el-input__inner {
        border: none;
      }
    }
  }
  .edit-base {
    .edit-base-form {
      background: #fff;
      padding: 20px 20px 0 10px;
      margin: 16px 0;
      > div {
        width: 24%;
      }
    }
  }
  // /deep/.el-form-item__content {
  //   line-height: 20px;
  // }
}
.detail {
  // /deep/.el-form-item--medium .el-form-item__content{
  //   line-height: 15px;
  // }
    // padding: 0px 10px 20px;
    .el-table th {
      background-color: #f5f7fa;
      padding: 0px;
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
  }
.deliveryAll .deliveryDetail .base .msg-content .el-input__inner{
    color: #474747;
    padding: 0;
  }
.deliveryAll .deliveryDetail .base .msg-content .el-form-item__label{
  padding: 0;
}
  // .TableSummation .total[data-v-f0d015d2] {
  //   color: #666666;
  //   margin: 22px 0 12px;
</style>
