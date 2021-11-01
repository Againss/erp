<template>
  <div class="remark-option">
    <!-- 备注意见-->
    <div v-if="isEdit==='detail'" class="detail-show label-show">
      <cs-custom-form ref="remarkDataShow" :data-source="remarkDataShow" :options="formOtions" :form-datas="formDatas" />
    </div>
    <div v-if="isEdit==='edit'" class="detail-edit">
      <cs-custom-form ref="remarkOptionForm" :data-source="remarkDataEdit" :options="formOtions" :form-datas="formDatas" />
    </div>
  </div>
</template>

<script>
// import uploadSlotTrigger from './upload-slot-trigger'
// import uploadFile from './upload-file'
export default {
  props: {
    isEdit: {
      type: String
    }
  },
  data() {
    // const style = {
    //   'width': '100%',
    //   'fontSize': '16px',
    //   'fontWeight': '600',
    //   'marginBottom': '15px',
    //   'marginTop': '10px'
    // }
    const style1 = {
      'width': '48%',
      'fontSize': '16px',
      // 'fontWeight': '600',
      'marginBottom': '15px',
      'marginTop': '10px',
      'marginRight': '4%'
    }
    // const style2 = {
    //   'width': '48%',
    //   'fontSize': '16px',
    //   'fontWeight': '600',
    //   'marginBottom': '15px',
    //   'marginTop': '10px'
    // }
    // const style3 = {
    //   'display': 'inline-block',
    //   'width': '40px',
    //   'height': '36px',
    //   'lineHeight': '36px',
    //   'fontSize': '16px',
    //   'fontWeight': '600',
    //   'marginRight': '20px'
    // }
    const remarkDataShow = [
      {
        prop: 'remark',
        itemType: 'input',
        itemStyle: { 'width': '80%' },
        label: '备注',
        title: true,
        showOverflowTooltip: true,
        readonly: true,
        className: 'noWrap'
      }
    ]
    const remarkDataEdit = [
      {
        itemType: 'view',
        text: '备注',
        style: style1
      },
      {
        prop: 'remark',
        itemType: 'input',
        type: 'textarea',
        itemStyle: { 'width': '100%' },
        label: '',
        trim: (value) => {
          return value
        },
        maxlength: 500
      },
      {
        prop: 'reviewOpinion',
        itemType: 'input',
        label: '',
        itemStyle: { 'width': '48%' },
        readonly: true
      }
    ]
    return {
      formOtions: {
        inline: true
      },
      remarkDataShow,
      remarkDataEdit,
      formDatas: {}
    }
  },
  computed: {
    flag() {
      return this.formDatas.flag
    }
  },
  watch: {
    isEdit(n, o) {
      if (n === 'edit') {
        // this.initData(1)
      }
    },
    // $route: {
    //   handler(v) {
    //     if (v.query.status === '1') {
    //       console.log(this.remarkData)
    //       this.initData(1)
    //     }
    //   },
    //   deep: true,
    //   immediate: true
    // },
    flag() {
      if (this.$route.query.status === '1') {
        // this.initData(1)
      }
    }
  },
  methods: {
    initData(val) {
      if (val) {
        // 处理上传附件数据问题
        if (this.formDatas.attachment) {
          const attachArr = this.formDatas.attachment && this.formDatas.attachment.split(',')
          const attachnameArr = this.formDatas && this.formDatas.attachmentName
          const fileArr = attachArr.map((item, index) => {
            return {
              name: attachnameArr[index],
              url: item
            }
          })
          this.formDatas.attachment = fileArr
        } else {
          this.formDatas.attachment = []
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .remark-option {
    padding-top: 10px;
    margin: 0;
    margin-bottom: 40px;

  }
</style>

<style lang="scss">
  .remark-option {
    background: #ffffff;
    padding: 0 20px;
    // margin: 0 20px 15px;
    .detail-show{
      .el-form-item__label-wrap {
        margin-left: 0!important;
      }
      .el-input__inner,.el-textarea__inner {
        background: #ffffff;
        border: 0;
      }

      .el-form--inline .el-form-item{
        margin-right: 0px;
      }
    }

    .label-show .el-form-item__label {
      font-size: 16px;
      color: #151222;
      font-weight: 600;
    }

    .detail-edit{
      .el-form--inline .el-form-item{
        margin-right: 0px;
      }
    }
    .detail-edit .el-form-item__content > .el-input [readonly="readonly"] {
      padding: 0;
      border: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      background: #ffffff;
    }
    .uploadfile .el-upload-dragger{
      width: 100%;
      height: 120px;
    }
    .uploadfile .el-icon-upload{
      font-size: 36px;
      margin: 10px 0 0 0;
    }
    .uploadfile .el-upload{
      width: 100% !important;
    }
    .el-textarea textarea {
      height: 100px;
    }
    .noWrap input {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
</style>
