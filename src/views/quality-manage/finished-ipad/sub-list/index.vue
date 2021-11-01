<template>
  <div class="product-list-ipad-fixed">
    <topNavBar v-if="isFixed" title="智布成品验布录入系统" :back-icon="true">
      <div v-if="isShowBtn" class="result-btn">
        <div v-if="this.$permission(['qa:qaFinishFabricInspectionTask:appmodify'])&&!isEdit" :class="!isEdit?'active':''" class="btn-box" @click="checkEdit">编辑</div>
        <div v-if="isEdit" class="btn-box" @click="submit(0)">保存</div>
        <div v-if="isEdit" class="btn-box active" @click="submit(1)">提交</div>
      </div>
    </topnavbar>
    <div class="product-list-main-ipad" :class="activeName==='1'?'':''">
      <div class="tabchange">
        <div class="add-btn">
          <el-button v-if="isEdit" style="border-color: #0986FF;color: #0986FF;" size="small" @click="addDyelot('add')"><i style="font-weight: 500;" class="el-icon-plus" /> 匹</el-button>
        </div>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane name="0">
            <span slot="label" tabindex="0" class="labelIndex">单匹（{{ orderData.qaFinishFabricRecordList ? orderData.qaFinishFabricRecordList.length : 0 }}）</span>
          </el-tab-pane>
          <el-tab-pane name="1">
            <span slot="label" tabindex="1" class="labelIndex" style="position: relative;">
              整缸信息
              <span class="additional-icon" @click.stop="additionalClick">
                <i class="el-icon-warning-outline" />
              </span>
            </span>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div v-show="activeName==='0'" class="page-table">
        <!-- tab页签切换 -->
        <cs-custom-table
          tooltip-effect="dark"
          :columns="columns"
          :data-source="orderData.qaFinishFabricRecordList"
          :operates="popOperates"
          :pagination="pagination"
          edit-type="pop"
          highlight-current-row
        />
      </div>
      <div v-show="activeName==='1'" class="info-wrpa">
        <productInfo ref="productInfo" :data.sync="orderData" :is-edit="isEdit" @changeRadio="changeResult" @checkEdit="checkEdit" @isActive="isActive" />
      </div>
    </div>

  </div>
</template>
<script>
import topNavBar from '../public/components/topNavBar.vue'
import logMethods from '@/views/product-center/mixin/log-methods.js'
import productInfo from './components/productInfo.vue'
import * as api from './api/index.js'
// import indexVue from '@/components/cs-favico/index.vue'
export default {
  name: 'ColourClothList',
  components: { productInfo, topNavBar },
  mixins: [logMethods],
  data() {
    const searchStyle = { width: '25%' }
    const columns = [
      {
        prop: 'greigeNumber',
        label: '匹号',
        minWidth: '140',
        showOverflowTooltip: true,
        style: { color: '#1890ff', 'cursor': 'pointer' },
        handle: (scope) => {
          this.addDyelot('update', scope.$index)
        }
      },
      {
        prop: 'fabricResult',
        label: '验布结果',
        minWidth: '100',
        showOverflowTooltip: true
      },
      {
        prop: 'sumnumber',
        label: '总分',
        minWidth: '100',
        showOverflowTooltip: true
      },
      {
        prop: 'averageHundred',
        label: '平均分100码',
        minWidth: '130',
        showOverflowTooltip: true
      },
      {
        prop: 'defect',
        label: '疵点个数',
        minWidth: '140',
        showOverflowTooltip: true,
        formater: scope => {
          return this.defectNum(scope.row.finishFabricDefectFourList)
        }
      },
      {
        prop: 'customerColor',
        label: '实封/边封（"）',
        minWidth: '150',
        showOverflowTooltip: true,
        formater: scope => {
          return (scope.row.realWidth + '/' + scope.row.realBorderWidth)
        }
      },
      {
        prop: 'customerColor',
        label: '重量（KG）/码长',
        minWidth: '160',
        showOverflowTooltip: true,
        formater: scope => {
          return (scope.row.weight + '/' + Number(scope.row.realCodeLength).toFixed(2))
        }
      }
    ]

    // 分页配置信息
    const pagination = {
      currentChange: (val) => {
        // 切换页数
        this.getList({
          pageSize: this.pagination.pageSize || 10,
          page: val
        })
      },
      sizeChange: (val) => {
        // 切换条数
        this.getList({ pageSize: val, page: this.pagination.page || 1 })
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
      searchStyle,
      columns,
      pagination,
      dataList,
      popOperates,
      isFixed: true,
      activeName: '1',
      showAdditional: false,
      formOtions: {
        inline: true,
        size: 'small'
        // labelWidth: '90px'
      },
      isEdit: false,
      orderData: { // 详情数据
        fabricResult: '', // 验布结果
        fabricResultProblem: '', // 问题类型
        comment: '', // 评论
        qaFinishFabricDefectInformationList: [], // 成品验布疵点整缸信息
        qaFinishFabricRecordList: [], // 验布信息list
        qaGreigeInspectionInfoResponse: {} // 基础信息
      }
    }
  },
  computed: {
    isShowBtn() {
      if ((this.orderData.status === 0 || this.orderData.status === 1) && this.$store.state.user.userInfo.userId === this.orderData.opearationUserId) {
        return true
      } else {
        return false
      }
    }
  },
  created() {
    this.manageData()
  },
  methods: {
    // 校验不通过跳转到整缸信息
    isActive() {
      this.activeName = '1'
    },
    checkEdit(flag = true) {
      this.isEdit = !this.isEdit
      !flag && this.$router.go(-1)
    },
    submit(val) {
      this.$nextTick(() => {
        this.$refs['productInfo'].submit(val)
      })
    },
    // 获取验布详情数据
    getOrderData() {
      const id = this.$route.params.id
      if (id) {
        api.getClothData(id).then(res => {
          const resData = res.data || {}
          resData.qaFinishFabricRecordList = resData.qaFinishFabricRecordList || []
          resData.qaFinishFabricDefectInformationList = resData.qaFinishFabricDefectInformationList || []
          resData.qaGreigeInspectionInfoResponse = resData.qaGreigeInspectionInfoResponse || {}
          resData.fabricResultProblemArr = resData.fabricResultProblem ? resData.fabricResultProblem.split(',') : []
          if (resData.attachmentList && resData.attachmentList.length) {
            resData.attachmentList.forEach(item => {
              item.name = item.originalName
            })
          }
          this.orderData = resData
          if (!this.orderData.qaFinishFabricDefectInformationList.length) {
            this.getInformationListData()
          }
          if (Number(this.orderData.qaGreigeInspectionInfoResponse.unit) === 2) {
            this.columns[5].label = '实封/边封（CM）'
          }
        }).catch(() => {})
      }
    },
    // 获取疵点信息列表数据（整缸）
    getInformationListData() {
      api.getInformationListData(2).then(res => {
        const arr = (res.data || []).map(item => {
          return {
            otherItemsId: item.id,
            otherItemsName: item.name,
            otherItemsUnit: item.unit,
            otherItemsValue: '',
            sort: item.orders,
            whetherRecorded: item.whetherRecorded,
            remark: ''
          }
        })
        arr.sort((n, m) => {
          return (n.sort - m.sort)
        })
        this.orderData.qaFinishFabricDefectInformationList = arr
      }).catch(() => {})
    },
    // 进入页面进行判断处理数据
    manageData() {
      let qaOrderData = window.sessionStorage.getItem('qaOrderData')
      if (qaOrderData) {
        qaOrderData = JSON.parse(qaOrderData)
        this.isEdit = qaOrderData.isEdit
        this.activeName = qaOrderData.activeName
        let singleClothData = window.sessionStorage.getItem('singleClothData')
        if (singleClothData) {
          singleClothData = JSON.parse(singleClothData)
          if (singleClothData.type === 'add') {
            qaOrderData.data.qaFinishFabricRecordList.push(singleClothData.data)
          } else {
            qaOrderData.data.qaFinishFabricRecordList[singleClothData.index] = singleClothData.data
          }
          window.sessionStorage.removeItem('singleClothData')
        }
        this.orderData = qaOrderData.data
        this.calculationAveragenNum() // 计算实际平均幅宽、实际平均克重、实际平均含潮率
        this.calculationWholeCylinder() // 计算整缸结果

        if (Number(this.orderData.qaGreigeInspectionInfoResponse.unit) === 2) {
          this.columns[5].label = '实封/边封（CM）'
        }
        window.sessionStorage.removeItem('qaOrderData')
      } else {
        this.getOrderData()
      }
    },
    defectNum(data) {
      let num = 0
      if (data && data.length) {
        data.forEach(item => {
          if (item.deductionItemsDistribution !== '0/0/0/0') {
            num += 1
          }
        })
      }
      return num
    },
    // 计算实际平均幅宽、实际平均克重、实际平均含潮率
    calculationAveragenNum() {
      let realAverageWidth = 0
      let realAverageWeight = 0
      let realMoisture = 0
      let realMoistureNum = 0
      let weight = 0
      const len = this.orderData.qaFinishFabricRecordList.length
      this.orderData.qaFinishFabricRecordList.forEach(item => {
        realAverageWidth += Number(item.realWidth)
        realAverageWeight += Number(item.returnFabricWeight)
        weight += Number(item.weight)
        const arr = item.moistureTest ? item.moistureTest.split(',') : []
        arr.forEach(n => {
          realMoisture += Number(n)
          if (n && n > 0) {
            realMoistureNum += 1
          }
        })
      })

      realAverageWidth = Number((realAverageWidth / len).toFixed(2)) // 实际平均幅宽
      realAverageWeight = Number((realAverageWeight / len).toFixed(2)) // 实际平均克重
      realMoisture = Number((realMoisture / realMoistureNum).toFixed(2)) // 实际平均含潮率
      const obj = {
        realAverageWidth,
        realAverageWeight,
        realMoisture
      }
      if (this.orderData.qaGreigeInspectionInfoResponse.castVatQty) {
        obj.inspectionRate = Number((weight / this.orderData.qaGreigeInspectionInfoResponse.castVatQty * 100).toFixed(2)) // 检验率
      }
      this.orderData = {
        ...this.orderData,
        ...obj
      }
    },
    // 计算整缸结果
    async calculationWholeCylinder() {
      // 验布结果=A/B/C，通过如下三个条件判定
      // 1、产品信息（实际平均布封/实际平均克重/实际平均含潮率）不合格为C
      // 2、整缸记录按照ABC取最低值
      // 3、当前缸所有匹的（平均分100码）之和除以验布总匹数得出分数对应等级【（A：<25）,(B：>=25<34)，（C：>=34）】
      const basicDataObj = this.orderData.qaGreigeInspectionInfoResponse
      const obj = {}
      const resultArr = []
      // 实封或边封的比较值
      let maxNum = Number(basicDataObj.realWidth) + Number(basicDataObj.widthRangeName)
      let minNum = Number(basicDataObj.realWidth) - Number(basicDataObj.widthRangeName)

      // 实际平均幅宽
      if (this.orderData.realAverageWidth) {
        const realAverageWidthVal = Number(this.orderData.realAverageWidth)
        if (realAverageWidthVal <= maxNum && realAverageWidthVal >= minNum) {
          resultArr.push('A')
          obj.qualifiedWidth = 1
        } else {
          resultArr.push('C')
          obj.qualifiedWidth = 0
        }
      }

      maxNum = Number(basicDataObj.realWeight) + Number(basicDataObj.weightRangeName)
      minNum = Number(basicDataObj.realWeight) - Number(basicDataObj.weightRangeName)

      // 实际平均克重
      if (this.orderData.realAverageWeight) {
        const realAverageWeightVal = Number(this.orderData.realAverageWeight)
        if (realAverageWeightVal <= maxNum && realAverageWeightVal >= minNum) {
          resultArr.push('A')
          obj.qualifiedWeight = 1
        } else {
          resultArr.push('C')
          obj.qualifiedWeight = 0
        }
      }

      // 实际平均含潮率
      if (this.orderData.realMoisture) {
        const standardMoistureArr = basicDataObj.standardMoisture ? basicDataObj.standardMoisture.split('-') : ['', '']
        if (this.orderData.realMoisture >= Number(standardMoistureArr[0]) && this.orderData.realMoisture <= Number(standardMoistureArr[1])) {
          resultArr.push('A')
          obj.qualifiedMoisture = 1
        } else {
          resultArr.push('C')
          obj.qualifiedMoisture = 0
        }
      }

      // 疵点信息
      if (!resultArr.includes('C') && this.orderData.qaFinishFabricDefectInformationList && this.orderData.qaFinishFabricDefectInformationList.length) {
        let str = ''
        let arr = this.orderData.qaFinishFabricDefectInformationList.filter(item => {
          return (Number(item.otherItemsUnit) === 3 && item.otherItemsValue)
        })
        if (arr.length) {
          arr = arr.map(item => {
            return item.otherItemsValue
          })
          arr.sort((n, m) => {
            if (n < m) {
              return 1
            } else if (n > m) {
              return -1
            } else {
              return 0
            }
          })
          str = arr[0]
          resultArr.push(str)
        }
      }

      // 平均分100码
      if (!resultArr.includes('C') && this.orderData.qaFinishFabricRecordList && this.orderData.qaFinishFabricRecordList.length) {
        let str = ''
        let averageHundredNum = 0
        this.orderData.qaFinishFabricRecordList.forEach(item => {
          averageHundredNum += Number(item.averageHundred)
        })
        averageHundredNum = Number((averageHundredNum / this.orderData.qaFinishFabricRecordList.length).toFixed(2))
        if (averageHundredNum < 25) {
          str = 'A'
        } else if (averageHundredNum >= 25 && averageHundredNum < 34) {
          str = 'B'
        } else {
          str = 'C'
        }
        resultArr.push(str)
      }

      resultArr.sort((n, m) => {
        if (n < m) {
          return 1
        } else if (n > m) {
          return -1
        } else {
          return 0
        }
      })

      obj.fabricResult = resultArr[0] || ''
      if (obj.fabricResult !== 'C') {
        obj.fabricResultProblem = ''
        obj.fabricResultProblemArr = []
      }
      this.orderData = {
        ...this.orderData,
        ...obj
      }
    },
    changeResult(bool) {
      if (bool) {
        this.calculationWholeCylinder()
      }
    },
    // 点击整缸信息 小图标显示 验布结果计算规则
    additionalClick() {
      // debugger
      this.addDyelot('update', '', false)
      this.$router.push(`/finished-ipad/finished-ipad-sub-list/additional/${this.$route.params.id}`)
    },
    // 点击添加或编辑匹
    addDyelot(type = 'add', index = '', flag = true) {
      const obj = {
        data: this.orderData,
        type,
        isEdit: this.isEdit,
        activeName: this.activeName
      }
      if (type === 'add') {
        if (!this.orderData.qaFinishFabricRecordList.length) {
          obj.request = 1
        }
      } else {
        obj.index = index
      }

      window.sessionStorage.setItem('qaOrderData', JSON.stringify(obj))

      if (flag) {
        this.$router.push(`/finished-ipad/finished-ipad-sub-list/detail/view`)
      }
    },
    handleClick(e) {
      this.activeName = e.name
    }
  }
}
</script>

<style lang="scss" scoped>
  .product-list-ipad-fixed{
    background-color: #eef5f9;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    .product-list-main-ipad{
      padding: 15px;
      padding-top: 0;
      box-sizing: border-box;
      height: calc(100% - 50px);
      width: 100%;
      overflow: hidden;
      overflow-y: auto;
    }
    .main-ipad-calc{
      height: calc(100% - 112px);
    }
    .page-table{
      height: auto;
    }
  }
  /deep/ .el-table{
    font-size: 16px;
  }
  .tabchange{
    background-color: #FFFFFF;
    position: relative;
    margin-top: 15px;
    border-bottom: 1px solid #D0D6DA;
    .additional-icon{
      position: absolute;
      right: -20px;
      top: -14px;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      .el-icon-warning-outline{
        font-size: 18px;
        color: #3798f6;
      }
    }
    .add-btn{
      position: absolute;
      right: 20px;
      top: 12px;
      z-index: 1;
      display: flex;
      align-items: center;
      justify-content: center;
    }
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
      padding-left: 20px !important;
    }
    /deep/ .el-tabs__active-bar{
      height: 3px;
    }
    /deep/ .el-tabs__nav-wrap::after{
      height: 0;
      z-index: 8;
    }

  }
  .result-btn{
    // position: fixed;
    // bottom: 0;
    // left: 0;
    // width: 100%;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    .btn-box{
      height: 32px;
      line-height: 32px;
      padding: 0 14px;
      border-radius: 4px;
      border:1px solid #FFFFFF;
      font-size: 14px;
      cursor: pointer;
      margin-right: 15px;
      font-weight: 500;
      &.active{
        background:#D4E8FB;
        color:#0F5EAB;
        border:1px solid #D4E8FB;
      }
    }
  }
</style>
