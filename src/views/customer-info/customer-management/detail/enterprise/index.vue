<!--
 * @Description: 企业信息
 * @Autor: zhengjin
 * @Date: 2021-07-26 17:53:12
 * @LastEditors: zhengjin
 * @LastEditTime: 2021-08-09 16:22:09
-->

<template>
  <div class="enterprise">
    <div class="mail-item-content">
      <div class="mail-content-title">基本信息</div>
      <div class="mail-content-info">
        <div class="avatar">
          <div class="topAvatar">
            <el-image fit="contain" :src="imageUrl" />
            <div
              class="delete-img"
              :class="{'avatarUp': isEdit}"
            >
              <i class="el-icon-edit-outline" @click="deleteImg()">修改头像</i>
            </div>
          </div>
          <!-- <cs-custom-form
            v-else
            ref="avatarForm"
            class="personalData-form"
            :class="{ 'showImg': imageUrl}"
            :data-source="avatarData"
            :options="formOtions"
          /> -->
        </div>
        <div class="companyInfo">
          <div class="title">{{ param.name }}</div>
          <cs-custom-form
            :form-datas="param"
            :data-source="companyData"
            class="enterprise-info"
            :options="formOptions"
          />
          <cs-custom-form
            :form-datas="param"
            :data-source="registerData"
            class="enterprise-table"
            :class="{'active': isEdit}"
            :options="formOptions"
          />
        </div>
      </div>
    </div>
    <!-- 弹窗 -->
    <upload-image
      ref="uploadImage"
      :options="options"
      :upload="uploadAvatar"
      :cutting="Cutting"
      :form-data="formData"
    />
  </div>
</template>

<script>
import {
  enterpriseInfo,
  getOperaStatus,
  currencySearch,
  addEnterpriseInfo,
  updateEnterpriseInfo,
  addressInfo,
  uploadImg
} from '../../api/index.js'
// import uploadItem from './upload-item'
import uploadSoltItem from './upload-slot-item'
import uploadImage from './upload-image'
import tips from './tips'
export default {
  components: {
    uploadImage
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    type: {
      type: String
    },
    cancel: {
      type: Function
    }
  },
  data() {
    const pickerOptions = {
      disabledDate(time) {
        return time.getTime() > Date.now() - 8.64e6
      }
    }
    // const avatarData = [
    //   {
    //     prop: 'upload',
    //     itemType: 'upload',
    //     label: '',
    //     className: 'roleUpload',
    //     action: `/common/file/upload`,
    //     accept: '.jpg,.jpeg,.png,.JPG,.JPEG,.PNG',
    //     disabled: true,
    //     data: {
    //       'bizType': 'CUSTOMER'
    //     },
    //     onSuccess: async(res, file) => {
    //       console.log(res, file)
    //       if (res.code !== 200) return
    //       this.$set(
    //         this.param,
    //         'customerAvatarId',
    //         res.data.id
    //       )
    //       this.imageUrl = res.data.viewUrl
    //       this.$message.success('上传成功')
    //     },
    //     beforeUpload: (file) => {
    //       console.log(file, '------')
    //       const imgList = ['jpg', 'jpeg', 'png']
    //       const FileExt = file.name.replace(/.+\./, '')
    //       const isJPG = imgList.includes(FileExt)
    //       const isLt2M = file.size / 1024 / 1024 < 1
    //       if (!isJPG) {
    //         this.$message.error('上传头像只能是 JPG png 格式!')
    //       }
    //       if (!isLt2M) {
    //         this.$message.error('上传头像图片大小不能超过 1MB!')
    //       }
    //       return isJPG && isLt2M
    //     },
    //     showFileList: false,
    //     timeout: 30000,
    //     content: [
    //       {
    //         slot: 'trigger',
    //         component: uploadItem
    //       }
    //     ]
    //   }
    // ]
    const companyData = [
      {
        prop: 'customerTypeName',
        label: '客户类型:',
        itemType: 'itemview',
        itemStyle: { width: '33%' },
        itemComponent: tips,
        renderContent: (value) => {
          return !value ? '-' : value
        }
      },
      {
        prop: 'shortName',
        label: '简称:',
        itemType: 'itemview',
        itemStyle: { width: '33%' },
        itemComponent: tips,
        renderContent: (value) => {
          return !value ? '-' : value
        }
      },
      {
        prop: 'ename',
        label: '英文名:',
        itemType: 'itemview',
        itemStyle: { width: '33%' },
        itemComponent: tips,
        renderContent: (value) => {
          return !value ? '-' : value
        }
      },
      {
        prop: 'address',
        label: '企业地址:',
        itemType: 'itemview',
        itemComponent: tips,
        itemStyle: { width: '33%' },
        renderContent: (value, options, form, formDatas) => {
          console.log(value, options, form, formDatas)
          return formDatas.area === 'DOMESTIC'
            ? !value ? '-' : value
            : (!formDatas.countryName
              ? '-'
              : formDatas.countryName)
          // return value
          // return formDatas.area === 'DOMESTIC'
          //   ? (!formDatas.addRessInfo
          //     ? '' + (!value ? '-' : value)
          //     : `${formDatas.addRessInfo} ${!value ? '' : value}`)
          //   : (!formDatas.countryName
          //     ? '-'
          //     : formDatas.countryName)
        }
      },
      {
        prop: 'levelName',
        label: '客户级别:',
        itemType: 'itemview',
        itemStyle: { width: '33%' },
        itemComponent: tips,
        renderContent: (value) => {
          return !value ? '-' : value
        }
      },
      {
        prop: 'area',
        label: '市场类型:',
        itemType: 'itemview',
        itemStyle: { width: '33%' },
        renderContent: (value) => {
          return !value ? '-' : (value === 'DOMESTIC' ? '国内' : '海外')
        }
      },
      {
        prop: 'follower',
        label: '所有人:',
        itemType: 'itemview',
        itemStyle: { width: '33%' },
        itemComponent: tips,
        renderContent: (value) => {
          return !value ? '-' : value
        }
      }
    ]
    const registerData = [
      {
        prop: 'businessRegistraCode',
        label: '工商注册号:',
        itemType: this.inputTypeChange,
        maxlength: 50,
        clearable: true,
        itemStyle: { width: '33%' },
        itemComponent: tips,
        change: (value) => {
          this.$set(this.param, 'businessRegistraCode', value)
        },
        renderContent: (value) => {
          return !value ? '-' : value
        }
      },
      {
        prop: 'legalPerson',
        label: '法定代表人:',
        itemType: this.inputTypeChange,
        maxlength: 10,
        clearable: true,
        itemStyle: { width: '33%' },
        renderContent: (value) => {
          return !value ? '-' : value
        },
        change: (value) => {
          this.$set(this.param, 'legalPerson', value)
        }
      },
      {
        prop: 'customsRegistraCode',
        label: '海关注册编码:',
        itemType: this.inputTypeChange,
        maxlength: 50,
        clearable: true,
        itemStyle: { width: '33%' },
        itemComponent: tips,
        renderContent: (value) => {
          return !value ? '-' : value
        },
        change: (value) => {
          this.$set(this.param, 'customsRegistraCode', value)
        }
      },
      {
        prop: 'establishmentDate',
        label: '成立日期:',
        itemType: this.dateTypeChange,
        pickerOptions: pickerOptions,
        format: 'yyyy-MM-dd',
        valueFormat: 'yyyy-MM-dd',
        itemStyle: { width: '33%' },
        placeholder: '选择日期',
        renderContent: (value) => {
          return !value ? '-' : value
        },
        change: (value) => {
          this.$set(this.param, 'establishmentDate', value)
        }
      },
      {
        prop: 'currencyName',
        label: '注册币种:',
        itemType: this.selectTypeChange,
        clearable: true,
        itemStyle: { width: '33%' },
        renderContent: (value) => {
          return !value ? '-' : value
        },
        visibleChange: flag => {
          !flag || this.getCurrenc()
        },
        change: (value) => {
          console.log(value, '注册币种value')
          this.$set(this.param, 'currencyName', value)
          this.$set(this.param['currency'], 'label', value)
          if (!value) {
            return
          }
          this.$set(
            this.param['currency'],
            'value',
            this.fitterItem(this.CurrencList, value).id
          )
        },
        dataSource: []
      },
      {
        prop: 'capital',
        label: '注册资本(万):',
        itemType: this.inputTypeChange,
        clearable: true,
        itemStyle: { width: '33%' },
        renderContent: (value) => {
          // return !value ? '-' : this.$utils.priceFormat(value)
          return !value ? '-' : this.formatNumber(value)
        },
        change: (value) => {
          if (value === '') {
            this.$set(this.param, 'capital', null)
          } else {
            // this.$set(this.param, 'capital', parseInt(value))
            this.$set(this.param, 'capital', value)
          }
        }
      },
      {
        prop: 'operatStatusName',
        label: '经营状态:',
        itemType: this.selectTypeChange,
        clearable: true,
        itemStyle: { width: '33%' },
        renderContent: (value) => {
          return !value ? '-' : value
        },
        visibleChange: flag => {
          !flag || this.getOperaList()
        },
        change: (value) => {
          // console.log(value, '经营状态value', this.fitterItem(this.OperaList, value))
          this.$set(this.param['operatStatus'], 'label', value)
          this.$set(this.param, 'operatStatusName', value)
          this.$set(
            this.param['operatStatus'],
            'value',
            this.fitterItem(this.OperaList, value).id
          )
        },
        dataSource: []
      }
    ]
    // 弹窗
    const options = {
      show: false,
      title: '上传头像',
      width: '490px',
      top: '0px',
      ok: (data) => {
        console.log(data, '上传blob对象')
        this.uploadImages(data)
      },
      cancel: () => {
        console.log('取消')
        this.$set(this.options, 'show', false)
        this.$set(this.Cutting, 'img', '')
      }
    }
    const uploadAvatar = [
      {
        prop: 'upload',
        itemType: 'upload',
        label: '',
        className: 'roleUpload',
        action: `#`,
        accept: '.jpg,.jpeg,.png',
        autoUpload: false,
        beforeUpload: (file) => {
          console.log(file, '------------beforeUpload', this)
          const imgList = ['jpg', 'jpeg', 'png']
          const FileExt = file.name.replace(/.+\./, '')
          const isJPG = imgList.includes(FileExt)
          const isLt1M = file.size / 1024 / 1024 < 1
          if (!isJPG) {
            this.$message.error('上传头像只能是 JPG png 格式!')
            return
          }
          if (!isLt1M) {
            this.$message.error('上传头像图片大小不能超过 1MB!')
            return
          }
          this.fileName = file.name
          this.fileType = file.type
          var imgSrc = URL.createObjectURL(file)
          console.log(imgSrc, 'el-upload本地图片')
          this.$set(this.Cutting, 'img', imgSrc)
        },
        uploadChange: (file) => {
          console.log(file, '------------uploadChange', this)
          this.uploadAvatar[0].beforeUpload(file.raw)
        },
        showFileList: false,
        timeout: 30000,
        content: [
          {
            slot: 'trigger',
            component: uploadSoltItem
          }
        ]
      }
    ]
    const Cutting = {
      img: '',
      size: 1,
      outputType: 'jpg',
      full: true,
      canMove: true,
      canMoveBox: true,
      original: true,
      autoCrop: true,
      centerBox: true,
      autoCropWidth: 102,
      autoCropHeight: 102,
      fixedBox: true,
      high: true,
      realTime: (data) => {
        // console.log(data, '实时预览', this)
        this.formData = { ...data }
      },
      imgLoad: msg => {
        console.log(msg)
      },
      uploadImg: (e, num) => {
        console.log(e, num, 'img上传')
        var file = e.target.files[0]
        if (!/\.(jpg|jpeg|png|JPG|PNG)$/.test(e.target.value)) {
          this.$message.error('上传头像只能是 JPG png 格式!')
          e.target.value = ''
          return false
        }
        const isLt1M = file.size / 1024 / 1024 > 1
        if (isLt1M) {
          this.$message.error('上传头像图片大小不能超过 1MB!')
          e.target.value = ''
          return false
        }
        e.target.value = ''
        var reader = new FileReader()
        reader.onload = (e) => {
          let data
          if (typeof e.target.result === 'object') {
            // 把Array Buffer转化为blob 如果是base64不需要
            data = window.URL.createObjectURL(new Blob([e.target.result]))
            console.log(data, '11111')
          } else {
            data = e.target.result
            console.log(data, '2222')
          }
          if (num === 1) {
            this.$set(this.Cutting, 'img', data)
          }
        }
        this.fileName = file.name
        this.fileType = file.type
        // 转化为base64
        // reader.readAsDataURL(file)
        // 转化为blob
        reader.readAsArrayBuffer(file)
      }
    }
    return {
      pickerOptions,
      companyData,
      registerData,
      formOptions: {
        layout: true,
        inline: true
      },
      imageUrl: require('./enterpriseLogo.png'),
      isDetail: false, // 是否已入库信息
      param: {},
      // avatarData,
      formOtions: {},
      options, // 弹窗
      uploadAvatar,
      Cutting,
      formData: {}
    }
  },
  watch: {
    // isEdit(val) {
    //   this.$set(this.avatarData[0], 'disabled', !val)
    // }
  },
  async created() {
    this.customerId	 = this.$route.params.id
    await this.getEnterprise()
  },
  methods: {
    // 获取企业信息
    async getEnterprise() {
      let res = await enterpriseInfo({ 'customerId': this.customerId })
      res = this.$utils.deepClone(res)
      if (res.code === 200 && res.data) {
        !res.data.customerDetail ? this.isDetail = false : this.isDetail = true
        this.param = {
          ...res.data,
          ...res.data.customerDetail
        }
        this.$set(
          this.param,
          'establishmentDate',
          this.$filters.parseTime(this.param.establishmentDate, '{y}-{m}-{d}')
        )
        if (this.isDetail) {
          this.param.currencyName = this.param.currency.label
          this.param.operatStatusName = this.param.operatStatus.label
          this.imageUrl = !this.param.customerAvatar ? this.imageUrl : this.param.customerAvatar.viewUrl
        } else {
          this.param.currency = {}
          this.param.operatStatus = {}
        }
        if (this.param['areaId'] !== '' && this.param['areaId'] !== null) {
          // console.log('区')
          await this.getAddress(this.param['areaId'])
        } else {
          if (this.param['cityId'] !== '' && this.param['cityId'] !== null) {
            // console.log('市')
            await this.getAddress(this.param['cityId'])
          } else {
            if (this.param['provinceId'] !== '' && this.param['provinceId'] !== null) {
              // console.log('省')
              await this.getAddress(this.param['provinceId'])
            }
          }
        }
        if (this.param.area !== 'DOMESTIC') {
          this.$set(this.param, 'address', this.param['countryName'])
        }
      }
      delete this.param.customerDetail
    },
    // 省市区查询
    async getAddress(value) {
      const res = await addressInfo({
        'searchId': value
      })
      this.$set(
        this.param,
        'address',
        res.data[0].mergerName.replace(/,/g, '-') + (!this.param.address ? '' : `${'-' + this.param.address}`)
      )
    },
    // 经营状态
    async getOperaList() {
      const res = await getOperaStatus({ 'fieldName': '经营状态' })
      // console.log(res, '经营状态', this.registerData)
      if (res.code !== 200) {
        return
      }
      let data = []
      data = res.data[0].fieldValueArr.map((item) => {
        item.label = item.fieldValue
        item.value = item.fieldValue
        return item
      })
      this.$set(this.registerData[6], 'dataSource', data)
      this.OperaList = data
    },
    // 币别
    async getCurrenc() {
      const res = await currencySearch()
      // console.log(res, '币别')
      if (res.code !== 200) return
      let data = []
      data = res.data.map((item) => {
        item.label = item.name
        item.value = item.name
        return item
      })
      this.$set(this.registerData[4], 'dataSource', data)
      this.CurrencList = data
    },
    // 更改头像
    deleteImg() {
      this.$set(this.options, 'show', true)
    },
    // 保存用户信息
    submint() {
      if (this.param['capital'] && this.param['capital'] !== null) {
        if (!(/(^[0-9]\d*$)/.test(this.param['capital']))) {
          this.$message.error('注册资本只能为数字且正整数')
          return
        }
        if (parseInt(this.param['capital']) > 1000000) {
          this.$message.error('注册资金不得超过 1000000')
          return
        }
        this.param['capital'] = parseInt(this.param['capital'])
      }
      let res = null
      this.$confirm(' 你确认要提交该数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        if (this.isDetail) {
          res = await updateEnterpriseInfo(this.param)
        } else {
          res = await addEnterpriseInfo(this.param)
        }
        if (res.code !== 200) return
        this.$message.success('保存成功')
        this.getEnterprise()
        this.cancel()
      }).catch(() => {})
    },
    inputTypeChange() {
      if (this.isEdit && this.type === '1') {
        return 'input'
      }
      return 'itemview'
    },
    selectTypeChange() {
      if (this.isEdit && this.type === '1') {
        return 'select'
      }
      return 'itemview'
    },
    dateTypeChange() {
      if (this.isEdit && this.type === '1') {
        return 'date'
      }
      return 'itemview'
    },
    fitterItem(arr, value) {
      return arr.find((item) => item.value === value)
    },
    formatNumber(str) {
      return str.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
    // 图片上传
    async uploadImages(file) {
      console.log(file, 'inputUpload')
      // const param = window.URL.createObjectURL(file)
      // this.imageUrl = param
      const files = new window.File(
        [file],
        this.fileName,
        { type: this.fileType }
      )
      console.log(files)
      // var reader = new FileReader()
      // reader.readAsDataURL(files)
      // reader.onload = (e) => {
      //   this.imageUrl = e.target.result
      //   console.log(e.target.result, 'file回显1111111', this.imageUrl)
      // }
      const formData = new FormData()
      formData.append('file', files)
      formData.append('bizType', 'CUSTOMER')
      const res = await uploadImg(formData)
      console.log(res, 'imgMSG')
      if (res.code !== 200) return
      this.imageUrl = res.data.viewUrl
      this.$set(
        this.param,
        'customerAvatarId',
        res.data.id
      )
      this.$message.success('上传成功')
      this.$set(this.options, 'show', false)
      this.$set(this.Cutting, 'img', '')
    }
  }
}
</script>

<style lang="scss" scoped>
.enterprise {
  padding: 0 20px;
  .mail-item-content {
    color: #474747;
    .mail-content-title {
      display: flex;
      -webkit-box-pack: justify;
      -ms-flex-pack: justify;
      justify-content: space-between;
      line-height: 22px;
      padding: 20px 0;
      border-bottom: 1px solid #efefef;
      font-size: 16px;
    }
    .mail-content-info {
      font-size: 14px;
      padding: 20px 0;
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      -ms-flex-flow: wrap;
      flex-flow: wrap;
      .avatar {
        width: 103px;
        height: 103px;
        border: 1px solid #F0F0F0;
        border-radius: 10px;
        box-sizing: border-box;
        position: relative;
        .topAvatar {
          width: 100%;
          height: 100%;
          border-radius: 10px;
          position: absolute;
          top: 0;
          left: 0;
          vertical-align: middle;
          text-align: center;
          display: inline-grid;
          ::v-deep
          img {
            border-radius: 10px;
          }
        }
        .delete-img {
          display: none;
          width: 100%;
          height: 100%;
          border-radius: 10px;
          position: absolute;
          top: 0;
          left: 0;
          background-color: #000000;
          opacity: .6;
          .el-icon-edit-outline {
            height: 20px;
            font-size: 14px;
            color: #FFFFFF;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100%;
            cursor: pointer;
          }
        }
        &:hover {
          .avatarUp {
            display: block;
          }
        }
        ::v-deep
        .custom-form,
        .el-form,
        .el-form-item,
        .roleUpload {
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
          .el-form-item {
            margin: 0;
          }
        }
        .el-avatar {
          width: 100% !important;
          height: 100% !important;
          border-radius: 10px;
        }
        .showImg {
          opacity: 0;
        }
      }
      .companyInfo {
        margin-left: 20px;
        flex: 1;
        .title {
          font-family: PingFangSC-Regular;
          font-size: 18px;
          color: #474747;
          font-weight: 700;
          padding-left: 26px;
        }
        ::v-deep
        .custom-form {
          flex: 1;
          height: inherit !important;
          padding-right: 0 !important;
          padding: 10px 0;
          font-size: 14px;
          .el-form-item {
            margin-bottom: 0px !important;
          }
          .el-form-item__label-wrap {
            width: 100px;
            text-align: right;
            margin: 0 !important;
            .el-form-item__label {
              color: #888e9e;
              line-height: 32px;
            }
          }
          .el-form-item__content {
            line-height: 32px;
            .el-input__inner {
              height: 32px;
              line-height: 32px;
            }
          }
        }
        .active {
          ::v-deep
          .el-form-item {
            margin-bottom: 16px !important;
            .el-form-item__label-wrap {
              width: 100px;
              text-align: right;
              margin: 0 !important;
              .el-form-item__label {
                color: #474747;
                line-height: 36px !important;
              }
            }
            .el-form-item__content {
              line-height: 36px !important;
              .el-input__inner {
                height: 36px !important;
                line-height: 36px !important;
              }
            }
          }
        }
      }
    }
  }
  ::v-deep
  .el-dialog__footer {
    text-align: center !important;
  }
}
</style>
