<template>
  <div class="grey-fabric-determinate-board-detail" :style="isShowButtonGroup ? 'padding-bottom: 77px;' : 'padding-bottom: 20px;'">
    <div class="top-message">
      <div>任务编码: <span class="task-number">{{ taskNumber }}</span></div>
      <div class="right-text">
        <span v-if="baseFormDatas.createName" class="human-type ">创建人: {{ (baseFormDatas.createName || '') + ' ' + (baseFormDatas.createdTime ? $filters.parseTime(baseFormDatas.createdTime + '', '{y}-{m}-{d} {h}:{i}') : '') }} </span>
        <span v-if="baseFormDatas.opearationUserName" class="human-type ">质检员: {{ (baseFormDatas.opearationUserName || '') + ' ' + (baseFormDatas.opearationTime ? $filters.parseTime(baseFormDatas.opearationTime + '', '{y}-{m}-{d} {h}:{i}') : '') }} </span>
        <span v-if="baseFormDatas.reviewUserName" class="human-type ">审核人: {{ (baseFormDatas.reviewUserName || '') + ' ' + (baseFormDatas.reviewTime ? $filters.parseTime(baseFormDatas.reviewTime + '', '{y}-{m}-{d} {h}:{i}') : '') }} </span>
        <span v-if="baseFormDatas.cancelUserName" class="human-type ">取消人: {{ (baseFormDatas.cancelUserName || '') + ' ' + (baseFormDatas.cancelTime ? $filters.parseTime(baseFormDatas.cancelTime + '', '{y}-{m}-{d} {h}:{i}') : '') }} </span>
        <span class="status" :style="{color: getColorByStatus ? getColorByStatus.color : ''}">{{ getColorByStatus ? getColorByStatus.label : '' }}</span>
      </div>
    </div>
    <div class="base-info">
      <div class="base-info-title">基本信息
        <!-- <el-select v-if="editionArrayData.length" v-model="editionValue" size="small" style="margin-left: 20px; width: 100px;" placeholder="请选择" @change="editionChange">
          <el-option
            v-for="item in editionArrayData"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select> -->
      </div>
      <!-- 基本信息表单 -->
      <div class="baseInfoForm" :class="{baseInfo:!isEdit}">
        <cs-custom-form ref="baseSearchForm" :data-source="baseData" :options="formOtions" :form-datas="baseFormDatas" />
      </div>
    </div>
    <div class="raw-material-information">
      <div class="title">原料信息
        <!-- <span class="YarnLengthUnit">纱长单位: {{ YarnLengthUnit }}</span> -->
      </div>
      <cs-custom-form ref="rawMaterialSearchForm" :data-source="rawMaterialData" :options="rawMaterialFormOtions" :form-datas="rawMaterialFormDatas" />
    </div>
    <div class="confirmation-information">
      <div class="title title-form">确板信息</div>
      <cs-custom-form ref="confirmationSearchForm" :data-source="confirmationData" :options="confirmationFormOtions" :form-datas="confirmationFormDatas" />
    </div>
    <div class="cloth-inspection-information">
      <div class="title">验布信息</div>
      <cs-custom-form ref="clothInspectionSearchForm" :data-source="clothInspectionData" :options="clothInspectionFormOtions" :form-datas="clothInspectionFormDatas" />
    </div>
    <div class="picture">
      <span class="picture-title">图片</span>
      <div v-for="(item, index) in srcList" :key="index" class="picture-image">
        <el-image
          style="width: 36px; height: 36px"
          :src="item"
          :preview-src-list="srcList"
        />
      </div>
    </div>

    <!-- 实测纱长pop弹出框 -->
    <!-- <div class="pop">
      <cs-custom-pop ref="popOptions" :options="popOptions" />
    </div> -->
    <!-- 取消任务pop弹出框 -->
    <div class="pop">
      <cs-custom-pop ref="popOptions" :options="cancelTaskpopOptions" />
    </div>
    <!-- 底部按钮 -->
    <div v-if="isShowButtonGroup" :class="{ 'fixed-footer': !sidebar }" class="status-button-group">
      <!-- <status-button :is-copy="isCopy" :get-detail-data="getDetailData" :set-active-name="setActiveName" :is-edit="getEditabled" :data="allOrderIndexData" :clothing-form="clothingForm" /> -->
      <!-- <status-button /> -->
      <el-button v-if="isShowSave" type="primary" @click="save">保存</el-button>
      <!-- <el-button v-if="isShowSaveAndSubmit" type="primary" @click="saveAndSubmit">保存并提交</el-button> -->
      <el-button v-if="isShowSaveAndExamine" type="primary" @click="saveAndExamine">保存并审核</el-button>
      <el-button v-if="isShowEdit" type="primary" @click="edit">编辑</el-button>
      <el-button v-if="isShowExamine" type="primary" @click="examine">审核</el-button>
      <!-- <el-button v-if="isShowSubmit" type="primary" @click="submit">提交</el-button> -->
      <el-button v-if="isShowCancel" @click="cancel">取消</el-button>
      <el-button v-if="isShowCancelTask" @click="cancelTask">取消任务</el-button>
    </div>
  </div>
</template>

<script>
// import statusButton from './components/status-button.vue'
// import uploadSlotTrigger from './components/upload-slot-trigger.vue'
// import uploadSlotTip from './components/upload-slot-tip.vue'
// import inputOrSelect from './components/inputOrSelect.vue'
import { clothInspectionDetail } from './components/index.js'
export default {
  // component: { statusButton },
  mixins: [clothInspectionDetail],
  data() {
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    // const commonChangeReg = this.$getRules({})
    // const numberReg = this.$getRules({ type: 'number', pattern: /^(([1-9]{1}\d{0,4})|(0{1}))(\.\d{1,2})?$/, message: '0~99999.99', trigger: ['blur'] })
    // const number999Reg = this.$getRules({ type: 'number', pattern: /^(([1-9]{1}\d{0,2})|(0{1}))(\.\d{1,2})?$/, message: '0~99999.99', trigger: ['blur'] })
    // const integerReg = this.$getRules({ type: 'number', message: '0~999', trigger: ['blur'] })
    // 基础数据配置
    const baseData = {
      _taskNo: {
        prop: 'taskNo',
        itemType: 'itemview',
        itemStyle: { 'width': '33%' },
        label: '任务编码:'
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
      _machineNo: {
        prop: 'machineNo',
        itemType: 'itemview',
        itemStyle: { 'width': '33%' },
        label: '织机号:'
        // renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
        //   return formDatas.qaGreigeInspectionInfoResponse ? formDatas.qaGreigeInspectionInfoResponse.machineNo || '-' : '-'
        // }
      },
      _factoryName: {
        prop: 'factoryName',
        itemType: 'itemview',
        itemStyle: { 'width': '33%' },
        label: '织厂:'
        // renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
        //   return formDatas.qaGreigeInspectionInfoResponse ? formDatas.qaGreigeInspectionInfoResponse.factoryName || '-' : '-'
        // }
      },
      _fabricType: {
        prop: 'fabricType',
        itemType: 'itemview',
        itemStyle: { 'width': '33%' },
        label: '布类:',
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
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
      _needleInchNum: {
        prop: 'needleInchNum',
        itemType: 'itemview',
        itemStyle: { 'width': '33%' },
        label: '针寸数:'
        // renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
        //   return formDatas.qaGreigeInspectionInfoResponse ? formDatas.qaGreigeInspectionInfoResponse.needleInchNum || '-' : '-'
        // }
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
      _packaging: {
        prop: 'packaging',
        itemType: 'itemview',
        itemStyle: { 'width': '33%' },
        label: '打包方式:',
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return formDatas.qaGreigeInspectionInfoResponse ? formDatas.qaGreigeInspectionInfoResponse.packaging || '-' : '-'
        }
      },
      _cancelReason: {
        prop: 'cancelReason',
        itemType: 'itemview',
        className: 'infoCancelReason',
        itemStyle: { 'width': '33%' },
        title: true,
        isShow: scope => {
          return this.status + '' === '4'
        },
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return value
          // return `<div style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${value}">${value}</div>`
        },
        label: '取消原因:'
      },
      _machineCraft: {
        prop: 'machineCraft',
        itemType: 'itemview',
        itemStyle: { 'width': '66%' },
        label: '上机工艺:',
        title: true,
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          const str = formDatas.qaGreigeInspectionInfoResponse ? formDatas.qaGreigeInspectionInfoResponse.machineCraft || '-' : '-'
          return `<span title=${str}>${str}</span>`
        }
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
      // '_yarnTest': {
      //   prop: 'yarnTest',
      //   label: '实测纱支',
      //   minWidth: '80',
      //   showOverflowTooltip: true
      // },
      '_yarnLevel': {
        prop: 'yarnLevel',
        label: '纱线等级',
        minWidth: '80',
        showOverflowTooltip: true
      },
      '_dyeingAdaptability': {
        prop: 'dyeingAdaptability',
        label: '染色适应性',
        minWidth: '100',
        showOverflowTooltip: true
      },
      '_yarnResult': {
        prop: 'yarnResult',
        label: '试纱结论',
        minWidth: '100',
        showOverflowTooltip: true
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

    // 确板信息配置
    const confirmationData = {
      _swatchesUserName: {
        prop: 'swatchesUserName',
        itemType: 'itemview',
        itemStyle: { 'width': '33%' },
        label: '确板员:',
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          console.log(formDatas, scope)
          const statusArr = [
            // { value: '0', label: '待处理', color: '#FF9214' },
            { value: '1', label: '处理中', color: '#FF9214' },
            { value: '2', label: '待审核', color: '#FF9214' },
            { value: '3', label: '已处理', color: '#00BCC5' },
            { value: '5', label: '全部', color: '#888E9E' },
            { value: '4', label: '已取消', color: '#888E9E' }
          ]
          const getColorByStatus = statusArr.filter(item => +item.value === +formDatas.swatchesStatus)[0]
          const label = getColorByStatus ? getColorByStatus.label : ''
          const color = getColorByStatus ? getColorByStatus.color : ''
          return `<span>${(value || '') + (label ? '( ' + `<span style="color: ${color}">${label}</span>` + ' )' : '')}</span>`
        }
      },
      _swatchesComments: {
        prop: 'swatchesComments',
        itemType: 'itemview',
        itemStyle: { 'width': '33%' },
        label: '确板意见:'
      }
    }

    // 验布信息表格表头配置
    const clothInspectionColumnsInfos = {
      '_greigeNumber': {
        prop: 'greigeNumber',
        label: '匹号',
        minWidth: '60',
        showOverflowTooltip: true
      },
      '_isQualified': {
        prop: 'isQualified',
        label: '是否合格',
        minWidth: '70',
        showOverflowTooltip: true,
        formater: scope => {
          return scope.row.isQualified ? ['否', '是'][scope.row.isQualified * 1] : '-'
        }
      },
      '_responsibleDepartment': {
        prop: 'responsibleDepartment',
        label: '责任部门',
        minWidth: '120',
        showOverflowTooltip: true
      },
      '_blemishDescription': {
        prop: 'blemishDescription',
        label: '疵点描述',
        minWidth: '120',
        showOverflowTooltip: true
      },
      '_remark': {
        prop: 'remark',
        label: '审批意见',
        minWidth: '120',
        className: 'redStar',
        editOptions: {
          labelWidth: '0',
          itemType: 'input',
          maxlength: 200,
          placeholder: '请输入(0~200字)',
          rules: [commonBlurReg]
        }
        // components: { inputOrSelect },
        // componentsOptions: {
        //   type: this.inputTypeChange
        // }
      }
    }
    // 验布信息配置
    const clothInspectionData = {
      _tableForm: {
        prop: 'clothInspectionTable',
        headerCellStyle: { 'background-color': '#F5F7FA' },
        className: 'pop-table',
        itemType: 'table-form',
        label: '',
        labelWidth: '0',
        dataSource: [
          // { yarnFineness: 'yyy', elementName: 'zzz', yarnRatio: 'ccc', edit: true, isDyed: 0, reviewResult: 1, colorEdit: true, colorRatioEdit: false },
          // { yarnFineness: 'yyy', elementName: 'zzz', yarnRatio: 'ccc', isDyed: 0, colorEdit: true, colorRatioEdit: false }
        ],
        columns: clothInspectionColumnsInfos,
        tooltipEffect: 'dark'
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
      // editionArrayData: [
      //   { label: 'v1', value: 'v1' },
      //   { label: 'v2', value: 'v2' }
      // ],
      // editionValue: 'v1',
      baseFormDatas: {},
      rawMaterialFormDatas: {},
      confirmationFormDatas: {},
      clothInspectionFormDatas: {},
      formOtions: {
        // labelWidth: '90px',
        size: 'small',
        inline: true,
        popError: true
      },

      YarnLengthUnit: '100G',
      rawMaterialFormOtions: { popError: true },
      confirmationFormOtions: { size: 'small', inline: true },
      clothInspectionFormOtions: { popError: true },
      rawMaterialData,
      confirmationData,
      clothInspectionData,

      rawMaterialColumnsInfos,
      clothInspectionColumnsInfos,

      cancelTaskpopOptions,
      status: -2,
      statusArr: [
        { value: '0', label: '待处理', color: '#FF9214', count: 0 },
        { value: '1', label: '处理中', color: '#FF9214', count: 0 },
        { value: '2', label: '待审核', color: '#FF9214', count: 0 },
        { value: '3', label: '已处理', color: '#00BCC5', count: 0 },
        { value: '5', label: '全部', color: '#888E9E', count: 0 },
        { value: '4', label: '已取消', color: '#888E9E', count: 0 }
      ],

      srcList: [
        // 'https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg',
        // 'https://fuss10.elemecdn.com/1/8e/aeffeb4de74e2fde4bd74fc7b4486jpeg.jpeg',
        // 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
      ]
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
    isShowButtonGroup({ userInfo, baseFormDatas, isEdit, status }) {
      const flag = (status + '') === '2'
      console.log(status, flag)
      return flag
    },
    isShowSave({ isEdit }) {
      // console.log(data)
      return isEdit && this.$permission(['qa:qaGreigeFabricTask:modify'])
    },
    // isShowSaveAndSubmit({ isEdit, status }) {
    //   return isEdit && status === '1'
    // },
    isShowSaveAndExamine({ isEdit, status }) {
      return isEdit && +status === 2 && this.$permission(['qa:qaGreigeFabricTask:modify'])
    },
    isShowEdit({ isEdit, status }) {
      return !isEdit && +status === 2 && this.$permission(['qa:qaGreigeFabricTask:modify'])
    },
    isShowExamine({ isEdit, status }) {
      return !isEdit && +status === 2 && this.$permission(['qa:qaGreigeFabricTask:modify'])
    },
    // isShowSubmit({ isEdit, status }) {
    //   return !isEdit && status === '1'
    // },
    isShowCancel({ isEdit, status }) {
      return isEdit
    },
    isShowCancelTask({ isEdit, status }) {
      return !isEdit && +status === 2 && this.$permission(['qa:qaGreigeFabricTask:cancel'])
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
    //     }
    //   },
    //   deep: true,
    //   immediate: true
    // },
    isEdit: {
      handler(v) {
        console.log(v)
        // const flag = v === 'edit'
        const clothInspectionData = [...this.$refs.clothInspectionSearchForm.dynamicValidateFormRuleForm.clothInspectionTable]
        clothInspectionData.forEach(item => {
          item.remarkEdit = v && +this.status === 2
        })
        this.clothInspectionFormDatas = { clothInspectionTable: clothInspectionData }
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
        font-size: 16px;
        padding: 20px 20px 15px;
        border-bottom: 1px solid #EEEFF0;
        margin-bottom: 20px;
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

    .picture {
      display: flex;
      padding: 20px;
      align-items: center;

      .picture-image {
        margin-left: 12px;
      }

      .picture-title {
        font-size: 16px;
      }
    }

    .raw-material-information,.confirmation-information,.cloth-inspection-information, .picture {
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
      .title-form {
        border-bottom: 1px solid #EEEFF0;
        margin-bottom: 20px;
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
}

</style>
