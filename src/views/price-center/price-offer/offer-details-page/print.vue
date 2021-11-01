<!--
 * @Date: 2021-05-19 14:22:37
 * @Author: Againss
 * @LastEditTime: 2021-05-20 17:29:10
 * @LastEditors: Againss
 * @Descripttion:
-->
<template>
  <div style="background: #fff;width: 1300px;margin: 0 auto;">
    <table cellspacing="0" cellpadding="0" border="1">
      <tr style="width:1300px;">
        <td style="padding: 3px;line-height:20px;text-align: center;font-size: 14px;">报价日期</td>
        <td style="padding: 3px;line-height:20px;text-align: center;font-size: 14px;">有效日期</td>
        <td style="padding: 3px;line-height:20px;text-align: center;font-size: 14px;">客户</td>
        <td style="padding: 3px;line-height:20px;text-align: center;font-size: 14px;">品牌</td>
        <td style="padding: 3px;line-height:20px;text-align: center;font-size: 14px;">产品名称</td>
        <td v-if="checkList.includes('yarnName')" style="padding: 3px;line-height:20px;text-align: center;font-size: 14px;">纱名</td>
        <td style="padding: 3px;line-height:20px;text-align: center;font-size: 14px;">成份</td>
        <td style="padding: 3px;line-height:20px;text-align: center;font-size: 14px;">幅宽(寸)</td>
        <td style="padding: 3px;line-height:20px;text-align: center;font-size: 14px;">克重(g/m²)</td>
        <td style="padding: 3px;line-height:20px;text-align: center;font-size: 14px;">颜色</td>
        <td style="padding: 3px;line-height:20px;text-align: center;font-size: 14px;">MOQ(KG)</td>
        <td style="padding: 3px;line-height:20px;text-align: center;font-size: 14px;">MCQ(KG)</td>
        <td v-if="checkList.includes('processRequirements')" style="padding: 3px;line-height:20px;text-align: center;font-size: 14px;">工艺要求</td>
        <td style="padding: 3px;line-height:20px;text-align: center;font-size: 14px;">单价(含税元/公斤)</td>
        <td style="padding: 3px;line-height:20px;text-align: center;font-size: 14px;">备注</td>
      </tr>
      <tr v-for="(item,index) in sourceData" :key="index">
        <td v-if="index===0" :rowspan="sourceData.length" style="padding: 3px;line-height:20px;text-align: center;font-size: 14px;">{{ item.quotationDate ||'-' }}</td>
        <td v-if="index===0" :rowspan="sourceData.length" style="padding: 3px;line-height:20px;text-align: center;font-size: 14px;">{{ item.quotationValidityDate }}</td>
        <td v-if="index===0" :rowspan="sourceData.length" style="padding: 3px;line-height:20px;text-align: center;font-size: 14px;">{{ item.customerName }}</td>
        <td v-if="index===0" :rowspan="sourceData.length" style="padding: 3px;line-height:20px;text-align: center;font-size: 14px;">{{ item.brandName }}</td>
        <td style="padding: 3px;line-height:20px;text-align: center;font-size: 14px;">{{ item.fabricName }}</td>
        <td v-if="checkList.includes('yarnName')" style="padding: 3px;line-height:20px;text-align: center;font-size: 14px;" v-html="item.shaming" />
        <td style="padding: 3px;line-height:20px;text-align: center;font-size: 14px;" v-html="item.compositionName" />
        <td style="padding: 3px;line-height:20px;text-align: center;font-size: 14px;">{{ item.clothWidth }}</td>
        <td style="padding: 3px;line-height:20px;text-align: center;font-size: 14px;">{{ item.weightPerSquare }}</td>
        <td style="padding: 3px;line-height:20px;text-align: center;font-size: 14px;">{{ item.color }}</td>
        <td style="padding: 3px;line-height:20px;text-align: center;font-size: 14px;">{{ item.moq }}</td>
        <td style="padding: 3px;line-height:20px;text-align: center;font-size: 14px;">{{ item.mcq }}</td>
        <td v-if="checkList.includes('processRequirements')" style="padding: 3px;line-height:20px;text-align: center;font-size: 14px;" v-html="item.testRequirement()" />
        <td style="padding: 3px;line-height:20px;text-align: center;font-size: 14px;">{{ item.salePrice }}</td>
        <td style="padding: 3px;line-height:20px;text-align: center;font-size: 14px;">{{ item.remark }}</td>
      </tr>
    </table>

  </div>
</template>

<script>
export default {
  props: {
    quoteFormDatas: {
      type: Array,
      default: () => {
        return []
      }
    },
    checkList: {
      type: String
    }
  },
  computed: {
    sourceData() {
      return this.quoteFormDatas.map(item => {
        const obj = {
          ...item,
          shaming: item.yarnList && item.yarnList.reduce((str, v) => {
            // 短纤 纱支+成分+比例+纱类+梳棉方法+纺纱方法
            if (v.yarnType === 'S') {
              str += `<p >${v.yarnsBranchName || ''} ${v.compositionName || ''} ${v.compositionProportionName || ''} ${v.yarnsTypeName || ''}  ${v.cardingMethodName || ''} ${v.spinMethodName || ''}</p>`
            } else {
              // 长丝 细度+成份+品名
              str += `<p >${v.finenessName || ''} ${v.compositionName || ''} ${v.goodsName || ''}</p>`
            }
            return str
          }, '') || '',
          compositionName: item.yarnList && item.yarnList.reduce((str, v) => {
            str += `<p >${v.compositionName}</p>`
            return str
          }, '') || '',
          testRequirement() {
            let str = ''
            const s = item
            const rs = { 'W': '水洗', 'B': '漂白', 'H': '半漂', 'D': '染色' }
            const dyeingProcess = s.dyeingTechList && s.dyeingTechList.length > 0 ? s.dyeingTechList : []
            const afterfinishLossList = s.afterfinishLossList && s.afterfinishLossList.length > 0 ? s.afterfinishLossList : []
            const functionLossList = s.functionLossList && s.functionLossList.length > 0 ? s.functionLossList : []
            const majorPrintingTechList = s.majorPrintingTechList && s.majorPrintingTechList.length > 0 ? s.majorPrintingTechList : []
            dyeingProcess.forEach(v => {
              str += rs[v.dyeingProcess] + ';'
            })
            str += '<p style="margin: 0;"></p>'
            afterfinishLossList.forEach(v => {
              str += v.afterfinishTechName + ';'
            })
            functionLossList.forEach(v => {
              str += v.functionName + ';'
            })
            str += '<p style="margin: 0;"></p>'
            majorPrintingTechList.forEach(v => {
              v.minorPrintingTechList && v.minorPrintingTechList.forEach(e => {
                str += e.printingName + ';'
              })
            })
            return str
          },
          quotationDate: item.quotationDate && this.$filters.parseTime(item.quotationDate, '{y}-{m}-{d}') || '',
          quotationValidityDate: item.quotationValidityDate && this.$filters.parseTime(item.quotationValidityDate, '{y}-{m}-{d}') || ''
        }
        return obj
      })
    }
  }
}
</script>

<style>

</style>
