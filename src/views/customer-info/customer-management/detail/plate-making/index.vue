<template>
  <div class="page-wrap">
    <div class="plate-making__header">
      <span>模板设置</span>
    </div>

    <!-- 分录面板 -->
    <div class="plate-making-wrap">

      <!-- 左侧分录列表 -->
      <div class="left-ct">

        <!-- 分录列表 -->
        <cs-custom-table
          ref="leftTable"
          class="plate-making-table--no-stripe"
          style="margin-top: 17px"
          row-class-name="plate-making-pointer"
          header-cell-class-name="plate-making-table-header-cell"
          :columns="leftTableColumns"
          :data-source="leftTableDataSource"
          :operates="leftTableOperates"
          :highlight-current-row="true"
          @row-click="leftRowClick"
        />
      </div>

      <!-- 中间分隔线 -->
      <div class="divider" />

      <!-- 右侧退货信息 -->
      <div class="right-ct">
        <el-radio-group v-model="activeTabName" class="custom-radio-group" @change="onTabChange">
          <el-radio-button label="0">制板要求</el-radio-button>
          <el-radio-button label="1">寄送要求</el-radio-button>
        </el-radio-group>

        <plate-making-require
          v-show="activeTabName === '0'"
          class="content-wrap"
          :data-source="currentBrand.requirementList"
          :is-edit="isTabEdit"
        />

        <delivery-require
          v-show="activeTabName === '1'"
          ref="deliveryReq"
          class="content-wrap"
          :data-source="currentBrand.templateSendRequirementList"
          :send-requirement-list="sendRequirementList"
          :is-edit="isTabEdit"
        />

      </div>

    </div>

    <!-- 新增分录弹窗 -->
    <cs-custom-popsearch
      ref="pop"
      :options="popOptions"
      @close="popClose"
    />

    <div class="btn-group" :class="{'btn-group--expanded': !sideBarExpanded}">
      <div class="btn">
        <el-button v-show="!isEdit" v-permission="['customer:template:manager:save']" type="primary" @click="handleEdit">编辑</el-button>
        <el-button v-show="isEdit" v-permission="['customer:template:manager:save']" type="primary" @click="handleSave">保存</el-button>
        <el-button v-show="isEdit" @click="handleCancel">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import DeliveryRequire from './components/delivery-require'
import PlateMakingRequire from './components/plate-making'
import { getPlateMakingInfo, getRelatedBrand, savePlateMakingInfo } from './api'
import { sameSpan } from './common'
import BrandHeader from './components/brand-header'

export default {
  name: 'PlateMaking',

  components: {
    DeliveryRequire,
    PlateMakingRequire
  },

  data() {
    return {
      loading: true,
      isEdit: false,

      currentBrand: this.getDefaultData(), // 当前选中的品牌
      defaultBrand: true,
      copiedData: null, // 复制的数据
      rawData: {}, // 后台返回的数据副本，用于取消操作

      activeTabName: '0',

      leftTableColumns: {
        _brandName: {
          prop: 'brandName',
          minWidth: '100',
          label: '品牌',
          showOverflowTooltip: true,
          header: BrandHeader,
          headerOptions: {
            label: '品牌',
            isEdit: false,
            click: () => {
              this.handleAddBrand()
            }
          }
        }
      },
      leftTableDataSource: [],
      leftTableOperates: {
        label: '操作',
        width: '106',
        isShow: () => {
          return this.isEdit
        },
        dataSource: [
          {
            label: '复制',
            isShow: true,
            handle: (scope, form, formDatas, setFormDatas) => {
              event.stopPropagation() // 阻止rowclick方法触发
              this.handleCopy(scope)
            }
          },
          {
            label: '删除',
            isShow: true,
            style: { 'color': '#FE4949' },
            handle: (scope, form, formDatas, setFormDatas) => {
              event.stopPropagation() // 阻止rowclick方法触发

              this.$confirm('确认删除该条订单信息数据？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                cancelButtonClass: 'btn-cancel'
              })
                .then(() => {
                  const delBrands = this.leftTableDataSource.splice(scope.$index, 1)

                  // 如果删除的是当前行，需要重新指定
                  if (this.currentBrand === delBrands[0]) {
                    const curRow = this.leftTableDataSource[this.leftTableDataSource.length - 1]
                    this.setCurrentBrand(curRow)
                    this.setDeliveryRequireTab(0)
                    this.$nextTick(() => {
                      this.highLightRow(curRow)
                    })
                  }

                  this.$message.success('删除成功')
                })
                .catch(() => {
                  this.$message({ type: 'info', message: '已取消删除' })
                })
            }
          }
        ]
      },

      currentPopTableRow: null,
      popOptions: {
        className: 'plate-making-table--no-stripe',
        visible: false,
        title: '选择品牌',
        width: '800px',
        footerOptions: {
          content: [
            {
              name: '确认',
              type: 'primary',
              handle: (formDatas, form, table) => {
                if (!this.currentPopTableRow) {
                  this.$message.warning('请选择一条记录')
                  return
                }

                const curRow = {}
                const copiedData = this.copiedData

                curRow.customerId = this.customerId
                curRow.brandName = this.currentPopTableRow.name || ''
                curRow.brandId = this.currentPopTableRow.id
                curRow.isCopied = !!copiedData
                curRow.templateSendRequirementList = copiedData ? copiedData.templateSendRequirementList : []
                curRow.requirementList = copiedData ? copiedData.requirementList : []

                this.copiedData = null

                if (this.dupCheck(curRow)) {
                  this.$message.error('存在相同品牌')
                  return
                }

                this.leftTableDataSource.push(curRow)
                this.popOptions.visible = false
                this.setCurrentBrand(curRow)
                this.setDeliveryRequireTab(0)
                this.$nextTick(() => {
                  this.highLightRow(curRow)
                })
              }
            },
            {
              name: '取消',
              handle: this.popHandle
            }

          ]
        },
        popFormOptions: {
          content: {
            _name: {
              prop: 'name',
              itemType: 'input',
              itemStyle: { width: '50%' },
              label: '名称',
              dataSource: [],
              clearable: true
            },
            _operate: {
              itemType: 'operate',
              submitText: '查询',
              submitHandle: params => {
                this.popSearchFormData = params
                this.getBrandData({
                  pageSize: this.popOptions.popTableOptions.pageSize || 10,
                  currentPage: 1,
                  pageNum: 1,
                  ...params
                })
              },
              resetHandle: (params) => {
                this.popSearchFormData = {}
              }
            }
          },
          formOptions: {
            syncDataHandle: (syncData) => {},
            inline: true
          }
        },
        popTableOptions: {
          columns: {
            _name: {
              prop: 'name',
              label: '品牌名称',
              showOverflowTooltip: true,
              minWidth: '120'
            },
            _applyCode: {
              prop: 'applyCode',
              label: '中文简称',
              showOverflowTooltip: true
            },
            _productInfo: {
              prop: 'productInfo',
              label: '英文简称',
              minWidth: '110'
            },
            _type: {
              prop: 'type',
              label: '市场类型',
              minWidth: '60'
            }
          },
          highlightCurrentRow: true,
          headerCellClassName: 'plate-making-table-header-cell',
          currentRowKey: 'id',
          rowClick: (row, /* column, event */) => { this.currentPopTableRow = row },
          dataSource: [],
          pagination: {
            pageSizes: [10, 20, 50, 100],
            pageNum: 1,
            currentPage: 1,
            dataTotal: 0,
            pageSize: 10,
            currentChange: val => {
              this.getBrandData({ pageSize: this.popOptions.popTableOptions.pageSize || 10, pageNum: val, currentPage: val })
            },
            sizeChange: val => {
              this.$set(this.popOptions.popTableOptions.pagination, 'currentPage', 1)
              this.getBrandData({ pageNum: 1, pageSize: val, currentPage: 1 })
            }
          }
        },
        popSearchFormData: {}
      },

      sendRequirementList: []
    }
  },

  computed: {
    sideBarExpanded() {
      return this.$store.state.app.sidebar.opened
    },
    customerId() {
      return this.$route.params.id
    },
    isTabEdit() {
      // 分录没有数据的时候不允许编辑右侧内容
      return this.isEdit && !!this.leftTableDataSource.length
    }
  },

  watch: {
    isEdit(val) {
      this.leftTableColumns._brandName.headerOptions.isEdit = val
    },

    leftTableDataSource: {
      handler(val) {
        // 设置默认数据，默认选中第一条
        if (!this.defaultBrand) {
          return
        }
        this.defaultBrand = false

        if (val.length) {
          this.setCurrentBrand(val[0])
          this.highLightRow(val[0])
          this.setDeliveryRequireTab(0)
        }
      }
    },

    'currentBrand.requirementList': {
      deep: true,
      handler(val) {
        this.updateSendRequirementList(val) // 更新寄送要求下寄送板型表格可选数据
      }
    }
  },

  mounted() {
    this.getData()
  },

  methods: {
    async getData() {
      this.rawData = {}
      this.loading = true
      this.defaultBrand = true // 默认选中

      const { data } = await getPlateMakingInfo({ customerId: this.customerId })
      let { brandTemplateRelateList } = data || {}

      brandTemplateRelateList = brandTemplateRelateList || []

      // 分录表格赋值
      this.leftTableDataSource = brandTemplateRelateList.map(item => this.processBrandData(this.$utils.deepClone(item)))
      this.rawData = brandTemplateRelateList
      this.loading = false
    },

    onTabChange() {
      this.$nextTick(() => {
        this.$refs.leftTable && this.$refs.leftTable.$forceUpdate()
      })
    },

    // 修改后台返回的数据结构，以适应表格展示的需求
    processBrandData(item) {
      return {
        ...item.customerBrandTemplateRel,
        requirementList: item.requirementList, // 制板要求数据
        templateSendRequirementList: item.templateSendRequirementList // 寄送要求数据
      }
    },

    reverseBrandData(item) {
      const ret = {
        requirementList: item.requirementList, // 制板要求数据
        templateSendRequirementList: item.templateSendRequirementList // 寄送要求数据
      }

      delete item.requirementList
      delete item.templateSendRequirementList

      ret.customerBrandTemplateRel = item

      return ret
    },

    handleAddBrand() {
      this.popOptions.visible = true
      this.getBrandData({ pageNum: 1, pageSize: 10, currentPage: 1 })
    },

    handleCopy(scope) {
      this.copiedData = this.$utils.deepClone(scope.row)
      this.popOptions.visible = true
      this.getBrandData({ pageNum: 1, pageSize: 10, currentPage: 1 })
    },

    leftRowClick(row, column) {
      this.setCurrentBrand(row)
      this.setDeliveryRequireTab(0) // 寄送要求有一个顶部tab切换，需要重置一下
    },

    setCurrentBrand(row = this.getDefaultData()) {
      // null值处理
      row.requirementList = row.requirementList ? row.requirementList : []
      row.templateSendRequirementList = row.templateSendRequirementList ? row.templateSendRequirementList : []

      this.currentBrand = row
    },

    setDeliveryRequireTab(idx) {
      const comp = this.$refs.deliveryReq

      if (comp) {
        const data = this.currentBrand.templateSendRequirementList[idx] || {}
        comp.setActiveTab(comp.getAddrId(data))
        comp.updateData(data)
      }
    },

    highLightRow(row) {
      const table = this.$refs.leftTable && this.$refs.leftTable.$refs.table

      table.setCurrentRow(row)
    },

    getBrandData(params) {
      getRelatedBrand({ customerId: this.customerId, ...params }).then(res => {
        const { list, total, pageSize, pageNum } = res.data || {}
        const tableOptions = this.popOptions.popTableOptions

        tableOptions.dataSource = this.brandDataFilter(list) || []
        // 这里因为前端又做了数据过滤，分页条的数据是有问题的，但是数据只有一页，分页条没有显示
        tableOptions.pagination.pageNum = pageNum || 0
        tableOptions.pagination.currentPage = pageNum || 0
        tableOptions.pagination.dataTotal = total || 0
        tableOptions.pagination.pageSize = pageSize || 10

        // 清掉当前选择项
        this.currentPopTableRow = null
      })
    },

    // 过滤已选择的品牌
    brandDataFilter(data) {
      if (!data || !data.length) {
        return []
      }

      return data.filter(item => !this.leftTableDataSource.some(curRow =>
        (curRow.brandName === item.name) || (curRow.brandId === item.id)
      ))
    },

    dupCheck(newRow) {
      return this.leftTableDataSource.some(curRow => curRow.brandName === newRow.brandName)
    },

    popHandle() { // 选择品牌显隐
      this.popSearchFormData = {}
      this.popOptions.visible = false
    },

    popClose() {
      const table = this.$refs.pop && this.$refs.pop.gettable()
      table && table.setCurrentRow() // 清除当前行的选中状态

      this.currentPopTableRow = null
      this.popsearchFormDatas = {}
      this.popOptions.popTableOptions.dataSource = []
    },

    updateSendRequirementList(val = []) {
      const newList = []

      val.forEach(curRow => {
        if (this.filterSendRequirement(curRow, newList)) {
          newList.push(this.$utils.deepClone(curRow))
        }
      })

      this.sendRequirementList = newList
    },

    // 筛选寄送板型表格可选数据
    filterSendRequirement(curRow, newList) {
      const handoverType = curRow.handoverType || {}
      const handoverTypeLabel = handoverType.label || ''

      // 不添加交接类型为客服的数据
      if (handoverTypeLabel.includes('客服')) {
        return false
      }

      // 不添加已存在相同类型的数据
      if (newList.length && newList.some(cmpRow => sameSpan(curRow, cmpRow))) {
        return false
      }

      return true
    },

    beforeSave() {
      const comp = this.$refs.deliveryReq
      comp && comp.beforeSave()

      const labels = []

      // 空值校验
      if (!this.leftTableDataSource.every(item => {
        if (!item.templateSendRequirementList) {
          return true
        }

        if (!item.templateSendRequirementList.length) {
          return true
        }

        return item.templateSendRequirementList.every(sendItem => {
          let pass = true

          if (!sendItem.paymentMethod || !sendItem.paymentMethod.value) {
            labels.push('付费方式')
            pass = false
          }
          if (!sendItem.labelLanguage || !sendItem.labelLanguage.value) {
            labels.push('标签语言')
            pass = false
          }

          return pass
        })
      })) {
        this.$message.error(labels.join('、') + '不能为空')
        return false
      }

      return true
    },

    async handleSave() {
      if (!this.beforeSave()) {
        return
      }

      const res = await this.$confirm(' 你确认要提交该数据吗？', '提示', {
        type: 'warning'
      }).then(() => true)
        .catch(() => false)

      if (!res) {
        return
      }

      console.log('制板管理保存数据：', this.leftTableDataSource)

      await savePlateMakingInfo({
        customerId: this.customerId,
        brandTemplateRelateList: this.saveDataHandler(this.leftTableDataSource)
      })

      this.isEdit = false
      this.$pub.handleSuccessfully({ message: '保存成功！' })

      // 重新获取数据
      this.getData()
    },

    handleEdit() {
      // 数据加载中不能编辑
      if (this.loading) {
        return
      }

      this.isEdit = true
    },

    handleCancel() {
      this.isEdit = false
      this.leftTableDataSource = Array.isArray(this.rawData) && this.rawData.map(item => this.processBrandData(this.$utils.deepClone(item))) || []
      this.setDeliveryRequireTab() // 防止返回的分录为空导致右侧面板数据没有被重置，这里先清空一下右侧面板数据
      this.defaultBrand = true

      const comp = this.$refs.deliveryReq
      comp && comp.handleCancel()
    },

    getDefaultData() {
      return {
        requirementList: [],
        templateSendRequirementList: []
      }
    },

    // 保存前的数据处理
    saveDataHandler(data) {
      return data.map(item => {
        const retItem = this.$utils.deepClone(item)
        const isCopied = retItem.isCopied

        if (isCopied) {
          delete retItem.id
        }

        retItem.requirementList && retItem.requirementList.forEach(requireItem => {
          requireItem.brandId = item.brandId
          requireItem.customerId = this.customerId

          if (requireItem.unit.typeId && requireItem.unit.typeVal) {
            requireItem.unitType = {
              value: requireItem.unit.typeId,
              label: requireItem.unit.typeVal
            }
          }

          delete requireItem.$frontTempId
          if (isCopied) {
            delete requireItem.id
          }
        })

        retItem.templateSendRequirementList && retItem.templateSendRequirementList.forEach(sendItem => {
          sendItem.brandId = item.brandId
          sendItem.customerId = this.customerId
          if (isCopied) {
            delete sendItem.id
          }

          sendItem.sendTemplateList && sendItem.sendTemplateList.forEach(templateItem => {
            templateItem.brandId = item.brandId
            templateItem.customerId = this.customerId
            if (isCopied) {
              delete templateItem.id
            }
          })
        })

        delete retItem.isCopied
        return this.reverseBrandData(retItem)
      })
    }
  }
}
</script>

<style scoped lang="scss">
.page-wrap {
  padding: 0 20px;
  background-color: #fff;

  .btn-group {
    bottom: 0;
    right: 0;
    z-index: 201; /* 这里要高于其他tab页btn-groups的z-index, 改动时注意 */
    min-height: 57px;
    padding: 10px;
    width: calc(100% - 210px);
    background: #fff;
    border-top: 1px solid #ecf0f3;
    position: fixed;
    transition: width 0.28s;

    .btn {
      display: inline-block;
      position: relative;
      left: 48%;
      transform: translateX(-50%);
    }

    &--expanded {
      width: calc(100% - 54px);
    }
  }
}

.content-wrap {
  width: 100%;
  padding-bottom: 20px;
}

.plate-making-wrap {
  width: 100%;
  min-height: calc(100vh - 300px);
  display: flex;

  .left-ct {
    width: 350px;
  }

  .divider {
    align-self: stretch;
    width: 1px;
    background-color: #eeeff0;
  }

  .right-ct {
    width: calc(100% - 351px);
    padding: 20px 0 20px 20px;
  }
}

.custom-radio-group {
  /deep/ .el-radio-button__orig-radio:checked + .el-radio-button__inner {
    color: #0986ff;
    border-color: #0986ff;
    background-color: transparent;
  }
}
</style>

<style lang="scss">
.plate-making {
  &-pointer {
    cursor: pointer;
  }

  &__header {
    display: flex;
    justify-content: space-between;
    padding: 20px 0 15px;
    border-bottom: 1px solid #eeeff0;
  }

  &-table-header-cell {
    padding: 8px 0;
    background-color: #f5f7fa !important;
  }

  &-table--no-stripe {
    .el-table tr:nth-child(even){
      background: #fff;
    }
  }

  &-table--fixed-right {
    .el-table__fixed::before, .el-table__fixed-right::before {
      background-color: transparent;
    }

    .el-table__fixed::before, .el-table__fixed-right {
      height: calc(100% - 9px) !important;
    }
  }

  &-button {
    width: 58px;
    height: 28px;
    border: 1px solid #1890ff;
    border-radius: 3px;
    color: #1890ff;

    span {
      line-height: 27px;
    }

    &--primary {
      border: 1px solid #1890ff;
      color: #1890ff;
    }
  }

  &-form--preview {
    .el-form-item{
      margin-bottom: 0 !important;
    }
    .el-form-item__label{
      color: #888E9E;
    }
    .el-form-item__content{
      color: #474747;
    }
  }
}
</style>
