<template>
  <div class="product-list-ipad-fixed">
    <topNavBar v-if="isFixed" title="智布成品验布录入系统" :back-icon="true">
      <div v-if="isEdit" class="btn-box active" @click="submit">保存</div>
    </topNavBar>
    <div class="product-list-main-ipad" :class="isEdit?'':'product-list-main-ipad-disable'">
      <div class="pibu-detail" :class="isEdit?'':'pibu-detail-disable'">
        <!-- 基本信息&产品信息 -->
        <div>
          <productInfo ref="productInfoData" :data="orderData" :qualified-data="qualifiedObj" :is-edit="isEdit" @change="changeProduct" />
        </div>
        <div class="defect-info" style="height: 100%;">
          <div class="defect-title">疵点信息</div>
          <div class="defect-box">
            <div class="defect-left">
              <div class="defect-item">
                <div v-for="(item,i) in defectFourList" :key="i" class="defect-btn">
                  <div class="btn-item" :class="i===btnIndex1?'active':''" @click="btn1Click(item,i)">
                    <span v-if="item.whetherRecorded===1" style="margin: 0 3px;">*</span>
                    {{ item.deductionItemsName }}
                  </div>
                </div>
              </div>
              <div class="defect-item">
                <div v-for="(item,j) in defectInformationList" :key="j" class="defect-btn">
                  <div class="btn-item btn-item-1" :class="j===btnIndex2?'active':''" @click="btn2Click(item,j)">
                    <span v-if="item.whetherRecorded===1" style="margin: 0 3px;">*</span>
                    {{ item.otherItemsName }}
                  </div>
                </div>
              </div>

            </div>
            <div class="defect-right">
              <cs-custom-table
                tooltip-effect="dark"
                :header-cell-style="headerCellStyle"
                :cell-style="{background:'#fff'}"
                :columns="columns"
                :data-source="dataSource"
                :operates="popOperates"
                edit-type="pop"
                highlight-current-row
              />
              <div class="table-bootm">
                <div class="result">
                  <div class="result-item">验布结果: <span>{{ order.fabricResult || '' }}</span></div>
                  <div class="result-item" style="text-align: center;">平均分100码: <span>{{ order.averageHundred || '' }}</span></div>
                  <div class="result-item" style="text-align: right;">总分: <span>{{ order.sumnumber || '' }}</span></div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
    <my-dialog ref="myDialog" @change="changeDefect" />
  </div>

</template>
<script>
import topNavBar from '../../public/components/topNavBar.vue'
import myDialog from './components/my-dialog.vue'
import productInfo from './components/productInfo.vue'
import * as api from '../api/index.js'
export default {
  components: { productInfo, topNavBar, myDialog },
  data() {
    const headerCellStyle = { 'background': '#F5F7FA' }
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    const columns = [
      {
        prop: 'dyelotNo',
        label: '#',
        width: '40',
        showOverflowTooltip: true
        // style: { color: '#1890ff', 'cursor': 'pointer' },
      },
      {
        prop: 'name',
        label: '疵点',
        showOverflowTooltip: true
      },
      {
        prop: 'score',
        label: '扣分',
        width: '70',
        showOverflowTooltip: true
      },
      {
        prop: 'numOrLevel',
        label: '数量或等级',
        showOverflowTooltip: true,
        width: '100',
        formater: (scope) => {
          let str = '-'
          if (scope.row.unit) {
            if (scope.row.unit === 1) {
              str = '"'
            } else if (scope.row.unit === 2) {
              str = 'cm'
            } else {
              str = ''
            }
          }
          return scope.row.numOrLevel + ' ' + str
        }
      }

    ]
    // 表头操作栏里dataSource的配置信息
    let dataList = [
      {
        label: '修改',
        isShow: true,
        style: { color: '#1890ff', 'cursor': 'pointer' },
        handle: async(params) => {
          if (!this.isEdit) return
          const obj = params.row
          if (obj.type === 1) {
            this.$refs.myDialog.open(false, 1, obj.deductionItemsDistribution, obj.index)
          } else if (obj.type === 2) {
            this.$refs.myDialog.open(false, 2, obj.numOrLevel, obj.index)
          } else {
            this.defectAlert(obj.numOrLevel, obj.index)
          }
        }
      }
    ]
    dataList = this.$filterPermission(dataList)
    // 表头操作栏的配置信息
    const popOperates = {
      label: '操作',
      width: '66',
      fixed: 'right',
      isShow: () => {
        return this.isEdit
      },
      dataSource: dataList
    }
    return {
      isEdit: false,
      headerCellStyle,
      commonBlurReg,
      columns,
      popOperates,
      isFixed: true,
      dataSource: [],
      btnIndex1: null,
      btnIndex2: null,
      orderData: {
        greigeNumber: '', // 匹号
        realWidth: '', // 实封
        realBorderWidth: '', // 边封
        realUnit: '', // 实际单位 1是英寸2是cm
        weight: '', // 重量
        fabricWeight: '', // 克重
        returnFabricWeight: '', // 回后克重
        realCodeLength: '', // 实测码长(实码)
        moistureTest: ',,,', // 含潮测试 ,,, 用3个逗号分开标示4个区间
        moistureTestArr: ['', '', '', ''], // 含潮测试
        sumnumber: '', // 总分
        averageHundred: '', // 平均分100码
        fabricResult: '' // 验布结果（单匹） A B C
      },
      order: {},
      basicData: {}, // // 布封或克重等 参与判断计算结果的
      defectFourList: [], // 疵点四分List
      defectInformationList: [], // 疵点信息List
      type: '',
      index: null,
      qualifiedObj: {
        isRealWidth: null, // 布封是否合格 1合格
        isRealBorderWidth: null, // 边封是否合格 1合格
        isFabricWeight: null, // 克重是否合格 1合格
        isReturnFabricWeight: null // 回后克重是否合格 1合格
      }
    }
  },
  created() {
    this.manageData()
  },
  mounted() {

  },
  methods: {
    // 获取疵点四分表列表数据
    getFourListData() {
      api.getFourListData().then(res => {
        const arr = (res.data || []).map(item => {
          return {
            deductionItemsId: item.id,
            deductionItemsName: item.name,
            deductionItemsDistribution: '0/0/0/0',
            sort: item.orders,
            whetherRecorded: item.whetherRecorded

          }
        })
        arr.sort((n, m) => {
          return (n.sort - m.sort)
        })
        this.defectFourList = arr
        this.manageRestructuring()
      }).catch(() => {})
    },
    // 获取疵点信息列表数据（单匹）
    getInformationListData() {
      api.getInformationListData().then(res => {
        const arr = (res.data || []).map(item => {
          return {
            otherItemsId: item.id,
            otherItemsName: item.name,
            otherItemsUnit: item.unit,
            otherItemsValue: '',
            sort: item.orders,
            whetherRecorded: item.whetherRecorded,
            unit: item.unit
          }
        })
        arr.sort((n, m) => {
          return (n.sort - m.sort)
        })
        this.defectInformationList = arr
        this.manageRestructuring()
      }).catch(() => {})
    },
    // 进入页面进行判断处理数据
    manageData() {
      let qaDataObj = window.sessionStorage.getItem('qaOrderData')
      if (qaDataObj) {
        qaDataObj = JSON.parse(qaDataObj)
        this.type = qaDataObj.type
        this.isEdit = qaDataObj.isEdit
        if (!this.isEdit && this.popOperates.dataSource[0]) {
          this.popOperates.dataSource[0].style = { color: '#999999' }
        }

        if (qaDataObj.type === 'add') {
          if (qaDataObj.request) {
            this.getFourListData()
            this.getInformationListData()
          } else {
            const firstClothData = qaDataObj.data.qaFinishFabricRecordList ? qaDataObj.data.qaFinishFabricRecordList[0] : {} // 验布信息列表第一匹布的数据
            this.defectFourList = (firstClothData.finishFabricDefectFourList || []).map(item => {
              return {
                deductionItemsId: item.deductionItemsId,
                deductionItemsName: item.deductionItemsName,
                deductionItemsDistribution: '0/0/0/0',
                sort: item.sort
              }
            })

            this.defectInformationList = (firstClothData.finishFabricDefectInformationList || []).map(item => {
              return {
                otherItemsId: item.otherItemsId,
                otherItemsName: item.otherItemsName,
                otherItemsUnit: item.otherItemsUnit,
                otherItemsValue: '',
                sort: item.sort,
                whetherRecorded: item.whetherRecorded
              }
            })

            this.manageRestructuring()
          }
        } else {
          this.index = qaDataObj.index
          const clothData = qaDataObj.data.qaFinishFabricRecordList ? qaDataObj.data.qaFinishFabricRecordList[qaDataObj.index] : {}
          clothData.moistureTestArr = clothData.moistureTest ? clothData.moistureTest.split(',') : ['', '', '', '']
          this.orderData = JSON.parse(JSON.stringify(clothData))

          this.defectFourList = clothData.finishFabricDefectFourList
          this.defectInformationList = clothData.finishFabricDefectInformationList
          this.manageRestructuring()
          this.calculationResult()
        }

        const basicDataObj = qaDataObj.data.qaGreigeInspectionInfoResponse || {}
        this.basicData = basicDataObj
        this.orderData.realUnit = Number(basicDataObj.unit)
      }
    },
    // 点击取消按钮执行
    cancel() {
      this.$router.go(-1)
    },
    // 点击保存
    async submit() {
      // 获取数据
      // const productInfoData = this.$refs.productInfoData.$refs.basicData.form.model// 整缸记录数据
      // 校验表单
      this.$refs.productInfoData.$refs.basicData.form.validate(valid => {
        if (valid) {
          // this.$message({ type: 'success', message: '校验通过，可以提交!' })
          this.checkData()
        }
      })
    },
    checkData() {
      let str = ''
      const flag = this.defectInformationList.some(item => {
        str = item.otherItemsName
        return (Number(item.whetherRecorded) === 1 && !item.otherItemsValue)
      })
      if (flag) {
        str += '不能为空'
        this.$message.warning(str)
        return
      }
      const obj = {
        data: {
          ...this.order,
          finishFabricDefectFourList: this.defectFourList,
          finishFabricDefectInformationList: this.defectInformationList
        },
        type: this.type
      }
      if (this.type === 'update') {
        obj.index = this.index
      }
      delete obj.data.moistureTestArr
      window.sessionStorage.setItem('singleClothData', JSON.stringify(obj))
      this.$router.go(-1)
    },
    // 基础信息改变执行
    changeProduct(obj) {
      this.order = obj
      this.allCalculate()
    },
    // 点击疵点信息
    btn1Click(item, index) {
      if (!this.isEdit) return
      this.btnIndex1 = index
      this.$refs.myDialog.open(true, 1, item.deductionItemsDistribution, index)
    },
    // 点击疵点信息
    btn2Click(item, index) {
      if (!this.isEdit) return
      this.btnIndex2 = index
      if (Number(item.otherItemsUnit) === 3) {
        this.$refs.myDialog.open(true, 2, item.otherItemsValue, index)
      } else {
        this.defectAlert(item.otherItemsValue, index)
      }
    },
    // 疵点信息弹窗为input输入框的
    defectAlert(data, index) {
      this.$prompt('疵点信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPlaceholder: '请输入(1-9999.99) " or CM',
        inputValue: data,
        inputValidator: (value) => {
          const reg = /^[1-9]\d{0,3}(?:\.\d{0,2})?$/
          if (value && !reg.test(value)) {
            return '请输入(1-9999.99)'
          }
        }
      }).then(({ value }) => {
        this.defectInformationList[index].otherItemsValue = value.trim()
        this.manageRestructuring()
        this.allCalculate()
      }).catch(() => {})
    },
    // 疵点信息改变执行
    changeDefect(obj) {
      if (obj.type === 1) {
        this.defectFourList[obj.index].deductionItemsDistribution = obj.val
        this.calculationSum() // 总分
      } else {
        this.defectInformationList[obj.index].otherItemsValue = obj.val
      }
      this.manageRestructuring() // 把疵点信息的两个列表进行组合
      this.allCalculate() // 实码 平均分100码 结果
    },
    // 把疵点信息的两个列表进行组合
    async manageRestructuring() {
      // type 1为疵点四分 2位abc选项 3位input输入框
      const arr = []
      let dyelotNo = 0
      this.defectFourList.forEach((item, index) => {
        if (item.deductionItemsDistribution !== '0/0/0/0') {
          dyelotNo += 1
          const obj = {
            dyelotNo,
            name: item.deductionItemsName,
            score: this.allScore(item.deductionItemsDistribution),
            deductionItemsDistribution: item.deductionItemsDistribution,
            numOrLevel: '',
            type: 1,
            unit: '',
            index
          }
          arr.push(obj)
        }
      })
      this.defectInformationList.forEach((item, index) => {
        if (item.otherItemsValue) {
          dyelotNo += 1
          let type = 3
          if (Number(item.otherItemsUnit) === 3) {
            type = 2
          }
          const obj = {
            dyelotNo,
            name: item.otherItemsName,
            score: '',
            deductionItemsDistribution: '',
            numOrLevel: item.otherItemsValue,
            type,
            unit: item.unit,
            index
          }
          arr.push(obj)
        }
      })
      console.log(arr)
      this.dataSource = arr
    },
    // 扣分
    allScore(data) {
      let num = 0
      if (data) {
        const arr = data.split('/').map(Number)
        arr.forEach(n => {
          num += n
        })
      }
      return (num || '')
    },
    // 计算实码
    calculationRealCode() {
      let num = 0
      // 实码（实测码长）=重量(KG)/0.000824/回后克重/边封(")*16   括号内的单位是标准单位，上游如果传递非标准需要转换
      if (this.order.weight && this.order.returnFabricWeight && this.order.realBorderWidth) {
        let realBorderWidthVal = Number(this.order.realBorderWidth)
        if (this.order.realUnit === 2) {
          realBorderWidthVal = realBorderWidthVal / 2.54
        }
        num = Number((Number(this.order.weight) / 0.000824 / Number(this.order.returnFabricWeight) / realBorderWidthVal * 16).toFixed(10))
      }
      this.order.realCodeLength = num
    },
    // 计算平均分100码
    calculationAverageHundred() {
      let num = 0
      // 平均分100码=总分/实码/实封(")*3600
      if (this.order.sumnumber && this.order.realCodeLength && this.order.realWidth) {
        let realWidthVal = Number(this.order.realWidth)
        if (this.order.realUnit === 2) {
          realWidthVal = realWidthVal / 2.54
        }
        num = Number((Number(this.order.sumnumber) / Number(this.order.realCodeLength) / realWidthVal * 3600).toFixed(2))
      }
      this.order.averageHundred = num
    },
    // 计算总分
    calculationSum() {
      let num = 0
      this.defectFourList.forEach(item => {
        const str = item.deductionItemsDistribution || ''
        const arr = str.split('/').map(Number)
        arr.forEach(n => {
          num += n
        })
      })
      this.order.sumnumber = num
    },
    // 计算结果
    calculationResult() {
      // 验布结果=A/B/C，通过如下三个条件判定
      // 1、布匹信息只要有一项不合格为C。
      // 2、疵点信息ABC取最低值。
      // 3、【（A：平均分100码<29）,(B：平均分100码>=29<40)，（C：平均分100码>=40）】

      const resultArr = []
      // 实封或边封的比较值
      let maxNum = Number(this.basicData.realWidth) + Number(this.basicData.widthRangeName)
      let minNum = Number(this.basicData.realWidth) - Number(this.basicData.widthRangeName)

      // 实封
      if (this.order.realWidth) {
        const realWidthVal = Number(this.order.realWidth)
        if (realWidthVal <= maxNum && realWidthVal >= minNum) {
          resultArr.push('A')
          this.qualifiedObj.isRealWidth = 1
        } else {
          resultArr.push('C')
          this.qualifiedObj.isRealWidth = 0
        }
      }

      // 边封
      if (this.order.realBorderWidth) {
        const realBorderWidthVal = Number(this.order.realBorderWidth)
        if (realBorderWidthVal <= maxNum && realBorderWidthVal >= minNum) {
          resultArr.push('A')
          this.qualifiedObj.isRealBorderWidth = 1
        } else {
          resultArr.push('C')
          this.qualifiedObj.isRealBorderWidth = 0
        }
      }

      maxNum = Number(this.basicData.realWeight) + Number(this.basicData.weightRangeName)
      minNum = Number(this.basicData.realWeight) - Number(this.basicData.weightRangeName)

      // 克重
      if (this.order.fabricWeight) {
        const fabricWeightVal = Number(this.order.fabricWeight)
        if (fabricWeightVal <= maxNum && fabricWeightVal >= minNum) {
          resultArr.push('A')
          this.qualifiedObj.isFabricWeight = 1
        } else {
          resultArr.push('C')
          this.qualifiedObj.isFabricWeight = 0
        }
      }

      // 回后克重
      if (this.order.returnFabricWeight) {
        const returnFabricWeightVal = Number(this.order.returnFabricWeight)
        if (returnFabricWeightVal <= maxNum && returnFabricWeightVal >= minNum) {
          resultArr.push('A')
          this.qualifiedObj.isReturnFabricWeight = 1
        } else {
          resultArr.push('C')
          this.qualifiedObj.isReturnFabricWeight = 0
        }
      }

      // 含潮测试
      const flag = (this.order.moistureTestArr || []).some(n => {
        return (n && n > 0)
      })
      if (!resultArr.includes('C') && flag) {
        const standardMoistureArr = this.basicData.standardMoisture ? this.basicData.standardMoisture.split('-') : ['', '']
        let num = 0
        let averageNum = 0
        this.order.moistureTestArr.forEach(n => {
          averageNum += Number(n)
          if (n && n > 0) {
            num += 1
          }
        })
        averageNum = (averageNum / num).toFixed(2) - 0
        if (averageNum >= Number(standardMoistureArr[0]) && averageNum <= Number(standardMoistureArr[1])) {
          resultArr.push('A')
        } else {
          resultArr.push('C')
        }
      }

      // 疵点信息
      if (!resultArr.includes('C') && this.defectInformationList && this.defectInformationList.length) {
        let str = ''
        let arr = this.defectInformationList.filter(item => {
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
      if (!resultArr.includes('C') && this.order.averageHundred) {
        let str = ''
        if (this.order.averageHundred < 29) {
          str = 'A'
        } else if (this.order.averageHundred >= 29 && this.order.averageHundred < 40) {
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

      this.order.fabricResult = resultArr[0] || ''
    },
    async allCalculate() {
      this.calculationRealCode() // 实码
      this.calculationAverageHundred() // 计算平均分100码
      this.calculationResult() // 结果
    }
  }
}
</script>
<style lang="scss" scoped>
  .product-list-ipad-fixed{
    background-color: #eef5f9;
    box-sizing: border-box;
    overflow: hidden;
    width: 100%;
    height: 100%;
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
        border:1px solid #D4E8FB;
        color:#0F5EAB;
      }
    }
    .product-list-main-ipad{
      padding: 15px;
      box-sizing: border-box;
      height: calc(100% - 50px);
      overflow: hidden;
      // background-color: #CCCCCC;
      /deep/ .el-form-item {
        margin-bottom: 14px;
      }
    }
    .product-list-main-ipad-disable{
      height: calc(100% - 40px);
    }
    .page-table{
      height: auto;
    }
    /deep/ .el-table__body tr.current-row > td{
      background-color: #000000;
    }

  }
  .pibu-detail{
    height: 100%;
    overflow: hidden;
    .title-max{
      font-size: 16px;
      color: #151222;
      height: 57px;
      line-height: 57px;
      border-bottom: 1px solid #EEEFF0;
      padding: 0 20px;
      margin-bottom: 20px;
    }
    .statu-bar{
      height: 65px;
      display: flex;
      align-items: center;
      font-size: 12px;
      color: #666666;
      font-weight: 400;
      box-sizing: border-box;
      .order-num{
        font-size: 18px;
        color: #151222;
        font-weight: 500;
      }
      span{
        margin-left: 10px;
      }
    }
    .defect-title{
      height: 40px;
      line-height: 40px;
      width: 100%;
      padding: 0 20px;

    }
    .defect-box{
      display: flex;
      font-size: 14px;
      height: calc(100% - 145px);
      overflow: hidden;
      width: 100%;
      box-sizing: border-box;
      .defect-left{
        width: calc(60% - 16px);
        background-color: #FFFFFF;
        padding: 10px;
        box-sizing:border-box;
        margin-right: 16px;
        box-shadow: 0px 7px 14px 0px rgba(187,194,208,0.3);
        height: 100%;
        overflow: hidden;
        overflow-y: auto;
        .defect-item{
          display: flex;
          flex-wrap: wrap;
          .defect-btn{
            padding: 5px;
            cursor: pointer;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            .btn-item{
              height: 40px;
              width: 135px;
              border-radius: 20px;
              border: 1px solid #FF4444;
              background-color: #FFFFFF;
              color: #FF4444;
              font-weight: 500;
              cursor: pointer;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              padding: 0 5px;
              line-height: 40px;
              text-align: center;
              font-size: 16px;
              &.active{
                background: #FFE8E8;
                border: 1px solid #FF4444;
              }
            }
            .btn-item-1{
              border: 1px solid #00AEB6;
              color: #00AEB6;
              &.active{
                background: #dbf4f5;
                border: 1px solid #00AEB6;
              }
            }
          }
        }
      }
      .defect-right{
        // padding: 10px;
        // box-sizing: border-box;
        width: 40%;
        background-color: #FFFFFF;
        box-shadow: 0px 7px 14px 0px rgba(187,194,208,0.3);
        overflow: hidden;
        height: 100%;
        .table{
          height: calc(100% - 50px);
          overflow: hidden;
          overflow-y: auto;
          padding: 10px;
          box-sizing:border-box;
        }
        .table-bootm{
          padding: 0 10px;
          border-top: 1px solid #e6ebf5;
          .result{
            height: 44px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 14px;
            color: #3C4043;
            .result-item{
              span{
                font-size: 18px;
                color: #FF9214;
                font-weight: 500;
              }
            }
          }

        }
      }
      /deep/ .cell{
        font-size: 16px;
      }
    }
    .result-btn{
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #FFFFFF;
      border-top: 1px solid #eef5f9;
    }

  }
  /deep/ .el-form-item__label{
    font-size: 16px;
  }
  .button-group {
    width: calc(100% - 210px);
    transition: width 0.28s;
    position: fixed;
    text-align: center;
    bottom: 0;
    padding: 10px;
    background: #ffffff;
    border-top: 1px solid #ecf0f3;
    z-index: 999;
    right: 0;
    .button {
      margin-right: 12px;
    }
  }
  .fixed-footer {
    width: calc(100% - 54px) !important;
  }
  //查看状态
  .pibu-detail-disable{
    .data-info{
      background-color: #FFFFFF;
       /deep/ .el-form-item__label{
         color: #888E9E;
      }

    }
  }
</style>
<style lang="scss">

</style>
