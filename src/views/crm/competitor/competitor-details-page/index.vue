<template>
  <div class="competitor-details-page">
    <div class="competitorHeader">
      <span class="competitorText">竞争对手</span>
      <div class="details-button">
        <el-button size="mini" @click="detailEdit">编辑</el-button>
        <el-button size="mini" type="danger" plain @click="detailDelete">删除</el-button>
        <el-button size="mini" @click="changeOwnerClick">更改所有人</el-button>
        <!-- <changeOwner :ok-click="okClick" :visible="visible" @visibleClick="visiblePopOption" /> -->
        <!-- <el-button @click="$router.back()">返回</el-button> -->
      </div>
    </div>
    <!-- 搜索表单 -->
    <div class="detailSearch">
      <cs-custom-form ref="searchForm" :data-source="searchData" :options="formOtions" :form-datas="formDatas" />
    </div>
    <!-- 导入pop弹出层 -->
    <div class="pop">
      <cs-custom-pop :options="popOptions" />
    </div>
    <!-- 导入更改所有人pop弹出层 -->
    <div class="pop">
      <cs-custom-pop :options="OwnerPopOptions" />
    </div>
  </div>
</template>

<script>
// import changeOwner from '@/views/crm/public/components/change-owner.vue'
import { Competitor } from '../components/index'
import { PublicCrm } from '@/views/crm/public/index'
export default {
  components: {
    // changeOwner
  },
  mixins: [Competitor, PublicCrm],
  data() {
    // 公用验证正则
    // const commonChangeReg = this.$getRules({})
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    // 姓名正则
    // const nameReg = this.$getRules({ type: 'department', message: '最大长度为50', trigger: ['blur'] })
    // 数字验证
    const numberReg = this.$getRules({ type: 'number', trigger: ['blur'] })
    // 金额数字正则
    const moneyReg = this.$getRules({ type: 'number', pattern: /^(([1-9]{1}\d{0,8})|(0{1}))(\.\d{1,2})?$/, message: '请输入最多9位整数或保留1到2位小数', trigger: ['blur'] })
    // 公用组件样式
    const style = {
      'width': '100%',
      'font-size': '16px',
      'font-weight': '400',
      'letter-spacing': '2px',
      'color': '#333',
      'border-bottom': '1px #EEEFF0 solid',
      'margin-top': '20px',
      'padding-bottom': '10px',
      'margin-bottom': '10px'
    }

    // pop弹出框配置信息
    const popOptions = {
      itemType: 'dialog',
      visible: false,
      title: '修改',
      width: '720px',
      // okText: '保存',
      customClass: 'popOptionsClass',
      ok: params => {
        console.log('确认', params)
        delete params.follower
        const lastYearsSales = params.lastYearsSales && (params.lastYearsSales * 10000).toFixed()
        this.editCompetitor({ ...params, lastYearsSales }, true)
      },
      cancel: params => {
        this.closePopDialogHandle(this.popOptions)
        // console.log(params)
      },
      formDatas: {
      },
      formOptions: {
        inline: true
        // labelWidth: '111px'
      },
      content: [
        {
          prop: 'name',
          itemType: 'input',
          itemStyle: { 'width': '47%', 'marginRight': '0px' },
          maxlength: 50,
          label: '竞争对手名',
          rules: [commonBlurReg],
          placeholder: '请输入名称'
        },
        {
          prop: 'provinceId',
          itemType: 'select',
          labelWidth: '121px',
          itemStyle: { 'width': '53%', 'marginRight': '0px' },
          label: '省',
          // props: {
          //   label: 'name',
          //   value: 'id'
          // },
          dataSource: [],
          change: this.provinceChange
        },
        {
          prop: 'cityId',
          itemType: 'select',
          itemStyle: { 'width': '47%', 'marginRight': '0px' },
          label: '市',
          dataSource: [],
          change: this.cityChange
        },
        {
          prop: 'areaId',
          itemType: 'select',
          labelWidth: '121px',
          itemStyle: { 'width': '53%', 'marginRight': '0px' },
          label: '区',
          dataSource: []
        },
        {
          prop: 'address',
          itemType: 'input',
          itemStyle: { 'width': '47%', 'marginRight': '0px' },
          maxlength: 100,
          label: '详细地址',
          // rules: [commonBlurReg, nameReg],
          placeholder: '请输入详细地址'
        },
        {
          prop: 'phone',
          itemType: 'input',
          labelWidth: '121px',
          itemStyle: { 'width': '53%', 'marginRight': '0px' },
          maxlength: 12,
          label: '座机',
          rules: [numberReg],
          placeholder: '请输入座机号'
        },
        {
          prop: 'personNum',
          itemType: 'input',
          itemStyle: { 'width': '47%', 'marginRight': '0px' },
          maxlength: 7,
          label: '总人数',
          rules: [numberReg],
          placeholder: '请输入总人数'
        },
        {
          prop: 'lastYearsSales',
          itemType: 'input',
          labelWidth: '121px',
          itemStyle: { 'width': '53%', 'marginRight': '0px' },
          maxlength: 12,
          label: '上年销售额',
          rules: [moneyReg],
          placeholder: '请输入上年销售额'
        },
        {
          prop: 'remark',
          itemType: 'input',
          itemStyle: { 'width': '100%', 'marginRight': 0 },
          maxlength: 1000,
          type: 'textarea',
          autosize: { minRows: 2, maxRows: 4 },
          label: '备注',
          // rules: [commonBlurReg, nameReg],
          placeholder: '请输入备注'
        }
      ]
    }
    const searchData = [
      {
        itemType: 'view',
        itemStyle: { 'width': '50%', 'marginRight': 0 },
        text: '基本信息',
        style
      },
      {
        prop: 'name',
        itemType: 'input',
        itemStyle: { 'width': '50%', 'marginRight': 0 },
        label: '竞争对手名:',
        readonly: true
      },
      {
        prop: 'provinceId',
        itemType: 'input',
        itemStyle: { 'width': '50%', 'marginRight': 0 },
        label: '省:',
        // disabled: true
        readonly: true
      },
      {
        prop: 'cityId',
        itemType: 'input',
        itemStyle: { 'width': '50%', 'marginRight': 0 },
        label: '市:',
        // disabled: true
        readonly: true
      },
      {
        prop: 'areaId',
        itemType: 'input',
        itemStyle: { 'width': '50%', 'marginRight': 0 },
        label: '区:',
        // disabled: true
        readonly: true
      },
      {
        prop: 'address',
        itemType: 'input',
        itemStyle: { 'width': '50%', 'marginRight': 0 },
        label: '详细地址:',
        readonly: true
      },
      {
        prop: 'remark',
        itemType: 'input',
        type: 'textarea',
        autosize: true,
        itemStyle: { 'width': '100%', 'marginRight': 0 },
        label: '备注:',
        readonly: true
      },
      {
        itemType: 'view',
        text: '系统信息',
        style
      },
      {
        prop: 'follower',
        itemType: 'input',
        itemStyle: { 'width': '50%', 'marginRight': 0 },
        label: '所有人:',
        readonly: true
      },
      {
        prop: 'createdBy',
        itemType: 'input',
        itemStyle: { 'width': '50%', 'marginRight': 0 },
        label: '创建人:',
        readonly: true
      },
      {
        prop: 'createdTime',
        itemType: 'input',
        itemStyle: { 'width': '50%', 'marginRight': 0 },
        label: '创建日期:',
        readonly: true,
        trim: value => {
          console.log(value)
        }
        // formater: scope => {
        //   return scope.row[scope.column.property] ? this.$filters.parseTime(scope.row[scope.column.property] + '', '{y}-{m}-{d} {h}:{i}:{s}') : ''
        // }
      },
      {
        prop: 'updatedBy',
        itemType: 'input',
        itemStyle: { 'width': '50%', 'marginRight': 0 },
        label: '上次修改人:',
        readonly: true
      },
      {
        prop: 'updatedTime',
        itemType: 'input',
        itemStyle: { 'width': '50%', 'marginRight': 0 },
        label: '上次修改日期:',
        readonly: true
        // formater: scope => {
        //   return scope.row[scope.column.property] ? this.$filters.parseTime(scope.row[scope.column.property] + '', '{y}-{m}-{d} {h}:{i}:{s}') : ''
        // }
      }
    ]
    // 更改所有人pop弹出框配置信息
    const OwnerPopOptions = {
      itemType: 'dialog',
      visible: false,
      title: '更改所有人',
      // close: () => { this.$emit('visibleClick', false) },
      //   width: '720px',
      // okText: '保存',
      customClass: 'popOptionsClass',
      ok: this.okClick,
      cancel: params => {
        // this.PopDialogHandle()
        // this.$emit('visibleClick', false)
        this.$set(this.OwnerPopOptions, 'visible', false)
        // console.log(params)
      },
      formDatas: {
        // areaNum: 86
      },
      formOptions: {
        // inline: true
        // labelWidth: '111px'
      },
      content: [
        {
          prop: 'follower',
          itemType: 'select',
          filterable: true,
          className: 'commonRemoteSearch',
          remote: true,
          remoteMethod: this.remoteUserSearch,
          loading: false,
          rules: [commonBlurReg],
          // itemStyle: { 'width': '50%', 'marginRight': 0 },
          label: '用户',
          dataSource: [],
          placeholder: '查找用户'
          // provinceName: '',
          // cityName: '',
          // areaName: ''
        }
      ]
    }
    return {
      formOtions: {
        inline: true
      },
      popOptions,
      OwnerPopOptions,
      searchData,
      formDatas: {},
      areaList: [],
      visible: false
    }
  },
  computed: {
    routeId() {
      return this.$route.params.id
    }
  },
  async created() {
    await this.getAreaSearch({}, this.popOptions, 1)
    this.routeId && this.getCompetitorInfoDisplay({ id: this.routeId })
  },
  methods: {
    detailEdit() {
      this.PopDialogHandle(this.popOptions, '编辑竞争对手')
      this.getCompetitorInfo({ id: this.routeId })
    },
    detailDelete() {
      this.$confirm(' 你确认要删除该竞争对手吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(() => {
          this.deleteCompetitor({ id: this.routeId }, true)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
    // visiblePopOption(data) {
    //   console.log(data)
    //   this.visible = data
    // }
  }
}
</script>

<style lang='scss' scoped>
.competitor-details-page {
    margin:20px;
    background-color: #fff;

    .competitorHeader {
        height: 60px;
        border-bottom: 1px solid #E9EFF2;
        display: flex;
        align-items: center;
        // margin-bottom: 20px;
    }

    .competitorText {
      font-size: 18px;
      font-weight: 400;
      color: '#151222';
      flex:1;
      margin-left: 20px;
    }

    .details-button {
        display: flex;
        margin-right: 20px;
    }
}
</style>

<style lang="scss">
.competitor-details-page {
  .detailSearch {
    // padding: 10px;
    padding: 0 40px 20px;

    .el-input__inner,.el-textarea__inner {
      border: 0;
      // border-bottom: 1px;
    }

    .el-form-item__label {
      color: #888E9E
    }

    .el-form-item {
      margin-bottom: 0px;
    }

    .el-input__inner,.el-textarea__inner {
      padding: 0 8px;
    }
  }
  .el-textarea__inner { //el_input中的隐藏属性
    resize: none;  //主要是这个样式
  }

  // .commonTabs {
  //   padding: 0 20px;
  //   .el-tabs__item {
  //     line-height: 20px;
  //     font-size: 14px;
  //   }
  //   .el-tabs__nav-scroll {
  //     padding-left: 20px;
  //   }
  // }
}
</style>
