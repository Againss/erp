<!--
 * @Author: ll
 * @Description: 色板申请单打印页尾
 * @Date: 2020-1-18
 * @LastEditors: ll
 * @LastEditTime: 2020-1-18
-->
<template>
  <div>
    <div class="print_list_top2">
      <div class="print_list_c1">
        <div class="printing-center_lint">
          <div class="pring_c1">制单：</div>
          <div class="pring_c2">{{ dataBott.createdName }}</div>
        </div>
        <div class="printing-center_lint">
          <div class="pring_c1">审批人：</div>
          <div class="pring_c2">{{ dataBott.submitName }}</div>
        </div>
        <div class="printing-center_lint">
          <div class="pring_c1">签收人：</div>
          <div class="pring_c2" />
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
      width: 210mm;
      font-size: 12px;
      margin-top: 0px;
      padding-bottom: 5px;
      .print_list_c1{
        display: flex;
        margin-top: 24px;
        margin-bottom: 14px;
        justify-content: space-around;
        .printing-center_lint{
          display: flex;
          .pring_c1{
            text-align: right;
          }
          .pring_c2{
            width: 180px;
            border-bottom:1px solid #D2D2D3;
            text-align:left;
          }
        }
      }
    }
</style>
