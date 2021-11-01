<template>
  <div ref="productList" :class="isFixed?'product-list-ipad-fixed':'product-list-ipad'">
    <topNavBar v-if="isFixed" title="智布成品验布录入系统" :back-icon="true" />
    <div class="product-list-main-ipad">
      <!-- 搜索表单 -->
      <div class="search islayoutForm">
        <cs-custom-form ref="searchForm" :data-source="searchData" :options="formOtions" :form-datas="formDatas" />
      </div>
      <div class="tabchange">
        <el-button v-if="this.$permission(['qa:qaFinishFabricInspectionTask:assign'])&&activeName==='0'" size="small" type="primary" class="assing-btn" @click="assignClick">指派</el-button>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane v-for="(val,key) in statusArr" :key="key" :name="val.value">
            <span slot="label" :tabindex="val.value" class="labelIndex">{{ `${val.label}(${val.count || 0})` }}</span>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="page-table ipad-table">
        <!-- tab页签切换 -->
        <cs-custom-table
          tooltip-effect="dark"
          :columns="columns"
          :data-source="dataSource"
          :operates="popOperates"
          :pagination="pagination"
          :header-cell-style="headerCellStyle"
          :cell-style="{background:'#fff'}"
          :highlight-current-row="true"
          edit-type="pop"
          :row-key="(row)=>row.id"
          @row-click="rowClick"
        />
      </div>
    </div>
    <upinformation
      v-if="upconfig.visible"
      :upconfig="upconfig"
      @close="upconfig.visible = false"
      @okCallback="okCallback"
      @Cancelcallback="CancelText"
    />
  </div>
</template>
<script>
import upinformation from './components/pups.vue'
import logMethods from '@/views/product-center/mixin/log-methods.js'
import topNavBar from '../public/components/topNavBar.vue'
import * as api from './api/index.js'
export default {
  name: 'ColourClothList',
  components: { topNavBar, upinformation },
  mixins: [logMethods],
  data() {
    const headerCellStyle = { 'background': '#f5f7fa' }
    const searchStyle = { width: '25%' }
    const columns = {
      _dyelotNo: {
        prop: 'dyelotNo',
        label: '缸号',
        minWidth: '150',
        showOverflowTooltip: true,
        style: { color: '#1890ff', 'cursor': 'pointer' },
        handle: (scope) => {
          // this.$router.push(`/finished-ipad/finished-ipad-sub-list/${scope.row.id}?show=edit`)
          this.$router.push(`/finished-ipad/finished-ipad-sub-list/${scope.row.id}?show=query`) // 查看
        }
      },
      _productOrderNo: {
        prop: 'productOrderNo',
        label: '生产订单',
        minWidth: '140',
        showOverflowTooltip: true
      },
      _fabricType: {
        prop: 'fabricType',
        label: '布类',
        minWidth: '140',
        showOverflowTooltip: true
      },
      _productSize: {
        prop: 'productSize',
        label: '总匹/总重（投坯）',
        minWidth: '160',
        showOverflowTooltip: true,
        formater: (scope) => {
          const scopeRowData = scope.row.qaGreigeInspectionInfoResponse
          return (scopeRowData ? scopeRowData.schedulingVolumes + '/' + scopeRowData.schedulingQty : '')
        }
      },
      _composition: {
        prop: 'composition',
        label: '总匹/总重（成品）',
        minWidth: '160',
        showOverflowTooltip: true,
        formater: (scope) => {
          const scopeRowData = scope.row.qaGreigeInspectionInfoResponse
          return (scopeRowData ? scopeRowData.finishVolumes + '/' + scopeRowData.finishQty : '')
        }
      },
      _inspectionRate: {
        prop: 'inspectionRate',
        label: '检验率（%）',
        minWidth: '120',
        showOverflowTooltip: true
      },
      _fabricResult: {
        prop: 'fabricResult',
        label: '验布结果',
        minWidth: '100',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.fabricResult
        }
      },
      _status: {
        prop: 'status',
        label: '状态',
        minWidth: '140',
        showOverflowTooltip: true,
        isShow: false,
        formater: (scope) => {
          if (scope.row.status) {
            scope.row.status = scope.row.status + ''
            const obj = {
              '0': { text: '待处理', color: '#FF9214' },
              '1': { text: '处理中', color: '#FF9214' },
              '2': { text: '待审核', color: '#FF9214' },
              '3': { text: '已处理', color: '#00BCC5' },
              '4': { text: '已取消', color: '#888E9E' }
            }
            return `<span style="color:${obj[scope.row.status].color}">${obj[scope.row.status].text}</span>`
          } else {
            return ''
          }
        }
      }

    }
    // 搜索
    const searchData = [
      {
        prop: 'dyelotNo',
        label: '缸号:',
        placeholder: '请输入缸号',
        itemType: 'input',
        itemStyle: searchStyle
      },
      {
        prop: 'produceOrderCode',
        label: '生产订单:',
        placeholder: '请输入生产订单',
        itemType: 'input',
        itemStyle: searchStyle
      },
      {
        itemType: 'operate',
        submitText: '查询',
        submitHandle: (params) => {
          this.getPageData(params)
          this.formDatas = params
        },
        resetHandle: () => {
          const statusVal = this.formDatas.status
          this.formDatas = {
            status: statusVal
          }
        }
      }
    ]
    // 分页配置信息
    const pagination = {
      currentChange: (val) => {
        // 切换页数
        this.rowItem = null
        this.getPageData({
          pageSize: this.pagination.pageSize || 20,
          pageNum: val
        })
      },
      sizeChange: (val) => {
        // 切换条数
        this.rowItem = null
        // this.$set(this.pagination, 'currentPage', 1)
        this.getPageData({ pageSize: val, pageNum: this.pagination.page || 1 })
      }
    }
    // 表头操作栏里dataSource的配置信息
    let dataList = [
      {
        label: '编辑',
        permitTag: ['catalog:Api:Cloth:ClothProductFabricMain:update'],
        isShow: true,
        handle: async(params) => {
          this.$router.push(
            `/product-center/product-management/new-color-cloth/show/${params.row.id}?isEdit=true`
          )
        }
      },
      {
        label: '查看',
        permitTag: ['catalog:Api:Cloth:ClothProductFabricMain:show'],
        isShow: true,
        handle: async(params) => {
          this.$router.push(
            `/product-center/product-management/new-color-cloth/is-show/${params.row.id}`
          )
        }
      },
      {
        label: '删除',
        style: { color: '#FE4949' },
        permitTag: ['catalog:Api:Cloth:ClothProductFabricMain:destroy'],
        isShow: true,
        handle: async(params) => {
          const res = await this.$utils.confirmMsg()
          if (res) {
            console.log('确认删除')
          }
        }
      }
    ]
    dataList = this.$filterPermission(dataList)
    // 表头操作栏的配置信息
    const popOperates = {
      label: '操作',
      width: '150',
      fixed: 'right',
      isShow: false,
      dataSource: dataList
    }

    return {
      headerCellStyle,
      searchStyle,
      columns,
      searchData,
      pagination,
      dataList,
      popOperates,
      activeName: '0', // 单据状态 0：待处理，1：处理中，2：待审核，3：已处理，4：已取消
      isFixed: true,
      dataSource: [],
      formOtions: {
        inline: true,
        size: 'small'
        // labelWidth: '90px'
      },
      formDatas: {
        status: '0'
      },
      statusList: {
        '-1': { value: '-1', label: '全部', count: 0 },
        '0': { value: '0', label: '待处理', count: 0 },
        '1': { value: '1', label: '处理中', count: 0 },
        '2': { value: '2', label: '审核中', count: 0 },
        '3': { value: '3', label: '已处理', count: 0 }

      },
      countList: {},
      upconfig: {
        visible: false,
        workflowId: '',
        title: '指派',
        pass: (res) => {
          console.log('pass', res)
        },
        refuse: (res) => {
          console.log('refuse', res)
        },
        back: (res) => {
          console.log('回退回调')
        }
      },
      rowItem: null,
      isEdit: false

    }
  },
  computed: {
    statusArr() {
      const res = []
      for (const key in this.statusList) {
        res.push(this.statusList[key])
      }
      return res.sort((a, b) => { return a.value - b.value })
    }
  },
  created() {

  },
  mounted() {
    this.getPageData()
  },
  methods: {
    // 点击行
    rowClick(row) {
      this.rowItem = row
    },
    // 点击确定按钮
    async okCallback(data) {
      const res = await api.assignTask({
        id: this.rowItem.id,
        userId: data.text.userId || '',
        userName: data.text.realName || ''
      })
      if (res.code === 200) {
        this.$message.success('指派成功')
        this.upconfig.visible = false
      }
    },
    // 指派
    assignClick(data = {}) {
      if (this.rowItem) {
        this.upconfig.visible = true
      } else {
        this.$message.error('请选中指派数据')
      }
    },
    // 关闭弹框
    CancelText(val) {
      this.upconfig.visible = false
    },
    // 获取列表
    async getPageData(data = {}) {
      this.dataSource = []
      if (this.formDatas.status === '-1') {
        this.formDatas.status = ''
      }
      const res = await api.pageList({ ...this.formDatas, ...data })
      const listData = res.data && res.data.list ? res.data.list : []
      listData.map((item, index) => { item.code = (res.data.pageNum - 1) * res.data.pageSize + index + 1 })
      this.dataSource = listData || []
      this.pagination = {
        ...this.pagination,
        dataTotal: res.data.total,
        ...data,
        currentPage: res.data.pageNum,
        pageSize: res.data.pageSize,
        page: res.data.pageNum
      }
      this.getPageCount()
    },
    async getPageCount() {
      // 分页查询数量统计
      const submitData = JSON.parse(JSON.stringify(this.formDatas))
      delete submitData.status
      const res = await api.pageCount(submitData)
      const countList = res.data || []
      for (const i in this.statusList) {
        this.statusList[i].count = 0
        countList.forEach(item => {
          if (i === String(item.status)) {
            this.statusList[item.status].count = item.num
          }
        })
      }
    },
    // 点击tab切换事件
    handleClick(e) {
      this.rowItem = null
      this.formDatas.status = e.name
      this.activeName = e.name
      this.$set(this.columns._status, 'isShow', e.name === '-1')
      this.getPageData()
    }
  }
}
</script>

<style lang="scss" scoped>
  .tabchange{
    background-color: #FFFFFF;
    position: relative;
    .labelIndex{
      padding: 0 10px;
      border: 0 none;
      outline: none;
    }
    /deep/ .el-tabs__header {
      margin-bottom: 0;
    }
    /deep/ .el-tabs__item{
      height: 57px;
      line-height: 57px;
      padding: 0 10px !important;
    }
    /deep/ .el-tabs__active-bar{
      height: 3px;
    }
    /deep/ .el-tabs__nav-wrap::after{
      height: 1px;
      z-index: 8;
    }
    .assing-btn{
      position: absolute;
      right: 10px;
      top: 10px;
      z-index: 1;
    }
  }
  .product-list-ipad{
    padding: 20px;
  }
  .product-list-ipad-fixed{
    width: 100%;
    height: 100%;
    background-color: #eef5f9;
    box-sizing: border-box;
    overflow: hidden;
    .product-list-main-ipad{
      padding: 20px;
      box-sizing: border-box;
      height: calc(100% - 50px);
      overflow: hidden;
      overflow-y: auto;
    }
    .page-table{
      height: auto;
    }
    .ipad-table{
      /deep/ .el-table{
        font-size: 16px;
      }
      /deep/ .el-table__body tr.current-row > td{
        background-color: #f5f7fa !important;
      }
      /deep/  .el-table tr{
        border-bottom: 1px solid #CCCCCC;
      }
      /deep/  .el-table__row td {
        border-bottom: 1px solid #dfe6ec !important;

      }
    }
  }

</style>
