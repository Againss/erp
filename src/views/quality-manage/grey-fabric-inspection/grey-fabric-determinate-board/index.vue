<template>
  <div class="grey-fabric-determinate-board">
    <!-- 搜索表单 -->
    <div class="search">
      <cs-custom-form ref="searchForm" :data-source="searchData" :options="formOtions" />
    </div>
    <!-- tab切换 -->
    <div class="tab-group">
      <el-tabs v-model="activeName" class="commonTabs" @tab-click="handleClick">
        <el-tab-pane
          v-for="(item, i) in statusArr"
          :key="i"
          :name="item.value"
          lazy
        >
          <span slot="label" :tabIndex="item.value" class="labelIndex">{{ `${item.label}(${item.count || '0'})` }}</span>
        </el-tab-pane>
      </el-tabs>
      <el-button v-if="activeName === '0' && $permission(['qa:qaGreigeSwatchesTask:preparePublish'])" class="right-button" type="primary" size="small" style="margin-left: auto;" @click="publishTask">发布任务</el-button>
    </div>
    <!-- 列表 -->
    <div class="page-table">
      <cs-custom-table
        tooltip-effect="dark"
        :columns="columns"
        :table-scrollx="true"
        :data-source="dataSource"
        :operates="showPopOperates"
        :pagination="pagination"
        edit-type="pop"
        @selection-change="handleSelectionChange"
      />
    </div>
    <!-- 发布任务pop弹出框 -->
    <div class="pop">
      <cs-custom-pop ref="popOptions" :options="popOptions" />
    </div>
  </div>
</template>

<script>
import addLine from './components/addLine.vue'
import { determinateBoardPage } from './components/index.js'
export default {
  mixins: [determinateBoardPage],
  data() {
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    const commonChangeReg = this.$getRules({})
    // 查询
    const searchData = [
      {
        prop: 'knitOrderNo',
        itemType: 'input',
        label: '织订单',
        clearable: true,
        placeholder: '请输入内容'
      },
      {
        prop: 'fabricType',
        itemType: 'input',
        label: '布类',
        clearable: true,
        placeholder: '请输入内容'

      },
      {
        prop: 'factoryName',
        itemType: 'input',
        label: '织厂',
        clearable: true,
        placeholder: '请输入内容'
      },
      {
        itemType: 'operate',
        submitText: '查询',
        submitHandle: params => {
          this.searchFormDatas = params
          this.qaGreySwatchesTaskPage()
          this.getListCount()
        },
        resetHandle: () => {
          this.searchFormDatas = {}
          // this.formDatas = {}
          // this.formDatas.sorts = []// 自定义表格内排序
          // this.formDatas.status = this.activeName// 自定义表格内排序
          // this.$refs.tableList.$refs.table.clearSort()
        }
      }
    ]
    // 表格表头
    const columns = {
      '_select': {
        prop: 'select',
        type: 'selection',
        width: '42',
        isShow: scope => {
          return this.activeName === '0'
        }
      },
      '_id': {
        prop: 'id',
        label: '序号',
        width: '50',
        formater: (scope) => {
          return this.pagination.currentPage && (this.pagination.currentPage - 1) * this.pagination.pageSize + scope.$index + 1
        }
      },
      '_taskNo': {
        prop: 'taskNo',
        label: '任务编码',
        minWidth: '125',
        isShow: scope => {
          return this.activeName !== '0'
        },
        handle: scope => {
          this.$router.push({ name: 'grey-fabric-determinate-board-detail', query: { id: scope.row.id, type: 'detail' }})
        },
        style: {
          color: '#1890ff',
          cursor: 'pointer'
        },
        showOverflowTooltip: true
      },
      '_knitOrderNo': {
        prop: 'knitOrderNo',
        label: '织订单',
        // minWidth: '156',
        width: '165',
        showOverflowTooltip: true
      },
      '_factoryName': {
        prop: 'factoryName',
        label: '织厂',
        minWidth: '140',
        showOverflowTooltip: true
      },
      '_machineNo': {
        prop: 'machineNo',
        label: '织机号',
        minWidth: '140',
        showOverflowTooltip: true
      },
      '_swatchesNumber': {
        prop: 'swatchesNumber',
        label: '确板次数',
        minWidth: '140',
        isShow: scope => {
          return this.activeName !== '0'
        },
        formater: scope => {
          return `第${+scope.row.swatchesNumber + 1}次`
        },
        showOverflowTooltip: true
      },
      '_swatchesResult': {
        prop: 'swatchesResult',
        label: '确板结果',
        minWidth: '80',
        isShow: scope => {
          return ['3', '-1', '4'].includes(this.activeName)
        },
        formater: scope => {
          const obj = {
            1: '通过',
            2: '不通过',
            3: '递交工艺员'
          }
          return scope.row.swatchesResult ? obj[scope.row.swatchesResult] : '-'
        },
        showOverflowTooltip: true
      },
      '_swatchesUserComments': {
        prop: 'swatchesUserComments',
        label: '确板意见',
        minWidth: '140',
        isShow: scope => {
          return ['3', '-1', '4'].includes(this.activeName)
        },
        showOverflowTooltip: true
      },
      '_fabricType': {
        prop: 'fabricType',
        label: '布类',
        minWidth: '140',
        // formater: (scope) => {
        //   return scope.row.ingredientsProportion
        // },
        showOverflowTooltip: true
      },
      '_yarnName': {
        prop: 'yarnName',
        label: '纱线名称',
        minWidth: '140',
        showOverflowTooltip: true
      },
      '_productSize': {
        prop: 'productSize',
        label: '成品规格',
        minWidth: '80',
        showOverflowTooltip: true
      },
      '_reviewTime': {
        prop: 'reviewTime',
        label: '审核时间',
        minWidth: '160',
        sortable: true,
        formater: scope => {
          return scope.row[scope.column.property] ? this.$filters.parseTime(scope.row[scope.column.property] + '', '{y}-{m}-{d} {h}:{i}') : ''
        },
        isShow: scope => {
          return this.activeName === '0'
        },
        showOverflowTooltip: true
      },
      '_createName': {
        prop: 'createName',
        label: '创建人',
        minWidth: '100',
        isShow: scope => {
          return ['1', '2', '3', '-1'].includes(this.activeName)
        },
        showOverflowTooltip: true
      },
      '_createdTime': {
        prop: 'createdTime',
        label: '创建时间',
        width: '160',
        sortable: true,
        formater: scope => {
          return scope.row[scope.column.property] ? this.$filters.parseTime(scope.row[scope.column.property] + '', '{y}-{m}-{d} {h}:{i}') : ''
        },
        isShow: scope => {
          return ['1', '2', '3', '-1'].includes(this.activeName)
        },
        showOverflowTooltip: true
      },
      '_swatchesUserName': {
        prop: 'swatchesUserName',
        label: '确板员',
        minWidth: '100',
        isShow: scope => {
          return ['1', '2', '3', '-1'].includes(this.activeName)
        },
        showOverflowTooltip: true
      },
      '_swatchesUserHandledTime': {
        prop: 'swatchesUserHandledTime',
        label: '确板时间',
        minWidth: '160',
        sortable: true,
        formater: scope => {
          return scope.row[scope.column.property] ? this.$filters.parseTime(scope.row[scope.column.property] + '', '{y}-{m}-{d} {h}:{i}') : ''
        },
        isShow: scope => {
          return ['1', '2', '3', '-1'].includes(this.activeName)
        },
        showOverflowTooltip: true
      },
      '_processUserName': {
        prop: 'processUserName',
        label: '工艺员',
        minWidth: '70',
        isShow: scope => {
          return ['1', '2', '3', '-1'].includes(this.activeName)
        },
        showOverflowTooltip: true
      },
      '_processUserHandledTime': {
        prop: 'processUserHandledTime',
        label: '处理时间',
        minWidth: '160',
        sortable: true,
        formater: scope => {
          return scope.row[scope.column.property] ? this.$filters.parseTime(scope.row[scope.column.property] + '', '{y}-{m}-{d} {h}:{i}') : ''
        },
        isShow: scope => {
          return ['1', '2', '3', '-1'].includes(this.activeName)
        },
        showOverflowTooltip: true
      },
      '_cancelUserName': {
        prop: 'cancelUserName',
        label: '取消人',
        minWidth: '100',
        isShow: scope => {
          return this.activeName === '4'
        },
        showOverflowTooltip: true
      },
      '_cancelTime': {
        prop: 'cancelTime',
        label: '取消时间',
        width: '160',
        sortable: true,
        formater: scope => {
          return scope.row[scope.column.property] ? this.$filters.parseTime(scope.row[scope.column.property] + '', '{y}-{m}-{d} {h}:{i}') : ''
        },
        isShow: scope => {
          return this.activeName === '4'
        },
        showOverflowTooltip: true
      },
      '_status': {
        prop: 'status',
        label: '状态',
        width: '100',
        fixed: 'right',
        isShow: scope => {
          return this.activeName !== '0'
        },
        formater: scope => {
          const oneObj = this.statusArr.filter(item => +item.value === +scope.row[scope.column.property])[0]
          return `<span style="color:${oneObj.color}">${oneObj.label}</span>`
        },
        showOverflowTooltip: true
      }
    }
    // 分页
    const pagination = {
      currentChange: val => {
        console.log('current', val)
        this.qaGreySwatchesTaskPage({ pageSize: this.pagination.pageSize || 20, pageNum: val })
      },
      sizeChange: val => {
        console.log('size', val)
        this.$set(this.pagination, 'currentPage', 1)
        this.qaGreySwatchesTaskPage({ pageNum: 1, pageSize: val })
      }
    }
    // 操作数据
    let popOperatesDataSource = [
      {
        label: '编辑',
        // style: { 'color': '#FE4949' },
        // permitTag: ['baseData:qa:pysicalSurveyConfig:delete', 'baseData:qa:executivsStandardConfig:delete'],
        isShow: (scope) => {
          return true
        },
        handle: params => {
          this.$router.push({ name: 'grey-fabric-determinate-board-detail', query: { id: params.row.id, type: 'edit' }})
        }
      }
    ]
    // 权限过滤
    popOperatesDataSource = this.$filterPermission(popOperatesDataSource)
    // 操作
    const popOperates = {
      label: '操作',
      width: '60',
      fixed: 'right',
      // moreOptions: {
      //   maxLength: 2// 最大超过多少个显示more功能，默认为2
      // },
      dataSource: popOperatesDataSource
    }

    // 发布任务弹出框content配置
    const popOptionsColumnsInfos = {
      '_knitOrderNo': {
        prop: 'knitOrderNo',
        label: '织单号',
        className: 'redStar inputBottom',
        minWidth: '120',
        showOverflowTooltip: true,
        formater: scope => {
          return scope.row.knitOrderNo
        },
        editOptions: {
          labelWidth: '0',
          itemType: 'select',
          dataSource: [],
          clearable: true,
          filterable: true,
          change: (value, form, formDatas, setFormDatas, scope) => {
            console.log(scope)
            this.getPublishedMachineNoByKnitOrderNo({ knitOrderNo: value, factoryId: formDatas.factoryId, index: scope.$index, formDatas })
          },
          rules: [commonChangeReg]
          // placeholder: '请输入 0~99999.99',
          // maxlength: '20'
          // rules: [numberReg, commonBlurReg]
        }
      },
      '_machineNo': {
        prop: 'machineNo',
        label: '织机号(待发布)',
        minWidth: '120',
        className: 'redStar inputBottom',
        editOptions: {
          labelWidth: '0',
          itemType: 'input',
          placeholder: '请输入',
          maxlength: '20',
          rules: [commonBlurReg]
        }
      },
      '_publishedMachineNo': {
        prop: 'publishedMachineNo',
        label: '织机号(已发布)',
        minWidth: '120',
        showOverflowTooltip: true
      }
    }
    const popOptionsOperates = {
      label: '操作',
      width: '60',
      // fixed: 'right',
      // moreOptions: {
      //   maxLength: 2// 最大超过多少个显示more功能，默认为2
      // },
      dataSource: [
        {
          label: '删除',
          style: { 'color': '#FE4949' },
          isShow: scope => true,
          handle: (params, form, formDatas, setFormDatas) => {
            console.log(params, form, formDatas, setFormDatas)
            const dataList = [...formDatas.knitOrders]
            dataList.splice(params.$index, 1)
            setFormDatas({ knitOrders: dataList })
          }
        }
      ]
    }
    // 发布任务弹出框
    const popOptions = {
      itemType: 'drawer',
      visible: false,
      title: '发布任务',
      customClass: 'popOptionsClass',
      size: '40%',
      ok: params => {
        console.log(params)
        if (params.knitOrders && params.knitOrders.length !== 0) {
          const swatchesUserId = params.swatchesUsers.value || ''
          const swatchesUserName = params.swatchesUsers.label || ''
          this.publishTaskSave({ ...params, swatchesUserId, swatchesUserName })
        } else {
          this.$message.warning('请新增一条记录')
        }

        // this.publishTaskSave(params)
      },
      okText: '保存',
      cancel: params => {
        this.popOptions.visible = false
      },
      formDatas: {},
      formOptions: {
        size: 'small',
        popError: true
      },
      content: {
        '_factoryName': {
          prop: 'factoryName',
          itemType: 'itemview',
          label: '织厂:'
        },
        '_swatchesUsers': {
          prop: 'swatchesUsers',
          itemType: 'select',
          valueType: 'object',
          clearable: true,
          filterable: true,
          label: '确板员',
          rules: [commonChangeReg],
          dataSource: []
        },
        _knitOrders: {
          prop: 'knitOrders',
          headerCellStyle: { 'background-color': '#F5F7FA' },
          className: 'pop-table border-frame',
          itemType: 'table-form',
          label: '',
          labelWidth: '0',
          dataSource: [
            // { yarnFineness: 'yyy', elementName: 'zzz', yarnRatio: 'ccc', yarnRatioEdit: false, edit: true },
            // { yarnFineness: 'yyy', elementName: 'zzz', yarnRatio: 'ccc', yarnRatioEdit: true, edit: true },
            // {}
          ],
          columns: popOptionsColumnsInfos,
          operates: popOptionsOperates,
          tooltipEffect: 'dark'
        },
        '_addLine': {
          prop: 'addLine',
          components: { addLine },
          componentsOptions: {
            addLineClick: (scope, form, formDatas, setFormDatas) => {
              console.log(scope, formDatas)
              const dataList = [...formDatas.knitOrders]
              const obj = {
                edit: true,
                knitCodeEdit: true,
                machineCodeEdit: true
                // knitOrderNo: ''
              }
              dataList.push(obj)
              setFormDatas({ knitOrders: dataList })
              // const tempObj = { knitCodeEdit: true, }
            }
          }
          // itemType: 'itemview',
          // label: '确板员'
        }
      }
    }
    return {
      searchData,
      formOtions: {
        size: 'small',
        inline: true
      },
      searchFormDatas: {},
      activeName: '0',
      statusArr: [
        { value: '-1', label: '全部', color: '#00BCC5', count: 0 },
        { value: '0', label: '待处理', color: '#FF9214', count: 0 },
        { value: '1', label: '处理中', color: '#FF9214', count: 0 },
        { value: '2', label: '待审核', color: '#FF9214', count: 0 },
        { value: '3', label: '已处理', color: '#00BCC5', count: 0 },
        { value: '4', label: '已取消', color: '#888E9E', count: 0 }
      ],

      columns,
      dataSource: [
        // { id: 1, factoryName: '111', knitCode: '11', machineCode: '#1' }
      ],
      popOperates,
      showPopOperates: null,
      pagination,

      purchaseRequireIds: [],

      popOptionsColumnsInfos,
      popOptions,

      ordersList: []
    }
  },
  watch: {
    $route: {
      async handler(v) {
        if (v.query.status) {
          this.activeName = v.query.status + ''
        }
        this.qaGreySwatchesTaskPage()
        this.getListCount()
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    // this.qaGreySwatchesTaskPage()
    // this.getListCount()
  },
  methods: {
    // tab切换事件
    handleClick() {
      console.log(this.activeName)
      // if (['1', '2'].includes(this.activeName)) {
      //   this.showPopOperates = this.popOperates
      // } else {
      //   this.showPopOperates = null
      // }
      this.qaGreySwatchesTaskPage()
      this.getListCount()
    },
    // 发布任务点击事件
    publishTask() {
      // console.log('发布任务')
      const purchaseRequireIds = this.purchaseRequireIds
      if (purchaseRequireIds.length === 0) this.$message.warning('请选择任务')
      else {
        console.log(purchaseRequireIds)
        console.log('选择了任务')
        const factoryId = purchaseRequireIds[0].id
        const factoryName = purchaseRequireIds[0].name
        const idFlag = purchaseRequireIds.some(item => {
          return factoryId !== item.id
        })
        if (idFlag) {
          this.$message.warning('请选择相同的织厂')
          return
        }
        const knitOrders = purchaseRequireIds.map(item => {
          return {
            knitOrderNo: item.knitOrderNo
          }
        })

        this.popOptions.visible = true

        this.taskPreparePublish({ knitOrders, factoryId, factoryName })
      }
    },
    handleSelectionChange(val) {
      console.log(val)
      if (val && val.length) {
        this.purchaseRequireIds = val.map(item => {
          return {
            name: item.factoryName,
            id: item.factoryId,
            knitOrderNo: item.knitOrderNo
          }
        })
      } else {
        this.purchaseRequireIds = []
      }
    }
  }
}
</script>

<style lang='scss'>
  .grey-fabric-determinate-board {
    padding: 20px;

    .tab-group {
      position: relative;
      // padding-bottom: 1px;

      .right-button {
        position: absolute;
        right: 20px;
        top: 13px;
      }
    }
    .commonTabs {
      background-color: #fff;
      padding: 20px 0 1px;
      .el-tabs__nav-scroll {
        padding: 0 20px;
      }
      .el-tabs__item {
        line-height: 20px;
        font-size: 14px;
      }
      .el-tabs__nav-wrap::after {
        height: 1px;
      }
      .el-tabs__header {
        margin-bottom: 0;
      }
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
    .inputBottom {
      .el-form-item--small {
        margin-bottom: 0;
      }
    }
    .labelIndex{
      padding: 0 10px;
      border: 0 none;
      outline: none;
    }
  }

</style>
