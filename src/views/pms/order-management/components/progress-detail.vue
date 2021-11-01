<template>
  <div id="ProgressDetail">
    <el-row :gutter="20" class="normal">
      <el-col :span="6">采购订单号：</el-col>
      <el-col :span="6">{{ msg.purchaseOrderNumber }}</el-col>
      <el-col :span="7" class="">开单重量(KG)：</el-col>
      <el-col :span="5">{{ msg.drawWeight }}</el-col>
    </el-row>
    <el-row :gutter="20" class="normal">
      <el-col :span="6">纱线编码：</el-col>
      <el-col :span="6">{{ msg.materiel }}</el-col>
      <!-- <el-col :span="7">入库重量(KG)：</el-col>
      <el-col :span="5">1</el-col> -->
    </el-row>
    <el-row :gutter="20" class="spe" style="min-height: 30px">
      <div class="label">关联送货单：</div>
      <template v-for="(i, index) in msg.deliveryNoteList">
        <el-col
          :key="index"
          :span="12"
          class="content"
        ><span @click="go(i.id)">{{ i.deliveryNumber }}</span></el-col>
      </template>
    </el-row>
  </div>
</template>

<script>
import * as api from '../api/index.js'
export default {
  name: 'ProgressDetail',
  data() {
    return {
      id: undefined,
      msg: {}
    }
  },
  created() {
    this.id = this.$attrs.options.componentsOptions.id
    this.getProgress()
  },
  methods: {
    go(id) {
      this.$router.push({
        path: '/pms/delivery-note/detail/',
        query: { id: id, pageType: 'detail' }
      })
    },
    async getProgress() {
      const res = await api.billProgress(this.id)
      if (res.code === 200) {
        this.msg = res.data || {}
      }
    }
  }
}
</script>
<style lang="scss" scoped>
#ProgressDetail {
  font-size: 14px;
  .el-row {
    line-height: 28px;
  }
  .el-col {
    line-height: 28px;
  }
  .normal {
    :nth-child(odd) {
      color: #888e9e;
      text-align: right;
    }
    :nth-child(even) {
      color: #474747;
    }
  }
  .spe {
    position: relative;
    .label {
      left: 31px;
      color: #888e9e;
      position: absolute;
    }
    .el-col:nth-child(even) {
      text-align: right;
    }
    .content {
      color: #0986ff;
      span {
        cursor: pointer;
      }
    }
  }
}
</style>
