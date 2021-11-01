<template>
  <div class="page-main bookDetails">
    <!-- 预约信息 -->
    <div class="top">
      <div class="leftBox">单号：{{ detailsInfoFormData.reservationNo }}</div>
      <div class="rightBox" v-html="statusShow" />
    </div>
    <div class="form-main">
      <form-title :options="{ title: '预约信息' }">
        <!-- <template slot="content">
          <div>单号：{{ detailsInfoFormData.reservationNo }}</div>
        </template> -->
      </form-title>
      <div class="form-box">
        <template v-if="pageType === 'details'">
          <!--  预约信息-已收货 -->
          <cs-custom-form
            v-if="status === '2'"
            ref="detailsInfo"
            :form-datas="detailsInfoFormData"
            :data-source="startReceivingDataSource"
            :options="formOtions"
          />
          <!-- 详情其它状态 -->
          <cs-custom-form
            v-else
            ref="detailsInfo"
            :form-datas="detailsInfoFormData"
            :data-source="otherDetailsInfoDataSource"
            :options="formOtions"
          />
        </template>
        <template v-else-if="pageType === 'start'">
          <!-- 开始收货-->
          <cs-custom-form
            ref="startReceivingInfo"
            :form-datas="detailsInfoFormData"
            :data-source="startReceivingDataSource"
            :options="formOtions"
          />
        </template>
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
      <form-title
        :options="{ title: '货物明细', formStyle: { borderBottom: 'none' } }"
      />
      <div class="form-box detail spe">
        <!--    <div class="button">
          <el-button
            type="primary"
            size="small"
            @click="showProductInfoDialog()"
            >新增产品</el-button
          >
        </div> -->
        <!-- 详情 -->
        <template v-if="pageType === 'details'">
          <!-- 已收货状态 -->
          <template v-if="status === '2'">
            <!--布类列表 -->
            <cs-custom-table
              v-if="detailsInfoFormData.productType === 1"
              tooltip-effect="dark"
              :columns="haveClothColumns"
              :autoresize="false"
              :data-source="cargoDetailDataSource"
              :operates="havePopOperates"
              highlight-current-indexrow
              :form-otions="formOtions"
            />
            <!-- 纱类列表 -->
            <cs-custom-table
              v-if="detailsInfoFormData.productType === 2"
              tooltip-effect="dark"
              :columns="haveGauzeColumns"
              :autoresize="false"
              :data-source="cargoDetailDataSource"
              :operates="havePopOperates"
              highlight-current-indexrow
              :form-otions="formOtions"
            />
          </template>
          <template v-else>
            <!--布类列表 -->
            <cs-custom-table
              v-if="detailsInfoFormData.productType === 1"
              tooltip-effect="dark"
              :columns="otherClothColumns"
              :autoresize="false"
              :data-source="cargoDetailDataSource"
              highlight-current-indexrow
              :form-otions="formOtions"
            />
            <!-- 纱类列表 -->
            <cs-custom-table
              v-else-if="detailsInfoFormData.productType === 2"
              tooltip-effect="dark"
              :columns="otherGauzeColumns"
              :autoresize="false"
              :data-source="cargoDetailDataSource"
              highlight-current-indexrow
              :form-otions="formOtions"
            />
            <p v-else class="is-none">暂无相关数据！</p>
          </template>
        </template>

        <!-- 开始收货 -->
        <template v-else-if="pageType === 'start'">
          <!-- 开始收货-布类列表 -->
          <cs-custom-table
            v-if="detailsInfoFormData.productType === 1"
            tooltip-effect="dark"
            :columns="startClothColumns"
            :autoresize="false"
            :data-source="cargoDetailDataSource"
            :operates="startPopOperates"
            highlight-current-indexrow
            :form-otions="formOtions"
          />
          <!-- 开始收货-纱类列表 -->
          <cs-custom-table
            v-if="detailsInfoFormData.productType === 2"
            tooltip-effect="dark"
            :columns="startGauzeColumns"
            :autoresize="false"
            :data-source="cargoDetailDataSource"
            :operates="startPopOperates"
            highlight-current-indexrow
            :form-otions="formOtions"
          />
        </template>

        <details-pagination
          :options="cargoDetailPagination"
          :params="{ status, pageType }"
          :pagination-info="paginationInfoData"
        />
      </div>
    </div>

    <!-- 备注说明、附件上传 -->
    <!-- status 状态(0-待审核，1-待收货，2-已收货，3-已拒收) -->
    <div class="form-main">
      <div class="form-box" style="width: 1200px">
        <!-- 已拒收的内容 -->
        <template v-if="status === '3'">
          <cs-custom-form
            v-if="loadingFinishid"
            ref="remarkForm"
            class="clearfix"
            :form-datas="remarkFormDatas"
            :data-source="rejectReasonDataSource"
            :options="remarkFormOtions"
          />
        </template>
        <template v-else>
          <cs-custom-form
            v-if="loadingFinishid"
            ref="remarkForm"
            class="clearfix"
            :form-datas="remarkFormDatas"
            :data-source="remarkDataSource"
            :options="remarkFormOtions"
          />
        </template>
      </div>
    </div>

    <!-- 按钮 -->
    <div class="btn-rows">
      <!-- 待收货单--详情页面的开始收货和打印收货单按钮 -->
      <el-button
        v-if="status === '1' && pageType === 'details'"
        v-permission="['wms:stockIn:reservation:complete']"
        type="primary"
        size="small"
        @click="startReceving()"
      >开始收货</el-button>
      <el-button
        v-if="status === '1' && pageType === 'details'"
        v-permission="['wms:stockIn:reservation:printReceiptForm']"
        type="primary"
        size="small"
        @click="printOrder()"
      >打印收货单</el-button>
      <el-button
        v-if="status === '4' && pageType === 'details'"
        v-permission="['wms:stockIn:reservation:audit:signed']"
        type="primary"
        size="small"
        @click="signPass()"
      >通过</el-button>
      <el-button
        v-if="status === '4' && pageType === 'details'"
        v-permission="['wms:stockIn:reservation:audit:signed']"
        type="primary"
        size="small"
        @click="signNoPass()"
      >不通过</el-button>
      <el-button
        v-if="status === '2'"
        v-permission="['wms:stockIn:reservation:printSignForm']"
        type="primary"
        size="small"
        @click="printSign()"
      >打印签收单</el-button>
      <el-button
        v-if="status === '2'"
        v-permission="['wms:stockIn:reservation:printSerial']"
        type="primary"
        size="small"
        @click="printCode()"
      >打印条码</el-button>
      <el-button
        v-if="pageType === 'start'"
        type="primary"
        size="small"
        @click="saveFinishDelivery()"
      >完成收货</el-button>
      <el-button
        v-if="pageType === 'start'"
        type="primary"
        size="small"
        @click="stopReservationSave()"
      >暂停收货</el-button>
      <el-button size="small" @click="comeBack()">返回</el-button>
    </div>

    <!--抽磅记录弹窗列表-->
    <el-dialog
      title="抽磅记录"
      :before-close="handleClose"
      :visible.sync="dialogPoundListVisible"
      width="1400px"
    >
      <!-- 布列表 -->
      <cs-custom-table
        v-if="detailsInfoFormData.productType === 1"
        tooltip-effect="dark"
        :autoresize="false"
        :columns="clothPoundListColumns"
        :data-source="poundListDataSource"
        highlight-current-indexrow
        :form-otions="formOtions"
      />
      <!-- 纱列表 -->
      <cs-custom-table
        v-if="detailsInfoFormData.productType === 2"
        tooltip-effect="dark"
        :autoresize="false"
        :columns="gauzePoundListColumns"
        :data-source="poundListDataSource"
        highlight-current-indexrow
        :form-otions="formOtions"
      />
      <div class="dialog-draw-list-footer clearfix">
        <div class="total-box">
          <p>
            <span class="label">总计</span>
            件数：<span class="text">{{ poundEntity.poundNumber }}</span>
            实际平均重量：<span
              class="text"
            >{{ poundEntity.actualWeight }}kg</span>
          </p>
        </div>

        <div class="btns-box">
          <span
            class="time"
          >抽磅时间：{{
            this.$utils.parseTime(poundEntity.boundDate || new Date())
          }}</span>
          <el-button
            type="primary"
            size="small"
            @click="handleClose()"
          >关闭</el-button>
        </div>
      </div>
    </el-dialog>

    <!-- 抽榜弹出框列表 -->
    <el-dialog
      title="抽磅"
      :visible.sync="dialogDrawListPopUpBoxList"
      width="1400px"
    >
      <div class="search">
        <cs-custom-form
          ref="dialogDrawListForm1"
          :form-datas="dialogDrawListFormDatas"
          :data-source="dialogDrawListSearchData"
          :options="formOtions"
        />
      </div>
      <div class="form-box spe detail" style="padding: 0 20px">
        <cs-custom-form
          ref="dialogDrawListTable"
          class="dialog-draw-table-form"
          :data-source="dialogDrawListDataSource"
          :form-datas="dialogDrawListFormDatas"
          :form-otions="formOtions"
        />
      </div>
      <div class="dialog-draw-list-footer clearfix">
        <div class="total-box">
          <p>
            <span class="label">总计</span>
            件数：<span class="text">{{ poundEntity.poundNumber }}</span>
            实际平均重量：<span class="text">{{
              poundEntity.actualWeight
            }}</span>
          </p>
        </div>

        <div class="btns-box">
          <span
            class="time"
          >抽磅时间：{{
            this.$utils.parseTime(poundEntity.boundDate || new Date())
          }}</span>
          <el-button @click="cancelDrawListPopBox()">取消</el-button>
          <el-button
            type="primary"
            @click="saveDrawListFormDatas()"
          >确定</el-button>
        </div>
      </div>
    </el-dialog>

    <!-- 拆分弹框 -->
    <cs-custom-pop :options="dialogSpllitPopUpVisable" />

    <!-- 修改弹出框 -->
    <cs-custom-pop :options="dialogUpdateReservationProductVisible" />
  </div>
</template>
<script>
import { PublicWms } from '@/views/wms/public/index'
import popoverColumn from '@/components/cs-custom-table/columns/popover-column'
import propertyCard from '@/components/property-card/index.vue'
import { fetchLog } from '@/views/wms/public/fetchLog'
import { BookingDetails } from './components/booking-details'
import FormTitle from '@/views/wms/public/components/formTitle'
import CustomUpload from './components/custom-upload.vue'
import DetailsPagination from './components/details-pagination'
/* import NumberInfo from './components/number-info.vue' */
import {
  BOOKING_STORAGE_TYPE_LIST,
  BOOKING_TYPE_OF_GOODS,
  BOOKING_BULK_FULL_LIST
} from '@/views/wms/public/constants'
export default {
  components: {
    FormTitle,
    DetailsPagination
  },
  mixins: [PublicWms, BookingDetails, fetchLog],
  data() {
    /* 公用验证正则 */
    const commonBlurReg = this.$getRules({ trigger: ['change'] })
    const numberBlurReg = this.$getRules({
      type: 'number',
      pattern: /^[1-9]+[0-9]*$/,
      message: '只能输入正整数！',
      trigger: ['change']
    })
    const itemStyle = this.formItemStyle()

    /* 预约信息-已收货 or 开始收货 */
    const startReceivingDataSource = [
      {
        prop: 'stockType',
        itemStyle: itemStyle,
        disabled: true,
        itemType: 'select',
        label: '入库类型',
        dataSource: BOOKING_STORAGE_TYPE_LIST
      },
      {
        prop: 'deliveryNo',
        itemStyle: itemStyle,
        disabled: true,
        title: true,
        itemType: 'input',
        label: '关联单号'
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
        prop: 'warehouseName',
        itemStyle: itemStyle,
        disabled: true,
        title: true,
        itemType: 'input',
        label: '预约入库仓库'
      },
      {
        prop: 'sentInPlan',
        itemStyle: itemStyle,
        disabled: true,
        title: true,
        itemType: 'input',
        label: '预约送仓时间'
      },
      {
        prop: 'sentInFact',
        itemStyle: itemStyle,
        disabled: true,
        title: true,
        itemType: 'input',
        label: '实际送仓时间'
      },
      {
        prop: 'numberInPlan',
        itemStyle: itemStyle,
        disabled: true,
        itemType: 'input',
        label: '预约入库总件数'
      },
      {
        prop: 'numberInFact',
        itemStyle: itemStyle,
        disabled: true,
        itemType: 'input',
        label: '实际入库总件数'
      },
      {
        prop: 'weightInPlan',
        itemStyle: itemStyle,
        disabled: true,
        itemType: 'input',
        label: '预约入库总重量（KG）'
      },
      {
        prop: 'weightInFact',
        itemStyle: itemStyle,
        itemType: 'input',
        disabled: true,
        label: '实际入库总重量（KG）'
      },
      {
        prop: 'consigneeName',
        itemStyle,
        valueType: 'object',
        itemType: 'select',
        label: '收货员',
        rules: this.$getRules({ trigger: ['blur'] }),
        change: (obj) => {
          if (obj.label && obj.value) {
            this.consigneeObj.consigneeName = obj.label
            this.consigneeObj.consigneeId = obj.value
          }
        },
        dataSource: []
      }
    ]

    /* 预约信息- 待审核、待收货、已拒收状态*/
    const otherDetailsInfoDataSource = [
      {
        prop: 'stockType',
        itemStyle: itemStyle,
        disabled: true,
        itemType: 'select',
        label: '入库类型',
        dataSource: BOOKING_STORAGE_TYPE_LIST
      },
      {
        prop: 'deliveryNo',
        itemStyle: itemStyle,
        disabled: true,
        title: true,
        itemType: 'input',
        label: '关联单号'
      },
      {
        prop: 'productType',
        disabled: true,
        itemStyle: itemStyle,
        itemType: 'select',
        label: '货物类型',
        dataSource: BOOKING_TYPE_OF_GOODS
      },
      {
        prop: 'sentInPlan',
        disabled: true,
        title: true,
        itemStyle: itemStyle,
        itemType: 'input',
        label: '预约送仓时间'
      },
      {
        prop: 'warehouseName',
        disabled: true,
        title: true,
        itemStyle: itemStyle,
        itemType: 'select',
        label: '预约入库仓库'
      },
      {
        prop: 'numberInPlan',
        disabled: true,
        title: true,
        itemStyle: itemStyle,
        itemType: 'input',
        label: '预约入库件数'
      },
      {
        prop: 'weightInPlan',
        disabled: true,
        title: true,
        itemStyle: itemStyle,
        itemType: 'input',
        label: '预约入库重量(KG)'
      }
    ]

    /* 送货信息 */
    const deliverInfoDataSource = [
      {
        prop: 'shipper',
        disabled: true,
        title: true,
        itemStyle: itemStyle,
        itemType: 'input',
        label: '货主'
      },
      {
        prop: 'fabricStore',
        disabled: true,
        title: true,
        itemStyle: itemStyle,
        itemType: 'input',
        label: '布行'
      },
      {
        prop: 'supplier',
        disabled: true,
        title: true,
        itemStyle: itemStyle,
        itemType: 'input',
        label: '供应商'
      },
      {
        prop: 'deliveryman',
        disabled: true,
        title: true,
        itemStyle: itemStyle,
        itemType: 'input',
        label: '司机姓名'
      },
      {
        prop: 'deliverymanPhone',
        disabled: true,
        title: true,
        itemStyle: itemStyle,
        itemType: 'input',
        label: '联系电话'
      },
      {
        prop: 'licenseNumber',
        title: true,
        disabled: true,
        itemStyle: itemStyle,
        itemType: 'input',
        label: '车牌号'
      }
    ]

    /* 货物明细列表- 已收货（布类)*/
    const haveClothColumns = [
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
        minWidth: 175,
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
        /*    , componentsOptions: {},
            components: {
              NumberInfo
            } */
      },
      {
        prop: 'sellerTeamName',
        label: '销售组织',
        showOverflowTooltip: true,
        align: 'left',
        minWidth: 150
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
        minWidth: 130
      },
      {
        prop: 'numberInPlan',
        label: '预计入库件(卷)数',
        align: 'right',
        minWidth: 150
      },
      {
        prop: 'numberInFact',
        label: '实际入库件(卷)数',
        align: 'right',
        minWidth: 150
      },
      {
        prop: 'weightInPlan',
        label: '预计入库重量(KG)',
        align: 'right',
        minWidth: 150
      },
      {
        prop: 'weightInFact',
        label: '实际入库重量(KG)',
        align: 'right',
        minWidth: 150
      },
      {
        prop: 'packingUnit',
        label: '包装单位',
        align: 'left',
        minWidth: 110
      }
    ]

    /* 货物明细列表- 已收货（纱类） */
    const haveGauzeColumns = [
      {
        prop: 'batchNo',
        label: '批次号',
        align: 'left',
        minWidth: 175
      },
      {
        prop: 'materiel',
        label: '产品编号',
        align: 'left',
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
        },
        minWidth: 175
      },
      {
        prop: 'sellerTeamName',
        label: '销售组织',
        align: 'left',
        showOverflowTooltip: true,
        minWidth: 130
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
        showOverflowTooltip: true,
        align: 'left',
        minWidth: 130
      },
      {
        prop: 'dyelot',
        label: '缸号',
        showOverflowTooltip: true,
        align: 'left',
        minWidth: 130
      },
      {
        prop: 'numberInPlan',
        label: '预计入库数',
        align: 'right',
        minWidth: 120
      },
      {
        prop: 'numberInFact',
        label: '实际入库数',
        align: 'right',
        minWidth: 120
      },
      {
        prop: 'weightInPlan',
        label: '预计入库重量(KG)',
        align: 'right',
        minWidth: 140
      },
      {
        prop: 'weightInFact',
        label: '实际入库重量(KG)',
        align: 'right',
        minWidth: 140
      },
      {
        prop: 'isFull',
        label: '整/散件',
        align: 'left',
        minWidth: 110,
        formater: (scope) => {
          if (scope.row.isFull === 1) {
            return '整件'
          } else if (scope.row.isFull === 0) {
            return '散件'
          } else {
            return '--'
          }
        }
      },
      {
        prop: 'packingUnit',
        label: '包装单位',
        align: 'left',
        minWidth: 110
      }
    ]

    /* 详情-货物明细列表- 已收货（纱类)操作 */
    const havePopOperates = {
      label: '操作',
      fixed: 'right',
      align: 'left',
      width: 110,
      dataSource: [
        {
          label: '抽磅记录',
          isShow: (scope) => {
            if (scope.row.isPound) {
              return true
            }
            return false
          },
          handle: (params) => {
            this.getReservationProductPoundList(params)
          }
        }
      ]
    }

    /* 详情-其它状态明细列表（布类 */
    const otherClothColumns = [
      {
        prop: 'materiel',
        label: '产品编号',
        align: 'left',
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
        },
        minWidth: 150
      },
      {
        prop: 'sellerTeamName',
        label: '销售组织',
        showOverflowTooltip: true,
        align: 'left',
        minWidth: 130
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
        showOverflowTooltip: true,
        align: 'left',
        minWidth: 130
      },
      {
        prop: 'numberInPlan',
        label: '预计入库数',
        align: 'right',
        minWidth: 130
      },
      {
        prop: 'weightInPlan',
        label: '预计入库重量(KG)',
        align: 'right',
        minWidth: 150
      },
      {
        prop: 'packingUnit',
        label: '包装单位',
        align: 'left',
        minWidth: 120
      }
    ]

    /* 详情-其它状态明细列表（纱类） */
    const otherGauzeColumns = [
      {
        prop: 'materiel',
        label: '产品编号',
        align: 'left',
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
        },
        minWidth: 150
      },
      {
        prop: 'sellerTeamName',
        label: '销售组织',
        showOverflowTooltip: true,
        align: 'left',
        minWidth: 130
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
        showOverflowTooltip: true,
        align: 'left',
        minWidth: 130
      },
      {
        prop: 'dyelot',
        label: '缸号',
        align: 'left',
        minWidth: 130
      },
      {
        prop: 'numberInPlan',
        label: '预计入库件数',
        align: 'right',
        minWidth: 120
      },
      {
        prop: 'weightInPlan',
        label: '预计入库重量(KG)',
        align: 'right',
        minWidth: 150
      },
      {
        prop: 'packingUnit',
        label: '包装单位',
        align: 'left',
        minWidth: 110
      }
    ]

    /* 详情-开始收货明细列表（布类) */
    const startClothColumns = [
      {
        prop: 'materiel',
        label: '产品编号',
        align: 'left',
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
        },
        minWidth: 180
      },
      {
        prop: 'sellerTeamName',
        label: '销售组织',
        showOverflowTooltip: true,
        align: 'left',
        minWidth: 140
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
        showOverflowTooltip: true,
        align: 'left',
        minWidth: 130
      },
      {
        prop: 'numberInPlan',
        label: '预计入库数',
        align: 'right',
        minWidth: 110
      },
      {
        prop: 'numberInFact',
        label: '实际入库数',
        align: 'right',
        minWidth: 110
      },
      {
        prop: 'weightInPlan',
        label: '预计入库重量(KG)',
        align: 'right',
        minWidth: 150
      },
      {
        prop: 'weightInFact',
        label: '实际入库重量(KG)',
        align: 'right',
        minWidth: 150
      },
      {
        prop: 'packingUnit',
        label: '包装单位',
        align: 'left',
        minWidth: 100
      }
    ]

    /* 详情-开始收货明细列表（布类/纱类)操作 */
    const startPopOperates = {
      label: '操作',
      fixed: 'right',
      align: 'left',
      width: 220,
      dataSource: [
        {
          label: '修改',
          isShow: true,
          /*  permitTag: [''], */
          handle: (params) => {
            this.showUpdateReservationProduct(params)
          }
        },
        {
          label: '抽磅',
          isShow: true,
          /*  permitTag: [''], */
          handle: (params) => {
            this.smokePoundsCargoDetails(params)
          }
        },
        {
          label: '抽磅记录',
          isShow: (scope) => {
            if (scope.row.isPound) {
              return true
            }
            return false
          },
          /*      permitTag: [''], */
          handle: (params) => {
            if (params) {
              this.getReservationProductPoundList(params)
            }
          }
        },
        {
          label: '拆分',
          isShow: (scope) => {
            if (scope.row.productType === 2 && scope.row.numberInFact > 1) {
              return true
            }
            return false
          },
          /*  permitTag: [''], */
          handle: (params) => {
            this.showSplitPopUpBox(params)
          }
        }
      ]
    }

    /* 详情-开始收货明细列表（纱类） */
    const startGauzeColumns = [
      {
        prop: 'materiel',
        label: '产品编号',
        align: 'left',
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
        },
        minWidth: 180
      },
      {
        prop: 'sellerTeamName',
        label: '销售组织',
        showOverflowTooltip: true,
        align: 'left',
        minWidth: 120
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
        showOverflowTooltip: true,
        align: 'left',
        minWidth: 110
      },
      {
        prop: 'dyelot',
        label: '缸号',
        align: 'left',
        showOverflowTooltip: true,
        minWidth: 130
      },
      {
        prop: 'numberInPlan',
        label: '预计入库数',
        align: 'right',
        minWidth: 110
      },
      {
        prop: 'numberInFact',
        label: '实际入库数',
        align: 'right',
        minWidth: 110
      },
      {
        prop: 'weightInPlan',
        label: '预计入库重量(KG)',
        align: 'right',
        minWidth: 140
      },
      {
        prop: 'weightInFact',
        label: '实际入库重量(KG)',
        align: 'right',
        minWidth: 140
      },
      {
        prop: 'packingUnit',
        label: '包装单位',
        align: 'left',
        minWidth: 100
      },
      {
        prop: 'isFull',
        label: '整/散件',
        align: 'left',
        minWidth: 100,
        formater: (scope) => {
          const isFull = scope.row.isFull.toString()
          if (isFull === '0') {
            return '散件'
          } else if (isFull === '1') {
            return '整件'
          } else {
            return '--'
          }
        }
      },
      {
        prop: 'ballCount',
        label: '球数',
        align: 'right',
        minWidth: 100
      }
    ]

    /* 详情-明细列表操作 */
    const cargoDetailPopOperates = {
      label: '操作',
      fixed: 'right',
      align: 'left',
      width: 180,
      dataSource: [
        {
          label: '抽磅记录',
          isShow: true,
          /*  permitTag: [''], */
          handle: (params) => {
            this.getReservationProductPoundList(params)
          }
        }
      ]
    }

    /* 详情-明细列表 分页 */
    const cargoDetailPagination = {
      currentChange: (val) => {
        this.getReservationProductList({
          reservationNo: this.reservationNo,
          pageSize: this.cargoDetailPagination.pageSize,
          pageNum: val
        })
      },
      sizeChange: (val) => {
        this.getReservationProductList({
          reservationNo: this.reservationNo,
          pageNum: this.cargoDetailPagination.currentPage,
          pageSize: val
        })
      }
    }

    /* 新增搜索表单 */
    const productInfoData = [
      {
        prop: '',
        itemStyle: {
          width: '300px'
        },
        itemType: 'input',
        label: '产品编号'
      },
      {
        itemType: 'operate',
        submitHandle: (params) => {},
        submitText: '查询',
        resetHidden: true
      }
    ]

    /* 备注说明 */
    const remarkDataSource = [
      {
        prop: 'remark',
        type: 'textarea',
        disabled: true,
        rows: 9,
        height: '180px',
        itemStyle: {
          width: '600px',
          marginRight: '10%',
          fontSize: '18px',
          color: '#151222',
          float: 'left'
        },
        itemType: 'input',
        label: '备注说明'
      },
      {
        prop: 'filelist',
        components: {
          CustomUpload
        },
        componentsOptions: {
          type: 'details',
          action: '/wms/upload/type/1',
          style: {
            width: '400px',
            float: 'left'
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
            // const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
            // const isJPG = types.includes(file.type)
            // const isLt10M = file.size / 1024 / 1024 < 10
            if (!token) {
              this.$message({
                message: '未登录或已超时！',
                type: 'error'
              })
              return false
            }
            /* if (!isJPG) {
                this.$message({
                  message: '上传文件类型只能是JPG/GIF/PNG 格式!',
                  type: 'error'
                })
                return false
              }
              if (!isLt10M) {
                this.$message({
                  message: '上传文件大小不能超过 10MB!',
                  type: 'error'
                })
                return false
              } */
            return true
          },
          filelist: this.fileList
        }
      }
    ]

    /* 拒收状态*/
    const rejectReasonDataSource = [
      {
        prop: 'remark',
        type: 'textarea',
        disabled: true,
        rows: 9,
        height: '180px',
        itemStyle: {
          width: '600px',
          marginRight: '10%',
          float: 'left'
        },
        itemType: 'input',
        label: '备注说明'
      },
      {
        prop: 'filelist',
        components: {
          CustomUpload
        },
        componentsOptions: {
          type: 'details',
          action: '/wms/upload/type/1',
          style: {
            width: '400px',
            float: 'left'
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
            const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
            const isJPG = types.includes(file.type)
            const isLt10M = file.size / 1024 / 1024 < 10
            if (!token) {
              this.$message({
                message: '未登录或已超时！',
                type: 'error'
              })
              return false
            }
            if (!isJPG) {
              this.$message({
                message: '上传文件类型只能是JPG/GIF/PNG 格式!',
                type: 'error'
              })
              return false
            }
            if (!isLt10M) {
              this.$message({
                message: '上传文件大小不能超过 10MB!',
                type: 'error'
              })
              return false
            }
            return true
          },
          filelist: this.fileList
        }
      },
      {
        prop: 'rejectReason',
        disabled: true,
        type: 'textarea',
        rows: 6,
        itemStyle: {
          width: '100%',
          float: 'left'
        },
        itemType: 'input',
        label: '拒收原因'
      }
    ]

    /* 抽榜记录布列表 */
    const clothPoundListColumns = [
      {
        prop: 'materiel',
        label: '产品编号',
        align: 'left',
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
        },
        minWidth: 120
      },
      {
        prop: 'sellerTeamName',
        label: '销售组织',
        align: 'left',
        minWidth: 140
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
        minWidth: 140
      },
      {
        prop: 'weightInPlan',
        label: '预计重量(KG)',
        align: 'right',
        minWidth: 110
      },
      {
        prop: 'weights',
        label: '过磅重量(KG)',
        align: 'right',
        minWidth: 110
      }
    ]

    /* 抽榜记录纱列表 */
    const gauzePoundListColumns = [
      {
        prop: 'materiel',
        label: '产品编号',
        align: 'left',
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
        },
        minWidth: 120
      },
      {
        prop: 'sellerTeamName',
        label: '销售组织',
        align: 'left',
        minWidth: 140
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
        label: '纱牌纱批',
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
        prop: 'weightInPlan',
        label: '预计重量(KG)',
        align: 'right',
        minWidth: 110
      },
      {
        prop: 'weights',
        label: '过磅重量(KG)',
        align: 'right',
        minWidth: 110
      }
    ]

    /* 抽榜弹出框搜索 */
    const dialogDrawListSearchData = [
      {
        prop: 'poundNumber',
        itemStyle: {
          width: '280px'
        },
        itemType: 'input',
        label: '抽磅件数',
        rules: [commonBlurReg, numberBlurReg]
      },
      {
        itemType: 'operate',
        resetHidden: true,
        submitHandle: (params) => {
          if (Number(params.poundNumber) > this.dialogDrawEntity.numberInFact) {
            this.$message({
              message: '抽磅件数不能大于实际入库数量！',
              type: 'error'
            })
            return false
          }
          const newArr = []
          this.poundEntity.poundNumber = Number(params.poundNumber)
          if (
            this.poundEntity.poundNumber &&
            this.poundEntity.poundNumber > 0
          ) {
            for (let i = 0; i < this.poundEntity.poundNumber; i++) {
              newArr.push(this.dialogDrawSmokePoundsRows)
            }
            this.$set(this.dialogDrawListDataSource[0], 'dataSource', newArr)
            this.poundEntity.actualWeight = 0
          }
        },
        submitText: '确定'
      }
    ]

    /* 抽榜验证 */
    const checkWeights = (rule, value, callback) => {
      setTimeout(() => {
        const reg = /^-?\d+\.?\d{0,2}$/
        // /^[1-9][0-9]*([\.][0-9]{1,2})?$/
        if (!value) {
          return callback(new Error('此项不能为空！'))
        } else if (value <= 0) {
          return callback(new Error('不能小于等于0！'))
        } else if (!reg.test(value)) {
          return callback(new Error('输入整数或两位小数的数！'))
        } else {
          return callback()
        }
        /*       else if (!Number.isInteger(Number(value))) {
               return callback(new Error('请输入正整数！'))
             }  */
      }, 0)
    }

    /* 过磅重量改变 */
    const changeActualWeight = (value) => {
      const tableForm = this.$refs.dialogDrawListTable
        .dynamicValidateFormRuleForm.tableForm
      const toDecimal = (value) => {
        var fvalue = parseFloat(value)
        if (isNaN(fvalue)) {
          return
        }
        fvalue = Math.round(value * 100) / 100
        return fvalue
      }
      if (tableForm && tableForm.length > 0) {
        this.poundEntity.actualWeight = toDecimal(
          tableForm
            .map((item) => item.weights)
            .reduce((prve = 0, next = 0) => Number(prve) + Number(next)) /
            tableForm.length
        )
      }
    }

    /* 抽榜弹出框布列表 */
    const drawListClothColumns = [
      {
        prop: 'materiel',
        label: '产品编号',
        align: 'left',
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
        },
        minWidth: 120
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
        prop: 'weightInPlan',
        label: '预计重量(KG)',
        align: 'right',
        minWidth: 110,
        formater: (scope) => {
          if (scope.row.weightInPlan && scope.row.numberInPlan) {
            return Number(
              scope.row.weightInPlan / scope.row.numberInPlan
            ).toFixed(2)
          }
        }
      },
      {
        prop: 'weights',
        label: '过磅重量(KG)',
        align: 'right',
        className: 'weights-td',
        minWidth: 110,
        editOptions: {
          labelWidth: '0',
          change: changeActualWeight,
          className: 'weights-input',
          itemType: 'input',
          rules: [
            {
              validator: checkWeights,
              trigger: ['change']
            }
          ]
        }
      }
    ]

    /* 抽榜弹出框纱列表 */
    const drawListGauzeColumns = [
      {
        prop: 'materiel',
        label: '产品编号',
        align: 'left',
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
        },
        minWidth: 120
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
        label: '纱牌纱批',
        align: 'left',
        minWidth: 130
      },
      {
        prop: 'dyelot',
        label: '缸号',
        align: 'left',
        minWidth: 110
      },
      {
        prop: 'weightInPlan',
        label: '预计重量(KG)',
        align: 'right',
        minWidth: 110,
        formater: (scope) => {
          if (scope.row.weightInPlan && scope.row.numberInPlan) {
            return Number(
              scope.row.weightInPlan / scope.row.numberInPlan
            ).toFixed(2)
          }
        }
      },
      {
        prop: 'weights',
        label: '过磅重量(KG)',
        align: 'right',
        className: 'weights-td',
        minWidth: 110,
        editOptions: {
          labelWidth: '0',
          change: changeActualWeight,
          className: 'weights-input',
          itemType: 'input',
          rules: [
            {
              validator: checkWeights,
              trigger: ['change']
            }
          ]
        }
      }
    ]

    const dialogDrawListDataSource = [
      {
        prop: 'tableForm',
        itemType: 'table-form',
        dataSource: [],
        columns: []
      }
    ]

    const splitPopStyles = {
      width: '350px',
      marginRight: '10px'
    }

    /* 拆分弹框 */
    const dialogSpllitPopUpVisable = {
      itemType: 'drawer',
      visible: false,
      title: '拆分',
      size: '400px',
      formDatas: {},
      formOptions: {
        inline: true,
        size: 'small'
      },
      ok: (params) => {
        console.log(params)
        this.getSpllitCargoDetailInfo({
          parentProductId: params.id,
          weightInFact: params.weightInFact,
          ballCount: params.ballCount
        })
      },
      cancel: (params) => {
        this.$set(this.dialogSpllitPopUpVisable, 'visible', false)
      },
      content: [
        {
          prop: 'materiel',
          type: 'input',
          disabled: true,
          itemStyle: splitPopStyles,
          itemType: 'input',
          label: '产品编码'
          /*   rules: commonBlurReg */
        },
        {
          prop: 'sellerTeamName',
          type: 'input',
          disabled: true,
          itemStyle: splitPopStyles,
          itemType: 'input',
          label: '销售组织'
        },
        {
          prop: 'property',
          itemStyle: splitPopStyles,
          type: 'input',
          disabled: true,
          itemType: 'input',
          label: '产品属性'
          /*  rules: commonBlurReg */
        },
        {
          prop: 'yarnCard',
          type: 'input',
          disabled: true,
          itemStyle: splitPopStyles,
          itemType: 'input',
          label: '纱牌纱批'
          /* rules: commonBlurReg */
        },
        {
          prop: 'color',
          type: 'input',
          disabled: true,
          itemStyle: splitPopStyles,
          itemType: 'input',
          label: '染纱颜色'
          /* rules: commonBlurReg */
        },
        {
          prop: 'dyelot',
          type: 'input',
          disabled: true,
          itemStyle: splitPopStyles,
          itemType: 'input',
          label: '缸号'
          /* rules: commonBlurReg */
        },
        {
          prop: 'packingUnit',
          type: 'input',
          disabled: true,
          itemStyle: splitPopStyles,
          itemType: 'input',
          label: '包装单位'
          /*  rules: commonBlurReg */
        },
        {
          prop: 'isFull',
          type: 'input',
          disabled: true,
          itemStyle: splitPopStyles,
          itemType: 'select',
          label: '整/散件',
          dataSource: BOOKING_BULK_FULL_LIST
          /* rules: commonBlurReg */
        },
        {
          prop: 'numberInPlan',
          type: 'input',
          disabled: true,
          itemStyle: splitPopStyles,
          itemType: 'input',
          label: '预计入库数'
          /* rules: commonBlurReg */
        },
        {
          prop: 'numberInFact',
          type: 'input',
          disabled: true,
          itemStyle: splitPopStyles,
          itemType: 'input',
          label: '实际入库数'
          /*  rules: commonBlurReg */
        },
        {
          prop: 'weightInPlan',
          type: 'input',
          disabled: true,
          itemStyle: splitPopStyles,
          itemType: 'input',
          label: '预计入库重量'
          /*  rules: commonBlurReg */
        },
        {
          prop: 'weightInFact',
          type: 'input',
          disabled: false,
          itemStyle: splitPopStyles,
          itemType: 'input',
          label: '实际入库重量',
          rules: [
            commonBlurReg,
            {
              validator: checkWeights,
              trigger: ['change']
            }
          ],
          change: (value) => {
            const reg = /^-?\d+\.?\d{0,2}$/
            if (reg.test(value) && value && value > 0) {
              this.$set(this.dialogSpllitPopUpVisable, 'formDatas', {
                weightInPlan: value
              })
            } else {
              this.$set(this.dialogSpllitPopUpVisable, 'formDatas', {
                weightInPlan: ''
              })
            }
          }
        },
        {
          prop: 'ballCount',
          type: 'input',
          disabled: false,
          itemStyle: splitPopStyles,
          itemType: 'input',
          label: '球数',
          rules: [commonBlurReg, numberBlurReg]
        }
      ]
    }

    const updateDrawerStyles = {
      width: '350px',
      marginRight: '10px'
    }

    /* 货物明细-修改 */
    const dialogUpdateReservationProductVisible = {
      itemType: 'drawer',
      visible: false,
      title: '修改',
      size: '400px',
      okText: '确定',
      formDatas: {},
      formOptions: {
        inline: false,
        size: 'small'
      },
      ok: (params) => {
        this.updatePoundsDetailsInfo(params)
      },
      cancel: (params) => {
        this.$set(this.dialogUpdateReservationProductVisible, 'visible', false)
      },
      content: [
        {
          prop: 'materiel',
          type: 'input',
          disabled: true,
          itemStyle: updateDrawerStyles,
          itemType: 'input',
          label: '产品编码'
        },
        {
          prop: 'sellerTeamName',
          type: 'input',
          disabled: true,
          itemStyle: updateDrawerStyles,
          itemType: 'input',
          label: '销售组织'
        },
        {
          prop: 'classification',
          itemStyle: updateDrawerStyles,
          type: 'input',
          disabled: true,
          itemType: 'input',
          label: '纱分类'
        },
        {
          prop: 'property',
          itemStyle: updateDrawerStyles,
          type: 'input',
          disabled: true,
          itemType: 'input',
          label: '产品属性'
        },
        {
          prop: 'yarnCard',
          itemStyle: updateDrawerStyles,
          type: 'input',
          disabled: true,
          itemType: 'input',
          label: '纱牌/纱批'
        },
        {
          prop: 'color',
          itemStyle: updateDrawerStyles,
          type: 'input',
          disabled: true,
          itemType: 'input',
          label: '染纱颜色'
        },
        {
          prop: 'dyelot',
          itemStyle: updateDrawerStyles,
          type: 'input',
          disabled: true,
          itemType: 'input',
          label: '缸号'
        },
        {
          prop: 'numberInPlan',
          itemStyle: updateDrawerStyles,
          type: 'input',
          disabled: true,
          itemType: 'input',
          label: '预计入库数'
        },
        {
          prop: 'weightInPlan',
          itemStyle: updateDrawerStyles,
          type: 'input',
          disabled: true,
          itemType: 'input',
          label: '预计入库重量(KG)'
        },
        {
          prop: 'packingUnit',
          itemStyle: updateDrawerStyles,
          type: 'input',
          disabled: true,
          itemType: 'input',
          label: '包装单位'
        },
        {
          prop: 'isFull',
          itemStyle: updateDrawerStyles,
          type: 'input',
          disabled: true,
          itemType: 'select',
          label: '整/散件',
          dataSource: BOOKING_BULK_FULL_LIST
        },
        {
          prop: 'ballCount',
          itemStyle: updateDrawerStyles,
          type: 'input',
          disabled: true,
          itemType: 'input',
          label: '球数'
        },
        {
          prop: 'numberInFact',
          itemStyle: updateDrawerStyles,
          type: 'input',
          itemType: 'input',
          label: '实际入库数',
          rules: [commonBlurReg, numberBlurReg]
        },
        {
          prop: 'weightInFact',
          itemStyle: updateDrawerStyles,
          type: 'input',
          itemType: 'input',
          label: '实际入库重量(KG)',
          rules: [
            commonBlurReg,
            {
              validator: checkWeights,
              trigger: ['change']
            }
          ]
        }
      ]
    }

    return {
      /* 详情-预约信息 */
      detailsInfoFormData: {},
      /* 预约信息-开始收货 or 已收货 */
      startReceivingDataSource,
      /* 详情其它状态 */
      otherDetailsInfoDataSource,
      formOtions: {
        inline: true,
        size: 'small'
      },
      /* 送货信息 */
      deliverInfoFormDatas: {},
      deliverInfoDataSource,
      paginationInfoData: {},
      /* 已收货状态-布类、纱类 */
      haveClothColumns,
      havePopOperates,
      haveGauzeColumns,
      /* 其它状态表头-布类、纱类 */
      otherClothColumns,
      otherGauzeColumns,
      /* 开始收货- 布类、纱类*/
      startClothColumns,
      startPopOperates,
      startGauzeColumns,
      cargoDetailDataSource: [],
      cargoDetailPagination,

      /* 备注说明*/
      remarkFormDatas: {},
      rejectReasonDataSource,
      remarkDataSource,
      remarkFormOtions: {
        inline: false,
        size: 'small',
        labelPosition: 'top'
      },
      dialogDrawListDataSource,
      drawListClothColumns,
      drawListGauzeColumns,
      dialogDrawListFormDatas: {},
      dialogDrawListPopUpBoxList: false,
      dialogDrawSmokePoundsRows: {},
      dialogDrawEntity: {
        numberInFact: 1,
        weightInFact: 0
      },
      /* ------------------------------ */
      cargoDetailPopOperates,
      insertActive: 'clothProduct',
      pageType: 'details',
      status: 0,
      /* 抽榜弹出框列表 */
      dialogPoundListVisible: false,
      dialogDrawListSearchData,
      /* 新增弹框搜索表单 */
      productInfoFormDatas: {},
      productInfoData,
      /* 新增弹框布列表 */
      clothPoundListColumns,
      poundListDataSource: [],
      /* 新增弹框纱列表 */
      gauzePoundListColumns,
      filelist: [],
      loadingFinishid: false,
      reservationNo: '',
      poundEntity: {
        /* 抽榜件数 */
        poundNumber: 0,
        /* 实际重量 */
        actualWeight: 0,
        /* 抽榜时间 */
        boundDate: new Date()
      },
      /* 抽榜ID */
      productId: 0,
      /* 拆分弹框 */
      dialogSpllitPopUpVisable,
      /* 详情-修改 */
      dialogUpdateReservationProductVisible,
      /* 完成收货参数 */
      fileList: [],
      consigneeObj: {
        consigneeId: '',
        consigneeName: ''
      },
      productDetailTotal: 0
    }
  },
  computed: {
    getFileList() {
      return this.filelist
    },
    statusShow() {
      const status = this.status + ''
      var result
      if (status === '0') {
        result = '<span style="color:#FF9B02">待审核</span>'
      } else if (status === '1') {
        result = '<span style="color:#FF9B02">待收货</span>'
      } else if (status === '2') {
        result = '<span style="color:#00BCC5">已收货</span>'
      } else if (status === '3') {
        result = '<span style="color:#888E9E">已拒收</span>'
      } else if (status === '4') {
        result = '<span style="color:#00BCC5">已签收</span>'
      }

      return result
    }
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
.is-none {
  text-align: center;
  padding: 5px;
  font-size: 14px;
  line-height: 60px;
  height: 60px;
  width: 50%;
  color: #909399;
}
.dialog-draw-list-footer {
  padding: 30px 20px 0;
  border-top: 1px solid #e9eff2;
  .total-box {
    float: left;
    .label {
      font-size: 16px;
      font-weight: 600;
      padding: 0 5px;
    }
    .text {
      padding: 0 5px;
      color: red;
    }
  }
  .btns-box {
    float: right;
    .time {
      padding-right: 40px;
    }
  }
}
.bookDetails {
  margin-bottom: 80px;
  .top {
    display: flex;
    justify-content: space-between;
    .leftBox {
      font-size: 18px;
      color: #151222;
    }
    margin-bottom: 20px;
  }
}
/deep/.btn-rows{
  left: 200px;
  margin-right: 0px;
}
</style>
<style lang="scss">
.bookDetails {
  .form-box.spe {
    padding-top: 0;
    .el-table th {
      background-color: #f5f7fa;
    }
  }
  .el-dialog__body {
    padding: 10px 0;
  }
}
.dialog-draw-table-form {
  .weights-input > input[type="text"] {
    text-align: right;
    height: 28px;
    /*     width: 120px; */
  }
  .el-form-item {
    margin-bottom: 0 !important;
  }
  .cell {
    margin: 2px 0;
  }
  .weights-td {
    position: relative;
    .el-form-item__content {
      position: static !important;
    }
    .el-form-item__error {
      text-align: right;
      height: 22px;
      width: 100%;
      line-height: 22px;
      position: absolute;
      top: auto !important;
      bottom: 4px;
      left: 0;
    }
    .el-form-item,
    .cell {
      overflow: visible;
    }
  }
}
</style>
