<template>
  <div class="product-info" :class="getIsEdit?'':'product-info-disable'">
    <div class="data-info finished-ipad-data-info">
      <div class="title-max">基本信息</div>
      <cs-custom-form ref="basicData" :data-source="basicCommon" :options="formOptions" :form-datas="recordDatas" />
    </div>
    <div class="data-info form-color finished-ipad-record" style="margin-top: 15px;">
      <div class="title-max">整缸记录</div>
      <div class="btn-box" style="margin-bottom: 0;">
        <div class="radio-group-box">
          <el-form ref="recordData" size="mini" :model="recordDatas" label-width="130px" class="ipad-ruleForm" style="display: flex;align-items: center;flex-wrap: wrap;width: 100%;">
            <div v-for="(item,index) in recordDatas.qaFinishFabricDefectInformationList" :key="index" class="radio-group-item">
              <el-form-item
                v-if="Number(item.otherItemsUnit)===3"
                :key="index"
                :prop="'qaFinishFabricDefectInformationList.'+ index +'.otherItemsValue'"
                :label="item.otherItemsName+':'"
                :rules="item.whetherRecorded?[
                  { required: true, message: '此项不能为空', trigger: 'change' },
                ]:[]"
              >
                <el-radio-group v-if="isEdit" v-model="item.otherItemsValue" @change="radioChange($event, index, true)">
                  <el-radio label="A">A</el-radio>
                  <el-radio label="B">B</el-radio>
                  <el-radio label="C">C</el-radio>
                </el-radio-group>
                <span v-if="!isEdit" :title="item.remark">{{ item.otherItemsValue }}{{ item.remark ? `（${item.remark}）` :'' }}</span>
              </el-form-item>
              <el-form-item
                v-else
                :key="index"
                :label="item.otherItemsName+':'"
                :prop="'qaFinishFabricDefectInformationList.'+ index +'.otherItemsValue'"
                :rules="item.whetherRecorded?[
                  { required: true, message: '此项不能为空', trigger: 'blur' },
                  { pattern: /^[1-9]\d{0,3}(?:\.\d{0,2})?$/, message: '请输入1-9999.99' }
                ]:[]"
              >
                <el-input v-if="isEdit" v-model="item.otherItemsValue" size="small" @input="radioChange($event, index, false)" />
                <span v-if="!isEdit">{{ item.otherItemsValue }}</span>
              </el-form-item>

            </div>
          </el-form>
        </div>
      </div>
    </div>
    <div class="data-info form-color" style="margin-top: 15px;">
      <div class="title-max" style="position: relative;">
        验布结果
        <div class="grade-text">等级 <span style="color: #FF9214 ;">{{ recordDatas.fabricResult || '' }}</span></div>
      </div>
      <div class="grade-wrap">
        <cs-custom-form ref="resultData" :data-source="resultCommon" :options="formOptions1" :form-datas="recordDatas" />
      </div>
    </div>
  </div>
</template>

<script>
import uploadSlotTrigger from '../detail/components/upload-slot-trigger.vue'
import uploadFile from './uploa-file.vue'
import * as api from '../api/index.js'

export default {
  props: {
    data: {
      type: Object
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    // 公用验证正则
    const commonChangeReg = this.$getRules({})
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    const itemStyle = { 'width': '30%' }
    // 基本信息
    const basicCommon = {
      _dyelotNo: {
        prop: 'dyelotNo',
        itemType: 'itemview',
        // itemType: this.inputTypeChange,
        label: '缸号:',
        popoverOptions: {}
      },
      _productOrderNo: {
        prop: 'productOrderNo',
        itemType: 'itemview',
        // itemType: this.inputTypeChange,
        label: '生产订单:',
        popoverOptions: {},
        renderContent: this.renderContent
      },
      _factoryName: {
        prop: 'factoryName',
        itemType: 'itemview',
        // itemType: this.inputTypeChange,
        label: '染印厂:',
        // renderContent: this.renderContent,
        popoverOptions: {},
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          const str = formDatas.qaGreigeInspectionInfoResponse.factoryName || ''
          return `<div class="render-content" title='${str}' >${str}</div>`
        }
      },
      _fabricType: {
        prop: 'fabricType',
        itemType: 'itemview',
        // itemType: this.inputTypeChange,
        label: '布类:',
        // renderContent: this.renderContent,
        popoverOptions: {},
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          const str = formDatas.qaGreigeInspectionInfoResponse.fabricType || ''
          return `<div class="render-content" title='${str}' >${str}</div>`
        }
      },
      _customerColor: {
        prop: 'customerColor',
        itemType: 'itemview',
        // itemType: this.inputTypeChange,
        label: '客户颜色:',
        popoverOptions: {},
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          const str = formDatas.qaGreigeInspectionInfoResponse.customerColor || ''
          return `<div class="render-content" title='${str}' >${str}</div>`
        }
      },
      _ingredientsName: {
        prop: 'ingredientsName',
        itemType: 'itemview',
        // itemType: this.inputTypeChange,
        label: '布封/克重（公差）:',
        popoverOptions: {},
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          const data = formDatas.qaGreigeInspectionInfoResponse
          const str = (data.realWidth || data.realWeight) ? (data.realWidth || '') + (data.unit === 2 ? 'CM' : '"') + '/±' + (data.widthRangeName || 0) + ' - ' + (data.realWeight || '') + 'g/㎡/±' + (data.weightRangeName || 0) : ''
          return `<div class="render-content" title='${str}' >${str}</div>`
        }
      },
      _realAverageWidth: {
        prop: 'realAverageWidth',
        itemType: 'itemview',
        // itemType: this.inputTypeChange,
        label: '实际平均幅宽:',
        popoverOptions: {},
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          const str = formDatas.realAverageWidth ? formDatas.realAverageWidth + (formDatas.qaGreigeInspectionInfoResponse.unit === 1 ? '"' : 'CM') : ''
          // 0不合格 1合格
          if (formDatas.qualifiedWidth === 0 && !this.isEdit) { // 不合格
            return `<div class="render-content">${str}<span style="color: #FF574F">(不合格)</span></div>`
          }
          if (formDatas.qualifiedWidth === 1 && !this.isEdit) { // 不合格
            return `<div class="render-content">${str}<span style="color: #00C4CD">(合格)</span></div>`
          }
          return str
        }
      },
      _realAverageWeight: {
        prop: 'realAverageWeight',
        itemType: 'itemview',
        // itemType: this.inputTypeChange,
        label: '实际平均克重:',
        // renderContent: this.renderContent,
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          const str = formDatas.realAverageWeight ? formDatas.realAverageWeight + 'g/㎡' : ''
          // 0不合格 1合格
          if (formDatas.qualifiedWeight === 0 && !this.isEdit) { // 不合格
            return `<div class="render-content">${str}<span style="color: #FF574F">(不合格)</span></div>`
          }
          if (formDatas.qualifiedWeight === 1 && !this.isEdit) { // 不合格
            return `<div class="render-content">${str}<span style="color: #00C4CD">(合格)</span></div>`
          }
          return str
        }
      },
      _castVatQtyAndCastVatVolumes: {
        prop: 'castVatQtyAndCastVatVolumes',
        itemType: 'itemview',
        // itemType: this.inputTypeChange,
        label: '总匹/总重（投坯）:',
        // renderContent: this.renderContent,
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          const str = (formDatas.qaGreigeInspectionInfoResponse.castVatVolumes || '') + (formDatas.qaGreigeInspectionInfoResponse.castVatVolumes || formDatas.qaGreigeInspectionInfoResponse.castVatQty ? '/' : '') + (formDatas.qaGreigeInspectionInfoResponse.castVatQty || '') + 'KG'
          return str
        }
      },
      _finishQtyAndFinishVolumes: {
        prop: 'finishQtyAndFinishVolumes',
        itemType: 'itemview',
        // itemType: this.inputTypeChange,
        label: '总匹/总重（成品）:',
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          const str = (formDatas.qaGreigeInspectionInfoResponse.finishVolumes || '') + (formDatas.qaGreigeInspectionInfoResponse.finishVolumes || formDatas.qaGreigeInspectionInfoResponse.finishQty ? '/' : '') + (formDatas.qaGreigeInspectionInfoResponse.finishQty || '') + 'KG'
          return str
        }
      },
      _standardMoisture: {
        prop: 'standardMoisture',
        itemType: 'itemview',
        // itemType: this.inputTypeChange,
        label: '标准含潮率:',
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          const str = formDatas.qaGreigeInspectionInfoResponse.standardMoisture || ''
          return str
        }
      },
      _realMoisture: {
        prop: 'realMoisture',
        itemType: 'itemview',
        // itemType: this.inputTypeChange,
        label: '实际平均含潮率:',
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          const str = formDatas.realMoisture ? formDatas.realMoisture : ''
          // 0不合格 1合格
          if (formDatas.qualifiedMoisture === 0 && !this.isEdit) { // 不合格
            return `<div class="render-content">${str}<span style="color: #FF574F">(不合格)</span></div>`
          }
          if (formDatas.qualifiedMoisture === 1 && !this.isEdit) { // 不合格
            return `<div class="render-content">${str}<span style="color: #00C4CD">(合格)</span></div>`
          }
          return str
        }
      },
      _inspectionRate: {
        prop: 'inspectionRate',
        itemType: 'itemview',
        // itemType: this.inputTypeChange,
        itemStyle,
        label: '检验率:',
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          const str = formDatas.inspectionRate ? formDatas.inspectionRate + '%' : ''
          return str
        }
      }

    }

    // 验布结果
    const resultCommon = {
      _fabricResultProblemArr: {
        prop: 'fabricResultProblemArr',
        itemType: this.checkboxGroupTypeChange,
        label: '问题类型:',
        isShow: () => {
          return this.recordDatas.fabricResult === 'C'
        },
        rules: [commonChangeReg],
        dataSource: [],
        // renderContent: this.renderContent,
        change: (value) => {
          this.changeEmitData({
            fabricResultProblemArr: value,
            fabricResultProblem: value.join(',')
          })
        },
        renderContent: (arr) => arr ? arr.join() : ''
      },
      _attachmentList: {
        prop: 'attachmentList',
        itemType: this.uploadTypeChange,
        label: '上传附件:',
        className: 'sub-list-upload-attachment',
        itemStyle: { 'width': '100%', 'margin-top': '10px !important', 'border': 'none', 'height': 'auto', 'padding': '0', 'background': '#fff' },
        isShow: () => { return this.isEdit },
        handle: (value) => {
          console.log(value)
        },
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return this.renderFileContent(formDatas.attachmentList)
        },
        onSuccess: (res, file, fileList) => {
          const resData = res.data || {}
          resData.name = resData.originalName
          const attachmentList = this.recordDatas.attachmentList || []
          attachmentList.push(resData)
          this.changeEmitData({
            attachmentList: [...attachmentList]
          })
          this.$message.success('导入成功')
        },
        onExceed: (files, fileList) => {
          this.$message.warning(`当前限制选择 6 个文件`)
        },
        beforeRemove: (file, fileList) => {
          (this.recordDatas.attachmentList || []).forEach((item, index) => {
            if (item.uid === file.uid) {
              this.recordDatas.attachmentList.splice(index, 1)
            }
          })
          this.changeEmitData({
            attachmentList: [...this.recordDatas.attachmentList]
          })
        },
        action: `/common/file/upload`,
        data: {
          bizId: this.id || '',
          bizType: 'QAPUBLIC'
        },
        accept: '',
        showFileList: true,
        fileList: this.fileList,
        limit: 6,
        timeout: 30000,
        content: [
          {
            slot: 'trigger',
            component: uploadSlotTrigger
          }
        ]
      },
      _attachmentProp: {
        isShow: () => { return !this.isEdit },
        components: {
          uploadFile
        },
        componentsOptions: {
          prop: 'attachmentList',
          label: '上传附件:',
          url: 'attachmentList'
        }
      },
      _comment: {
        prop: 'comment',
        itemType: this.inputTypeChange,
        label: '评论:',
        rules: [commonChangeReg],
        maxlength: 200,
        type: 'textarea',
        itemStyle: { 'width': '100%', 'margin-top': '20px' },
        trim: (value) => {
          return value
        },
        autosize: { minRows: 4, maxRows: 8 },
        placeholder: '请填写评论...',
        change: (value) => {
          this.changeEmitData({
            comment: value
          })
        }
      }
    }

    return {
      commonChangeReg,
      commonBlurReg,
      itemStyle,
      basicCommon,
      recordCommon: [],
      resultCommon,
      formOptions: {
        inline: true,
        labelWidth: '160px',
        popError: true,
        size: 'small',
        validate: (flag, res, err) => {

        }
      },
      formOptions1: {
        inline: true,
        labelWidth: '120px',
        popError: true,
        size: 'mini',
        validate: (flag, res, err) => {

        }
      },
      recordDatas: {}, // 整缸记录数据
      fileList: [],
      dataCompare: {}// 拷贝原数据做日志前后对比

    }
  },
  computed: {
    getIsEdit() {
      return this.isEdit
    },
    isShowBtn() {
      if (this.recordDatas.status === 0 || this.recordDatas.status === 1) {
        return true
      } else {
        return false
      }
    }
  },
  watch: {
    'data': {
      handler(val, oldVal) {
        this.recordDatas = JSON.parse(JSON.stringify(val))
        this.dataCompare = this.$utils.deepClone(val)
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.getProblemTypeData()
  },
  methods: {
    renderFileContent(data) {
      let str = ''
      if (data && data.length) {
        data.forEach(item => {
          str += `<img style="width: 34px; height: 34px;margin-right: 10px; float: left;" src="${item.viewUrl}">`
        })
      }
      return str
    },
    // 编辑按钮，切换编辑状态
    checkEdit() {
      this.$emit('checkEdit', !this.isEdit)
    },
    // 获取问题类型数据
    getProblemTypeData(data) {
      api.getProblemType().then(res => {
        this.resultCommon._fabricResultProblemArr.dataSource = (res.data || []).map(item => {
          return {
            label: item.name,
            value: item.name
          }
        })
      }).catch(() => {})
    },
    changeEmitData(obj = {}) {
      let datas = JSON.parse(JSON.stringify(this.recordDatas))
      datas = {
        ...datas,
        ...obj
      }
      this.$emit('update:data', datas)
    },
    async submit(saveOrSubmit) {
      // 校验表单
      if (!this.recordDatas.qaFinishFabricRecordList || !this.recordDatas.qaFinishFabricRecordList.length) {
        this.$message.warning('至少添加一匹布')
        return
      }
      await this.verificationFun()

      // 获取数据
      let attachmentName = (this.recordDatas.attachmentList || []).map(item => {
        return item.id
      })
      attachmentName = attachmentName.join(',')
      const datas = {
        ...this.recordDatas,
        attachmentName,
        saveOrSubmit
      }
      delete datas.fabricResultProblemArr
      api.saveOrSubmitData(datas).then(res => {
        this.$router.go(-1)
        // 日志
        const { beforeCode, afterCode } = this.$utils.compareData(this.dataCompare, datas, 'id')
        const description = {
          beforeText: `在'质量管理-成品验布'将${JSON.stringify({ 'id': this.recordDatas.id })}`,
          afterText: '修改为',
          ...{ beforeCode, afterCode }
        }
        this.$store.dispatch('app/fetchParamsLog', { params: datas, opratorType: 'UPDATE', api: '/qa/qaFinishFabricInspectionTask/modify', description, appId: 'qa' })
      }).catch(() => {})
    },
    // 表单验证 fun
    verificationFun() {
      return new Promise((res, rej) => {
        Promise.all([
          new Promise((resolve, reject) => {
            this.$refs.recordData.validate((valid, obj) => {
              if (valid) {
                resolve()
              } else {
                reject(obj)
              }
            })
          }),
          new Promise((resolve, reject) => {
            this.$refs.resultData.form.validate((valid, obj) => {
              if (valid) {
                resolve()
              } else {
                reject(obj)
              }
            })
          })
        ]).then(e => {
          res()
        }).catch(e => {
          // this.$message.error('缸号信息必填项目未填写')
          this.$emit('isActive')
        })
      })
    },
    radioChange(e, i, bool = false) {
      const qaFinishFabricDefectInformationList = this.recordDatas.qaFinishFabricDefectInformationList
      if (e === 'C' && Number(qaFinishFabricDefectInformationList[i].otherItemsUnit) === 3) {
        this.$prompt('选择C必填异常原因(1-100字)', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPlaceholder: '请填写异常原因',
          inputErrorMessage: '请填写异常原因',
          inputValue: '',
          inputType: 'textarea',
          inputValidator: (value) => {
            if (!value) {
              return '异常原因不能为空'
            } else if (value.length > 100) {
              return '异常原因字符为100字'
            }
          }
        }).then(({ value }) => {
          qaFinishFabricDefectInformationList[i].remark = value
          this.emitFun(qaFinishFabricDefectInformationList, bool)
        }).catch((value) => {
          qaFinishFabricDefectInformationList[i].otherItemsValue = ''
          this.emitFun(qaFinishFabricDefectInformationList, bool)
        })
      } else {
        if (bool) {
          qaFinishFabricDefectInformationList[i].remark = ''
          this.emitFun(qaFinishFabricDefectInformationList, bool)
        } else {
          if (this.timeStr) {
            clearTimeout(this.timeStr)
          }
          this.timeStr = setTimeout(() => {
            this.emitFun(qaFinishFabricDefectInformationList, bool)
          }, 300)
        }
      }
    },
    emitFun(qaFinishFabricDefectInformationList, bool) {
      this.changeEmitData({
        qaFinishFabricDefectInformationList
      })
      this.$emit('changeRadio', bool)
    },
    renderContent(value, options, form, formDatas, setFormDatas, scope) {
      return value || ''
    },
    inputTypeChange() {
      return this.isEdit ? 'input' : 'itemview'
    },
    selectTypeChange() {
      return this.isEdit ? 'select' : 'itemview'
    },
    uploadTypeChange() {
      return this.isEdit ? 'upload' : 'itemview'
    },
    checkboxGroupTypeChange() {
      return this.isEdit ? 'checkbox-group' : 'itemview'
    }
  }
}
</script>

<style lang="scss" scoped>
  .product-info{
    .data-info{
      padding: 20px 0;
      padding-top: 0;
      background-color: #FFFFFF;
      box-shadow: 0px 7px 14px 0px rgba(187,194,208,0.3);
       /deep/ .el-form-item{
        margin-bottom: 0px;
      }
      /deep/ .el-form-item__content{
        color: #474747;
        font-size: 16px;
      }
    }
    .finished-ipad-record{
      /deep/ .el-form-item{
        margin-bottom: 10px;
      }
    }
    /deep/ .custom-form{
      width: 100%;
    }
    /deep/ .el-textarea__inner{
      font-size: 16px;
    }
    /deep/ .el-upload-list__item-name{
      font-size: 16px;
    }
    /deep/ .el-input__inner{
      font-size: 16px;
    }
    .title-max{
      font-size: 16px;
      color: #151222;
      height: 45px;
      line-height: 45px;
      border-bottom: 1px solid #EEEFF0;
      padding: 0 20px;
      margin-bottom: 10px;
    }
    .btn-box{
      margin-bottom: 20px;
      .btn-lable{
        width: 100px;
        text-align: right;
        margin-right: 10px;
        font-size: 14px;
        color: #474747;
      }
    }
    .btn-box{
      display: flex;
      align-items: center;
      width: 100%;
      flex-wrap: wrap;
    }
    .btn-item{
      display: flex;
      align-items: center;
      width: 30%;
      margin-bottom: 15px;
    }

    .grade-wrap{
      padding: 0 20px;
      box-sizing: border-box;
      font-size: 14px;
      /deep/ .el-upload-list__item {
        transition: none !important;
      }
      /deep/ .el-form-item {
        margin-bottom: 10px;
      }
      /deep/ .el-textarea {
        margin-bottom: 10px;
      }
    }
    .grade-text{
      position: absolute;
      right: 20px;
      top: 0;
      font-size: 14px;
      color: #474747;
    }
    .form-color{
      background-color: #FFFFFF;
       /deep/ .el-form-item__label{
         color: #474747 !important;

      }
    }
    //媒体查询ipad
    @media only screen and (min-device-width: 768px) and (max-device-width: 1024px) {
      //整缸信息 基本信息
      .finished-ipad-data-info{
        .custom-form{
          /deep/ .el-form-item{
            width: calc(50% - 10px);
          }
        }
      }
      //整缸记录
      .ipad-ruleForm{
        .radio-group-item{
           width: calc(50% - 10px);
           /deep/ .el-form-item__error{
             top: 77%;
           }
           /deep/ .el-form-item {
             margin-bottom: 0;
           }
        }
      }

     }
     @media screen and (min-width: 769px){
       //整缸信息 基本信息
       .finished-ipad-data-info{
         .custom-form{
           /deep/ .el-form-item{
             width: calc(30% - 10px);
           }
         }
       }
     }
     @media screen and (min-width: 1024px){
       //整缸记录
       .ipad-ruleForm{
         .radio-group-item{
            width: calc(30% - 10px);
         }
       }

     }
     @media screen and (min-width: 1336px){
       //整缸记录
       .ipad-ruleForm{
         .radio-group-item{
            width: calc(25% - 10px);
         }
       }

     }
     .ipad-ruleForm{
       /deep/ .el-radio{
         margin-right: 15px;
       }
     }

     /deep/ .el-form-item__label{
       flex-shrink: 0;
       font-size: 16px;
     }
     /deep/ .render-content{
       overflow: hidden;
       text-overflow: ellipsis;
       white-space: nowrap;
     }
     .radio-group-box{
       display: flex;
       align-items: center;
       width: 100%;
       .radio-group-item{
         display: flex;
         align-items: center;
         .radio-group-lable{
           width: 130px;
           flex-shrink: 0;
           text-align: right;
           font-size: 14px;
           color: #474747;
           margin-right: 10px;
         }
         /deep/ .el-form-item{
           width: 100%;
         }
         /deep/ .el-form-item__content>span{
           display: block;
           white-space: nowrap;
           overflow: hidden;
           text-overflow: ellipsis;
           width: 100%;
         }
         /deep/ .el-form-item__label{
           overflow: hidden;
           text-overflow: ellipsis;
           white-space: nowrap;
         }
       }
     }
  }
  //查看状态
  .product-info-disable{
    .data-info{
      background-color: #FFFFFF;
       /deep/ .el-form-item__label{
         color: #888E9E;
      }
    }
  }
  .result-btn{
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    margin-top: 40px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #FFFFFF;
    border-top: 1px solid #eef5f9;
  }
</style>
<style lang="scss">
  .sub-list-upload-attachment{
    display: flex;
    .el-upload-list{
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      margin-left: 30px;
      .el-upload-list__item{
        width: calc(30% - 15px);
        margin-right: 15px;
      }
      .el-upload-list__item:first-child{
        margin-top: 5px;
        margin-right: 15px;
      }
    }
    @media screen and (min-width: 1024px){
      .el-upload-list{
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        margin-left: 30px;
        .el-upload-list__item{
          width: calc(25% - 15px);
          margin-right: 15px;
        }
        .el-upload-list__item:first-child{
          margin-top: 5px;
          margin-right: 15px;
        }
      }

    }
    @media screen and (min-width: 1336px){
      .el-upload-list{
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        margin-left: 30px;
        .el-upload-list__item{
          width: calc(20% - 15px);
          margin-right: 15px;
        }
        .el-upload-list__item:first-child{
          margin-top: 5px;
          margin-right: 15px;
        }
      }

    }

  }
</style>
