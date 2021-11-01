/**
 * @Description: DEMO
 * @author Roman
 * @date 2020/6/18
*/
<template>
  <div class="table">
    <div class="custom-demo-title">二维码demo:<span style="cursor: pointer;color: rgb(24, 144, 255)" @click="qrPrintHandle">不能修改的pdf打印-单页打印-点击试试</span></div>
    <div class="customScrollbar" style="width: 126px;height: 120px;overflow-y: auto;">
      <cs-print :print.sync="qrPrint" :orientation="'p'" :interval="500">
        <template v-for="(item) in 10">
          <div :key="item" style="width: 120px;height: 120px;padding: 10px; "><!--  style为打印大小  一定要设置  ，此处不设置format纸张大小 根据内容大小进行打印-->
            <cs-qrcode :options="qrOptions" />
          </div>
        </template>
      </cs-print>
    </div>
    <div class="custom-demo-title">一维码demo:<span style="cursor: pointer;color: rgb(24, 144, 255)" @click="barPrintHandle">不能修改的pdf打印-满页裁剪打印-点击试试</span></div>
    <div class="customScrollbar" style="width: 126px;height: 120px;overflow-y: auto;">
      <cs-print :print.sync="barPrint" :orientation="'p'" :interval="200" :format="'a4'" :pop-options="printPopOptions">
        <template v-slot:header>
          <div style="text-align: center;width:120px; padding: 10px;">我是表头</div>
        </template>
        <div style="width:120px;text-align: center;padding: 10px;"><!-- width为内容打印大小  一定要设置 ，此处设置format纸张为a4 会根据内容超出纸张高度自动分页-->
          <template v-for="(item) in 20">
            <cs-barcode :key="item" :options="{ value: item+100 }" />
          </template>
        </div>
        <template v-slot:footer>
          <div style="text-align: right;width:120px;padding: 10px;font-size: 12px">我是表尾</div>
        </template>
      </cs-print>
    </div>
    <div class="custom-demo-title">二维码demo:<span style="cursor: pointer;color: rgb(24, 144, 255)" @click="printto">可以修改的pdf打印-点击试试</span></div>
    <div class="customScrollbar" style="width: 126px;height: 120px;overflow-y: auto;">
      <cs-printjs :print.sync="printjs" :options="printOptions">
        <div id="csPrint">
          <template v-for="(item) in 10">
            <div :key="item" style="width: 120px;height: 120px;padding: 10px; "><!--  style为打印大小  一定要设置  ，此处不设置format纸张大小 根据内容大小进行打印-->
              <cs-qrcode :options="qrOptions" />
            </div>
          </template>
        </div>
      </cs-printjs>
    </div>
  </div>
</template>

<script>

export default {
  components: {},
  data() {
    const printPopOptions = { drag: true, ok: (url) => { console.log(url) } }
    return {
      printPopOptions,
      barPrint: false,
      qrPrint: false,
      printjs: false,
      barOptions: { value: '123456' },
      // printOptions: { printable: 'csPrint', type: 'html' }, 多种调用方法 具体查看组件内的调用说明
      printOptions: {},
      qrOptions: { width: 100, height: 100, value: 'https://dev-erp.szhibu.com' }
    }
  },
  mounted() {
  },
  methods: {
    printto() {
      this.printjs = true
    },
    qrPrintHandle() {
      this.qrPrint = true
    },
    barPrintHandle() {
      this.barPrint = true
    }
  }
}
</script>

<style lang="scss" scoped>
    .table{ padding-bottom: 10px;}
    .custom-demo-title{ font-size: 16px; padding: 10px; font-weight: bold; padding: 10px}
</style>
