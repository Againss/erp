<template>
  <div class="product-list-ipad-fixed">
    <topNavBar v-if="isFixed" title="智布成品验布录入系统" :back-icon="true" />

    <div class="product-list-main-ipad">
      <div class="box-wrap">
        <div class="title">验算结果计算规则</div>
        <div class="sub-title">验布结果（整缸）</div>
        <p class="text">结果=A/B/C，通过如下三个条件判定</p>
        <p class="text">
          1、产品信息（实际平均布封/实际平均克重/实际平均含潮率）不合格为C<br>
          2、整缸记录按照ABC取最低值<br>
          3、当前缸所有匹的（平均分100码）之和除以验布总匹数得出分数对应等级【（A：{{ '&#60;' }}25）,(B：{{ '&#62;' }}=25{{ '&#60;' }}34)，（C：{{ '&#62;' }}=34）】
        </p>
        <div class="sub-title" style="margin-top: 20px;">验布结果（单匹）</div>
        <p class="text">结果=A/B/C，通过如下三个条件判定</p>
        <p class="text">
          1、布匹信息只要有一项不合格为C。<br>
          2、疵点信息ABC取最低值。<br>
          3、平均分100码=总分/实码/实封(")*3600，计算后显示数字，【（A：平均分100码{{ '&#60;' }}29）,(B：平均分100码{{ '&#62;' }}=29{{ '&#60;' }}40)，（C：平均分100码{{ '&#62;' }}=40）】
        </p>
        <p class="text" style="color: #151222;margin-top: 30px;">
          总分=疵点四分项扣分之和<br>
          实码（实测码长）=重量(KG)/0.000824/回后克重/边封(")*16<br>
          重量1千克 = 2.20462262185 磅（LB）<br>
          重量1磅 = 0.45359237 千克（KG）<br>
        </p>
      </div>
    </div>

  </div>
</template>
<script>
import topNavBar from '../public/components/topNavBar.vue'
export default {
  name: 'Additional',
  components: { topNavBar },
  data() {
    return {
      isFixed: true

    }
  },
  created() {

  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
  .product-list-ipad-fixed{
    // position: fixed;
    // right: 0;
    // top: 0;
    // bottom: 0;
    // left: 0;
    background-color: #eef5f9;
    z-index:2000;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    .product-list-main-ipad{
      padding: 20px;
      box-sizing: border-box;
      height: calc(100% - 50px);
      overflow-y: auto;

    }
    .box-wrap{
      padding: 20px;
      padding-top: 0;
       background-color: #FFFFFF;
       .title{
         height: 57px;
         line-height: 57px;
         width: 100%;
         border-bottom: 1px solid #EEEFF0;
         font-size: 16px;
         color: #151222;
         margin-bottom: 20px;
       }
       .sub-title{
         font-size: 14px;
         color: #151222;
         font-weight: 600;
       }
       .text{
         font-size: 14px;
         color: #474747;
         font-weight: 400;
         line-height: 30px;
       }
    }

  }

</style>
