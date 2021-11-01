<!--
 * @Author: Do not edit
 * @Date: 2020-12-03 09:13:35
 * @LastEditTime: 2019-10-15 15:00:45
 * @LastEditors: Aurnm
 **  库存管理详情页面
 -->
<template>
  <div class="stock-details-page">
    <div class="page-main stock-details">
      <!-- 搜索页面 -->
      <div class="search">
        <cs-custom-form ref="searchForm" :data-source="searchData" :options="formOtions" :form-datas="formDatas" />
      </div>

      <!-- 页签和按钮部分 -->
      <div class="details-tab">
        <el-tabs v-model="activeName" @tab-click="activeClick">
          <el-tab-pane name="all">
            <span slot="label" class="label">货物明细</span>
          </el-tab-pane>
        </el-tabs>
        <!-- table表格 -->
        <div class="table-detail detail">
          <cs-custom-table
            tooltip-effect="dark"
            :table-scrollx="true"
            :columns="columns"
            :data-source="dataSource"
            :pagination="pagination"
          />
        </div>
      </div>

    </div>
    <!-- 按钮位置 -->
    <div class="button-groups">
      <div class="btn-all">
        <el-button
          size="small"
          type="primary"
          @click="comeBack"
        >
          返回
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { detailsPage, sellTeamselet, locationSelect } from '../api/index.js'
import popoverColumn from '@/components/cs-custom-table/columns/popover-column'
import propertyCard from '@/components/property-card/index.vue'
export default {
  name: 'StockManage',
  components: {},
  data() {
    // 查询/重置表单配置信息
    const searchData = [
      {
        prop: 'batchNo',
        itemType: 'input',
        label: '批次号',
        clearable: true,
        placeholder: '请输入批次号'
      },
      {
        prop: 'reservationNo',
        itemType: 'input',
        label: '预约单号',
        clearable: true,
        placeholder: '请输入预约单号'
      },
      {
        prop: 'formNo',
        itemType: 'input',
        label: '入库单号',
        clearable: true,
        placeholder: '请输入入库单号'
      },
      {
        prop: 'sellerTeamId',
        itemType: 'select',
        label: '销售组织',
        clearable: true,
        filterable: true,
        visibleChange: (value) => {
          if (value) {
            this.sellTeamdown()
          }
        },
        dataSource: []
      },
      {
        prop: 'stockType',
        itemType: 'select',
        label: '入库类型',
        clearable: true,
        filterable: true,
        dataSource: [
          {
            label: '采购',
            value: 1
          },
          {
            label: '生产',
            value: 2
          },
          {
            label: '调拨',
            value: 3
          },
          {
            label: '退货',
            value: 4
          },
          {
            label: '盘盈',
            value: 5
          },
          {
            label: '其他',
            value: 6
          }
        ]
      },
      {
        prop: 'dyelot',
        itemType: 'input',
        label: '缸号',
        clearable: true,
        placeholder: '请输入缸号'
      },
      {
        prop: 'locationCodes',
        itemType: 'select',
        label: '库位',
        clearable: true,
        filterable: true,
        multiple: true,
        placeholder: '请选择',
        visibleChange: (value) => {
          if (value) {
            this.locationOption()
          }
        },
        dataSource: []
      },
      {
        itemType: 'operate',
        submitText: '查询',
        submitHandle: params => {
          if (params) {
            if (params.locationCodes && params.locationCodes[0] === undefined) {
              params.locationCodes = undefined
            }
          }
          this.getRulePage(params)
          this.searchFormDatas = params
        },
        resetHandle: (params) => {
          this.searchFormDatas = {}
        }
      }
    ]
    // 表格表头的配置信息
    const columns = [
      {
        prop: 'materiel',
        label: '产品编号',
        minWidth: '180',
        showOverflowTooltip: true,
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
      {
        prop: 'batchNo',
        label: '批次号',
        minWidth: '110',
        showOverflowTooltip: true
      },
      {
        prop: 'serialNo',
        label: '条码号',
        minWidth: '180',
        showOverflowTooltip: true
      },
      {
        prop: 'path',
        label: '库位',
        minWidth: '110',
        showOverflowTooltip: true
      },
      // {
      //   prop: 'property',
      //   label: '产品属性',
      //   minWidth: '200',
      //   showOverflowTooltip: true
      // },
      // 如果是纱，增加字段纱名、纱属性
      {
        prop: 'yarnName',
        label: '纱名',
        minWidth: '160',
        showOverflowTooltip: true
      },
      {
        prop: 'yarnProperty',
        label: '纱属性',
        minWidth: '160',
        showOverflowTooltip: true
      },
      {
        prop: 'productInfo',
        label: '产品信息',
        minWidth: '160',
        isShow: () => {
          return this.getYarn === '0201' || this.getYarn === '0202' || this.getYarn === '0203' || this.getYarn === '0204'
        },
        showOverflowTooltip: true
      },
      {
        prop: 'yarnCard',
        label: '纱牌/纱批',
        minWidth: '160',
        showOverflowTooltip: true
      },
      {
        prop: 'machineNo',
        label: '机台号',
        minWidth: '160',
        isShow: () => {
          return this.getYarn === '0201' || this.getYarn === '0202' || this.getYarn === '0203' || this.getYarn === '0204'
        },
        showOverflowTooltip: true
      },
      {
        prop: 'stitchNum',
        label: '针数',
        minWidth: '160',
        isShow: () => {
          return this.getYarn === '0201' || this.getYarn === '0202' || this.getYarn === '0203' || this.getYarn === '0204'
        },
        showOverflowTooltip: true
      },
      {
        prop: 'inchNum',
        label: '寸数',
        minWidth: '160',
        isShow: () => {
          return this.getYarn === '0201' || this.getYarn === '0202' || this.getYarn === '0203' || this.getYarn === '0204'
        },
        showOverflowTooltip: true
      },
      {
        prop: 'dyelot',
        label: '缸号',
        minWidth: '180',
        showOverflowTooltip: true
      },
      {
        prop: 'sellerTeamName',
        label: '销售组织',
        minWidth: '100',
        showOverflowTooltip: true
      },
      {
        prop: 'weight',
        label: '入库重量(KG)',
        minWidth: '120',
        showOverflowTooltip: true
      },
      {
        prop: 'leftWeight',
        label: '库存重量(KG)',
        minWidth: '120',
        showOverflowTooltip: true
      },
      {
        prop: 'ballCountAll',
        label: '入库球数',
        minWidth: '90',
        showOverflowTooltip: true
      },
      {
        prop: 'ballCount',
        label: '库存球数',
        minWidth: '90',
        showOverflowTooltip: true
      },
      {
        prop: 'packingUnit',
        label: '包装单位',
        minWidth: '90',
        showOverflowTooltip: true
      },
      {
        prop: 'reservationNo',
        label: '预约单号',
        minWidth: '150',
        showOverflowTooltip: true
      },
      {
        prop: 'formNo',
        label: '入库单号',
        minWidth: '150',
        showOverflowTooltip: true
      },
      {
        prop: 'stockType',
        label: '入库类型',
        minWidth: '100',
        showOverflowTooltip: true,
        formater: scope => {
          return this.getType(scope.row)
        }
      },
      {
        prop: 'stockInFact',
        label: '入库时间',
        minWidth: '150',
        showOverflowTooltip: true,
        formater: (scope) => {
          return this.$filters.parseTime(
            scope.row.stockInFact || 0,
            '{y}-{m}-{d} {h}:{i}'
          )
        }
      }
    ]
    // 分页配置信息
    const pagination = {
      currentChange: val => {
        this.getRulePage({ pageSize: this.pagination.pageSize || 20, pageNum: val })
      },
      sizeChange: val => {
        this.pagination.pageSize = val
        this.pagination.pageNum = 1
        this.getRulePage({ pageNum: this.pagination.pageNum || 1, pageSize: val })
      }
    }
    return {
      activeName: 'all',
      formOtions: {
        size: 'small',
        inline: true
      },
      formDatas: {},
      searchData,
      columns,
      dataSource: [],
      pagination,
      getData: '',
      getYarn: '' // 获取纱还是布
    }
  },
  created() {
    this.getData = this.$route.query.materiel
    this.getYarn = this.$route.query.materielType
    if (this.getYarn === '0101' || this.getYarn === '0102' || this.getYarn === '0103') {
      this.searchData.splice(6, 0, {
        prop: 'yarnCard',
        itemType: 'input',
        label: '纱牌/纱批',
        clearable: true,
        placeholder: '请输入纱牌/纱批'
      })
    }
    this.getRulePage()
    this.sellTeamdown()
    this.locationOption()
  },
  mounted() {},
  methods: {
    // 入库类型取值
    getType(data) {
      let str = ''
      switch (data.stockType) {
        case 1:
          str = '采购'
          break
        case 2:
          str = '生产'
          break
        case 3:
          str = '调拨'
          break
        case 4:
          str = '退货'
          break
        case 5:
          str = '盘盈'
          break
        case 6:
          str = '其他'
          break
        default:
          break
      }
      return str
    },
    activeClick() {
      this.getRulePage()
    },
    comeBack() {
      this.$router.push(`/wms/stock-manage/stock-manage/index`)
    },
    // 列表查询
    async getRulePage(data = {}) {
      const res = await detailsPage({ materielEq: this.getData, warehouseCodes: [this.$route.query.warehouseCode], ...this.searchFormDatas, ...data })
      const listData = res.data ? res.data.list : []
      this.dataSource = listData
      this.total = res.data.total || {}
      this.pagination = {
        ...this.pagination,
        dataTotal: res.data ? res.data.total : 0,
        ...data,
        currentPage: res.data.pageNum,
        pageSize: res.data.pageSize
      }
    },
    // 销售组织的下拉
    async sellTeamdown() {
      const res = await sellTeamselet({ functionTag: 'SAL' })
      if (res.code !== 200) {
        return false
      }
      this.sellTeamData = res.data || []
      this.sellTeamData.map((item, index) => {
        item.label = item.name
        item.value = item.orgId
      })
      this.$set(this.searchData[3], 'dataSource', this.sellTeamData)
    },
    // 库位的下拉
    async locationOption(data) {
      const res = await locationSelect({ warehouseCode: this.$route.query.warehouseCode, enable: 1 })
      if (res.code !== 200) {
        return false
      }
      const pathData = (res.data.list || []).map(item => {
        return { value: item.path, label: item.path }
      })
      if (this.getYarn === '0101' || this.getYarn === '0102' || this.getYarn === '0103') {
        this.searchData[7].dataSource = [...pathData]
      } else {
        this.searchData[6].dataSource = [...pathData]
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.stock-details-page{
  .stock-details {
  .details-tab{
    margin-bottom: 60px;
    background: #fff;
    .el-tabs__nav-wrap::after{
      height: 1px;
    }
  }
  /deep/ .el-tabs__header {
    margin: 0;
    .el-tabs__item {
      font-weight: 400;
    }
  }
}
// 按钮的样式
  .button-groups{
    display: flex;
  }
  .button-groups {
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
}

</style>
<style lang="scss">
.stock-details {
    .search .el-form.el-form--inline .el-form-item {
      width: 22%;
      margin: 10px 2%;
    }
  .table-detail {
    padding: 0px 10px 20px;
    .el-table th {
      background-color: #f5f7fa;
    }
  }
}
</style>
