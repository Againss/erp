<template>
  <div class="VirtualDetail">
    <div class="form-main">
      <form-title :options="{ title: '货物记录' }" />
      <div class="detail form-box">
        <cs-custom-table
          :columns="columns"
          :table-scrollx="true"
          tooltip-effect="light"
          :data-source="dataSource"
          :pagination="pagination"
        />
      </div>
    </div>
    <bottomBar :options="barOptions" />
  </div>
</template>

<script>
import FormTitle from '@/views/wms/public/components/formTitle'
import * as api from './api/index'
import bottomBar from '@/views/wms/public/components/bottomBar.vue'
import popoverColumn from '@/components/cs-custom-table/columns/popover-column'
import propertyCard from '@/components/property-card/index.vue'
export default {
  name: 'VirtualDetail',
  components: { FormTitle, bottomBar },
  data() {
    const columns = {
      _sourceNo: {
        prop: 'sourceNo',
        label: '来源单号'
      },
      _materiel: {
        prop: 'materiel',
        label: '产品编号',
        components: {
          popoverColumn
        },
        componentsOptions: {
          customOptions: {
            placement: 'right',
            style: {
              color: '#0986FF',
              cursor: 'pointer',
              marginTop: '5px'
            },
            width: '500',
            content: propertyCard,
            contentOptions: {},
            trigger: 'click',
            mouseleave: true,
            formDatas: {},
            show: (scope) => {
              return scope.row['materiel']
            }
          }
        }
      },
      _productInfo: {
        prop: 'productInfo',
        label: '产品信息',
        showOverflowTooltip: true,
        isShow: () => {
          return this.$route.query.materiel === '0201' || this.$route.query.materiel === '0202' || this.$route.query.materiel === '0203' || this.$route.query.materiel === '0204'
        },
        formater: (scope) => {
          return scope.row.materielInfo && scope.row.materielInfo.productInfo || ''
        }
      },
      _yarnName: {
        prop: 'yarnName',
        label: '纱名',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.materielInfo && scope.row.materielInfo.yarnName || ''
        }
      },
      _yarnProperty: {
        prop: 'yarnProperty',
        label: '纱属性',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.materielInfo && scope.row.materielInfo.yarnProperty || ''
        }
      },
      _weight: {
        prop: 'weight',
        label: '重量(KG)',
        align: 'right',
        formater: (scope) => {
          return scope.row.weight
        }
      },
      _unholdWeight: {
        prop: 'unholdWeight',
        label: '未分配重量(KG)',
        align: 'right',
        formater: (scope) => {
          return scope.row.unholdWeight
        }
      },
      _holdWeight: {
        prop: 'holdWeight',
        label: '已分配重量(KG)',
        align: 'right',
        formater: (scope) => {
          return scope.row.holdWeight
        }
      },
      _sellerTeamName: {
        prop: 'sellerTeamName',
        label: '销售组织',
        align: 'center'
      }
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
    const barOptions = {
      submitHidden: true,
      cancelText: '返回',
      cancelSubmit: () => {
        this.$router.go(-1)
      }
    }
    return {
      columns,
      dataSource: [],
      pagination,
      barOptions
    }
  },
  computed: {
    id() {
      return this.$route.query.materiel
    }
  },
  created() {
    this.init()
  },
  methods: {
    async init() {
      const res = await api.groupPage({
        ...{ materiel: this.id },
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

<style lang="scss">
.VirtualDetail {
  .detail {
    .el-table th {
      background-color: #f5f7fa;
      padding: 0;
      .cell {
        height: 40px;
        line-height: 40px;
      }
    }
    .form-box {
      padding: 0 20px;
      padding-top: 0;
      .el-table th {
        background-color: #f5f7fa;
      }
    }
  }
}
</style>
<style lang="scss" scoped>
.VirtualDetail {
  padding: 20px;
  .base {
    background: #fff;
    .msg-title {
      font-size: 18px;
      line-height: 64px;
      color: #151222;
      padding-left: 20px;
      border-bottom: 1px solid #e9eff2;
    }
  }
}
</style>
