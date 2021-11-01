<!--
 * @Author: xj
 * @Description: 客样分析打印界面页尾
 * @Date: 2020-12-11 15:46:27
 * @LastEditors: OBKoro1
 * @LastEditTime: 2021-01-07 15:18:32
-->
<template>
  <div>
    <div class="print_list_top2">
      <div class="print_list_c1">
        <div class="printing-center_lint">
          <div class="pring_c1">工艺员：</div>
          <div class="pring_c2">{{ dataBott.analyseBy }}</div>
        </div>
        <div class="printing-center_lint">
          <div class="pring_c1">申请人：</div>
          <div class="pring_c2">{{ dataBott.createdBy }}</div>
        </div>
        <div class="printing-center_lint">
          <div class="pring_c1">审核时间：</div>
          <div class="pring_c2">{{ dataBott.auditTime?$filters.parseTime(dataBott.auditTime || 0,'{y}-{m}-{d} {h}:{i}'):"" }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    dataBott: {
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
    .print_list_top2{
      color: #151222;
      font-family: PingFangSC-Medium;
      width: 201mm;
      font-size: 12px;
      height: 24px;
      line-height: 24px;
      margin-top: 0px;
      .print_list_c1{
        display: flex;
        // margin-top: 24px;
        // margin-bottom: 14px;
        // justify-content: space-around;
        .printing-center_lint{
          display: flex;
          margin-left: 17px;
          .pring_c1{
            text-align: right;
          }
          .pring_c2{
            width: 160px;
            // border-bottom:1px solid #D2D2D3;
            text-align:left;
          }
        }
      }
    }
</style>
