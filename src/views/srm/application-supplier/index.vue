<template>
  <div class="srm-main">
    <div class="search islayoutForm">
      <cs-custom-form
        ref="searchForm"
        :form-datas="searchFormDatas"
        :data-source="searchData"
        :options="formOtions"
      />
    </div>
    <div class="button">
      <el-button
        v-permission="['srm:supplierApplication:add']"
        type="primary"
        size="small"
        @click="showInsertApplicationPopbox"
      >新建</el-button>
    </div>
    <div class="srm-content">
      <!-- 列表 -->
      <div class="page-table">
        <cs-custom-table
          tooltip-effect="dark"
          :col-drag="colDrag"
          :columns="columns"
          :table-scrollx="true"
          :autoresize="false"
          :data-source="dataSource"
          :pagination="pagination"
          :operates="popOperates"
          highlight-current-indexrow
        />
      </div>
    </div>
    <!-- 审批 -->
    <div class="pop-wrap">
      <cs-custom-pop :options="approvalApplicationPopBox" />
    </div>
    <div class="pop">
      <cs-custom-pop ref="popForm" :options="popOptions" />
    </div>
    <!-- 分配弹框 -->
    <div class="pop-wrap">
      <cs-custom-pop :options="allocationApplicationPopBox" />
    </div>
  </div>
</template>
<script>
import { ApplicationSupplier } from './components/index'
import { PublicSrm } from '@/views/srm/public/index'
import { fetchLog } from '@/views/srm/public/fetchLog'
// import { param } from '@/utils'
export default {
  name: 'Index',
  mixins: [ApplicationSupplier, PublicSrm, fetchLog],
  data() {
    /* 公用验证正则 */
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    /* 表头参数信息配置 */
    const columns = {
      _index: {
        prop: 'index',
        label: '序号',
        align: 'left',
        minWidth: 60,
        fixed: 'left',
        formater: (row, column) => {
          return this.getPageIndex({
            pageSize: this.pagination.pageSize,
            currentPage: this.pagination.currentPage,
            index: row.$index
          })
        }
      },
      _formNo: {
        prop: 'formNo',
        align: 'left',
        label: '申请单编号',
        showOverflowTooltip: true,
        width: 120,
        minWidth: 100
      },
      _applicantDepartment: {
        prop: 'applicantDepartment',
        align: 'left',
        label: '申请部门',
        showOverflowTooltip: true,
        minWidth: 150
      },
      _applicantUserName: {
        prop: 'applicantUserName',
        align: 'left',
        label: '申请人',
        showOverflowTooltip: true,
        minWidth: 110
      },
      _formTime: {
        prop: 'formTime',
        align: 'left',
        label: '申请时间',
        width: 110,
        showOverflowTooltip: true,
        minWidth: 100
      },
      _supplierCategory: {
        prop: 'supplierCategory',
        align: 'left',
        label: '供应商类别',
        showOverflowTooltip: true,
        minWidth: 100,
        width: 120,
        formater: (scope) => {
          const s = scope.row[scope.column.property]
          if (s === 0) {
            return '采购'
          } else if (s === 1) {
            return '服务'
          } else {
            return ''
          }
        }
      },
      _supplierTypeName: {
        prop: 'supplierTypeName',
        align: 'left',
        label: '供应商类型',
        showOverflowTooltip: true,
        minWidth: 120
      },
      _productClassification: {
        prop: 'productClassification',
        align: 'left',
        label: '产品分类',
        showOverflowTooltip: true,
        minWidth: 120
      },
      _status: {
        prop: 'status',
        align: 'left',
        label: '状态',
        minWidth: 120,
        showOverflowTooltip: true,
        width: 120,
        formater: (scope) => {
          const state = scope.row.status
          let stateTxt = ''
          switch (state.toString()) {
            case '0':
              stateTxt = '待审'
              break
            case '1':
              stateTxt = '已处理'
              break
            case '2':
              stateTxt = '已拒绝'
              break
            case '3':
              stateTxt = '已关联'
              break
            default:
              break
          }
          return stateTxt
        }
      },
      _rejectionReason: {
        prop: 'rejectionReason',
        align: 'left',
        label: '拒绝原因',
        showOverflowTooltip: true,
        width: 150,
        minWidth: 120,
        formater: (scope) => {
          const rejectionReason = scope.row.rejectionReason
          if (!rejectionReason) {
            return '--'
          }
          return rejectionReason
        }
      },
      _relatedSupplierName: {
        prop: 'relatedSupplierName',
        align: 'left',
        label: '供应商名称',
        showOverflowTooltip: true,
        minWidth: 120
      }
    }
    /* 表格操作栏的配置信息 */

    let newDataSource = [
      {
        label: '删除',
        style: {
          color: '#FE4949'
        },
        permitTag: ['srm:supplierApplication:delete'],
        isShow: (scope) => {
          return this.limitsFilter({
            status: scope.row.status,
            limitArr: [0, 1, 2]
          })
        },
        handle: (params) => {
          this.$pub.confirmation({
            callback: () => {
              this.deleteAuditing({
                id: params.row.id
              })
            }
          })
        }
      },
      {
        label: '查看',
        isShow: (scope) => {
          // 0 待审 1已处理 2已拒绝 3已关联
          return this.limitsFilter({
            status: scope.row.status,
            limitArr: [0, 1, 2, 3]
          })
        },
        handle: (params) => {
          this.showUpdateApplicationPopbox({
            type: 'detail',
            row: params.row
          })
        }
      },
      {
        label: '编辑',
        isShow: (scope) => {
          return this.limitsFilter({
            status: scope.row.status,
            limitArr: [0]
          })
        },
        permitTag: ['srm:supplierApplication:modify'],
        handle: (params) => {
          this.popOptions = this.$utils.deepClone(this.editApplicationPopBox)
          this.showUpdateApplicationPopbox({
            type: 'edit',
            row: params.row
          })
        }
      },
      {
        label: '审批',
        isShow: (scope) => {
          return this.limitsFilter({
            status: scope.row.status,
            limitArr: [0]
          })
        },
        permitTag: ['srm:supplierApplication:approval'],
        handle: (params) => {
          this.approvalId = params.row.id
          this.$set(this.approvalApplicationPopBox, 'visible', true)
        }
      },
      {
        label: '分配',
        isShow: (scope) => {
          return this.limitsFilter({
            status: scope.row.status,
            limitArr: [1, 3]
          })
        },
        permitTag: ['srm:supplierApplication:distribute'],
        handle: (params) => {
          this.getSupplierTypeList({
            supplierCategory: params.row.supplierCategory
          }).then((data) => {
            const supplierTypeList = this.converSupplierTypeList(data)
            if (supplierTypeList && supplierTypeList.length > 0) {
              const apportionContent = [
                {
                  prop: 'supplierType',
                  itemType: 'select',
                  label: '供应商类型',
                  dataSource: supplierTypeList,
                  rules: commonBlurReg,
                  change: this.changeSupplierType
                },
                {
                  prop: 'supplierId',
                  itemType: 'select',
                  rules: commonBlurReg,
                  label: '供应商名称',
                  dataSource: [],
                  filterable: true,
                  placeholder: '请选择/输关键词搜索'
                }
              ]
              this.$set(this.allocationApplicationPopBox, 'formDatas', {
                id: params.row.id
              })
              this.$set(this.allocationApplicationPopBox, 'visible', true)
              this.$set(
                this.allocationApplicationPopBox,
                'content',
                apportionContent
              )
            }
          })
        }
      }
    ]
    newDataSource = this.$filterPermission(newDataSource)

    const popOperates = {
      label: '操作',
      fixed: 'right',
      align: 'left',
      width: 240,
      dataSource: newDataSource
    }

    /* 分页配置信息 */
    const pagination = {
      currentChange: (val) => {
        this.getApplicationList({
          pageSize: this.pagination.pageSize,
          pageNum: val
        })
      },
      sizeChange: (val) => {
        this.getApplicationList({
          pageNum: this.pagination.currentPage || 1,
          pageSize: val
        })
      }
    }

    /* 编辑弹框 */
    const editApplicationPopBox = {
      itemType: 'drawer',
      visible: false,
      title: '编辑',
      okText: '确定',
      formOptions: {
        disabled: false
      },
      ok: (params) => this.updateApplicationSupplier(params),
      cancel: (params) => {
        this.$set(this.editApplicationPopBox, 'visible', false)
        this.$set(this.popOptions, 'visible', false)
      },
      content: [
        {
          prop: 'department',
          labelWidth: '120px',
          itemType: 'select',
          label: '申请部门',
          valueType: 'object',
          rules: commonBlurReg,
          dataSource: []
        },
        {
          prop: 'supplierCategory',
          labelWidth: '120px',
          itemType: 'select',
          label: '供应商类别',
          change: (value, form, formDatsas, setFormDatas) => {
            this.getSupplierTypeList({
              supplierCategory: value,
              status: 1
            }).then((data) => {
              setFormDatas({ supplierType: '' })
              const supplierTypeList = this.converSupplierTypeList(data)
              if (supplierTypeList && supplierTypeList.length > 0) {
                this.$set(
                  this.editApplicationPopBox.content[2],
                  'dataSource',
                  supplierTypeList
                )
                this.$set(
                  this.popOptions.content[2],
                  'dataSource',
                  supplierTypeList
                )
              }
            })
          },
          dataSource: [
            {
              value: 0,
              label: '采购'
            },
            {
              value: 1,
              label: '服务'
            }
          ],
          rules: [{ ...commonBlurReg, message: '请选择供应商类别！' }]
        },
        {
          prop: 'supplierType',
          labelWidth: '120px',
          itemType: 'select',
          label: '供应商类型',
          dataSource: [],
          rules: [{ ...commonBlurReg, message: '请选择供应商类型！' }]
        },
        {
          prop: 'productClassification',
          labelWidth: '120px',
          itemType: 'input',
          label: '产品分类',
          rules: [
            { ...commonBlurReg, message: '产品分类不能为空！' },
            { max: 50, message: '最大长度为50个字符！', trigger: 'blur' }
          ]
        },
        {
          prop: 'formTime',
          labelWidth: '120px',
          itemType: 'date',
          label: '申请时间'
        },
        {
          prop: 'supplierScale',
          labelWidth: '120px',
          itemType: 'input',
          label: '供应商规模',
          rules: [
            { max: 50, message: '最大长度为50个字符！', trigger: 'blur' }
          ]
        },
        {
          prop: 'productRequirements',
          labelWidth: '120px',
          itemType: 'input',
          label: '产品具体要求',
          rules: [
            { max: 50, message: '最大长度为50个字符！', trigger: 'blur' }
          ]
        },
        {
          prop: 'supplierQualification',
          labelWidth: '120px',
          itemType: 'input',
          label: '供应商资质',
          rules: [
            { max: 50, message: '最大长度为50个字符！', trigger: 'blur' }
          ]
        },
        {
          prop: 'customerSpecifies',
          labelWidth: '120px',
          itemType: 'input',
          label: '客户指定',
          rules: [
            { max: 50, message: '最大长度为50个字符！', trigger: 'blur' }
          ]
        },
        {
          prop: 'expandSuppliers',
          labelWidth: '120px',
          itemType: 'input',
          label: '拓展供应商',
          rules: [
            { max: 50, message: '最大长度为50个字符！', trigger: 'blur' }
          ]
        },
        {
          prop: 'orderTime',
          labelWidth: '120px',
          itemType: 'date',
          label: '订单时间',
          placeholder: '选择时间'
        },
        {
          prop: 'marketDirection',
          labelWidth: '120px',
          itemType: 'select',
          label: '市场方向',
          dataSource: [
            {
              value: 0,
              label: '国内'
            },
            {
              value: 1,
              label: '国外'
            }
          ]
        },
        {
          prop: 'supplierSources',
          labelWidth: '120px',
          itemType: 'input',
          label: '供应商来源推荐',
          rules: [
            { max: 50, message: '最大长度为50个字符！', trigger: 'blur' }
          ]
        }
      ]
    }
    const statusItem = {
      prop: 'status',
      itemType: 'select',
      label: '审批意见',
      rules: commonBlurReg,
      dataSource: [
        {
          value: '1',
          label: '同意'
        },
        {
          value: '2',
          label: '拒绝'
        }
      ],
      change: (value) => {
        // console.log('value', value)
        // 1同意，2拒绝
        // 当审批意见为拒绝时，才显示拒绝原因输入框
        if (value === '2') {
          this.$set(
            this.approvalApplicationPopBox,
            'content',
            rejectionReasonArr
          )
        } else {
          this.$set(this.approvalApplicationPopBox, 'content', statusArr)
        }
      },
      placeholder: '请选择'
    }

    const rejectionReasonItem = {
      prop: 'rejectionReason',
      itemType: 'input',
      type: 'textarea',
      resize: 'vertical',
      label: '拒绝原因',
      rules: [
        commonBlurReg,
        { max: 50, message: '长度在 50 个字符以内！', trigger: ['blur'] }
      ]
    }

    const statusArr = [statusItem]

    const rejectionReasonArr = [statusItem, rejectionReasonItem]

    /* 审批弹框 */
    const approvalApplicationPopBox = {
      itemType: 'dialog',
      visible: false,
      title: '审批申请',
      okText: '确定',
      ok: (params) => {
        let rejectionReason = '--'
        if (params.rejectionReason) {
          rejectionReason = params.rejectionReason
        }
        this.auditApplication({
          status: params.status,
          rejectionReason
        })
      },
      cancel: (params) => {
        this.$set(this.approvalApplicationPopBox, 'visible', false)
      },
      content: statusArr
    }

    /* 分配弹框 */
    const allocationApplicationPopBox = {
      itemType: 'dialog',
      visible: false,
      title: '分配选择',
      okText: '确定',
      ok: (params) => {
        this.distributionApplication(params)
      },
      cancel: (params) => {
        this.$set(this.allocationApplicationPopBox, 'visible', false)
      },
      content: []
    }

    /* 新增弹框 */
    const insertApplicationPopBox = {
      itemType: 'drawer',
      visible: false,
      title: '新建',
      okText: '确定',
      ok: (params) => {
        this.insertApplicationSupplier(params)
      },
      close: () => {
        this.$set(this.insertApplicationPopBox.content[2], 'dataSource', [])
        this.$set(this.popOptions.content[2], 'dataSource', [])
      },
      cancel: (params) => {
        this.$set(this.insertApplicationPopBox, 'visible', false)
        this.$set(this.insertApplicationPopBox.content[2], 'dataSource', [])
        this.$set(this.popOptions, 'visible', false)
        this.$set(this.popOptions.content[2], 'dataSource', [])
      },
      content: [
        {
          prop: 'department',
          itemType: 'select',
          labelWidth: '120px',
          label: '申请部门',
          valueType: 'object',
          dataSource: []
        },
        /*   {
          prop: 'applicantUuid',
          itemType: 'input',
          label: '申请人'
        }, */
        {
          prop: 'supplierCategory',
          itemType: 'select',
          labelWidth: '120px',
          label: '供应商类别',
          change: (value, form, formDatsas, setFormDatas) => {
            this.getSupplierTypeList({
              supplierCategory: value,
              status: 1
            }).then((data) => {
              const supplierTypeList = this.converSupplierTypeList(data)
              if (supplierTypeList && supplierTypeList.length > 0) {
                setFormDatas({ supplierType: '' })
                this.$set(
                  this.insertApplicationPopBox.content[2],
                  'dataSource',
                  supplierTypeList
                )
                this.$set(
                  this.popOptions.content[2],
                  'dataSource',
                  supplierTypeList
                )
              }
            })
          },
          dataSource: [
            {
              value: 0,
              label: '采购'
            },
            {
              value: 1,
              label: '服务'
            }
          ],
          rules: [
            {
              ...commonBlurReg,
              message: '请选择供应商类别！',
              trigger: 'change'
            }
          ]
        },
        {
          prop: 'supplierType',
          labelWidth: '120px',
          itemType: 'select',
          label: '供应商类型',
          dataSource: [],
          rules: [
            {
              ...commonBlurReg,
              message: '请选择供应商类型！',
              trigger: 'change'
            }
          ]
        },
        {
          prop: 'productClassification',
          labelWidth: '120px',
          itemType: 'input',
          label: '产品分类',
          rules: [
            { ...commonBlurReg, message: '产品分类不能为空！' },
            { max: 50, message: '最大长度为50个字符！', trigger: 'blur' }
          ]
        },
        {
          prop: 'formTime',
          labelWidth: '120px',
          itemType: 'date',
          label: '申请时间'
        },
        {
          prop: 'supplierScale',
          labelWidth: '120px',
          itemType: 'input',
          label: '供应商规模',
          rules: [
            { max: 50, message: '最大长度为50个字符！', trigger: 'blur' }
          ]
        },
        {
          prop: 'productRequirements',
          labelWidth: '120px',
          itemType: 'input',
          label: '产品具体要求',
          rules: [
            { max: 50, message: '最大长度为50个字符！', trigger: 'blur' }
          ]
        },
        {
          prop: 'supplierQualification',
          itemType: 'input',
          labelWidth: '120px',
          label: '供应商资质',
          rules: [
            { max: 50, message: '最大长度为50个字符！', trigger: 'blur' }
          ]
        },
        {
          prop: 'customerSpecifies',
          itemType: 'input',
          labelWidth: '120px',
          label: '客户指定',
          rules: [
            { max: 50, message: '最大长度为50个字符！', trigger: 'blur' }
          ]
        },
        {
          prop: 'expandSuppliers',
          labelWidth: '120px',
          itemType: 'input',
          label: '拓展供应商',
          rules: [
            { max: 50, message: '最大长度为50个字符！', trigger: 'blur' }
          ]
        },
        {
          prop: 'orderTime',
          labelWidth: '120px',
          itemType: 'date',
          label: '订单时间',
          placeholder: '选择时间'
        },
        {
          prop: 'marketDirection',
          itemType: 'select',
          labelWidth: '120px',
          label: '市场方向',
          dataSource: [
            {
              value: 0,
              label: '国内'
            },
            {
              value: 1,
              label: '国外'
            }
          ]
        },
        {
          prop: 'supplierSources',
          itemType: 'input',
          labelWidth: '120px',
          label: '供应商来源推荐',
          rules: [
            { max: 50, message: '最大长度为50个字符！', trigger: 'blur' }
          ]
        }
      ]
    }

    /* 搜索条件 */
    const searchData = [
      {
        prop: 'supplierCategory',
        itemStyle: { width: '25%' },
        itemType: 'select',
        label: '供应商类别',
        dataSource: [
          {
            label: '全部',
            value: ''
          },
          {
            label: '服务',
            value: 1
          },
          {
            label: '采购',
            value: 0
          }
        ],
        change: (value, form, formDatsas, setFormDatas) => {
          this.getSupplierTypeList({ supplierCategory: value }).then((data) => {
            const supplierTypeList = this.converSupplierTypeList(data)
            if (supplierTypeList && supplierTypeList.length > 0) {
              setFormDatas({ supplierType: '' })
              this.$set(this.searchData[1], 'dataSource', supplierTypeList)
            }
          })
        }
      },
      {
        prop: 'supplierType',
        itemStyle: { width: '25%' },
        itemType: 'select',
        label: '供应商类型',
        dataSource: []
      },
      {
        prop: 'applicantDepartment',
        itemStyle: { width: '25%' },
        itemType: 'input',
        label: '申请部门'
      },
      {
        prop: 'applicantUser',
        itemStyle: { width: '25%' },
        itemType: 'input',
        label: '申请人'
      },
      {
        itemStyle: { width: '25%' },
        itemType: 'date',
        prop: 'formTime',
        label: '申请时间',
        placeholder: '请选择',
        type: 'daterange',
        format: 'yyyy-MM-dd',
        valueFormat: 'yyyy-MM-dd',
        startPlaceholder: '开始日期',
        endPlaceholder: '结束日期'
        /*         rules: [{ required: true, message: '日期不能为空', trigger: ['change'] }] */
      },
      {
        prop: 'status',
        itemStyle: { width: '25%' },
        itemType: 'select',
        label: '状态',
        dataSource: [
          {
            value: '',
            label: '全部'
          },
          {
            value: '0',
            label: '待审'
          },
          {
            value: '1',
            label: '已处理'
          },
          {
            value: '2',
            label: '已拒绝'
          },
          {
            value: '3',
            label: '已关联'
          }
        ]
      },
      {
        itemStyle: { width: '25%' },
        prop: 'formNo',
        itemType: 'input',
        label: '申请单号'
      },
      {
        itemType: 'operate',
        submitHandle: (params) => {
          let formStartTime = ''
          let formEndTime = ''
          if (params.hasOwnProperty('formTime') && params.formTime) {
            formStartTime = params.formTime[0]
            formEndTime = params.formTime[1]
          }
          this.searchParams = {
            ...params,
            formStartTime,
            formEndTime
          }
          this.getApplicationList({
            ...params,
            formStartTime,
            formEndTime
          })
        },
        submitText: '查询',
        resetHandle: () => {
          this.searchFormDatas = {}
        }
      }
    ]

    return {
      loading: false,
      popOperates,
      columns,
      pagination,
      dataSource: [],
      editApplicationPopBox,
      insertApplicationPopBox,
      approvalApplicationPopBox,
      allocationApplicationPopBox,
      searchFormDatas: {},
      searchData,
      formOtions: {
        inline: true,
        layout: true,
        size: 'small'
      },
      approvalId: '',
      /* 供应商类型列表 */
      supplierTypeList: [],
      supplierNameList: [],
      orgsList: [],
      rowCopy: null,
      popOptions: {},
      colDrag: {
        onEnd: (evt, newColmns,) => {
          this.columns = newColmns
        }
      },
      searchParams: {}
    }
  },
  mounted() {
    if (this.$store.state.user.userInfo.orgs) {
      this.orgsList = this.$store.state.user.userInfo.orgs
    }
  }
}
</script>
