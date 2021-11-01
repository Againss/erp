<template>
  <div id="orderDetails" class="list orderDetails">

    <div class="orderTitle">
      <p>订单号：{{ detailFormDatas.knitOrderNo }}</p>
      <p v-html="getStatus(detailFormDatas.status)" />
    </div>
    <div class="bk">
      <div class="" style="position: relative">
        <div class="title">
          基本信息
          <el-select
            v-model="detailFormDatas.version"
            placeholder="请选择"
            @change="changeVersion"
          >
            <el-option
              v-for="item in versionOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
      </div>
      <div>
        <cs-custom-form
          ref="searchForm"
          :data-source="detailData"
          :options="formOptions"
          :form-datas="detailFormDatas"
        />
      </div>
    </div>
    <div v-if="detailFormDatas.status === 'W'" class="bottom-content">
      <el-button type="primary" @click="submitForm"> 提交</el-button>
    </div>
    <!-- 工艺 -->
    <cs-custom-pop
      v-if="technologyOptions.visible"
      ref="pop"
      :options="technologyOptions"
    />
  </div>
</template>

<script>
// import { deepClone } from '@/utils'
// import PlanFactory from './components/plan-factory.vue'
// import technology from './components/technology.vue'
// import { getStatus } from '@/views/processing-manage/public/index.js'
import { info, submit } from '@/views/processing-manage/weaving/order/api/index.js'
import { setOrderFun } from '@/views/processing-manage/printing/public/mou.js'
import detailBranch from './components/detailBranch.vue'
import technology from '@/views/processing-manage/weaving/demand/components/technology.vue'

export default {
  mixins: [setOrderFun],

  data() {
    const detailStyle = {
      width: '24%',
      height: '32px',
      'line-height': '32px',
      'margin-bottom': '0'
    }
    const detailData = {
      _supplerName: {
        prop: 'supplerName',
        itemType: 'itemview',
        label: '织厂:',
        itemStyle: detailStyle,
        renderContent: (val) => {
          return val
        }
      },
      _pmUserName: {
        prop: 'pmUserName',
        itemType: 'itemview',
        label: '跟单人员:',
        itemStyle: detailStyle
      },
      _planPersionName: {
        prop: 'planPersionName',
        itemType: 'itemview',
        label: '排厂人员:',
        itemStyle: detailStyle
      },
      _customerName: {
        prop: 'customerName',
        itemType: 'itemview',
        label: '客户:',
        itemStyle: detailStyle
      },
      _salesTeamName: {
        prop: 'salesTeamName',
        itemType: 'itemview',
        label: '销售组织:',
        itemStyle: detailStyle
      },
      _qty: {
        prop: 'qty',
        itemType: 'itemview',
        label: '坯布总数:',
        itemStyle: detailStyle,
        renderContent: (val) => {
          return val ? `${val}KG` : ''
        }
      },
      _productDetails: {
        prop: 'productDetails',
        components: { detailBranch },
        componentsOptions: {
          productDetails: []
        }
      }
    }
    const technologyOptions = {
      itemType: 'dialog',
      visible: false,
      title: '工艺',
      width: '1300px',
      okHidden: true,
      cancelHidden: true,
      close: () => {
        this.$set(this.technologyOptions, 'visible', false)
      },
      components: { technology },
      componentsOptions: {
        id: ''
      }
    }
    return {
      detailFormDatas: {},
      versionOptions: [],
      detailData,
      dataSource: [],
      formOptions: {
        size: 'small',
        labelWidth: '100px',
        inline: true
      },
      searchParams: {},
      technologyOptions
    }
  },
  created() {
    this.getInfo({ uuid: this.$route.params.uuid })
  },
  mounted() {},
  methods: {
    changeVersion(val) {
      this.getInfo({ uuid: this.$route.params.uuid, version: val })
    },
    async getInfo(params) {
      const res = await info(params)
      if (res.code === 200) {
        this.status = res.data.status
        this.detailFormDatas = res.data || {}
        const options = this.detailData._productDetails.componentsOptions
        options.productDetails = res.data.productDetails || []
        this.versionOptions =
          (res.data.versions &&
            res.data.versions.length &&
            res.data.versions.map((i) => ({
              label: `V${i}`,
              value: i
            }))) ||
          []
        this.uuid = params.uuid
        this.showMore = true
      } else {
        this.$message({
          message: res.message,
          type: 'error'
        })
      }
    },
    async submitForm(row) {
      const res = await submit({ uuid: [this.$route.params.uuid] })
      this.$message({
        message: res.code === 200 ? '提交成功' : res.message,
        type: res.code === 200 ? 'success' : 'error'
      })
      if (res.code === 200) {
        this.$router.push({ name: 'WeavingDemand' })
      }
    }
  }
}
</script>

<style  lang="scss">
@import "@/styles/base.scss";

.el-message-box .el-message-box__btns {
  .orderDetails {
    width: auto
  }
}
.detail-branch-detail-form {
    padding-top: 12px;
    padding-bottom: 16px;
    background: #fff;
    .el-form-item__content {
      line-height: 28px;
    }
    .el-form-item__label {
      height: 28px;
      line-height: 28px;
    }
    > div {
      padding-left: 30px;
    }
  }
</style>
<style lang="scss" scoped>
#orderDetails {
  .button.spe {
    position: absolute;
    right: 20px;
    top: 14px;
    z-index: 3;
  }
  .bottom-content {
    position: fixed;
    bottom: 0;
    width: 100%;
    z-index: 1000;
    margin-left: -20px;
    height: 64px;
    line-height: 64px;
    background: #fff;
    text-align: center;
    padding-right: 209px;
    // display: flex;
    // justify-content: center;
    // align-items: center;
  }
}
.orderTitle {
 display: flex;
 justify-content: space-between;
 font-size: 16px;
}
.title {
        background: #fff;
        font-size: 18px;
        color: #15112b;
        height: 65px;
        line-height: 65px;
        padding-left: 20px;
        border-bottom: 1px solid #e9eff2;
        .el-select {
          margin-left: 10px;
          width: 100px;
        }
      }
</style>
