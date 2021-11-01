<template>
  <div class="plan-arrange">
    <!-- 搜索表单 -->
    <div class="search">
      <cs-custom-form
        v-show="activeName==='0'"
        :data-source="searchData"
        :options="formOtions"
        :form-datas="formDatas"
      />
      <cs-custom-form
        v-show="activeName==='1'||activeName==='2'"
        :data-source="changedSearchData"
        :options="formOtions"
        :form-datas="formDatas"
      />
      <!-- <cs-custom-form
        v-show="activeName==='2'"
        :data-source="changedSearchData"
        :options="formOtions"
        :form-datas="formDatas"
      /> -->
    </div>
    <!-- tab切换 -->
    <div class="list-tabs" style="position: relative;">
      <div v-if="showRight" class="tab-right-bnt" style="position: absolute;right: 30px;">
        <el-button v-if="$permission(['aps:planSchedule:getPlan'])" size="small" @click="getScheduling">获取排期</el-button>
        <el-button v-if="$permission(['aps-center:planSchedule:modifySendYarnDate'])" size="small" @click="targetClick({ text: '发送纱期', prop: 'deliveryConfirm1', type: '_input' })">发送纱期</el-button>
      </div>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane style="font-weight: bold;" :label="`待复期`" name="0" />
        <el-tab-pane style="font-weight: bold;" :label="`已复期`" name="1" />
        <el-tab-pane style="font-weight: bold;" :label="`已下发`" name="2" />
      </el-tabs>
      <div v-show="activeName==='1'" class="waiting-bnt">
        <el-button v-if="$permission(['aps-center:planSchedule:send'])" size="small" @click="issueSelectData('planScheduleSend')">下发所选</el-button>
        <el-button v-if="$permission(['aps-center:planSchedule:cancelDeliveried'])" size="small" @click="issueSelectData('cancelDeliveried')">取消已复期</el-button>
        <!-- <el-button size="small" type="primary">保存</el-button> -->
      </div>

    </div>

    <div class="main-cont">
      <!-- 列表 -->
      <div class="page-table" :class="{'table-list':showRight,'table-left-list':showLeft}">
        <!-- 待复期 -->
        <div v-show="activeName==='0'">
          <cs-custom-table
            table-scrollx
            :header-cell-style="headerCellStyle"
            :cell-style="{background:'#fff'}"
            :highlight-current-row="true"
            tooltip-effect="dark"
            :columns="waitingColumns"
            :data-source="unrepeatDataSource"
            :pagination="pagination"
            edit-type="pop"
            :row-key="(row)=>row.id"
            :current-row-key="currentId"
            @sort-change="changeSort"
            @row-click="rowclick"
          />

        </div>
        <!-- 已复期 -->
        <div v-show="activeName==='1'">
          <cs-custom-table
            ref="customTable"
            table-scrollx
            :cell-style="{background:'#fff'}"
            :header-cell-style="headerCellStyle"
            tooltip-effect="dark"
            :columns="changedColumns"
            :data-source="dataSource"
            :pagination="changedPagination"
            :selection="selection"
            edit-type="pop"
            :row-key="(row)=>row.id"
            @sort-change="changeSort"
            @selection-change="handleSelectionChange"
          />
        </div>

        <!-- 已下发 -->
        <div v-show="activeName==='2'">
          <cs-custom-table
            ref="customTable"
            table-scrollx
            :cell-style="{background:'#fff'}"
            :header-cell-style="headerCellStyle"
            tooltip-effect="dark"
            :columns="changedColumns"
            :data-source="dataSource"
            :pagination="changedPagination"
            edit-type="pop"
            :row-key="(row)=>row.id"
            @sort-change="changeSort"
          />
        </div>

      </div>
      <!-- 右边详情 -->
      <div class="detail-left-wrap" :class="{'detail-left':showRight,'detail-all-left':showLeft}">
        <div class="detail-bnt">

          <div v-for="(item,index) in staticFile.btnList" :key="index" style="margin-right: 10px;">
            <el-button v-if="$permission([item.permission])" size="small" @click="targetClick(item)"> {{ item.text }}</el-button>
          </div>

          <!-- 大屏幕适配 -->
          <template v-if="screenWidth>1500">
            <el-button v-if="$permission(['aps-center:planSchedule:modifyWaitingReason'])" size="small" @click="targetClick({ text: '待排原因', prop: 'waitingReason', type: '_input' })">待排原因</el-button>
            <el-button v-if="$permission(['aps-center:planSchedule:modifyplanRemark'])" size="small" @click="targetClick({ text: '计划备注', prop: 'planRemark', type: '_input' })">计划备注</el-button>
          </template>

          <!-- 小屏幕适配 -->
          <el-dropdown v-else style="margin-left: 0px;" @command="handleCommand">
            <el-button v-if="$permission(['aps-center:planSchedule:modifyWaitingReason'])" style="height:32px;" size="small">待排原因<i class="el-icon-arrow-down el-icon--right" /></el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-if="$permission(['aps-center:planSchedule:modifyWaitingReason'])" command="0">待排原因</el-dropdown-item>
              <el-dropdown-item v-if="$permission(['aps-center:planSchedule:modifyplanRemark'])" command="1">计划备注</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <span class="countAmount"><label>数量：</label>{{ countAmount }} <span>kg</span></span>
          <!-- 勾选显示的字段 -->
          <el-popover
            v-model="popoverVisible"
            placement="bottom-start"
            width="545"
            height="450"
            trigger="click"
            popper-class="a-popover"
            style="margin-left: auto;"
          >
            <div class="checkbox-wrap">
              <div class="checkbox-title">勾选显示的字段</div>
              <!-- <el-checkbox-group v-model="checkData" style="height: 300px;overflow-y: auto;padding: 15px;">
                <el-checkbox v-for="(item,index) in staticFile.tabProp" :key="index" :label="item.name" style="width: 165px;margin-bottom: 5px;margin-right: 0px;" />
              </el-checkbox-group> -->
              <div class="top-content">
                <div class="title">上区</div>
                <el-checkbox-group v-model="topCheckData" style="overflow-y: auto;padding: 15px;">
                  <el-checkbox v-for="(item,index) in staticFile.tabPropTop" :key="index" :label="item.name" style="width: 165px;margin-bottom: 5px;margin-right: 0px;" />
                </el-checkbox-group>
              </div>
              <div class="bottom-content">
                <div class="title">下区</div>
                <el-checkbox-group v-model="bottomCheckData" style="overflow-y: auto;padding: 15px;">
                  <el-checkbox v-for="(item,index) in staticFile.tabPropBottom" :key="index" :label="item.name" style="width: 165px;margin-bottom: 5px;margin-right: 0px;" />
                </el-checkbox-group>
              </div>
              <div class="btn-wrap">
                <el-button size="mini" style="width:88px" type="primary" @click.stop="checkClick">保存</el-button>
                <el-button size="mini" style="width:88px" @click.stop="popoverVisible=false">取消</el-button>
              </div>
            </div>

            <i slot="reference" class="el-icon-setting icon-setting" />
          </el-popover>

        </div>
        <!-- 右侧列表 -->
        <div v-if="showRight" class="close-right" @click="closeRight">
          <i class="el-icon-arrow-right" />
        </div>
        <div class="close-left" @click="closeLeft">
          <i v-if="!showLeft" class="el-icon-arrow-left" />
          <i v-else class="el-icon-arrow-right" />
        </div>
        <!-- <div ref="detailTable" class="detail-table ">
          <cs-custom-table
            table-scrollx
            :height="getTableHeight"
            :cell-style="{background:'#fff'}"
            :header-cell-style="headerCellStyle"
            tooltip-effect="dark"
            :selection="selection"
            :columns="detailColumns"
            :data-source="detailDataSource"
            edit-type="pop"
            @sort-change="changeSort"
            @selection-change="selectionChange"
          />

        </div> -->
        <div ref="detailTable" class="detail-table ">
          <cs-custom-table
            ref="multipleTable1"
            :height="getTableHeight"
            :cell-style="{background:'#fff'}"
            :header-cell-style="headerCellStyle"
            tooltip-effect="dark"
            :row-class-name="tableRowClassName"
            :selection="selection"
            :columns="topDetailColumns"
            :data-source="detailDataSource"
            edit-type="pop"
            @sort-change="changeDetailSort"
            @selection-change="selectionChange"
            @row-click="detailRowclick"
          />

        </div>
        <div ref="detailTable2" class="detail-table detailTable2 ">
          <cs-custom-table
            ref="multipleTable2"
            :height="getTableHeight2"
            :cell-style="{background:'#fff'}"
            :header-cell-style="headerCellStyle"
            tooltip-effect="dark"
            :row-class-name="tableRowClassName"
            :selection="selection"
            :columns="bottomDetailColumns"
            :data-source="detailDataSource"
            edit-type="pop"
            @row-click="detailRowclick"
            @selection-change="selectionChange1"
          />

        </div>
      </div>
    </div>
    <div class="pop">
      <cs-custom-pop :options="productPopOptions" />
    </div>

  </div>
</template>

<script>
import { fetchLog } from '@/views/plan-manage/public/common/fetchLog'
import { pageList, getSuBpageList, updateDetail, deliveryConfirm, sendYarnDate, getPlanSchedule } from './api/index.js'
import { waiting } from './components/waiting.js'
import { changed } from './components/changed.js'
import staticFile from './components/staticFile.js'
export default {
  mixins: [waiting, changed, fetchLog],
  data() {
    const commonChangeReg = this.$getRules({})
    // 选择客户弹出框
    const productPopOptions = {
      itemType: 'dialog',
      visible: false,
      title: '',
      width: '537px',
      ok: async params => {
        console.log(params)
        if (params.date || params.input || params.select) {
          const date = params.date ? new Date(params.date).getTime() : ''
          const ids = []
          this.selectionArr.length > 0 ? this.selectionArr.forEach(v => {
            ids.push(v.id)
          }) : []
          this.updateDetailFn({ [this.selectionItem]: date || params.input || params.select, apsPlanScheduleDetailIds: ids })
          this.$set(this.productPopOptions, 'visible', false)
        } else {
          return this.$message.error('请填写提交内容')
        }
      },
      cancel: params => {
        this.$set(this.productPopOptions, 'visible', false)
      },
      close: () => {
        this.$set(this.productPopOptions, 'visible', false)
      },
      formDatas: {},
      formOptions: {
        size: 'small'
      },
      content: {
        _date: {
          prop: 'date',
          label: '试纱期',
          itemType: 'date',
          type: 'date',
          format: 'yyyy-MM-dd',
          clearable: true,
          isShow: false,
          placeholder: '请选择日期',
          rules: [commonChangeReg]
        },
        _input: {
          prop: 'input',
          label: '试纱期',
          itemType: 'input',
          type: 'textarea',
          clearable: true,
          isShow: true,
          maxlength: '200',
          rules: [commonChangeReg]
        },
        _select: {
          prop: 'select',
          itemType: 'select',
          label: '交期确认:',
          placeholder: '请选择交期确认',
          isShow: false,
          rules: [commonChangeReg],
          dataSource: [
            {
              label: 'Y',
              value: 'Y'
            }, {
              label: 'N',
              value: 'N'
            }
          ]
        }

      }
    }
    const headerCellStyle = {
      'background': '#F5F7FA'
    }
    return {
      commonChangeReg,
      staticFile,
      showRight: false,
      showLeft: false,
      popoverVisible: false,
      productPopOptions,
      detailTableHeight: '0',
      columnId: '',
      currentId: '', // 高亮当前行
      optionStatus: '',
      headerCellStyle,
      formOtions: {
        labelWidth: '90px',
        size: 'small',
        inline: true,
        layout: true
      },
      searchFormDatas: {},
      formDatas: {
        tabType: '0'// 也签(0:待复期 1:已复期 2:下发)
      },
      activeName: '0',
      allColumns: [],
      dataSource: [],
      unrepeatDataSource: [], // 待复期DataSource
      detailDataSource: [], // 待复期分录
      userData: [],
      screenWidth: 0,
      countAmount: 0,
      checkData: ['订单号', '交期', '产品编码', '数量KG', '布类', '纱名', '纱属性', '成份比例', '成衣部位', '款号', '幅宽', '克重', '客户颜色',
        '颜色分类', '生产流程', '工艺要求', '理论纱期', '目标纱期', '采购复期', '纱期送审', '理论色纱期_S', '理论色纱期_E', '理论坯期_S', '理论坯期_E',
        '理论色布期_S', '理论色布期_E', '计划结束色纱期', '计划结束坯期', '计划结束印花布期', '计划复期', '交期确认', '急单', '区域', '销售员', '计划备注'
      ],
      selectionArr: [], // 分录勾选
      selectionItem: '',
      topCheckData: ['序号', '订单号', '交期', '成衣ID', '成衣部位', '数量kg', '生产流程', '目标纱期', '采购复期', '计划结束色纱期', '计划结束坯期', '计划结束色布期', '计划结束印花布期',
        '计划复期', '客户', '客服', '', '客户颜色', '色级', '布类', '纱名', '纱属性', '成份比例', '产品编码', '工艺要求', '交期确认'],
      bottomCheckData: ['序号', '幅宽', '克重', '款号', '区域', '销售员', '急单', '计划备注', '纱期送审', '针数', '寸数', '总针数', '智布色号', '理论纱期', '理论色纱期_S', '理论色纱期_E', '理论坯期_S', '理论坯期_E', '理论色布期_S', '理论色布期_E', '理论印花布期_S', '理论印花布期_E',
        '计划开始色纱期', '计划开始坯期', '计划开始色布期', '计划开始印花布期']

    }
  },
  computed: {
    getTableHeight() {
      return this.detailTableHeight
    },
    getTableHeight2() {
      return this.detailTableHeight2
    }
  },
  created() {
    // 待复期 列表数据
    this.getUnrepeatList()
    // this.getPageList()//已复期、下发
    this.screenWidth = document.body.clientWidth
    // this.checkData = localStorage.getItem('planCheckData') ? JSON.parse(localStorage.getItem('planCheckData')) : this.checkData
    this.topCheckData = localStorage.getItem('planCheckDataTop') ? JSON.parse(localStorage.getItem('planCheckDataTop')) : this.topCheckData
    this.bottomCheckData = localStorage.getItem('planCheckDataBottom') ? JSON.parse(localStorage.getItem('planCheckDataBottom')) : this.bottomCheckData
  },
  mounted() {
    // 动态获取dom高度

    this.initScreenWidth()
    this.handlePlanCheckData()
  },
  methods: {
    // 初始化屏幕宽度
    initScreenWidth() {
      const _this = this
      window.onresize = () => {
        return (() => {
          window.screenWidth = document.body.clientWidth
          this.screenWidth = window.screenWidth
          if (this.showRight) {
            this.$nextTick(() => {
              this.detailTableHeight = _this.$refs.detailTable ? _this.$refs.detailTable.offsetHeight + '' : ''
              this.detailTableHeight2 = _this.$refs.detailTable2 ? _this.$refs.detailTable2.offsetHeight + '' : ''
            })
          }
        })()
      }
    },

    // 点击整行查看详情信息
    rowclick(scope) {
      this.showRight = true
      this.currentId = scope.id
      const _this = this
      this.suBpageList({ id: scope.id })
      if (this.showRight) {
        this.$nextTick(() => {
          this.initScreenWidth()
          this.detailTableHeight = _this.$refs.detailTable ? _this.$refs.detailTable.offsetHeight + '' : ''
          this.detailTableHeight2 = _this.$refs.detailTable2 ? _this.$refs.detailTable2.offsetHeight + '' : ''
        })
      }
    },
    // 关闭右测编辑框
    closeRight() {
      this.showRight = false
    },
    closeLeft() {
      this.showLeft = !this.showLeft
    },
    // 处理计划排纱 勾选显示字段
    handlePlanCheckData() {
      // if (this.checkData.length > 0) {
      //   for (const key in this.detailColumns) {
      //     const item = this.detailColumns[key].label
      //     if (this.checkData.indexOf(item) !== -1) {
      //       this.$set(this.detailColumns[key], 'isShow', true)
      //     } else {
      //       this.$set(this.detailColumns[key], 'isShow', false)
      //     }
      //   }
      // }
      if (this.topCheckData.length > 0) {
        for (const key in this.topDetailColumns) {
          const item = this.topDetailColumns[key].label
          if (this.topCheckData.indexOf(item) !== -1) {
            this.$set(this.topDetailColumns[key], 'isShow', true)
          } else {
            this.$set(this.topDetailColumns[key], 'isShow', false)
          }
        }
      }
      if (this.bottomCheckData.length > 0) {
        for (const key in this.bottomDetailColumns) {
          const item = this.bottomDetailColumns[key].label
          if (this.bottomCheckData.indexOf(item) !== -1) {
            this.$set(this.bottomDetailColumns[key], 'isShow', true)
          } else {
            this.$set(this.bottomDetailColumns[key], 'isShow', false)
          }
        }
      }
      this.initScreenWidth()
    },
    // 勾选显示的字段事件
    checkClick() {
      // localStorage.setItem('planCheckData', JSON.stringify(this.checkData))
      localStorage.setItem('planCheckDataTop', JSON.stringify(this.topCheckData))
      localStorage.setItem('planCheckDataBottom', JSON.stringify(this.bottomCheckData))
      this.popoverVisible = false
      this.handlePlanCheckData()
    },
    // 折叠下拉菜单事件
    handleCommand(command) {
      const list = [
        { text: '待排原因', prop: 'waitingReason', type: '_input' },
        { text: '计划备注', prop: 'planRemark', type: '_input' }
      ]
      this.targetClick(list[command])
    },
    // 分录勾选
    selectionChange(e) {
      console.log(1111)
      this.selectionArr = e
      const _this = this
      this.detailDataSource.forEach((row, index) => { row.checked = false })
      this.$nextTick(() => {
        _this.$refs.multipleTable2.$refs.table.clearSelection()
      })
      if (this.selectionArr) {
        this.selectionArr.forEach(row => {
          row.checked = true
          this.$nextTick(() => {
            _this.$refs.multipleTable2.$refs.table.toggleRowSelection(row, true)
          })
        })
      }
    },
    tableRowClassName({ row, rowIndex }) {
      return row.checked === true ? 'success-row' : ''
    },
    //
    detailRowclick(row, column, event) {
      if (event.altKey) {
        row.checked = !row.checked
        this.selectionArr.push(row)
        this.$refs.multipleTable1.$refs.table.toggleRowSelection(row, row.checked)
        this.$refs.multipleTable2.$refs.table.toggleRowSelection(row, row.checked)
      }
    },
    selectionChange1(e) {
      this.selectionArr = e
      const _this = this
      this.detailDataSource.forEach((row, index) => { row.checked = false })
      if (this.selectionArr) {
        this.selectionArr.forEach(row => {
          row.checked = true
          this.$nextTick(() => {
            _this.$refs.multipleTable1.$refs.table.toggleRowSelection(row, true)
          })
        })
      }
      this.$nextTick(() => {
        this.detailDataSource.forEach((row, index) => {
          if (!row.checked) {
            _this.$refs.multipleTable1.$refs.table.toggleRowSelection(row, false)
          }
        })
      })
    },
    // 按钮操作事件
    async targetClick(item) {
      const text = item.text
      if (this.selectionArr.length === 0) {
        return this.$message.error('请选择记录!')
      }
      if (item.prop === 'deliveryConfirm' || item.prop === 'deliveryConfirm1') {
        // 发送纱期
        if (item.prop === 'deliveryConfirm1') {
          for (let i = 0; i < this.selectionArr.length; i++) {
            const o = this.selectionArr[i]
            if (!o.targetYarnDate) {
              return this.$message.error('所选记录，目标纱期不能为空，请先选择目标纱期!')
            }
          }
        }
        const ids = []
        this.selectionArr.forEach(v => {
          ids.push(v.id)
        })

        this.$confirm(item.prop === 'deliveryConfirm' ? '是否确认交期？' : '是否发送纱期？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          if (item.prop === 'deliveryConfirm') {
            // 确认交期
            this.deliveryConfirmFn({ apsPlanScheduleDetailIds: ids })
          } else {
            // 发送纱期
            this.sendYarnDateFn({ apsPlanScheduleDetailIds: ids })
          }
        })
      } else {
        this.selectionItem = item.prop
        for (const key in this.productPopOptions.content) {
          this.$set(this.productPopOptions.content[key], 'isShow', false)
        }
        this.$set(this.productPopOptions.content[item.type], 'isShow', true)
        this.$set(this.productPopOptions.content[item.type], 'label', text)
        this.$set(this.productPopOptions, 'visible', true)
        this.$set(this.productPopOptions, 'title', text)
      }
    },
    // 确认交期
    async deliveryConfirmFn(data) {
      const res = await deliveryConfirm(data)
      if (res.code === 200 && res.data) {
        // this.suBpageList({ id: this.currentId })
        this.getUnrepeatList()
        this.fetchLog(this.getLogMessages('UPDATE', '/aps/planSchedule/deliveryConfirm'), data, JSON.stringify({ beforeText: `在'计划管理-计划排期-待复期-确认交期`, beforeCode: data }))
        return this.$message.success('确认交期成功')
      } else {
        return this.$message.error('确认交期失败')
      }
    },
    // 发送纱期
    async sendYarnDateFn(data) {
      const res = await sendYarnDate(data)
      this.suBpageList({ id: this.currentId })
      if (res.data && res.data && res.data.length) {
        // 当前分录列表
        if (this.detailDataSource.length) {
          for (let i = 0; i < this.detailDataSource.length; i++) {
            const item = this.detailDataSource[i]
            if (res.data.includes(item)) {
              console.log('处理发送纱期失败', item)
            }
          }
          return this.$message.error('处理发送纱期失败!' + JSON.stringify(res.data))
        }
      } else {
        this.fetchLog(this.getLogMessages('UPDATE', '/aps/planSchedule/sendYarnDate'), data, JSON.stringify({ beforeText: `在'计划管理-计划排期-待复期-发送纱期`, beforeCode: data }))
        return this.$message.success('发送纱期成功')
      }
    },
    // 处理状态数据
    getStatus(data) {
      let status = ''
      switch (data.status) {
        case 'W':
          status = `<span style="color:#888E9E">待处理</span>`
          break
        case 'P':
          status = `<span style="color:#FF9B02">待提交</span>`
          break
        case 'A':
          status = `<span style="color:#FF9B02">待审核</span>`
          break
        case 'Y':
          status = `<span style="color:#00BCC5">已审核</span>`
          break
        case 'B':
          status = `<span style="color:#FF9B02">已驳回</span>`
          break
        default:
          status = ''
          break
      }
      return status
    },

    // 排序点击事件
    changeSort(e) {
      this.formDatas.sorts = []
      this.getPageList()
    },
    // 排序点击事件
    changeDetailSort(e) {
      const params = {
        id: this.currentId,
        orderBy: e.prop,
        orderSeq: e.order === 'ascending' ? 'asc' : 'desc'
      }
      this.suBpageList(params)
    },
    // 获取排期
    async getScheduling() {
      const apsPlanScheduleDetailIds = []
      for (let i = 0; i < this.detailDataSource.length; i++) {
        apsPlanScheduleDetailIds.push(this.detailDataSource[i].id)
      }
      const res = await getPlanSchedule({ apsPlanScheduleDetailIds: apsPlanScheduleDetailIds })
      if (!res || res.code !== 200) {
        return false
      }
      this.$message({
        message: '获取成功',
        type: 'success'
      })
    },
    handleClick(e) {
      this.multipleSelectionAll = []
      this.multipleSelection = []
      this.showRight = false
      this.showLeft = false
      this.formOtions.layout = e.name === '0'
      this.formDatas.tabType = e.name
      this.activeName = e.name
      this.formDatas.pageSize = 20
      this.formDatas.pageNum = 1
      if (e.name === '0') {
        this.getUnrepeatList()
      } else {
        this.getPageList()
      }
    },
    // 待复期分录list
    async suBpageList(data = {}) {
      const res = await getSuBpageList(data)
      this.detailDataSource = res && res.data || []
      this.showRight = true
      this.countAmount = 0
      for (let i = 0; i < this.detailDataSource.length; i++) {
        this.detailDataSource[i].num = this.detailDataSource[i].num ? parseInt(this.detailDataSource[i].num) : 0
        this.countAmount = this.countAmount + parseInt(this.detailDataSource[i].num)
      }
      console.log(this.countAmount)
    },
    // 更新计划排序明细
    async updateDetailFn(data = {}) {
      const res = await updateDetail(data)
      if (res.code === 200) {
        this.fetchLog(this.getLogMessages('UPDATE', '/aps/planSchedule/updateApsPlanScheduleDetail'), data, JSON.stringify({ beforeText: `在'计划管理-计划排期-待复期-更新一条数据`, beforeCode: data }))
        this.suBpageList({ id: this.currentId })
        return this.$message.success('提交成功!')
      }
    },
    // 列表数据
    async getPageList(data = {}) {
      const res = await pageList({ ...this.formDatas, ...this.searchFormDatas })
      res.data.list && res.data.list.map((item, index) => { item.code = (res.data.pageNum - 1) * res.data.pageSize + index + 1 })
      const listData = res.data && res.data.list || []
      this.dataSource = listData || []
      this.changedPagination = {
        ...this.changedPagination,
        dataTotal: res.data.total || 0,
        ...data,
        currentPage: res.data.pageNum || 1,
        pageSize: res.data.pageSize || 20,
        page: res.data.pageNum || 1
      }
      // 初始化打开第一条分录
      // if (listData && this.activeName === '0') {
      //   this.currentId = listData[0].id
      //   this.suBpageList({ id: this.currentId })
      // }countAmount

      this.closeRight()
      setTimeout(() => {
        this.setSelectRow()
      }, 20)
    }

  }
}
</script>

<style lang='scss' scoped>

.countAmount{
  color: #FF4444;
  margin-left: 10px;
  label,span{
    font-size: 12px;
    color:#666;
  }
}
  .guest-sample-list{
    padding: 20px;
    .search{
      padding-left: 0px;
    }
  }
  .list-tabs{
    width: 100%;
    padding-bottom: 0px;
    padding-right: 20px;
    background: #fff;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #d0d6da;
    /deep/.el-tabs__nav .el-tabs__item {
      padding: 0 26px;
      height: 60px;
      line-height: 60px;
    }
    .waiting-bnt{
      margin-left: auto;
    }
  }
  /deep/ .el-tabs__header {
  margin: 0;
  .el-tabs__item {
    font-weight: 400;
  }
}
/deep/ .el-tabs__nav-wrap::after {
  height: 1px;
  background-color: #d0d6da;
}
.standce{
  margin-right: 8.33% !important;
}

.main-cont{
  display: flex;
  .page-table{
    width: 100%;
    box-sizing: border-box;
    transition: all .3s;
  }
  .page-table{
    /* overflow-x: hidden; */
    overflow-y: auto;
    height: calc(100vh - 238px);
    transition: all .3s;
  }
  .table-list{
    /* width: 400px; */
    transition: all .3s;
    padding-right: 0;

  }
.table-left-list{
  width: 0;
  padding: 0;
}
.detail-all-left{
      border-left: none !important;
}
  .detail-left-wrap{
    width: 0;
    position: relative;
  }
  .detail-left{
    // width: calc(100% - 400px);
    width: calc(100% - 250px);
    transition: all .3s;
    background-color: #FFFFFF;
    padding: 20px;
    padding-top: 15px;
    box-sizing: border-box;
    border-left: 1px solid #d0d6da;
    padding-bottom: 0;

  }
  .detail-all-left{
    width:100%;
  }
  .detail-bnt{
    margin-left: 35px;
    display: flex;
    align-items: center;
    padding-bottom: 15px;
  }
}
.detailTable2{
      /deep/.el-table__fixed-body-wrapper{
      height: 239px !important;
    }
}
.detail-table{
  // height: calc(100vh - 300px);
  height:300px;
  overflow: hidden;
  /deep/{
    .el-table__fixed{
      &::before{
        height: 0 !important;
      }
    }
  }
  /deep/.el-table{
    .el-table__fixed{
      height: 292px !important;
      background-color: #fff;
    }

    // .el-table__fixed-body-wrapper{
    //   height: 239px !important;
    // }
    .el-table__body-wrapper{
      height: 256px;
      overflow-y: auto;
    }

    .success-row{
    background-color: #d8eafd;
    td{
      background: none !important;
    }
  }
  }

}
.icon-setting{
  font-size: 20px;
  color: #606266;
  cursor: pointer;
  margin-left: auto;
  &:hover{
    color: #1890ff;
  }
}
.close-right{
  position: absolute;
  left: -44px;
  top: 20px;
  width: 22px;
  height: 22px;
  z-index: 2;
  background: #fff;
  border-radius: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #7c7c7c;
  font-size: 14px;
  cursor: pointer;
  border: 1px solid #afafaf;
}
.close-left{
  position: absolute;
  left: 20px;
  top: 20px;
  width: 22px;
  height: 22px;
  z-index: 2;
  background: #fff;
  border-radius: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #7c7c7c;
  font-size: 14px;
  cursor: pointer;
  border: 1px solid #afafaf;
}
</style>
<style lang="scss">
  .plan-arrange{
    width: 100%;
    height: calc(100vh - 90px);
    overflow: hidden;
    .el-table th > .cell .el-checkbox{
      margin-left: 4px;
    }
  }
  .plan-arrange .page-table tbody .el-table__row td {
    border-bottom: 1px solid #dfe6ec;
    height: 100%;
    overflow-y: auto;
      .page-table{
        overflow-y: auto;
        height: calc(100vh - 136px);
    }
  }
  .plan-arrange .current-row td{
    background-color: #f5f7fa!important;
  }
  .a-popover{
    margin-left: auto;
    padding: 0;
    .checkbox-wrap{
      .top-content,.bottom-content{
        // margin-bottom: 1-0px;
        .title{
          font-size: 14px;
          line-height: 30px;
          padding-left: 15px;
        }
      }
      .checkbox-title{
        font-size: 14px;
        color: #151222;
        height: 40px;
        padding: 0 15px;
        line-height: 40px;
        border-bottom: 1px solid #EEEFF0;
      }
      .check-all{
        border-bottom: 1px solid #EEEFF0;
      }
    }
    .btn-wrap{
      display: flex;
      align-items: center;
      justify-content: center;
      height: 48px;
      border-top: 1px solid #EEEFF0;

    }
  }
  .plan-arrange{
    /*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
      ::-webkit-scrollbar{
        width: 7px;
        height: 7px;
        background-color: #F5F5F5;
      }

      /*定义滚动条轨道 内阴影+圆角*/
      ::-webkit-scrollbar-track {
        box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
        -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
        border-radius: 10px;
        background-color: #F5F5F5;
      }

      /*定义滑块 内阴影+圆角*/
      ::-webkit-scrollbar-thumb{
        border-radius: 10px;
        box-shadow: inset 0 0 6px rgba(0, 0, 0, .1);
        -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, .1);
        background-color: #c8c8c8;
        &:hover{
          background-color: #888;
        }
      }
  }

</style>
