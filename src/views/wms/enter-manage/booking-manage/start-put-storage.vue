<template>
  <div class="page-main start-put-storage">
    <!-- 入库信息 -->
    <div class="form-main">
      <form-title :options="{ title: '入库信息' }" />
      <div class="form-box">
        <cs-custom-form
          ref="putStorageInfo"
          :form-datas="putStorageInfoFormDatas"
          :data-source="putStorageInfoDataSource"
          :options="formOtions"
        />
      </div>
    </div>

    <!-- 送货信息 -->
    <div class="form-main">
      <form-title :options="{ title: '送货信息' }" />
      <div class="form-box">
        <cs-custom-form
          ref="deliverInformation"
          :form-datas="deliverInfoFormDatas"
          :data-source="deliverInfoDataSource"
          :options="formOtions"
        />
      </div>
    </div>

    <!-- 货物明细列表 -->
    <div class="form-main">
      <form-title :options="{ title: '送货信息' }">
        <div slot="content">
          <el-button
            type="primary"
            size="small"
            @click="showProductInfoDialog"
          >新增产品</el-button>
        </div>
      </form-title>
      <div class="form-box spe detail">
        <!-- 布类列表 -->
        <cs-custom-table
          tooltip-effect="dark"
          :columns="columns"
          :data-source="list"
          :operates="popOperates"
          :form-otions="formOtions"
        />
      </div>
    </div>

    <!-- 备注说明、附件上传 -->
    <div class="form-main m-b60">
      <div class="form-box">
        <cs-custom-form
          ref="remarkForm"
          class="clearfix remarkForm"
          :form-datas="remarkFormDatas"
          :data-source="remarkDataSource"
          :options="remarkFormOtions"
        />
      </div>
    </div>

    <!-- 按钮 -->
    <div class="btn-rows">
      <el-button
        type="primary"
        size="small"
        @click="submitForm"
      >生成入库单</el-button>
      <el-button size="small" @click="backListPage">取消</el-button>
    </div>

    <!-- 完善信息 -->
    <cs-custom-pop ref="completeInfo" :options="infoPopOptions" />
    <!-- 弹框新增列表 -->
    <div class="pop detail">
      <cs-custom-pop ref="addProductPop" :options="addPopOptions" />
    </div>
  </div>
</template>
<script>
import { PublicWms } from '@/views/wms/public/index'
import { fetchLog } from '@/views/wms/public/fetchLog'
import { start } from './components/start-put-storage.js'
import { StartPutStorage } from './components/startPutStorage.js'
import FormTitle from '@/views/wms/public/components/formTitle'
import { BOOKING_TYPE_OF_GOODS } from '@/views/wms/public/constants'
import uploadSlotTriggerWms from './components/upload-slot-trigger-wms.vue'
export default {
  components: {
    FormTitle
  },
  mixins: [PublicWms, StartPutStorage, start, fetchLog],
  data() {
    const validateFloat = (val, property) => {
      var patt = /^\d+\.?\d{0,2}$/
      if (!patt.test(val)) {
        this.$set(this.formDatas, property, null)
      } else {
        this.$set(this.formDatas, property, val)
      }
    }
    const validateNum = (val, property) => {
      var patt = /^\+?[1-9][0-9]*$/
      if (!patt.test(val)) {
        this.$set(this.formDatas, property, null)
      } else {
        this.$set(this.formDatas, property, val)
      }
    }
    const itemStyle = this.formItemStyle()
    const dialogStyle = {
      width: '48%'
    }
    // 完善信息
    const content_1 = [
      {
        prop: 'code',
        itemStyle: dialogStyle,
        itemType: 'input',
        label: '产品编号',
        disabled: true
      },
      {
        prop: 'sellerTeamId',
        itemStyle: dialogStyle,
        itemType: 'select',
        label: '销售组织',
        dataSource: [],
        rules: [{ required: true, message: '请选择销售组织' }],
        change: (val) => {
          const sellerTeamName = this.findObj(this.sellList, val, 'value')
          this.$set(this.formDatas, 'sellerTeamName', sellerTeamName.label)
        }
      },
      {
        prop: 'property',
        itemStyle: dialogStyle,
        itemType: 'input',
        label: '产品属性',
        disabled: true
      },
      {
        prop: 'dyelot',
        itemStyle: dialogStyle,
        itemType: 'input',
        label: '缸号',
        placeholder: '请输入缸号',
        rules: [{ required: true, message: '请填写缸号' }]
      },
      {
        prop: 'flower',
        itemStyle: dialogStyle,
        itemType: 'input',
        label: '印花花号',
        disabled: true
      },
      {
        prop: 'clothColor',
        itemStyle: dialogStyle,
        itemType: 'input',
        label: '成品颜色',
        disabled: true
      },
      {
        prop: 'customNum',
        itemStyle: dialogStyle,
        itemType: 'input',
        label: '实际入库件数',
        maxlength: 20,
        change: (val) => {
          this.$set(this.formDatas, 'numberInPlan', this.formDatas.customNum)
        },
        trim: (val) => {
          validateNum(val, 'customNum')
        },
        placeholder: '请输入实际入库件数',
        rules: [{ required: true, message: '请填写实际入库件数' }]
      },
      {
        prop: 'numberInPlan',
        itemStyle: dialogStyle,
        itemType: 'input',
        label: '预计入库件数',
        disabled: true
      },
      {
        prop: 'customWeight',
        itemStyle: dialogStyle,
        itemType: 'input',
        label: '实际入库重量',
        change: (val) => {
          this.$set(this.formDatas, 'weightInPlan', this.formDatas.customWeight)
        },
        trim: (val) => {
          validateFloat(val, 'customWeight')
        },
        placeholder: '请输入实际入库重量',
        rules: [{ required: true, message: '请填写实际入库重量' }]
      },
      {
        prop: 'weightInPlan',
        itemStyle: dialogStyle,
        itemType: 'input',
        label: '预计入库重量',
        disabled: true
      },
      {
        prop: 'customUnit',
        itemStyle: dialogStyle,
        itemType: 'input',
        label: '包装单位',
        disabled: true
      },
      {
        prop: 'locationCode',
        itemStyle: dialogStyle,
        itemType: 'select',
        label: '库位',
        dataSource: [],
        rules: [{ required: true, message: '请选择库位' }]
      }
    ]
    const content_2 = [
      {
        prop: 'code',
        itemStyle: dialogStyle,
        itemType: 'input',
        label: '产品编号',
        disabled: true
      },
      {
        prop: 'sellerTeamId',
        itemStyle: dialogStyle,
        itemType: 'select',
        label: '销售组织',
        dataSource: [],
        rules: [{ required: true, message: '请选择销售组织' }],
        change: (val) => {
          const sellerTeamName = this.findObj(this.sellList, val, 'value')
          this.$set(this.formDatas, 'sellerTeamName', sellerTeamName.label)
        }
      },
      {
        prop: 'property',
        itemStyle: dialogStyle,
        itemType: 'input',
        label: '产品属性',
        disabled: true
      },
      {
        prop: 'yarnCard',
        itemStyle: dialogStyle,
        itemType: 'input',
        label: '纱牌/纱批',
        placeholder: '请输入纱牌/纱批',
        rules: [{ required: true, message: '请填写纱牌/纱批' }]
      },
      {
        prop: 'yarnColor',
        itemStyle: dialogStyle,
        itemType: 'input',
        label: '染纱颜色',
        disabled: true
      },
      {
        prop: 'dyelot',
        itemStyle: dialogStyle,
        itemType: 'input',
        label: '缸号',
        placeholder: '请输入缸号',
        rules: [{ required: true, message: '请填写缸号' }]
      },
      {
        prop: 'customNum',
        itemStyle: dialogStyle,
        itemType: 'input',
        label: '实际入库数',
        maxlength: 20,
        change: (val) => {
          this.$set(this.formDatas, 'numberInPlan', this.formDatas.customNum)
        },
        trim: (val) => {
          validateNum(val, 'customNum')
        },
        placeholder: '请输入实际入库数',
        rules: [{ required: true, message: '请填写实际入库数' }]
      },
      {
        prop: 'numberInPlan',
        itemStyle: dialogStyle,
        itemType: 'input',
        label: '预计入库数',
        disabled: true
      },
      {
        prop: 'customWeight',
        itemStyle: dialogStyle,
        itemType: 'input',
        label: '实际入库重量',
        placeholder: '请输入实际入库重量',
        change: (val) => {
          this.$set(this.formDatas, 'weightInPlan', this.formDatas.customWeight)
        },
        trim: (val) => {
          validateFloat(val, 'customWeight')
        },
        rules: [{ required: true, message: '请填写实际入库重量' }]
      },
      {
        prop: 'weightInPlan',
        itemStyle: dialogStyle,
        itemType: 'input',
        label: '预计入库重量',
        disabled: true
      },
      {
        // 数字，20字符
        prop: 'ballCount',
        itemStyle: dialogStyle,
        itemType: 'input',
        label: '球数',
        placeholder: '请输入球数',
        rules: [{ required: true, message: '请填写球数' }],
        maxlength: 20,
        trim: (val) => {
          validateNum(val, 'ballCount')
        }
      },
      {
        prop: 'isFull',
        itemStyle: dialogStyle,
        itemType: 'radio-group',
        label: '整散件',
        dataSource: [
          { label: '整', value: '1' },
          { label: '散', value: '0' }
        ],
        rules: [{ required: true, message: '请选择整散件' }],
        change: (val) => {
          this.$set(this.formDatas, 'isFullDesc', val === '1' ? '整' : '散')
        }
      },
      {
        prop: 'customUnit',
        itemStyle: dialogStyle,
        itemType: 'input',
        label: '包装单位',
        disabled: true
      },
      {
        prop: 'locationCode',
        itemStyle: dialogStyle,
        itemType: 'select',
        label: '库位',
        dataSource: [],
        rules: [{ required: true, message: '请选择库位' }]
      }
    ]
    const infoPopOptions = {
      itemType: 'dialog',
      prop: 'info',
      visible: false,
      formOptions: {
        inline: true
      },
      title: '完善信息',
      content: [],
      ok: (params) => {
        this.$set(this.list, this.index, params)
        this.infoPopOptions.visible = false
      },
      cancel: () => {
        this.infoPopOptions.visible = false
      },
      formDatas: {}
    }
    /* 入库信息 */
    const putStorageInfoDataSource = [
      {
        prop: 'custom-1',
        itemStyle: itemStyle,
        itemType: 'input',
        label: '预约单号',
        disabled: true
      },
      {
        prop: 'custom-2',
        itemStyle: itemStyle,
        itemType: 'input',
        label: '关联单号',
        disabled: true
      },
      {
        prop: 'stockType',
        itemStyle: itemStyle,
        itemType: 'select',
        label: '入库类型',
        dataSource: [
          { label: '生产入库', value: 2 },
          { label: '其他入库', value: 6 }
        ],
        disabled: true
      },
      {
        prop: 'productType',
        itemStyle: itemStyle,
        itemType: 'select',
        label: '货物类型',
        dataSource: BOOKING_TYPE_OF_GOODS,
        change: (val) => {
          this.productType = val
          this.$set(this.putStorageInfoFormDatas, 'productType', val)
          this.$set(this.infoPopOptions, 'content', this['content_' + val])
          this.getSell() // 销售组织
          this.list = []
        },
        rules: [{ required: true, message: '请选择货物类型' }]
      },
      {
        prop: 'warehouseCode',
        itemStyle: itemStyle,
        itemType: 'select',
        label: '预约入库仓库',
        dataSource: [],
        change: (val) => {
          this.warehouseCode = val
          if (this.productType) {
            this.getWarehouseLocation({ warehouseCode: val }) // 库位
          }
        },
        rules: [{ required: true, message: '请选择预约入库仓库' }]
      },
      {
        itemType: 'date',
        itemStyle: itemStyle,
        prop: 'sentInPlan',
        label: '预约送仓时间',
        placeholder: '请选择日期',
        format: 'yyyy-MM-dd',
        valueFormat: 'yyyy-MM-dd',
        rules: [{ required: true, message: '请选择预约送仓时间' }]
      },
      {
        prop: 'customNum',
        itemStyle: itemStyle,
        itemType: 'input',
        label: '实际入库数',
        disabled: true
        // mbe
      },
      {
        prop: 'customWeight',
        itemStyle: itemStyle,
        itemType: 'input',
        label: '实际入库重量(KG)',
        disabled: true
        // mbe
      },
      {
        prop: 'consigneeId',
        itemStyle: itemStyle,
        itemType: 'select',
        label: '收货员',
        dataSource: [],
        rules: [{ required: true, message: '请选择收货员' }]
      }
    ]

    /* 送货信息 */
    const deliverInfoDataSource = [
      {
        prop: 'shipperId',
        itemStyle: itemStyle,
        itemType: 'select',
        label: '货主',
        rules: [{ required: true, message: '请输入货主' }],
        dataSource: []
      },
      {
        prop: 'fabricStore',
        itemStyle: itemStyle,
        itemType: 'input',
        label: '布行',
        placeholder: '请输入布行',
        rules: [{ required: true, message: '请输入布行' }]
      },
      {
        prop: 'supplierId',
        itemStyle: itemStyle,
        itemType: 'select',
        label: '供应商',
        rules: [{ required: true, message: '请输入供应商' }],
        dataSource: []
      },
      {
        prop: 'deliveryman',
        itemStyle: itemStyle,
        itemType: 'input',
        label: '司机姓名',
        placeholder: '请输入司机姓名'
      },
      {
        prop: 'deliverymanPhone',
        itemStyle: itemStyle,
        itemType: 'input',
        label: '联系电话',
        placeholder: '请输入联系电话'
      },
      {
        prop: 'licenseNumber',
        itemStyle: itemStyle,
        itemType: 'input',
        label: '车牌号',
        placeholder: '请输入车牌号'
      }
    ]

    /* 货物明细列表（布类） */
    const clothColumns = [
      {
        prop: 'index',
        label: '序号',
        minWidth: '50',
        formater: (scope) => {
          return scope.$index + 1
        }
      },
      {
        prop: 'code',
        label: '产品编号',
        align: 'left',
        minWidth: 140,
        showOverflowTooltip: true
      },
      {
        prop: 'sellerTeamName',
        label: '销售组织',
        align: 'left',
        minWidth: 110
      },
      {
        prop: 'materielType',
        label: '物料类型',
        showOverflowTooltip: true,
        width: 120,
        formater: scope => {
          return this.getStatus(scope.row.materielType)
        }
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
        prop: 'productInfo',
        label: '产品信息',
        showOverflowTooltip: true,
        minWidth: 120
      },
      {
        prop: 'machineNo',
        label: '机台号',
        showOverflowTooltip: true,
        minWidth: 120
      },
      {
        prop: 'stitchNum',
        label: '针数',
        showOverflowTooltip: true,
        minWidth: 120
      },
      {
        prop: 'inchNum',
        label: '寸数',
        showOverflowTooltip: true,
        minWidth: 120
      },
      {
        prop: 'dyelot',
        label: '缸号',
        align: 'left',
        minWidth: 110
      },
      {
        prop: 'numberInPlan',
        label: '预计入库数',
        align: 'left',
        minWidth: 140
      },
      {
        prop: 'customNum',
        label: '实际入库数',
        align: 'left',
        minWidth: 110
      },
      {
        prop: 'weightInPlan',
        label: '预计入库重量（kg）',
        align: 'left',
        minWidth: 150
      },
      {
        prop: 'customWeight',
        label: '实际入库重量（kg）',
        align: 'left',
        minWidth: 150
      },
      {
        prop: 'customUnit',
        label: '包装单位',
        align: 'left',
        minWidth: 110
      },
      {
        prop: 'locationCode',
        label: '库位',
        align: 'left',
        minWidth: 110
      }
    ]

    /* 操作 */
    const popOperates = {
      label: '操作',
      fixed: 'right',
      align: 'left',
      width: 180,
      dataSource: [
        {
          label: '完善信息',
          isShow: true,
          permitTag: [''],
          handle: (scope) => {
            const value = this.$refs.putStorageInfo.dynamicValidateFormRuleForm
              .warehouseCode
            if (!value) {
              this.$message.error('请先选择预约入库仓库')
              return
            }
            this.$set(
              this.infoPopOptions,
              'formDatas',
              this.$utils.deepClone(this.list[scope.$index])
            )
            this.$set(
              this.formDatas,
              'customUnit',
              this.productType === 1 ? '卷' : '件'
            )
            this.index = scope.$index
            this.infoPopOptions.visible = true
          }
        },
        {
          label: '删除',
          isShow: true,
          permitTag: [''],
          style: {
            color: 'red'
          },
          handle: (params) => {
            const i = params.$index
            this.list.splice(i, 1)
          }
        }
      ]
    }

    /* 货物明细列表（纱类） */
    const gauzeColumns = [
      {
        prop: 'code',
        label: '产品编号',
        align: 'left',
        minWidth: 140,
        showOverflowTooltip: true
      },
      {
        prop: 'sellerTeamName',
        label: '销售组织',
        align: 'left',
        minWidth: 110
      },
      {
        prop: 'materielType',
        label: '物料类型',
        showOverflowTooltip: true,
        width: 120,
        formater: scope => {
          return this.getStatus(scope.row.materielType)
        }
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
        prop: 'yarnCard',
        label: '纱牌/纱批',
        align: 'left',
        minWidth: 140
      },
      {
        prop: 'dyelot',
        label: '缸号',
        align: 'left',
        minWidth: 110
      },
      {
        prop: 'numberInPlan',
        label: '预计入库数',
        align: 'left',
        minWidth: 110
      },
      {
        prop: 'customNum',
        label: '实际入库数',
        align: 'left',
        minWidth: 110
      },
      {
        prop: 'weightInPlan',
        label: '预计入库重量(KG)',
        align: 'left',
        minWidth: 140
      },
      {
        prop: 'customWeight',
        label: '实际入库重量(KG)',
        align: 'left',
        minWidth: 140
      },
      {
        prop: 'customUnit',
        label: '包装单位',
        align: 'left',
        minWidth: 110
      },
      {
        prop: 'isFullDesc',
        label: '整/散件',
        align: 'left',
        minWidth: 110
      },
      {
        prop: 'ballCount',
        label: '球数',
        align: 'left',
        minWidth: 110
      },
      {
        prop: 'locationCode',
        label: '库位',
        align: 'left',
        minWidth: 110
      }
    ]

    /* 附件上传 */
    const remarkDataSource = [
      {
        prop: 'remark',
        type: 'textarea',
        rows: 9,
        height: '180px',
        itemStyle: {
          width: '48%',
          marginRight: '20px',
          fontSize: '18px',
          color: '#151222',
          float: 'left'
        },
        itemType: 'input',
        maxlength: 255,
        label: '备注说明'
      },
      // {
      //   prop: 'attachment',
      //   label: '附件上传1',
      //   itemType: 'upload',
      //   className: 'attach',
      //   drag: 'drag',
      //   action: '/wms/upload/type/1',
      //   onPreview: (file) => {
      //     var a = document.createElement('a')
      //     var event = new MouseEvent('click')
      //     a.download = file.name
      //     a.href = file.response.data
      //     a.dispatchEvent(event)
      //   },
      //   content: [
      //     {
      //       component: uploadSlotTrigger
      //     }
      //   ],
      //   itemStyle: {
      //     width: '48%'
      //   }
      // }
      {
        prop: 'attachment',
        components: {
          uploadSlotTriggerWms
        },
        componentsOptions: {
          type: 'product',
          action: '/wms/upload/type/1',
          style: {
            width: '48%',
            float: 'right'
          },
          success: (response, file, fileList) => {
            if (fileList.length > 0) {
              const attachmentList = []
              fileList.forEach((it) => {
                if (it.hasOwnProperty('response')) {
                  attachmentList.push({
                    status: 'success',
                    uid: Math.random(),
                    url: it.response.data,
                    name: it.name
                  })
                } else {
                  attachmentList.push(it)
                }
              })
              this.fileList = attachmentList
              this.$set(
                this.remarkDataSource[1].componentsOptions,
                'filelist',
                attachmentList
              )
            }
          },
          remove: (item) => {
            const index = this.fileList.indexOf(item)
            if (index !== -1) {
              this.fileList.splice(index, 1)
            }
          },
          beforeUpload: (file) => {
            const token = this.$store.state.user.token
            if (!token) {
              this.$message({
                message: '未登录或已超时！',
                type: 'error'
              })
              return false
            }
            return true
          },
          filelist: this.fileList
        }
      }
    ]

    return {
      productType: 1,
      /* 货物明细列表（布类）*/
      clothColumns,
      list: [],
      popOperates,
      /* 货物明细列表（纱类）*/
      gauzeColumns,
      gauzeDataSource: [],
      /* 预约信息 */
      putStorageInfoFormDatas: {},
      putStorageInfoDataSource,
      formOtions: {
        inline: true,
        size: 'small'
      },
      /* 送货信息 */
      deliverInfoFormDatas: {},
      deliverInfoDataSource,
      /* 备注说明*/
      remarkFormDatas: {},
      remarkDataSource,
      remarkFormOtions: {
        inline: false,
        size: 'small',
        labelPosition: 'top'
      },
      infoPopOptions,
      content_1,
      content_2,
      index: undefined,
      filelist: [], // 附件上传的文件
      warehouseCode: '',
      warehouseType: '' // 入库类型的下拉
    }
  },
  computed: {
    columns() {
      return this.productType === 1 ? this.clothColumns : this.gauzeColumns
    },
    formDatas() {
      return this.infoPopOptions.formDatas
    }
  },
  watch: {
    productType(val) {
      this.list = []
      if (this.warehouseCode) {
        this.getWarehouseLocation({ warehouseCode: this.warehouseCode }) // 库位
      }
    },
    list: {
      handler(val) {
        var weight = 0
        var num = 0
        this.list.forEach((i) => {
          weight = parseFloat(i.customWeight) || 0 + weight
          num = parseFloat(i.customNum) || 0 + num
        })
        this.$set(this.putStorageInfoFormDatas, 'customWeight', weight)
        this.$set(this.putStorageInfoFormDatas, 'customNum', num)
      },
      deep: true
    }
  },
  created() {
    this.$set(this.infoPopOptions, 'content', this['content_1'])
    this.$set(this.putStorageInfoFormDatas, 'productType', 1)
    this.productType = 1
    this.getSell() // 销售组织
    this.warehouseType = this.$route.query.stockType
    this.$set(this.putStorageInfoFormDatas, 'stockType', parseInt(this.warehouseType))
  },
  methods: {
    // 货物类型
    getStatus(data) {
      let str = ''
      switch (data) {
        case '0101':
          str = '天然纤维'
          break
        case '0102':
          str = '化学纤维'
          break
        case '0103':
          str = '组合纱线'
          break
        case '0201':
          str = '坯布'
          break
        case '0202':
          str = '色布'
          break
        case '0203':
          str = '组合布'
          break
        case '0204':
          str = '花布'
          break
        default:
          break
      }
      return str
    }
  }
}
</script>

<style lang="scss" >
.start-put-storage {
  // .remarkForm .el-form {
  //   display: flex;
  //   justify-content: space-around;
  //   .el-upload.el-upload--text {
  //     width: 100%;
  //     text-align: center;
  //     .upload-slot-trigger {
  //       display: inline-block;
  //       line-height: 180px;
  //     }
  //   }
  //   .el-upload-dragger {
  //     width: 100%;
  //   }
  // }
  .StartPutStorage {
    .el-dialog__body {
      padding: 20px 20px 0 20px;
      .el-table th {
        background-color: #f5f7fa;
        padding: 0;
        .cell {
          height: 40px;
          line-height: 40px;
        }
      }
    }
  }
}
</style>
