<!--
 * @Author: xj
 * @Description: 印花SO申请单打印表头
 * @Date: 2020-12-11 15:46:27
 * @LastEditors: OBKoro1
 * @LastEditTime: 2020-12-25 16:11:56
-->
<template>
  <div>
    <div class="printing-so">
      <p class="printing_sTop">印花SO申请单</p>
      <div class="printing_Link" />
    </div>
    <div class="print_list_top">
      <div class="print_list_c1">
        <div class="printing-center_lint">
          <div class="pring_c1">SO单号：</div>
          <div class="pring_c2">{{ dataArray.id }}</div>
        </div>
        <div class="printing-center_lint">
          <div class="pring_c1">交期：</div>
          <div class="pring_c2">{{ dataArray.delivery }}</div>
        </div>
      </div>
      <div class="print_list_c1">
        <div class="printing-center_lint">
          <div class="pring_c1">印花工艺：</div>
          <div class="pring_c2">{{ dataArray.printCraftName }}</div>
        </div>
        <div class="printing-center_lint">
          <div class="pring_c1">客服：</div>
          <div class="pring_c2">{{ dataArray.customerName }}</div>
        </div>
      </div>
      <div class="print_list_c1">
        <div class="printing-center_lint">
          <div class="pring_c1">成衣款式：</div>
          <div class="pring_c2">{{ getclothStyle(dataArray.clothStyle-0) }}</div>
        </div>
        <div class="printing-center_lint">
          <div class="pring_c1">印花份数：</div>
          <div class="pring_c2">{{ dataArray.printNum }}</div>
        </div>
      </div>
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
    // 处理状态数据 1男装2女装3童装4婴幼儿装
    getclothStyle(data) {
      let str = ''
      switch (data) {
        case 1:
          str = '男装'
          break
        case 2:
          str = '女装'
          break
        case 3:
          str = '童装'
          break
        case 4:
          str = '婴幼儿装'
          break
        default:
          break
      }
      return str
    }
  }
}
</script>

<style lang="scss">
    .printing-so{
      width: 174px;
      margin: 0 auto 22px;
      color: #151222;
      .printing_sTop{
        font-family: PingFangSC-Regular;
        font-size: 22px;
        color: #151222;
        text-align: center;
        padding-top:25px ;
        padding-bottom: 20px;
        margin: 0;
        border-bottom:3px solid  rgba(9,134,255,0.60);
      }
      .printing_Link{
        height: 1px;
        width: 100%;
        margin-top: 2px;
        background: rgba(9,134,255,0.60);
        border-radius: 4px;
      }
    }
    .print_list_top{
      color: #151222;
      font-size: 12px;
      margin-bottom: 27px;
      .print_list_c1{
        display: flex;
        margin-bottom: 15px;
        justify-content: space-around;
        .printing-center_lint{
          display: flex;
          .pring_c1{
            width: 80px;
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
