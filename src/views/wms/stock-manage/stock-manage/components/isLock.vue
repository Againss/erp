<template>
  <div class="isLock srm-main">
    <div class="search islayoutForm">
      <cs-custom-form
        ref="searchForm"
        :data-source="searchData"
        :options="formOtions"
        :form-datas="formDatas"
      />
    </div>
    <div class="form-main">
      <form-title :options="{ title: '库存明细', formStyle: 'border:none' }">
        <div slot="content">
          <el-button size="small" type="primary" @click="submit">{{
            type === "E" ? "锁定" : "解锁"
          }}</el-button>
        </div>
      </form-title>
      <!-- :selection="{ isShow: true, selectable: () => searchFormDatas.type === 1 }" -->
      <div class="form-box">
        <cs-custom-table
          ref="multipleTable"
          :table-scrollx="true"
          :columns="columns"
          tooltip-effect="dark"
          :data-source="list"
          @selection-change="selectionChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
import {
  stockList,
  locationShelf,
  sellTeamselet,
  lock,
  locationSelect
} from '../api/index.js'
import FormTitle from '@/views/wms/public/components/formTitle'
import { warehouseList } from '@/views/wms/public/api/index.js'
import {
  BOOKING_STORAGE_TYPE_LIST,
  LOCK_TYPE,
  MATERIEL_TYPE,
  UNLOCK_TYPE
} from '@/views/wms/public/constants.js'
import { fetchLog } from '@/views/wms/public/fetchLog.js'
export default {
  name: 'IsLock',
  components: { FormTitle },
  mixins: [fetchLog],
  data() {
    const itemStyle = {
      width: '33%'
    }
    const searchData_base = [
      {
        prop: 'warehouseCode',
        itemType: 'select',
        label: '仓库',
        itemStyle,
        placeholder: '请选择',
        dataSource: [],
        change: (val) => {
          this.$set(this.searchFormDatas, 'warehouseCode', val)
          this.$refs.searchForm.dynamicValidateFormRuleForm.shelfCodes = []
          delete this.searchFormDatas.shelfCodes
          if (val && this.searchFormDatas.type) {
            this.searchFormDatas.type === 2
              ? this.shelfOption({ warehouseCode: val })
              : this.getLocationSelect({ warehouseCode: val })
          } else {
            const obj = this.findObj(this.searchData, 'shelfCodes')
            obj.dataSource = []
          }
        }
      },
      {
        prop: 'type',
        itemType: 'select',
        label: '锁定方式',
        itemStyle,
        placeholder: '请选择',
        dataSource: LOCK_TYPE,
        change: (val) => {
          this.$refs.searchForm.dynamicValidateFormRuleForm.shelfCodes = []
          this.$set(this.searchFormDatas, 'type', val)
          if (this.searchFormDatas.shelfCodes) {
            delete this.searchFormDatas.shelfCodes
          }
          this.searchData = []
          // value为1 货物时
          if (val === 1) {
            this.searchData = [
              ...this.searchData_base,
              ...this.searchData_goods
            ]
          } else {
            // 其他
            this.searchData = [
              ...this.searchData_base,
              ...this.searchData_shelfCodes
            ]
            if (val === 2 && this.searchFormDatas.warehouseCode) {
              // 货架
              this.shelfOption({
                warehouseCode: this.searchFormDatas.warehouseCode
              })
            } else if (val === 3 && this.searchFormDatas.warehouseCode) {
              // 库位
              this.getLocationSelect({
                warehouseCode: this.searchFormDatas.warehouseCode
              })
            }
          }
        }
      },
      {
        itemType: 'operate',
        submitText: '搜索',
        submitHandle: (params) => {
          this.formDatas = params
          var p = this.$utils.deepClone(params)
          if (!p.warehouseCode) {
            this.$message({
              type: 'warning',
              message: '请选择仓库'
            })
            return
          }
          if (p.type === 1) {
            delete p.shelfCodes
            delete p.locationCodes
            this.getList({ ...p, ...{ searchType: this.type }})
          } else if (p.type === 2 || p.type === 3) {
            if (p.shelfCodes && p.shelfCodes.length) {
              if (p.type === 3) {
                p.locationCodes = p.shelfCodes
                delete p.shelfCodes
                this.getList(p)
              } else if (p.type === 2) {
                delete p.locationCodes
                this.getList(p)
              }
            } else {
              this.$message({
                type: 'warning',
                message:
                  p.type === 2 ? '请选择货架号' : '请选择库位号'
              })
            }
          } else {
            this.$message({
              type: 'warning',
              message:
                  this.type === 'E' ? '请选择锁定方式' : '请选择解锁方式'
            })
          }
        },
        resetHandle: () => {
          this.searchFormDatas = {}
          this.formDatas = {}
        }
      }
    ]
    const searchData_shelfCodes = [
      {
        prop: 'shelfCodes',
        itemType: 'select',
        label: '锁定货架号',
        itemStyle,
        placeholder: '请选择',
        dataSource: [],
        clearable: true,
        multiple: true,
        collapseTags: true,
        change: (val) => {
          this.$set(this.searchFormDatas, 'shelfCodes', val)
        }
      }
    ]
    const searchData_goods = [
      {
        prop: 'materiel',
        itemType: 'input',
        label: '产品编号',
        itemStyle,
        placeholder: '请输入产品编号',
        clearable: true
      },
      {
        prop: 'batchNo',
        itemType: 'input',
        label: '批次号',
        itemStyle,
        placeholder: '请输入批次号',
        clearable: true
      },
      {
        prop: 'reservationNo',
        itemType: 'input',
        label: '预约单号',
        itemStyle,
        placeholder: '请输入预约单号',
        clearable: true
      },
      {
        prop: 'formNo',
        itemType: 'input',
        label: '入库单号',
        itemStyle,
        placeholder: '请输入入库单号',
        clearable: true
      },
      {
        prop: 'stockType',
        itemType: 'select',
        label: '入库类型',
        itemStyle,
        placeholder: '请选择',
        clearable: true,
        dataSource: BOOKING_STORAGE_TYPE_LIST
      },
      {
        prop: 'sellerTeamId',
        itemType: 'select',
        label: '销售组织',
        itemStyle,
        placeholder: '请选择',
        clearable: true,
        dataSource: []
      },
      {
        prop: 'materielType',
        itemType: 'select',
        label: '产品分类',
        itemStyle,
        placeholder: '请选择',
        clearable: true,
        dataSource: MATERIEL_TYPE,
        change: (val) => {
          // 只有产品属性选择纱类
          const obj = findObj(this.searchData, 'yarnCard')
          if (
            val.includes('0101') ||
            val.includes('0102') ||
            val.includes('0103')
          ) {
            if (!obj.label) {
              this.searchData.splice(-1, 0, yarn)
            }
          } else {
            if (obj.label) {
              this.searchData.splice(-2, 1)
            }
          }
        }
      },
      {
        prop: 'dyelot',
        itemType: 'input',
        label: '缸号',
        itemStyle,
        placeholder: '请输入缸号',
        clearable: true
      }
    ]
    const formOtions = {
      size: 'small',
      layout: true,
      inline: true
    }
    const columns = [
      {
        prop: 'selection',
        type: 'selection',
        width: 60,
        selectable: (row) => {
          return this.searchFormDatas.type === 1
        }
      },
      {
        prop: 'materiel',
        label: '产品编号',
        showOverflowTooltip: true,
        minWidth: 160
      },
      {
        prop: 'materielType',
        label: '产品分类',
        minWidth: 120,
        showOverflowTooltip: true,
        formater: (scope) => {
          const index = MATERIEL_TYPE.findIndex(
            (n) => n.value === scope.row[scope.column.property]
          )
          return index !== -1 ? MATERIEL_TYPE[index].label : ''
        }
      },
      {
        prop: 'batchNo',
        label: '批次号',
        minWidth: 120,
        showOverflowTooltip: true
      },
      {
        prop: 'serialNo',
        label: '条码号',
        minWidth: 120,
        showOverflowTooltip: true
      },
      {
        prop: 'path',
        label: '库位',
        minWidth: 120,
        showOverflowTooltip: true
      },
      {
        prop: 'productInfo',
        label: '产品信息',
        minWidth: 160,
        showOverflowTooltip: true
      },
      {
        prop: 'yarnName',
        label: '纱名',
        minWidth: 160,
        showOverflowTooltip: true
      },
      {
        prop: 'yarnProperty',
        label: '纱属性',
        minWidth: 160,
        showOverflowTooltip: true
      },
      {
        prop: 'yarnCard',
        label: '纱牌/纱批',
        minWidth: 120,
        showOverflowTooltip: true
      },
      {
        prop: 'machineNo',
        label: '机台号',
        minWidth: 160,
        showOverflowTooltip: true
      },
      {
        prop: 'stitchNum',
        label: '针数',
        minWidth: 160,
        showOverflowTooltip: true
      },
      {
        prop: 'inchNum',
        label: '寸数',
        minWidth: 120,
        showOverflowTooltip: true
      },
      {
        prop: 'dyelot',
        label: '缸号',
        minWidth: 140,
        showOverflowTooltip: true
      },
      {
        prop: 'sellerTeamName',
        label: '销售组织',
        minWidth: 160,
        showOverflowTooltip: true
      },
      {
        prop: 'weight',
        label: '入库重量(KG)',
        width: 140,
        align: 'right',
        showOverflowTooltip: true
      },
      {
        prop: 'ballCount',
        label: '球数',
        minWidth: 120,
        showOverflowTooltip: true
      },
      {
        prop: 'packingUnit',
        label: '包装单位',
        minWidth: 120,
        showOverflowTooltip: true
      },
      {
        prop: 'reservationNo',
        label: '预约单号',
        minWidth: 120,
        showOverflowTooltip: true
      },
      {
        prop: 'formNo',
        label: '入库单号',
        minWidth: 120,
        showOverflowTooltip: true
      },
      {
        prop: 'stockType',
        label: '入库类型',
        minWidth: 120,
        showOverflowTooltip: true,
        formater: (scope) => {
          const index = BOOKING_STORAGE_TYPE_LIST.findIndex(
            (n) => n.value === scope.row[scope.column.property]
          )
          return index !== -1 ? BOOKING_STORAGE_TYPE_LIST[index].label : ''
        }
      },
      {
        prop: 'stockInFact',
        label: '入库时间',
        width: 160,
        showOverflowTooltip: true,
        formater: (scope) => {
          return this.$filters.parseTime(
            scope.row.stockInFact || 0,
            '{y}-{m}-{d} {h}:{i}'
          )
        }
      }
    ]
    const yarn = {
      prop: 'yarnCard',
      itemType: 'input',
      label: '纱牌/纱批',
      itemStyle,
      placeholder: '请输入纱牌/纱批',
      clearable: true
    }
    const findObj = (arr, property) => {
      const i = arr.findIndex((i) => i.prop === property)
      if (i !== -1) {
        return arr[i]
      } else {
        return {}
      }
    }
    return {
      formDatas: {},
      searchData_shelfCodes,
      searchData_base,
      searchData_goods,
      yarn,
      formOtions,
      searchFormDatas: {},
      columns,
      list: [],
      selection: {},
      findObj,
      searchData: [],
      selectionResult: [],
      selectOnIndeterminate: true
    }
  },
  computed: {
    type() {
      return this.$route.params.type === 'lock' ? 'E' : 'L'
    },
    typeLable() {
      // 库存类型 E-可用库存，L-锁定库存
      return this.type === 'E' ? '锁定' : '解锁'
    }
  },
  created() {
    this.findObj(this.searchData_base, 'type').label =
      this.type === 'E' ? '锁定方式' : '解锁方式'
    this.findObj(this.searchData_base, 'type').dataSource = this.type === 'E' ? LOCK_TYPE : UNLOCK_TYPE
    this.searchData = this.searchData_base
    this.init()
  },
  methods: {
    async init() {
      // 仓库
      const warehouseListRes = await warehouseList()
      if (this.$pub.responseValidate(warehouseListRes)) {
        var data = warehouseListRes.data ? warehouseListRes.data.list : []
        data.forEach((n) => {
          n.label = n.name
          n.value = n.code
        })
        const obj = this.findObj(this.searchData, 'warehouseCode')
        obj.dataSource = data || []
      }
      // 销售组织
      const saleRes = await sellTeamselet({ functionTag: 'SAL' })
      if (this.$pub.responseValidate(saleRes)) {
        var saleData = saleRes.data || []
        saleData.map((item, index) => {
          item.label = item.name
          item.value = item.orgId
        })
        const obj = this.findObj(this.searchData_goods, 'sellerTeamId')
        obj.dataSource = saleData || []
      }
    },
    async getList(params = {}) {
      var p = this.$utils.deepClone(params)
      p.warehouseCodes = [p.warehouseCode]
      delete p.warehouseCode
      const res = await stockList(p)
      if (this.$pub.responseValidate(res)) {
        this.list = res.data.list || []
        if (this.searchFormDatas.type !== 1) {
          this.$nextTick(() => {
            this.list.forEach((i) => {
              this.$refs.multipleTable.$refs.table.toggleRowSelection(i, true)
            })
          })
        }
      }
    },
    // 货架号
    async shelfOption(data) {
      const res = await locationShelf(data)
      var obj = this.findObj(this.searchData_shelfCodes, 'shelfCodes')
      obj.label = this.typeLable + '货架号'
      if (this.$pub.responseValidate(res)) {
        const data = res.data || {}
        const shelfData =
          data.list &&
          data.list.length &&
          data.list
            .filter(
              (it) =>
                it.isDefault === false &&
                it.isLock === this.type &&
                it.enable === 1
            )
            .map((item) => ({ value: item.path, label: item.path }))
        obj.dataSource = shelfData || []
      } else {
        obj.dataSource = []
      }
    },
    // 库位号
    async getLocationSelect(data) {
      const res = await locationSelect(data)
      var obj = this.findObj(this.searchData_shelfCodes, 'shelfCodes')
      obj.label = this.typeLable + '库位号'
      if (this.$pub.responseValidate(res)) {
        const data = res.data || {}
        const shelfData =
          data.list &&
          data.list.length &&
          data.list
            .filter(
              (it) =>
                it.isDefault === false &&
                it.isLock === this.type &&
                it.enable === 1
            )
            .map((item) => ({ value: item.path, label: item.path }))
        obj.dataSource = shelfData || []
      } else {
        obj.dataSource = []
      }
    },
    selectionChange(arr) {
      this.selectionResult = arr
    },
    async submit() {
      const params = {
        isLock: this.type === 'E' ? 'L' : 'E',
        type: this.formDatas.type
      }
      var labelType = ''
      var tipList = []
      if (this.formDatas.type === 1) {
        // ids
        var result = []
        this.selectionResult.forEach((i) => {
          result.push(i.id)
        })
        params.ids = result
        labelType = '货物'
        tipList = result
      } else if (this.formDatas.type === 2) {
        // shelfCodes
        params.shelfCodes = this.formDatas.shelfCodes
        labelType = '货架'
        tipList = params.shelfCodes
      } else if (this.formDatas.type === 3) {
        // locationCodes
        params.locationCodes = this.formDatas.shelfCodes
        labelType = '库位'
        tipList = params.locationCodes
      }
      const arr = ['ids', 'shelfCodes', 'locationCodes']
      const property = arr[params.type - 1]
      if (!params[property] || !params[property].length || !params.type) {
        this.$message({
          message: '请选择库存数据',
          type: 'warning'
        })
        return
      }
      const res = await lock(params)
      if (this.$pub.responseValidate(res)) {
        // 操作日志
        this.fetchLog(this.getLogMessages('UPDATE', '/wms/stock/manage/lock'),
          params,
          JSON.stringify({
            beforeText: `在'库存管理-库存管理'将${labelType}${JSON.stringify(tipList)}`,
            afterText: this.typeLable,
            afterCode: JSON.stringify(params)
          }))
        this.$message({
          message: this.type === 'E' ? '锁定成功' : '解锁成功',
          type: 'success'
        })
        this.$router.go(-1)
      }
    }
  }
}
</script>

<style lang="scss" >
.isLock {
  .el-table th {
    background-color: #f5f7fa;
    height: 40px;
    padding: 0;
  }
  .form-main .form-box {
    margin: 0 20px;
    padding: 0;
  }
}
</style>
