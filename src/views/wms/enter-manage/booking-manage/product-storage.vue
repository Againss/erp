<!--
 * @Author: Do not edit
 * @Date: 2020-12-03 09:13:35
 * @LastEditTime: 2019-10-15 15:00:45
 * @LastEditors: Aurnm
 **  生产入库的页面
 -->
<template>
  <div class="page-main product-page-wms">
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

    <!-- 基础信息 -->
    <div class="form-main">
      <form-title :options="{ title: '基础信息' }" />
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
    <div class="form-main good-detail">
      <form-title :options="{ title: '货物明细' }">
        <div slot="content">
          <el-button
            type="primary"
            size="small"
            :disabled="!detailData.orderNo"
            @click="dialogDown"
          >导入</el-button>
        </div>
      </form-title>
      <div class="form-box spe detail">
        <!-- 布类列表 -->
        <cs-custom-table
          tooltip-effect="dark"
          :columns="columns"
          :data-source="columnList"
          :operates="popOperates"
          :form-otions="formOtions"
        />
      </div>
    </div>

    <!-- 备注说明、附件上传 -->
    <div class="form-main upload-form">
      <div class="form-box">
        <cs-custom-form
          ref="remarkForm"
          class="clearfix"
          :form-datas="remarkFormDatas"
          :data-source="remarkDataSource"
          :options="remarkFormOtions"
        />
      </div>
    </div>

    <!-- 按钮 -->
    <div class="btn-rows">
      <el-button
        v-permission="['wms:stockIn:reservation:production:submit']"
        type="primary"
        size="small"
        @click="productBtn"
      >生成入库单</el-button>
      <el-button size="small" @click="backListPage">返回</el-button>
    </div>

    <!-- 弹框编辑细码的弹框 -->
    <div class="pop-detail detail">
      <cs-custom-pop ref="editPop" class="editPopClass" :options="editPopOptions" />
    </div>
    <!-- 下载模板，导入的弹框 -->
    <div class="importPop">
      <cs-custom-pop class="uploadDialog" :options="importDialog" />
    </div>
  </div>
</template>
<script>
import { PublicWms } from '@/views/wms/public/index'
import { fetchLog } from '@/views/wms/public/fetchLog'
import { ProductPage } from './components/productPage.js'
import FormTitle from '@/views/wms/public/components/formTitle'
import { BOOKING_TYPE_OF_GOODS } from '@/views/wms/public/constants'
import downloadTemplate from './components/download-template.vue'
import uploadSlotTriggerBatch from './components/upload-slot-trigger-batch.vue'
// import uploadWms from './components/upload-wms.vue'
import uploadSlotTriggerWms from './components/upload-slot-trigger-wms.vue'
import { parseTime } from '@/utils'
export default {
  components: {
    FormTitle
  },
  mixins: [PublicWms, ProductPage, fetchLog],
  data() {
    // 不能用汉字的正则
    // const ruleTrim = (data) => {
    //   data = data.replace(/[\u4E00-\u9FA5]/g, '')
    //   data = data.toUpperCase()
    //   data = data.replace('_', '')
    //   return data
    // }
    // 数字的验证
    const ruleTrim = (data) => {
      data = data.replace(/[^0-9]/g, '')
      data = data.toUpperCase()
      data = data.replace('_', '')
      return data
    }
    // 保留两位小数的正则
    var filterVal = (val) => {
      val = val.replace(/[^\d.]/g, '') // 清除“数字”和“.”以外的字符
      val = val.replace(/\.{2,}/g, '.') // 只保留第一个. 清除多余的
      val = val.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
      val = val.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3') // 只能输入两个小数
      return val
    }
    const itemStyle = this.formItemStyle()
    // 侧弹框中--输入框的样式
    const inputStyle = {
      'width': '46%',
      'display': 'inline-block',
      'margin': '2% 2%',
      'height': '26px'
    }
    const detailStyle = {
      'font-size': '16px',
      'color': '#333',
      'padding': '15px 0',
      'margin-top': '20px',
      'border-top': '1px solid #E9EFF2'
    }
    /* 入库信息 */
    const putStorageInfoDataSource = [
      {
        prop: 'custom-2',
        itemStyle: itemStyle,
        itemType: 'input',
        label: '入库单号',
        disabled: true
      },
      {
        prop: 'stockType',
        itemStyle: itemStyle,
        itemType: 'select',
        label: '入库类型',
        disabled: true,
        dataSource: [
          { label: '生产入库', value: 2 }
        ]
      },
      {
        prop: 'orderNo',
        itemStyle: itemStyle,
        itemType: 'select',
        label: '生产单号',
        dataSource: [],
        change: (value, form, formDatas, setFormDatas) => {
          this.productDetail(value)
        },
        rules: [{ required: true, message: '请选择生产单号' }],
        filterable: true
      },
      {
        prop: 'productType',
        itemStyle: itemStyle,
        itemType: 'select',
        label: '货物类型',
        dataSource: BOOKING_TYPE_OF_GOODS,
        disabled: true,
        rules: [{ required: true, message: '请选择货物类型' }]
      },
      {
        prop: 'warehouse',
        itemStyle: itemStyle,
        itemType: 'select',
        label: '生产工厂',
        dataSource: [],
        rules: [{ required: true, message: '请选择生产工厂' }]
      },
      {
        itemType: 'date',
        itemStyle: itemStyle,
        prop: 'stockInTime',
        label: '入库时间',
        placeholder: '请选择日期',
        format: 'yyyy-MM-dd',
        valueFormat: 'yyyy-MM-dd',
        rules: [{ required: true, message: '请选择入库时间' }]
      },
      {
        prop: 'sellerTeam',
        itemStyle: itemStyle,
        itemType: 'input',
        label: '销售组织',
        disabled: true,
        dataSource: []
      },
      {
        prop: 'customNum',
        itemStyle: itemStyle,
        itemType: 'input',
        label: '实际入库数',
        disabled: true
      },
      {
        prop: 'customWeight',
        itemStyle: itemStyle,
        itemType: 'input',
        label: '实际入库重量(KG)',
        disabled: true
      }
    ]

    /* 送货信息 */
    const deliverInfoDataSource = [
      {
        prop: 'shipper',
        itemStyle: itemStyle,
        itemType: 'input',
        label: '货主',
        disabled: true,
        dataSource: []
      },
      {
        prop: 'fabricStore',
        itemStyle: itemStyle,
        itemType: 'input',
        label: '布行',
        disabled: true,
        placeholder: '请输入布行'
      },
      {
        prop: 'supplier',
        itemStyle: itemStyle,
        itemType: 'select',
        label: '供应商',
        clearable: true,
        dataSource: [],
        rules: [{ required: true, message: '请选择供应商' }]
      },
      {
        prop: 'phone',
        itemStyle: itemStyle,
        itemType: 'input',
        label: '联系电话',
        clearable: true,
        placeholder: '请输入联系电话'
      },
      {
        prop: 'consignee',
        itemStyle: itemStyle,
        itemType: 'select',
        label: '收货员',
        placeholder: '请选择收货员',
        clearable: true,
        dataSource: [],
        rules: [{ required: true, message: '请选择收货员' }]
      },
      {
        prop: 'detailCodeSourceType',
        itemStyle: itemStyle,
        itemType: 'select',
        label: '细码来源',
        disabled: true,
        dataSource: [
          { label: '手工导入', value: 2 }
        ]
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
        prop: 'materiel',
        label: '产品编号',
        align: 'left',
        minWidth: 180
      },
      {
        prop: 'productInfo',
        label: '产品信息',
        align: 'left',
        minWidth: 200,
        showOverflowTooltip: true
      },
      {
        prop: 'yarnName',
        label: '纱名',
        align: 'left',
        minWidth: 140,
        showOverflowTooltip: true
      },
      {
        prop: 'yarnProperty',
        label: '纱属性',
        align: 'left',
        minWidth: 200,
        showOverflowTooltip: true
      },
      {
        prop: 'dyelot',
        label: '缸号',
        align: 'left',
        minWidth: 200,
        showOverflowTooltip: true,
        isShow: () => {
          return this.detailData.orderType === 2 || this.detailData.orderType === 3
        }
      },
      {
        prop: 'machineNo',
        label: '机台号',
        align: 'left',
        minWidth: 110,
        isShow: () => {
          return this.detailData.orderType === 1
        }
      },
      {
        prop: 'stitchNum',
        label: '针数',
        align: 'left',
        minWidth: 110,
        isShow: () => {
          return this.detailData.orderType === 1
        }
      },
      {
        prop: 'inchNum',
        label: '寸数',
        align: 'left',
        minWidth: 110,
        isShow: () => {
          return this.detailData.orderType === 1
        }
      },
      {
        prop: 'numberInFact',
        label: '实际入库数',
        align: 'left',
        minWidth: 110
      },
      {
        prop: 'weightInFact',
        label: '实际入库重量（kg）',
        align: 'left',
        minWidth: 150
      },
      {
        prop: 'packingUnit',
        label: '包装单位',
        align: 'left',
        minWidth: 110,
        formater: (scope) => {
          return '卷'
        }
      }
    ]
    // 模板下载和批量导入的弹框
    const importDialog = {
      itemType: 'dialog',
      visible: false,
      title: '导入信息',
      cancelHidden: true,
      okHidden: true,
      width: '730px',
      height: '261px',
      marginTop: '10%',
      formDatas: {},
      content: [
        {
          prop: 'upload',
          itemType: 'upload',
          label: '',
          className: 'upLoadPro',
          itemStyle: {
            // width: '45%',
            display: 'inline-block',
            float: 'left',
            marginRight: '30px'
          },
          onSuccess: (res, file) => {
            this.$message.success('导入成功')
            // 过滤出相同的数据--机台号
            const sameList = res.data.filter(ele => this.columnList.find(e => e.materiel === ele.materiel && e.machineNo === ele.machineNo && e.stitchNum === ele.stitchNum && e.inchNum === ele.inchNum))
            // 过滤出不同的数据，添加到数组中
            const newList = res.data.filter(ele => !this.columnList.find(e => e.materiel === ele.materiel && e.machineNo === ele.machineNo && e.stitchNum === ele.stitchNum && e.inchNum === ele.inchNum))
            // 过滤出相同的数据--缸号
            const dyList = res.data.filter(ele => this.columnList.find(e => e.materiel === ele.materiel && e.dyelot === ele.dyelot))
            // 过滤出不同的数据，添加到数组中
            const newdyList = res.data.filter(ele => !this.columnList.find(e => e.materiel === ele.materiel && e.dyelot === ele.dyelot))
            // console.log('导入缸号', dyList, newdyList)
            if (newList && newList.length > 0 && this.detailData.orderType === 1) {
              this.columnList = [...this.columnList, ...newList]
            } else if (newdyList && newdyList.length > 0 && (this.detailData.orderType === 2 || this.detailData.orderType === 3)) {
              this.columnList = [...this.columnList, ...newdyList]
            }
            // console.log('列表', this.columnList)
            if (sameList && sameList.length > 0 && this.detailData.orderType === 1) {
              sameList.forEach(e => {
                this.columnList.find((ele, index) => {
                  if (e.materiel === ele.materiel && e.machineNo === ele.machineNo && e.stitchNum === ele.stitchNum && e.inchNum === ele.inchNum) {
                    this.columnList.splice(index, 1, e)
                  }
                })
              })
            } else if (dyList && dyList.length > 0 && (this.detailData.orderType === 2 || this.detailData.orderType === 3)) {
              dyList.forEach(e => {
                this.columnList.find((ele, index) => {
                  if (e.materiel === ele.materiel && e.dyelot === ele.dyelot) {
                    this.columnList.splice(index, 1, e)
                  }
                })
              })
            }
            this.importDialog.visible = false
          },
          onError: (res, file) => {
            this.importDialog.visible = false
          },
          action: `/wms/stockIn/reservation/production/import/resolve`,
          accept: '.xlsx,.xls,XLSX,.XLS',
          showFileList: false,
          timeout: 30000,
          data: {
            orderNo: ''
          },
          content: [
            {
              slot: 'trigger',
              component: uploadSlotTriggerBatch
            }
          ]
        },
        {
          components: {
            downloadTemplate
          },
          componentsOptions: {
            orderType: ''
          },
          className: 'downLoadPro',
          itemStyle: {
            // width: '45%',
            float: 'right'
          }
        }
      ]
    }

    /* 操作 */
    const popOperates = {
      label: '操作',
      fixed: 'right',
      align: 'left',
      width: 180,
      dataSource: [
        {
          label: '编辑',
          isShow: true,
          permitTag: [''],
          handle: (scope) => {
            this.editList(scope)
          }
        },
        {
          label: '复制',
          isShow: true,
          permitTag: [''],
          handle: (scope) => {
            this.copyList(scope)
          }
        },
        {
          label: '删除',
          isShow: (scope) => {
            if (scope.$index !== 0 && scope.row.copyBool) {
              return true
            }
          },
          permitTag: [''],
          style: {
            color: 'red'
          },
          handle: (scope) => {
            if (scope.row.copyBool) {
              const i = scope.$index
              this.columnList.splice(i, 1)
            }
          }
        }
      ]
    }

    // 侧弹框表格操作信息--复制，编辑，删除
    const detailOperates = [
      {
        label: '复制',
        isShow: (scope) => {
          return true
        },
        handle: (scope, form, formDatas, setformdatas) => {
          const arr = [...formDatas.editDetail, scope.row]
          this.comp(arr)
        }
      },
      {
        label: '删除',
        isShow: (scope) => scope.$index !== 0,
        style: { 'color': '#FE4949' },
        handle: (scope, form, formDatas, setformdatas) => {
          const arr = [...formDatas.editDetail]
          arr.splice(scope.$index, 1)
          this.comp(arr)
        }
      }
    ]
    // 明细表头设置
    const detailColumns = {
      _detailCode: {
        prop: 'detailCode',
        label: '细码号',
        labelClassName: 'product-is-request',
        className: 'product-no-request',
        editOptions: {
          labelWidth: '0',
          itemType: 'input',
          maxlength: 10,
          clearable: true,
          placeholder: '请输入细码',
          trim: ruleTrim,
          rules: [{ required: true, message: '请输入细码' }]
        }
      },
      _weightIn: {
        prop: 'weightIn',
        label: '入库重量（KG）',
        labelClassName: 'product-is-request',
        className: 'product-no-request',
        editOptions: {
          labelWidth: '0',
          itemType: 'input',
          clearable: true,
          placeholder: '请输入重量',
          maxlength: 10,
          trim: (val) => {
            return filterVal(val)
          },
          change: (value, form, formDatas, setFormDatas, scope) => {
            this.comp(formDatas.editDetail)
          },
          rules: [{ required: true, message: '请输入重量' }]
        }
      },
      _inTime: {
        prop: 'inTime',
        label: '入库时间',
        labelClassName: 'product-is-request',
        className: 'product-no-request',
        editOptions: {
          labelWidth: '0',
          prop: 'inTime',
          placeholder: '请选择入库时间',
          type: 'date',
          itemType: 'date',
          format: 'yyyy-MM-dd',
          valueFormat: 'timestamp',
          rules: [{ required: true, message: '请选择入库时间' }]
        },
        formater: (scope) => {
          return scope.row.inTime
            ? parseTime(scope.row.inTime, '{y}-{m}-{d}')
            : ''
        }
      }
    }
    // 侧弹框--编辑
    const editPopOptions = {
      itemType: 'drawer',
      visible: false,
      title: '编辑',
      okText: '保存',
      ok: params => {
        /* 校验的条件： 1、columnList表格不能重复填写机台号和缸号
        2、在原有编辑上，要通过不能弹出提示
        3、复制时如果有同样的产品编号，机台号，针数，寸数时，报提示；但是不能第一条编辑时报提示
        4、细码明细中，细码号不能重复
        */
        // 复制出货物明细中的数据
        const copyColunm = JSON.parse(JSON.stringify(this.columnList))
        // 找到原有的数据直接删除掉，不比较即可
        copyColunm.splice(this.dataIndex, 1)
        if (copyColunm.find(val => val.machineNo === params.machineNo && val.materiel === params.materiel && val.stitchNum === params.stitchNum && val.inchNum === params.inchNum) && (this.detailData.orderType === 1)) {
          this.$message({
            type: 'warning',
            message: '请填写不同的机台号'
          })
          return false
        } else if (copyColunm.find(val => val.materiel === params.materiel && val.dyelot === params.dyelot) && (this.detailData.orderType === 2 || this.detailData.orderType === 3)) {
          this.$message({
            type: 'warning',
            message: '请填写不同的缸号'
          })
          return false
        }
        const arr = JSON.parse(JSON.stringify(params))
        // 细码号不能重复的校验
        const sameDetail = arr.editDetail.find((val, index) => {
          return arr.editDetail.find((item, i) => val.detailCode === item.detailCode && i !== index)
        })
        if (sameDetail) {
          this.$message({
            type: 'warning',
            message: '细码号不能重复！'
          })
          return false
        }
        this.columnList[params.rowIndex].details = arr.editDetail
        this.$set(this.columnList[params.rowIndex], 'weightInFact', params.weightInFact)
        this.$set(this.columnList[params.rowIndex], 'numberInFact', params.numberInFact)
        // 把缸号和机台号回显到表格中去
        this.$set(this.columnList[params.rowIndex], 'machineNo', params.machineNo)
        this.$set(this.columnList[params.rowIndex], 'dyelot', params.dyelot)
        this.editPopOptions.visible = false
      },
      beforeClose: (form, formDatas) => {
        this.editPopOptions.visible = false
      },
      cancel: (params) => {
        this.editPopOptions.visible = false
      },
      formDatas: {},
      formOptions: {},
      content: {
        _materiel: {
          itemType: 'input',
          prop: 'materiel',
          label: '产品编号',
          itemStyle: inputStyle,
          disabled: true
        },
        _productInfo: {
          itemType: 'input',
          prop: 'productInfo',
          label: '产品信息',
          itemStyle: inputStyle,
          disabled: true
        },
        _machineNo: {
          itemType: 'input',
          prop: 'machineNo',
          itemStyle: inputStyle,
          label: '机台号',
          maxlength: 10,
          change: (value, form, formDatas, setFormDatas) => {
            this.editPopOptions.formDatas.machineNo = value
          },
          isShow: () => {
            return this.detailData.orderType === 1
          },
          rules: [{ required: true, message: '请输入机台号' }]
        },
        _dyelot: {
          itemType: 'input',
          prop: 'dyelot',
          itemStyle: inputStyle,
          label: '缸号',
          maxlength: 10,
          isShow: () => {
            return this.detailData.orderType === 2 || this.detailData.orderType === 3
          },
          change: (value, form, formDatas, setFormDatas) => {
            this.editPopOptions.formDatas.dyelot = value
          },
          rules: [{ required: true, message: '请输入缸号' }]
        },
        _stitchNum: {
          itemType: 'input',
          prop: 'stitchNum',
          itemStyle: inputStyle,
          label: '针数',
          disabled: true,
          isShow: () => {
            return this.detailData.orderType === 1
          }
        },
        _numberInFact: {
          itemType: 'input',
          prop: 'numberInFact',
          label: '实际入库数(卷)',
          itemStyle: inputStyle,
          disabled: true
        },
        _inchNum: {
          itemType: 'input',
          prop: 'inchNum',
          itemStyle: inputStyle,
          label: '寸数',
          disabled: true,
          isShow: () => {
            return this.detailData.orderType === 1
          }
        },
        _weightInFact: {
          itemType: 'input',
          prop: 'weightInFact',
          label: '实际入库重量(KG)',
          itemStyle: inputStyle,
          disabled: true
        },
        _packingUnit: {
          itemType: 'input',
          prop: 'packingUnit',
          label: '包装单位',
          itemStyle: inputStyle,
          disabled: true
        },
        _tableTital: {
          itemType: 'view',
          text: '细码明细',
          style: detailStyle
        },
        _tableData: {
          prop: 'editDetail',
          itemType: 'table-form',
          label: '',
          border: true,
          dataSource: [],
          className: 'detailsForm',
          itemStyle: {
            marginBottom: '0px',
            lineHeight: '5px'
          },
          columns: detailColumns,
          operates: {
            label: '操作',
            width: '120',
            dataSource: detailOperates
          }
        }
      }
    }

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
      {
        prop: 'attachment',
        // className: 'attachPro',
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
      editPopOptions, // 编辑弹框
      importDialog,
      detailTable: [], // 编辑弹框的数据源--一开始为空，，导入或者是自己添加数据
      detailOperates, // 明细弹框中的操作
      detailColumns, // 明细表头内容
      /* 货物明细列表（布类）*/
      clothColumns,
      columnList: [],
      popOperates,
      /* 入库信息 */
      putStorageInfoFormDatas: {},
      putStorageInfoDataSource,
      formOtions: {
        inline: true,
        size: 'small'
      },
      /* 基础信息 */
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
      filelist: [], // 附件上传的文件
      detailData: {}, // 详情的数据
      addData: {}, // 弹窗保存内容
      dataIndex: '' // 点击编辑的哪条数据
    }
  },
  computed: {
    columns() {
      return this.clothColumns
    }
  },
  watch: {
    columnList: {
      handler(val) {
        // 重量相加
        const weightInFact = this.columnList.reduce((w, s) => {
          w += s.weightInFact * 1 || 0
          return w
        }, 0)
        // 数量相加
        const numberInFact = this.columnList.reduce((w, s) => {
          w += s.numberInFact * 1 || 0
          return w
        }, 0)
        // 把实际入库数和重量回显
        this.$set(this.putStorageInfoFormDatas, 'customWeight', this.$utils.getFloat(weightInFact, 2))
        this.$set(this.putStorageInfoFormDatas, 'customNum', numberInFact)
        // 因为实际入库数和重量要回显，影响到生产工厂，所以把生产工厂重新填入进去
        if (this.$refs.putStorageInfo.dynamicValidateFormRuleForm.warehouse && this.warehouse.length > 0) {
          this.$set(this.putStorageInfoFormDatas, 'warehouse', this.$refs.putStorageInfo.dynamicValidateFormRuleForm.warehouse)
        } else {
          this.$set(this.putStorageInfoFormDatas, 'warehouse', '')
        }
      },
      deep: true
    }
  },
  created() {
    // 货物类型默认是布
    this.$set(this.putStorageInfoFormDatas, 'productType', 1)
    // 页面一进来就识别是入库类型
    this.$set(this.putStorageInfoFormDatas, 'stockType', parseInt(this.$route.query.stockType))
    // 页面默认是手工导入
    this.$set(this.deliverInfoFormDatas, 'detailCodeSourceType', 2)
    // 把收货员填充进去
    this.$set(this.deliverInfoFormDatas, 'consignee', this.$store.state.user.userId)
    // 获取生产单号的下拉
    this.getProduct()
  }
}
</script>

<style lang="scss" scoped>
.product-page-wms {
  .upload-form{
    margin-bottom: 80px;
  }
  .good-detail .form-box {
    padding: 0px 20px 20px 20px;
  }
  .el-upload-list{
    margin-bottom: 20px;
  }
  .uploadDialog{
    margin-top: 8%;
    /deep/ .el-dialog__body {
      padding: 30px 50px 8px 50px;
    }
  }
}
</style>
<style lang="scss">
.product-page-wms {
  .el-table th {
    background-color: #f5f7fa;
  }
  // 弹框表格的样式
  .pop-detail{
    .editPopClass{
      th {
        padding: 1.5px 0;
      }
      .el-drawer {
        width: 800px !important;
      }
    .detailsForm {
      .el-input--medium .el-input__inner {
        height: 28px;
      }
    }
    .el-table td{
      padding: 5px 0;
    }
    }
  }
}
</style>
