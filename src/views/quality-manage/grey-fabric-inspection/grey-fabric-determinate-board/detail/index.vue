<template>
  <div class="grey-fabric-determinate-board-detail" :style="isShowButtonGroup ? 'padding-bottom: 77px;' : 'padding-bottom: 20px;'">
    <div class="top-message">
      <div>任务编号: <span class="task-number">{{ taskNumber }}</span></div>
      <div class="right-text">
        <span v-if="baseFormDatas.createName" class="human-type">创建人: {{ (baseFormDatas.createName || '') + ' ' + (baseFormDatas.createdTime ? $filters.parseTime(baseFormDatas.createdTime + '', '{y}-{m}-{d} {h}:{i}') : ' ') }} </span>
        <span v-if="baseFormDatas.swatchesUserName" class="human-type">确板员: {{ (baseFormDatas.swatchesUserName || '') + ' ' + (baseFormDatas.swatchesUserHandledTime ? $filters.parseTime(baseFormDatas.swatchesUserHandledTime + '', '{y}-{m}-{d} {h}:{i}') : '') }} </span>
        <span v-if="baseFormDatas.processUserName" class="human-type">工艺员: {{ (baseFormDatas.processUserName || '') + ' ' + (baseFormDatas.processTime ? $filters.parseTime(baseFormDatas.processTime + '', '{y}-{m}-{d} {h}:{i}') : '') }} </span>
        <span v-if="baseFormDatas.cancelUserName" class="human-type">取消人: {{ (baseFormDatas.cancelUserName || '') + ' ' + (baseFormDatas.cancelTime ? $filters.parseTime(baseFormDatas.cancelTime + '', '{y}-{m}-{d} {h}:{i}') : '') }} </span>
        <span class="status" :style="{color: getColorByStatus ? getColorByStatus.color : ''}">{{ getColorByStatus ? getColorByStatus.label : '' }}</span>
      </div>
    </div>
    <div class="base-info">
      <div class="base-info-title">基本信息
        <el-select v-if="editionArrayData.length" v-model="editionValue" size="small" style="margin-left: 20px; width: 100px;" placeholder="请选择" @change="editionChange">
          <el-option
            v-for="item in editionArrayData"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <!-- 基本信息表单 -->
      <div class="baseInfoForm" :class="{baseInfo:!isEdit}">
        <cs-custom-form ref="baseSearchForm" :data-source="baseData" :options="formOtions" :form-datas="baseFormDatas" />
      </div>
    </div>
    <div class="raw-material-information">
      <div class="title">原料信息<span class="YarnLengthUnit">纱长单位: {{ YarnLengthUnit }}</span></div>
      <cs-custom-form ref="rawMaterialSearchForm" :data-source="rawMaterialData" :options="rawMaterialFormOtions" :form-datas="rawMaterialFormDatas" />
    </div>
    <div class="interval-information">
      <div class="title">间条信息</div>
      <cs-custom-form ref="intervalSearchForm" :data-source="intervalData" :options="intervalFormOtions" :form-datas="intervalFormDatas" />
    </div>
    <div class="task-dynamics">
      <div class="title">任务动态</div>
      <cs-custom-form ref="taskDynamicsSearchForm" :data-source="taskDynamicsData" :options="taskDynamicsFormOtions" :form-datas="taskDynamicsFormDatas" />
    </div>

    <!-- 实测纱长pop弹出框 -->
    <div class="pop">
      <cs-custom-pop ref="popOptions" :options="popOptions" />
    </div>
    <!-- 取消任务pop弹出框 -->
    <div class="pop">
      <cs-custom-pop ref="popOptions" :options="cancelTaskpopOptions" />
    </div>
    <!-- 底部按钮 -->
    <div v-if="isShowButtonGroup" :class="{ 'fixed-footer': !sidebar }" class="status-button-group">
      <!-- <status-button :is-copy="isCopy" :get-detail-data="getDetailData" :set-active-name="setActiveName" :is-edit="getEditabled" :data="allOrderIndexData" :clothing-form="clothingForm" /> -->
      <!-- <status-button /> -->
      <el-button v-if="isShowSave" type="primary" @click="save">保存</el-button>
      <el-button v-if="isShowSaveAndSubmit" type="primary" @click="saveAndSubmit">保存并提交</el-button>
      <el-button v-if="isShowSaveAndExamine" type="primary" @click="saveAndExamine">保存并审核</el-button>
      <el-button v-if="isShowEdit" type="primary" @click="edit">编辑</el-button>
      <el-button v-if="isShowExamine" type="primary" @click="examine">审核</el-button>
      <el-button v-if="isShowSubmit" type="primary" @click="submit">提交</el-button>
      <el-button v-if="isShowCancel" @click="cancel">取消</el-button>
      <el-button v-if="isShowCancelTask" @click="cancelTask">取消任务</el-button>
    </div>
  </div>
</template>

<script>
// import statusButton from './components/status-button.vue'
import uploadSlotTrigger from './components/upload-slot-trigger.vue'
// import uploadSlotTip from './components/upload-slot-tip.vue'
// import inputOrSelect from './components/inputOrSelect.vue'
import { determinateBoardDetail } from './components/index.js'
export default {

  // component: { statusButton },
  mixins: [determinateBoardDetail],
  data() {
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    const commonChangeReg = this.$getRules({})
    const numberReg = this.$getRules({ type: 'number', pattern: /^(([1-9]{1}\d{0,4})|(0{1}))(\.\d{1,2})?$/, message: '0~99999.99', trigger: ['blur'] })
    const number999Reg = this.$getRules({ type: 'number', pattern: /^(([1-9]{1}\d{0,2})|(0{1}))(\.\d{1,2})?$/, message: '0~999.99', trigger: ['blur'] })
    const integerReg = this.$getRules({ type: 'number', message: '0~999', trigger: ['blur'] })
    const integer99Reg = this.$getRules({ type: 'number', message: '0~99', trigger: ['blur'] })
    const integer9999Reg = this.$getRules({ type: 'number', message: '0~9999', trigger: ['blur'] })

    // 基础数据配置
    const baseData = {
      _taskNo: {
        prop: 'taskNo',
        itemType: 'itemview',
        itemStyle: { 'width': '33%' },
        label: '任务编号:'
        // renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
        //   return value
        // }
      },
      _greigeUuid: {
        prop: 'greigeUuid',
        itemType: 'itemview',
        itemStyle: { 'width': '33%' },
        label: '坯布编码:'
      },
      _knitOrderNo: {
        prop: 'knitOrderNo',
        itemType: 'itemview',
        itemStyle: { 'width': '33%' },
        label: '织订单:'
      },
      _factoryName: {
        prop: 'factoryName',
        itemType: 'itemview',
        itemStyle: { 'width': '33%' },
        label: '织厂:'
        // renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
        //   return value ? value.label || '' : ''
        // }
      },
      _machineNo: {
        prop: 'machineNo',
        itemType: 'itemview',
        itemStyle: { 'width': '33%' },
        label: '机台号:'
      },
      _fabricType: {
        prop: 'fabricType',
        itemType: 'itemview',
        itemStyle: { 'width': '33%' },
        label: '布类:',
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          // console.log(value, options, form, formDatas, setFormDatas, scope)
          return formDatas.qaGreigeInspectionInfoResponse ? formDatas.qaGreigeInspectionInfoResponse.fabricType || '-' : '-'
        }
      },
      _customerColor: {
        prop: 'customerColor',
        itemType: 'itemview',
        itemStyle: { 'width': '33%' },
        label: '客户颜色:',
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return formDatas.qaGreigeInspectionInfoResponse ? formDatas.qaGreigeInspectionInfoResponse.customerColor || '-' : '-'
        }
      },
      _productSize: {
        prop: 'productSize',
        itemType: 'itemview',
        itemStyle: { 'width': '33%' },
        label: '成品规格:',
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return formDatas.qaGreigeInspectionInfoResponse ? formDatas.qaGreigeInspectionInfoResponse.productSize || '-' : '-'
        }
      },
      _widthGroup: {
        children: {
          _width: {
            prop: 'width',
            itemType: this.inputTypeChange,
            label: '坯布规格:',
            // suffix: 'G',
            // suffixClass: 'inputSuffix',
            rules: [commonBlurReg, number999Reg],
            span: 12,
            placeholder: '幅宽0~999.99',
            renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
              const obj = {
                1: '"',
                2: 'cm'
              }
              return (formDatas.width || '') + (obj[formDatas.widthUnit * 1] || '') + '-' + (formDatas.weight ? formDatas.weight + 'g/m²' : '')
            }
          },
          _widthUnit: {
            prop: 'widthUnit',
            itemType: 'select',
            text: '-',
            span: 4,
            rules: [commonChangeReg],
            isShow: scope => {
              return this.isEdit
            },
            dataSource: [
              { label: '"', value: 1 },
              { label: 'cm', value: 2 }
            ],
            // style: { textAlign: 'center', lineHeight: '36px' },
            labelWidth: '0'
          },
          _weight: {
            prop: 'weight',
            span: 7,
            isShow: scope => {
              return this.isEdit
            },
            itemType: 'input',
            suffix: 'g/m²',
            label: '',
            suffixClass: 'inputSuffix',
            labelWidth: '0',
            rules: [commonBlurReg, number999Reg],
            placeholder: '克重0~999.99'
          }
        }
      },
      _sellYear: {
        children: {
          _reductionWidth: {
            prop: 'reductionWidth',
            itemType: this.inputTypeChange,
            label: '还原规格:',
            // suffix: 'G',
            // suffixClass: 'inputSuffix',
            rules: [number999Reg],
            span: 12,
            placeholder: '幅宽0~999.99',
            renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
              const obj = {
                1: '"',
                2: 'cm'
              }
              return (formDatas.reductionWidth ? formDatas.reductionWidth + obj[formDatas.reductionWidthUnit * 1] : '') + (formDatas.reductionWidth && formDatas.reductionWidthWeight ? ' - ' : '') + (formDatas.reductionWidthWeight ? formDatas.reductionWidthWeight + 'g/m²' : '')
            }
          },
          _reductionWidthUnit: {
            prop: 'reductionWidthUnit',
            itemType: 'select',
            // text: '-',
            isShow: scope => {
              return this.isEdit
            },
            span: 4,
            dataSource: [
              { label: '"', value: 1 },
              { label: 'cm', value: 2 }
            ],
            // style: { textAlign: 'center', lineHeight: '36px' },
            labelWidth: '0'
          },
          _reductionWidthWeight: {
            prop: 'reductionWidthWeight',
            span: 7,
            itemType: 'input',
            isShow: scope => {
              return this.isEdit
            },
            suffix: 'g/m²',
            label: '',
            suffixClass: 'inputSuffix',
            labelWidth: '0',
            rules: [number999Reg],
            placeholder: '克重0~999.99'
          }
        }
      },
      _needleGroup: {
        prop: 'needle',
        itemType: this.selectTypeChange,
        itemStyle: { 'width': '33%' },
        label: '',
        renderContent: this.renderContent,
        children: {
          _needle: {
            prop: 'needle',
            itemType: this.inputTypeChange,
            label: '针寸数:',
            suffix: 'G',
            className: 'zzz',
            suffixClass: 'inputSuffix',
            maxlength: '2',
            rules: [integer99Reg],
            span: 13,
            placeholder: '请输入',
            renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
              return (formDatas.needle ? formDatas.needle + 'G' : '') + (formDatas.needle && formDatas.inch ? ' - ' : '') + (formDatas.inch ? formDatas.inch + '"' : '')
            }
          },
          _areaTelRowC2: {
            prop: 'areaTelRowC2',
            itemType: 'view',
            text: '-',
            span: 1,
            isShow: scope => {
              return this.isEdit
            },
            style: { textAlign: 'center', lineHeight: '36px' },
            labelWidth: '0'
          },
          _inch: {
            prop: 'inch',
            span: 9,
            itemType: 'input',
            isShow: scope => {
              return this.isEdit
            },
            suffix: '"',
            label: '',
            maxlength: '2',
            suffixClass: 'inputSuffix',
            labelWidth: '0',
            rules: [integer99Reg],
            placeholder: '请输入'
          }
        }
      },
      _sumNeedle: {
        children: {
          _sumNeedle: {
            prop: 'sumNeedle',
            itemType: this.inputTypeChange,
            label: '总针数:',
            // suffix: 'G',
            // suffixClass: 'inputSuffix',
            maxlength: '4',
            rules: [integer9999Reg],
            span: 23,
            placeholder: '请输入 0~9999'
          }
        }
        // prop: 'currency',
        // itemType: this.inputTypeChange,
        // itemStyle: { 'width': '33%' },
        // label: '总针数:',
        // placeholder: '请输入'
      },
      _speed: {
        children: {
          _speed: {
            prop: 'speed',
            itemType: this.inputTypeChange,
            label: '转速:',
            maxlength: '3',
            // suffix: 'G',
            // suffixClass: 'inputSuffix',
            rules: [integerReg],
            span: 23,
            placeholder: '请输入0~999'
          }
        }
        // prop: 'currency1',
        // itemType: this.inputTypeChange,
        // itemStyle: { 'width': '33%' },
        // label: '转速:',
        // placeholder: '请输入 0~999',
        // rules: [integerReg]
      },
      _techRequire: {
        prop: 'techRequire',
        itemType: 'itemview',
        itemStyle: { 'width': '33%' },
        label: '工艺要求:',
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return formDatas.qaGreigeInspectionInfoResponse ? formDatas.qaGreigeInspectionInfoResponse.techRequire || '-' : '-'
        }
      },
      _attachmentPath: {
        prop: 'attachmentPath',
        itemType: 'upload',
        label: '文件上传:',
        isShow: scope => {
          return this.isEdit
        },
        className: 'upload-demo',
        // showFileList: false,
        onSuccess: (res, file, fileList) => {
          console.log(res, file, fileList, this.baseData._attachmentPath)
          this.$message.success('导入成功')
          // const tempObj = {
          //   name: res.data.newName,
          //   url: res.data.viewUrl
          // }
          const baseData = { ...this.$refs.baseSearchForm.dynamicValidateFormRuleForm }
          baseData.attachmentName = baseData.attachmentName ? baseData.attachmentName + `,${res.data.id}` : res.data.id
          this.baseFormDatas = baseData
          console.log(this.baseFormDatas)
          // debugger
          // const attachmentArr = baseData.attachmentPath
          // const tempArr = [...attachmentArr, tempObj]
          // this.baseFormDatas = { ...baseData, attachmentPath: tempArr }
          // console.log(this.baseFormDatas)
          // this.baseFormDatas.attachmentPath.push(tempObj)
          // this.$set(this.sampleAnalysisPopOptions.formDatas, 'filePath', res.data)
          // this.fetchLog(this.getLogMessages('IMPORT', '/userCenter/sysUser/batch/add'), file, JSON.stringify({ beforeText: `在'用户中心-员工管理'批量导入成功` }))
          // this.importPopDialogHandle()
          // this.closePopDialogHandle(this.enclosurePopOptions)
          // this.getfilePage()
        },
        onError: (res, file) => {
          // console.log(res, file)
        },
        onExceed: (files, fileList) => {
          this.$message.warning(`当前限制选择 6 个文件`)
        },
        beforeRemove: (file, fileList) => {
          console.log('beforeRemove', file, fileList)
          return this.accept.indexOf(file.name.split('.')[file.name.split('.').length - 1]) !== -1 ? this.$confirm(`确定移除 ${file.name}？`).then(() => {
            // console.log(this.sampleAnalysisPopOptions.formDatas)
            // this.sampleAnalysisPopOptions.formDatas.filePath = null
            // const fileArray = [...this.sampleAnalysisPopOptions.formDatas]
            // const newArraty = fileList.filter(item => item !== (file.url ? file.url : file.response.data.viewUrl))
            // 获取基础数据
            const baseData = { ...this.$refs.baseSearchForm.dynamicValidateFormRuleForm }
            const endUrlId = file.url.split('/')[file.url.split('/').length - 1]
            const newName = baseData.attachmentName.split(',').filter(item => item !== endUrlId).join(',')
            // const attachmentPath = baseData.attachmentPath.filter(item => item.url !== file.url)
            // console.log(attachmentPath)
            this.baseFormDatas = { ...baseData, attachmentName: newName }
            // this.fileList = fileList.filter(item => item.url !== file.url)
            // this.deleteAttachment({ bizType: 'QA', url: file.response ? file.response.data : file.url })
          }) : true
        },
        beforeUpload: (file) => {
          // console.log(file.type.split('/')[1])
          // const fileName = file.name.split('.')
          // const fileType = fileName[fileName.length - 1]
          // const regexp = new RegExp(fileType)
          // const isXls = regexp.test(this.accept)
          // console.log(file, fileType, regexp, isXls)
          // const isLt1M = file.size / 1024 / 1024 <= 10
          // if (!isXls) {
          //   this.$message.error('上传文件只能是 pdf/word/excel/ppt/jpg/png 格式!')
          // } else if (!isLt1M) {
          //   this.$message.error('上传文件大小不能超过 10MB!')
          // }
          // return isXls && isLt1M
        },
        action: `/common/file/upload`,
        data: {
          // bizId: this.routeId,
          // follower: this.follower,
          bizType: 'QAPUBLIC'
        },
        // accept: '.xlsx,.xls,.XLSX,.XLS,.ppt,.pptx,.PPT,.PPTX,.pdf,.PDF,.doc,.docx,.DOC,.DOCX,.png,.jpg,.PNG,.JPG',
        showFileList: true,
        fileList: this.fileList,
        limit: 6,
        timeout: 30000,
        content: [
          {
            slot: 'trigger',
            component: uploadSlotTrigger
          }
          // {
          //   slot: 'tip',
          //   component: uploadSlotTip
          // }
        ]
      },
      _cancelReason: {
        prop: 'cancelReason',
        itemType: 'itemview',
        itemStyle: { 'width': '33%' },
        isShow: scope => {
          return +this.status === 4
        },
        title: true,
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return value
          // return `<div style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${value}">${value}</div>`
        },
        label: '取消原因:'
      },
      _attachmentPath1: {
        prop: 'attachmentPath',
        itemType: 'itemview',
        isShow: scope => {
          return !this.isEdit
        },
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          let str = '<span>'
          if (value && value.length !== 0) {
            value.forEach(item => {
              str += `<img style="width: 34px; height: 34px;margin-right: 10px;object-fit: cover;" src="${item.url}">`
            })
            str += '</span>'
          } else {
            str = ''
          }

          return str
        },
        itemStyle: { 'width': '33%' },
        label: '附件:'
      }
    }
    // 原料信息表格表头配置
    const rawMaterialColumnsInfos = {
      '_yarnName': {
        prop: 'yarnName',
        label: '纱线名称',
        minWidth: '80',
        showOverflowTooltip: true
        // formater: (scope) => {
        //   return scope.$index + 1
        // }
      },
      '_yarnBrandName': {
        prop: 'yarnBrandName',
        label: '纱牌/纱批/批次号',
        minWidth: '130',
        showOverflowTooltip: true
      },
      '_yarnTest': {
        prop: 'yarnTest',
        label: '实测纱支',
        minWidth: '80',
        showOverflowTooltip: true
      },
      '_yarnLevel': {
        prop: 'yarnLevel',
        label: '纱线等级',
        minWidth: '80',
        showOverflowTooltip: true
      },
      '_yarnResult': {
        prop: 'yarnResult',
        label: '试纱结论',
        minWidth: '100',
        showOverflowTooltip: true
      },
      '_yarnLengthLoom': {
        prop: 'yarnLengthLoom',
        label: '上机纱长',
        minWidth: '100',
        showOverflowTooltip: true,
        formater: scope => {
          const arr = scope.row.yarnLengthLoom ? JSON.parse(scope.row.yarnLengthLoom) : []
          const str = arr.length ? arr.map(item => (item.describe || '') + ':' + (item.yarnLoomLength || '' + 'CM')).join('|') : '-'
          return str
        }
      },
      '_yarnLengthReal': {
        prop: 'yarnLengthReal',
        label: '实测纱长',
        minWidth: '100',
        className: 'redStar',
        showOverflowTooltip: true,
        editOptions: {
          labelWidth: '0',
          readonly: true,
          itemType: 'input',
          placeholder: '请输入',
          focus: (event, form, formDatas, setFormDatas, scope) => {
            // debugger
            console.log(scope, form, formDatas)
            this.popOptions.formDatas = { index: scope.$index }
            this.popOptions.visible = true
            let loomPopFormDatas
            const yarnLengthLoom = scope.row.yarnLengthLoom ? JSON.parse(scope.row.yarnLengthLoom) : []
            const yarnLengthRealStr = scope.row.yarnLengthReal ? scope.row.yarnLengthReal : ''
            if (yarnLengthLoom.length) {
              loomPopFormDatas = yarnLengthLoom.map((item, index) => {
                return {
                  edit: true,
                  describe: item.describe,
                  yarnLengthLoom: item.yarnLoomLength,
                  yarnLengthReal: yarnLengthRealStr ? parseFloat(yarnLengthRealStr.split('|')[index].split(':')[1]) : '',
                  yarnLengthRealEdit: true
                }
              })
            }
            // }
            // if (yarnLengthLoom.length) {
            //   const yarnLengthRealArr = scope.row.yarnLengthReal ? scope.row.yarnLengthReal : ''
            //   loomPopFormDatas = scope.row.yarnLengthLoom.split('|').map((item, index) => {
            //     return {
            //       edit: true,
            //       describe: item.split(':')[0],
            //       yarnLengthLoom: parseFloat(item.split(':')[1]),
            //       yarnLengthReal: yarnLengthRealArr.length ? parseFloat(yarnLengthRealArr.split('|')[index].split(':')[1]) : '',
            //       yarnLengthRealEdit: true
            //     }
            //   })
            // }
            console.log(loomPopFormDatas)
            this.$nextTick(() => {
              this.$set(this.popOptions, 'formDatas', { table: loomPopFormDatas })
            })

            event.target.blur() // 因为弹出框点击取消会触发focus 所以提前把该input框失焦
            // this.$set(this.popOptions, 'visible', true)
          },
          rules: [commonChangeReg]
        }
      }
    }
    // 原料信息配置
    const rawMaterialData = {
      _tableForm: {
        prop: 'rawMaterialTable',
        headerCellStyle: { 'background-color': '#F5F7FA' },
        className: 'pop-table',
        itemType: 'table-form',
        label: '',
        labelWidth: '0',
        dataSource: [
          // { yarnFineness: 'yyy', elementName: 'zzz', yarnRatio: 'ccc', edit: true, isDyed: 0, yarnLengthLoom: 'ccc:11cm|zzz:12cm', yarnLengthRealEdit: true }
        ],
        columns: rawMaterialColumnsInfos,
        tooltipEffect: 'dark'
      }
    }

    // 间条信息表格表头配置
    const intervalColumnsInfos = {
      '_colorName': {
        prop: 'colorName',
        label: '颜色',
        minWidth: '60',
        showOverflowTooltip: true
      },
      '_requireHeight': {
        prop: 'requireHeight',
        label: '要求高度(cm)',
        minWidth: '120',
        showOverflowTooltip: true
      },
      '_beforeWashHeight': {
        prop: 'beforeWashHeight',
        label: '洗前高度(cm)',
        minWidth: '120',
        editOptions: {
          labelWidth: '0',
          itemType: 'input',
          placeholder: '请输入 0~99999.99',
          rules: [numberReg]
        }
      },
      '_afterWashHeight': {
        prop: 'afterWashHeight',
        label: '洗后高度(cm)',
        minWidth: '120',
        editOptions: {
          labelWidth: '0',
          itemType: 'input',
          placeholder: '请输入 0~99999.99',
          rules: [numberReg]
        }
      }
    }
    // 间条信息配置
    const intervalData = {
      _tableForm: {
        prop: 'intervalTable',
        headerCellStyle: { 'background-color': '#F5F7FA' },
        className: 'pop-table',
        itemType: 'table-form',
        label: '',
        labelWidth: '0',
        dataSource: [
          // { yarnFineness: 'yyy', elementName: 'zzz', yarnRatio: 'ccc', edit: true, isDyed: 0, colorEdit: true, colorRatioEdit: false }
        ],
        columns: intervalColumnsInfos,
        tooltipEffect: 'dark'
      }
    }
    // 任务动态表格表头配置
    const taskDynamicsColumnsInfos = {
      '_role': {
        prop: 'role',
        label: '角色',
        minWidth: '60',
        showOverflowTooltip: true
      },
      '_handler': {
        prop: 'handler',
        label: '处理人',
        minWidth: '70',
        showOverflowTooltip: true
      },
      '_processTime': {
        prop: 'processTime',
        label: '处理时间',
        minWidth: '120',
        showOverflowTooltip: true,
        formater: scope => {
          return scope.row[scope.column.property] ? this.$filters.parseTime(scope.row[scope.column.property] + '', '{y}-{m}-{d} {h}:{i}') : '-'
        }
      },
      '_swatchesResult': {
        prop: 'swatchesResult',
        label: '确板结果',
        minWidth: '120',
        className: 'redStar',
        formater: scope => {
          return ['通过', '不通过', '递交工艺员'][scope.row.swatchesResult - 1]
        },
        editOptions: {
          labelWidth: '0',
          itemType: 'select',
          // placeholder: '请输入 0~99999.99',
          rules: [commonChangeReg],
          // renderContent: value => {
          //   console.log(value)
          //   return ['通过', '不通过', '递交工艺员'][value - 1]
          // },
          dataSource: [
            // { label: '通过', value: 1 },
            // { label: '不通过', value: 2 },
            // { label: '递交工艺员', value: 3 }
          ]
        }
        // components: { inputOrSelect },
        // componentsOptions: {
        //   type: this.selectTypeChange
        // }
      },
      '_swatchesUserComments': {
        prop: 'swatchesUserComments',
        label: '意见',
        minWidth: '120',
        className: 'redStar',
        editOptions: {
          labelWidth: '0',
          itemType: 'input',
          maxlength: 200,
          placeholder: '请输入',
          rules: [commonBlurReg]
        }
        // components: { inputOrSelect },
        // componentsOptions: {
        //   type: this.inputTypeChange
        // }
      }
    }
    // 任务动态配置
    const taskDynamicsData = {
      _tableForm: {
        prop: 'taskDynamicsTable',
        headerCellStyle: { 'background-color': '#F5F7FA' },
        className: 'pop-table',
        itemType: 'table-form',
        label: '',
        labelWidth: '0',
        dataSource: [
          // { yarnFineness: 'yyy', elementName: 'zzz', yarnRatio: 'ccc', edit: true, isDyed: 0, swatchesResult: 1, colorEdit: true, colorRatioEdit: false },
          // { yarnFineness: 'yyy', elementName: 'zzz', yarnRatio: 'ccc', isDyed: 0, colorEdit: true, colorRatioEdit: false }
        ],
        columns: taskDynamicsColumnsInfos,
        tooltipEffect: 'dark'
      }
    }

    // 实测纱长弹出框表格表头配置
    const popOptionsColumnsInfos = {
      '_describe': {
        prop: 'describe',
        label: '描述',
        minWidth: '60',
        showOverflowTooltip: true
      },
      '_yarnLengthLoom': {
        prop: 'yarnLengthLoom',
        label: '上机纱长(cm)',
        minWidth: '100',
        showOverflowTooltip: true
      },
      '_yarnLengthReal': {
        prop: 'yarnLengthReal',
        label: '实测纱长',
        minWidth: '120',
        className: 'redStar',
        editOptions: {
          labelWidth: '0',
          itemType: 'input',
          placeholder: '请输入 0~99999.99',
          rules: [numberReg, commonBlurReg]
        }
      }
    }
    // 实测纱长弹出框
    const popOptions = {
      itemType: 'drawer',
      visible: false,
      title: '实测纱长',
      customClass: 'popOptionsClass',
      ok: params => {
        console.log(params, this.rawMaterialData)
        const yarnLengthName = params.table.map(item => item.describe + ':' + item.yarnLengthReal + 'cm').join('|')
        // this.$set(this.rawMaterialData._tableForm.dataSource[params.index], 'yarnLengthReal', yarnLengthName)
        // const tempRawMaterialFormDatas = [...this.rawMaterialFormDatas.rawMaterialTable]
        const tempRawMaterialFormDatas = this.$utils.deepClone(this.rawMaterialFormDatas.rawMaterialTable)
        tempRawMaterialFormDatas[params.index].yarnLengthReal = yarnLengthName
        tempRawMaterialFormDatas[params.index].yarnLengthRealJson = JSON.stringify(params.table.map(item => {
          return {
            describe: item.describe,
            yarnLoomLength: item.yarnLengthReal
          }
        }))
        this.rawMaterialFormDatas = { rawMaterialTable: tempRawMaterialFormDatas }
        // this.$set(this.rawMaterialFormDatas.rawMaterialTable[params.index], 'yarnLengthReal', yarnLengthName)
        this.popOptions.visible = false
      },
      okText: '保存',
      cancel: params => {
        // debugger
        console.log(this.popOptions.visible)
        this.popOptions.visible = false
        console.log(this.popOptions.visible)
        // this.$set(this.popOptions, 'visible', false)
      },
      formDatas: {},
      formOptions: {
        popError: true
      },
      content: {
        _tableForm: {
          prop: 'table',
          headerCellStyle: { 'background-color': '#F5F7FA' },
          className: 'pop-table',
          itemType: 'table-form',
          label: '',
          labelWidth: '0',
          dataSource: [],
          columns: popOptionsColumnsInfos,
          tooltipEffect: 'dark'
        }
      }
    }

    // 取消任务弹出框
    const cancelTaskpopOptions = {
      itemType: 'dialog',
      visible: false,
      title: '实测纱长',
      customClass: 'popOptionsClass',
      ok: params => {
        console.log(params)
        this.cancelOk({ id: this.determinateBoardid, ...params })
      },
      okText: '确定取消',
      cancelText: '暂不取消',
      cancel: params => {
        // debugger
        // console.log(this.popOptions.visible)
        this.cancelTaskpopOptions.visible = false
        // console.log(this.popOptions.visible)
        // this.$set(this.popOptions, 'visible', false)
      },
      formDatas: {},
      formOptions: {
        // popError: true
      },
      content: {
        '_cancelReason': {
          prop: 'cancelReason',
          itemType: 'input',
          type: 'textarea',
          trim: (value) => {
            return value
          },
          maxlength: 100,
          rules: [commonBlurReg],
          autosize: { minRows: 2, maxRows: 4 },
          label: '取消原因',
          placeholder: '取消后无法恢复, 请填写取消任务原因(0~100字)'
        }
      }
    }
    return {
      taskNumber: '',

      baseData,
      editionArrayData: [
        // { label: 'v1', value: 'v1' },
        // { label: 'v2', value: 'v2' }
      ],
      editionValue: 'v1',
      baseFormDatas: { widthUnit: 2, reductionWidthUnit: 2 },
      // baseFormDatas: { widthUnit: 'cm', reductionWidthUnit: 'cm', attachmentPath: [
      //   { name: '1.jpeg', url: 'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg' },
      //   { name: '2.jpeg', url: 'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg' },
      //   { name: '3.jpeg', url: 'https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg' }
      // ]
      // },
      rawMaterialFormDatas: {},
      intervalFormDatas: {},
      taskDynamicsFormDatas: {},
      formOtions: {
        size: 'small',
        inline: true,
        popError: true
      },
      accept: '.xlsx,.xls,.XLSX,.XLS,.ppt,.pptx,.PPT,.PPTX,.pdf,.PDF,.doc,.docx,.DOC,.DOCX,.png,.jpg,.PNG,.JPG',

      YarnLengthUnit: '100G',
      intervalFormOtions: { popError: true, size: 'mini' },
      rawMaterialFormOtions: { popError: true, size: 'mini' },
      taskDynamicsFormOtions: { popError: true, size: 'mini' },
      rawMaterialData,
      intervalData,
      taskDynamicsData,

      rawMaterialColumnsInfos,
      intervalColumnsInfos,
      taskDynamicsColumnsInfos,

      popOptions,
      cancelTaskpopOptions,
      status: '-2',
      statusArr: [
        { value: '0', label: '待处理', color: '#FF9214', count: 0 },
        { value: '1', label: '处理中', color: '#FF9214', count: 0 },
        { value: '2', label: '待审核', color: '#FF9214', count: 0 },
        { value: '3', label: '已处理', color: '#00BCC5', count: 0 },
        { value: '-1', label: '全部', color: '#00BCC5', count: 0 },
        { value: '4', label: '已取消', color: '#888E9E', count: 0 },
        { value: '5', label: '已作废', color: '#888E9E', count: 0 }
      ],

      fileList: [{ name: 'logo.png', url: 'https://dev-file24.szhibu.com/textile/erp2/qa/1716d10307374b9580df179f42526aa5.png' }]
    }
  },
  computed: {
    userInfo() {
      return this.$store.state.user.userInfo
    },
    // 是否为编辑页
    isEdit() {
      const type = this.$route.query.type
      return type === 'edit'
    },
    determinateBoardid() {
      return this.$route.query.id
    },
    // 左侧菜单栏是否折叠
    sidebar() {
      return this.$store.state.app.sidebar.opened
    },
    // 整个底部按钮的显示与否
    isShowButtonGroup({ userInfo, baseFormDatas, isEdit, status, editionArrayData, editionValue }) {
      console.log(userInfo, baseFormDatas, isEdit, status)
      let vFlag = false
      if (editionArrayData.length) {
        vFlag = editionValue === editionArrayData[0].value || editionValue === editionArrayData[editionArrayData.length - 1].value
      }
      const flag = (+status === 1 && userInfo.userId === baseFormDatas.swatchesUserId && vFlag) || (+status === 2 && userInfo.userId === baseFormDatas.processUserId && vFlag)
      // debugger
      console.log(flag)
      return flag
    },
    isShowSave({ isEdit, editionValue, editionArrayData }) {
      let vFlag = false
      if (editionArrayData.length) {
        vFlag = editionValue === editionArrayData[editionArrayData.length - 1].value
      }

      return isEdit && vFlag && this.$permission(['qa:qaGreigeSwatchesTask:modify'])
    },
    isShowSaveAndSubmit({ isEdit, status, editionValue, editionArrayData }) {
      let vFlag = false
      if (editionArrayData.length) {
        vFlag = editionValue === editionArrayData[editionArrayData.length - 1].value
      }
      return isEdit && +status === 1 && vFlag && this.$permission(['qa:qaGreigeSwatchesTask:modify'])
    },
    isShowSaveAndExamine({ isEdit, status, editionValue, editionArrayData }) {
      let vFlag = false
      if (editionArrayData.length) {
        vFlag = editionValue === editionArrayData[editionArrayData.length - 1].value
      }
      return isEdit && +status === 2 && vFlag && this.$permission(['qa:qaGreigeSwatchesTask:modify'])
    },
    isShowEdit({ isEdit, status, editionValue, editionArrayData }) {
      let vFlag = false
      if (editionArrayData.length) {
        vFlag = editionValue === editionArrayData[editionArrayData.length - 1].value
      }
      return !isEdit && [1, 2].includes(+status) && vFlag && this.$permission(['qa:qaGreigeSwatchesTask:modify'])
    },
    isShowExamine({ isEdit, status, editionValue, editionArrayData }) {
      let vFlag = false
      if (editionArrayData.length) {
        vFlag = editionValue === editionArrayData[editionArrayData.length - 1].value
      }
      return !isEdit && +status === 2 && vFlag && this.$permission(['qa:qaGreigeSwatchesTask:modify'])
    },
    isShowSubmit({ isEdit, status, editionValue, editionArrayData }) {
      let vFlag = false
      if (editionArrayData.length) {
        vFlag = editionValue === editionArrayData[editionArrayData.length - 1].value
      }
      return !isEdit && +status === 1 && vFlag && this.$permission(['qa:qaGreigeSwatchesTask:modify'])
    },
    isShowCancel({ isEdit, status }) {
      return isEdit
    },
    isShowCancelTask({ isEdit, status, editionValue, editionArrayData }) {
      console.log(editionValue, editionArrayData)
      return !isEdit && +status === 1 && editionValue === editionArrayData[0].value && editionArrayData.length === 1 && this.$permission(['qa:qaGreigeSwatchesTask:cancel'])
    },
    getColorByStatus({ status, statusArr }) {
      const statusValue = statusArr.filter(item => +item.value === +status)[0]
      return statusValue
    }
  },
  watch: {
    // $route: {
    //   async handler(v) {
    //     if (v.query.type) {
    //       console.log(v.query.type)
    //       const type = v.query.type
    //     }
    //   },
    //   deep: true,
    //   immediate: true
    // }
    isEdit: {
      handler(v) {
        console.log(v)
        // const flag = v === 'edit'
        // 获取原料信息
        const rawMaterialData = [...this.$refs.rawMaterialSearchForm.dynamicValidateFormRuleForm.rawMaterialTable]
        rawMaterialData.forEach(item => {
          item.edit = v
          item.yarnLengthRealEdit = v
        })
        this.rawMaterialFormDatas = { rawMaterialTable: rawMaterialData }
        // 间条信息
        const intervalData = [...this.$refs.intervalSearchForm.dynamicValidateFormRuleForm.intervalTable]
        intervalData.forEach(item => {
          item.edit = v
          item.beforeWashHeightEdit = v
          item.afterWashHeightEdit = v
        })
        this.intervalFormDatas = { intervalTable: intervalData }
        // 任务动态
        const taskDynamicsData = [...this.$refs.taskDynamicsSearchForm.dynamicValidateFormRuleForm.taskDynamicsTable]
        // const taskDynamicsDataLength = taskDynamicsData.length
        taskDynamicsData.forEach((item, index) => {
          if (index === 0) {
            item.edit = v && +this.status === 1
            item.swatchesResultEdit = v && +this.status === 1
            item.swatchesUserCommentsEdit = v && +this.status === 1
          } else {
            item.edit = v && +this.status === 2
            item.swatchesResultEdit = v && +this.status === 2
            item.swatchesUserCommentsEdit = v && +this.status === 2
          }
        })
        this.taskDynamicsFormDatas = { taskDynamicsTable: taskDynamicsData }
      }
    }
  },
  created() {
    this.qaGreySwatchesTaskInfo()
  },
  methods: {
    inputTypeChange() {
      if (this.isEdit) {
        return 'input'
      }
      return 'itemview'
    },
    dateTypeChange() {
      if (this.isEdit) {
        return 'date'
      }
      return 'itemview'
    },
    selectTypeChange() {
      if (this.isEdit) {
        return 'select'
      }
      return 'itemview'
    }
  }
}
</script>

<style lang="scss" scoped>
  .grey-fabric-determinate-board-detail {
    padding: 20px;
    padding-bottom: 77px;

    .top-message {
      display: flex;
      justify-content: space-between;
      margin: 5px 0 15px;
      font-size: 18px;
      color: #15123F;

      // .task-number {
        // color: #199ffe;
      // }

      .right-text {
        font-size: 14px;
        color: #717171;

        .human-type {
          margin-right: 5px;
        }
      }
    }

    .base-info {
      // padding: 0 20px;
      background-color: #fff;

      .base-info-title {
        padding: 20px 20px 15px;
        border-bottom: 1px solid #EEEFF0;
        margin-bottom: 20px;
        font-size: 16px;
      }

      .custom-form {
        padding: 0 20px;
        padding-bottom: 10px;

        /deep/.el-form-item {
          margin-right: 0;
          margin-bottom: 14px;
        }

      }

    }

    .raw-material-information,.interval-information,.task-dynamics {
      background-color: #fff;
      margin-top: 20px;

      .title {
        font-size: 16px;
        padding: 20px 20px 15px;
        // border-bottom: 1px solid #EEEFF0;
        // margin-bottom: 20px;
        display: flex;
        justify-content: space-between;
      }

      .custom-form {
        padding: 0 20px;
        padding-bottom: 10px;

        /deep/.el-form-item {
          margin-right: 0;
          margin-bottom: 0px;
        }
      }
    }

    /deep/th.redStar {
      .cell::before {
        content: '*';
        color: #ff4949;
        margin-right: 4px;
      }
    }

    .inputSuffix {
      font-size: 14px;
      color: #888E9E;
      margin-right: 10px;
      line-height: 28px;
    }
  }
</style>
<style lang="scss">
.grey-fabric-determinate-board-detail {
  .base-info {
    .custom-form {
      .el-row {
        width: 33%;
      }

      .el-input__suffix {
        padding-right: 10px;
      }
    }
  }
  .baseInfoForm {
    padding: 0 20px;
  }
  .baseInfo {
    .custom-form .el-form .el-form-item {
      margin-bottom: 8px;
    }
    .el-form-item__content {
      color: #474747;
    }
    .el-form-item__label-wrap label {
      color: #888E9E;
    }
  }
  .el-textarea__inner { //el_input中的隐藏属性
    resize: none;  //主要是这个样式
  }
  .fixed-footer {
        width: calc(100% - 54px) !important;
    }
  .status-button-group {
    width: calc(100% - 210px);
    transition: width 0.28s;
    position: fixed;
    // left:auto;
    right: 0;
    display: block;
    text-align: center;
    bottom: 0px;
    padding: 10px 0px;
    background: #ffffff;
    border-top: 1px solid #ecf0f3;
    z-index: 999;
  }

  .upload-demo {
    display: flex;

    .el-upload--text {
      margin-right: 5px;
    }

    .el-upload-list{
      display: flex;
      width: 400px;
      flex-wrap: wrap;
      // width: 33%;

      .el-upload-list__item {
        margin-top: 5px;
        width: 198px;
      }
    }
  }
}

</style>
