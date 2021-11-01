<!--
 * @Descripttion:
 * @Author: admin
 * @Date: 2021-04-26 14:06:21
 * @LastEditors: Againss
 * @LastEditTime: 2021-05-31 16:32:29
-->
<template>
  <div class="woven-tech">
    <div v-if="!componentsOptions.isFlag">
      <span><span v-if="componentsOptions.prop !== 'freightCoefficient'">￥</span> {{ scope.row[componentsOptions.prop] }}</span>
    </div>
    <!-- <div v-if="componentsOptions.priceClauseName === 'EXW'">
      <span>{{ getPrice }}</span>
    </div> -->
    <div v-if="componentsOptions.isFlag" class="infos">
      <el-tooltip placement="top" effect="dark">
        <div slot="content">
          <span v-if="componentsOptions.prop !== 'freightCoefficient'">￥</span> {{ getPrice + ' ' + getPriceTip }}
        </div>
        <div class="woven-text">
          <span v-if="componentsOptions.prop !== 'freightCoefficient'">￥</span> {{ getPrice + ' ' + getPriceTip }}
        </div>
      </el-tooltip>
      <el-tooltip v-if="getPrice" placement="top" effect="dark">
        <div slot="content">
          <p>{{ componentsOptions.text }}</p>
        </div>
        <i class="el-icon-info" />
      </el-tooltip>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    scope: {
      type: Object
    },
    componentsOptions: {
      type: Object
    }
  },
  data() {
    return {
      // otherPrice: 0
    }
  },
  computed: {
    getPrice() {
      let price = 0
      if (this.componentsOptions.prop === 'wovenTechPrice') {
        price = this.$utils.getFloat(this.scope.row[this.componentsOptions.prop] + 0.2, 2)
      } else if (this.componentsOptions.prop === 'dyeingPrice') {
        price = this.$utils.getFloat(this.scope.row[this.componentsOptions.prop] + 2, 2)
      } else if (this.componentsOptions.prop === 'printingPrice') {
        price = this.$utils.getFloat(this.scope.row[this.componentsOptions.prop] * (1 + 0.15), 2)
      } else if (this.componentsOptions.prop === 'freightCoefficient' && this.componentsOptions.priceClauseName === 'CIF') {
        if (this.componentsOptions.productCostSubtotal && this.componentsOptions.targetProfitRate || this.componentsOptions.targetProfitRate === 0) {
          // debugger
          price = this.$utils.getFloat(this.scope.row[this.componentsOptions.prop] * 2 + this.$utils.getFloat(this.$utils.getFloat(0.5 / 100 * this.componentsOptions.productCostSubtotal, 4) * (1 + this.componentsOptions.targetProfitRate / 100), 4), 4)
        } else {
          price = this.scope.row[this.componentsOptions.prop]
        }
      }
      return price
    },
    getPriceTip() {
      let priceTip = ''
      if (this.componentsOptions.prop === 'wovenTechPrice') {
        // console.log("11111");
        priceTip = `（${this.scope.row[this.componentsOptions.prop]} + 0.2）`
      } else if (this.componentsOptions.prop === 'dyeingPrice') {
        priceTip = `（${this.scope.row[this.componentsOptions.prop]} + 2） `
      } else if (this.componentsOptions.prop === 'printingPrice') {
        priceTip = `（${this.scope.row[this.componentsOptions.prop]} + ${this.$utils.getFloat(this.scope.row[this.componentsOptions.prop] * 0.15, 2)}） `
      } else if (this.componentsOptions.prop === 'freightCoefficient' && this.componentsOptions.priceClauseName === 'CIF') {
        // console.log(this.productCostSubtotal,this.totalDataList,"1314")
        if (this.componentsOptions.productCostSubtotal && this.componentsOptions.targetProfitRate || this.componentsOptions.targetProfitRate === 0) {
          const addfreightCoefficient = this.$utils.getFloat(this.$utils.getFloat(0.5 / 100 * this.componentsOptions.productCostSubtotal, 4) * (1 + this.componentsOptions.targetProfitRate / 100), 4)
          // console.log(addfreightCoefficient,this.scope.row[this.componentsOptions.prop],"1212")
          priceTip = `(${this.scope.row[this.componentsOptions.prop]} + ${this.$utils.getFloat(this.scope.row[this.componentsOptions.prop] + this.$utils.getFloat(addfreightCoefficient, 4), 4)}) `
        } else {
          priceTip = ''
        }
      }

      return this.getPrice ? priceTip : ''
    }
  }
}
</script>

<style lang="scss">
.woven-tech{
  height: 23px;
  .infos {
    display: flex;
  }
  .woven-text{
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 90%;
  }
  .el-icon-info {
    margin-left: 5px;
    line-height: 23px;
  }
}
</style>
