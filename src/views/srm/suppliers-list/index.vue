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
        v-permission="['srm:supplier:add']"
        type="primary"
        size="small"
        @click="$router.push({ path: '/srm/suppliers-list/insert' })"
      >新建</el-button>
      <el-button
        v-permission="['srm:supplier:export']"
        size="small"
        @click="exportSupplier"
      >导出</el-button>
    </div>
    <div class="srm-content">
      <!-- 列表 -->
      <div v-permission="['srm:supplier:list']" class="page-table">
        <cs-custom-table
          :show-overflow-tooltip="true"
          :col-drag="colDrag"
          tooltip-effect="dark"
          :table-scrollx="true"
          :autoresize="false"
          :columns="columns"
          :data-source="dataSource"
          :pagination="pagination"
          :operates="popOperates"
          highlight-current-indexrow
        />
      </div>
    </div>
  </div>
</template>
<script>
import SwitchStatus from '../public/components/switch-status'
import * as api from './api/index'
export default {
  name: 'Index',
  data() {
    /* 表头参数信息配置 */
    const columns = {
      _index: {
        fixed: 'left',
        prop: 'index',
        label: '序号',
        align: 'left',
        minWidth: 60,
        formater: scope => (this.pagination.currentPage - 1) * this.pagination.pageSize + (scope.$index + 1)
      },
      _supplierNo: {
        prop: 'supplierNo',
        align: 'left',
        label: '供应商编码',
        showOverflowTooltip: true,
        width: 115,
        minWidth: 100
      },
      _supplierName: {
        prop: 'supplierName',
        align: 'left',
        label: '供应商名称',
        maxHeight: '50',
        showOverflowTooltip: true,
        minWidth: 130,
        formater: (scope) => {
          const row = scope.row
          if (row.lastNotpassCount === 3) {
            return `< span style = 'color:red' > ${row.supplierName}</ > `
          }
          return row.supplierName
        }
      },
      _supplierAbbreviation: {
        prop: 'supplierAbbreviation',
        align: 'left',
        label: '供应商简称',
        showOverflowTooltip: true,
        minWidth: 130
      },
      _provinceCode: {
        prop: 'provinceCode',
        align: 'left',
        label: '所属地区',
        showOverflowTooltip: true,
        formater: (scope) => {
          const row = scope.row
          const obj = {
            province: row.provinceCode,
            cityList: row.cityCode,
            areaList: row.areaCode
          }
          const sheng = this.areaList.find(item => obj.province && item.value === obj.province)
          const shi = this.areaList.find(item => obj.cityList && item.value === obj.cityList)
          const qu = this.areaList.find(item => obj.areaList && item.value === obj.areaList)
          const province = sheng && sheng.label || ''
          const cityList = shi && shi.label || ''
          const areaList = qu && qu.label || ''
          return province + cityList + areaList
        },
        minWidth: 200
      },
      _address: {
        prop: 'address',
        align: 'left',
        label: '详细地址',
        showOverflowTooltip: true,
        minWidth: 180
      },
      _createdTime: {
        prop: 'createdTime',
        align: 'left',
        label: '创建时间',
        width: 120,
        showOverflowTooltip: true,
        minWidth: 100
      },
      _name: {
        prop: 'name',
        align: 'left',
        label: '联系人',
        showOverflowTooltip: true,
        minWidth: 120
      },
      _phone: {
        prop: 'phone',
        align: 'left',
        label: '联系电话',
        showOverflowTooltip: true,
        minWidth: 120
      },
      _mainProduct: {
        prop: 'mainProduct',
        align: 'left',
        showOverflowTooltip: true,
        label: '主要产品',
        minWidth: 120
      },
      _supplierMultiType: {
        prop: 'supplierMultiType',
        align: 'left',
        label: '供应商类型/级别',
        width: 140,
        popoverOptions: {
          formater: scope => {
            const str = (scope.row.supplierMultiType || []).reduce((a, n) => {
              a += `<p>${n.supplierTypeName || '-'} / ${n.rankAssess || '-'}</p>`
              return a
            }, '<div>')
            return str + '</div>'
          }
        },
        formater: scope => {
          const val = `${Array.isArray(scope.row.supplierMultiType) && (scope.row.supplierMultiType.reduce((a, n) => {
            a += n.supplierTypeName && n.supplierTypeName + '/' + (n.rankAssess || '-') + ', ' || ''
            return a
          }, '')).slice(0, -2) || ''}`
          return `<div style="width: 120px; overflow: hidden; white-space:nowrap; text-overflow:ellipsis;">${val}</div>`
        }
      },
      _status: {
        prop: 'status',
        align: 'left',
        label: '供应商状态',
        showOverflowTooltip: true,
        minWidth: 120,
        formater: (scope) => {
          let statusTxt = ''
          switch (scope.row.status.toString()) {
            case '0':
              statusTxt = '草稿'
              break
            case '1':
              statusTxt = '待审'
              break
            case '2':
              statusTxt = '备用'
              break
            case '3':
              statusTxt = '战略'
              break
            case '4':
              statusTxt = '核心'
              break
            case '5':
              statusTxt = '合格'
              break
            case '6':
              statusTxt = '不合格'
              break
          }
          return statusTxt
        }
      },
      _assessmentPeriod: {
        prop: 'assessmentPeriod',
        align: 'left',
        label: '考核周期',
        showOverflowTooltip: true,
        width: 110,
        minWidth: 100
      },
      _isEnabled: {
        prop: 'isEnabled',
        align: 'left',
        label: '启禁状态',
        showOverflowTooltip: true,
        width: 110,
        components: {
          SwitchStatus
        },
        componentsOptions: {
          itemWidth: '90px',
          formatter: (scope) => {
            const limit = [2, 3, 4, 5].includes(scope.row.status * 1)
            if (limit) {
              if (scope.row.isEnabled === 1) {
                return '1'
              } else {
                return '0'
              }
            }
            return ''
          },
          changeHandel: async(params) => {
            const obj = {
              id: params.row.id,
              enabled: params.row.isEnabled * 1 ? 0 : 1
            }
            await api.startApplicationSupplierData(obj)
            this.$message.success('操作成功')
            params.row.isEnabled = obj.enabled
            const datas = {
              params: obj,
              description: {
                beforeText: `在'供应商采购-供应商列表'${params.row.isEnabled * 1 ? '启用' : '禁用'}了一条数据`,
                beforeCode: obj
              },
              opratorType: 'UPDATE',
              'api': '/srm/supplier/enabled'
            }
            this.$store.dispatch('app/fetchParamsLog', { ...datas, appId: 'srm' })
          },
          permission: 'srm:supplier:enable' // 供应商列表启/禁用
        }
      }
    }

    /*
       草稿 0
       待审 1
       备用2
       战略3
       核心4
       合格5
       不合格6
       */
    // 表格操作栏的配置信息
    let newDataSource = [
      {
        label: '编辑',
        permitTag: ['srm:supplier:modify'],
        isShow: (scope) => [0, 2, 5, 6, 4, 3].includes(scope.row.status),
        handle: (scope) => {
          this.$router.push({
            path: '/srm/suppliers-list/edit',
            query: { id: scope.row.id }
          })
        }
      },
      {
        label: '删除',
        style: {
          color: '#FE4949'
        },
        permitTag: ['srm:supplier:delete'],
        isShow: (scope) => [0, 6].includes(scope.row.status),
        handle: (scope) => {
          this.$pub.confirmation({
            callback: async() => {
              await api.deleteSupplierData({ id: scope.row.id })
              this.$message.success('删除成功')
              this.getApplicationSupplier()
              const datas = {
                params: { id: scope.row.id },
                description: {
                  beforeText: `在'供应商采购-供应商列表'删除了一条数据`,
                  beforeCode: { id: scope.row.id }
                },
                opratorType: 'DEL',
                'api': '/srm/supplier/delete'
              }
              this.$store.dispatch('app/fetchParamsLog', { ...datas, appId: 'srm' })
            }
          })
        }
      },
      {
        label: '撤回',
        isShow: (scope) => [1].includes(scope.row.status),
        handle: (scope) => {
          this.$router.push({
            path: '/srm/suppliers-list/detail',
            query: { id: scope.row.id }
          })
        }
      },
      {
        label: '查看',
        isShow: scope => [0, 1, 2, 3, 4, 5, 6].includes(scope.row.status),
        handle: (scope) => {
          this.$router.push({
            path: '/srm/suppliers-list/detail',
            query: { id: scope.row.id }
          })
        }
      }
    ]
    newDataSource = this.$filterPermission(newDataSource)

    const popOperates = {
      label: '操作',
      align: 'left',
      fixed: 'right',
      width: 210,
      dataSource: newDataSource
    }

    /*  分页配置信息 */
    const pagination = {
      currentChange: (val) => {
        this.getApplicationSupplier({
          pageSize: this.pagination.pageSize,
          pageNum: val
        })
      },
      sizeChange: (val) => {
        this.getApplicationSupplier({
          pageNum: this.pagination.currentPage,
          pageSize: val
        })
      }
    }

    /* 搜索条件 */
    const searchData = {
      _supplierCategory: {
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
          setFormDatas({ ...formDatsas, supplierType: '' })
          this.searchData['_supplierType'].dataSource = this.supplierTypeList.filter(e => e.supplierCategory === value)
        }
      },
      _supplierType: {
        prop: 'supplierType',
        itemStyle: { width: '25%' },
        itemType: 'select',
        label: '供应商类型',
        dataSource: [],
        change: (val, form, formDatas, setFormDatas) => {
          if (val * 1 === 10004) {
            this.searchData['_equipmentName'].dataSource = [
              { label: '平网机', value: '1' },
              { label: '圆网机', value: '2' }
            ]
          } else {
            this.searchData['_equipmentName'].dataSource = this.machineList
          }
          setFormDatas({ ...formDatas, supplierType: val })
        }
      },
      _equipmentName: {
        itemStyle: { width: '25%' },
        prop: 'equipmentName',
        itemType: 'select',
        label: '设备名称',
        valueKey: 'label',
        dataSource: [],
        isShow: () => {
          const form = this.$refs.searchForm && this.$refs.searchForm.dynamicValidateFormRuleForm || {}
          return form.supplierType * 1 === 10003 || form.supplierType * 1 === 10004
        }
      },
      _supplierNo: {
        prop: 'supplierNo',
        itemStyle: { width: '25%' },
        itemType: 'input',
        label: '供应商编码',
        placeholder: '请输入'
      },
      _rankAssessId: {
        itemStyle: { width: '25%' },
        prop: 'rankAssessId',
        itemType: 'select',
        label: '供应商级别',
        dataSource: []
      },
      _provinceCode: {
        itemStyle: { width: '25%' },
        prop: 'provinceCode',
        itemType: 'select',
        label: '所在省',
        dataSource: [],
        change: (val, form, formDatas, setFormDatas) => {
          setFormDatas({ ...formDatas, cityCode: '', areaCode: '' })
          const list = this.areaList.filter(e => e.parentId === val)
          this.searchData['_cityCode'].dataSource = list
        }
      },
      _cityCode: {
        itemStyle: { width: '25%' },
        prop: 'cityCode',
        itemType: 'select',
        label: '所在市',
        dataSource: [],
        change: (val, form, formDatas, setFormDatas) => {
          setFormDatas({ ...formDatas, areaCode: '' })
          const list = this.areaList.filter(e => e.parentId === val)
          this.searchData['_areaCode'].dataSource = list
        }
      },
      _areaCode: {
        prop: 'areaCode',
        itemStyle: { width: '25%' },
        itemType: 'select',
        label: '所在区',
        dataSource: [],
        change: (val, form, formDatas, setFormDatas) => {
          setFormDatas({ ...formDatas })
        }
      },
      _mainProduct: {
        itemStyle: { width: '25%' },
        prop: 'mainProduct',
        itemType: 'input',
        label: '主要产品',
        placeholder: '请输入'
      },
      _supplierName: {
        itemStyle: { width: '25%' },
        prop: 'supplierName',
        itemType: 'input',
        label: '供应商名称',
        placeholder: '请输入'
      },
      _documentId: {
        itemStyle: { width: '25%' },
        prop: 'documentId',
        itemType: 'select',
        label: '证件名称',
        dataSource: []
      },
      _loomsType: {
        itemStyle: { width: '25%' },
        prop: 'loomsType',
        itemType: 'input',
        label: '织机种类',
        placeholder: '请输入',
        isShow: () => {
          const form = this.$refs.searchForm && this.$refs.searchForm.dynamicValidateFormRuleForm || {}
          return form.supplierType * 1 === 10003
        }
      },
      _brandId: {
        itemStyle: { width: '25%' },
        prop: 'brandId',
        itemType: 'input',
        label: '品牌',
        placeholder: '请输入',
        isShow: () => {
          const form = this.$refs.searchForm && this.$refs.searchForm.dynamicValidateFormRuleForm || {}
          return form.supplierType * 1 === 10003
        }
      },
      _number: {
        itemStyle: { width: '25%' },
        prop: 'number',
        itemType: 'input',
        label: '数量',
        placeholder: '请输入',
        isShow: () => {
          const form = this.$refs.searchForm && this.$refs.searchForm.dynamicValidateFormRuleForm || {}
          return form.supplierType * 1 === 10003
        }
      },
      _inch: {
        itemStyle: { width: '25%' },
        prop: 'inch',
        itemType: 'input',
        label: '寸数',
        placeholder: '请输入',
        isShow: () => {
          const form = this.$refs.searchForm && this.$refs.searchForm.dynamicValidateFormRuleForm || {}
          return form.supplierType * 1 === 10003
        }
      },
      _needles: {
        itemStyle: { width: '25%' },
        prop: 'needles',
        itemType: 'input',
        label: '针数',
        placeholder: '请输入',
        isShow: () => {
          const form = this.$refs.searchForm && this.$refs.searchForm.dynamicValidateFormRuleForm || {}
          return form.supplierType * 1 === 10003
        }
      },
      _approach: {
        itemStyle: { width: '25%' },
        prop: 'approach',
        itemType: 'input',
        label: '路数',
        placeholder: '请输入',
        isShow: () => {
          const form = this.$refs.searchForm && this.$refs.searchForm.dynamicValidateFormRuleForm || {}
          return form.supplierType * 1 === 10003
        }
      },
      _syringes: {
        itemStyle: { width: '25%' },
        prop: 'syringes',
        itemType: 'input',
        label: '针筒数',
        placeholder: '请输入',
        isShow: () => {
          const form = this.$refs.searchForm && this.$refs.searchForm.dynamicValidateFormRuleForm || {}
          return form.supplierType * 1 === 10003
        }
      },
      _sumNeedles: {
        itemStyle: { width: '25%' },
        prop: 'sumNeedles',
        itemType: 'input',
        label: '总针数',
        placeholder: '请输入',
        isShow: () => {
          const form = this.$refs.searchForm && this.$refs.searchForm.dynamicValidateFormRuleForm || {}
          return form.supplierType * 1 === 10003
        }
      },
      _goWayOfFluid: {
        itemStyle: { width: '25%' },
        prop: 'goWayOfFluid',
        itemType: 'select',
        label: '走液方式',
        dataSource: [
          {
            value: '',
            label: '全部'
          },
          {
            value: '1',
            label: '气流'
          },
          {
            value: '2',
            label: '溢流'
          },
          {
            value: '3',
            label: '气液'
          },
          {
            value: '4',
            label: '拉缸'
          },
          {
            value: '5',
            label: '其他'
          }
        ],
        isShow: () => {
          const form = this.$refs.searchForm && this.$refs.searchForm.dynamicValidateFormRuleForm || {}
          return form.supplierType * 1 === 10001
        }
      },
      _pipeNumber: {
        itemStyle: { width: '25%' },
        prop: 'pipeNumber',
        itemType: 'input',
        label: '管数',
        placeholder: '请输入',
        isShow: () => {
          const form = this.$refs.searchForm && this.$refs.searchForm.dynamicValidateFormRuleForm || {}
          return form.supplierType * 1 === 10001
        }
      },
      _brand: {
        itemStyle: { width: '25%' },
        prop: 'brand',
        itemType: 'input',
        label: '品牌',
        placeholder: '请输入',
        isShow: () => {
          const form = this.$refs.searchForm && this.$refs.searchForm.dynamicValidateFormRuleForm || {}
          return form.supplierType * 1 === 10001
        }
      },
      _deviceType: {
        itemStyle: { width: '25%' },
        prop: 'deviceType',
        itemType: 'select',
        label: '设备类型',
        dataSource: [],
        isShow: () => {
          const form = this.$refs.searchForm && this.$refs.searchForm.dynamicValidateFormRuleForm || {}
          return form.supplierType * 1 === 10001
        },
        change: (value, form, formDatsas, setFormDatas) => {
          const item = this.searchData['_deviceType'].dataSource.find(e => e.value === value)
          this.searchData['_deviceName'].dataSource = item.child.map(e => ({
            value: e.id,
            label: e.deviceName
          }))
        }
      },
      _deviceName: {
        itemStyle: { width: '25%' },
        prop: 'deviceName',
        itemType: 'select',
        label: '设备名称',
        dataSource: [],
        isShow: () => {
          const form = this.$refs.searchForm && this.$refs.searchForm.dynamicValidateFormRuleForm || {}
          return form.supplierType * 1 === 10001
        }
      },
      _status: {
        itemStyle: { width: '25%' },
        prop: 'status',
        itemType: 'select',
        label: '供应商状态',
        dataSource: [
          {
            value: '0',
            label: '草稿'
          },
          {
            value: '1',
            label: '待审'
          },
          {
            value: '2',
            label: '备用'
          },
          {
            value: '3',
            label: '战略'
          },
          {
            value: '4',
            label: '核心'
          },
          {
            value: '5',
            label: '合格'
          },
          {
            value: '6',
            label: '不合格'
          }
        ]
      },
      _isEnabled: {
        itemStyle: { width: '25%' },
        prop: 'isEnabled',
        itemType: 'select',
        label: '启禁状态',
        dataSource: [
          {
            value: '1',
            label: '启用'
          },
          {
            value: '0',
            label: '禁用'
          }
        ]
      },
      _assessmentPeriodId: {
        prop: 'assessmentPeriodId',
        itemStyle: { width: '25%' },
        itemType: 'select',
        label: '考核周期',
        dataSource: [
          {
            label: '月',
            value: 1
          },
          {
            label: '季',
            value: 2
          },
          {
            label: '半年',
            value: 3
          },
          {
            label: '年',
            value: 4
          }
        ]
      },
      _searchTime: {
        itemStyle: { width: '25%' },
        itemType: 'date',
        prop: 'searchTime',
        label: '创建时间',
        placeholder: '请选择',
        type: 'daterange',
        format: 'yyyy-MM-dd',
        valueFormat: 'yyyy-MM-dd',
        startPlaceholder: '开始时间',
        endPlaceholder: '结束时间'
      },
      _isErpUser: {
        itemStyle: { width: '25%' },
        itemType: 'select',
        prop: 'isErpUser',
        label: '是否织ERP用户',
        dataSource: [
          { label: '全部', value: undefined },
          { label: '是', value: 1 },
          { label: '否', value: 0 }
        ],
        isShow: () => {
          const form = this.$refs.searchForm && this.$refs.searchForm.dynamicValidateFormRuleForm || {}
          return form.supplierType * 1 === 10003
        }
      },
      _isMesUser: {
        itemStyle: { width: '25%' },
        itemType: 'select',
        prop: 'isMesUser',
        label: '是否MES用户',
        dataSource: [
          { label: '全部', value: undefined },
          { label: '是', value: 1 },
          { label: '否', value: 0 }
        ],
        isShow: () => {
          const form = this.$refs.searchForm && this.$refs.searchForm.dynamicValidateFormRuleForm || {}
          return form.supplierType * 1 === 10003
        }
      },
      _operate: {
        itemType: 'operate',
        submitHandle: (params) => {
          let createdStartTime, createdEndTime
          if (params.searchTime) {
            createdStartTime = params.searchTime[0]
            createdEndTime = params.searchTime[1]
          }
          // 处理针织厂数据
          let knittingSearch = {}
          if (params) {
            knittingSearch = {
              brandId: params.brandId || undefined,
              number: params.number || '',
              loomsType: params.loomsType || undefined,
              needles: params.needles || '',
              inch: params.inch || '',
              approach: params.approach || '',
              sumNeedles: params.sumNeedles || '',
              syringes: params.syringes || ''
            }
          }
          // 处理染整厂数据
          let dyeingSearch = {}
          if (params) {
            dyeingSearch = {
              goWayOfFluid: params.goWayOfFluid || undefined,
              pipeNumber: params.pipeNumber || '',
              brand: params.brand || undefined,
              deviceTypeId: params.deviceType || undefined,
              deviceNameId: params.deviceName || undefined
            }
          }
          this.searchParams = {
            ...params,
            knittingSearch,
            dyeingSearch,
            createdStartTime,
            createdEndTime,
            isMesUser: typeof params.isMesUser === 'number' && !!params.isMesUser || params.isMesUser,
            isErpUser: typeof params.isErpUser === 'number' && !!params.isErpUser || params.isErpUser
          }
          this.getApplicationSupplier(this.searchParams)
        },
        submitText: '查询',
        resetHandle: () => {
          this.searchFormDatas = {}
        }
      }
    }
    return {
      loading: false,
      popOperates,
      columns,
      pagination,
      dataSource: [],
      rankAssessList: [],
      csCustomPopConfig: [],
      searchFormDatas: {},
      searchData,
      formOtions: {
        layout: true,
        inline: true,
        size: 'small'
      },
      supplierTypeList: [],
      supplierId: null,
      /* 考核周期列表 */
      cycleList: [],
      dropDownRankAssessList: [],
      areaList: [], // 初始化全部省份数据
      colDrag: {
        onEnd: (evt, newColmns) => {
          this.columns = newColmns
        }
      },
      machineList: [],
      searchParams: {}
    }
  },
  created() {
    this.getApplicationSupplier()
    this.getSelectData()
  },
  methods: {
    async exportSupplier() {
      const data = this.$refs.searchForm.dynamicValidateFormRuleForm
      const createdStartTime = data.dateRange && this.$filters.parseTime(data.dateRange[0] + '', '{y}-{m}-{d} {h}:{i}:{s}')
      const createdEndTime = data.dateRange && this.$filters.parseTime(data.dateRange[1] + '', '{y}-{m}-{d} {h}:{i}:{s}')
      const parmas = { ...data, createdStartTime, createdEndTime }
      const res = await api.srmSupplierExport(parmas)
      this.$utils.downloadStream(res)
      const datas = {
        params: parmas,
        description: {
          beforeText: `在'供应商采购-供应商列表'导出一条记录`,
          beforeCode: parmas
        },
        opratorType: 'EXPORT',
        'api': '/srm/supplier/export'
      }
      this.$store.dispatch('app/fetchParamsLog', { ...datas, appId: 'srm' })
    },
    async getApplicationSupplier(params = {}) {
      const res = await api.getApplicationSupplierData({ ...params, ...this.searchParams })
      if (this.$pub.responseValidate(res)) {
        const data = res.data
        this.dataSource = data.list || []
        this.pagination = {
          ...this.pagination,
          dataTotal: data.total,
          ...params,
          currentPage: data.pageNum,
          pageSize: data.pageSize
        }
      }
    },
    async getSelectData() {
      // 省市区
      const resArea = await api.openapiAreaSearch()
      this.areaList = (resArea.data || []).map(e => ({ label: e.name, value: String(e.id), parentId: String(e.parentId) }))
      const list = this.areaList.filter(e => e.parentId === '0')
      this.searchData['_provinceCode'].dataSource = list
      const resSup = await api.getSupplierTypeListData({ status: 1 })
      this.supplierTypeList = (resSup.data && resSup.data.list || []).map(e => ({ label: e.typeName, value: e.id, supplierCategory: e.supplierCategory }))
      // 织机
      const zres = await api.getZhiJi()
      this.machineList = this.searchData['_equipmentName'].dataSource = zres || []
      // 证件
      const zjres = await api.getSupplierCertdential()
      this.searchData['_documentId'].dataSource = (zjres.data || []).map(e => ({
        value: e.id,
        label: e.certdentialName
      }))
      // 设备
      const sbres = (await api.getDeviceTypeList()).data || []
      this.searchData['_deviceType'].dataSource = sbres.map(e => ({
        ...e.device,
        child: e.child
      }))
      const rankAssessList = await api.srmRankAssessList({ status: 1 })
      const data = (rankAssessList.data && rankAssessList.data.list || []).map(e => ({
        value: e.id,
        label: e.rank
      }))
      this.searchData['_rankAssessId'].dataSource = data
    }
  }
}
</script>

<style lang="scss" scoped>
.detail-table-form {
  margin-bottom: 20px;
  .el-form-item {
    margin-bottom: 0;
  }
}
</style>
