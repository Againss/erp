<!--
 * @Descripttion:染纱订单 原料调拨通知 数据汇总 ==>已提交
 * @version:
 * @Author: shujing
 * @Date: 2020-11-17 10:53:03
 * @LastEditors: OBKoro1
 * @LastEditTime: 2021-06-12 15:41:04
-->
<template>
  <div class="clearfix dataSummary_order">
    <div class="fr "><span>调拨总数：</span><span>{{ dataMu.subAllotQtyAll?dataMu.subAllotQtyAll+'KG':'' }} </span> </div>
    <div class="fr data-right"><span>未调拨总数：</span><span>{{ dataMu.allotQtyAll?dataMu.allotQtyAll+'KG':'' }} </span> </div>
    <div class="fr data-right"><span>配纱总数：</span><span>{{ dataMu.subSendQtyAll?dataMu.subSendQtyAll+'KG':'' }} </span> </div>
    <div class="fr data-right"><span>未配纱总数：</span><span>{{ dataMu.sendQtyAll?dataMu.sendQtyAll+'KG':'' }}</span> </div>

  </div>
</template>

<script>
export default {
  name: 'StateColumn',
  inheritAttrs: false,
  props: {
    scope: {
      type: Object
    },
    componentsOptions: {
      type: Object
    },
    editType: {
      type: String
    },
    column: {
      type: Object
    },
    formDatas: {
      type: Object
    },
    setFormDatas: {
      type: Function
    },
    value: {
      type: String
    }
  },
  data() {
    return {
      dataMu: {}
    }
  },
  computed: {
    editabled() {
      return this.scope.row.edit && this.editType === 'inline'
    },
    rules() {
      return this.column.editOptions.rules
    },
    prop() {
      return [this.scope.$index] + '.' + [this.scope.column.property]
    }
  },
  watch: {
    'formDatas.tableForm': {
      handler(data) {
        if (data) {
          const dMu = {
            subAllotQtyAll: 0,
            allotQtyAll: 0,
            subSendQtyAll: 0,
            sendQtyAll: 0
          }
          data.forEach((im) => {
            dMu.subAllotQtyAll += im.subAllotQty * 1
            dMu.subAllotQtyAll = this.$utils.getFloat(dMu.subAllotQtyAll, 2)

            dMu.allotQtyAll += im.allotQty * 1
            dMu.allotQtyAll = this.$utils.getFloat(dMu.allotQtyAll, 2)

            dMu.subSendQtyAll += im.subSendQty * 1
            dMu.subSendQtyAll = this.$utils.getFloat(dMu.subSendQtyAll, 2)

            dMu.sendQtyAll += im.sendQty * 1
            dMu.sendQtyAll = this.$utils.getFloat(dMu.sendQtyAll, 2)
            this.dataMu = dMu
          })
        } else {
          this.dataMu = {
            subAllotQtyAll: 0,
            allotQtyAll: 0,
            subSendQtyAll: 0,
            sendQtyAll: 0
          }
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.dataSummary_order{
  height: 30px;
  line-height: 30px;
  // margin-right: 20px;
  .data-right{
    margin-right: 20px;
  }
}
.success{
    border: 1px solid #2ac06d;
    padding: 2px 5px;
    color: #2ac06d;
    border-radius: 5px;
}
.danger{
    border: 1px solid #ff0000;
    padding: 2px 5px;
    color: #ff0000;
    border-radius: 5px;
}
</style>
