<template>
  <div class="page-main putup-page">
    <!-- 上架信息 -->
    <div class="form-main">
      <form-title :options="{ title: '上架信息' }">
        <template slot="content">
          <span>{{
            putStorageInfoFormDatas.status === "1" ? "已上架" : "待上架"
          }}</span>
        </template>
      </form-title>
      <div class="form-box">
        <cs-custom-form
          ref="putStorageInfo"
          :form-datas="putStorageInfoFormDatas"
          :data-source="putStorageInfoData"
          :options="formOtions"
        />
      </div>
    </div>

    <!-- 上架明细明细列表 -->
    <div class="form-main">
      <form-title
        :options="{ title: '上架明细', formStyle: { borderBottom: 'none' } }"
      />
      <div class="page-table m-b60 detail">
        <div class="tab-btns add-btn">
          <el-button
            type="primary"
            size="small"
            @click="showDetailInfoDialog()"
          >添加上架明细</el-button>
        </div>
        <el-tabs v-model="active" @tab-click="detailTabClick">
          <el-tab-pane name="waiting">
            <span slot="label" class="label">待上架明细</span>
            <!-- 待上架明细（布） -->
            <cs-custom-table
              v-if="putStorageInfoFormDatas.productType === 1"
              tooltip-effect="dark"
              :columns="waitingClothColumns"
              :autoresize="false"
              :data-source="detailsDataSource"
              :pagination="watingDetailPagination"
              highlight-current-indexrow
              :form-otions="formOtions"
            />
            <!-- 待上架明细（纱） -->
            <cs-custom-table
              v-if="putStorageInfoFormDatas.productType === 2"
              tooltip-effect="dark"
              :columns="waitingGauzeColumns"
              :autoresize="false"
              :data-source="detailsDataSource"
              :pagination="watingDetailPagination"
              highlight-current-indexrow
              :form-otions="formOtions"
            />
          </el-tab-pane>
          <el-tab-pane name="already">
            <span slot="label" class="label">已上架明细</span>
            <!-- 已上架明细（布） -->
            <cs-custom-table
              v-if="putStorageInfoFormDatas.productType === 1"
              tooltip-effect="dark"
              :columns="alreadyClothColumns"
              :autoresize="false"
              :data-source="alreadyDetailDataSource"
              :pagination="alreadyDetailPagination"
              highlight-current-indexrow
              :form-otions="formOtions"
            />
            <!-- 已上架明细（纱） -->
            <cs-custom-table
              v-if="putStorageInfoFormDatas.productType === 2"
              tooltip-effect="dark"
              :columns="alreadyGauzeColumns"
              :autoresize="false"
              :data-source="alreadyDetailDataSource"
              :pagination="alreadyDetailPagination"
              highlight-current-indexrow
              :form-otions="formOtions"
            />
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <!-- 按钮 -->
    <bottomBar :options="barOptions" />

    <!-- 添加上架明细 -->
    <el-dialog
      title="添加上架明细"
      :visible.sync="dialogDetailInfoVisible"
      width="1400px"
      :before-close="closeDetailDialog"
    >
      <!-- 搜索表单 -->
      <div class="form-main">
        <cs-custom-form
          ref="bindDetailInfo"
          :form-datas="detailInfoFormDatas"
          :data-source="detailInfoData"
          :options="formOtions"
        />
        <el-button
          type="primary"
          size="small"
          class="bind-btn"
          @click="bindLocationCode()"
        >绑定库位号</el-button>
      </div>
      <!-- 添加上架明细布列表 -->
      <cs-custom-table
        v-if="putStorageInfoFormDatas.productType === 1"
        tooltip-effect="dark"
        :autoresize="false"
        :columns="detailInfoClothColumns"
        :data-source="detailInfoDataSource"
        :pagination="detailInfoPagination"
        :operates="detailInfoPopOperates"
        highlight-current-indexrow
        :form-otions="formOtions"
      />
      <!-- 添加上架明细纱列表 -->
      <cs-custom-table
        v-if="putStorageInfoFormDatas.productType === 2"
        tooltip-effect="dark"
        :autoresize="false"
        :columns="detailInfoGauzeColumns"
        :data-source="detailInfoDataSource"
        :pagination="detailInfoPagination"
        :operates="detailInfoPopOperates"
        highlight-current-indexrow
        :form-otions="formOtions"
      />
      <div class="dialog-footer-btns">
        <el-button
          type="primary"
          size="small"
          @click="savedetailInfo()"
        >确定</el-button>
        <el-button size="small" @click="closeDetailDialog()">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { PublicWms } from '@/views/wms/public/index'
import { fetchLog } from '@/views/wms/public/fetchLog'
import { PutupManage } from './components/index'
import FormTitle from '@/views/wms/public/components/formTitle'
// import store from '@/store'
import { debounce } from '@/utils'
/* import SerialNumberInfo from '@/views/wms/public/components/serialNumberInfo' */
import { getProductDetailsData } from './api/index'
import { BOOKING_TYPE_OF_GOODS } from '@/views/wms/public/constants'
import bottomBar from '@/views/wms/public/components/bottomBar.vue'
import popoverColumn from '@/components/cs-custom-table/columns/popover-column'
import propertyCard from '@/components/property-card/index.vue'
export default {
  components: {
    FormTitle,
    bottomBar
  },
  mixins: [PublicWms, PutupManage, fetchLog],
  data() {
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    const itemStyle = this.formItemStyle()

    /* 上架信息 */
    const putStorageInfoData = [
      {
        prop: 'shelfNo',
        itemStyle: itemStyle,
        disabled: true,
        itemType: 'input',
        label: '上架单号'
      },
      {
        prop: 'formNo',
        itemStyle: itemStyle,
        disabled: true,
        itemType: 'input',
        label: '关联入库单号'
      },
      {
        prop: 'shipperModel',
        itemStyle: itemStyle,
        disabled: true,
        itemType: 'input',
        label: '货主'
      },
      {
        prop: 'productType',
        itemStyle: itemStyle,
        disabled: true,
        itemType: 'select',
        label: '货物类型',
        dataSource: BOOKING_TYPE_OF_GOODS
      },
      {
        prop: 'stockIn',
        itemStyle: itemStyle,
        disabled: true,
        itemType: 'input',
        label: '入库件数'
      },
      {
        prop: 'upShelf',
        itemStyle: itemStyle,
        disabled: true,
        itemType: 'input',
        label: '上架件数'
      },
      {
        prop: 'createdTime',
        itemStyle: itemStyle,
        disabled: true,
        itemType: 'input',
        label: '上架生成时间'
      },
      {
        prop: 'shelfMan',
        disabled: false,
        itemStyle: itemStyle,
        itemType: 'select',
        valueType: 'object',
        label: '上架员',
        rules: this.$getRules({ trigger: ['blur'] }),
        // change: (obj) => {
        //   if (obj.label && obj.value) {
        //     this.confirmFinishParams.shelfManId = obj.value
        //     this.confirmFinishParams.shelfManName = obj.label
        //   }
        // },
        dataSource: []
      }
    ]

    /* 待上架明细列表（布类） */
    const waitingClothColumns = [
      {
        prop: 'batchNo',
        label: '批次号',
        showOverflowTooltip: true,
        align: 'left',
        minWidth: 150
      },
      {
        prop: 'materiel',
        label: '产品编号',
        align: 'left',
        minWidth: 180,
        components: {
          popoverColumn
        },
        componentsOptions: {
          customOptions: {
            placement: 'right',
            style: {
              color: '#0986FF',
              cursor: 'pointer',
              marginTop: '5px'
            },
            width: '500',
            content: propertyCard,
            contentOptions: {},
            trigger: 'click',
            mouseleave: true,
            formDatas: {},
            show: (scope) => {
              return scope.row['materiel']
            }
          }
        }
        /* componentsOptions: {
        },
        components: {
          SerialNumberInfo
        } */
      },
      {
        prop: 'numberInPlan',
        label: '待上架数',
        align: 'right',
        minWidth: 105
      },
      {
        prop: 'packingUnit',
        label: '包装单位',
        align: 'left',
        minWidth: 105
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
        minWidth: 105
      },
      {
        prop: 'sellerTeamName',
        label: '销售组织',
        showOverflowTooltip: true,
        align: 'left',
        minWidth: 140
      }
    ]

    /* 待上架明细列表（纱类） */
    const waitingGauzeColumns = [
      {
        prop: 'batchNo',
        label: '批次号',
        showOverflowTooltip: true,
        align: 'left',
        minWidth: 150
      },
      {
        prop: 'materiel',
        label: '产品编号',
        align: 'left',
        minWidth: 180,
        components: {
          popoverColumn
        },
        componentsOptions: {
          customOptions: {
            style: {
              color: '#0986FF',
              cursor: 'pointer',
              marginTop: '5px'
            },
            placement: 'right',
            width: '500',
            content: propertyCard,
            contentOptions: {},
            trigger: 'click',
            mouseleave: true,
            formDatas: {},
            show: (scope) => {
              return scope.row['materiel']
            }
          }
        }
        /* componentsOptions: {
        },
        components: {
          SerialNumberInfo
        } */
      },
      {
        prop: 'numberInPlan',
        label: '待上架数',
        align: 'right',
        minWidth: 105
      },
      {
        prop: 'packingUnit',
        label: '包装单位',
        align: 'left',
        minWidth: 105
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
        prop: 'dyelot',
        label: '缸号',
        align: 'left',
        minWidth: 110
      },
      {
        prop: 'yarnCard',
        label: '纱牌/批号',
        showOverflowTooltip: true,
        align: 'left',
        minWidth: 140
      },
      {
        prop: 'sellerTeamName',
        label: '销售组织',
        showOverflowTooltip: true,
        align: 'left',
        minWidth: 140
      }
    ]

    /* 待上架分页 */
    const watingDetailPagination = {
      currentChange: (val) => {
        this.getWaitingShelfProductList({
          pageSize: this.watingDetailPagination.pageSize,
          pageNum: val
        })
      },
      sizeChange: (val) => {
        this.getWaitingShelfProductList({
          pageNum: this.watingDetailPagination.currentPage,
          pageSize: val
        })
      }
    }

    /* 已经上架明细列表（布） */
    const alreadyClothColumns = [
      {
        prop: 'locationName',
        label: '库位',
        align: 'left',
        minWidth: 110
      },
      {
        prop: 'serialNo',
        label: '条码号',
        align: 'left',
        minWidth: 130
      },
      {
        prop: 'batchNo',
        label: '批次号',
        showOverflowTooltip: true,
        align: 'left',
        minWidth: 150
      },
      {
        prop: 'materiel',
        label: '产品编号',
        align: 'left',
        minWidth: 180,
        components: {
          popoverColumn
        },
        componentsOptions: {
          customOptions: {
            style: {
              color: '#0986FF',
              cursor: 'pointer',
              marginTop: '5px'
            },
            placement: 'right',
            width: '500',
            content: propertyCard,
            contentOptions: {},
            trigger: 'click',
            mouseleave: true,
            formDatas: {},
            show: (scope) => {
              return scope.row['materiel']
            }
          }
        }
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
        prop: 'sellerTeamName',
        label: '销售组织',
        showOverflowTooltip: true,
        align: 'left',
        minWidth: 140
      },
      {
        prop: 'weightAvg',
        label: '重量',
        showOverflowTooltip: true,
        align: 'right',
        minWidth: 110
      }
    ]

    /* 已经上架明细列表（纱） */
    const alreadyGauzeColumns = [
      {
        prop: 'locationName',
        label: '库位',
        align: 'left',
        minWidth: 105
      },
      {
        prop: 'serialNo',
        label: '条码号',
        align: 'left',
        minWidth: 130
      },
      {
        prop: 'batchNo',
        label: '批次号',
        showOverflowTooltip: true,
        align: 'left',
        minWidth: 150
      },
      {
        prop: 'materiel',
        label: '产品编号',
        align: 'left',
        minWidth: 180,
        components: {
          popoverColumn
        },
        componentsOptions: {
          customOptions: {
            style: {
              color: '#0986FF',
              cursor: 'pointer',
              marginTop: '5px'
            },
            placement: 'right',
            width: '500',
            content: propertyCard,
            contentOptions: {},
            trigger: 'click',
            mouseleave: true,
            formDatas: {},
            show: (scope) => {
              return scope.row['materiel']
            }
          }
        }
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
        prop: 'dyelot',
        label: '缸号',
        align: 'left',
        minWidth: 110
      },
      {
        prop: 'yarnCard',
        label: '纱牌/批号',
        showOverflowTooltip: true,
        align: 'left',
        minWidth: 140
      },
      {
        prop: 'sellerTeamName',
        label: '销售组织',
        showOverflowTooltip: true,
        align: 'left',
        minWidth: 140
      },
      {
        prop: 'weightAvg',
        label: '重量',
        showOverflowTooltip: true,
        align: 'right',
        minWidth: 140
      }
    ]

    /* 已上架分页 */
    const alreadyDetailPagination = {
      currentChange: (val) => {
        this.getAlreadyShelfProductList({
          pageSize: this.alreadyDetailPagination.pageSize,
          pageNum: val
        })
      },
      sizeChange: (val) => {
        this.getAlreadyShelfProductList({
          pageNum: this.alreadyDetailPagination.currentPage,
          pageSize: val
        })
      }
    }

    const checkSerialNo = (rule, value, callback) => {
      setTimeout(() => {
        if (value) {
          getProductDetailsData({
            serialNo: value,
            shelfNo: this.shelfNo
          }).then((response) => {
            const res = response.data
            if (this.$pub.responseValidate(res, false)) {
              const status = [401, 402, 405, 406, 407]
              if (res.code !== 200 && !status.includes(res.code)) {
                return callback(
                  new Error(res.message || '输入的条码号不存在！')
                )
              }
              return callback()
            }
          })
        } else {
          return callback()
        }
      }, 0)
    }
    /* 新增搜索表单 */
    const detailInfoData = [
      {
        prop: 'serialNo',
        itemStyle: {
          width: '25%'
        },
        itemType: 'input',
        label: '扫描条码号',
        change: (value) => {
          if (value) {
            debounce(
              this.getProductDetails({
                serialNo: value,
                shelfNo: this.shelfNo
              }),
              3000,
              true
            )
          }
        },
        rules: [
          {
            /*   required: true, */
            validator: checkSerialNo,
            trigger: ['change']
          }
        ]
      },
      {
        prop: 'locationCode',
        itemStyle: {
          width: '25%'
        },
        itemType: 'select',
        label: '上架库位',
        dastaSource: [],
        rules: commonBlurReg
      }
      /*       {
              itemType: 'operate',
              submitHidden: true,
              submitHandle: (params) => {
                if (params.locationCode) {
                  this.detailInfoDataSource = this.bindLocationCode(params)
                }
              },
              submitText: '绑定库位号',
              resetHidden: true
            } */
    ]

    /* 新增列表 (纱)*/
    const detailInfoGauzeColumns = [
      {
        prop: 'locationCode',
        label: '库位号',
        align: 'left',
        minWidth: 140
      },
      {
        prop: 'serialNo',
        label: '条码号',
        align: 'left',
        minWidth: 140
      },
      {
        prop: 'batchNo',
        label: '批次号',
        showOverflowTooltip: true,
        align: 'left',
        minWidth: 150
      },
      {
        prop: 'materiel',
        label: '产品编号',
        showOverflowTooltip: true,
        align: 'left',
        minWidth: 160,
        components: {
          popoverColumn
        },
        componentsOptions: {
          customOptions: {
            style: {
              color: '#0986FF',
              cursor: 'pointer',
              marginTop: '5px'
            },
            placement: 'right',
            width: '500',
            content: propertyCard,
            contentOptions: {},
            trigger: 'click',
            mouseleave: true,
            formDatas: {},
            show: (scope) => {
              return scope.row['materiel']
            }
          }
        }
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
        prop: 'dyelot',
        label: '缸号',
        align: 'left',
        minWidth: 100
      },
      {
        prop: 'yarnCard',
        label: '纱牌/纱批',
        showOverflowTooltip: true,
        align: 'left',
        minWidth: 150
      },
      {
        prop: 'weightAvg',
        label: '重量(KG)',
        align: 'right',
        minWidth: 100
      },
      {
        prop: 'ballCountAvg',
        label: '球数',
        align: 'right',
        minWidth: 100
      },
      {
        prop: 'sellerTeamName',
        showOverflowTooltip: true,
        label: '销售组织',
        align: 'left',
        minWidth: 150
      }
    ]

    /* 新增列表 (布)*/
    const detailInfoClothColumns = [
      {
        prop: 'locationCode',
        label: '库位号',
        align: 'left',
        minWidth: 140
      },
      {
        prop: 'serialNo',
        label: '条码号',
        align: 'left',
        minWidth: 140
      },
      {
        prop: 'batchNo',
        label: '批次号',
        showOverflowTooltip: true,
        align: 'left',
        minWidth: 150
      },
      {
        prop: 'materiel',
        label: '产品编号',
        showOverflowTooltip: true,
        align: 'left',
        minWidth: 160,
        components: {
          popoverColumn
        },
        componentsOptions: {
          customOptions: {
            placement: 'right',
            style: {
              color: '#0986FF',
              cursor: 'pointer',
              marginTop: '5px'
            },
            width: '500',
            content: propertyCard,
            contentOptions: {},
            trigger: 'click',
            mouseleave: true,
            formDatas: {},
            show: (scope) => {
              return scope.row['materiel']
            }
          }
        }
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
        prop: 'weightAvg',
        label: '重量(KG)',
        align: 'right',
        minWidth: 100
      },
      {
        prop: 'sellerTeamName',
        showOverflowTooltip: true,
        label: '销售组织',
        align: 'left',
        minWidth: 150
      }
    ]

    /* 新增列表分页 */
    const detailInfoPagination = {
      currentChange: (val) => {
        this.getReservationProductList({
          pageSize: this.detailInfoPagination.pageSize,
          pageNum: val
        })
      },
      sizeChange: (val) => {
        this.getReservationProductList({
          pageNum: this.detailInfoPagination.currentPage,
          pageSize: val
        })
      }
    }

    /* 新增列表操作栏*/
    const detailInfoPopOperates = {
      label: '操作',
      fixed: 'right',
      align: 'left',
      width: 50,
      dataSource: [
        {
          label: '删除',
          isShow: true,
          style: {
            color: 'red'
          },
          permitTag: [''],
          handle: (params) => {
            this.delProductDetails(params.row)
          }
        }
      ]
    }

    const barOptions = {
      submitText: '完成上架',
      cancelText: '返回',
      submit: () => { this.confirmFinishPutAway() },
      cancelSubmit: () => {
        this.$router.push('/wms/enter-manage/putup-manage')
      }
    }
    return {
      active: 'waiting',
      insertActive: 'waitingProduct',
      serialNoError: '',
      formOtions: {
        inline: true,
        size: 'small'
      },
      /* 待上架明细*/
      waitingClothColumns,
      waitingGauzeColumns,
      detailsDataSource: [],
      watingDetailPagination,
      /* 已上架明细*/
      alreadyClothColumns,
      alreadyGauzeColumns,
      alreadyDetailDataSource: [],
      alreadyDetailPagination,
      /* 预约信息 */
      putStorageInfoFormDatas: {},
      putStorageInfoData,
      dialogDetailInfoVisible: false,
      /* 新增弹框搜索表单 */
      detailInfoFormDatas: {},
      detailInfoData,
      detailInfoPopOperates,

      /* 弹窗添加上架明细列表 */
      detailInfoGauzeColumns,
      detailInfoClothColumns,
      detailInfoPagination,
      detailInfoDataSource: [],
      pageType: 'detail',
      /*   status: '', */
      shelfNo: '',
      confirmFinishParams: {
        shelfManName: '',
        shelfManId: ''
      },
      barOptions
    }
  },
  created() {
    // this.status = this.$route.query['status'].toString()
    this.pageType = this.$route.query['type']
    this.shelfNo = this.$route.query['shelfNo']
    this.getSysUserList().then((data) => {
      data && this.$set(this.putStorageInfoData[7], 'dataSource', data)
    })
    /* 详情信息 */
    this.getStockInShelfInfo({ shelfNo: this.shelfNo })
    /* 待上架列表 */
    this.getWaitingShelfProductList({ shelfNo: this.shelfNo })
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

<style lang="scss" scoped>
.dialog-footer-btns {
  text-align: center;
  padding-top: 30px;
}
.add-btn {
  display: inline;
  position: absolute;
  z-index: 1000;
  top: 1px;
  right: 20px;
}
.form-main {
  position: relative;
  .bind-btn {
    /*     height: 32px;
    line-height: 32px; */
    position: absolute;
    left: 710px;
    z-index: 9999;
    top: 0px;
  }
}
.putup-page{
  /deep/.el-table .cell{
  line-height: 16px;
}
}
</style>
