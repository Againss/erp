<!--
 * @Author: Do not edit
 * @Date: 2020-12-03 09:13:35
 * @LastEditTime: 2019-10-15 15:00:45
 * @LastEditors: Aurnm
 **  新建盘点计划单页面
 -->
<template>
  <div class="new-check-page">
    <header class="new-header">
      <span>盘点计划单号：</span>
      <span v-if="create === 'create'" class="new-tip">保存后自动生成</span>
      <span v-if="edit === 'edit'" class="new-tip">{{ checkPlanId }}</span>
    </header>
    <!-- 盘点信息 -->
    <div class="new-add">
      <div class="search">
        <cs-custom-form ref="searchForm" :data-source="searchData" :options="formOtions" :form-datas="formDatas" />
      </div>
    </div>
    <div class="new-check-details">
      <div class="details-text">
        盘点明细
      </div>
      <!-- 明细列表 -->
      <div class="table-details detail">
        <cs-custom-table
          :columns="columns"
          :data-source="dataSource"
        />
      </div>
      <div class="total-num">
        <span style="font-size: 16px; font-weight: bold">总计：</span>
        <span class="tip-num">
          {{ checkAmount }}
        </span>
      </div>
    </div>
    <!-- 其他说明部分 -->
    <div class="other-part">
      <cs-custom-form
        ref="remarkForm"
        class="clearfix"
        :form-datas="remarkFormDatas"
        :data-source="newCheckOther"
        :options="remarkFormOtions"
      />
    </div>
    <!-- 按钮位置 -->
    <div class="button-groups">
      <div class="btn-all">
        <el-button
          size="small"
          type="primary"
          @click="addPlan"
        >
          生成计划
        </el-button>
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
import { storeWarehouse, addDetails, checkAdd, checkDetail, downDetail, checkUpdate, locationSelect, peopleList } from '../api/index.js'
import { fetchLog } from '@/views/wms/public/fetchLog'
export default {
  components: {},
  mixins: [fetchLog],
  data() {
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    // 盘点信息样式
    const checkstyle = {
      'width': '100%',
      'font-size': '16px',
      'color': '#3c4043',
      'padding': '0px 20px 20px 0px'
    }
    // 当仓库下拉改变时，获取对应的区
    const changeWarehouse = (value, form, formDatas, setFormDatas) => {
      setFormDatas({ locationPaths: null })
      this.warehouseSelect = value.value
      this.dataSource = []
      this.checkAmount = ''
      this.locationOption(value.value)
    }
    // 获取盘点人
    const changePeople = (value, form, formDatas, setFormDatas) => {
      this.peopleName = value
    }
    const searchData = [
      {
        itemType: 'view',
        text: '盘点信息',
        style: checkstyle
      },
      {
        prop: 'warehouse',
        itemType: 'select',
        itemStyle: { 'width': '23%', 'margin': '15px 2%' },
        label: '盘点仓库:',
        clearable: true,
        filterable: true,
        change: changeWarehouse,
        dataSource: [],
        valueType: 'object',
        rules: [commonBlurReg, { required: true, message: '盘点仓库不能为空', trigger: ['blur'] }]
      },
      {
        itemType: 'date',
        itemStyle: { 'width': '23%', 'margin': '15px 2%' },
        prop: 'checkStartTime',
        label: '盘点开始时间:',
        placeholder: '请选择日期',
        // type: 'daterange',
        format: 'yyyy-MM-dd',
        valueFormat: 'yyyy-MM-dd',
        rules: [{ required: true, message: '日期不能为空', trigger: ['change'] }]
      },
      {
        prop: 'checkType',
        itemType: 'radio-group',
        itemStyle: { 'width': '23%', 'margin': '15px 2%' },
        label: '盘点方式:',
        readonly: true,
        dataSource: [
          {
            label: '明盘',
            value: '1'
          },
          {
            label: '盲盘',
            value: '2'
          }
        ],
        rules: [commonBlurReg, { required: true, message: '盘点方式不能为空', trigger: 'blur' }]
      },
      {
        prop: 'checkUser',
        itemType: 'select',
        itemStyle: { 'width': '23%', 'margin': '15px 2%' },
        label: '盘点负责人:',
        clearable: true,
        filterable: true,
        change: changePeople,
        dataSource: [],
        valueType: 'object',
        rules: [commonBlurReg, { required: true, message: '盘点负责人不能为空', trigger: ['change'] }]
      },
      {
        prop: 'locationPaths',
        label: '盘点区域:',
        type: 'input',
        itemType: 'select',
        itemStyle: { 'width': '23%', 'margin': '15px 2%' },
        clearable: true,
        filterable: true,
        multiple: true,
        placeholder: '请选择',
        dataSource: [],
        rules: [commonBlurReg, { required: true, message: '盘点区域不能为空', trigger: ['blur'] }]
      },
      {
        itemType: 'operate',
        submitText: '添加盘点明细',
        itemStyle: { 'margin-top': '7px', 'margin-left': '30px' },
        submitHandle: params => {
          this.formDatas = params
          this.getRulePage(params)
        },
        resetHandle: (params) => {
          this.formDatas = {}
        }
      }
    ]
    // 表格表头的配置信息
    const columns = [
      {
        prop: 'locationCode',
        label: '库位',
        minWidth: '160'
      },
      {
        prop: 'materiel',
        label: '产品编号',
        minWidth: '180'
      },
      {
        prop: 'materielType',
        label: '物料类型',
        minWidth: '110',
        formater: scope => {
          if (scope.row.materielInfo) {
            return this.getStatus(scope.row.materielInfo)
          } else {
            return '--'
          }
        }
      },
      {
        prop: 'materielInfo.yarnName',
        label: '纱名',
        minWidth: '160',
        showOverflowTooltip: true,
        formater: scope => {
          if (scope.row.materielInfo) {
            return scope.row.materielInfo.yarnName
          } else {
            return '--'
          }
        }
      },
      {
        prop: 'materielInfo.yarnProperty',
        label: '纱属性',
        minWidth: '130',
        formater: scope => {
          if (scope.row.materielInfo) {
            return scope.row.materielInfo.yarnProperty
          } else {
            return '--'
          }
        }
      },
      {
        prop: 'materielInfo.productInfo',
        label: '产品信息',
        minWidth: '120',
        formater: scope => {
          if (scope.row.materielInfo) {
            return scope.row.materielInfo.productInfo
          } else {
            return '--'
          }
        }
      },
      // {
      //   prop: 'materielInfo.clothColor',
      //   label: '成品颜色',
      //   minWidth: '120',
      //   formater: scope => {
      //     if (scope.row.materielInfo) {
      //       return scope.row.materielInfo.clothColor
      //     } else {
      //       return '--'
      //     }
      //   }
      // },
      // {
      //   prop: 'materielInfo.flower',
      //   label: '印花花号',
      //   minWidth: '120',
      //   formater: scope => {
      //     if (scope.row.materielInfo) {
      //       return scope.row.materielInfo.flower
      //     } else {
      //       return '--'
      //     }
      //   }
      // },
      {
        prop: 'stock',
        label: '库位数',
        minWidth: '90'
      },
      {
        prop: 'checkNum',
        label: '盘点件数',
        minWidth: '90'
      },
      {
        prop: 'unit',
        label: '包装单位',
        minWidth: '90',
        formater: scope => {
          if (scope.row.materielInfo) {
            return this.getUnit(scope.row.materielInfo)
          } else {
            return '--'
          }
        }
      },
      {
        prop: 'checkUserName',
        label: '盘点人',
        minWidth: '110'
      }
    ]
    // 其他说明
    const newCheckOther = [
      {
        prop: 'remark',
        itemType: 'input',
        label: '其他说明',
        type: 'textarea',
        rows: 6,
        itemStyle: {
          width: '100%',
          marginRight: '10%',
          float: 'left'
        },
        trim: (value) => {
          return value
        },
        rules: commonBlurReg,
        maxlength: 500
      }
    ]
    return {
      formOtions: {
        size: 'small',
        inline: true
      },
      formDatas: {},
      searchData, // 基本信息
      newCheckOther, // 其他说明
      remarkFormDatas: {},
      remarkFormOtions: {
        inline: false,
        size: 'small',
        labelPosition: 'top'
      },
      columns,
      dataSource: [],
      rowInfoMessages: {}, // 日志先后拿到的信息
      warehouseSelect: '', // 仓库code
      nameCheck: '', // 仓库名字
      warehouseData: [], // 仓库数组
      areaSelect: '',
      areaData: [],
      baseUrl: '',
      options: [],
      optionsList: [],
      copyArea: [],
      valueOptions: [],
      userData: [], // 用户中心人的数据
      userName: '', // 用户名
      checkNameId: '', // 盘点人id
      create: '', // 新增
      edit: '', // 编辑
      remarkCheck: '', // 盘点原因
      peopleName: '', // 盘点人
      checkAmount: '', // 总件数
      copyCheck: [],
      checkPlanId: ''
    }
  },
  created() {
    this.create = this.$route.query.type
    this.edit = this.$route.query.type
    this.checkPlanId = this.$route.query.checkPlanId
    // this.getRulePage()
    this.warehouseOption()
    this.warehousePeople()
    if (this.edit === 'edit') {
      this.upList({ checkPlanId: this.$route.query.checkPlanId })
      this.downList({ checkPlanId: this.$route.query.checkPlanId })
    }
  },
  mounted() {},
  methods: {
    // 包装单位
    getUnit(data) {
      let str = ''
      switch (data.materielType) {
        case '0101':
          str = '件'
          break
        case '0102':
          str = '件'
          break
        case '0103':
          str = '件'
          break
        case '0201':
          str = '卷'
          break
        case '0202':
          str = '卷'
          break
        case '0203':
          str = '卷'
          break
        default:
          break
      }
      return str
    },
    // 物料类型
    getStatus(data) {
      let str = ''
      switch (data.materielType) {
        case '0101':
          str = '天然纤维'
          break
        case '0102':
          str = '化学纤维'
          break
        case '0103':
          str = '组合纱线'
          break
        case '0201':
          str = '坯布'
          break
        case '0202':
          str = '色布'
          break
        case '0203':
          str = '组合布'
          break
        case '0204':
          str = '花布'
          break
        default:
          break
      }
      return str
    },
    comeBack() {
      this.$confirm(' 你确认要取消吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          this.$router.push('/wms/inventory-manage/check-store/index')
        })
    },
    // 仓库下拉数据
    async warehouseOption(data = {}) {
      const res = await storeWarehouse({ enable: 1 })
      if (res.code !== 200) {
        return false
      }
      this.warehouseData = res.data.list || []
      const warehouseList = (res.data.list || []).map(item => {
        return { value: item.code, label: item.name }
      })
      this.searchData[1].dataSource = [...warehouseList]
    },
    // 根据仓库找到对应的货位
    async locationOption(value) {
      const res = await locationSelect({ enable: 1, warehouseCode: this.warehouseSelect })
      const shelfList = (res.data.list || []).map(item => {
        return { value: item.path, label: item.path }
      })
      this.searchData[5].dataSource = [...shelfList]
    },
    // 盘点人的下拉
    async warehousePeople() {
      const res = await peopleList({ isEnabled: 1 })
      if (res.code !== 200) {
        return false
      }
      this.userData = res.data.list || []
      const copyUser = (res.data.list || []).map(item => {
        return { label: item.realName, value: item.userId }
      })
      this.searchData[4].dataSource = [...copyUser]
    },
    // 新增盘点明细列表查询
    async getRulePage(data = {}) {
      if (data.checkUser) {
        this.userName = data.checkUser.label
        this.checkNameId = data.checkUser.value
      }
      const res = await addDetails({ ...this.formDatas, ...data })
      if (res.code !== 200) {
        return false
      }
      const listData = res.data.list ? res.data.list : []
      listData.forEach(val => {
        // 前端增加盘点人
        val.checkUserName = this.userName
        val.checkUserId = this.checkNameId
        val.productId = val.id
        val.locationAmount = val.stock
        val.locationCode = val.path
        this.dataSource.push(val)
        // 去重
        const data = {}
        this.dataSource = this.dataSource.reduce((cur, next) => {
          data[next.productId] ? '' : data[next.productId] = true && cur.push(next)
          return cur
        }, [])
      })
      // 库存总数相加
      let checkNum = 0
      if (this.dataSource === []) {
        this.checkAmount = checkNum
      } else {
        this.dataSource.forEach(item => {
          checkNum += item.stock
        })
        this.checkAmount = checkNum
      }
    },
    // 获取上面的详情
    async upList(id) {
      const res = await checkDetail(id)
      if (res.code !== 200) {
        return false
      }
      const upData = (res.data || [])
      this.rowInfoMessages = { ...res.data }
      this.checkAmount = upData.checkAmount
      // 详情请求回来的值赋值给输入框中
      this.formDatas = {
        warehouse: upData.warehouse,
        checkStartTime: this.$filters.parseTime(upData.checkStartTime || 0, '{y}-{m}-{d}'),
        checkType: upData.checkType
      }
      this.remarkFormDatas = {
        remark: upData.remark
      }
      // 重新调用库位的下拉
      this.locationOption(this.warehouseSelect)
    },
    // 获取表格的数据
    async downList(data) {
      const res = await downDetail({ ...data })
      if (res.code !== 200) {
        return false
      }
      const listData = res.data.list || []
      this.dataSource = listData
      this.dataSource.forEach(val => {
        val.path = val.locationCode
      })
    },
    // 生成盘点计划
    async addPlan() {
      if (this.create === 'create') {
        this.remarkCheck = this.$refs.remarkForm.dynamicValidateFormRuleForm.remark
        const obj = {
          checkAmount: this.checkAmount,
          remark: this.remarkCheck
        }
        // 前端添加验证--盘点列表
        if (this.dataSource.length === 0) {
          this.$message({
            type: 'info',
            message: '盘点列表为空!'
          })
          return false
        }
        // 前端添加验证--盘点原因原因
        if (this.$refs.remarkForm.dynamicValidateFormRuleForm.remark === '' || this.$refs.remarkForm.dynamicValidateFormRuleForm.remark === undefined) {
          this.$message({
            type: 'info',
            message: '其他说明不能为空!'
          })
          return false
        }
        if (obj.checkStartTime === null || obj.checkType === null || obj.warehouseCode === null || obj.warehouseName === null || obj.checkAmount === null || obj.remark === null) {
          return false
        }
        const res = await checkAdd({ ...obj, ...this.formDatas, checkPlanDetails: this.dataSource })
        if (res.code !== 200) {
          return false
        }
        this.fetchLog(this.getLogMessages('INSERT', '/wms/checkPlan/add'), { ...obj, ...this.formDatas, checkPlanDetails: this.dataSource }, JSON.stringify({ beforeText: `在'仓储管理-库内管理-盘点管理,新增一条记录`, beforeCode: { ...obj, ...this.formDatas, checkPlanDetails: this.dataSource }}))
        this.$router.push('/wms/inventory-manage/check-store/index')
      } else if (this.edit === 'edit') {
        const editCheck = {
          checkPlanId: this.$route.query.checkPlanId,
          checkAmount: this.checkAmount,
          // checkStartTime: this.$refs.searchForm.dynamicValidateFormRuleForm.checkStartTime ? this.$refs.searchForm.dynamicValidateFormRuleForm.checkStartTime.substring(0, 10) : null,
          // checkType: this.$refs.searchForm.dynamicValidateFormRuleForm.checkType,
          remark: this.$refs.remarkForm.dynamicValidateFormRuleForm.remark
        }
        const copyEdit = this.$refs.searchForm.dynamicValidateFormRuleForm
        const logData = { ...editCheck, ...copyEdit, checkPlanDetails: this.dataSource }
        // 前端添加验证--盘点列表
        if (this.dataSource.length === 0) {
          this.$message({
            type: 'info',
            message: '盘点列表为空!'
          })
          return false
        }
        // 前端添加验证--其他说明
        if (this.$refs.remarkForm.dynamicValidateFormRuleForm.remark === '' || this.$refs.remarkForm.dynamicValidateFormRuleForm.remark === undefined) {
          this.$message({
            type: 'info',
            message: '其他说明不能为空!'
          })
          return false
        }
        if (editCheck.checkStartTime === null || editCheck.checkType === null || editCheck.checkAmount === null || editCheck.remark === null) {
          return false
        }
        const res = await checkUpdate({ ...editCheck, ...copyEdit, checkPlanDetails: this.dataSource })
        if (res.code !== 200) {
          return false
        }
        // 日志--修改
        const { beforeCode, afterCode } = this.compareData(this.rowInfoMessages, logData, 'id')
        this.fetchLog(this.getLogMessages('UPDATE', '/wms/checkPlan/modify'), logData, JSON.stringify({ beforeText: `在'仓储管理-库内管理-盘点管理',修改一条记录`, ...{ beforeCode, afterCode }}))
        this.$router.push('/wms/inventory-manage/check-store/index')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.new-check-page{
  .new-header{
    margin: 20px;
    font-family: PingFangSC-Regular;
    font-size: 18px;
    color: #151222;
    // font-weight: 540;

    .new-tip{
      color: #666666;
      font-size: 16px;
    }
  }
  .new-check{
    margin-right: 20px;
  }
  // 盘点信息的样式
  .new-add{
    // padding-left: 16px;
    margin: 15px;
    background-color: #fff;

    .el-form-item{
      margin-right: 0px;
      display: inline-block;
    }
  }

  // 盘点明细的样式
  .new-check-details{
    margin: 15px;
    // padding: 20px 20px;
    padding-left: 20px;
    padding-right: 20px;
    background-color: #fff;
    font-family: PingFangSC-Regular;
    padding-bottom: 15px;

    .total-num{
      color: #666666;
      margin-top: 20px;
      .tip-num {
        color: #ff9b02;
        font-size: 16px;
      }
    }

    .details-text{
      color: rgb(60, 64, 67);
      font-size: 16px;
      // font-weight: bolder;
      margin-bottom: 15px;
      padding-top: 15px;
    }

    .el-form-item{
      margin-right: 0px;
      display: inline-block;
    }
    .el-form{
      margin-bottom: 10px;
    }
  }
  // 其他说明部分
  .other-part{
    margin: 15px;
    background-color: #fff;
    padding: 0px 15px;
    font-family: PingFangSC-Regular;
    padding-bottom: 40px;

    /deep/ .el-form--label-top .el-form-item__label{
      padding: 10px 0px 5px 0px;
    }
  }
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
  .table-details{
    .el-table__body-wrapper{
      height: 400px;
      overflow: scroll;
    }
    .el-table th {
      background-color: #f5f7fa;
    }
  }
</style>
