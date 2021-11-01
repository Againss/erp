<!--
 * @Author: lsl
 * @Description: 织布通知单表尾
 * @Date: 2021-07-05 14:20:27
-->
<template>
  <div>
    <div class="print_list_top2">
      <div class="print_list_c1">
        <div class="printing-center_lint">
          <div class="pring_c1">跟单员：</div>
          <div class="pring_c2">{{ dataBott.pmUserName }}</div>
        </div>
        <div class="printing-center_lint">
          <div class="pring_c1">审核人：</div>
          <div class="pring_c2">{{ dataBott.submitUserName }}</div>
        </div>
        <div class="printing-center_lint">
          <div class="pring_c1">织厂签收：</div>
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
      width: 201mm;
      font-size: 12px;
      height: 24px;
      line-height: 24px;
      margin-top: 0px;
      .print_list_c1{
        display: flex;
        .printing-center_lint{
          display: flex;
          width: 33%;

        }
      }
    }
</style>
