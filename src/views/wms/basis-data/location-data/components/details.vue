<!--
 * @Author: Do not edit
 * @Date: 2020-12-03 09:13:35
 * @LastEditTime: 2019-10-15 15:00:45
 * @LastEditors: Aurnm
 **  库位资料详情页面
 -->
<template>
  <div class="details-page">
    <div class="location-details">
      <div class="details-title">库位详情</div>
      <header class="details-header">
        <el-button
          size="small"
          type="primary"
          class="new-check"
          @click="comeBack"
        >
          返回
        </el-button>
      </header>
      <!-- 基本信息 -->
      <div class="codeStyle">{{ formDatas.path }}</div>
      <div class="new-add">
        <cs-custom-form
          ref="locationCheck"
          class="p-10"
          :data-source="newlocationData"
          :options="formOtions"
          :form-datas="formDatas"
        />
      </div>
      <!-- 库位信息 -->
      <div class="new-add">
        <cs-custom-form
          ref="locationDetails"
          class="p-10"
          :data-source="locationDetailsData"
          :options="formOtions"
          :form-datas="formDatas"
        />
      </div>
      <!-- 限制信息 -->
      <div class="new-add">
        <cs-custom-form
          ref="limitDetails"
          class="p-10"
          :data-source="limitDetailsData"
          :options="formOtions"
          :form-datas="formDatas"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { locationDetail } from '../api/index.js'
export default {
  components: {},
  data() {
    // 盘点信息样式
    const checkstyle = {
      'width': '100%',
      'font-size': '16px',
      'color': '#3c4043',
      'border-bottom': '1px solid #efefef',
      'padding': '19px 0',
      'margin-top': '20px',
      'margin-bottom': '10px'
    }
    const newlocationData = [
      {
        prop: 'warehouseName',
        itemType: 'input',
        itemStyle: { 'width': '25%', 'margin': '0px 2%' },
        label: '仓库：',
        readonly: true
      },
      {
        prop: 'warehouseCode',
        itemType: 'input',
        itemStyle: { 'width': '25%', 'margin': '0px 2%' },
        label: '仓库代码：',
        readonly: true
      },
      {
        prop: 'enable',
        itemType: 'input',
        itemStyle: { 'width': '25%', 'margin': '0px 2%' },
        label: '状态：',
        readonly: true,
        formater: scope => {
          return scope.row.enable === 1 ? '启用' : scope.row.enable === 0 ? '禁用' : ''
        }
      },
      {
        prop: 'areaCode',
        itemType: 'input',
        itemStyle: { 'width': '25%', 'margin': '0px 2%' },
        label: '区号：',
        readonly: true
      },
      {
        prop: 'shelfCode',
        itemType: 'input',
        itemStyle: { 'width': '25%', 'margin': '0px 2%' },
        label: '货架号：',
        readonly: true
      },
      {
        prop: 'locationCode',
        itemType: 'input',
        itemStyle: { 'width': '25%', 'margin': '0px 2%' },
        label: '货位号：',
        readonly: true
      }
    ]
    // 库位信息页面
    const locationDetailsData = [
      {
        itemType: 'view',
        text: '库位信息',
        style: checkstyle
      },
      {
        prop: 'length',
        itemType: 'input',
        itemStyle: { 'width': '25%', 'margin': '10px 2%' },
        label: '长 (M)：',
        readonly: true
      },
      {
        prop: 'wide',
        itemType: 'input',
        itemStyle: { 'width': '25%', 'margin': '10px 2%' },
        label: '宽 (M)：',
        readonly: true
      },
      {
        prop: 'high',
        itemType: 'input',
        itemStyle: { 'width': '25%', 'margin': '10px 2%' },
        label: '高 (M)：',
        readonly: true
      }
    ]
    // 限制信息部分
    const limitDetailsData = [
      {
        itemType: 'view',
        text: '限制信息',
        style: checkstyle
      },
      {
        prop: 'amountLimit',
        itemType: 'input',
        itemStyle: { 'width': '25%', 'margin': '10px 2% 10px 0px' },
        label: '限制数量(件)：',
        readonly: true
      },
      {
        prop: 'weightLimit',
        itemType: 'input',
        itemStyle: { 'width': '25%', 'margin': '10px 2% 10px 0px' },
        label: '限制重量(KG)：',
        readonly: true
      },
      {
        prop: 'goodsLimit',
        itemType: 'input',
        itemStyle: { 'width': '25%', 'margin': '10px 2% 10px 0px' },
        label: '限制品种：',
        readonly: true
      }
    ]
    return {
      newlocationData, // 基本信息
      locationDetailsData, // 盘点明细
      limitDetailsData, // 限制信息
      formDatas: {},
      formOtions: {
        inline: true
      }
    }
  },
  created() {
    this.editList({ id: this.$route.params.id })
  },
  mounted() {},
  methods: {
    // 返回到列表页
    comeBack() {
      this.$router.push('/wms/basis-data/location-data/index')
    },
    // 点击编辑获取详情
    async editList(id) {
      const res = await locationDetail(id)
      if (!res || res.code !== 200) {
        return false
      }
      this.formDatas = res.data || {}
      this.formDatas.enable = this.formDatas.enable === 0 ? '禁用' : this.formDatas.enable === 1 ? '启用' : ''
    }
  }
}
</script>

<style lang="scss">
.details-page{
  .el-input__inner{
    border: none;
  }
  // 单号的样式
  .codeStyle{
    width: 100%;
    font-size: 16px;
    color: #3c4043;
    border-bottom: 1px solid #efefef;
    padding: 19px 0;
    margin-left: 20px;
    margin-bottom: 10px;
  }
  // 按钮样式
  .details-header{
    position: absolute;
    top: 120px;
    right: 40px;
  }
  // 库位详情样式
  .details-title{
    font-family: PingFangSC-Regular;
    font-size: 18px;
    color: #151222;
    padding: 20px;
    font-weight: 510;
    border-bottom: 1px solid #efefef;
  }
  // 盘点信息的样式
  .location-details{
    margin: 15px;
    background-color: #fff;
    padding-bottom: 200px;

    .new-add{
      padding: 0 20px;
    }

    .el-form-item{
      margin-right: 0px;
      display: inline-block;
    }
  }

}
</style>
