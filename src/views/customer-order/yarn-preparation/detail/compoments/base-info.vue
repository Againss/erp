<template>
  <!-- 基本信息 -->
  <div class="table-item basic-data preArrayClss">
    <div class="header-top basic-top" style="justify-content: left">
      <span>基本信息</span>
      <div
        v-if="versionInfoArray && versionInfoArray.length && !isEdit"
        class="versionClass"
      >
        <el-select
          v-model="versionInfoLength"
          filterable
          placeholder="请选择"
          @change="versionInfoChange"
        >
          <el-option
            v-for="item in versionInfoArray"
            :key="item.version"
            :label="'v' + item.version"
            :value="item.version"
          />
        </el-select>
      </div>
    </div>
    <cs-custom-form
      v-if="Object.keys(basicData).length"
      ref="basicData"
      :data-source="basicData"
      :options="formOptions"
      :form-datas="baseFormDatas"
    />
  </div>
</template>
<script>
import { PublicCustomer } from '@/views/customer-order/public/index'
import uploadFile from '../compoments/upload-file'
import { isArray } from '@/utils/validate'
import uploadSlotTrigger from '../compoments/upload-slot-trigger'
export default {
  name: 'BaseInfo',
  mixins: [PublicCustomer],
  props: {
    isEdit: {
      type: Boolean
    },
    rule: {
      type: Object
    },
    data: {
      type: Object
    },
    syncMoudleDataHandle: {
      type: Function
    },
    setParentDataHandle: {
      type: Function
    },
    vInfo: {
      type: Array
    },
    totalQuantity: { // 全部数量
      type: [Number, String]
    },
    isCopy: {
      type: Boolean
    }
  },
  data() {
    // 公用验证正则
    const basicData = {}
    const basicDataInfo = {
      _code: {
        prop: 'code',
        itemType: this.inputTypeChange,
        className: 'inputWidth',
        itemStyle: { 'width': '25%' },
        style: { 'width': '60%' },
        label: '订单号:',
        placeholder: '自动生成',
        readonly: true,
        disabled: false,
        title: true
      },
      _brand: {
        prop: 'brand',
        itemType: this.selectTypeChange,
        className: 'commonRemoteSearch',
        itemStyle: { 'width': '25%' },
        style: { 'width': '60%' },
        placeholder: '输入文字模糊查询',
        label: '品牌商:',
        valueType: 'object',
        clearable: true,
        disabled: false,
        filterable: true,
        change: (value) => { },
        visibleChange: (value, val) => {
          if (value) {
            this.getBrandSelect()
          }
        },
        dataSource: [],
        renderContent: this.renderContent
      },
      _customer: {
        prop: 'customer',
        itemType: this.selectTypeChange,
        className: 'commonRemoteSearch',
        itemStyle: { 'width': '25%' },
        style: { 'width': '60%' },
        placeholder: '输入文字模糊查询',
        label: '客户:',
        valueType: 'object',
        clearable: true,
        disabled: false,
        filterable: true,
        rules: [{ required: true, message: '客户不能为空', trigger: 'change' }],
        change: (value) => { },
        visibleChange: (value, val) => {
          if (value) {
            this.getCustomerSelect('customer')
          }
        },
        dataSource: [],
        renderContent: this.renderContent
      },
      _sellerTeam: {
        prop: 'sellerTeam',
        itemType: this.selectTypeChange,
        className: 'commonRemoteSearch',
        itemStyle: { 'width': '25%' },
        style: { 'width': '60%' },
        placeholder: '输入文字模糊查询',
        label: '销售团队:',
        valueType: 'object',
        clearable: true,
        disabled: false,
        filterable: true,
        rules: [{ required: true, message: '销售团队不能为空', trigger: 'change' }],
        change: (value) => { },
        visibleChange: (value, val) => {
          if (value) {
            this.getSellTeamSelect('sellerTeam')
          }
        },
        dataSource: [],
        renderContent: this.renderContent
      },
      _seller: {
        prop: 'seller',
        itemType: this.selectTypeChange,
        className: 'commonRemoteSearch',
        itemStyle: { 'width': '25%' },
        style: { 'width': '60%' },
        placeholder: '输入文字模糊查询',
        label: '销售员:',
        valueType: 'object',
        clearable: true,
        disabled: false,
        filterable: true,
        rules: [{ required: true, message: '销售员不能为空', trigger: 'change' }],
        change: (value) => { },
        visibleChange: (value, val) => {
          if (value) {
            this.getSellerSelect()
          }
        },
        dataSource: [],
        renderContent: this.renderContent
      },
      _customerService: {
        prop: 'customerService',
        itemType: this.selectTypeChange,
        className: 'commonRemoteSearch',
        itemStyle: { 'width': '25%' },
        style: { 'width': '60%' },
        placeholder: '输入文字模糊查询',
        label: '客服:',
        valueType: 'object',
        clearable: true,
        disabled: false,
        filterable: true,
        rules: [{ required: true, message: '客服不能为空', trigger: 'change' }],
        change: (value) => { },
        visibleChange: (value, val) => {
          if (value) {
            this.getCustomerServiceSelect()
          }
        },
        dataSource: [],
        renderContent: this.renderContent
      },
      _year: {
        prop: 'year',
        itemType: this.selectTypeChange,
        className: ' commonRemoteSearch',
        itemStyle: { 'width': '25%' },
        label: '销售年度:',
        style: { 'width': '60%' },
        clearable: true,
        disabled: false,
        change: (value) => { },
        rules: [{ required: true, message: '销售年度不能为空', trigger: 'change' }],
        visibleChange: (value, val) => {
          if (value) {
            this.getYearSelect('year')
          }
        },
        dataSource: [],
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return value
        }
      },
      _quarter: {
        prop: 'quarter',
        itemType: this.selectTypeChange,
        className: ' commonRemoteSearch',
        itemStyle: { 'width': '25%' },
        label: '销售季度:',
        style: { 'width': '60%' },
        valueType: 'object',
        clearable: true,
        disabled: false,
        rules: [{ required: true, message: '销售季度不能为空', trigger: 'change' }],
        change: (value) => { },
        visibleChange: (value, val) => {
          if (value) {
            this.getOptionConfigSelect({ pageName: '备纱单', fieldName: '销售季度' }, 'quarter')
          }
        },
        dataSource: [],
        renderContent: this.renderContent
      }
    }
    // 表头编辑数据
    const baseEdit = {
      _attachment: {
        prop: 'attachment',
        itemType: 'upload',
        labelWidth: '90px',
        drag: true,
        itemStyle: { 'width': '50%' },
        data: {
          'bizType': 'ORDER',
          bizId: this.routeId()
        },
        className: 'uploadfile',
        label: '附件:',
        action: '/common/file/upload', // 最新的链接
        limit: 6,
        beforeRemove: (file, fileList) => {
          const editformObj = this.$utils.deepClone(fileList)
          const arr = []
          editformObj && editformObj.forEach((item, indexs) => {
            if (item.uid !== file.uid) {
              arr.push(item)
            }
          })
          this.$set(this.basicData._attachment, 'dataSource', arr)
          this.baseFormDatas = { attachment: arr }
        },
        onPreview: (file) => { },
        beforeUpload: (file) => {
          return this.DocumentGudgment(file)
        },
        onExceed: (files) => {
          this.$message.error('上传文件个数不能超过6个!')
        },
        accept: '.png,.PNG,.jpg,.JPG,.jpeg,.JPEG,.bmp,.BMP,.xlsx,.xls,.XLSX,.XLS,.pdf,.PDF,.doc,.docx,.DOC,.DOCX',
        content: [
          {
            slot: 'trigger',
            component: uploadSlotTrigger
          }
        ]
      },
      _remark: {
        prop: 'remark',
        itemType: this.inputTypeChange,
        type: 'textarea',
        labelWidth: '90px',
        itemClassName: 'precMaleft',
        className: 'precautionscolor',
        maxlength: 500,
        itemStyle: { 'width': '50%', 'margin-left': '34px;' },
        label: '备注:',
        trim: (value) => {
          return value
        },
        dataSource: [],
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return value ? `<div title="${value}">${value}</div>` : ''
        }
      }
    }
    const baseLookOver = {
      _attachment: {
        prop: 'attachment',
        itemType: 'input',
        labelWidth: '80px',
        className: 'prec89',
        itemClassName: 'labeClassbaseEdit',
        itemStyle: { 'width': '50%' },
        label: '附件:',
        components: {
          uploadFile
        },
        componentsOptions: {
          prop: 'attachment',
          url: 'attachment',
          text: '附件:'
        }
      },
      _remark: {
        prop: 'remark',
        itemType: this.inputTypeChange,
        type: 'textarea',
        itemClassName: 'precMaright',
        disabled: true,
        readonly: true,
        maxlength: 500,
        labelWidth: '90px',
        className: 'precautionscolor',
        itemStyle: { 'width': '50%' },
        label: '备注:',
        trim: (value) => {
          return value
        }

      }

    }
    return {
      accept: '.png,.PNG,.jpg,.JPG,.jpeg,.JPEG,.bmp,.BMP,.xlsx,.xls,.XLSX,.XLS,.pdf,.PDF,.doc,.docx,.DOC,.DOCX',
      versionInfoLength: 0,
      versionInfoArray: [],
      basicData,
      baseEdit,
      baseLookOver,
      basicDataInfo,
      formOptions: {
        size: 'small',
        hideRequiredAsterisk: false,
        labelWidth: '90px',
        inline: true,
        syncDataHandle: (syncData) => {
          // console.log(syncData)
          this.syncMoudleDataHandle('baseInfoData', { baseInfo: syncData })
        }
      },
      baseFormDatas: {
        'totalQuantity': 0,
        'isEdit': true
      }
    }
  },
  computed: {
    getDemandSource() {
      return !!(this.data && this.data.demandSource && this.data.demandCode)
    }
  },
  watch: {
    data: {
      handler(v) {
        if (v && Object.keys(v).length) {
          const dataIndex = this.$utils.deepClone(v)
          this.versionInfoLength = dataIndex.version || 0
          if (this.basicData && Object.keys(this.basicData).length) {
            const sup = ['brand', 'customer', 'sellerTeam', 'seller', 'customerService', 'year', 'quarter']
            sup.forEach(item => {
              const tempData = (v[item] && v[item].value) ? [v[item]] : []
              this.$set(this.basicData['_' + item], 'dataSource', tempData)
            })
            dataIndex.attachment = isArray(dataIndex.attachment) ? dataIndex.attachment : []
            this.$set(this.basicData._attachment, 'dataSource', isArray(v.attachment) ? v.attachment : [])
            this.baseFormDatas = dataIndex
          }
          this.isClick(this.isEdit)
          this.editChange(v)
          this.$nextTick(() => {
            this.$refs.basicData.form.clearValidate()
          })
        }
      },
      deep: true,
      immediate: true
    },
    getDemandSource: {
      handler(v) {
        if (v) {
          this.isClick(v)
        }
      },
      deep: true,
      immediate: true
    },
    isEdit: {
      handler(v) {
        this.isClick(v)
        this.baseFormDatas = { isEdit: v }
        this.formOptions.hideRequiredAsterisk = !v

        const pm = v ? 'edit' : 'info'
        this.encryptFn(this.basicData, this.rule, pm)
      },
      deep: true,
      immediate: true
    },
    isCopy: {
      handler(v) {
        if (this.rule && Object.keys(this.rule).length) {
          v && this.encryptFn(this.basicData, this.rule, 'add')
        }
      },
      deep: true,
      immediate: true
    },
    rule: {
      handler(v) {
        // if (v && Object.keys(v).length) {
        //   !this.isCopy && this.encryptFn(this.basicData, v, 'edit')
        // }

      },
      deep: true,
      immediate: true
    },
    vInfo: {
      handler(v) {
        if (v.length) {
          this.versionInfoArray = v
        }
      },
      deep: true,
      immediate: true
    },
    totalQuantity: {
      handler(v) {
        console.log('Ssssom', v)
        this.baseFormDatas = { totalQuantity: v }
      },
      deep: true
    }
  },
  created() { },
  methods: {
    isClick(v) {
      if (v && !this.getDemandSource) {
        this.basicData = { ...this.basicDataInfo, ...this.baseEdit }
        this.$nextTick(() => {
          this.$refs.basicData.form.clearValidate()
        })
      } else {
        this.basicData = { ...this.basicDataInfo, ...this.baseLookOver }
      }
    },
    versionInfoChange(val) {
      let orderId = ''
      this.versionInfoArray.forEach((ix) => {
        if (ix.version === parseInt(val)) {
          orderId = ix.orderId
        }
      })
      this.setParentDataHandle('currentVersion', orderId)
    },
    inputTypeMax(type) { // 字段显示与隐藏
      if (this.isEdit) {
        return type
      }
      return 'itemview'
    },
    renderContent(value, options, form, formDatas, setFormDatas, scope) {
      return value ? value.label : ''
    },
    // 品牌商下拉
    getBrandSelect() {
      this.getBrand().then(res => {
        this.$set(this.basicData._brand, 'dataSource', res)
      })
    },
    // 选项配置下拉
    getOptionConfigSelect(data, type) {
      this.getOptionConfig(data).then(res => {
        if (type === 'quarter') { // 销售季度
          this.$set(this.basicData._quarter, 'dataSource', res)
        }
      })
    },
    // 获取客户下拉
    getCustomerSelect(type) {
      this.getCustomer().then(res => {
        if (type === 'customer') {
          this.$set(this.basicData._customer, 'dataSource', res)
        }
      })
    },
    // 获取销售团队下拉
    getSellTeamSelect(type) {
      this.getSellTeam({ functionTag: 'SAL' }).then(res => {
        if (type === 'sellerTeam') {
          this.$set(this.basicData._sellerTeam, 'dataSource', res)
        }
      })
    },
    // 获取销售员下拉
    getSellerSelect() {
      this.getSeller().then(res => {
        this.$set(this.basicData._seller, 'dataSource', res)
      })
    },
    // 获取客服下拉
    getCustomerServiceSelect() {
      this.getSeller({ functionTag: 'SAL' }).then(res => {
        this.$set(this.basicData._customerService, 'dataSource', res)
      })
    },
    // 获取年份下拉
    getYearSelect(type) {
      this.getYear().then(res => {
        if (type === 'year') {
          this.$set(this.basicData._year, 'dataSource', res)
        }
      })
    },
    // 获取id
    routeId() {
      const sp = (this.$route.params && this.$route.params.id) ? this.$route.params.id : ''
      return sp
    },
    // 编辑状态
    editChange(data) {
      if (data && data.demandSource && data.demandCode) { // 需求来源
        for (const key in this.basicData) {
          this.basicData[key].disabled = true
        }
        this.basicData._customerService.disabled = false
      } else {
        for (const key in this.basicData) {
          // this.basicData[key].disabled = !this.isEdit
          this.basicData[key].disabled = false
          const item = this.basicData[key]
          if (item.itemType === 'select' && item.filterable) {
            this.basicData[key].placeholder = '请输入文字模糊搜索'
          } else if (item.itemType === 'select' && !item.filterable) {
            this.basicData[key].placeholder = '请选择'
          } else if (item.itemType === 'input') {
            this.basicData[key].placeholder = '请输入'
          }
          if (item[key] === 'code') {
            this.basicData[key].placeholder = '自动生成'
          }
        }
        const textIndex = this.basicData && this.basicData._remark
        if (textIndex) {
          textIndex.disabled = !this.isEdit
          textIndex.readonly = !this.isEdit
        }
      }
    },
    // 判断文件上传格式
    DocumentGudgment(file) {
      const flieText = file.name.length <= 50
      let isLt1M = false
      let isXls = false
      if (flieText) {
        const fileName = file.name.split('.')
        const fileType = fileName[fileName.length - 1]
        const regexp = new RegExp(fileType)
        isXls = regexp.test(this.accept)
        isLt1M = file.size / 1024 / 1024 <= 10
      }
      if (!flieText) {
        this.$message.error('上传文件名不能超过50个字符')
      } else if (!isXls) {
        this.$message.error('上传文件只能是 JPG/JPEG/PNG/BMP/PDF/EXCEL/WORD 格式!')
      } else if (!isLt1M) {
        this.$message.error('上传文件大小不能超过 10MB!')
      }
      return isXls && isLt1M && flieText
    },
    inputTypeChange() {
      if (this.isEdit) {
        return 'input'
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
.versionClass {
  margin-left: 20px;
  width: 80px;
  display: flex;
}
.preArrayClss {
  /deep/.precMaleft label {
    // margin-left: 127px;
  }
  /deep/.precMaright {
    label {
      // margin-left: 129px;
    }
  }
}

//附件信息样式
/deep/ .uploadfile .el-upload-dragger {
  width: 100%;
  height: 139px;
}
/deep/ .uploadfile .el-upload-dragger {
  width: 100%;
  height: 139px;
}
/deep/ .uploadfile .el-icon-upload {
  font-size: 36px;
  margin: 10px 0 0 0;
}
/deep/ .uploadfile .el-upload {
  width: 100% !important;
}

/deep/ .precautionscolor {
  textarea {
    color: #000 !important;
    min-height: 139px !important;
  }
}
</style>
