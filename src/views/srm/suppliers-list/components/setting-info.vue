<template>
  <div class="details-main">
    <div v-if="!info" class="tishi">
      请先在基础资料选择供应商类型
    </div>
    <div v-else-if="!info.length" class="tishi">
      没有设备信息
    </div>
    <!-- 0没有 1采购类设备 2针织 3染整 4印花 5染纱 -->
    <div v-else>
      <el-tabs v-model="ableTabs" @tab-click="handleClick">
        <el-tab-pane
          v-for="(item, i) in info"
          :key="i"
          :label="item | filtersName"
          :name="item"
        />
      </el-tabs>
      <!-- 染纱 -->
      <div v-if="ableTabs === 'supplierDevice'">
        <dye-works
          ref="dyeworks"
          :info="supplierDevice"
          :set-data="setrsData"
        />
      </div>
      <!-- 针织 -->
      <div v-else-if="ableTabs === 'supplierKnit'" class="table-details detail">
        <cs-custom-table
          ref="customTable"
          :columns="datas.columns"
          :data-source="datas.dataSource"
          :operates="operates"
          :pagination="pagination"
          edit-type="pop"
        />
      </div>
      <div v-else>
        <cs-custom-table
          :columns="datas.columns"
          :data-source="datas.dataSource"
          :operates="operates"
        />
      </div>
    </div>
    <div class="pop">
      <cs-custom-pop ref="pop" :options="popOpt" />
    </div>
  </div>
</template>

<script>
import { deepClone } from '@/utils'
import { settingInfo } from './common/settingInfo'
import dyeWorks from './common/dye-works'
export default {
  name: 'SettingInfo',
  components: { dyeWorks },
  filters: {
    filtersName(val) {
      const data = {
        supplierDeviceInfos: '纱供应商',
        supplierKnit: '针织设备',
        ranzheng: '染整设备',
        supplierPrinting: '印花设备',
        supplierDevice: '染纱设备',
        supplierOther: '其他设备'
      }
      return data[val]
    }
  },
  mixins: [settingInfo],
  props: {
    info: {
      type: Array,
      default: () => ([])
    },
    setData: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    const operates = {
      label: '操作',
      fixed: 'right',
      width: '140px',
      dataSource: [
        {
          label: '复制',
          isShow: scope => this.type !== 'detail',
          handle: params => {
            if (this.ableTabs === 'supplierOther') {
              const arr = [...this.contentOther[0].dataSource]
              const child = arr.find(e => params.row.deviceType.label === e.label)
              this.contentOther[1].dataSource = child && child.child || []
            }
            this.popOptions.visible = true
            this.popOptions.formDatas = {
              ...params.row,
              typeIndex: undefined,
              id: null
            }
            if (this.ableTabs === 'supplierKnit') {
              this.$nextTick(() => {
                const obj = this.$refs.pop.$refs.popComponents.$refs.customform.$refs.dynamicValidateForm.$children.find(e => e.setData)
                obj.setData(params.row.supplierKnitNums)
              })
            }
          }
        },
        {
          label: '删除',
          style: { 'color': '#FE4949' },
          isShow: scope => this.type !== 'detail',
          handle: params => {
            this.$confirm('确认删除当前数据吗？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
              customClass: 'customClass'
            }).then(() => {
              this.delList(params.row.id)
            })
          }
        },
        {
          label: '修改',
          isShow: scope => this.type !== 'detail',
          handle: params => {
            if (this.ableTabs === 'supplierOther') {
              const arr = [...this.contentOther[0].dataSource]
              const child = arr.find(e => params.row.deviceType.label === e.label)
              this.contentOther[1].dataSource = child && child.child || []
            }
            this.popOptions.visible = true
            this.popOptions.formDatas = { ...params.row, typeIndex: params.$index }
            if (this.ableTabs === 'supplierKnit') {
              this.$nextTick(() => {
                const obj = this.$refs.pop.$refs.popComponents.$refs.customform.$refs.dynamicValidateForm.$children.find(e => e.setData)
                obj.setData(params.row.supplierKnitNums)
              })
            }
          }
        }
      ]
    }
    const popOptions = {
      itemType: 'drawer',
      visible: false,
      title: '添加',
      okText: '确定',
      ok: params => {
        let bool = true
        if (this.ableTabs === 'supplierKnit') {
          const child = this.$refs.pop.$refs.popComponents.$refs.customform.$refs.dynamicValidateForm.$children.find(e => e.setData)
          child.$refs.table.form.validate(valid => {
            bool = valid
          })
          params['supplierKnitNums'] = child.$refs.table.dynamicValidateFormRuleForm.supplierKnitNums
        }
        if (bool) {
          this.saveData(params)
        }
      },
      cancel: params => {
        this.popOptions.visible = false
      },
      content: [],
      formDatas: {}
    }
    // 分页配置信息
    const pagination = {
      pageSizes: [10, 20, 30, 50, 100],
      pageSize: 10,
      pageNum: 1,
      totalRows: 0,
      currentChange: val => {
        this.pagination.pageNum = val
        this.getList()
      },
      sizeChange: val => {
        this.pagination.pageSize = val
        this.getList()
      }
    }
    return {
      ableTabs: '',
      operates,
      popOptions,
      pagination
    }
  },
  computed: {
    type() {
      return this.$route.params.type
    },
    datas() {
      const dataAll = {
        supplierDeviceInfos: {
          dataSource: this.dataSourceDefault,
          columns: this.columnsDefault,
          content: this.contentDefault,
          flag: 'dataSourceDefault'
        },
        supplierKnit: {
          dataSource: this.dataSourceKnit,
          columns: this.columnsKnit,
          content: this.contentKnit,
          flag: 'dataSourceKnit'
        },
        ranzheng: {
          dataSource: this.dataSourceDye,
          columns: this.columnsDye,
          content: this.contentDye,
          flag: 'dataSourceDye'
        },
        supplierPrinting: {
          dataSource: this.dataSourcePrint,
          columns: this.columnsPrint,
          content: this.contentPrint,
          flag: 'dataSourcePrint'
        },
        supplierDevice: {
          flag: 'supplierDevice'
        },
        supplierOther: {
          dataSource: this.dataSourceOther,
          columns: this.columnsOther,
          content: this.contentOther,
          flag: 'dataSourceOther'
        }
      }
      return dataAll[this.ableTabs] || {
        dataSource: [],
        columns: [],
        content: []
      }
    },
    popOpt() {
      const obj = deepClone(this.popOptions)
      const content = deepClone(this.datas.content || [])
      return { ...obj, content }
    }
  },
  methods: {
    handleClick() {
      this.getList()
      // 修改detail 导入相关接口
      this.setData(this.ableTabs)
    },
    setrsData(key, val) {
      this.getList()
    }
  }
}
</script>

<style lang="scss" scoped>
  .tishi {
    text-align: center;
    color: #999;
    margin: 20px 20px 0;
    font-size: 14px;
  }
  .panel-table {
    padding-top: 5px;
  }
  .panel-btns {
    text-align: right;
    padding-bottom: 15px;
    border-bottom: solid 1px #e9eff2;
  }
  .border-frame {
    border: 1px solid #EEEFF0;
    border-bottom: 0px;
  }
  th.redStar {
    .cell::before {
      content: '*';
      color: #ff4949;
      margin-right: 4px;
    }
  }
</style>
