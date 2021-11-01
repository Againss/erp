<template>
  <div class="print-main">
    <cs-print
      :print.sync="barPrint"
      :orientation="'p'"
      :interval="500"
      :format="'a4'"
    >
      <div class="pring-cont">
        <form-title
          :options="{
            title: '收货单',
            formStyle: {
              textAlign: 'center',
              display: 'block',
              lineHeight: '55px'
            }
          }"
        />
        <!-- 打印收货单 -->
        <div class="take-order-main" />
        <pringt-take-order />
      </div>
    </cs-print>
    <div slot="footer" class="print-footer">
      <el-button type="primary" @click="barPrintHandle">打印</el-button>
      <el-button @click="comeBack()">返回</el-button>
    </div>
  </div>
</template>
<script>
import { PublicWms } from '@/views/wms/public/index'
import PringtTakeOrder from './components/print-take-order'
import FormTitle from '@/views/wms/public/components/formTitle'
export default {
  components: {
    FormTitle,
    PringtTakeOrder
  },
  mixins: [PublicWms],
  data() {
    return {
      barPrint: false
    }
  },
  methods: {
    barPrintHandle() {
      this.barPrint = true
    },
    comeBack() {
      this.$router.push('/wms/enter-manage/booking-manage')
    }
  }
}
</script>
<style lang="scss" scoped>
/* 打印 */
.print-main {
  width: 210mm;
  margin: 20px auto 0;
}
.pring-cont, .print-footer {
  width: 210mm;
  background-color: #fff;
  text-align: center;
}
.print-footer {
  padding: 20px;
}
.pring-cont {
  margin-top: 20px;
  height: 100%;
  padding: 10px;
  position: relative;
}
.print-form-item input {
  border: none;
}
.print-form-item .el-input.is-disabled .el-input__inner {
  background-color: #fff !important;
  border-color: #fff;
  color: #c0c4cc;
  cursor: default;
}
.sign-bar-wrap {
  position: relative;
  margin: 60px 0 30px;
  display: flex;
  justify-content: space-around;
}

.sign-bar-wrap .item {
  position: relative;
  display: table-cell;
  margin-right: 36px;
  font-size: 14px;
}
.sign-bar-wrap .item .span,
.input {
  display: inline-block;
}
.sign-bar-wrap .item.input {
  outline: none;
  width: 88px;
  margin-left: 10px;
  border-top: none 0;
  border-left: none 0;
  border-right: none 0;
  border-bottom: solid 1px #000;
}
.jian {
  position: absolute;
  right: 5px;
  top: 0px;
}
.sign-bar-wrap .item:last-child {
  margin-right: 0;
}
</style>
