<template>
  <div class="convent-yarn-container">
    <!-- 搜索页面 -->
    <div class="search islayoutForm">
      <cs-custom-form
        ref="searchForm"
        :data-source="searchData"
        :options="formOtions"
      />
    </div>
    <!-- 菜单按钮 -->
    <div class="button">
      <el-dropdown v-permission="['aps-center:generalYarn:batch:add']" @command="handleCommand">
        <el-button type="primary" size="small">
          新建<i class="el-icon-arrow-down el-icon--right" />
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="item of drawerMenu" :key="item.value" :command="item">{{ item.label }}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button v-permission="['aps-center:generalYarn:generate:purchase']" size="small" type="primary" @click="productionBuyer">生成采购</el-button>
      <el-button v-permission="['aps-center:generalYarn:batch:delete']" size="small" type="default" @click="deregulation">取消常规</el-button>
    </div>
    <!-- table表格 -->
    <div class="page-table">
      <cs-custom-table
        :columns="columns"
        :data-source="dataSource"
        :table-scrollx="true"
        :operates="popOperates"
        :data-total="dataSource.length"
        edit-type="pop"
        @selection-change="handleSelectionChange"
      />
    </div>
    <!-- 弹出层 -->
    <div class="pop">
      <!-- 新建常规纱弹出层 -->
      <!-- <cs-custom-popsearch :options="popOptions" /> -->
      <!-- 查看详情 -->
      <cs-custom-pop :options="detailPopOptions" />
      <!-- 编辑安全库存 -->
      <cs-custom-pop :options="storePopOptions" />
      <!-- 生成采购 -->
      <cs-custom-pop :options="purchasePopOptions" />
    </div>
    <!-- 纱线编码弹窗 -->
    <codePop
      ref="codePop"
      :add-type="addType"
      :parent-data="dataSource"
      @searchData="initData"
    />
  </div>
</template>

<script>
import { generalYarnPage, deregulation, generalYarnStore, generalYarnModify, purchase } from './api/index.js'
import cusGreyInput from './components/cusGreyInput'
import codePop from './components/codePop.vue'
export default {
  components: {
    codePop
  },
  data() {
    const commonChangeReg = this.$getRules({})
    const max999Reg = this.$getRules({
      type: 'number',
      pattern: /^(([1-9]{1}\d{0,7})|(0{1}))?$/,
      message: '请输入最大8位整数',
      trigger: ['blur']
    })
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    const searchData = [
      {
        prop: 'yarnCode',
        itemType: 'input',
        label: '纱线编码:',
        itemStyle: { width: '25%' },
        placeholder: '请输入纱线编码',
        clearable: true
      },
      {
        prop: 'yarnType',
        itemType: 'select',
        label: '纱线类型:',
        itemStyle: { width: '25%' },
        dataSource: [
          {
            label: '天然纤维',
            value: 0
          },
          {
            label: '化学纤维',
            value: 1
          },
          {
            label: '组合纱线',
            value: 2
          }
        ]
      },
      {
        prop: 'yarnName',
        itemType: 'input',
        label: '纱名:',
        placeholder: '请输入纱名',
        itemStyle: { width: '25%' },
        clearable: true
      },
      {
        prop: 'yarnAttributes',
        itemType: 'input',
        label: '纱属性:',
        itemStyle: { width: '25%' },
        placeholder: '请输入纱属性',
        clearable: true
      },
      {
        prop: 'isFill',
        itemType: 'select',
        label: '需补充量:',
        itemStyle: { width: '25%' },
        dataSource: [
          {
            label: '是',
            value: 'Y'
          },
          {
            label: '否',
            value: 'N'
          }
        ]
      },
      {
        itemType: 'operate',
        submitText: '查询',
        submitHandle: params => {
          this.searchFormDatas = params
          this.formDatas = params

          console.log(params)
          this.initData(this.formDatas)
        },
        resetHandle: () => {
          // console.log('重置')
          this.formDatas = {}
          // this.formDatas.sorts = [] // 自定义表格内排序
          // this.$refs.tableList.$refs.table.clearSort()
        }
      }
    ]
    // 表格表头的配置信息
    const columns = [
      {
        prop: 'id',
        type: 'selection'
        // fixed: 'left'
      },
      {
        prop: 'code',
        label: '序号',
        minWidth: '50'
      },
      {
        prop: 'yarnCode',
        label: '纱线编码',
        minWidth: '150',
        showOverflowTooltip: true,
        handle: (scope) => {
          if (this.$permission(['aps-center:generalYarn:check:store'])) {
            this.getDetail(scope)
          }
        },
        style: {
          color: '#1890ff',
          cursor: 'pointer'
        }
      },
      {
        prop: 'yarnName',
        label: '纱名',
        minWidth: '100',
        showOverflowTooltip: true
      },

      {
        prop: 'yarnAttributes',
        label: '纱属性',
        minWidth: '150',
        showOverflowTooltip: true
      },

      {
        prop: 'safetyStore',
        label: '安全库存(KG)',
        minWidth: '130',
        align: 'right',
        showOverflowTooltip: true,
        formater: (scope) => {
          if (!scope.row.safetyStore && scope.row.safetyStore !== 0) {
            return '-'
          } else {
            return !isNaN(scope.row.safetyStore) ? Number(scope.row.safetyStore).toFixed(2) : ''
          }
        }
      },

      {
        prop: 'usableStore',
        label: '已入可用库存(KG)',
        minWidth: '140',
        align: 'right',
        showOverflowTooltip: true,
        formater: (scope) => {
          if (!scope.row.usableStore && scope.row.usableStore !== 0) {
            return '-'
          } else {
            return !isNaN(scope.row.usableStore) ? Number(scope.row.usableStore).toFixed(2) : ''
          }
        }
      },

      {
        prop: 'onStore',
        label: '在途(KG)',
        minWidth: '80',
        align: 'right',
        formater: (scope) => {
          if (!scope.row.onStore && scope.row.onStore !== 0) {
            return '-'
          } else {
            return !isNaN(scope.row.onStore) ? Number(scope.row.onStore).toFixed(2) : ''
          }
        }
      },

      {
        prop: 'fillStore',
        label: '需补充量(KG)',
        minWidth: '120',
        align: 'right',
        formater: scope => {
          return scope.row.fillStore > 0
            ? `<span style="color: #FF4444;">${(scope.row.fillStore).toFixed(2)}</span>`
            : `<span style="color: #666;">${(scope.row.fillStore).toFixed(2)}</span>`
        }
      },

      {
        prop: 'sendStore',
        label: '已下发未开单重量(KG)',
        minWidth: '180',
        align: 'right',
        showOverflowTooltip: true,
        formater: (scope) => {
          if (!scope.row.sendStore && scope.row.sendStore !== 0) {
            return '-'
          } else {
            return !isNaN(scope.row.sendStore) ? Number(scope.row.sendStore).toFixed(2) : ''
          }
        }
      }
    ]

    // const copyContent = [...commonContent]
    let popOperatesDataSource = [
      {
        label: '编辑',
        permitTag: ['aps-center:generalYarn:modify'],
        isShow: scope => {
          return true
        },
        handle: scope => {
          this.handleEdit(scope)
        }
      },
      {
        label: '查看',
        permitTag: ['aps-center:generalYarn:check:store'],
        isShow: scope => {
          return true
        },
        handle: scope => {
          this.getDetail(scope)
        }
      }
    ]
    popOperatesDataSource = this.$filterPermission(popOperatesDataSource)
    const popOperates = {
      label: '操作',
      width: '150',
      fixed: 'right',
      dataSource: popOperatesDataSource
    }

    // 查看库存
    const detailPopOptions = {
      itemType: 'dialog',
      visible: false,
      okHidden: true,
      title: '查看库存',
      // width: '1200px',
      cancelText: '关闭',
      // ok: (params) => {
      //   this.addDialog()
      // },
      close: () => {
        this.detailPopOptions.visible = false
      },
      cancel: (params) => {
        this.detailPopOptions.visible = false
      },
      formDatas: { },
      formOptions: {
        // size: 'small',
        // layout: true,
        inline: true
      },
      content: {
        _detailDialogTable: {
          // tooltipEffect: 'light',
          // height: '300px',
          layout: true,
          prop: 'detailDialogTable',
          // itemType: 'table',
          headerCellStyle: { 'background-color': '#F5F7FA', 'height': '40px', 'padding': '0' },
          className: 'pop-table',
          itemType: 'table-form',
          rowStyle: { 'background-color': '#fff' },
          columns: {
            _index: {
              prop: 'index',
              label: '序号',
              formater: (scope) => {
                return scope.$index + 1
              },
              minWidth: '50'
            },
            _wareHouseAddress: {
              prop: 'wareHouseAddress',
              label: '仓库地址',
              minWidth: '130',
              showOverflowTooltip: true
            },
            _yarnCarNo: {
              prop: 'yarnCarNo',
              label: '纱牌纱批',
              minWidth: '130',
              showOverflowTooltip: true
            },
            _storeNum: {
              prop: 'storeNum',
              label: '库存数量(KG)',
              minWidth: '130',
              showOverflowTooltip: true,
              formater: (scope) => {
                if (!scope.row.storeNum && scope.row.storeNum !== 0) {
                  return '-'
                } else {
                  return !isNaN(scope.row.storeNum) ? Number(scope.row.storeNum).toFixed(2) : ''
                }
              }
            }
            // ...publicTwoColumns
          },
          dataSource: [],
          itemStyle: {
            width: '100%'
          }
        }
      }
    }
    // 编辑安全库存弹出框
    const storePopOptions = {
      itemType: 'dialog',
      visible: false,
      title: '编辑',
      width: '537px',
      cancelText: '退出',
      ok: async params => {
        this.editData(params)
      },
      cancel: params => {
        this.$set(this.storePopOptions, 'visible', false)
      },
      close: () => {
        this.$set(this.storePopOptions, 'visible', false)
      },
      formDatas: {},
      formOptions: {
        size: 'small'
      },
      content: {
        _safetyStore: {
          itemType: 'input',
          prop: 'safetyStore',
          label: '安全库存值',
          maxlength: 10,
          clearable: true,
          rules: [commonBlurReg, max999Reg]
        }

      }
    }

    // 生成采购需求弹框
    const purchasePopOptions = {
      itemType: 'dialog',
      visible: false,
      title: '编辑',
      width: '800px',
      cancelText: '退出',
      ok: async params => {
        console.log(params)
        this.purchaseSave(params)
      },
      cancel: params => {
        this.$set(this.purchasePopOptions, 'visible', false)
      },
      close: () => {
        this.$set(this.purchasePopOptions, 'visible', false)
      },
      formDatas: {},
      formOptions: {
        inline: true
      },
      content: {
        _date: {
          prop: 'purchaseDelivery',
          label: '采购交期',
          itemType: 'date',
          type: 'date',
          format: 'yyyy-MM-dd',
          clearable: true,
          valueFormat: 'timestamp',
          placeholder: '请选择日期',
          rules: [commonChangeReg]
        },
        _purchaseDialogTable: {
          // tooltipEffect: 'light',
          height: '300px',
          layout: true,
          prop: 'detailDialogTable',
          className: 'detailDialogTable',
          headerCellStyle: { 'background-color': '#F5F7FA', 'height': '40px', 'padding': '0' },
          itemType: 'table-form',
          rowStyle: { 'background-color': '#fff' },
          columns: {
            _index: {
              prop: 'index',
              label: '序号',
              formater: (scope) => {
                return scope.$index + 1
              },
              minWidth: '50'
            },
            _yarnCode: {
              prop: 'yarnCode',
              label: '纱线编码',
              minWidth: '130',
              showOverflowTooltip: true
            },
            _yarnName: {
              prop: 'yarnName',
              label: '纱名',
              minWidth: '130',
              showOverflowTooltip: true
            },
            _yarnAttributes: {
              prop: 'yarnAttributes',
              label: '纱属性',
              minWidth: '130',
              showOverflowTooltip: true
            },
            _purchaseAmount: {
              prop: 'purchaseAmount',
              label: '采购量',
              minWidth: '130',
              showOverflowTooltip: true,
              components: {
                cusGreyInput
              },
              componentsOptions: {
                type: 'billet',
                update: scope => {
                  // this.lockNumChange(scope)
                }
              }
            }
            // ...publicTwoColumns
          },
          dataSource: [],
          itemStyle: {
            width: '100%'

          }
        }

      }
    }
    // 分页配置信息
    const pagination = {
      currentChange: val => {
        console.log(val)
        this.initData({
          pageSize: this.pagination.pageSize || 20,
          pageNum: val
        })
      },
      sizeChange: val => {
        console.log(val)
        this.initData({ pageNum: 1, pageSize: val })
      }
    }
    // 新建菜单下拉数据
    const drawerMenu = [
      {
        label: '天然纤维',
        value: 0
      },
      {
        label: '化学纤维',
        value: 1
      },
      {
        label: '组合纱线',
        value: 2
      }
    ]
    return {
      commonChangeReg,
      drawerMenu,
      addType: 0, // 新建类型（0：天然纤维，1：化学纤维2：组合纱线）
      formOtions: {
        inline: true,
        size: 'small',
        layout: true
      },
      formDatas: {
        enabled: ''
      },
      searchData,
      columns,
      popOperates,
      pagination,
      dataSource: [],
      selectConvent: [], // 常规列表勾选的数据
      detailPopOptions, // 查看详情弹框
      storePopOptions, // 编辑安全库存弹框
      purchasePopOptions, // 生成采购弹框
      purchaseRes: []
    }
  },
  computed: {

  },
  created() {
    this.initData()
  },
  methods: {
    // 新建
    handleCommand(command) {
      this.$message.success('click on item ' + command.label)
      this.addType = command.value
      //   this.oldForm = this.copyContent.formDatas || {}
      this.PopDialogHandle('新建')
      this.$set(this.$refs.codePop.popOptions.popFormOptions, 'formDatas', {})
      this.$refs.codePop.searFormData = {}
    },

    // 列表查询
    async initData(data = {}) {
      const res = await generalYarnPage({ ...this.searchFormDatas, ...data })
      res.data &&
        res.data.map((item, index) => {
          item.code = index + 1
        })
      let listData = res.data ? res.data : []
      if (this.searchFormDatas && this.searchFormDatas.isFill) {
        if (this.searchFormDatas.isFill === 'N') {
          listData = listData.filter(item => item.fillStore === 0)
        } else {
          listData = listData.filter(item => item.fillStore !== 0)
        }
      }

      this.dataSource = listData || []
    },
    // 取消常规
    async deregulation() {
      if (this.selectConvent.length === 0) {
        this.$message.error('请先选择记录!')
        return
      } else {
        const diog = await this.$uiUtils.confirmMsg({ message: '是否取消常规设置', cancelMessage: '已取消操作' })
        if (diog) {
          const ids = []
          for (let i = 0; i < this.selectConvent.length; i++) {
            ids.push(this.selectConvent[i].id)
          }
          const res = await deregulation({ ids: ids })
          if (!res || res.code !== 200) {
            return false
          }
          this.$message.success('取消常规纱成功!')
          this.initData()
        } else {
          console.log('已取消常规设置')
        }
      }
    },
    // 生成采购弹出窗
    productionBuyer() {
      if (this.selectConvent.length === 0) {
        this.$message.error('请先选择记录!')
        return
      } else {
        this.$set(this.purchasePopOptions, 'visible', true)
        const tempArr = []
        for (let i = 0; i < this.selectConvent.length; i++) {
          tempArr.push(
            {
              purchaseGeneralYarnId: this.selectConvent[i].id,
              yarnCode: this.selectConvent[i].yarnCode,
              yarnName: this.selectConvent[i].yarnName,
              yarnAttributes: this.selectConvent[i].yarnAttributes,
              purchaseAmount: this.selectConvent[i].fillStore
            }
          )
        }
        this.purchaseRes = tempArr
        this.$set(
          this.purchasePopOptions.content._purchaseDialogTable,
          'dataSource',
          this.purchaseRes
        )
      }
    },
    // 生成采购需求
    async purchaseSave(obj) {
      let flag = false
      for (let i = 0; i < this.purchaseRes.length; i++) {
        if (this.purchaseRes[i].purchaseAmount === '') {
          flag = true
        }
      }
      if (flag) {
        this.$message.warning('采购量不能为空')
        return
      }
      const params = {
        purchaseDelivery: obj.purchaseDelivery,
        detailReqs: this.purchaseRes
      }
      const res = await purchase(params)
      if (!res || res.code !== 200) {
        return false
      }
      this.$message.success('生成采购成功')
      this.$set(this.purchasePopOptions, 'visible', false)
    },
    // 勾选操作
    handleSelectionChange(val) {
      this.selectConvent = val
      console.log(val)
    },

    // 编辑弹框
    handleEdit(scope) {
      this.$set(this.storePopOptions, 'visible', true)
      this.$set(this.storePopOptions, 'formDatas', scope.row)
    },
    // 编辑安全库存
    async editData(obj) {
      const params = {
        id: obj.id,
        safetyStore: obj.safetyStore
      }
      const res = await generalYarnModify(params)
      if (!res || res.code !== 200) {
        return false
      }
      this.$message({
        message: '编辑成功',
        type: 'success'
      })
      this.initData()
      this.$set(this.storePopOptions, 'visible', false)
    },
    // 查看
    async getDetail(scope) {
      this.$set(this.detailPopOptions, 'visible', true)
      const res = await generalYarnStore({ yarnCode: scope.row.yarnCode })
      const dataSource = res.data ? res.data : []
      this.$set(
        this.detailPopOptions.content._detailDialogTable,
        'dataSource',
        dataSource
      )
      //  this.$set(this.popOptions, 'visible', !this.popOptions.visible)
    },
    PopDialogHandle(val) {
      this.$set(this.$refs.codePop.popOptions, 'visible', !this.$refs.codePop.popOptions.visible)
      if (val) {
        this.$set(this.$refs.codePop.popOptions, 'title', val)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.convent-yarn-container {
  position: relative;
  padding: 20px;
  padding-bottom: 0px;
  /deep/.el-dropdown{
      margin-right: 10px;
  }
    .conventDialog {
    /deep/.el-dialog {
      width: 1185px !important;
    }
  }
}
</style>
