<!--
 * @name: 快递单号弹框流程
 * @description: 快递单号弹框流程
 * @author: panmr
 * @time: 2021-05-27 14:28:34
-->
<template>
  <div>
    <el-popover v-model="popover" placement="left-start" width="400px" trigger="click" @show="show">
      <div style="overflow: auto;height: 400px;width: 400px">
        <el-steps direction="vertical" :active="0" finish-status="finish" process-status="success">
          <el-step v-for="(activity, index) in expressProgressResps" :key="index" :title="activity.title">
            <template slot="icon">
              {{ expressProgressResps.length - index }}
            </template>
            <template slot="description">
              <div class="step-row">
                <table width="100%" border="0" cellspacing="0" cellpadding="0" class="processing_content">
                  <tr>
                    <td style="color:#98A6BE">
                      <div class="processing_content_detail"><span>{{ activity.context }}</span></div>
                      <div class="processing_content_detail"><span><i class="el-icon-time" />&nbsp;&nbsp;{{ activity.ftime }}</span></div>
                    </td>
                  </tr>
                </table>
              </div>
            </template>
          </el-step>
        </el-steps>
      </div>
      <el-link slot="reference" type="primary" :underline="false">{{ scope.row.expressNumber || '-' }}</el-link>
    </el-popover>
  </div>
</template>
<script>
import { expressProgress } from '../api/index'
export default {
  name: 'ExpressNumberProcess',
  components: {},
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
      // 0在途，1揽收，2疑难，3签收，4退签，5派件，6退回，7转单，10待清关，11清关中，12已清关，13清关异常，14收件人拒签
      states: { '0': '在途', '1': '揽收', '2': '疑难', '3': '签收', '4': '退签', '5': '派件', '6': '退回', '7': '转单', '10': '待清关', '11': '清关中', '12': '已清关', '13': '清关异常', '14': '收件人拒签' },
      expressProgressResps: [],
      state: 0,
      popover: false
    }
  },
  computed: {},
  watch: {
  },
  mounted() {
  },
  methods: {
    // 显示时触发
    show() {
      if (!this.scope.row.expressNumber) {
        this.$message({ message: '快递单号不能为空', type: 'warning' })
        this.popover = false
        return
      }
      this.load(this.scope.row.expressNumber)
    },
    // 加载数据
    async load(expressNumber = '') {
      const baseInfo = this.componentsOptions.getBaseInfo() // 获取基础信息
      const { code = 0, data = { state: '', expressProgressResps: [] }} = await expressProgress({ name: baseInfo.expressCompany && baseInfo.expressCompany.label || '', num: expressNumber })
      if (code === 200) {
        this.state = Number(data.state)
        this.expressProgressResps = data.expressProgressResps.map((n, index, arr) => (index === 0) ? { ...n, state: Number(data.state), title: this.states[data.state] } : { ...n, title: '运输中' })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.processing_content{
  background-color: #D9E5F9;
}
.processing_content_detail{
  //margin-left: 10px;
  //margin: 3.5px;
  //margin-bottom: 3.5px;
  width: 100%;
  padding: 5px;
  display:inline-block;
}
.step-row{
  //min-width:100%;
  margin-bottom:12px;
  margin-top:12px;
}
</style>
