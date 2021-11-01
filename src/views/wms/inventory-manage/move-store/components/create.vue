<!--
 * @Author: Do not edit
 * @Date: 2020-12-03 09:13:35
 * @LastEditTime: 2019-10-15 15:00:45
 * @LastEditors: Aurnm
 **  新建移库单页面
 -->
<template>
  <div class="move-page">
    <div class="new-header">
      <span v-if="create === 'create'">新建移库单：</span>
      <span v-if="edit === 'edit'">移库单号：</span>
      <span v-if="create === 'create'" class="new-tip">保存后自动生成</span>
      <span v-if="edit === 'edit'" class="new-tip">{{ moveStockId }}</span>
    </div>
    <div class="move-all">
      <!-- 搜索页面 -->
      <div class="search">
        <cs-custom-form ref="searchForm" :data-source="searchData" :options="formOtions" :form-datas="formDatas" />
      </div>
      <!-- 货物明细表格 -->
      <div class="goods-table detail">
        <cs-custom-table
          :columns="columns"
          class="table-details"
          :data-source="dataSource"
          :pagination="pagination"
          :selection="selection"
          @selection-change="selectionChange"
        />
      </div>
    </div>
    <!-- 移库明细内容 -->
    <div class="move-first">
      <!-- 移入库位 -->
      <div class="input-all">
        <p class="move-title">移入库位：</p>
        <el-select v-model="inputData" filterable clearable placeholder="请选择">
          <el-option
            v-for="item in copyData"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :disabled="item.disabled"
          />
        </el-select>
        <el-button
          type="primary"
          size="mini"
          class="save-button"
          @click="makeMove"
        >确定移入</el-button>
      </div>
      <!-- 移库明细表格 -->
      <div class="move-table detail">
        <cs-custom-table
          :columns="yarnColumns"
          :data-source="yarnSource"
          :operates="popOperates"
        />
      </div>
      <div class="total-num">
        <span style="font-size: 16px; font-weight: bold">总计：</span>
        <span class="tip-num">
          {{ moveAmount }}
        </span>
      </div>
    </div>
    <!-- 移库原因部分 -->
    <div class="move-reason">
      <cs-custom-form
        ref="remarkForm"
        class="clearfix"
        :form-datas="remarkFormDatas"
        :data-source="remarkDataSource"
        :options="remarkFormOtions"
      />
    </div>
    <!-- 按钮部分 -->
    <div class="move-button">
      <div class="btn-all">
        <el-button
          size="small"
          type="primary"
          class="btn-cancel"
          @click="cancelList"
        >
          取消
        </el-button>
        <el-button
          size="small"
          type="primary"
          @click="saveList"
        >
          保存
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { moveAdd, moveDetails, copyDetail, moveUpdate, storeWarehouse, locationSelect } from '../api/index.js'
import { fetchLog } from '@/views/wms/public/fetchLog'
export default {
  name: 'MoveCreate',
  components: {},
  mixins: [fetchLog],
  data() {
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    // 下拉变换时，仓库产生；联动效果
    const changeSelect = (value, form, formDatas, setFormDatas) => {
      setFormDatas({ locationCodes: null })
      this.getStore = value.value
      this.inputData = ''
      // 把搜索的列表清空
      this.copyPage()
      this.locationOption(value.value)
      this.changeWarehouse()
    }
    // 获取下拉库位
    const changeLocation = (value, form, formDatas, setFormDatas) => {
      this.getLocation = value
      this.inputData = ''
      this.copyLocation(value)
    }
    // 查询/重置表单配置信息
    const searchData = [
      {
        prop: 'warehouse',
        itemType: 'select',
        label: '仓库:',
        dataSource: [],
        clearable: true,
        filterable: true,
        valueType: 'object',
        visibleChange: (value) => {
          if (value) {
            this.warehouseOption()
          }
        },
        rules: [commonBlurReg, { required: true, trigger: ['blur'] }],
        change: changeSelect
      },
      {
        prop: 'locationCodes',
        itemType: 'select',
        label: '移出库位:',
        dataSource: [],
        clearable: true,
        filterable: true,
        rules: [commonBlurReg, { required: true, trigger: ['blur'] }],
        change: changeLocation
      },
      {
        itemType: 'operate',
        submitText: '查询',
        submitHandle: params => {
          this.searchFormDatas = params
          this.getRulePage(params)
        },
        resetHandle: (params) => {
          this.searchFormDatas = {}
          this.inputData = ''
          this.searchData[1].dataSource = []
        }
      }
    ]
    // 货物明细表格表头的配置信息
    const selection = {
      selection: true,
      selectionLabel: '全部',
      itemStyle: {
        marginLeft: '100px'
      }
    }
    const columns = [
      {
        prop: 'path',
        label: '移出库位',
        minWidth: '130'
      },
      {
        prop: 'serialNo',
        label: '条码号',
        minWidth: '150'
      },
      {
        prop: 'materiel',
        label: '产品编号',
        minWidth: '180'
      },
      {
        prop: 'classification',
        label: '物料类型',
        minWidth: '100'
      },
      {
        prop: 'yarnName',
        label: '纱名',
        showOverflowTooltip: true,
        minWidth: 120
      },
      {
        prop: 'yarnProperty',
        label: '纱属性',
        showOverflowTooltip: true,
        minWidth: 120
      },
      {
        prop: 'dyelot',
        label: '缸号',
        minWidth: '150'
      },
      {
        prop: 'yarnCard',
        label: '纱牌/纱批',
        minWidth: '130'
      },
      {
        prop: 'weight',
        label: '重量(KG)',
        minWidth: '110'
      },
      {
        prop: 'ballCount',
        label: '球数',
        minWidth: '110'
      },
      {
        prop: 'sellerTeamName',
        label: '销售组织',
        minWidth: '130'
      }
    ]
    // 移库原因部分
    const remarkDataSource = [
      {
        prop: 'moveReason',
        itemType: 'input',
        label: '移库原因',
        type: 'textarea',
        rows: 6,
        itemStyle: {
          width: '100%',
          marginRight: '10%',
          paddingTop: '10px',
          float: 'left'
        },
        trim: (value) => {
          return value
        },
        rules: commonBlurReg,
        maxlength: 500
      }
    ]
    // 货物明细表格表头的配置信息
    const yarnColumns = [
      {
        prop: 'moveOut',
        label: '移出库位',
        minWidth: '150'
      },
      {
        prop: 'moveIn',
        label: '移入库位',
        minWidth: '150'
      },
      {
        prop: 'serialNo',
        label: '条码号',
        minWidth: '180'
      },
      {
        prop: 'materiel',
        label: '产品编号',
        minWidth: '180'
      },
      {
        prop: 'classification',
        label: '物料类型',
        minWidth: '120'
      },
      {
        prop: 'yarnName',
        label: '纱名',
        showOverflowTooltip: true,
        minWidth: 120
      },
      {
        prop: 'yarnProperty',
        label: '纱属性',
        showOverflowTooltip: true,
        minWidth: 120
      },
      {
        prop: 'weight',
        label: '重量(KG)',
        minWidth: '90'
      },
      {
        prop: 'dyelot',
        label: '缸号',
        minWidth: '150'
      },
      {
        prop: 'yarnCard',
        label: '纱牌/纱批',
        minWidth: '150',
        formater: scope => {
          return scope.row.productType === 1 ? '--' : scope.row.yarnCard
        }
      },
      {
        prop: 'ballCount',
        label: '球数',
        minWidth: '110',
        showOverflowTooltip: true,
        formater: scope => {
          return scope.row.productType === 1 ? '--' : scope.row.ballCount
        }
      },
      {
        prop: 'packingUnit',
        label: '包装单位',
        minWidth: '100',
        showOverflowTooltip: true
      },
      {
        prop: 'sellerTeamName',
        label: '销售组织',
        minWidth: '110',
        showOverflowTooltip: true
      }
    ]
    let popOperatesDataSource = [
      {
        label: '删除',
        style: { 'color': '#FE4949' },
        isShow: true,
        handle: scope => {
          this.$confirm('确认删除当前数据吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            customClass: 'customClass'
          })
            .then(() => {
              if (this.create === 'create') {
                this.getId = JSON.parse(localStorage.getItem('selectionData'))
                if (this.getId && this.getId.length > 0) {
                  this.getId.forEach((val, index) => {
                    if (val.id === scope.row.id) {
                      this.getId.splice(index, 1)
                    }
                  })
                }
                // 存储删除的数据
                localStorage.setItem('selectionData', JSON.stringify(this.getId))
                this.yarnSource = JSON.parse(localStorage.getItem('selectionData'))
                this.moveAmount = this.yarnSource.length
              } else if (this.edit === 'edit') {
                let copyYarn = []
                copyYarn = [...this.yarnSource]
                copyYarn.forEach((val, index) => {
                  if (val.id === scope.row.id && val.productId === scope.row.productId) {
                    copyYarn.splice(index, 1)
                  }
                })
                this.yarnSource = copyYarn
                this.moveAmount = copyYarn.length
              }
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              })
            })
        }
      }]
    popOperatesDataSource = this.$filterPermission(popOperatesDataSource)
    const popOperates = {
      label: '操作',
      width: '100',
      fixed: 'right',
      dataSource: popOperatesDataSource
    }
    // 分页配置信息
    const pagination = {
      currentChange: val => {
        this.getRulePage({ pageSize: this.pagination.pageSize || 20, pageNum: val })
      },
      sizeChange: val => {
        this.getRulePage({ pageNum: this.pagination.pageNum || 1, pageSize: val })
      }
    }
    return {
      formOtions: {
        size: 'small',
        inline: true
      },
      activeName: '0',
      formDatas: {},
      searchData,
      columns,
      selection,
      yarnColumns, // 纱表格
      yarnSource: [],
      dataSource: [],
      pagination,
      popOperates,
      /* 移库原因部分*/
      remarkFormDatas: {},
      remarkDataSource,
      remarkFormOtions: {
        inline: false,
        size: 'small',
        labelPosition: 'top'
      },
      rowInfoMessages: {}, // 日志先后拿到的信息
      warehouseList: [], // 存储仓库下拉的数据
      warehouseData: [], // 存储仓库
      getStore: '', // 获取下拉的仓库
      locationData: [],
      inputData: '', // 移入库位绑定的数据
      getLocation: '', // 获取下拉的库位
      copyData: [],
      selectionData: [], // 存储勾选的数据
      idList: [], // 存数据
      moveList: [], // 勾选存的数据
      getId: [], // 取数据
      moveAmount: '', // 件数
      nameMove: '', // 仓库代码和名字
      moveReason: '',
      create: '', // 新增
      edit: '', // 编辑
      editDetails: '', // 详情的数据
      moveStockId: '' // 拿到的单号
    }
  },
  created() {
    // this.formDatas = {
    //   warehouse: ''
    // }
    this.create = this.$route.query.type
    this.edit = this.$route.query.type
    this.moveStockId = this.$route.query.moveStockId
    this.warehouseOption() // 获取仓库的下拉
    // this.locationOption() //获取库位的下拉
    // this.getRulePage() // 查询
    this.editMove({ moveStockId: this.$route.query.moveStockId }) // 点击编辑进入新增页面，获取详情信息
  },
  mounted() {
  },
  methods: {
    // 返回的提示
    cancelList() {
      this.$confirm(' 你确认要取消吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          localStorage.removeItem('selectionData')
          localStorage.removeItem('selectionList')
          // localStorage.removeItem('deleteData')
          this.$router.push(`/wms/inventory-manage/move-store/index`)
        })
    },
    // 获取仓库
    async warehouseOption(data = {}) {
      const res = await storeWarehouse({ enable: 1 })
      if (res.code !== 200) {
        return false
      }
      this.warehouseData = res.data.list
      this.warehouseList = (res.data.list || []).map(item => {
        return { value: item.code, label: item.name }
      })
      this.searchData[0].dataSource = [...this.warehouseList]
    },
    // 移出库位的下拉
    async locationOption(data) {
      const res = await locationSelect({ warehouseCode: data, enable: 1 })
      if (res.code !== 200) {
        return false
      }

      // isDefault: 暂存区；（true：是，false：否）；为暂存区是不显示
      const defaultList = (res.data.list || []).filter(item => item.isDefault === false)
      const pathData = (defaultList || []).map(item => {
        return { value: item.path, label: item.path }
      })
      this.locationData = [...pathData]
      if (pathData.length > 0 && data) {
        this.searchData[1].dataSource = [...pathData]
      } else {
        this.searchData[1].dataSource = [{ label: '暂无数据', value: '', disabled: true }]
      }
    },
    // 移入库位的下拉--同时要剔除上面移入库位的库位
    copyLocation(value) {
      const copyLocation = []
      if (value) {
        this.locationData.forEach((item, index) => {
          if (item.value !== value) {
            copyLocation.push(item)
            return copyLocation
          }
        })
        this.copyData = [...copyLocation]
      }
    },
    // 列表查询
    async getRulePage(data = {}) {
      const locationArr = []
      locationArr.push(data.locationCodes)
      if (data.locationCodes && data.locationCodes !== '') {
        data = { warehouse: data.warehouse, locationCodes: locationArr }
        this.searchFormDatas = { warehouse: data.warehouse, locationCodes: locationArr }
      }

      const res = await moveDetails({ ...data, ...this.searchFormDatas })
      const listData = (res.data.list || [])
      this.dataSource = listData
      this.dataSource.forEach(val => {
        val.moveOut = val.path
        val.productId = val.id
      })
      this.total = res.data.total || {}
      this.pagination = {
        ...this.pagination,
        dataTotal: res.data.total,
        ...data,
        currentPage: res.data.pageNum,
        pageSize: res.data.pageSize,
        pageNum: res.data.pageNum
      }
    },
    // 当仓库下拉选择变换时前端清除搜索的列表和页面
    copyPage() {
      this.dataSource = []
      // this.pagination.pageNum = 1
      // this.pagination.pageSize = 20
      this.pagination.dataTotal = 0
    },
    // 点击勾选的内容
    selectionChange(val) {
      this.selectionData = val
    },
    // 确定移入
    makeMove() {
      if (this.inputData) {
        this.selectionData.forEach((val, index) => {
          val.moveIn = this.inputData
        })
        // 放入勾选的
        localStorage.setItem('selectionList', JSON.stringify(this.selectionData))
        // 取出勾选的
        this.moveList = JSON.parse(localStorage.getItem('selectionList'))
        // 取出上次勾选的内容
        if (this.moveList && this.moveList.length === 0) {
          this.$message({
            type: 'info',
            message: '请勾选需要移库的数据!'
          })
          return false
        }
        this.dataSource.forEach((val, index) => {
          this.moveList.forEach(item => {
            if (item.id === val.id && this.create === 'create') {
              // 添加勾选存储的数据
              this.yarnSource.push(val)
              // 去重
              const data = {}
              this.yarnSource = this.yarnSource.reduce((cur, next) => {
                data[next.id] ? '' : data[next.id] = true && cur.push(next)
                return cur
              }, [])
            } else if (this.edit === 'edit' && item.id === val.productId) {
              // 添加勾选存储的数据
              this.yarnSource.push(val)
              // 去重
              const data = {}
              this.yarnSource = this.yarnSource.reduce((cur, next) => {
                data[next.productId] ? '' : data[next.productId] = true && cur.push(next)
                return cur
              }, [])
            }
          })
        })
      } else {
        this.$message({
          type: 'warning',
          message: '请先选择需要移入的库位!'
        })
      }
      // 把勾选去重后的值放到localStorage中
      localStorage.setItem('selectionData', JSON.stringify(this.yarnSource))
      this.moveAmount = this.yarnSource.length
    },
    // 刷新后从window.localStorage中拿数据
    localData() {
      if (window.localStorage.selectionData && window.localStorage.selectionData.length > 0) {
        this.getId = JSON.parse(localStorage.getItem('selectionData'))
        // 再次去重
        const obj = {}
        this.yarnSource = this.getId.reduce((cur, next) => {
          obj[next.id] ? '' : obj[next.id] = true && cur.push(next)
          return cur
        }, [])
      }
      this.moveAmount = this.yarnSource.length
    },
    // 改变仓库的时候置空移库明细
    changeWarehouse() {
      this.yarnSource = []
      this.moveAmount = this.yarnSource.length
    },
    // 点击编辑--走详情的接口
    async editMove(id) {
      if (this.edit === 'edit') {
        const res = await copyDetail(id)
        if (res.code !== 200) {
          return false
        }
        this.editDetails = res.data
        this.rowInfoMessages = { ...res.data }
        const listData = res.data ? res.data.moveStockDetails : []
        this.formDatas = {
          warehouse: this.editDetails.warehouse
        }
        // 重新调用库位的下拉
        this.locationOption(this.editDetails.warehouse.value)
        this.remarkFormDatas = {
          moveReason: this.editDetails.moveReason
        }
        this.yarnSource = listData
        this.moveAmount = this.yarnSource.length
      }
    },
    // 保存--返回到列表页面
    async saveList() {
      if (this.create === 'create') {
        // // 仓库名字
        // if (this.getStore) {
        //   this.warehouseData.forEach((item, index) => {
        //     if (item.code === this.getStore) {
        //       this.nameMove = item.name
        //     }
        //   })
        // }
        this.moveReason = this.$refs.remarkForm.dynamicValidateFormRuleForm.moveReason
        const obj = {
          moveAmount: this.moveAmount, // 件数
          moveReason: this.moveReason // 原因
        }
        // 前端添加验证--仓库
        if (this.searchFormDatas && this.searchFormDatas.warehouse === {}) {
          this.$message({
            type: 'info',
            message: '移库仓库不能为空!'
          })
          return false
        }
        // 前端添加验证--移库列表
        if (this.yarnSource.length === 0) {
          this.$message({
            type: 'info',
            message: '移库列表不能为空!'
          })
          return false
        }
        // 前端添加验证--移库原因
        if (this.$refs.remarkForm.dynamicValidateFormRuleForm.moveReason === '' || this.$refs.remarkForm.dynamicValidateFormRuleForm.moveReason === undefined) {
          this.$message({
            type: 'info',
            message: '移库原因不能为空!'
          })
          return false
        }
        const res = await moveAdd({ ...obj, ...this.searchFormDatas, moveStockDetails: this.yarnSource })
        if (res.code !== 200) {
          return false
        }
        this.fetchLog(this.getLogMessages('INSERT', '/wms/moveStock/add'), { ...obj, ...this.searchFormDatas, moveStockDetails: this.yarnSource }, JSON.stringify({ beforeText: `在'仓储管理-库内管理-移库管理,新增一条记录`, beforeCode: { ...obj, ...this.searchFormDatas, moveStockDetails: this.yarnSource }}))
        this.$router.push(`/wms/inventory-manage/move-store/index`)
        // 删除前端存储的值
        localStorage.removeItem('selectionData')
        localStorage.removeItem('selectionList')
      } else if (this.edit === 'edit') {
        this.moveReason = this.$refs.remarkForm.dynamicValidateFormRuleForm.moveReason
        const editObj = {
          moveAmount: this.moveAmount, // 件数
          moveReason: this.moveReason, // 原因
          moveStockId: this.moveStockId // 单号
        }
        const copyFormData = this.$refs.searchForm.dynamicValidateFormRuleForm
        const logData = { ...editObj, ...copyFormData, moveStockDetails: this.yarnSource }
        // 前端添加验证--仓库
        if (this.searchFormDatas && this.searchFormDatas.warehouse === {} || copyFormData === {}) {
          this.$message({
            type: 'info',
            message: '移库仓库不能为空!'
          })
          return false
        }
        // 前端添加验证--移库列表
        if (this.yarnSource.length === 0) {
          this.$message({
            type: 'info',
            message: '移库列表为空!'
          })
          return false
        }
        // 前端添加验证--移库原因
        if (this.$refs.remarkForm.dynamicValidateFormRuleForm.moveReason === '' || this.$refs.remarkForm.dynamicValidateFormRuleForm.moveReason === undefined) {
          this.$message({
            type: 'info',
            message: '移库原因不能为空!'
          })
          return false
        }
        // 走更新的接口
        const res = await moveUpdate({ ...editObj, ...copyFormData, moveStockDetails: this.yarnSource })
        if (res.code !== 200) {
          return false
        }
        // 日志--修改
        const { beforeCode, afterCode } = this.compareData(this.rowInfoMessages, logData, 'id')
        this.fetchLog(this.getLogMessages('UPDATE', '/wms/warehouse/modify'), logData, JSON.stringify({ beforeText: `在'仓储管理-库内管理-移库管理',修改一条记录`, ...{ beforeCode, afterCode }}))
        this.$router.push(`/wms/inventory-manage/move-store/index`)
        // 删除前端存储的值
        localStorage.removeItem('selectionData')
        localStorage.removeItem('selectionList')
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.move-page {
  .new-header {
    margin: 20px;
    font-family: PingFangSC-Regular;
    font-size: 18px;
    color: #151222;
    font-weight: 540;
    .new-tip{
      color: #666666;
      font-size: 16px;
    }
  }

  .move-all {
    margin: 20px;
    padding-bottom: 10px;
    background-color: #fff;

    .search{
      // border-bottom: 1px solid #e9eff2;
      margin-bottom: 0px;
    }
  }

  // 移库明细样式
  .move-first{
    margin: 20px;
    padding-bottom: 10px;
    background-color: #fff;
    font-family: PingFangSC-Regular;

    .input-all{
      padding: 15px 20px;
      // border-bottom: 1px solid #e9eff2;
      .move-title{
        display: inline-block;
        font-size: 14px;
        color: #474747;
      }
      .move-input{
        width: 180px;
      }

      .save-button{
        margin-left: 20px;
      }
    }
    .move-table{
      margin: 0px 15px;
      height: 300px;
      overflow-y: scroll;
    }
    .total-num{
      color: #666666;
      margin: 24px 15px 12px;
      .tip-num {
        color: #ff9b02;
        font-size: 16px;
      }
    }
  }
  // 移库原因部分
  .move-reason{
    margin: 20px;
    // padding: 20px 20px;
    padding-left: 20px;
    padding-right: 20px;
    background-color: #fff;
    font-family: PingFangSC-Regular;
    padding-bottom: 30px;
  }

  .move-button{
    display: flex;
  }
  .move-button {
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
.move-page {
  .move-all {
    // 货物明细表格的样式
    .goods-table{
      padding-left: 15px;
      padding-right: 15px;

      .el-table__body-wrapper{
        height: 200px;
        overflow: scroll;
      }

      .el-table th {
        background-color: #f5f7fa;
      }
    }
  }
  .move-table{
    .el-table th {
      background-color: #f5f7fa;
    }
  }
}
</style>
