<template>
  <div class="VirtualManage srm-main">
    <div class="search islayoutForm">
      <cs-custom-form
        ref="searchForm"
        :data-source="searchData"
        :options="formOptions"
        :form-datas="searchFormDatas"
      />
    </div>
    <div class="page-table">
      <cs-custom-table
        tooltip-effect="light"
        :table-scrollx="true"
        :columns="columns"
        :data-source="dataSource"
        :pagination="pagination"
        :operates="popOperates"
      />
    </div>
  </div>
</template>
<script>
import * as api from './api/index'
import { MATERIEL_TYPE } from '@/views/wms/public/constants.js'
export default {
  name: 'VirtualManage',
  data() {
    const searchData = {
      _materiel: {
        prop: 'materiel',
        itemType: 'input',
        label: '产品编号',
        placeholder: '请输入产品编号',
        clearable: true
      },
      _materielType: {
        prop: 'materielType',
        itemType: 'select',
        dataSource: [...[{ label: '全部', value: '' }], ...MATERIEL_TYPE],
        label: '物料类型',
        placeholder: '请选择物料类型',
        clearable: true
      },
      _type: {
        prop: 'type',
        itemType: 'select',
        dataSource: [
          { label: '全部', value: '' },
          { label: '在途', value: 1 },
          { label: '在制', value: 2 }
        ],
        label: '库存类型',
        placeholder: '请选择库存类型',
        clearable: true
      },
      _operate: {
        itemType: 'operate',
        submitText: '查询',
        submitHandle: (params) => {
          this.init(params)
        },
        resetHandle: () => {
          this.searchFormDatas = {}
        }
      }
    }
    const formOptions = {
      size: 'small',
      // layout: true,
      inline: true
    }
    const columns = {
      _materiel: {
        prop: 'materiel',
        width: 160,
        label: '产品编号',
        style: {
          color: '#0986FF',
          cursor: 'pointer'
        },
        handle: (scope) => {
          if (this.$permission(['wms:virtualStock:detail'])) {
            this.$router.push({
              path:
                '/wms/stock-manage/virtual-manage/detail/',
              query: { materiel: scope.row.materiel, materielType: scope.row.materielType }
            })
          }
        }
      },
      _materielType: {
        prop: 'materielType',
        label: '物料类型',
        width: 140,
        formater: (scope) => {
          const index = MATERIEL_TYPE.findIndex(
            (n) => n.value === scope.row[scope.column.property]
          )
          return index !== -1 ? MATERIEL_TYPE[index].label : ''
        }
      },
      _yarnName: {
        prop: 'yarnName',
        label: '纱名',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.materielInfo ? scope.row.materielInfo.yarnName : ''
        }
      },
      _yarnProperty: {
        prop: 'yarnProperty',
        label: '纱属性',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.materielInfo ? scope.row.materielInfo.yarnProperty : ''
        }
      },
      _type: {
        prop: 'type',
        label: '库存类型',
        width: 120,
        formater: (scope) => {
          return scope.row.type === 1 ? '在途' : '在制'
        }
      },
      _weight: {
        prop: 'weight',
        label: '重量(KG)',
        width: 140,
        align: 'right',
        formater: (scope) => {
          return scope.row.weight
        }
      },
      _unholdWeight: {
        prop: 'unholdWeight',
        label: '未分配重量(KG)',
        width: 160,
        align: 'right',
        formater: (scope) => {
          return scope.row.unholdWeight
        }
      },
      _holdWeight: {
        prop: 'holdWeight',
        label: '已分配重量(KG)',
        width: 160,
        align: 'right',
        formater: (scope) => {
          return scope.row.holdWeight
        }
      }
    }
    const popOperates = {
      label: '操作',
      width: '200',
      fixed: 'right',
      align: 'center',
      dataSource: [
        {
          label: '详情',
          isShow: (scope) => {
            return this.$permission(['wms:virtualStock:detail'])
          },
          handle: (scope) => {
            this.$router.push({
              path:
                '/wms/stock-manage/virtual-manage/detail/',
              query: { materiel: scope.row.materiel, materielType: scope.row.materielType }
            })
          }
        }
      ]
    }
    const pagination = {
      currentChange: (val) => {
        this.pagination.pageSize = this.pagination.pageSize
        this.pagination.pageNum = val
        this.init()
      },
      sizeChange: (val) => {
        this.pagination.pageSize = val
        this.pagination.pageNum = 1
        this.init()
      }
    }
    return {
      searchData,
      formOptions,
      searchFormDatas: {},
      columns,
      dataSource: [],
      pagination,
      popOperates
    }
  },
  created() {
    this.init()
  },
  methods: {
    async init(params) {
      const res = await api.list({
        ...params,
        ...{ pageSize: this.pagination.pageSize || 20 },
        ...{ pageNum: this.pagination.pageNum || 1 }
      })
      if (res.code === 200) {
        this.dataSource = res.data.list || []
      } else {
        this.$message({ message: res.message, type: 'error' })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.VirtualManage {
}
</style>
