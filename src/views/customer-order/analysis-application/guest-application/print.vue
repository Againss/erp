<!--
 * @Descripttion:客样分析申请单-打印
 * @version:
 * @Author: shujing
 * @Date: 2020-11-19 09:39:49
 * @LastEditors: admin
 * @LastEditTime: 2021-01-07 09:44:17
-->
<template>
  <div class="print-tableout">
    <cs-print :print.sync="qrPrint" :interval="200">
      <div class="print-table"> <!--备注：此处class务必是独立全局的样式名不能重复，不能嵌套父类名，切宽高为打印纸张大小,务必设置正确！-->
        <div class="print-title">
          <h3 style="line-height: 36px;">客样分析申请单</h3>
        </div>
        <div class="print-row" style="padding: 10px 0;font-size: 14px;">
          <el-row>
            <el-col :span="8">
              <span class="word-title">申请单号：</span>
              <span class="word-value">{{ formDatas.id }}</span>
            </el-col>
            <el-col :span="8">
              <span class="word-title">申请时间：</span>
              <span class="word-value">{{ formDatas.createdTime }}</span>
            </el-col>
            <el-col :span="8">
              <span class="word-title">要求完成时间：</span>
              <span class="word-value">{{ formDatas.targetCompletedTime }}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <span class="word-title">客服：</span>
              <span class="word-value">{{ formDatas.customerService? formDatas.customerService.label : '' }}</span>
            </el-col>
            <el-col :span="8">
              <span class="word-title">销售员：</span>
              <span class="word-value">{{ formDatas.seller? formDatas.seller.label : '' }}</span>
            </el-col>
            <el-col :span="8">
              <span class="word-title">销售团队：</span>
              <span class="word-value">{{ formDatas.sellerTeam? formDatas.sellerTeam.label : '' }}</span>
            </el-col>

          </el-row>
          <el-row>
            <el-col :span="8">
              <span class="word-title">品牌商：</span>
              <span class="word-value">{{ formDatas.brand? formDatas.brand.label : '' }}</span>
            </el-col>
            <el-col :span="8">
              <span class="word-title">销售年度：</span>
              <span class="word-value">{{ formDatas.year }}</span>
            </el-col>
            <el-col :span="8">
              <span class="word-title">销售季度：</span>
              <span class="word-value">{{ formDatas.quarter }}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <span class="word-title">分析目的：</span>
              <span class="word-value">{{ formDatas.analysisTarget }}</span>
            </el-col>
            <el-col :span="8">
              <span class="word-title">是否有客样：</span>
              <span class="word-value">{{ formDatas.isExistSample === 1 ? '是' :formDatas.isExistSample === 0 ? '否' : '' }}</span>
              <!-- <span class="word-value">{{ formDatas.isExistSample }}</span> -->

            </el-col>
            <el-col :span="8">
              <span style="padding-bottom: 14px;" class="word-title">客来板编号：</span>
              <span class="word-value">{{ formDatas.sampleId }}</span>
            </el-col>
          </el-row>
        </div>
        <div class="table-form">
          <cs-custom-form :data-source="showInfoData" :options="formOtions" :form-datas="formDatas" />
        </div>
        <p style="color: #333333;font-size: 14px;line-height: 28px;word-break: break-all;" class="requiretext">{{ formDatas.requirement }}</p>
        <div class="print-paste">
          <p style="color: #BBC2D0;font-size: 12px;line-height: 0px;">布板粘贴处</p>
          <p style="color: #BBC2D0;font-size: 12px;line-height: 0px;">(贴样)</p>
        </div>
      </div>
    </cs-print>
    <div class="print-foot">
      <el-button @click="qrPrintHandle">打印</el-button>
      <el-button @click="pintBack">关闭</el-button>
    </div>
  </div>
</template>

<script>
import { applyDetail } from './api/index.js'
export default {

  components: {},
  data() {
    // 小标题样式
    const titlestyle = {
      'width': '50%',
      'font-size': '16px',
      'color': '#3c4043',
      'font-weight': 'bolder',
      'margin-top': '20px'
      // 'margin': '10px',

    }
    const showInfoData = [
      {
        itemType: 'view',
        text: '客户要求',
        style: titlestyle
      }
    ]
    return {
      tablePrint: false,
      qrPrint: false,
      formOtions: {
        inline: true
      },
      formDatas: {},
      showInfoData
      // qrOptions: {
      //   width: '210mm',
      //   height: '297mm',
      //   value: 'https://dev-erp.szhibu.com'
      // }
    }
  },
  mounted() {
    this.getDetail({ id: this.$route.query.id })
  },
  methods: {
    qrPrintHandle() {
      this.qrPrint = true
    },
    async getDetail(data = {}) {
      const res = await applyDetail({ ...data })
      this.formDatas = res.data || {}
      this.formDatas.targetCompletedTime = this.formDatas.targetCompletedTime ? this.$filters.parseTime(this.formDatas.targetCompletedTime + '', '{y}-{m}-{d} {h}:{i}') : ''
      this.formDatas.createdTime = this.formDatas.createdTime ? this.$filters.parseTime(this.formDatas.createdTime + '', '{y}-{m}-{d} {h}:{i}') : ''
      const analyArr = this.formDatas.analysisTarget && this.formDatas.analysisTarget.split('|') || []
      let analyStr = ''
      analyArr && analyArr.forEach((item, index) => {
        if (item === 'O') {
          analyStr = analyStr + '报价' + ','
        } else if (item === 'D') {
          analyStr = analyStr + '样板' + ','
        } else if (item === 'S') {
          analyStr = analyStr + '大货' + ','
        }
      })
      this.formDatas.analysisTarget = analyStr.substring(0, analyStr.lastIndexOf(','))
    },
    pintBack() {
      window.parent.close()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

<style lang="scss">

    .print-tableout{
        position: relative;
        box-sizing: border-box;
        margin:20px;
        .print-foot{
            width: 210mm;
            margin-top: 6px;
            height: 42px;
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }
    .print-table {
        position: relative;
        width: 210mm;
        overflow: hidden;
        padding: 20px;
        box-sizing: border-box;
        height: 297mm;
        background: #fff;
        //     .requiretext{
        //   color: #333333;
        //   font-size: 14px;
        //   line-height: 28px;
        //   text-indent: 30px;
        // }
        .print-row{
            .el-col{
                margin-bottom: 20px;
            }
        }
        .print-paste{

            // width: 98%;
            height: 450px;
            border: 1px dotted #BBC2D0 ;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
        }

        .print-title{
            text-align: center;
        }
        .table-form{

            .el-input--medium {
                .el-input__inner {
                    border: 0 !important;
                }
            }
        }
        .word-title{
            float: left;
            line-height: 20px;
            display: inline-block;
        }
        .word-value{
          border-bottom: 1px solid;
          padding-bottom: 6px;
          display: inline-block;
          width: 130px;
          float: right;
          margin-right: 22px;
          height: 20px;
        }
    }

</style>
