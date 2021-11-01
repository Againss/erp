import enableSwitch from '../components/enableSwitch.vue'
// import department from '../components/department.vue'
export const tabColumns = {
  data() {
    // 查询/重置表单配置信息
    const searchData = [
      {
        prop: 'name',
        itemType: 'input',
        label: '名称:',
        dataSource: [],
        filterable: true
      },
      {
        prop: 'isEnabled',
        itemType: 'select',
        label: '启用/禁用:',
        dataSource: [
          { label: '全部', value: '' },
          { label: '启用', value: '1' },
          { label: '禁用', value: '0' }
        ]
      },
      {
        itemType: 'operate',
        submitText: '查询',
        submitHandle: params => {
          this.formDatas = { ...params }
          this.getPageData({ ...params })
        },
        resetHandle: (params) => {
          this.formDatas = {}
        }
      }
    ]
    const publicColumns = {
      _remarks: {
        prop: 'remarks',
        label: '备注',
        minWidth: '100',
        showOverflowTooltip: true,
        isShow: (params) => {
          if (this.activeName === 'brand') {
            return false
          } else {
            return true
          }
        }
      },
      _operatorName: {
        prop: 'operatorName',
        label: '操作人',
        minWidth: '100',
        showOverflowTooltip: true
      },
      _operatorTime: {
        prop: 'operatorTime',
        label: '操作时间',
        width: '150',
        showOverflowTooltip: true,
        sortable: false,
        formater: scope => {
          return scope.row[scope.column.property] ? this.$filters.parseTime(scope.row[scope.column.property] + '', '{y}-{m}-{d} {h}:{i}') : ''
        }
      },
      _isEnabled: {
        prop: 'isEnabled',
        label: '启用/禁用',
        width: '100',
        components: {
          enableSwitch
        },
        componentsOptions: {
          // permitTag: 'baseData:tmDyeFinishTech:submit',
          changeStatus: (scope) => {
            this.statusChange({ id: scope.row.id, isEnabled: scope.row.isEnabled })
          }
        }
      },
      _status: {
        prop: 'status',
        label: '状态',
        width: '80',
        showOverflowTooltip: true,
        isShow: (params) => {
          if (this.activeName === 'brand') {
            return false
          } else {
            return true
          }
        },
        formater: scope => {
          return scope.row[scope.column.property] === 'Y' ? `<span style="color: #00BCC5;">已审核</span>` : '<span style="color: #FF9B02;">未审核</span>'
        }
      }
    }
    // 品牌标准列表配置 brand checkAgencies testItems
    const brandColumns = {
      _code: {
        prop: 'code',
        label: '序号',
        width: '60'
      },
      _brand: {
        prop: 'brand',
        label: '品牌名称',
        minWidth: '100',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.brand ? scope.row.brand.label : ''
        },
        handle: (scope) => {
          this.isEdit = false
          this.viewDetails(scope)
        },
        style: { color: '#1890ff', cursor: 'pointer' }
      },
      _clothType: {
        prop: 'clothType',
        label: '成衣类型',
        minWidth: '100',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.clothType ? scope.row.clothType.label : ''
        }
      },
      ...publicColumns
    }

    // 检测项目
    const checkAgenciesColumns = {
      _name: {
        prop: 'name',
        label: '中文名',
        showOverflowTooltip: true
      },
      _nameEn: {
        prop: 'nameEn',
        label: '英文名',
        showOverflowTooltip: true
      },
      _grade: {
        prop: 'grade',
        label: '项目类型',
        formater: scope => {
          return scope.row.grade === 0 ? '一级' : '二级'
        }
      },
      _orders: {
        prop: 'orders',
        label: '顺序',
        sortable: true,
        showOverflowTooltip: true

      },
      ...publicColumns

    }
    // 检测机构
    const testItemsColumns = {
      _code: {
        prop: 'code',
        label: '序号',
        width: '60'
      },
      _name: {
        prop: 'name',
        label: '中文名',
        minWidth: '100',
        showOverflowTooltip: true
      },
      _nameEn: {
        prop: 'nameEn',
        label: '英文名',
        minWidth: '100',
        showOverflowTooltip: true
      },
      ...publicColumns
    }
    // 列表操作栏按钮
    const popOperates = {
      label: '操作',
      width: '150',
      fixed: 'right',
      dataSource: [
        {
          label: '编辑',
          permitTag: [this.permitModify],
          isShow: (params) => {
            return true
          },
          handle: scope => {
            this.isEdit = true
            if (this.activeName === 'brand') {
              // this.$set(this.brandPopOptions.content._name, 'disabled', scope.row.status === 'Y')
            } else {
              this.$set(this.popOptions.content._name, 'disabled', scope.row.status === 'Y')
            }
            this.$set(this.brandPopOptions, 'okText', '保存')
            this.editHandle(scope)
          }
        },
        {
          label: '删除',
          permitTag: [this.permitDel],
          style: { 'color': '#FE4949' },
          isShow: scope => {
            return scope.row.status !== 'Y' && this.activeName !== 'brand'
          },
          handle: async params => {
            const res = await this.$uiUtils.confirmMsg()
            if (res) {
              this.deleteData(params.row)
            }
          }
        },
        {
          label: '审核',
          permitTag: [this.permitCheck],
          isShow: scope => {
            return scope.row.status !== 'Y' && this.activeName !== 'brand'
          },
          handle: async params => {
            const res = await this.$uiUtils.confirmMsg({
              message: '确定审核？',
              cancelMessage: '已取消'
            })
            if (res) {
              this.checkStatus(params.row)
            }
          }
        }
      ]
    }

    // 默认品牌标准
    const columns = {
      ...brandColumns
    }
    // 表格分页
    const pagination = {
      currentChange: val => {
        this.getPageData({ pageSize: this.pagination.pageSize || 20, pageNum: val })
      },
      sizeChange: val => {
        this.$set(this.pagination, 'currentPage', 1)
        this.getPageData({ pageNum: 1, pageSize: val })
      }

    }
    return {
      columns,
      searchData,
      publicColumns,
      brandColumns,
      checkAgenciesColumns,
      testItemsColumns,
      popOperates,
      pagination,
      permitObj: {
        // brand: '品牌标准', checkAgencies: '检测项目',testItems: '检测机构'
        brand: {
          add: 'baseData:qa:finishedFabricPhysicalBrandStandard:add',
          modify: 'baseData:qa:finishedFabricPhysicalBrandStandard:modify',
          del: '',
          check: '',
          isEnabled: 'baseData:qa:finishedFabricPhysicalBrandStandard:isEnabled'
        },
        checkAgencies: {
          add: 'baseData:qa:finishedFabricPhysicalTestItems:add',
          modify: 'baseData:qa:finishedFabricPhysicalTestItems:modify',
          del: 'baseData:qa:finishedFabricPhysicalTestItems:delete',
          check: 'baseData:qa:finishedFabricPhysicalTestItems:check',
          isEnabled: 'baseData:qa:finishedFabricPhysicalTestItems:isEnabled'
        },
        testItems: {
          add: 'baseData:qa:finishedFabricPhysicalOrganization:add',
          modify: 'baseData:qa:finishedFabricPhysicalOrganization:modify',
          del: 'baseData:qa:finishedFabricPhysicalOrganization:delete',
          check: 'baseData:qa:finishedFabricPhysicalOrganization:check',
          isEnabled: 'baseData:qa:finishedFabricPhysicalOrganization:isEnabled'
        }
      },
      permitAdd: '',
      permitModify: '',
      permitDel: '',
      permitCheck: '',
      permitEnabled: ''
    }
  },
  watch: {
    activeName: {
      handler(val, oldVal) {
        this.permitModify = this.permitObj[this.activeName].modify
        this.permitAdd = this.permitObj[this.activeName].add
        this.permitDel = this.permitObj[this.activeName].del
        this.permitCheck = this.permitObj[this.activeName].check
        this.permitEnabled = this.permitObj[this.activeName].isEnabled
        // console.log(this.permitModify, this.permitAdd, this.permitDel)
      },
      deep: true,
      immediate: true
    }
  }
}
