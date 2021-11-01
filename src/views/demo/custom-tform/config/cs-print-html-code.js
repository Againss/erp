/**
 * @Description: 配置项
 * @author Amos
 * @date 2020/9/21
 */
/* eslint-disable*/
const code = `
<div class="table">
    <div class="custom-demo-title">二维码demo:<span style="cursor: pointer;color: rgb(24, 144, 255)" @click="qrPrintHandle">点击打印试试</span></div>
    <div class="customScrollbar" style="width: 126px;height: 120px;overflow-y: auto;">
      <cs-print :print="qrPrint" :callback="qrPrintCallback" :orientation="'p'">
        <template v-for="(item) in 10">
          <div :key="item" style="padding: 10px">
            <cs-qrcode :options="qrOptions" />
          </div>
        </template>
      </cs-print>
    </div>
</div>
`
export default code