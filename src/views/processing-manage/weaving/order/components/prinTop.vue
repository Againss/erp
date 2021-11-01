<!--
 * @Author: lsl
 * @Description: 织布通知单表头
 * @Date: 2021-07-05 14:20:27
-->
<template>
  <div class="weave_top_print">
    <!-- 申请单号： -->
    <div class="ct c1">
      <div> 申请单号：</div>
      <div>{{ dataArray.sampleAnalysisApply&&dataArray.sampleAnalysisApply.id?dataArray.sampleAnalysisApply.id:"" }}</div>
    </div>
    <!-- 分析编号： -->
    <div class="ct c2">
      <div>分析编号：</div>
      <div>{{ dataArray.sampleAnalysisApply&&dataArray.sampleAnalysisApply.analysisId?dataArray.sampleAnalysisApply.analysisId:"" }}</div>
    </div>
    <!-- 申请时间： -->
    <div class="ct c3">
      <div>申请时间：</div>
      <div>{{ dataArray.sampleAnalysisApply&&dataArray.sampleAnalysisApply.submitTime?$filters.parseTime(dataArray.sampleAnalysisApply.submitTime,'{y}-{m}-{d} {h}:{i}'):"" }} </div>
    </div>
    <!-- 要求完成时间： -->
    <div class="ct c4">
      <div>要求完成时间：</div>
      <div>{{ dataArray.sampleAnalysisApply && dataArray.sampleAnalysisApply.targetCompletedTime?$filters.parseTime(dataArray.sampleAnalysisApply.targetCompletedTime,'{y}-{m}-{d} {h}:{i}'):'' }}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    dataArray: {
      type: Object,
      default: () => { return {} }
    }
  },
  data() {
    return {
      a: 1
    }
  },
  created() {

  },
  methods: {
  }
}
</script>

<style lang="scss">
 .weave_top_print{
   background: #FFFFFF;
   border: 1px solid #D2D2D3;
   height: 26px;
   font-size: 12px;
   display: flex;
   width: 100%;
   .ct{
    display: flex;
    align-items: center;
    padding: 0 4px 0 6px;
   }
  .c1,.c2{width: 28%;}
  .c1,.c2,.c3{border-right:1px solid #D2D2D3;}
  .c3{
    width: 15%;
    min-width: 150px;
  }
  .c3,.c4{width: 21%; min-width: 200px;}
 }

</style>
