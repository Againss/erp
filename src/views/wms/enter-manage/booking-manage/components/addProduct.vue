<template>
  <div class="addProduct">
    <el-dialog
      title="产品信息"
      :visible.sync="dialogProductInfoVisible"
      width="1000px"
    >
      <!-- 搜索表单 -->
      <cs-custom-form
        ref="searchProductInfo"
        :form-datas="productInfoFormDatas"
        :data-source="productInfoData"
        :options="formOtions"
      />
      <!-- 弹框新增列表 -->
      <el-tabs v-model="insertActive" @tab-click="tabClick">
        <el-tab-pane name="clothProduct">
          <span slot="label" class="label" tabindex="0">布</span>
          <cs-custom-table
            tooltip-effect="dark"
            :autoresize="false"
            :columns="clothProductInfoColumns"
            :data-source="clothProductInfoDataSource"
            :pagination="clothProductInfoPagination"
            highlight-current-indexrow
            :form-otions="formOtions"
          />
        </el-tab-pane>
        <el-tab-pane name="gauzeProduct">
          <span slot="label" class="label" tabindex="0">纱</span>
          <cs-custom-table
            tooltip-effect="dark"
            :autoresize="false"
            :columns="gauzeProductInfoColumns"
            :data-source="gauzeProductInfoDataSource"
            :pagination="gauzeProductInfoPagination"
            highlight-current-indexrow
            :form-otions="formOtions"
          />
        </el-tab-pane>
      </el-tabs>
      <div class="dialog-footer-btns">
        <el-button
          type="primary"
          size="small"
          @click="dialogProductInfoVisible = false"
        >关闭</el-button>
        <el-button size="small" @click="saveProductInfo()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { PublicWms } from '@/views/wms/public/index'
import { StartPutStorage } from './startPutStorage.js'
export default {
  name: 'AddProduct',
  mixins: [PublicWms, StartPutStorage],
  data() {
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

    /* 新增布列表 */
    const clothProductInfoColumns = [
      {
        prop: '',
        label: '产品编号',
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
      }
    ]
    /* 新增布列表分页 */
    const clothProductInfoPagination = {
      currentChange: (val) => {},
      sizeChange: (val) => {}
    }

    /* 新增纱列表 */
    const gauzeProductInfoColumns = [
      {
        prop: '',
        label: '产品编号',
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
      }
    ]
    /* 新增纱列表分页 */
    const gauzeProductInfoPagination = {
      currentChange: (val) => {},
      sizeChange: (val) => {}
    }
    return {
      /* 新增弹框搜索表单 */
      productInfoFormDatas: {},
      productInfoData,
      /* 新增弹框布列表 */
      clothProductInfoColumns,
      clothProductInfoPagination,
      clothProductInfoDataSource: [],
      /* 新增弹框纱列表 */
      gauzeProductInfoColumns,
      gauzeProductInfoDataSource: [],
      gauzeProductInfoPagination,
      dialogProductInfoVisible: false,
      formOtions: {}
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
.addProduct {
  .dialog-footer-btns {
    text-align: center;
    padding-top: 30px;
  }
}
</style>
